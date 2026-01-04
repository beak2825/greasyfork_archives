// ==UserScript==
// @name         黑白网页恢复彩色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  恢复彩色
// @author       tetu137
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/455835/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455835/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let html = document.documentElement;
  html.classList.remove("gray",'itcauecng');
  console.log("123已执行");
})();
