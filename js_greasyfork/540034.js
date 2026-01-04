// ==UserScript==
// @name         Steam 动态过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  显示特定用户动态
// @match        https://steamcommunity.com/id/*/home
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540034/Steam%20%E5%8A%A8%E6%80%81%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540034/Steam%20%E5%8A%A8%E6%80%81%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const allowedAuthors = []; // 替换为白名单用户名列表

    // 独立 blotter_block
    function filterTypeABlocks() {
        document.querySelectorAll('.blotter_block').forEach(block => {
            const authorLink = block.querySelector('.blotter_author_block > div:nth-child(2) > a');
            if (authorLink) {
                const authorName = authorLink.innerText.trim();
                if (!allowedAuthors.includes(authorName)) {
                    block.remove();
                }
            }
        });
    }

    //多动态共享 blotter_block
    function filterTypeBGrouped() {
        document.querySelectorAll('.blotter_block').forEach(block => {
            const children = Array.from(block.children[0]?.children || []);
            children.forEach(child => {
                const authorLink = child.querySelector('span > a:nth-child(1)');
                if (authorLink) {
                    const authorName = authorLink.innerText.trim();
                    if (!allowedAuthors.includes(authorName)) {
                        child.remove();
                    }
                }
            });
        });
    }

    function runFilters() {
        if (allowedAuthors.length === 0) return;
        filterTypeABlocks();
        filterTypeBGrouped();
    }

    runFilters();

    const observer = new MutationObserver(() => {
        runFilters();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
