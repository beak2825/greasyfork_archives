// ==UserScript==
// @name         一键保存网页到互联网档案馆/Wayback Machine
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键保存网页到互联网档案馆/Wayback Machine。/Save web pages to Wayback Machine with one click。
// @author       M-o-x
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460256/%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E5%88%B0%E4%BA%92%E8%81%94%E7%BD%91%E6%A1%A3%E6%A1%88%E9%A6%86Wayback%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/460256/%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E5%88%B0%E4%BA%92%E8%81%94%E7%BD%91%E6%A1%A3%E6%A1%88%E9%A6%86Wayback%20Machine.meta.js
// ==/UserScript==

/* 获取当前网页地址 */
var url = window.location.href;
/* 变量url加上"https://web.archive.org/save/"前缀 */
url = "https://web.archive.org/save/" + url;

(function () {
  "use strict";
  /* 如果监听到按下Alt+B快捷键，在新标签页跳转到rul */
  document.onkeydown = function (e) {
    if (e.altKey && e.key === "b") {
      window.open(url);
    }
  };
})();