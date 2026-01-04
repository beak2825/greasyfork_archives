// ==UserScript==
// @name         Google搜索栏添加放大镜图标（自用）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Google搜索栏右侧添加放大镜图标，点击后触发搜索操作。
// @author       Jinyou
// @license      MIT
// @match        https://www.google.com/*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518618/Google%E6%90%9C%E7%B4%A2%E6%A0%8F%E6%B7%BB%E5%8A%A0%E6%94%BE%E5%A4%A7%E9%95%9C%E5%9B%BE%E6%A0%87%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518618/Google%E6%90%9C%E7%B4%A2%E6%A0%8F%E6%B7%BB%E5%8A%A0%E6%94%BE%E5%A4%A7%E9%95%9C%E5%9B%BE%E6%A0%87%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加 Google Fonts 的 Material Symbols 字体
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // 等待页面加载完成
    window.addEventListener('load', function () {
        // 获取搜索框的父元素
        const searchBoxContainer = document.querySelector('.RNNXgb');

        if (!searchBoxContainer) return;

        // 创建放大镜按钮
        const magnifyingGlassBtn = document.createElement('button');
        magnifyingGlassBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 8px;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Material Symbols Outlined';
            font-size: 24px;
        `;

        // 插入 Material Symbols 图标
        magnifyingGlassBtn.innerHTML = '<span class="material-symbols-outlined">search</span>';

        // 为按钮添加点击事件
        magnifyingGlassBtn.addEventListener('click', function () {
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                // 模拟搜索操作
                searchInput.form.submit();
            }
        });

        // 将按钮添加到搜索框的右侧
        searchBoxContainer.appendChild(magnifyingGlassBtn);
    });
})();
