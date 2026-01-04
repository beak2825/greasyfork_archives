// ==UserScript==
// @name         KamePT Male Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide specific categories on KamePT
// @author       Your name
// @match        https://kamept.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529733/KamePT%20Male%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/529733/KamePT%20Male%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        // 等待种子表格加载完成
        const checkExist = setInterval(function() {
            const table = document.querySelector('table.torrents');
            if (table) {
                clearInterval(checkExist);
                hideRows();
            }
        }, 100);
    }

    function hideRows() {
        // 获取种子表格中的所有行
        const rows = document.querySelectorAll('table.torrents tr');

        rows.forEach(row => {
            // 获取第一个td
            const firstTd = row.querySelector('td:first-child');
            if (firstTd) {
                // 查找男娘分类图标
                const categoryImg = firstTd.querySelector('img[title="男娘"]');
                if (categoryImg) {
                    // 如果找到男娘分类,隐藏整行
                    row.style.display = 'none';
                }
            }
        });
    }

    // 监听页面变化
    const observer = new MutationObserver(hideRows);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后运行
    window.addEventListener('load', init);
})();