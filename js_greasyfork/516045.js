// ==UserScript==
// @name         Replace Zhihu Links with Google Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将知乎中的指定链接替换为Google搜索关键词的链接
// @match        *://*.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516045/Replace%20Zhihu%20Links%20with%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/516045/Replace%20Zhihu%20Links%20with%20Google%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 函数：替换链接为Google搜索
    function replaceLinks() {
        const links = document.querySelectorAll('a.RichContent-EntityWord[data-paste-text="true"]');
        links.forEach(link => {
            const keyword = link.textContent;
            if (keyword) {
                link.href = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
                link.target = "_blank";  // 新标签页打开
            }
        });
    }

    // 监听页面变动以实时更新
    const observer = new MutationObserver(() => {
        replaceLinks();
    });

    // 监控整个页面
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    replaceLinks();
})();
