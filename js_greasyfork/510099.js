// ==UserScript==
// @name         Easyv水印隐藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide the watermark on the page
// @author       Your Name
// @match        https://workspace.easyv.cloud/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510099/Easyv%E6%B0%B4%E5%8D%B0%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/510099/Easyv%E6%B0%B4%E5%8D%B0%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察者来监测 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 隐藏水印
            const watermark = document.querySelector('.index__canvas--Za5X5');
            if (watermark) {
                watermark.style.display = 'none'; // 隐藏水印
            }
            // 隐藏额外的元素
            const trialElement = document.querySelector('.index__trial--MHQvd');
            if (trialElement) {
                trialElement.style.display = 'none'; // 隐藏指定元素
            }
        });
    });

    // 开始观察页面的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载时隐藏水印和其他元素
    window.addEventListener('load', function() {
        const watermark = document.querySelector('.index__canvas--Za5X5');
        if (watermark) {
            watermark.style.display = 'none'; // 隐藏水印
        }
        const trialElement = document.querySelector('.index__trial--MHQvd');
        if (trialElement) {
            trialElement.style.display = 'none'; // 隐藏指定元素
        }
    });
})();