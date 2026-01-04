// ==UserScript==
// @name         bt1207so添加深色背景（跟随系统）
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  该插件的作用是给bt1207so添加深色背景（跟随系统），原版太亮了刺眼
// @author       biolxy
// @license      MIT
// @match        https://bt1207so.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bt1207so.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539257/bt1207so%E6%B7%BB%E5%8A%A0%E6%B7%B1%E8%89%B2%E8%83%8C%E6%99%AF%EF%BC%88%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539257/bt1207so%E6%B7%BB%E5%8A%A0%E6%B7%B1%E8%89%B2%E8%83%8C%E6%99%AF%EF%BC%88%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建自适应背景样式的函数
    function updateBackground() {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 移除旧样式（如果存在）
        const oldStyle = document.getElementById('dynamic-background-style');
        if (oldStyle) oldStyle.remove();

        if (darkMode) {
            // 创建新样式
            const style = document.createElement('style');
            style.id = 'dynamic-background-style';
            // 设置背景颜色并保持其他样式不变
            style.textContent = `
                html, body {
                    background-color: #1C1C1C !important;
                }

                /* 修复可能受影响的输入框背景 */
                input, textarea, select {
                    background-color: #ffffff !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // #282C34
    // 初始加载时执行
    updateBackground();

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', updateBackground);

})();