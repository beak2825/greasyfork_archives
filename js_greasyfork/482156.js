// ==UserScript==
// @name         知乎深色模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制开启知乎深色模式
// @author       WilliamLi0623
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482156/%E7%9F%A5%E4%B9%8E%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/482156/%E7%9F%A5%E4%B9%8E%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let firstRun = true
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }

  function setTheme(theme) {
    window.location.href = window.location.href.split('?')[0] + '?theme=' + theme
  }

  function setRootTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    fetch('/?theme=' + theme)
  }

  function switchTheme() {
    const isZhihuDark = isDark()
    const theme = 'dark'
    if(!isZhihuDark) {
      if(!firstRun) {
        setTheme(theme)
      }
      setRootTheme(theme)
    }
    firstRun = false
  }

  switchTheme()

  const mql = window.matchMedia('(prefers-color-scheme: dark)')

  mql.addEventListener('change', switchTheme)
})()