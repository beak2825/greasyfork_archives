// ==UserScript==
// @name         bilibili样式
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.2
// @description  bilibili样式调整
// @author       Jiang
// @match        *://www.bilibili.com/*
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482023/bilibili%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/482023/bilibili%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(css));
        //for IE
        //style.styleSheet.cssText = code;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    let container = document.querySelector('.container');
    let swiper = document.querySelector('.recommended-swipe');
    container.removeChild(swiper);
    swiper = null;

    loadStyle('@media (min-width: 2060px) {.recommended-container_floor-aside .container>*:nth-of-type(n + 8) {margin-top: 0px}}')

})();