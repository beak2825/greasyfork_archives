// ==UserScript==
// @name         解决CSDN代码无法复制问题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清除csdn下拉，代码块禁止复制等
// @author       marsyu
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460885/%E8%A7%A3%E5%86%B3CSDN%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/460885/%E8%A7%A3%E5%86%B3CSDN%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function () {
      document.querySelectorAll('#content_views code').forEach(function (i) {
        i.style.userSelect = 'auto'
      })
      document.querySelectorAll('#content_views pre').forEach(function (i) {
        i.style.userSelect = 'auto'
        i.classList.remove('set-code-hide')
      })
      document.querySelector('#content_views').addEventListener('copy', function (e) { e.stopPropagation()}, true)
      console.log('清除完毕')
    }, 1500)
})();