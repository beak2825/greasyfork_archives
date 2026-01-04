// ==UserScript==
// @license MIT
// @name         Twitter/X Search Filter (Simple)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter Twitter/X search results by keywords or accounts
// @author       Grok
// @match        *://twitter.com/*
// @match        *://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534291/TwitterX%20Search%20Filter%20%28Simple%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534291/TwitterX%20Search%20Filter%20%28Simple%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：需要过滤的关键词和账户
    const filterConfig = {
        keywords: ['广告', '推广', 'spam'], // 需要屏蔽的关键词
        accounts: ['example_user', 'bot_account'], // 需要屏蔽的账户（@用户名，去掉@）
        hideStyle: 'opacity: 0.3;' // 隐藏样式（可改为 'display: none;' 完全隐藏）
    };

    // 主过滤函数
    function filterTweets() {
        // 获取所有推文元素
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        
        tweets.forEach(tweet => {
            try {
                // 获取推文文本
                const text = tweet.textContent.toLowerCase();
                // 获取推文作者（用户名）
                const usernameElement = tweet.querySelector('a[href*="/"]');
                const username = usernameElement ? usernameElement.getAttribute('href').split('/')[1].toLowerCase() : '';

                // 检查是否需要隐藏
                const hideTweet = filterConfig.keywords.some(keyword => text.includes(keyword.toLowerCase())) ||
                                 filterConfig.accounts.includes(username);

                if (hideTweet) {
                    tweet.style.cssText = filterConfig.hideStyle;
                }
            } catch (e) {
                console.error('Error processing tweet:', e);
            }
        });
    }

    // 动态监听页面变化（Twitter/X是动态加载的）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            filterTweets();
        });
    });

    // 启动观察器
    function startObserver() {
        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
            filterTweets(); // 初始过滤
        } else {
            setTimeout(startObserver, 1000); // 如果页面未加载完成，延迟重试
        }
    }

    // 初始化
    startObserver();

    // 快捷键开关（按Ctrl+Shift+F切换过滤）
    let isFilterEnabled = true;
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            isFilterEnabled = !isFilterEnabled;
            if (isFilterEnabled) {
                filterTweets();
                console.log('Twitter/X Search Filter: Enabled');
            } else {
                document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
                    tweet.style.cssText = ''; // 恢复显示
                });
                console.log('Twitter/X Search Filter: Disabled');
            }
        }
    });

})();