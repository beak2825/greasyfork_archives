// ==UserScript==
// @name         屏蔽百度右侧热搜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽百度搜索结果页右侧的“百度热搜”板块
// @author       YourName
// @match        https://www.baidu.com/s?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528942/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%8F%B3%E4%BE%A7%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/528942/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%8F%B3%E4%BE%A7%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSelectors = [
        '#content_right',          // 右侧容器ID
        '.s-hotsearch-wrapper',    // 热搜容器类
        '#rsv-right',               // 备用右侧容器ID
        '.s-news-rank-content'      // 新闻排行容器类
    ];

    function hideHotSearch() {
        // 通过选择器查找元素
        for (const selector of targetSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                return true;
            }
        }

        // 通过文本内容查找（适配动态更新）
        const xpath = '//*[contains(text(), "百度热搜") or contains(text(), "热搜新闻")]/ancestor::div[1]';
        const heading = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (heading) {
            heading.style.display = 'none';
            return true;
        }

        return false;
    }

    // 立即执行屏蔽
    if (hideHotSearch()) return;

    // 动态内容监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (hideHotSearch()) observer.disconnect();
        });
    });

    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 10秒后自动停止监听
    setTimeout(() => observer.disconnect(), 10000);
})();