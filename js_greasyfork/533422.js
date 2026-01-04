// ==UserScript==
// @name         百度搜索框移除推荐
// @icon         https://www.baidu.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除百度首页搜索框的placeholder文本以实现移除推荐的功能
// @author       chenflxs
// @match        https://www.baidu.com/*
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533422/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%A7%BB%E9%99%A4%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/533422/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%A7%BB%E9%99%A4%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除placeholder的函数
    function removePlaceholder() {
        const searchInput = document.querySelector('.s_ipt');
        if (searchInput && searchInput.placeholder) {
            searchInput.placeholder = '';
            console.log('Placeholder已被移除');
        }
    }

    // 页面加载时立即执行一次
    removePlaceholder();

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                removePlaceholder();
            }
        });
    });

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder']
    };

    // 开始观察整个文档
    observer.observe(document.body, config);

    // 定时检查，确保placeholder被移除（作为备选方案）
    setInterval(removePlaceholder, 1000);
})();