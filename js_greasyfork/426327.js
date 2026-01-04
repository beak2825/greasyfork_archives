// ==UserScript==
// @name         全屏隐藏掘金头部
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  全屏隐藏掘金头部，方便文章阅读
// @author       xnic
// @match        https://juejin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426327/%E5%85%A8%E5%B1%8F%E9%9A%90%E8%97%8F%E6%8E%98%E9%87%91%E5%A4%B4%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/426327/%E5%85%A8%E5%B1%8F%E9%9A%90%E8%97%8F%E6%8E%98%E9%87%91%E5%A4%B4%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFull = () => (window.outerWidth === screen.availWidth && window.outerHeight === screen.availHeight)

    let hideOrShow = () => { isFull() ? document.querySelector('.main-header').style.display = 'none' : document.querySelector('.main-header').style.display = 'block' }


    setTimeout(()=> hideOrShow(), 300)

    //监听退出全屏事件
    window.onresize = function() {
         setTimeout(()=> hideOrShow(), 1000)
    }


    // Your code here...
})();