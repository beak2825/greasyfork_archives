// ==UserScript==
// @name         L 站新帖自动阅读
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每10秒自动点击每个新帖子，滚动到底部后返回继续点击下一个帖子，并避免重复访问。访问到最后一个帖子后重置访问记录。
// @author       Gangz1o
// @match        https://linux.do/new
// @match        https://linux.do/t/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505228/L%20%E7%AB%99%E6%96%B0%E5%B8%96%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/505228/L%20%E7%AB%99%E6%96%B0%E5%B8%96%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let postLinks = [];
    let currentIndex = 0;
    let isNavigating = false;

    // 从 new 页面获取所有帖子链接
    function getPostLinks() {
        postLinks = Array.from(document.querySelectorAll('a[href^="/t/topic/"]')).filter(link => {
            return !localStorage.getItem(link.href); // 过滤掉已经访问过的链接
        });
        console.log('获取到未访问的帖子链接数量:', postLinks.length);
    }

    // 点击下一个帖子
    function clickNextPost() {
        if (currentIndex < postLinks.length) {
            const nextLink = postLinks[currentIndex];
            console.log('点击帖子链接:', nextLink.href);
            localStorage.setItem(nextLink.href, 'visited'); // 记录已访问的链接
            currentIndex++;
            isNavigating = true;
            nextLink.click();
        } else {
            console.log('所有帖子已阅读完毕，清空访问记录');
            localStorage.clear(); // 清空 localStorage
            currentIndex = 0;
            setTimeout(getPostLinks, 1000); // 重新获取帖子链接
        }
    }

    // 自动滚动页面到底部
    function autoScroll() {
        let previousScrollY = window.scrollY;
        let scrollInterval = setInterval(() => {
            window.scrollBy(0, 1000);

            // 打印当前滚动位置
            console.log('当前滚动位置:', window.scrollY);

            // 检查是否到达页面底部
            if (window.scrollY === previousScrollY) {
                console.log('已到达页面底部，准备返回');
                clearInterval(scrollInterval);
                setTimeout(() => {
                    isNavigating = false;
                    localStorage.setItem(window.location.href, 'visited'); // 再次标记当前帖子为已访问
                    window.history.back();
                }, 1000);
            }
            previousScrollY = window.scrollY;
        }, 500);
    }

    // 页面加载完成后执行的逻辑
    function executeTask() {
        const currentURL = window.location.href;
        console.log('当前页面:', currentURL);

        // 检查当前页面是否是 new 页面
        if (currentURL.includes('/new')) {
            getPostLinks();
            clickNextPost();
        }
        // 检查当前页面是否是帖子详情页面
        else if (currentURL.includes('/t/topic/')) {
            if (!localStorage.getItem(currentURL)) {
                // 等待页面加载和渲染完成后再开始滚动
                setTimeout(autoScroll, 2000);
            } else {
                // 如果已经处理过这个帖子，则直接返回上一页
                console.log('已处理过此帖子，返回上一页');
                setTimeout(() => {
                    isNavigating = false;
                    window.history.back();
                }, 1000);
            }
        }
    }

    // 设置定时任务，每10秒执行一次
    setInterval(executeTask, 10000);

    // 监听返回事件，返回后点击下一个帖子
    window.addEventListener('popstate', function() {
        setTimeout(clickNextPost, 1000);
    });

    // 在标签页关闭时清空 localStorage
    window.addEventListener('unload', function() {
        if (!isNavigating) {
            console.log('标签页关闭，清理访问记录');
            localStorage.clear();
        }
    });

})();