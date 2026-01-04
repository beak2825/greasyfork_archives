// ==UserScript==
// @name         隐藏低热度新闻 - Inoreader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动隐藏 Inoreader 中热度低的新闻卡片（通过判断 popularity_div_internal 是否含有 d-none）
// @author       You
// @match        *://*.inoreader.com/all_articles
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532502/%E9%9A%90%E8%97%8F%E4%BD%8E%E7%83%AD%E5%BA%A6%E6%96%B0%E9%97%BB%20-%20Inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/532502/%E9%9A%90%E8%97%8F%E4%BD%8E%E7%83%AD%E5%BA%A6%E6%96%B0%E9%97%BB%20-%20Inoreader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //console.log("开始筛选新闻卡片");

    function hideLowPopularityArticles() {
        //console.log("开始筛选新闻卡片");
        const readerPane = document.getElementById('reader_pane');
        if (!readerPane) return;

        const cards = readerPane.querySelectorAll(':scope > div'); // 只选直接子元素
        cards.forEach(card => {
            const popularityIconDiv = card.querySelector('.icon-sort-by-popularity');
            if (popularityIconDiv && popularityIconDiv.classList.contains('text-muted-color')) {
                //console.log("隐藏卡片",card);
                card.style.display = 'none';
            }
        });
    }

    // 初次运行
    hideLowPopularityArticles();

    // 监听新闻列表更新
    const observer = new MutationObserver(() => {
        hideLowPopularityArticles();
    });

    observer.observe(document.getElementById('reader_pane'), {
        childList: true,
        subtree: true
    });
})();