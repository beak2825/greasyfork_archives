// ==UserScript==
// @name         这是个什么东西_Auto Click Button and Link
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  自动点击指定按钮和下载链接,但这个等待页面加载完成好像挺有用
// @author       Jack Ou
// @match        http*://www.hifini.com/thread-*.htm
// @match        http*://*.lanzn.com/*
// @icon         https://www.hifini.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511182/%E8%BF%99%E6%98%AF%E4%B8%AA%E4%BB%80%E4%B9%88%E4%B8%9C%E8%A5%BF_Auto%20Click%20Button%20and%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/511182/%E8%BF%99%E6%98%AF%E4%B8%AA%E4%BB%80%E4%B9%88%E4%B8%9C%E8%A5%BF_Auto%20Click%20Button%20and%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来点击第一个按钮
    function clickFirstButton() {
        const button = document.querySelector('.passwddiv-btn');
        if (button) {
            button.click();
            console.log('第一个按钮已被自动点击');
            // 设置一个定时器，等待页面跳转
            setTimeout(clickDownloadLink, 1000); // 等待3秒后点击下载链接
        } else {
            console.log('未找到第一个按钮');
        }
    }

    // 定义一个函数来点击下载链接
    function clickDownloadLink() {
        const downloadLink = document.querySelector('a[href*="down-load.lanrar.com"]');
        if (downloadLink) {
            downloadLink.click();
            console.log('下载链接已被自动点击');
        } else {
            console.log('未找到下载链接');
        }
    }

    // 等待页面加载完成
    window.addEventListener('load', clickFirstButton);
})();