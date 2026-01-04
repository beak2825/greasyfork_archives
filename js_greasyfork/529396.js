// ==UserScript==
// @name         Remove N-Watermark
// @namespace    https://github.com/Huoyuuu
// @version      1.0
// @description  自动移除页面中的n-watermark水印
// @author       Huoyuuu
// @match        https://aia.neu.edu.cn/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529396/Remove%20N-Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/529396/Remove%20N-Watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接移除
    function removeWatermarks() {
        try {
            const watermarks = document.querySelectorAll('.n-watermark');
            if (watermarks.length > 0) {
                watermarks.forEach(watermark => {
                    watermark.remove();
                    console.log('水印已移除');
                });
            }
        } catch (error) {
            console.error('移除水印时出错:', error);
        }
    }

    // 初始加载时执行
    removeWatermarks();

    // 监听 DOM 变化，处理动态加载的水印
    const observer = new MutationObserver((mutations) => {
        removeWatermarks();
    });

    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 清理函数，在页面卸载时断开观察
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();