// ==UserScript==
// @name         Linux.do/new threads auto read
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  每10秒自动点击每个新帖子，滚动到底部后返回继续点击下一个帖子，并避免重复访问。访问到最后一个帖子后重置访问记录。
// @author       3h2oto
// @match        https://linux.do/new
// @match        https://linux.do/t/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521547/Linuxdonew%20threads%20auto%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/521547/Linuxdonew%20threads%20auto%20read.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let visitedPosts = new Set();
    let isNavigating = false;
    let statusMessages = [];

    function updateStatus(message) {
        statusMessages.unshift(message);
        if (statusMessages.length > 5) {
            statusMessages.pop();
        }
        document.getElementById('status-content').textContent = statusMessages.join('\n');
    }

    // 从 new 页面获取所有未访问的帖子链接
    function getPostLinks() {
        const links = Array.from(document.querySelectorAll('a[href^="/t/topic/"]'))
            .filter(link => !visitedPosts.has(link.href));
        updateStatus(`获取到未访问的帖子链接数量: ${links.length}`);
        console.log('获取到未访问的帖子链接数量:', links.length);
        return links;
    }

    // 点击下一个帖子
    function clickNextPost(postLinks) {
        if (postLinks.length > 0) {
            const nextLink = postLinks.shift();
            // 获取原始链接
            const originalHref = nextLink.href;
            // 修改链接，添加 /1
            const modifiedHref = originalHref + '/1';

            updateStatus(`点击帖子链接: ${modifiedHref}`);
            console.log('点击帖子链接:', modifiedHref);

            visitedPosts.add(originalHref); // 将原始链接添加到已访问集合中
            visitedPosts.add(modifiedHref); // 将修改后的链接也添加到已访问集合中，避免重复访问
            isNavigating = true;

            // 使用修改后的链接跳转
            window.location.href = modifiedHref;
        } else {
            updateStatus('所有帖子已阅读完毕，清空访问记录');
            console.log('所有帖子已阅读完毕，清空访问记录');
            visitedPosts.clear();
            isNavigating = false;
            window.location.href = 'https://linux.do/new';
        }
    }

    // 模拟滚动到页面底部
    function scrollToBottom() {
        if (document.readyState !== 'complete') {
            setTimeout(scrollToBottom, 500);
            return;
        }

        const scrollableElement = document.documentElement;
        const scrollHeight = scrollableElement.scrollHeight;
        let currentScroll = scrollableElement.scrollTop;
        let previousScrollTop = 0;

        const scrollInterval = setInterval(() => {
            previousScrollTop = currentScroll;
            currentScroll += 100;
            scrollableElement.scrollTop = currentScroll;

            updateStatus(`当前滚动位置: ${currentScroll}`);
            console.log('当前滚动位置:', currentScroll);

            if (currentScroll + window.innerHeight >= scrollHeight || currentScroll === previousScrollTop) {
                updateStatus('已到达页面底部或停止滚动，准备返回');
                console.log('已到达页面底部或停止滚动，准备返回');
                clearInterval(scrollInterval);
                setTimeout(() => {
                    isNavigating = false;
                    visitedPosts.add(window.location.href);
                    // 修改返回逻辑，直接返回到 /new
                    window.location.href = 'https://linux.do/new';
                }, 1000);
            }
        }, 200);
    }

    // 主函数
    function main() {
        const currentURL = window.location.href;
        updateStatus(`当前页面: ${currentURL}`);
        console.log('当前页面:', currentURL);

        if (currentURL.includes('/new')) {
            const postLinks = getPostLinks();
            clickNextPost(postLinks);
        } else if (currentURL.includes('/t/topic/')) {
            if (!visitedPosts.has(currentURL) && !visitedPosts.has(currentURL.substring(0, currentURL.length - 2))) {
                scrollToBottom();
            } else {
                updateStatus('已处理过此帖子，返回上一页');
                console.log('已处理过此帖子，返回上一页');
                setTimeout(() => {
                    isNavigating = false;
                    window.location.href = 'https://linux.do/new';
                }, 1000);
            }
        }
    }

    // 监听 popstate 事件，在页面返回时执行
    window.addEventListener('popstate', function() {
        if (!isNavigating) {
            console.log("pop state 触发")
            setTimeout(() => {
                const postLinks = getPostLinks().map(link => {
                    return {
                        href: link.href + "/1",
                        click: () => {
                            window.location.href = link.href + "/1";
                        }
                    };
                });
                clickNextPost(postLinks);
            }, 1000);
        }
    });

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        // 创建悬浮窗口
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'status-display';
        statusDisplay.innerHTML = '<div id="status-content"></div>';
        document.body.appendChild(statusDisplay);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #status-display {
                position: fixed;
                top: 50px;
                right: 0px;
                width: 250px;
                background-color: rgba(0, 0, 0, 0.8);
                color: green;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 14px;
                pointer-events: none;
            }
            #status-content {
                white-space: pre-wrap;
            }
        `;
        document.head.appendChild(style);

        main();
    });

})();
