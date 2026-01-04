// ==UserScript==
// @name         飞书文档水印消除
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  一款 Tampermonkey 脚本，用于屏蔽飞书文档页面上的水印，提供更清爽的阅读和编辑体验。
// @author       C3604
// @match        *://*.feishu.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537395/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/537395/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 基于特征和 class="ssrWaterMark" 的 CSS 规则，用于隐藏水印
    const hideWatermarkCSS = `
        /* 针对所有可能的水印元素，使用更鲁棒的软隐藏策略 */
        .suite-clear[style*='background-image: url("'],
        .suite-clear[style*='data:image/png;base64'],
        .ssrWaterMark,
        /* 针对无 class/id 但有特定 style 属性的水印 */
        div[style*='position: fixed'][style*='pointer-events: none'][style*='height: 100%'][style*='width: 100%'][style*='background-image: url("data:image/png;base64,'],
        div[style*='position: fixed'][style*='pointer-events: none'][style*='height: 100%'][style*='width: 100%'][style*='background-repeat: repeat;'] {
            /* 核心隐藏策略：将元素缩小到不可见，但仍在DOM中 */
            transform: scale(0) !important; /* 缩小到几乎为零 */
            height: 1px !important; /* 保持极小尺寸，避免完全归零 */
            width: 1px !important;  /* 保持极小尺寸 */
            overflow: hidden !important; /* 隐藏任何溢出内容 */

            /* 确保完全透明 */
            opacity: 0 !important;

            /* 确保不响应鼠标事件，防止遮挡 */
            pointer-events: none !important;

            /* 关键点：避免使用 display: none; 和 visibility: hidden; */
            /* 这两种属性最容易被检测到元素“消失” */

            /* 额外的安全措施：可以尝试将元素移动到屏幕外，与 scale(0) 叠加 */
            /* top: -9999px !important; */
            /* left: -9999px !important; */
        }
    `;

    // 使用 GM_addStyle 注入 CSS 样式
    GM_addStyle(hideWatermarkCSS);

    console.log('Tampermonkey 脚本已运行，水印隐藏样式已注入 (优化CSS软隐藏)。');
})();