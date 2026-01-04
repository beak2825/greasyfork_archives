// ==UserScript==
// @name         技术成神-网页变灰
// @namespace    https://greasyfork.org/en/scripts/455710
// @version      0.0.2
// @description  移除部分网站首页的灰白效果。
// @author       Wanten
// @copyright    2022 Wanten
// @supportURL   https://github.com/WantenMN/userscript/issues
// @license      GNU General Public License v3.0
// @match        *://*/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455882/%E6%8A%80%E6%9C%AF%E6%88%90%E7%A5%9E-%E7%BD%91%E9%A1%B5%E5%8F%98%E7%81%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455882/%E6%8A%80%E6%9C%AF%E6%88%90%E7%A5%9E-%E7%BD%91%E9%A1%B5%E5%8F%98%E7%81%B0.meta.js
// ==/UserScript==

(function() {
  //document.documentElement.style.filter = "none";
  GM_addStyle("*{-webkit-filter: grayscale(100%) !important;filter:  grayscale(100%) !important;}");
})();