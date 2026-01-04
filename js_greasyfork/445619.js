// ==UserScript==
// @name         V2EX无刷新加载页面
// @namespace    http://www.likeyun.cn/
// @version      0.1
// @description  V2EX无刷新切换页面，跳转页面
// @author       You
// @match        https://www.nhacaiv9.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/instantclick/3.1.0/instantclick.min.js
/* globals jQuery, $, InstantClick,waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/445619/V2EX%E6%97%A0%E5%88%B7%E6%96%B0%E5%8A%A0%E8%BD%BD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/445619/V2EX%E6%97%A0%E5%88%B7%E6%96%B0%E5%8A%A0%E8%BD%BD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Tim */
    InstantClick.init();
    /* 隐藏InstantClick插件的加载进度条 */
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("#instantclick-bar{display:none;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

})();