// ==UserScript==
// @name         拒绝百度搜索结果二次跳转
// @namespace    baidu-real-link
// @version      0.0.3
// @author       lyswhut
// @license      MIT
// @description  将百度搜索结果链接替换成原始链接
// @match        https://www.baidu.com/s?*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454244/%E6%8B%92%E7%BB%9D%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454244/%E6%8B%92%E7%BB%9D%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
  'use strict'

  const handleReplace = () => {
    for (const item of document.querySelectorAll('.new-pmd')) {
      const link = item.getAttribute('mu')
      if (!link) continue
      if (link.includes('lightapp.baidu.com')) continue
      let a = item.querySelector('.c-title > a')
      if (!a) a = item.querySelector('.c-border a')
      if (!a) continue
      a.setAttribute('href', link)
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    handleReplace()

    const observer = new window.MutationObserver(() => {
      setTimeout(handleReplace)
    })
    const dom_content = document.querySelector('#wrapper_wrapper')
    if (!dom_content) return
    observer.observe(dom_content, {
      attributes: false,
      childList: true,
      subtree: false,
    })
  })
})()
