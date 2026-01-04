// ==UserScript==
// @name          自动点击
// @description   尝试自动点击页面上指定的元素
// @version       1.2
// @match         *://*/link?target=*
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/497530/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/497530/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区（用户需修改部分）==============================
    const CONFIG = {
        // 要点击的元素选择器（支持标准CSS选择器）
        SELECTORS: [
            '[class="link-go"]',   // 属性选择器
            '[class="btn btn-next"]',    // 类选择器
            '[id="apesar-loading"]',
            '[class="btn"]',// ID选择器
            '[class="button link-instanted"]',
            '[class="btn"]',
            '[]',
            '[]',
            '[]',
            '[]',
            '[]',
        ],

        // 检测间隔（毫秒）
        INTERVAL: 1000,

        // 最大重试次数（0为无限）
        MAX_RETRY: 0
    };

    // 核心逻辑==========================================
    let retryCount = 0;
    const clickedElements = new Set();

    function simpleClick() {
        CONFIG.SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);

            elements.forEach(element => {
                if (!clickedElements.has(element)) {
                    try {
                        element.click();
                        console.log('[AutoClick] 已点击:', element);
                        clickedElements.add(element);
                    } catch (e) {
                        console.warn('[AutoClick] 点击失败:', e);
                    }
                }
            });
        });

        if (CONFIG.MAX_RETRY > 0) {
            if (++retryCount >= CONFIG.MAX_RETRY) {
                console.log('[AutoClick] 达到最大重试次数');
                clearInterval(timer);
            }
        }
    }

    // 启动定时器
    const timer = setInterval(simpleClick, CONFIG.INTERVAL);

    // 页面更新后重新检测（简单版）
    document.addEventListener('DOMContentLoaded', simpleClick);
    window.addEventListener('load', simpleClick);
})();