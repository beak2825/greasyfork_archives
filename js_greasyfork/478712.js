// ==UserScript==
// @name         自动跳转 MDN 中文
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  点击 MDN 链接，自动跳转至中文路由
// @author       [Ares-Chang](https://github.com/Ares-Chang)
// @match        https://developer.mozilla.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @link         https://github.com/Ares-Chang/tampermonkey
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478712/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20MDN%20%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478712/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20MDN%20%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  const url = window.location.href

  // 如果 url 包含中文路由 || 包含 _stop 字段，则直接跳过
  if (url.includes('/zh-CN/') || url.includes('_stop')) return

  const language = document.querySelector('#languages-switcher-button')

  language.click() // 打开语言下拉菜单

  setTimeout(() => {
    const list = document.querySelectorAll('.languages-switcher-menu li')

    // 获取 list 中内容为 "中文" 的元素
    ;[...list].some(dom => {
      const judge = dom.innerText.includes('中文')
      if (judge) {
        dom.querySelector('a').click()
        return true
      }

      return false
    })

    language.click() // 关闭语言下拉菜单
  }, 0)
})()
