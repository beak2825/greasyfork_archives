// ==UserScript==
// @name         元典智库标题清理优化版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去掉元典智库网页标题的前缀，只保留法规名称和案例名称，网页多开时能快速查询对应的标题

// @author       江山
// @match        https://ydzk.chineselaw.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532168/%E5%85%83%E5%85%B8%E6%99%BA%E5%BA%93%E6%A0%87%E9%A2%98%E6%B8%85%E7%90%86%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/532168/%E5%85%83%E5%85%B8%E6%99%BA%E5%BA%93%E6%A0%87%E9%A2%98%E6%B8%85%E7%90%86%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要去掉的固定前缀正则表达式
    const prefixRegex = /^元典智库：?/;

    // 监听标题变化的函数
    function modifyTitle() {
        let title = document.title;

        // 如果标题匹配固定前缀，则去掉前缀
        if (title && prefixRegex.test(title)) {
            // 去掉固定前缀
            let newTitle = title.replace(prefixRegex, "").trim();

            // 更新页面标题
            document.title = newTitle;
        }
    }

    // 使用 MutationObserver 监听标题变化
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.nodeName === 'TITLE') {
                modifyTitle();
            }
        });
    });

    // 开始观察 <title> 标签的变化
    let titleElement = document.querySelector('title');
    if (titleElement) {
        observer.observe(titleElement, { childList: true });
    }

    // 初始检查
    modifyTitle();
})();