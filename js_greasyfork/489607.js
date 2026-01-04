// ==UserScript==
// @name         linux.do看帖懒人神器
// @namespace    
// @version      2024-03-12 1.1.1
// @description  帮你点开新帖子，帮你从上到下滑动，帮你选择下一个看的帖子。
// @author       
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489607/linuxdo%E7%9C%8B%E5%B8%96%E6%87%92%E4%BA%BA%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489607/linuxdo%E7%9C%8B%E5%B8%96%E6%87%92%E4%BA%BA%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitSomeSeconds() {
        setTimeout(function() {
            console.log('10秒钟已过！');
window.location.href="/latest";
            }, 10000); // 10000毫秒等于10秒
        };
    function clickRandomTitle() {
        const titles = document.getElementsByClassName('title raw-link raw-topic-link');
        if (titles.length > 0) {
            const randomIndex = Math.floor(Math.random() * titles.length);
            const randomTitle = titles[randomIndex];
            randomTitle.click();
        } else {
            console.log('No elements found with the specified class names.');

        }
    }

    function scrollToBottom() {
        const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (!isBottom) {
            window.scrollBy(0, 100);
            setTimeout(scrollToBottom, 1000); // 控制滚动间隔
        } else {

            var dd='抱歉，我们无法加载该话题，可能是由于连接问题。请重试。如果问题仍然存在，请告诉我们。';
            if(document.body.textContent.includes(dd)){waitSomeSeconds();}else{clickRandomTitle();
            console.log("Reached the bottom of the page.");};

        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function hasPageUpdated(mutations) {
        return mutations.some(mutation => mutation.addedNodes.length > 0);
    }

    // 使用防抖函数来控制scrollToBottom的调用
    const debouncedScrollToBottom = debounce(scrollToBottom, 1000); // 1秒后执行

    // 监听滚动事件，并在用户停止滚动后执行debouncedScrollToBottom
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(debouncedScrollToBottom, 1000); // 1秒后执行
    });

    // 监听DOM变化
    const observer = new MutationObserver(mutations => {
        if (hasPageUpdated(mutations)) {
            debouncedScrollToBottom();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 等待页面加载完毕
    document.addEventListener('DOMContentLoaded', () => {
        debouncedScrollToBottom();
        // 不要立即执行scrollToBottom，而是在用户滚动时触发
    });

})();
