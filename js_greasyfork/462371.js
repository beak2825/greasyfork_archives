// ==UserScript==
// @name        Youtube-like Progress Bar Navigation 类 Youtube 按数字键进度条
// @description  允许使用数字键导航Bilibili视频，类似于Youtube的进度条导航功能。小键盘数字没有生效，为什么
// @author  chenjiamian
// @namespace    http://tampermonkey.net/
// @version      2.1.5
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater*
// @match        http://*/videos/*
// @match        https://*/videos/*
// @match        http://*/video/*
// @match        https://*/video/*
// @match        https://*/*/play/*
// @match        https://*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462371/Youtube-like%20Progress%20Bar%20Navigation%20%E7%B1%BB%20Youtube%20%E6%8C%89%E6%95%B0%E5%AD%97%E9%94%AE%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/462371/Youtube-like%20Progress%20Bar%20Navigation%20%E7%B1%BB%20Youtube%20%E6%8C%89%E6%95%B0%E5%AD%97%E9%94%AE%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const video = document.querySelector('video');

        // Alt + 1 到 Alt + 9
        if (event.altKey && event.keyCode >= 49 && event.keyCode <= 57) {
            const index = event.keyCode - 49; // 49 是 '1' 键
            const percentage = 15 + index * 10; // 15%, 25%, ..., 95%
            if (video) {
                video.currentTime = video.duration * percentage / 100;
            }
            return; // 处理完毕，阻止后续处理
        }

        // 普通数字键 0-9
        if (event.keyCode >= 48 && event.keyCode <= 57) {
            const percentage = (event.keyCode - 48) * 10;
            if (video) {
                video.currentTime = video.duration * percentage / 100;
            }
        }
        // 小键盘数字 0-9
        else if (event.keyCode >= 96 && event.keyCode <= 105) {
            const percentage = (event.keyCode - 96) * 10;
            if (video) {
                video.currentTime = video.duration * percentage / 100;
            }
        }
        // “`”键
        else if (event.keyCode === 192) {
            if (video) {
                video.currentTime = video.duration * 0.99;
            }
        }
    });

})();