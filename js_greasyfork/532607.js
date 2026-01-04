// ==UserScript==
// @name         麻豆重排序
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据观看次数重新排序视频列表
// @author       taxueqinyin,DeepSeek
// @license      GPL-3.0
// @match        *.madou.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=madou.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532607/%E9%BA%BB%E8%B1%86%E9%87%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/532607/%E9%BA%BB%E8%B1%86%E9%87%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('Madou Rerank');
    // 监听的目标容器选择器
    const containerSelector = 'div.excerpts.native_plug_container';
    // 视频元素选择器
    const articleSelector = 'article.excerpt.excerpt-c5';
    // 观看次数元素选择器
    const viewCountSelector = 'article footer > span';

    // 解析观看次数为数字
    function parseViewCount(text) {
        const match = text.match(/观看\((\d+(?:\.\d+)?)([KMB]?)\)/);
        if (!match) {
            console.log('未匹配到观看次数格式');
            return 0;
        }

        let num = parseFloat(match[1]);
        const unit = match[2];

        if (unit === 'K') num *= 1000;
        else if (unit === 'M') num *= 1000000;
        else if (unit === 'B') num *= 1000000000;
        return num;
    }

    // 根据观看次数排序视频
    function sortArticles() {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const articles = Array.from(container.querySelectorAll(articleSelector));
        if (articles.length < 2) return;
        // 为每个视频添加观看次数数据
        const articlesWithViews = articles.map(article => {
            const viewSpan = article.querySelector(viewCountSelector);
            const viewText = viewSpan ? viewSpan.textContent : '';
            const viewCount = parseViewCount(viewText);
            return { article, viewCount };
        });
        // 按观看次数降序排序
        articlesWithViews.sort((a, b) => b.viewCount - a.viewCount);

        // 重新插入排序后的视频
        const fragment = document.createDocumentFragment();
        articlesWithViews.forEach(({ article }) => {
            fragment.appendChild(article);
        });
        container.innerHTML = '';
        container.appendChild(fragment);
        console.log("rerank");
    }

    // 使用MutationObserver监听容器变化
    function observeContainer() {
        const container = document.querySelector(containerSelector);
        if (!container) {
            // 容器不存在，稍后重试
            setTimeout(observeContainer, 1000);
            return;
        }

        // 初始排序
        sortArticles();

        // 监听子元素变化
        // 添加防抖函数
        function debounce(func, delay) {
            let timer;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, arguments), delay);
            };
        }

        const debouncedSort = debounce(sortArticles, 300);
        let lastArticleCount = 0;

        const observer = new MutationObserver((mutations) => {
            let hasNewArticles = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const currentCount = container.querySelectorAll(articleSelector).length;
                    if (currentCount > lastArticleCount) {
                        hasNewArticles = true;
                        lastArticleCount = currentCount;
                        break;
                    }
                }
            }
            if (hasNewArticles) {
                debouncedSort();
            }
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // 页面加载完成后开始监听
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeContainer);
    } else {
        observeContainer();
    }
})();