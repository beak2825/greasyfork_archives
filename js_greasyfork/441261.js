// ==UserScript==
// @name         解除B站文字复制引用后缀
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如题
// @author       Liaune
// @license      MIT
// @match        *://www.bilibili.com/read*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441261/%E8%A7%A3%E9%99%A4B%E7%AB%99%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6%E5%BC%95%E7%94%A8%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/441261/%E8%A7%A3%E9%99%A4B%E7%AB%99%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6%E5%BC%95%E7%94%A8%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
   window.addEventListener('copy', function(e){e.stopPropagation()}, true);
})();