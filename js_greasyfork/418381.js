// ==UserScript==
// @name         v2ex去除背景图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  v2ex背景图片去除，并且把背景色改为白色
// @author       r
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418381/v2ex%E5%8E%BB%E9%99%A4%E8%83%8C%E6%99%AF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/418381/v2ex%E5%8E%BB%E9%99%A4%E8%83%8C%E6%99%AF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#Wrapper').style.backgroundImage="url(..)"
    document.querySelector('#Wrapper').style.backgroundColor='#fff'
})();