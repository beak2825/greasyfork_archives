// ==UserScript==
// @name         老王磁力广告移出
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  老王磁力底部广告移出
// @author       cc
// @license      MIT
// @match        *://laowanghz.top/*
// @icon         https://prod.b5.howcdn.com/img/xiaowang/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521769/%E8%80%81%E7%8E%8B%E7%A3%81%E5%8A%9B%E5%B9%BF%E5%91%8A%E7%A7%BB%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521769/%E8%80%81%E7%8E%8B%E7%A3%81%E5%8A%9B%E5%B9%BF%E5%91%8A%E7%A7%BB%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  window.onload = () => {
    const divs = document.querySelectorAll('body>div')
    const advt = divs[divs.length - 1]
    if (!advt.classList[0].includes('container')) {
      advt.remove()
    }
  }
})()
