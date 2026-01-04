// ==UserScript==
// @name         B站UP主空间分页按钮和文字等比放大
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  等比放大B站UP主空间页面中分页按钮和文字的尺寸，保留原有样式
// @author       li
// @match        https://space.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524316/B%E7%AB%99UP%E4%B8%BB%E7%A9%BA%E9%97%B4%E5%88%86%E9%A1%B5%E6%8C%89%E9%92%AE%E5%92%8C%E6%96%87%E5%AD%97%E7%AD%89%E6%AF%94%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/524316/B%E7%AB%99UP%E4%B8%BB%E7%A9%BA%E9%97%B4%E5%88%86%E9%A1%B5%E6%8C%89%E9%92%AE%E5%92%8C%E6%96%87%E5%AD%97%E7%AD%89%E6%AF%94%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要放大的样式
    const style = `
        /* 分页按钮容器 */
        .vui_pagenation--btns {
            display: flex;
            align-items: center;
            gap: 12px; /* 增加按钮之间的间距 */
        }

        /* 分页按钮 */
        .vui_pagenation--btn {
            transform: scale(1.35); /* 等比放大 1.35 倍 */
            transform-origin: center; /* 缩放中心点 */
        }

        /* 上一页按钮 */
        .vui_pagenation--btn-side:first-child {
            margin-right: 22px !important; /* 单独增加上一页按钮的右边距 */
        }

        /* 下一页按钮 */
        .vui_pagenation--btn-side:last-child {
            margin-left: 12px !important; /* 单独增加下一页按钮的左边距 */
        }

        /* 分页文字（共 36 页 / 1404 个，跳至 页） */
        .vui_pagenation-go {
            transform: scale(1.35); /* 等比放大 1.35 倍 */
            transform-origin: left center; /* 缩放中心点 */
            margin-left: 12px; /* 调整与按钮的间距 */
        }

        /* 输入框 */
        .vui_input__input {
            transform: scale(1.35); /* 等比放大 1.35 倍 */
            transform-origin: left center; /* 缩放中心点 */
        }
    `;

    // 创建样式元素并插入到页面中
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    console.log('B站UP主空间分页按钮和文字已等比放大 1.35 倍！');
})();