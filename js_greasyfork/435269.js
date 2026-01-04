// ==UserScript==
// @name         B站视频加速器
// @version      1.0
// @description  video speed
// @author       wamwx2
// @match        *://*.bilibili.com/*
// @namespace    https://greasyfork.org/zh-CN/users/836293
// @downloadURL https://update.greasyfork.org/scripts/435269/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435269/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';
 
  let rate = 1
  let titleSelectors = [
    'div.bilibili-player-video-top-title',
    'span.tit',
  ]
  let videoSelector = 'bwp-video'
  let fullscreenSelector = '.bilibili-player-video-btn.bilibili-player-video-btn-fullscreen'
  let keyMap = {
    forward0_25: ']',
    back0_25: '[',
    forward0_5: '=',
    back0_5: '-',
    rate0_5: '`',
    rate1: '1',
    rate2: '2',
    rate3: '3',
    rate4: '4',
    fullscreen: 'Enter',
  }

  setInterval(function() {
      var reg = RegExp("^https://www.bilibili.com/video/");
      if (reg.test(location.href))
      {
          setVideoRate()
          setVideoTitle()
      }
  }, 1000);

  window.addEventListener('keydown', (e) => {
    if (e.key === keyMap.rate0_5) {
      rate = 0.5
    } else if (e.key === keyMap.rate1) {
      rate = 1
    } else if (e.key === keyMap.rate2) {
      rate = 2
    } else if (e.key === keyMap.rate3) {
      rate = 3
    } else if (e.key === keyMap.rate4) {
      rate = 4
    } else if (e.key === keyMap.forward0_25 && rate < 16) {
      rate += 0.25
    } else if (e.key === keyMap.back0_25 && rate > 0.25) {
      rate -= 0.25
    } else if (e.key === keyMap.forward0_5 && rate < 16) {
      rate += 0.5
    } else if (e.key === keyMap.back0_5 && rate > 0.5) {
      rate -= 0.5
    } else if (e.key === keyMap.fullscreen) {
      toggleFullScreen()
    } else {
      return
    }
  })

  function getTitle() {
    return titleSelectors
      .map(selector => document.querySelector(selector))
      .filter(el => el && el.innerText)
      .map(el => el.innerText)[0]
  }

  function setVideoRate() {
    let el = document.querySelector(videoSelector) || document.querySelector('video')
    if (el) {
      el.playbackRate = rate
    }
  }

  function setVideoTitle() {
    const title = (getTitle() || '').replace(/^\【.*\】 /, '')
    for (const selector of titleSelectors) {
      const el = document.querySelector(selector)
      if (el) {
        el.innerHTML = `【${rate}倍速】 ${title}`
      }
    }
  }

  // 浏览器原生全屏事件，无控制条&弹幕
  function nativeToggleFullScreen() {
    const el = document.querySelector(videoSelector)
    if (el) {
      if (document.fullscreenElement) {
        console.debug(`enter fullscreen`)
        document.exitFullscreen()
      } else {
        console.debug(`exit fullscreen`)
        el.webkitRequestFullScreen()
      }
    }
  }

  function toggleFullScreen() {
    const el = document.querySelector(fullscreenSelector)
    if (el) {
      console.debug(`toggleFullScreen`)
      el.click()
    }
  }
})();