// ==UserScript==
// @name         允许双指，禁止双击缩放
// @namespace    https://viayoo.com/
// @version      0.1
// @description  允许浏览器使用双指缩放，禁止双击缩放
// @author       呆毛飘啊飘2171802813
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458071/%E5%85%81%E8%AE%B8%E5%8F%8C%E6%8C%87%EF%BC%8C%E7%A6%81%E6%AD%A2%E5%8F%8C%E5%87%BB%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458071/%E5%85%81%E8%AE%B8%E5%8F%8C%E6%8C%87%EF%BC%8C%E7%A6%81%E6%AD%A2%E5%8F%8C%E5%87%BB%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
var time=0;document.documentElement.addEventListener('touchend',function(e){var now=Date.now();if(now-time<300){e.preventDefault();}time = now;});
})();