// ==UserScript==
// @name         亚马逊搜索结果推广屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  屏蔽亚马逊搜索结果中的推广内容，在页面加载和搜索结果更新时执行
// @match        https://www.amazon.co.jp/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/504473/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%A8%E5%B9%BF%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/504473/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%A8%E5%B9%BF%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePromotedContent() {
        console.log('执行屏蔽操作');
        const searchResultsDiv = document.querySelector('div.s-main-slot.s-result-list');
        if (!searchResultsDiv) return;

        const sponsoredElements = searchResultsDiv.querySelectorAll('div[data-component-type="sp-sponsored-result"], div.AdHolder, div[data-component-type="s-sponsored-listings-card"]');
        sponsoredElements.forEach(element => {
            let parent = element.closest('div[data-asin]');
            if (parent) {
                parent.style.display = 'none';
                console.log('隐藏了一个推广元素');
            }
        });
    }

    function onSearchResultsUpdate(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('s-main-slot')) {
                hidePromotedContent();
                break;
            }
        }
    }

    // 在页面加载完成后执行一次
    window.addEventListener('load', hidePromotedContent);

    // 创建一个MutationObserver来监视搜索结果的变化
    const observer = new MutationObserver(onSearchResultsUpdate);

    // 配置observer
    const config = { childList: true, subtree: true };

    // 开始观察搜索结果容器的变化
    const targetNode = document.querySelector('span[data-component-type="s-search-results"]');
    if (targetNode) {
        observer.observe(targetNode, config);
    }
})();