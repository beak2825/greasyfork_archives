// ==UserScript==
// @name         去除b站搜索框中烦人的搜索提示
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  bilibili plugin
// @author       haonan.guo
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536574/%E5%8E%BB%E9%99%A4b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E4%B8%AD%E7%83%A6%E4%BA%BA%E7%9A%84%E6%90%9C%E7%B4%A2%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/536574/%E5%8E%BB%E9%99%A4b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E4%B8%AD%E7%83%A6%E4%BA%BA%E7%9A%84%E6%90%9C%E7%B4%A2%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePlaceholder() {
        const searchInput = document.querySelector('input.nav-search-input');
        if (searchInput) {
            searchInput.removeAttribute('placeholder');
        }
    }



    // 页面加载后立即执行
    removePlaceholder();

    // 监听DOM变化，防止动态加载
    const observer = new MutationObserver(function(mutations) {
        removePlaceholder();
    });

    // 开始观察整个body的子元素变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();