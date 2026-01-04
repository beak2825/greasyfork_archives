// ==UserScript==
// @name        删除B站搜索框提示文字
// @namespace   Violentmonkey Scripts
// @match       *://*bilibili.com/*
// @grant       none
// @version     1.0
// @author      yzjn6
// @description 2025/5/7 20:25:15
// @license     All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/535241/%E5%88%A0%E9%99%A4B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%8F%90%E7%A4%BA%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/535241/%E5%88%A0%E9%99%A4B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%8F%90%E7%A4%BA%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清空搜索框的 placeholder
    function clearPlaceholder() {
        const searchInput = document.querySelector('.nav-search-input');
        if (searchInput) {
            searchInput.placeholder = '';
        }
    }

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(function(mutations) {
        clearPlaceholder();
    });

    // 配置 observer
    const config = {
        childList: true,    // 观察目标子节点的变化
        subtree: true       // 观察所有后代节点
    };

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 初始清空
        clearPlaceholder();

        // 开始观察整个文档
        observer.observe(document.body, config);
    });
})(); 