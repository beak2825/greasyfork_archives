// ==UserScript==
// @name               Bilibili Mobile Lite
// @name:zh-CN         bilibili 移动端 Lite
// @namespace          https://github.com/jk278/bilibili-mobile-lite
// @version            3.0.1
// @description        view bilibili mobile page recommended video directly
// @description:zh-CN  b 站移动端网页推荐视频直接看
// @author             jk278
// @match              https://m.bilibili.com/*
// @grant              none
// @run-at             document-start
// @icon               https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/468246/bilibili%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/468246/bilibili%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%20Lite.meta.js
// ==/UserScript==

(function () {
  'use strict'
  console.log('Bilibili mobile execute!')

  removeAdButton()

  const pathname = window.location.pathname

  if (pathname.startsWith('/video')) {
    customElementStyle()
  }

  waitDOMContentLoaded(() => {
    if (pathname.startsWith('/video')) {
      autoplay()
      preventAutoCallApp()
      removeFullscreenAd()
    } else if (pathname === '/' || pathname === '') {
      runHome()
    }
  })

  // DOM 加载完后
  function waitDOMContentLoaded(callback) {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', callback) : callback()
  }

  // 阻止点击视频区跳转APP
  function preventAutoCallApp() {
    const autoCallApp = document.querySelector('.mplayer-display-call-app')
    autoCallApp.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopImmediatePropagation()
    })

    const playButton = document.querySelector('.mplayer-pause-call-app')
    playButton.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopImmediatePropagation()
    })
  }

  // 全屏后，全屏广告元素样式变为 flex !important
  function removeFullscreenAd() {
    document.addEventListener('fullscreenchange', function () {
      const adBanner = document.querySelector('.mplayer-widescreen-callapp')
      const qualityBtn = document.querySelector('.mplayer-control-btn-quality')
      const text = document.querySelector('.mplayer-comment-text')

      adBanner.style.cssText = 'display: none !important;'
      qualityBtn.style.cssText = 'display: none !important;'
      text.style.cssText = 'display: none !important;'

      const commentContent = document.querySelector('.mplayer-btn-comment-content')
      commentContent.style.cssText = 'position: absolute; left: 11px; width: 24px !important;'
    })
  }

  function removeAdButton() {
    const adSelector1 = '.home-float-openapp, .open-app, .m-nav-openapp, .m-float-openapp, [class^="m-video2-awaken-btn"]'
    const adSelector2 = '.openapp-dialog, .caution-dialog, .v-dialog'
    const style = document.createElement('style')
    style.textContent = `${adSelector1}, ${adSelector2}{ display: none !important; }`

    document.head ? document.head.appendChild(style) : waitDOMContentLoaded(() => document.head.appendChild(style))
  }

  function goToVideoById(keyword, callback) {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 100000)}`

    window[callbackName] = function (responseData) {
      if (responseData.data.result[11].data[0]) {
        const bvId = responseData.data.result[11].data[0].bvid
        callback(bvId, null)
      } else {
        callback(null, 'BVId not found')
      }
      delete window[callbackName]
    }

    const script = document.createElement('script')
    script.src = `https://api.bilibili.com/x/web-interface/search/all/v2?page=1&keyword=${keyword}&jsonp=jsonp&callback=${callbackName}`
    document.body.appendChild(script)
  }

  // 自动播放
  function autoplay() {
    const play = document.querySelector('.main-cover')

    const style = document.createElement('style')
    style.textContent = '.m-navbar + div { display: block !important }'
    document.head.appendChild(style)

    if (play) {
      const video = document.querySelector('video')
      if (video) {
        video.addEventListener('play', function () {
          if (video.muted === true) createUnmuteButton()
        }, { once: true })

        const startPlayPromise = video.play()

        if (startPlayPromise !== undefined) {
          startPlayPromise
            .catch((error) => {
              if (error.name === 'NotAllowedError') {
                video.muted = true
                video.play()
              }
            })
        }

        function createUnmuteButton() {
          if (document.getElementById('unmuteButton')) return

          const button = document.createElement('button')
          button.classList.add('unmute')
          button.innerHTML = `
<div class="unmute-inner">
    <div class="unmute-icon"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <use class="svg-shadow" xlink:href="#ytp-id-1"></use>
            <path class="ytp-svg-fill"
                d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z"
                id="id-1"></path>
        </svg></div>
    <div class="unmute-text">点按取消静音</div>
    <div class="unmute-box"></div>
</div>
          `
          button.addEventListener('click', function () {
            video.muted = false
            button.remove()
          })

          const videoWrapper = document.querySelector('.mplayer-video-wrap')
          videoWrapper.insertAdjacentElement('afterend', button)
          setTimeout(() => {
            button.classList.add('animated')
          }, 4500)
        }
      }
    }

    observeCardBox()
  }

  function observeCardBox() {
    const cardBox = document.querySelector('.card-box')
    const targetElements = cardBox.children

    Array.from(targetElements).forEach(addTargetElementListener)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((addedNode) => {
            addTargetElementListener(addedNode)
          })
        }
      })
    })

    const observerConfig = { childList: true }
    observer.observe(cardBox, observerConfig)
  }

  function addTargetElementListener(targetElement) {
    if (targetElement) {
      const anchor = targetElement.firstChild
      const h2Element = anchor.lastChild
      const keyword = encodeURIComponent(h2Element.innerHTML)

      anchor.addEventListener('click', event => {
        event.preventDefault()
        event.stopImmediatePropagation()

        goToVideoById(keyword, (bvId, error) => {
          if (bvId) {
            const videoUrl = `https://m.bilibili.com/video/${bvId}`
            window.history.pushState({}, '', videoUrl)
            window.location.href = videoUrl
          } else {
            console.error('BVId wrong: ', error)
          }
        })
      }, true)
    }
  }

  function runHome() {
    const cardBox = document.querySelector('.card-box')
    const aTags = cardBox.children

    Array.from(aTags).forEach(addHomeTargetElementListener)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((addedNode) => {
            addHomeTargetElementListener(addedNode)
          })
        }
      })
    })

    const observerConfig = { childList: true }
    observer.observe(cardBox, observerConfig)

    function addHomeTargetElementListener(tag) {
      tag.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopImmediatePropagation()

        await new Promise((resolve) => setTimeout(resolve, 0))
        window.location.href = tag.getAttribute('href')
      }, true)
    }
  }

  function customElementStyle() {
    const initialInsertStyle = `
/* 全屏跳App、倍速按钮、播完推荐 */
.mplayer-fullscreen-call-app, .mplayer-control-btn-speed, .mplayer-ending-panel-recommend {
  display: none !important;
}

/*
* 优化视觉 *
*/

/* 调整分集高度 */
.m-video-part-panel-content {
  height: 81vmin !important;
}
/* 居中重播按钮 */
.mplayer-ending-panel-buttons {
  align-self: center !important;

  img {
    margin-left: 3px !important;
  }
}
/* 阻止跳转APP */
.launch-app-btn {
  pointer-events: none;
}
.card-box a {
  pointer-events: auto;
}
/* 重复的初始图形层 */
.natural-module, .m-footer {
  display: none !important;
}

/*
* 声音按钮 *
*/

.unmute {
  position: absolute;
  top: 0;
  padding: 12px;
  background: none;
  border: 0;
  font-size: 127%;
  text-align: inherit;
}
.unmute-inner {
  position: relative;
}
.unmute-icon {
  height: 48px;
  display: inline-block;
  vertical-align: middle;
  padding-left: 2px;
  position: relative;
  z-index: 10;
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  border-bottom: 1px solid #f1f1f1;
}
.unmute svg {
  filter: drop-shadow(0 0 2px rgba(0,0,0,.5));
}
.unmute-text {
  position: relative;
  z-index: 10;
  padding-right: 10px;
  vertical-align: middle;
  display: inline-block;
  transition: opacity .25s cubic-bezier(.4,0,1,1);
}
.animated .unmute-text {
  opacity: 0;
}
.unmute-box {
  width: 100%;
  background-color: rgb(255, 255, 255);
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  border-bottom: 1px solid #f1f1f1;
  transition: width .5s cubic-bezier(.4,0,1,1);
}
.animated .unmute-box {
  width: 0;
}
    `

    const style = document.createElement('style')
    style.textContent = initialInsertStyle

    document.head ? document.head.appendChild(style) : waitDOMContentLoaded(() => document.head.appendChild(style))
  }
})()