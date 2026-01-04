// ==UserScript==
// @name         移除B站动态页的话题栏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除B站动态页的傻*话题栏，眼不见心不烦
// @author       You
// @match        https://t.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447843/%E7%A7%BB%E9%99%A4B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E7%9A%84%E8%AF%9D%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447843/%E7%A7%BB%E9%99%A4B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E7%9A%84%E8%AF%9D%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = setInterval(() => {
      const panel = document.querySelector('.sticky')
      if(panel) {
        clearInterval(id)
        panel.remove()
      }
    }, 100)

})();