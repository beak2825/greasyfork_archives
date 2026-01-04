// ==UserScript==
// @name         Lanzn Auto Click Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  蓝奏云自动点击下载按钮
// @author       Your Name
// @match        http*://*.lanzn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510689/Lanzn%20Auto%20Click%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/510689/Lanzn%20Auto%20Click%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找第一个按钮元素
        const firstButton = document.querySelector('.passwddiv-btn'); // 根据实际情况调整选择器

        // 如果找到了第一个按钮，就点击它
        if (firstButton) {
            firstButton.click();

            // 等待页面加载
            setTimeout(() => {
                // 查找第二个下载链接
                const downloadLink = document.querySelector('a[href*="down-load.lanrar.com"]'); // 根据实际情况调整选择器

                // 如果找到了下载链接，就点击它
                if (downloadLink) {
                    downloadLink.click();
                }
            }, 1000); // 等待 3 秒后点击下载链接，时间可以根据需要调整
        }
    });
})();