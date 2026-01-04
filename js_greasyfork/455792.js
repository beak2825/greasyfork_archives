// ==UserScript==
// @name         b站首页黑白去除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除b站（bilibili）首页的黑白滤镜
// @author       thunder-sword
// @match        *://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455792/b%E7%AB%99%E9%A6%96%E9%A1%B5%E9%BB%91%E7%99%BD%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/455792/b%E7%AB%99%E9%A6%96%E9%A1%B5%E9%BB%91%E7%99%BD%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelectorAll('.gray').forEach(e => e.className='');
})();