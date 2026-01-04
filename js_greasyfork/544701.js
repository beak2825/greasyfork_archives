// ==UserScript==
// @name         B站自动聚焦搜索框优化版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开B站自动聚焦搜索框，适配最新页面结构
// @match        https://www.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544701/B%E7%AB%99%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544701/B%E7%AB%99%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面关键元素加载的函数，通过MutationObserver监听
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutationsList) => {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                observer.disconnect(); // 找到元素后停止监听
                callback(targetElement);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 调用等待函数，定位搜索框（根据实际class定位）
    waitForElement('.nav-search-input', (searchInput) => {
        searchInput.focus(); // 聚焦搜索框
        console.log('已成功聚焦B站搜索框');
    });
})();