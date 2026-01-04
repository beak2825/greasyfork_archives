// ==UserScript==
// @name         自动浏览文章脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动收集文章链接并浏览每一篇文章，滚动至底部后自动跳转到下一篇文章。
// @author       You
// @match        https://linux.do/c/general/qa/28
// @match        https://linux.do/t/topic/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491072/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E6%96%87%E7%AB%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491072/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E6%96%87%E7%AB%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isArticleListPage = window.location.href.includes('general');
    const isArticlePage = window.location.href.includes('topic');

    function startBrowsingFromList() {
        let links = new Set(); // 使用Set来自动去重
        let lastScrollHeight = 0;

        function collectLinksAndScroll() {
            document.querySelectorAll('a.title.raw-link.raw-topic-link').forEach(link => {
                links.add(link.href);
            });

            if (document.body.scrollHeight > lastScrollHeight) {
                lastScrollHeight = document.body.scrollHeight;
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(collectLinksAndScroll, 2000); // 等待更多内容加载
            } else {
                startBrowsing(Array.from(links)); // 转换为数组进行处理
            }
        }

        function startBrowsing(links) {
            localStorage.setItem('articleLinks', JSON.stringify(links));
            localStorage.setItem('currentIndex', '0');
            if (links.length > 0) {
                window.location.href = links[0];
            }
        }

        collectLinksAndScroll();
    }

    function browseArticle() {
        let currentIndex = parseInt(localStorage.getItem('currentIndex'), 10);
        let links = JSON.parse(localStorage.getItem('articleLinks'));

        function scrollToBottomAndNavigate() {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 1) {
                currentIndex++;
                if (currentIndex < links.length) {
                    localStorage.setItem('currentIndex', currentIndex.toString());
                    window.location.href = links[currentIndex];
                } else {
                    console.log("完成所有文章的浏览");
                    localStorage.clear(); // 清理所有存储数据
                }
            } else {
                window.scrollBy(0, 200);
                setTimeout(scrollToBottomAndNavigate, 1500); // 延时减少，减少内存压力
            }
        }

        scrollToBottomAndNavigate();
    }

    if (isArticleListPage) {
        startBrowsingFromList();
    } else if (isArticlePage && localStorage.getItem('articleLinks')) {
        browseArticle();
    }
})();
