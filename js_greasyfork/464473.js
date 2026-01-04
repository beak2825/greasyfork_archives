// ==UserScript==
// @author       Lete114
// @version      0.1
// @license      MIT License
// @name         Youtube 视频进度条
// @description  (自用脚本) Youtube 视频进度条实时显示
// @match        https://*.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/b83f134a/img/favicon_48x48.png
// @namespace    https://github.com/Lete114/my-tampermonkey-scripts
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/464473/Youtube%20%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/464473/Youtube%20%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /**
   * @param { string } Selector
   * @param { Element } el
   */
  const $ = (Selector, el) => (el || document).querySelector(Selector)

  /**
   *
   * @param { function } func
   * @param { number } delay
   * @returns
   */
  function throttle(func, delay) {
    let timer = null
    return function (...args) {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, args)
          timer = null
        }, delay)
      }
    }
  }

  const reg = /https:\/\/.*.youtube.com\/watch/

  const div = document.createElement('div')
  const className = 'ytp-video-progress'
  div.className = `${className} ytp-swatch-background-color`
  const pos = localStorage.getItem(className) ? 'bottom' : 'top'
  div.style = `${pos}: 0; left: 0; position: absolute; height: 3px; transition: width 0.4s ease;`

  // 主要用于检测 url 变化时判断是视频页面则执行
  setInterval(videoPage, 200)

  let url = null
  function videoPage() {
    const currentURL = window.location.href
    const isVideoPage = reg.test(currentURL)
    // 不是视频页面
    if (!isVideoPage) {
      div.style.width = 0
      return
    }

    // 确保只执行一次
    if (currentURL === url) return

    url = currentURL
    const video = $('video')

    video.addEventListener('timeupdate', throttle(handlerTimeupdate, 1000))
    function handlerTimeupdate() {
      if (video.paused) return
      const percentage = (video.currentTime / video.duration) * 100
      const width = percentage + '%'
      div.style.width = width
    }

    if (location.hostname === 'm.youtube.com') {
      $('#player').appendChild(div)
    } else {
      const timer = setInterval(() => {
        const playerContainerOuter = $('#ytd-player')
        if (playerContainerOuter) {
          clearInterval(timer)
          playerContainerOuter.appendChild(div)
        }
      }, 500)
    }

    GM_registerMenuCommand('切换进度条位置(顶部或底部)', function () {
      if (localStorage.getItem(className)) {
        localStorage.removeItem(className)
        div.style.removeProperty('bottom')
        div.style.top = 0
      } else {
        localStorage.setItem(className, true)
        div.style.removeProperty('top')
        div.style.bottom = 0
      }
    })
  }
})()
