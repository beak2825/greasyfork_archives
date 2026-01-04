// ==UserScript==
// @name         v2ex 夜间模式跟随系统自动切换
// @namespace    https://github.com/gaoyang/tampermonkey-scripts
// @version      1.0
// @description  v2ex 夜间模式跟随系统自动切换，需要先登录才能拥有夜间模式!
// @author       gaoyang
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470802/v2ex%20%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/470802/v2ex%20%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  
  const toggleBtn = document.getElementsByClassName('light-toggle')[0]
  if(!toggleBtn) return
  const isLight = toggleBtn.children[0].src.includes('light')

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const callback = e => {
    const prefersDarkMode = e.matches
    if ((prefersDarkMode && isLight) || (!prefersDarkMode && !isLight)) {
      toggleBtn.click()
    }
  }
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', callback)
  } else if (typeof media.addListener === 'function') {
    media.addListener(callback)
  }
  callback(media)
})()
