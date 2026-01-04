// ==UserScript==
// @name         close sis ad
// @namespace    http://tampermonkey.net/
// @version      2024-03-31
// @description  本脚本等待页面加载完成后，获取页面最后一个按钮（即关闭广告按钮）并点击，自动关闭提示
// @author       yt
// @match        *://sis.xxx/*
// @match        *://sexinsex.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis.xxx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491302/close%20sis%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/491302/close%20sis%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //等待页面加载完成后，获取页面最后一个按钮（即关闭广告按钮）并点击
    window.addEventListener('load',function() {
        // 获取页面上所有的按钮元素
        const buttons = document.querySelectorAll('button');
        // 点击最后一个按钮，即关闭广告按钮
        buttons[buttons.length - 1].click();
    },false)

})();