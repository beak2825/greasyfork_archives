// ==UserScript==
// @name         小鹅通h5视频播放快捷键
// @author       AT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持使用快捷键控制视频：1.播放/暂停 Space；2.前进 ArrowRight；3.后退 ArrowLeft；4.全屏 Escape / Enter；5.提速 c；6.降速 x；7.还原速度 z
// @match        https://*.h5.xiaoeknow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoeknow.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446706/%E5%B0%8F%E9%B9%85%E9%80%9Ah5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446706/%E5%B0%8F%E9%B9%85%E9%80%9Ah5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

// 插入 link 函数
const injectStylesheet = (url) => {
  $('head').append(
    '<link rel="stylesheet" href="' + url + '" type="text/css" />',
  )
}

;(function () {
  'use strict'

  // 插入 toast.css
  injectStylesheet(
    'https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css',
  )

  // toast 函数
  const toast = (msg) => {
    $.toast({
      text: msg,
      loaderBg: '#9EC600',
      showHideTransition: 'fade', // fade, slide or plain
      allowToastClose: false, // Boolean value true or false
      hideAfter: 1000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
      stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
      position: 'bottom-right',
      loader: false,
      bgColor: '#444444',
      textColor: '#eeeeee',
    })
  }

  // 监听热键
  document.onkeyup = function (event) {
    const VOL = 0.1 //1代表100%音量，每次增减0.1
    const TIME = 10 //单位秒，每次增减10秒
    const RATE = 0.1 // 速率
    const video = document.getElementsByTagName('video')
    if (!video?.length) return
    const [videoElement] = video
    if (!videoElement) return

    //键盘事件
    const e = event || window.event || arguments.callee.caller.arguments[0]

    if (!e) return

    const { keyCode } = e

    console.log(
      '%c AT 🥝 onkeyup 🥝-25',
      'font-size:13px; background:#de4307; color:#f6d04d;',
      e.code,
      keyCode,
    )

    //键盘快捷键
    if (keyCode === 38) {
      // 按向上键 + 音量
      videoElement.volume !== 1 ? (videoElement.volume += VOL) : 1
    } else if (keyCode === 40) {
      // 按向下键 - 音量
      videoElement.volume !== 0 ? (videoElement.volume -= VOL) : 1
    } else if (keyCode === 37) {
      // 按向左键 < 后退 10s
      videoElement.currentTime !== 0 ? (videoElement.currentTime -= TIME) : 1
    } else if (keyCode === 39) {
      // 按向右键 > 前进 10s
      videoElement.volume !== videoElement.duration
        ? (videoElement.currentTime += TIME)
        : 1
    } else if (keyCode === 32) {
      // 按空格键 开始/暂停
      const [play] = document.getElementsByClassName('xgplayer-icon')
      if (play) {
        // 兼容处理
        videoElement.click()
        videoElement.click()
        return
      }
      videoElement.paused ? videoElement.play() : videoElement.pause()
    } else if (keyCode === 27 || keyCode === 13) {
      // h5 全屏元素有两种，故使用 h51 和 h52 区分
      // 按 esc 进入全屏/退出全屏

      if (videoElement.paused) {
        return firstChangeScreen()
      }

      // h51
      const [slider_right] = document.getElementsByClassName('fullBtn')

      // h52
      const [fullscreen] = document.getElementsByClassName(
        'xgplayer-fullscreen',
      )

      if (slider_right) {
        // h51 click
        slider_right?.click()
      } else if (fullscreen) {
        // h52 click
        fullscreen?.click()
      }
    } else if (keyCode === 67) {
      // c 提升速度
      videoElement.playbackRate += RATE
      toast(`播放速度 ${videoElement.playbackRate.toFixed(1)}`)
    } else if (keyCode === 90) {
      // z 还原速度
      videoElement.playbackRate = 1
      toast(`播放速度 1.0`)
    } else if (keyCode === 88) {
      // x 降低速度
      videoElement.playbackRate -= RATE
      toast(`播放速度 ${videoElement.playbackRate.toFixed(1)}`)
    }

    // 首次全屏
    function firstChangeScreen() {
      if (videoElement.paused) {
        const [playerImg] = document.getElementsByClassName('playerImg')

        // h51
        if (playerImg) {
          playerImg.click() // 播放
          //   videoElement.pause() // 暂停
          setTimeout(() => {
            const [slider_right] = document.getElementsByClassName('fullBtn')
            // 进入全屏
            slider_right?.click()
          }, 100)
          return
        }

        // h52
        const [start] = document.getElementsByClassName('xgplayer-start')
        if (start) {
          start.click()
          setTimeout(() => {
            const [fullscreen] = document.getElementsByClassName(
              'xgplayer-fullscreen',
            )
            // 进入全屏
            fullscreen?.click()
          }, 200)
        }
      }
    }
  }
})()
