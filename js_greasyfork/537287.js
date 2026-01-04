// ==UserScript==
// @name        Mintegral Report Page Height Fix (Optimized)
// @namespace   http://tampermonkey.net/
// @version     2.05
// @description Increase max-height for some elements and limit row height for specific tables on Mintegral pages. Fixed fixed-column height sync issue.
// @author      Grok & Gemini
// @match       https://adv.mintegral.com/*
// @grant       none
// @run-at      document-idle
// @license     GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/537287/Mintegral%20Report%20Page%20Height%20Fix%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537287/Mintegral%20Report%20Page%20Height%20Fix%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Mintegral Fix v2.05] Script loaded and starting...');

    // 样式注入函数，将样式字符串注入到页面中
    function injectStyles(id, styles) {
        const existingStyle = document.getElementById(id);
        if (existingStyle) {
            existingStyle.remove();
        }
        const styleSheet = document.createElement('style');
        styleSheet.id = id;
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        console.log(`[Mintegral Fix v2.05] Styles injected with ID: ${id}`);
    }

    // 表格行高限制样式
    const limitRowHeightStyles = `
        /* 减小表格单元格的内边距和行高 */
        .el-table .el-table__body-wrapper tbody td, .creative-table .el-table__body-wrapper tbody td {
            padding: 2px 0 !important;
            line-height: 1.2 !important;
        }
        /* 限制单元格内容高度并处理溢出 */
        .el-table .el-table__body-wrapper tbody td .cell, .creative-table .el-table__body-wrapper tbody td .cell {
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        /* 针对创意页面特定列的样式调整 */
        #pane-creativeSet .el-table__body-wrapper tbody td.el-table_1_column_5,
        #pane-creativeSet .el-table__body-wrapper tbody td.el-table_1_column_6 {
            padding: 2px 0 !important;
            line-height: 1.2 !important;
        }
        #pane-creativeSet .el-table__body-wrapper tbody td.el-table_1_column_5 .cell,
        #pane-creativeSet .el-table__body-wrapper tbody td.el-table_1_column_6 .cell {
            max-height: 40px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: normal !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
        }
    `;

    // 表格高度增加样式
    const increaseTableHeightStyles = `
        /* 使用更通用的选择器来增加表格区域的最大高度 */
        .el-table--fluid-height {
            max-height: none !important;
            height: auto !important;
        }

        /* 主表格的 body-wrapper 应用样式 */
        .el-table__body-wrapper {
            max-height: none !important;
            height: auto !important;
            overflow-y: auto !important;
        }

        /* 固定列容器也需要取消高度限制，让它能完整显示 */
        .el-table__fixed,
        .el-table__fixed-right {
            height: auto !important;
            max-height: none !important;
        }

        /* 固定列的 body-wrapper 同样取消高度限制 */
        .el-table__fixed-body-wrapper {
            max-height: none !important;
            height: auto !important;
            overflow-y: hidden !important;
        }
    `;

    let stylesInjected = false;
    let lastUrl = '';

    // 检查并注入样式的核心函数
    function checkAndInjectStyles() {
        const currentUrl = window.location.href;

        // URL 变化时记录日志
        if (currentUrl !== lastUrl) {
            console.log('[Mintegral Fix v2.05] URL changed to:', currentUrl);
            lastUrl = currentUrl;
        }

        // 样式全局应用，一次注入后就不再重复
        if (!stylesInjected) {
            // 检查是否有任何 Element UI 表格元素存在
            const elTableExists = document.querySelector('.el-table');

            if (elTableExists) {
                console.log('[Mintegral Fix v2.05] Element UI table detected. Injecting global styles...');
                injectStyles('mint-styles-v2', limitRowHeightStyles + increaseTableHeightStyles);
                stylesInjected = true;
            }
        }
    }

    // MutationObserver 监听页面变化
    const observer = new MutationObserver(checkAndInjectStyles);

    // 确保 observer 启动
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('[Mintegral Fix v2.05] MutationObserver started on document.body');
        } else {
            console.log('[Mintegral Fix v2.05] document.body not ready, retrying in 100ms...');
            setTimeout(startObserver, 100);
        }
    }

    // 初始化：立即检查一次，然后启动观察器
    console.log('[Mintegral Fix v2.05] Running initial check...');
    checkAndInjectStyles();

    console.log('[Mintegral Fix v2.05] Starting observer...');
    startObserver();

    // 监听 URL 变化（用于 SPA 路由切换）
    console.log('[Mintegral Fix v2.05] Setting up URL change monitor (500ms interval)...');
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            checkAndInjectStyles();
        }
    }, 500);

    console.log('[Mintegral Fix v2.05] Initialization complete');
})();
