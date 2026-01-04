// ==UserScript==
// @name         Youtube播放器用户体验优化
// @namespace    https://www.youtube.com/
// @version      1.3
// @description  优化拖动进度条后无法通过键盘调整音量
// @author       Maverick_Pi
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532039/Youtube%E6%92%AD%E6%94%BE%E5%99%A8%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532039/Youtube%E6%92%AD%E6%94%BE%E5%99%A8%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
  'use strict'

  function enhancePlayerFocus () {
    const progressBar = document.querySelector('.ytp-progress-bar')
    const video = document.querySelector('video')
    if (!progressBar || !video) return

    const outOfFocus = e => {
      document.activeElement.blur()
      video.focus()
    }

    // Prevent adding duplicate listeners
    progressBar.removeEventListener('focus', outOfFocus)
    progressBar.addEventListener('focus', outOfFocus)
  }

  // First execution
  setInterval(enhancePlayerFocus, 2000)
})()
