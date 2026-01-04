// ==UserScript==
// @name         知乎直答链接转谷歌搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将知乎上的直答链接重定向到谷歌搜索
// @author       You
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530505/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E9%93%BE%E6%8E%A5%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/530505/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E9%93%BE%E6%8E%A5%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /**
     * 将知乎直答链接修改为谷歌搜索链接
     * @summary 监听页面变化并处理直答链接
     */
    function processLinks() {
        // 查找所有知乎直答链接
        const zhidaLinks = document.querySelectorAll(
            'a[href*="zhida.zhihu.com"]'
        );

        zhidaLinks.forEach((link) => {
            // 获取链接中的搜索词
            const url = new URL(link.href);
            const searchParams = url.searchParams;
            const keyword = searchParams.get("q");

            if (keyword) {
                // 解码搜索词（因为URL中是编码过的）
                const decodedKeyword = decodeURIComponent(keyword);

                // 创建谷歌搜索链接
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                    decodedKeyword
                )}`;

                // 替换原有链接
                link.href = googleSearchUrl;

                // 修改链接外观，添加提示
                link.style.color = "#4285F4"; // Google蓝色
                link.title = `在Google搜索: ${decodedKeyword}`;

                // 阻止知乎的默认事件处理
                link.addEventListener("click", function (e) {
                    e.stopPropagation();
                });
            }
        });
    }

    // 初始处理
    document.addEventListener("DOMContentLoaded", processLinks);

    // 使用MutationObserver监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function (mutations) {
        processLinks();
    });

    // 开始观察
    document.addEventListener("DOMContentLoaded", function () {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();
