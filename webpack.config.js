const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDev = process.env.NODE_ENV === 'development'

config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  resolve: {  
      /* 
       * Vue v2.x之后NPM Package默认设置只会生成runtime-only 版本，若要使用standalone功能則需如下设置 
       * 否则会报错：Failed to mount component: template or render function not defined. 
       */  
      alias: {  
      vue: 'vue/dist/vue.js'  
    },  
    extensions: ['.js', '.vue']  
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader',
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name]-00.[ext]'
            }
          }
        ]
      }
    ]
  }
}

if(isDev){
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8088,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = config
