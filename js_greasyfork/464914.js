// ==UserScript==
// @name         Remove XUNFEI Watermark 移除讯飞星火GPT-AI水印 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  保护隐私，移除讯飞人工智能星火模型GPT-AI水印.Telegram新频道：https://t.me/ShareFreely2025 原TG频道：https://t.me/data_share2021 
// @author       skycloud
// @license      Apache
// @include        *://*.xfyun.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464914/Remove%20XUNFEI%20Watermark%20%E7%A7%BB%E9%99%A4%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%ABGPT-AI%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464914/Remove%20XUNFEI%20Watermark%20%E7%A7%BB%E9%99%A4%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%ABGPT-AI%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时器，每5秒钟进行一次去除水印的操作
    setInterval(removeWatermark, 5000);

    // 执行去除水印的函数
    function removeWatermark() {
        let watermarkDivs = document.querySelectorAll("[class*='watermark']");

        for(let i=0; i<watermarkDivs.length; i++) {
            watermarkDivs[i].parentNode.removeChild(watermarkDivs[i]);
        }
    }

    // 在DOM加载完成后立即执行一次去除水印的操作
    window.addEventListener("DOMContentLoaded", removeWatermark);

    // 在页面加载完成后立即执行一次去除水印的操作
    window.addEventListener("load", removeWatermark);

    // 在页面每次刷新时都会执行去除水印的操作
    window.addEventListener("beforeunload", removeWatermark);
})();