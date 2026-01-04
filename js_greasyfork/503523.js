// ==UserScript==
// @name         linux.do屏蔽指定版块帖子和用户
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  屏蔽linux.do论坛中指定版块和用户的帖子，支持多个版块和用户的自定义配置，包括取消屏蔽功能。
// @author       linux.do
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503523/linuxdo%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E7%89%88%E5%9D%97%E5%B8%96%E5%AD%90%E5%92%8C%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/503523/linuxdo%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E7%89%88%E5%9D%97%E5%B8%96%E5%AD%90%E5%92%8C%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认屏蔽的版块和用户列表
    let blockedCategories = GM_getValue('blockedCategories', ['搞七捻三', '病友']);
    let blockedUsers = GM_getValue('blockedUsers', []);

    // 添加配置菜单选项
    GM_registerMenuCommand('配置屏蔽的版块', configureBlockedCategories);
    GM_registerMenuCommand('配置屏蔽的用户', configureBlockedUsers);

    // 配置屏蔽的版块
    function configureBlockedCategories() {
        const categories = prompt('请输入要屏蔽的版块名称，用逗号分隔：', blockedCategories.join(', '));
        if (categories !== null) {
            blockedCategories = categories.split(',').map(category => category.trim());
            GM_setValue('blockedCategories', blockedCategories);
            alert('屏蔽的版块已更新。请刷新页面以应用更改。');
            filterPosts(); // 刷新页面内容
        }
    }

    // 配置屏蔽的用户
    function configureBlockedUsers() {
        const users = prompt('请输入要屏蔽的用户名，用逗号分隔：', blockedUsers.join(', '));
        if (users !== null) {
            const trimmedUsers = users.split(',').map(user => user.trim()).filter(user => user.length > 0);
            if (trimmedUsers.length > 0) {
                blockedUsers = trimmedUsers;
                GM_setValue('blockedUsers', blockedUsers);
                alert('屏蔽的用户已更新。请刷新页面以应用更改。');
                filterPosts(); // 过滤帖子
            } else {
                alert('请输入至少一个有效的用户名。');
            }
        }
    }

    // 过滤帖子
    function filterPosts() {
        const posts = document.querySelectorAll('td.topic-list-data');
        posts.forEach(post => {
            const categoryElement = post.querySelector('div.link-bottom-line a.badge-category__wrapper span.badge-category__name');
            const userElement = post.querySelector('.names .username a');
            if ((categoryElement && blockedCategories.includes(categoryElement.textContent.trim())) ||
                (userElement && blockedUsers.includes(userElement.textContent.trim()))) {
                post.closest('tr').style.display = 'none';
            }
        });
    }

    // 监听新帖子的加载（适用于动态加载内容的页面）
    const observerPosts = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('tr')) {
                    const categoryElement = node.querySelector('div.link-bottom-line a.badge-category__wrapper span.badge-category__name');
                    const userElement = node.querySelector('.names .username a');
                    if ((categoryElement && blockedCategories.includes(categoryElement.textContent.trim())) ||
                        (userElement && blockedUsers.includes(userElement.textContent.trim()))) {
                        node.style.display = 'none';
                    }
                }
            });
        });
    });

    // 监控整个帖子列表的变化
    function observePosts() {
        const topicList = document.querySelector('table.topic-list');
        if (topicList) {
            observerPosts.observe(topicList, { childList: true, subtree: true });
        }
    }

    // 监听用户卡片的显示，添加屏蔽按钮
    function addBlockButton() {
        const userCardContainer = document.querySelector('ul.usercard-controls');
        if (userCardContainer) {
            // 检查按钮是否已存在
            if (!userCardContainer.querySelector('.block-user-button')) {
                const button = document.createElement('button');
                button.textContent = '屏蔽此用户';
                button.className = 'btn btn-icon-text btn-primary block-user-button'; // 使用相同样式
                button.style.marginTop = '10px';
                button.addEventListener('click', () => {
                    const username = document.querySelector('.names__secondary.username').textContent.trim();
                    if (username && !blockedUsers.includes(username)) {
                        blockedUsers.push(username);
                        GM_setValue('blockedUsers', blockedUsers);
                        alert(`${username} 已被屏蔽。`);
                        filterPosts(); // 过滤帖子
                        addBlockButton(); // 重新添加按钮，确保取消屏蔽功能可用
                    }
                });

                // 添加到 ul.usercard-controls 的最后
                userCardContainer.appendChild(button);
            }
        }
    }

    // 取消屏蔽用户功能
    function addUnblockButton() {
        const userCardContainer = document.querySelector('ul.usercard-controls');
        if (userCardContainer) {
            // 检查取消屏蔽按钮是否已存在
            if (!userCardContainer.querySelector('.unblock-user-button')) {
                const button = document.createElement('button');
                button.textContent = '取消屏蔽';
                button.className = 'btn btn-icon-text btn-secondary unblock-user-button'; // 使用不同样式
                button.style.marginTop = '10px';
                button.addEventListener('click', () => {
                    const username = document.querySelector('.names__secondary.username').textContent.trim();
                    if (username && blockedUsers.includes(username)) {
                        blockedUsers = blockedUsers.filter(user => user !== username);
                        GM_setValue('blockedUsers', blockedUsers);
                        alert(`${username} 的屏蔽已被取消。`);
                        filterPosts(); // 过滤帖子
                        addUnblockButton(); // 重新添加按钮，确保屏蔽功能可用
                    }
                });

                // 添加到 ul.usercard-controls 的最后
                userCardContainer.appendChild(button);
            }
        }
    }

    // 初始化过滤和观察
    function init() {
        filterPosts();
        observePosts();
        addBlockButton(); // 添加屏蔽按钮
        addUnblockButton(); // 添加取消屏蔽按钮
    }

    // 在页面加载时初始化过滤
    document.addEventListener('DOMContentLoaded', init);

    // 在用户导航或返回时重新过滤帖子
    window.addEventListener('popstate', init);

    // 监听 DOM 变化以确保按钮正确添加
    const observerUI = new MutationObserver(() => {
        addBlockButton();
        addUnblockButton();
    });
    observerUI.observe(document.body, { childList: true, subtree: true });

    // 监听自动加载更多内容
    const observerScroll = new MutationObserver(() => {
        // 确保按钮在页面内容加载完毕后添加
        addBlockButton();
        addUnblockButton();
    });
    observerScroll.observe(document.querySelector('body'), { childList: true, subtree: true });

    // 确保在脚本首次运行时立即过滤当前页面内容
    init();

})();
