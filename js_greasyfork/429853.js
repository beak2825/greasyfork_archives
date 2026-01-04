// ==UserScript==
// @name        知乎夜间模式
// @namespace    http://tampermonkey.net/
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @version      0.5
// @description  开启知乎夜间模式，并且跟随系统主题自动切换，切换后刷新网页不会出现闪白的情况
// @author       Dark15
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/429853/%E7%9F%A5%E4%B9%8E%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/429853/%E7%9F%A5%E4%B9%8E%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // 是否是第一次加载
  let isFirstLoad = true

  function isSysDarkMode() {
    // 判断系统主题是否为黑色
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function isZhihuDarkMode() {
    // 判断知乎网站是否为夜间模式
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }

  function setTheme(theme) {
    // 设置知乎网站的主题，需要刷新页面
    window.location.href = window.location.href.split('?')[0] + '?theme=' + theme
  }

  function setRootTheme(theme) {
    // 设置html根标签的data-theme属性，无需刷新页面
    document.documentElement.setAttribute('data-theme', theme)
    fetch('/?theme=' + theme)
  }

  function switchTheme() {
    const isSysDark = isSysDarkMode()
    const isZhihuDark = isZhihuDarkMode()
    if ((isSysDark && !isZhihuDark) || (!isSysDark && isZhihuDark)) {
      const theme = isSysDark ? 'dark' : 'light'
      if (isFirstLoad) {
        setTheme(theme)
      }
      setRootTheme(theme)
    }
    isFirstLoad = false
  }

  // 初始时切换一次主题
  switchTheme()

  // 监听系统主题变化，切换主题
  const mql = window.matchMedia('(prefers-color-scheme: dark)')

  mql.addEventListener('change', switchTheme)
})()