// ==UserScript==
// @name         虎扑帖子列表扩展
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将虎扑帖子列表页每页显示条目数从50扩大到250条
// @author       You
// @match        https://bbs.hupu.com/*
// @grant        none
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/537547/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/537547/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const TARGET_COUNT = 201;     // 目标加载条目数
    const LOAD_DELAY = 1500;      // 加载等待时间（毫秒）
    const MAX_ATTEMPTS = 10;      // 最大加载尝试次数
    const OBSERVER_DELAY = 500;   // 观察者检测间隔

    // 主要执行函数
    function expandPostList() {
        // 检测是否在帖子列表页面
        if (!isValidPage()) return;

        let loadedCount = 0;
        let attempts = 0;
        let lastItemCount = -1;

        // 创建观察者检测内容变化
        const observer = new MutationObserver(() => {
            const currentCount = getCurrentItemCount();
            if (currentCount > loadedCount) {
                loadedCount = currentCount;
                console.log(`已加载: ${loadedCount}条`);
            }
        });

        // 开始观察内容区域
        const contentNode = document.querySelector('.bbs-sl-web-post');
        if (contentNode) {
            observer.observe(contentNode, {
                childList: true,
                subtree: true
            });
        }

        // 滚动加载函数
        function scrollToLoad() {
            attempts++;
            const currentCount = getCurrentItemCount();

            // 达到目标或超出尝试次数时停止
            if (currentCount >= TARGET_COUNT || attempts > MAX_ATTEMPTS) {
                observer.disconnect();
                console.log(`加载完成，当前条目数: ${currentCount}`);
                return;
            }

            // 检测是否卡住
            if (currentCount === lastItemCount) {
                console.log('未检测到新内容，尝试滚动加载...');
                window.scrollTo(0, document.body.scrollHeight);
            }

            lastItemCount = currentCount;
            setTimeout(scrollToLoad, LOAD_DELAY);
        }

        // 初始滚动触发加载
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(scrollToLoad, OBSERVER_DELAY);
        }, 1000);
    }

    // 检测当前页面是否有效
    function isValidPage() {
        const path = window.location.pathname;
        return path.includes('-postdate') || 
               path.includes('topic-daily-hot') ||
               path.includes('bxj') ||
               document.querySelector('.bbs-sl-web-post');
    }

    // 获取当前条目数量
    function getCurrentItemCount() {
        return document.querySelectorAll('.bbs-sl-web-post__item').length;
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        expandPostList();
    } else {
        window.addEventListener('load', expandPostList);
    }
})();