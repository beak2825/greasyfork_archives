// ==UserScript==
// @name         Google搜索结果新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让谷歌搜索结果在新标签页打开
// @author       Your name
// @license      MIT
// @match        *://www.google.com/search*
// @match        *://www.google.com.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524902/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/524902/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        processSearchResults();
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 处理搜索结果链接
    function processSearchResults() {
        // 获取所有搜索结果链接
        const searchResults = document.querySelectorAll("a");

        searchResults.forEach((link) => {
            // 跳过已处理的链接
            if (link.dataset.processed) return;

            // 排除谷歌内部链接
            if (!link.href || link.href.includes("google.com/")) return;

            // 标记为已处理
            link.dataset.processed = "true";

            // 设置在新标签页打开
            link.setAttribute("target", "_blank");

            // 添加 rel 属性以提高安全性
            link.setAttribute("rel", "noopener noreferrer");
        });
    }

    // 初始执行一次
    processSearchResults();
})();
