// ==UserScript==
// @name         黑白首页，灰白首页，黑色首页去除
// @namespace    ny_gray_remove
// @version      0.0.1
// @description  移除部分网站首页的灰白效果
// @author       Wanten
// @copyright    noahyann
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493052/%E9%BB%91%E7%99%BD%E9%A6%96%E9%A1%B5%EF%BC%8C%E7%81%B0%E7%99%BD%E9%A6%96%E9%A1%B5%EF%BC%8C%E9%BB%91%E8%89%B2%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/493052/%E9%BB%91%E7%99%BD%E9%A6%96%E9%A1%B5%EF%BC%8C%E7%81%B0%E7%99%BD%E9%A6%96%E9%A1%B5%EF%BC%8C%E9%BB%91%E8%89%B2%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
  //document.documentElement.style.filter = "none";
  GM_addStyle("*{-webkit-filter: none !important;filter:  none !important;}");
})();