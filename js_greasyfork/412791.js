/*!
* test
* (c) 2020 lincong1987
*/

// ==UserScript==
// @name        所有网站启用画中画 OPEN PIP IN ALL SITE
// @namespace   Violentmonkey Scripts
// @match       <all_urls>
// @grant       none
// @version     1.3
// @author      lincong1987
// @description 2020/10/10 下午3:21:48
// @require https://unpkg.com/jquery@3.5.1/dist/jquery.js
// @require https://unpkg.com/vue@2.6.10/dist/vue.js
// @downloadURL https://update.greasyfork.org/scripts/412791/%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%90%AF%E7%94%A8%E7%94%BB%E4%B8%AD%E7%94%BB%20OPEN%20PIP%20IN%20ALL%20SITE.user.js
// @updateURL https://update.greasyfork.org/scripts/412791/%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%90%AF%E7%94%A8%E7%94%BB%E4%B8%AD%E7%94%BB%20OPEN%20PIP%20IN%20ALL%20SITE.meta.js
// ==/UserScript==
(function ($) {

  var appendToolbar = function ($video) {

    var width = $video.width()
    var position = $video.css('position')
    var parent_position = $video.parent().css('position')
    var parent_display = $video.parent().css('display')

    var $toolbar = $(`
          <div  class='us_pip_toolbar'>
            <button type='button' class="us_pip_toolbar__button" title='点击打开画中画'>PIP画中画</button>
          </div>
        `).data('video', $video)

    $video.after($toolbar)

    if (position === 'absolute' || position === 'fixed' || parent_position ===
      'relative' || parent_display === 'flex') {
      $toolbar.addClass('us_pip_toolbar__absolute')
    } else {
      $toolbar.width(width).addClass('us_pip_toolbar__static')
    }

    $toolbar.on('click', 'button', function () {

      $video.get(0).requestPictureInPicture()

    })
  }

  var doFuck = function () {

    var $videos = $('video')

    $videos.each(function () {

      var $this = $(this)

      var isFucked = $this.data('isFucked')

      if (isFucked === true) {
        return
      } else {
        $this.data('isFucked', true)
        appendToolbar($this)
      }

    })

    setTimeout(function () {

      doFuck()

    }, 5 * 1000)

  }

  doFuck()

  $('head').append(`<style>

      .us_pip_toolbar {
          
  
          box-sizing: border-box;
      }

      .us_pip_toolbar__absolute {
        
          position: absolute;
          top: -28px;
          left: 0;
          z-index: 99999999;
      
      }

      .us_pip_toolbar__static {
          border: 1px solid #ccc;
          background: #dadada;
          padding: 4px;
          font-size: 0;
      }

      .us_pip_toolbar .us_pip_toolbar__button {
          display: inline-block;
          padding: 0px 5px;
          font-size: 12px;
          line-height: 28px;
          height: 28px;
          text-align: center;
          cursor: pointer;
          background: none;
          border: 1px solid;
          border-radius: 3px;
          color: #fff;
          background-color: #0084ff;
          border-color: #0084ff;
          font-family: sans-serif;
          font-weight: bold;
          opacity: 0.8;
      }

      .us_pip_toolbar .us_pip_toolbar__button:hover {
          translate: all 0.8s;
          opacity: 1;
      }

      .body_us_pip_toolbar {
          position: fixed;
          bottom: 10px;
          left: 10px;
          z-index: 99999999;
          max-height: 500px;
          overflow: auto;
      }

      .body_us_pip_toolbar .body_us_pip_item {
          height: 72px;
          width: 128px;
          background-size: cover;
          margin-bottom: 8px;
          
          position: relative;
      }

      .body_us_pip_toolbar .body_us_pip_item .us_pip_toolbar__button__open {
          height: 72px;
          width: 128px;
          background: center center no-repeat url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMzM2MTIwNzczIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1NDUiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAwQzIyOS4yNzYwOTggMCAwIDIyOS4yNzYwOTggMCA1MTJTMjI5LjI3NjA5OCAxMDI0IDUxMiAxMDI0czUxMi0yMjkuMjc2MDk4IDUxMi01MTJTNzk0LjcyMzkwMiAwIDUxMiAweiBtMjAxLjcwMzAyNCA1MzYuNTc2TDQzMy4zNzY3OCA3NjAuODU2OTc2Yy01LjY5NDQzOSA0LjU5NTUxMi0xMi42ODc2MSA2Ljg5MzI2OC0xOS42ODA3OCA2Ljg5MzI2OC00LjU5NTUxMiAwLTkuMjkwOTI3LTAuOTk5MDI0LTEzLjY4NjYzNC0zLjA5Njk3NkMzODkuMTIgNzU5LjM1ODQzOSAzODIuMTI2ODI5IDc0OC4zNjkxNzEgMzgyLjEyNjgyOSA3MzYuMjgwOTc2VjI4Ny44MTg5MjdjMC0xMi4wODgxOTUgNi45OTMxNzEtMjMuMTc3MzY2IDE3Ljg4MjUzNy0yOC4zNzIyOTMgMTAuODg5MzY2LTUuMjk0ODI5IDIzLjg3NjY4My0zLjc5NjI5MyAzMy4zNjc0MTQgMy43OTYyOTNsMjgwLjIyNjM0MiAyMjQuMTgxMDczYzcuNDkyNjgzIDUuOTk0MTQ2IDExLjc4ODQ4OCAxNS4wODUyNjggMTEuNzg4NDg4IDI0LjU3NiAwLjA5OTkwMiA5LjU5MDYzNC00LjE5NTkwMiAxOC42ODE3NTYtMTEuNjg4NTg2IDI0LjU3NnoiIHAtaWQ9IjM1NDYiIGZpbGw9IiNlZWVlZWUiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkxNCIgY2xhc3M9InNlbGVjdGVkIj48L3BhdGg+PC9zdmc+');
          color: #fff;
          position: absolute;
          text-indent: -999999em;
          overflow: hidden;
          border: none 0;
          cursor: pointer;
      
      }

      .body_us_pip_toolbar .body_us_pip_item .us_pip_toolbar__button__open:hover {
          background: center center no-repeat url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAyMzM2MTIwNzczIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1NDUiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAwQzIyOS4yNzYwOTggMCAwIDIyOS4yNzYwOTggMCA1MTJTMjI5LjI3NjA5OCAxMDI0IDUxMiAxMDI0czUxMi0yMjkuMjc2MDk4IDUxMi01MTJTNzk0LjcyMzkwMiAwIDUxMiAweiBtMjAxLjcwMzAyNCA1MzYuNTc2TDQzMy4zNzY3OCA3NjAuODU2OTc2Yy01LjY5NDQzOSA0LjU5NTUxMi0xMi42ODc2MSA2Ljg5MzI2OC0xOS42ODA3OCA2Ljg5MzI2OC00LjU5NTUxMiAwLTkuMjkwOTI3LTAuOTk5MDI0LTEzLjY4NjYzNC0zLjA5Njk3NkMzODkuMTIgNzU5LjM1ODQzOSAzODIuMTI2ODI5IDc0OC4zNjkxNzEgMzgyLjEyNjgyOSA3MzYuMjgwOTc2VjI4Ny44MTg5MjdjMC0xMi4wODgxOTUgNi45OTMxNzEtMjMuMTc3MzY2IDE3Ljg4MjUzNy0yOC4zNzIyOTMgMTAuODg5MzY2LTUuMjk0ODI5IDIzLjg3NjY4My0zLjc5NjI5MyAzMy4zNjc0MTQgMy43OTYyOTNsMjgwLjIyNjM0MiAyMjQuMTgxMDczYzcuNDkyNjgzIDUuOTk0MTQ2IDExLjc4ODQ4OCAxNS4wODUyNjggMTEuNzg4NDg4IDI0LjU3NiAwLjA5OTkwMiA5LjU5MDYzNC00LjE5NTkwMiAxOC42ODE3NTYtMTEuNjg4NTg2IDI0LjU3NnoiIHAtaWQ9IjM1NDYiIGZpbGw9IiNlYjczNTAiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkxNCIgY2xhc3M9InNlbGVjdGVkIj48L3BhdGg+PC9zdmc+');
          
      }

      .body_us_pip_toolbar .body_us_pip_item .us_pip_toolbar__button__open:before {
     
          
      }



      <style>`)

  var $bodyToolbar = $(`
          <div  class='body_us_pip_toolbar' id='body_us_pip_toolbar'>
            
          </div>
        `)

  var init = function () {

    $('body').append($bodyToolbar)

    new Vue({

      el: '#body_us_pip_toolbar',

      template: `

		  <div class='body_us_pip_toolbar' id='body_us_pip_toolbar'>


			  <div v-for='(item, i) in list' class='body_us_pip_item'
			       :style="getStyle(item)">

				  <button type='button' class="us_pip_toolbar__button__open"
				          @click='open($event, item, i)' title='画中画播放'>
				  </button>
			  </div>
		  </div>

      `,

      data () {

        return {
          list: [],

        }
      },

      methods: {

          capture (video) {
          
          
           var eventTester = function(e){
            video.addEventListener(e,function(){
              console.log((new Date()).getTime(),e)
            },false);
          }

          // eventTester("loadstart"); //客户端开始请求数据
          // eventTester("progress"); //客户端正在请求数据
          // eventTester("suspend"); //延迟下载
          // eventTester("abort"); //客户端主动终止下载（不是因为错误引起）
          // eventTester("loadstart"); //客户端开始请求数据
          // eventTester("progress"); //客户端正在请求数据
          // eventTester("suspend"); //延迟下载
          // eventTester("abort"); //客户端主动终止下载（不是因为错误引起），
          // eventTester("error"); //请求数据时遇到错误
          // eventTester("stalled"); //网速失速
          // eventTester("play"); //play()和autoplay开始播放时触发
          // eventTester("pause"); //pause()触发
          // eventTester("loadedmetadata"); //成功获取资源长度
          // eventTester("loadeddata"); //
          // eventTester("waiting"); //等待数据，并非错误
          // eventTester("playing"); //开始回放
          // eventTester("canplay"); //可以播放，但中途可能因为加载而暂停
          // eventTester("canplaythrough"); //可以播放，歌曲全部加载完毕
          // eventTester("seeking"); //寻找中
          // eventTester("seeked"); //寻找完毕
          // eventTester("timeupdate"); //播放时间改变
          // eventTester("ended"); //播放结束
          // eventTester("ratechange"); //播放速率改变
          // eventTester("durationchange"); //资源长度改变
          // eventTester("volumechange"); //音量改变


         // return new Promise((resolve, reject) => {

            var canvas = document.createElement('canvas')
            video.crossorigin='anonymous'
            
            
            //setTimeout(()=>{
              
             // video.addEventListener('canplay', (e) => {

                canvas.width = video.videoWidth * 0.25
                canvas.height = video.videoHeight * 0.25
                canvas.getContext('2d').
                  drawImage(video, 0, 0, canvas.width, canvas.height)
                var src = ''
                try {
                  src = canvas.toDataURL('image/png');
                  //resolve(src)

                } catch (e) {
                  console.log(e)
                //  reject('')
                }
return src

             // })
              
            //}, 1000)
            
            
         // })

        },

        collect () {
          var me = this

          clearTimeout(this.$timer)

          var $videos = $('video')

          $videos.each(function () {

            var $this = $(this)
            var vedio = $this.get(0)

            var fuckedId = $this.data('fuckedId')

            if (!fuckedId) {

              if (vedio.paused === false) {
                fuckedId = new Date().getTime()

                $this.data('fuckedId', fuckedId).attr('fuckfuckfuck', fuckedId)
                me.list.push({
                  fuckedId: fuckedId, //src: me.capture(vedio)
                })
              }

            }

          })

          this.$timer = setTimeout(() => {

            this.collect()

          }, 5 * 1000)

        },
        open (e, item, i) {

          var videos = document.getElementsByTagName('video')

          for (var i = 0; i <= videos.length - 1; i++) {

            if ($(videos[i]).data('fuckedId') === item.fuckedId) {
              try {videos[i].requestPictureInPicture()} catch (e) {}
              break
            }

          }

        },
        remove (e, item, i) {},

        getHeight () {

        },

          getStyle (item) {

          var style = {}

          var src =   this.capture(
            $('video[fuckfuckfuck=\'' + item.fuckedId + '\']').get(0))

          this.$nextTick(() => {

            item.src = src

          })

          if (src === '') {
            style.backgroundColor = 'blue'
          } else {
            style.backgroundImage = `url(${src})`
          }

          return style

        },
      },

      mounted () {

        this.$timer = 0
        this.collect()

        $('body').on('scroll', () => {
          this.collect()
        })

      },

    })

  }

  setTimeout(function () {
    init()
  }, 1000)

})($.noConflict(true))