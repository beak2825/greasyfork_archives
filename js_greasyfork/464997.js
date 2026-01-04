// ==UserScript==
// @name         微信黑白模式适配
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  微信公众号，黑暗模式下，字体变亮
// @author       DDDDEEP
// @match        *://mp.weixin.qq.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464997/%E5%BE%AE%E4%BF%A1%E9%BB%91%E7%99%BD%E6%A8%A1%E5%BC%8F%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/464997/%E5%BE%AE%E4%BF%A1%E9%BB%91%E7%99%BD%E6%A8%A1%E5%BC%8F%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
setTimeout(function() {
  const spans = document.getElementsByTagName('span');
  for (let i = 0; i < spans.length; i++) {
    spans[i].style.setProperty('color', 'white', 'important');
  }
  const para = document.getElementsByTagName('p');
  for (let i = 0; i < para.length; i++) {
    para[i].style.setProperty('color', 'white', 'important');
  }
}, 100);
})();