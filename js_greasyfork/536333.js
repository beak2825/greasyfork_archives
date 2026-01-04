// ==UserScript==
// @name         哔咔屏蔽
// @namespace    http://tampermonkey.net/
// @version      2025-05-17
// @description  try to blank the gay
// @author       You
// @match        https://manhuabika.com/*
// @match        https://manhuapika.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license            None
// @downloadURL https://update.greasyfork.org/scripts/536333/%E5%93%94%E5%92%94%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/536333/%E5%93%94%E5%92%94%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

// ==UserScript==
// @name         隐藏含“耽美花園”的条目
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面中隐藏 class="cat-item" 中包含 "耽美花園" 的条目
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 匹配关键词
    const keyword = '耽美花園';

    // 隐藏包含关键词的 .cat-item
    function hideItems() {
        document.querySelectorAll('.cat-item').forEach(item => {
            const category = item.querySelector('.c-cat');
            if (category && category.textContent.includes(keyword)) {
                item.style.display = 'none';
            }
        });
    }

    // 初始执行
    hideItems();

    // 监听动态加载内容
    const observer = new MutationObserver(() => {
        hideItems();
    });

    // 开始监听整个文档的 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();