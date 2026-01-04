// ==UserScript==
// @name         掘金广告去除
// @namespace    https://greasyfork.org/en/scripts/532890-%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4
// @version      0.3
// @description  掘金的广告越来越烦人了，悄悄把它隐藏起来
// @author       Allen-1998
// @match        *://juejin.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532890/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/532890/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const head = document.querySelector('head')
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.innerText = `
.top-banners-container,
.main-area.article-area > article > img {
  display: none !important;
}

`
  head.append(style)

  // 要移除的类列表
  const classesToRemove = ['with-global-banner', 'header-with-banner']

  function handleRemove() {
    classesToRemove.forEach((cls) => {
      document.querySelectorAll(`.${cls}`).forEach((el) => {
        el.classList.remove(cls)
      })
    })
  }
  const observer = new MutationObserver(handleRemove)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true, // 监听属性变化
    attributeFilter: ['class'], // 只监听 class
  })
  // 初始化立即执行一次
  handleRemove()
})()
