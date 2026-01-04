// ==UserScript==
// @name         视频倍速快捷键
// @version      1.1
// @description  speed up/down video
// @author       BlueSky
// @match        *://*.bilibili.com/*
// @match        *://*.netflix.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/447360
// @downloadURL https://update.greasyfork.org/scripts/396652/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/396652/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

/**
 * configMap: {
 *   [siteName: string]: {
 *     titleSelectors: string[]     // 视频标题元素选择器
 *     videoSelector: string        // 视频元素选择器
 *     fullscreenSelector: string   // 全屏按钮元素选择器
 *     keyMap: {                    // 按键功能映射
 *       forward0_25?: string       // 速度增加 0.25x
 *       back0_25?: string          // 速度减少 0.25x
 *       forward0_5?: string        // 速度增加 0.5x
 *       back0_5?: string           // 速度减少 0.5x
 *       rate0_5?: string           // 设为 0.5x
 *       rate1?: string             // 设为 1x
 *       rate2?: string             // 设为 2x
 *       rate3?: string             // 设为 3x
 *       rate4?: string             // 设为 4x
 *       fullscreen?: string        // 切换全屏
 *     }
 *   }
 * }
 */

(function () {
  'use strict';
  const configMap = {
    bilibili: {
      titleSelectors: [
        'div.bilibili-player-video-top-title',
        'span.tit',
      ],
      videoSelector: 'bwp-video',
      fullscreenSelector: '.bilibili-player-video-btn.bilibili-player-video-btn-fullscreen',
      keyMap: {
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
      },
    },
    youtube: {
      titleSelectors: [
        '.ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link',
        'h1 > yt-formatted-string.style-scope.ytd-video-primary-info-renderer'
      ],
      videoSelector: 'video',
      fullscreenSelector: '.ytp-fullscreen-button.ytp-button',
      keyMap: {
        forward0_25: ']',
        back0_25: '[',
        forward0_5: '=',
        back0_5: '-',
        rate0_5: '`',
        fullscreen: 'Enter',
      },
    },
    netflix: {
      titleSelectors: [
        '.watch-video h4',
      ],
      videoSelector: 'video',
      fullscreenSelector: 'button[data-uia^=control-fullscreen]',
      keyMap: {
        forward0_25: ']',
        back0_25: '[',
        forward0_5: '=',
        back0_5: '-',
        rate0_5: '`',
        rate1: '1',
        rate2: '2',
        rate3: '3',
        rate4: '4',
      },
    },
  }
  let rate = 1
  let titleSelectors = []
  let videoSelector = 'video'
  let fullscreenSelector = ''
  let keyMap = {}
  const siteName = location.hostname.split('.').slice(-2)[0]
  const config = configMap[siteName]
  if (config) {
    console.debug(`found config for ${siteName}:`, config)
    titleSelectors = config.titleSelectors
    videoSelector = config.videoSelector
    fullscreenSelector = config.fullscreenSelector
    keyMap = config.keyMap
  }


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
    setVideoRate()
    setVideoTitle()
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
      console.debug(`rate: ${rate}x`)
      el.playbackRate = rate
    }
  }

  function setVideoTitle() {
    const title = (getTitle() || '').replace(/^\[.*\] /, '')
    for (const selector of titleSelectors) {
      const el = document.querySelector(selector)
      if (el) {
        el.innerHTML = `[${rate}x] ${title}`
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