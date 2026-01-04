// ==UserScript==
// @name         去除Bing搜索中的知乎
// @namespace    huelse/js-scripts/bing-filter
// @version      1.0.2
// @description  Filters Bing search results based on keywords.
// @author       crayon
// @match        https://*.bing.com/*
// @grant        none
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/500094/%E5%8E%BB%E9%99%A4Bing%E6%90%9C%E7%B4%A2%E4%B8%AD%E7%9A%84%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/500094/%E5%8E%BB%E9%99%A4Bing%E6%90%9C%E7%B4%A2%E4%B8%AD%E7%9A%84%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽关键词列表
    const block_list = [ 'zhihu', 'ZHIHU', '知乎'];

    function filterResults() {
        const item_list = document.querySelectorAll('.b_algo');

        item_list.forEach(item => {
            const text = item.textContent;
            if (block_list.some(keyword => text.includes(keyword))) {
                item.style.display = 'none';
            }
        });
    }

    // 在页面加载完成后执行过滤
    window.addEventListener('load', function() {
        filterResults();
    });
})();