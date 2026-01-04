// ==UserScript==
// @name         网页加载优化
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  屏蔽指定的水印元素
// @author       诸葛
// @match        http://imis.baijiahao.baidu.com/*
// @match        https://tianmu.baidu-int.com/*
// @match        https://tda.baidu-int.com/*
// @match        https://ku.baidu-int.com/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/517882/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517882/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数，用于移除指定的水印
    function removeWatermark() {
        // 移除类名为 .client_components_watermark 的水印元素
        const watermark1 = document.querySelector('.client_components_watermark');
        if (watermark1) {
            watermark1.remove();
        }

        // 移除类名为 ._waterMark_90rkq_1 的水印元素
        const watermark2 = document.querySelector('._waterMark_90rkq_1');
        if (watermark2) {
            watermark2.remove();
        }

        // 移除 id 为 wm_div_id 的水印元素
        const watermark3 = document.getElementById('wm_div_id');
        if (watermark3) {
            watermark3.remove();
        }

        // 移除所有以 mask_div_id 为前缀的水印元素
        const maskDivs = document.querySelectorAll('[id^="mask_div_id"]');
        maskDivs.forEach(maskDiv => {
            maskDiv.remove();
        });

        // 移除 id 为 waterMarkContainer 的水印容器
        const watermarkContainer = document.getElementById('waterMarkContainer');
        if (watermarkContainer) {
            watermarkContainer.remove();
        }

        // 移除内部背景图片的 div 元素
        const watermarkBgDiv = document.querySelector('div[style*="background-image: url(*watermark.png)"]');
        if (watermarkBgDiv) {
            watermarkBgDiv.remove();
        }
    }

    // 监听 DOM 变化，以捕获动态加载的水印
    const observer = new MutationObserver(() => {
        removeWatermark();
    });

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true, // 监听子节点变化
        subtree: true    // 包括子树中的所有变化
    });

    // 初始调用以处理页面加载完成后的水印
    removeWatermark();
})();
