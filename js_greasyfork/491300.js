// ==UserScript==
// @name         linux侧边栏你给我定住
// @namespace    https://greasyfork.org/zh-CN/scripts/491300
// @version      1.1
// @description  linux优化体验-侧边栏你给我定住
// @author       luoawai
// @license      GPL-3.0 License
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491300/linux%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BD%A0%E7%BB%99%E6%88%91%E5%AE%9A%E4%BD%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/491300/linux%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BD%A0%E7%BB%99%E6%88%91%E5%AE%9A%E4%BD%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle(`.sidebar-wrapper{position: sticky !important;top: 80px !important;}`)
     GM_addStyle(`#main-outlet-wrapper{overflow: visible !important;}`)
})();