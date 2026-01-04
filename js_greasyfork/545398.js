// ==UserScript==
// @name         Twitter用户屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在推文右上角添加屏蔽按钮，一键隐藏特定用户的推文内容，支持导入导出屏蔽用户列表，无需Twitter API拉黑
// @author       https://x.com/0xfocu5
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545398/Twitter%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545398/Twitter%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        buttonColor: 'rgb(83, 100, 113)',
        hoverColor: 'rgb(244, 33, 46)',
        timeouts: {
            init: 1500,
            checkInterval: 500
        },
        selectors: {
            tweet: 'article[data-testid="tweet"]',
            actionBar: '[role="group"]',
            userLink: 'a[role="link"][href*="/"]',
            moreButton: '[data-testid="caret"]',
            menuItem: '[role="menuitem"]',
            confirmButton: 'div[role="button"]',
            cellInnerDiv: '[data-testid="cellInnerDiv"]',
            socialContext: '[data-testid="socialContext"]'
        }
    };

    // 添加样式
    GM_addStyle(`
        .block-user-btn {
            background: transparent;
            color: rgb(244, 33, 46);
            border: none;
            border-radius: 50%;
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;
            z-index: 1000;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin: 0;
        }

        .block-user-btn:hover {
            background: rgba(244, 33, 46, 0.1);
            color: rgb(185, 28, 37);
        }

        .block-user-btn.blocked {
            background: transparent;
            color: rgb(120, 86, 255);
        }

        .block-user-btn.blocked:hover {
            background: rgba(120, 86, 255, 0.1);
            color: rgb(88, 66, 234);
        }

        .blocked-tweet {
            opacity: 0.3;
            filter: blur(2px);
            pointer-events: none;
        }

        .blocked-tweet .block-user-btn {
            opacity: 1;
            filter: none;
            pointer-events: auto;
        }

        .hidden-tweet {
            display: none !important;
        }

        .block-user-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
    `);

    // 定义屏蔽按钮的SVG图标，使用用户提供的图标
    const blockIconSVG = `
        <svg viewBox="0 0 33 32" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi">
            <g>
                <path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"></path>
            </g>
        </svg>
    `;

    // 获取屏蔽用户列表
    function getBlockedUsers() {
        try {
            const users = GM_getValue('blockedUsers', []);
            console.log(`获取屏蔽用户列表，共 ${users.length} 个用户:`, users);
            return users;
        } catch (error) {
            console.error('获取屏蔽用户列表失败:', error);
            return [];
        }
    }

    // 保存屏蔽用户列表
    function saveBlockedUsers(users) {
        try {
            if (!Array.isArray(users)) {
                console.error('保存失败：用户列表不是数组:', users);
                return false;
            }

            GM_setValue('blockedUsers', users);
            console.log(`成功保存屏蔽用户列表，共 ${users.length} 个用户:`, users);
            return true;
        } catch (error) {
            console.error('保存屏蔽用户列表失败:', error);
            return false;
        }
    }

    // 隐藏被屏蔽用户的推文
    function hideBlockedUserTweets() {
        const blockedUsers = getBlockedUsers();
        if (blockedUsers.length === 0) return;

        const tweets = document.querySelectorAll(CONFIG.selectors.tweet);

        tweets.forEach(tweet => {
            const userLink = tweet.querySelector(CONFIG.selectors.userLink);
            if (!userLink) return;

            const username = userLink.href.split('/').filter(Boolean).pop();
            if (!username || username === 'home' || username === 'explore') return;

            if (blockedUsers.includes(username)) {
                // 找到推文的容器元素并隐藏
                const tweetContainer = tweet.closest(CONFIG.selectors.cellInnerDiv);
                if (tweetContainer) {
                    tweetContainer.classList.add('hidden-tweet');
                }
            }
        });
    }

    // 显示被屏蔽用户的推文（取消屏蔽时）
    function showBlockedUserTweets(username) {
        const tweets = document.querySelectorAll(CONFIG.selectors.tweet);

        tweets.forEach(tweet => {
            const userLink = tweet.querySelector(CONFIG.selectors.userLink);
            if (!userLink) return;

            const tweetUsername = userLink.href.split('/').filter(Boolean).pop();
            if (tweetUsername === username) {
                const tweetContainer = tweet.closest(CONFIG.selectors.cellInnerDiv);
                if (tweetContainer) {
                    tweetContainer.classList.remove('hidden-tweet');
                }
            }
        });
    }

    // 添加屏蔽按钮
    function addBlockButton(tweetElement) {
        // 检查是否已经添加过按钮
        if (tweetElement.querySelector('.block-user-btn')) {
            return;
        }

        console.log('开始为推文添加屏蔽按钮:', tweetElement);

        // 查找推文右上角的操作区域
        let actionArea = tweetElement.querySelector('[data-testid="tweet"]') ||
                        tweetElement.querySelector('[role="article"]') ||
                        tweetElement;

        if (!actionArea) {
            console.log('未找到actionArea');
            return;
        }

        // 查找用户名
        let usernameElement = tweetElement.querySelector('a[href^="/"][role="link"]');
        if (!usernameElement) {
            console.log('未找到用户名元素');
            return;
        }

        let username = usernameElement.getAttribute('href').substring(1);
        if (!username || username === 'home' || username === 'explore') {
            console.log('无效的用户名:', username);
            return;
        }

        console.log('找到用户名:', username);

        // 检查用户是否已被屏蔽
        let blockedUsers = getBlockedUsers();
        let isBlocked = blockedUsers.includes(username);

        // 创建屏蔽按钮
        let blockBtn = document.createElement('div');
        blockBtn.className = 'block-user-btn';
        if (isBlocked) {
            blockBtn.classList.add('blocked');
        }
        blockBtn.innerHTML = blockIconSVG;
        blockBtn.title = isBlocked ? '取消屏蔽此用户' : '屏蔽此用户';

        // 悬停效果由CSS类控制，无需JavaScript设置

        // 添加点击事件
        blockBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 获取最新的屏蔽用户列表
            let currentBlockedUsers = getBlockedUsers();
            let currentIsBlocked = currentBlockedUsers.includes(username);

            if (currentIsBlocked) {
                // 取消屏蔽
                currentBlockedUsers = currentBlockedUsers.filter(user => user !== username);
                blockBtn.title = '屏蔽此用户';
                blockBtn.classList.remove('blocked');
                console.log(`取消屏蔽用户: @${username}`);

                // 显示该用户的推文
                showBlockedUserTweets(username);
            } else {
                // 屏蔽用户
                currentBlockedUsers.push(username);
                blockBtn.title = '取消屏蔽此用户';
                blockBtn.classList.add('blocked');
                console.log(`屏蔽用户: @${username}`);

                // 立即隐藏该用户的推文
                hideBlockedUserTweets();
            }

            // 保存更新后的列表
            saveBlockedUsers(currentBlockedUsers);
            console.log(`屏蔽用户列表已更新，当前共 ${currentBlockedUsers.length} 个用户`);

            // 更新本地状态
            isBlocked = !currentIsBlocked;
        });

        // 查找合适的位置插入按钮 - 定位到右侧红框位置
        console.log('开始查找按钮插入位置...');

        // 查找推文右上角的操作按钮容器
        let actionContainer = tweetElement.querySelector('div[class*="r-1awozwy r-18u37iz r-1cmwbt1 r-1wtj0ep"]');

        if (!actionContainer) {
            // 备用方法：查找包含操作按钮的容器
            actionContainer = tweetElement.querySelector('div[class*="r-1awozwy r-18u37iz"]');
        }

        if (!actionContainer) {
            // 再备用：查找包含按钮的容器
            actionContainer = tweetElement.querySelector('div[role="group"]');
        }

        if (actionContainer) {
            console.log('找到actionContainer，准备插入按钮');

            // 查找More按钮（三个点的按钮）
            let moreButton = actionContainer.querySelector('[data-testid="caret"]');

            if (moreButton) {
                // 在More按钮之前插入屏蔽按钮
                moreButton.parentElement.insertBefore(blockBtn, moreButton);
                console.log('按钮已插入到More按钮之前');
            } else {
                // 如果找不到More按钮，插入到容器末尾
                actionContainer.appendChild(blockBtn);
                console.log('按钮已添加到操作容器末尾');
            }
        } else {
            console.log('未找到actionContainer，尝试查找其他位置');

            // 备用方法：查找推文头部容器
            let headerContainer = tweetElement.querySelector('div[dir="ltr"]') ||
                                tweetElement.querySelector('div[style*="display: flex"]') ||
                                tweetElement.querySelector('div[style*="flex-direction: row"]');

            if (headerContainer) {
                headerContainer.appendChild(blockBtn);
                console.log('按钮已添加到头部容器');
            } else {
                console.log('未找到合适位置，直接插入到推文元素');
                tweetElement.insertBefore(blockBtn, tweetElement.firstChild);
            }
        }

        // 如果用户已被屏蔽，应用屏蔽样式
        if (isBlocked) {
            tweetElement.classList.add('blocked-tweet');
        }
    }

    // 处理推文元素
    function processTweets() {
        // 查找所有推文元素 - 使用更精确的选择器
        let tweets = document.querySelectorAll('article[data-testid="tweet"]');

        console.log('找到推文数量:', tweets.length);

        if (tweets.length === 0) {
            // 如果没找到，尝试其他选择器
            tweets = document.querySelectorAll('[role="article"]');
            console.log('使用备用选择器找到推文数量:', tweets.length);
        }

        tweets.forEach((tweet, index) => {
            // 检查是否是真正的推文（不是其他内容）
            if (tweet.querySelector('a[href^="/"][role="link"]')) {
                console.log(`处理第${index + 1}条推文:`, tweet);
                addBlockButton(tweet);
            }
        });

        // 隐藏被屏蔽用户的推文
        hideBlockedUserTweets();
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });

            if (shouldProcess) {
                setTimeout(processTweets, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(processTweets, 1000);
                observePageChanges();
            });
        } else {
            setTimeout(processTweets, 1000);
            observePageChanges();
        }

        // 定期检查新推文
        setInterval(processTweets, 3000);
    }

    // 导出屏蔽用户列表到文件
    function exportBlockedUsers() {
        const blockedUsers = getBlockedUsers();
        if (blockedUsers.length === 0) {
            alert('当前没有屏蔽任何用户');
            return;
        }

        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            blockedUsers: blockedUsers
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `twitter_blocked_users_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('已导出屏蔽用户列表');
    }

    // 导入屏蔽用户列表从文件
    function importBlockedUsers() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.blockedUsers && Array.isArray(data.blockedUsers)) {
                        const currentBlocked = getBlockedUsers();
                        const newBlocked = [...new Set([...currentBlocked, ...data.blockedUsers])];

                        if (saveBlockedUsers(newBlocked)) {
                            alert(`成功导入 ${data.blockedUsers.length} 个用户\n当前总共屏蔽 ${newBlocked.length} 个用户`);
                            console.log('已导入屏蔽用户列表:', data.blockedUsers);

                            // 刷新页面状态
                            processTweets();
                        } else {
                            alert('导入失败，保存用户列表时出错');
                        }
                    } else {
                        alert('文件格式错误，请选择正确的屏蔽用户导出文件');
                    }
                } catch (error) {
                    alert('文件解析失败，请检查文件格式');
                    console.error('导入文件解析失败:', error);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // 删除指定的屏蔽用户
    function removeBlockedUser(username) {
        try {
            const blockedUsers = getBlockedUsers();
            const newBlockedUsers = blockedUsers.filter(user => user !== username);

            if (saveBlockedUsers(newBlockedUsers)) {
                console.log(`已删除屏蔽用户: @${username}`);

                // 刷新页面状态
                processTweets();

                // 重新显示用户列表（会自动关闭旧的模态框）
                showBlockedUsersList();
            } else {
                console.error(`删除屏蔽用户失败: @${username}`);
                alert('删除用户失败，请重试');
            }
        } catch (error) {
            console.error('删除屏蔽用户时发生错误:', error);
            alert('删除用户时发生错误，请重试');
        }
    }

    // 关闭所有已存在的模态框
    function closeAllModals() {
        const existingModals = document.querySelectorAll('.blocked-users-modal');
        existingModals.forEach(modal => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }

    // 显示屏蔽用户列表（带删除按钮）
    function showBlockedUsersList() {
        // 先关闭已存在的模态框
        closeAllModals();

        const blockedUsers = getBlockedUsers();
        if (blockedUsers.length === 0) {
            alert('当前没有屏蔽任何用户');
            return;
        }

        // 创建模态对话框
        const modal = document.createElement('div');
        modal.className = 'blocked-users-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 20px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        const title = document.createElement('h3');
        title.textContent = `已屏蔽的用户 (${blockedUsers.length})`;
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #333;
            font-size: 18px;
            font-weight: bold;
        `;

        const userList = document.createElement('div');
        userList.style.cssText = `
            margin-bottom: 20px;
        `;

        blockedUsers.forEach((username, index) => {
            const userItem = document.createElement('div');
            userItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #e9ecef;
            `;

            const usernameSpan = document.createElement('span');
            usernameSpan.textContent = `@${username}`;
            usernameSpan.style.cssText = `
                font-weight: 500;
                color: #333;
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            `;

            deleteBtn.onmouseover = () => deleteBtn.style.background = '#c82333';
            deleteBtn.onmouseout = () => deleteBtn.style.background = '#dc3545';

            deleteBtn.onclick = () => {
                if (confirm(`确定要取消屏蔽用户 @${username} 吗？`)) {
                    removeBlockedUser(username);
                }
            };

            userItem.appendChild(usernameSpan);
            userItem.appendChild(deleteBtn);
            userList.appendChild(userItem);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出列表';
        exportBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        `;
        exportBtn.onmouseover = () => exportBtn.style.background = '#0056b3';
        exportBtn.onmouseout = () => exportBtn.style.background = '#007bff';
        exportBtn.onclick = exportBlockedUsers;

        const importBtn = document.createElement('button');
        importBtn.textContent = '导入列表';
        importBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        `;
        importBtn.onmouseover = () => importBtn.style.background = '#1e7e34';
        importBtn.onmouseout = () => importBtn.style.background = '#28a745';
        importBtn.onclick = importBlockedUsers;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#5a6268';
        closeBtn.onmouseout = () => closeBtn.style.background = '#6c757d';
        closeBtn.onclick = closeAllModals;

        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(importBtn);
        buttonContainer.appendChild(closeBtn);

        content.appendChild(title);
        content.appendChild(userList);
        content.appendChild(buttonContainer);
        modal.appendChild(content);

        // 点击背景关闭模态框
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        };

        document.body.appendChild(modal);
    }

    // 注册油猴菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('显示所有被屏蔽用户', () => {
            showBlockedUsersList();
        }, 's');

        GM_registerMenuCommand('导出屏蔽用户列表', () => {
            exportBlockedUsers();
        }, 'e');

        GM_registerMenuCommand('导入屏蔽用户列表', () => {
            importBlockedUsers();
        }, 'i');

        GM_registerMenuCommand('刷新页面状态', () => {
            processTweets();
            console.log('已刷新页面状态');
        }, 'r');

        GM_registerMenuCommand('调试缓存状态', () => {
            const blockedUsers = getBlockedUsers();
            console.log('=== 缓存状态调试 ===');
            console.log('当前屏蔽用户数量:', blockedUsers.length);
            console.log('用户列表:', blockedUsers);
            console.log('缓存键名: blockedUsers');
            console.log('==================');
        }, 'd');
    }

    // 启动脚本
    init();
})();
