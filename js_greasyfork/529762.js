// ==UserScript==
// @name         X/Twitter 一键屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在推特推文右下方添加一键屏蔽按钮
// @author       @Maige
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529762/XTwitter%20%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529762/XTwitter%20%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        buttonColor: 'rgb(83, 100, 113)',
        hoverColor: 'rgb(244, 33, 46)',
        timeouts: {
            init: 1500,
            menuAppear: 300,
            confirmAppear: 300,
            closeMenu: 300
        },
        selectors: {
            tweet: 'article[data-testid="tweet"]',
            actionBar: '[role="group"]',
            userLink: 'a[role="link"][href*="/"]',
            moreButton: '[data-testid="caret"]',
            menuItem: '[role="menuitem"]',
            confirmButton: 'div[role="button"]'
        }
    };

    // 定义屏蔽按钮的SVG图标，保持Twitter风格
    const blockIconSVG = `
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi">
            <g>
                <path d="M12 3.75C7.99 3.75 4.75 7 4.75 11s3.24 7.25 7.25 7.25S19.25 15 19.25 11 16.01 3.75 12 3.75zm0 12.5c-2.9 0-5.25-2.35-5.25-5.25S9.1 5.75 12 5.75 17.25 8.1 17.25 11s-2.35 5.25-5.25 5.25z"></path>
                <path d="M12 2.75c-4.55 0-8.25 3.7-8.25 8.25s3.7 8.25 8.25 8.25 8.25-3.7 8.25-8.25S16.55 2.75 12 2.75zm0 14.5c-3.45 0-6.25-2.8-6.25-6.25S8.55 4.75 12 4.75s6.25 2.8 6.25 6.25-2.8 6.25-6.25 6.25z"></path>
                <path d="M18.35 4.35l-14 14 1.4 1.4 14-14-1.4-1.4z"></path>
            </g>
        </svg>
    `;

    // 监听DOM变化，为新加载的推文添加屏蔽按钮
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        const tweets = node.querySelectorAll(CONFIG.selectors.tweet);
                        if (tweets.length) tweets.forEach(addBlockButton);
                    }
                }
            }
        }
    });

    // 为已存在的推文添加屏蔽按钮
    function initExistingTweets() {
        const tweets = document.querySelectorAll(CONFIG.selectors.tweet);
        if (tweets.length) tweets.forEach(addBlockButton);
    }

    // 添加屏蔽按钮到推文
    function addBlockButton(tweet) {
        // 检查是否已经添加了屏蔽按钮
        if (tweet.querySelector('.one-click-block-btn')) return;

        // 查找推文的操作区域（右下角的分享、喜欢等按钮区域）
        const actionBar = tweet.querySelector(CONFIG.selectors.actionBar);
        if (!actionBar) return;

        // 创建屏蔽按钮
        const blockButton = document.createElement('div');
        blockButton.className = 'one-click-block-btn';
        blockButton.innerHTML = blockIconSVG;
        blockButton.title = '屏蔽此用户';
        blockButton.style.cssText = `
            cursor: pointer;
            display: inline-flex;
            margin-left: 8px;
            color: ${CONFIG.buttonColor};
        `;

        // 添加悬停效果
        blockButton.addEventListener('mouseover', () => blockButton.style.color = CONFIG.hoverColor);
        blockButton.addEventListener('mouseout', () => blockButton.style.color = CONFIG.buttonColor);

        // 添加点击事件
        blockButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 获取用户信息
            const userLink = tweet.querySelector(CONFIG.selectors.userLink);
            if (!userLink) return;
            
            const username = userLink.href.split('/').filter(Boolean).pop();
            if (!username) return;
            
            // 屏蔽用户
            blockUser(username, tweet);
        });

        // 将按钮添加到操作栏
        actionBar.appendChild(blockButton);
    }

    // 屏蔽用户的函数
    function blockUser(username, tweetElement) {
        // 查找用户的更多操作按钮
        const moreButton = tweetElement.querySelector(CONFIG.selectors.moreButton);
        if (!moreButton) {
            console.error(`无法找到用户 @${username} 的更多操作按钮`);
            return;
        }
        
        // 点击更多按钮
        moreButton.click();
        
        // 等待菜单出现并点击屏蔽选项
        setTimeout(() => {
            const blockOption = Array.from(document.querySelectorAll(CONFIG.selectors.menuItem))
                .find(item => item.textContent.includes('屏蔽') || item.textContent.includes('Block'));
            
            if (!blockOption) {
                document.body.click(); // 关闭菜单
                return;
            }
            
            // 点击屏蔽选项
            blockOption.click();
            
            // 等待确认对话框出现并确认
            setTimeout(() => {
                const confirmButton = Array.from(document.querySelectorAll(CONFIG.selectors.confirmButton))
                    .find(btn => btn.textContent.includes('屏蔽') || btn.textContent.includes('Block'));
                
                if (!confirmButton) {
                    document.body.click(); // 关闭菜单
                    return;
                }
                
                // 点击确认按钮
                confirmButton.click();
                console.log(`已屏蔽用户: @${username}`);
                
                // 关闭菜单
                setTimeout(() => document.body.click(), CONFIG.timeouts.closeMenu);
            }, CONFIG.timeouts.confirmAppear);
        }, CONFIG.timeouts.menuAppear);
    }

    // 初始化
    function init() {
        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 处理已存在的推文
        setTimeout(initExistingTweets, CONFIG.timeouts.init);
        
        // 处理页面内导航（Twitter是SPA）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(initExistingTweets, CONFIG.timeouts.init);
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 