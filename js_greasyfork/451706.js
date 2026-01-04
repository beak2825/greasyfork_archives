// ==UserScript==
// @name         隐藏B站adBlock提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏B站置顶的adBlock提示
// @author       cl1107
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451706/%E9%9A%90%E8%97%8FB%E7%AB%99adBlock%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451706/%E9%9A%90%E8%97%8FB%E7%AB%99adBlock%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  window.addEventListener('load', () => {
    const tip = document.querySelector('#i_cecream > div.adblock-tips');
    if (tip) {
      tip.style.display = 'none';
    }
  });
})();