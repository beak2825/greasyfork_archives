// ==UserScript==
// @name        踩蘑菇隐藏侧边栏
// @namespace   Violentmonkey Scripts
// @match       https://www.caimogu.cc/*
// @grant       none
// @version   1.21
// @author      希尔薇
// @description 2025/4/21 11点49分
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533473/%E8%B8%A9%E8%98%91%E8%8F%87%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533473/%E8%B8%A9%E8%98%91%E8%8F%87%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取具有指定 class 的 div 元素
        const sidebar = document.querySelector('.sidebar.simple');

        // 获取 search-bar 的父元素
        const searchBarParent = document.querySelector('.info.simple');
        const searchBar = searchBarParent?.querySelector('.search-bar');

        if (sidebar && searchBar) {
            // 创建按钮
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '隐藏侧边栏';

            // 设置按钮样式
            toggleButton.style.marginRight = '10px';
            toggleButton.style.padding = '8px 16px';
            toggleButton.style.backgroundColor = '#007BFF';
            toggleButton.style.color = 'white';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '4px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.transition = 'background-color 0.3s ease';

            // 鼠标悬停样式
            toggleButton.addEventListener('mouseover', function() {
                toggleButton.style.backgroundColor = '#0056b3';
            });

            // 鼠标移开样式
            toggleButton.addEventListener('mouseout', function() {
                toggleButton.style.backgroundColor = '#007BFF';
            });

            // 按钮点击事件处理函数
            toggleButton.addEventListener('click', function() {
                if (sidebar.style.display === 'none') {
                    sidebar.style.display = '';
                    toggleButton.textContent = '隐藏侧边栏';
                } else {
                    sidebar.style.display = 'none';
                    toggleButton.textContent = '显示侧边栏';
                }
            });

            // 将按钮插入到 search-bar 之前
            searchBarParent.insertBefore(toggleButton, searchBar);
        }
    });
})();    