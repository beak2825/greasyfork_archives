// ==UserScript==
// @name         屏蔽b站会员彩色弹幕
// @namespace    https://www.example.com
// @version      1.1
// @description  屏蔽了b站会员彩色弹幕
// @match        https://www.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467811/%E5%B1%8F%E8%94%BDb%E7%AB%99%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/467811/%E5%B1%8F%E8%94%BDb%E7%AB%99%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cssText = '.bili-dm-vip { display: none !important; }';
    var styleElm = document.createElement('style');
    styleElm.type = 'text/css';
    styleElm.textContent = cssText;
    document.head.appendChild(styleElm);
})();