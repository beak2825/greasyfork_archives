// ==UserScript==
// @name         多账号自动化助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动登录多个账户并登出
// @author       Linux.do
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/493750/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493750/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const styles = `
        .tm-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tm-toast {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #333;
            padding: 12px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            font-weight: 500;
            animation: tm-slide-in 0.3s ease-out forwards;
            min-width: 200px;
            text-align: center;
        }
        @keyframes tm-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .tm-toast.fade-out {
            animation: tm-slide-out 0.3s ease-in forwards;
        }
        @keyframes tm-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        #tm-config-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: tm-fade-in 0.2s ease-out;
        }
        #tm-config {
            background: rgba(255, 255, 255, 0.95);
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            width: 520px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        @keyframes tm-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        #tm-config h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
            color: #1d1d1f;
            text-align: center;
        }
        #tm-accounts-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        #tm-accounts-table th {
            text-align: left;
            font-size: 13px;
            color: #86868b;
            padding: 8px;
            border-bottom: 1.5px solid #ebebeb;
            font-weight: 600;
        }
        #tm-accounts-table td {
            padding: 12px 8px;
            vertical-align: middle;
            border-bottom: 1px solid #f2f2f2;
        }
        .tm-config-input {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 12px;
            border: 1.5px solid #d2d2d7;
            border-radius: 10px;
            font-size: 14px;
            outline: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: #ffffff;
            color: #1d1d1f;
        }
        .tm-config-input:focus {
            border-color: #0071e3;
            box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
        }
        .tm-btn-container {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        .tm-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tm-btn-primary {
            background: #0071e3;
            color: white;
        }
        .tm-btn-primary:hover {
            background: #0077ed;
        }
        .tm-btn-secondary {
            background: #e8e8ed;
            color: #1d1d1f;
        }
        .tm-btn-secondary:hover {
            background: #d2d2d7;
        }
        .tm-btn-danger {
            background: #ff3b30;
            color: white;
            width: 24px;
            height: 24px;
            padding: 0;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
            margin: 0 auto;
            line-height: normal;
        }
        .tm-btn-danger:hover {
            background: #ff453a;
            transform: scale(1.1);
        }

        #tm-status-indicator {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            pointer-events: none;
            animation: tm-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes tm-pop-in {
            from { transform: translateX(-50%) translateY(-50px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .tm-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: tm-spin 0.8s linear infinite;
        }
        @keyframes tm-spin {
            to { transform: rotate(360deg); }
        }
        .tm-settings-section {
            background: #f5f5f7;
            padding: 12px 15px;
            border-radius: 10px;
            margin-bottom: 12px;
        }
        .tm-settings-section h3 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #86868b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .tm-settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .tm-setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: white;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
        }
        .tm-setting-item label {
            font-size: 13px;
            color: #1d1d1f;
        }
        .tm-setting-item input[type="number"] {
            width: 50px;
            padding: 4px 6px;
            border: 1px solid #d2d2d7;
            border-radius: 6px;
            font-size: 13px;
            text-align: center;
        }
        .tm-table-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 0 2px;
        }
        .tm-table-toolbar span {
            font-size: 12px;
            color: #86868b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .tm-batch-btns {
            display: flex;
            gap: 6px;
        }
        .tm-batch-btn {
            padding: 4px 8px;
            font-size: 11px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #e8e8ed;
            color: #1d1d1f;
            transition: all 0.15s;
        }
        .tm-batch-btn:hover {
            background: #0071e3;
            color: white;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    const toastContainer = document.createElement('div');
    toastContainer.className = 'tm-toast-container';
    document.body.appendChild(toastContainer);

    let accounts = GM_getValue('accounts', []);
    let scriptEnabled = GM_getValue('scriptEnabled', false);

    GM_registerMenuCommand('配置账号', openConfig);
    GM_registerMenuCommand('启动/停止脚本', toggleScript);

    function showMessage(message, timeout = 3000) {
        const toast = document.createElement('div');
        toast.className = 'tm-toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, timeout);
    }

    function updateRunningStatus(text) {
        let indicator = document.getElementById('tm-status-indicator');
        if (!text) {
            if (indicator) indicator.remove();
            return;
        }
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'tm-status-indicator';
            indicator.innerHTML = '<div class="tm-spinner"></div><span id="tm-status-text"></span>';
            document.body.appendChild(indicator);
        }
        document.getElementById('tm-status-text').textContent = text;
    }

    function toggleScript() {
        scriptEnabled = !scriptEnabled;
        GM_setValue('scriptEnabled', scriptEnabled);
        showMessage('脚本现在' + (scriptEnabled ? '启动' : '停止') + '。');
        if (scriptEnabled) {
            GM_setValue('shouldRunMain', true);
            main();
        } else {
            // 停止时清除所有状态
            GM_setValue('shouldRunMain', false);
            GM_setValue('autoLikeTasks', null);
            GM_setValue('accountIndex', 0);
            updateRunningStatus(null); // 隐藏状态指示器
        }
    }


    function openConfig() {
        if (document.getElementById('tm-config-overlay')) return;

        let globalSettings = GM_getValue('globalSettings', {});
        // 兼容旧配置，确保字段有默认值
        globalSettings.topicsToRead = globalSettings.topicsToRead || 3;
        globalSettings.dailyLikesLimit = globalSettings.dailyLikesLimit || 50;

        let configHtml = `
            <div id="tm-config-overlay">
                <div id="tm-config">
                    <h2>账号配置</h2>
                    
                    <div class="tm-settings-section">
                        <h3>运行参数</h3>
                        <div class="tm-settings-grid">
                            <div class="tm-setting-item">
                                <label>阅读帖子数</label>
                                <input type="number" id="tm-topics-count" value="${globalSettings.topicsToRead}" min="1" max="50">
                            </div>
                            <div class="tm-setting-item">
                                <label>每日点赞上限</label>
                                <input type="number" id="tm-likes-limit" value="${globalSettings.dailyLikesLimit}" min="1" max="200">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tm-table-toolbar">
                        <span>账号列表</span>
                        <div class="tm-batch-btns">
                            <button class="tm-batch-btn" id="tm-batch-read">全选阅读</button>
                            <button class="tm-batch-btn" id="tm-batch-like">全选点赞</button>
                            <button class="tm-batch-btn" id="tm-batch-all">全选</button>
                            <button class="tm-batch-btn" id="tm-batch-none">清除</button>
                        </div>
                    </div>
                    
                    <table id="tm-accounts-table">
                        <thead>
                            <tr>
                                <th style="width: 32%;">用户名</th>
                                <th style="width: 32%;">密码</th>
                                <th style="width: 13%; text-align: center;">阅读</th>
                                <th style="width: 13%; text-align: center;">点赞</th>
                                <th style="width: 36px;"></th>
                            </tr>
                        </thead>
                        <tbody id="tm-accounts-list"></tbody>
                    </table>
                    <div class="tm-btn-container">
                        <button id="tm-add-account" class="tm-btn tm-btn-secondary">添加账号</button>
                        <button id="tm-save-config" class="tm-btn tm-btn-primary">保存</button>
                        <button id="tm-close-config" class="tm-btn tm-btn-secondary">取消</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', configHtml);

        accounts.forEach((account, index) => {
            addAccountFields(index, account.username, account.password, account.autoRead, account.autoLike);
        });

        document.getElementById('tm-add-account').addEventListener('click', () => {
            addAccountFields(document.querySelectorAll('.tm-account-tr').length);
        });

        document.getElementById('tm-save-config').addEventListener('click', saveConfig);
        document.getElementById('tm-close-config').addEventListener('click', () => {
            document.getElementById('tm-config-overlay').remove();
        });
        document.getElementById('tm-config-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'tm-config-overlay') e.target.remove();
        });

        // 批量操作按钮事件
        document.getElementById('tm-batch-read').addEventListener('click', () => {
            document.querySelectorAll('.tm-auto-read').forEach(cb => cb.checked = true);
        });
        document.getElementById('tm-batch-like').addEventListener('click', () => {
            document.querySelectorAll('.tm-auto-like').forEach(cb => cb.checked = true);
        });
        document.getElementById('tm-batch-all').addEventListener('click', () => {
            document.querySelectorAll('.tm-auto-read, .tm-auto-like').forEach(cb => cb.checked = true);
        });
        document.getElementById('tm-batch-none').addEventListener('click', () => {
            document.querySelectorAll('.tm-auto-read, .tm-auto-like').forEach(cb => cb.checked = false);
        });
    }

    function addAccountFields(index, username = '', password = '', autoRead = false, autoLike = false) {
        let accountHtml = `
            <tr class="tm-account-tr" data-index="${index}">
                <td>
                    <input type="text" class="tm-config-input tm-username" value="${username}" placeholder="用户名">
                </td>
                <td>
                    <input type="password" class="tm-config-input tm-password" value="${password}" placeholder="密码">
                </td>
                <td style="text-align: center;">
                    <input type="checkbox" class="tm-auto-read" ${autoRead ? 'checked' : ''} style="transform: scale(1.2);">
                </td>
                <td style="text-align: center;">
                    <input type="checkbox" class="tm-auto-like" ${autoLike ? 'checked' : ''} style="transform: scale(1.2);">
                </td>
                <td>
                    <button class="tm-btn tm-btn-danger tm-remove-account" title="移除账号">×</button>
                </td>
            </tr>
        `;
        document.getElementById('tm-accounts-list').insertAdjacentHTML('beforeend', accountHtml);

        let removeButtons = document.getElementsByClassName('tm-remove-account');
        let lastButton = removeButtons[removeButtons.length - 1];
        lastButton.addEventListener('click', function () {
            this.closest('tr').remove();
        });
    }

    function saveConfig() {
        // 保存全局设置
        let globalSettings = {
            topicsToRead: parseInt(document.getElementById('tm-topics-count').value) || 3,
            dailyLikesLimit: parseInt(document.getElementById('tm-likes-limit').value) || 50
        };
        GM_setValue('globalSettings', globalSettings);

        // 保存账号列表
        let accountRows = document.getElementsByClassName('tm-account-tr');
        accounts = Array.from(accountRows).map(tr => {
            return {
                username: tr.querySelector('.tm-username').value,
                password: tr.querySelector('.tm-password').value,
                autoRead: tr.querySelector('.tm-auto-read').checked,
                autoLike: tr.querySelector('.tm-auto-like').checked
            };
        }).filter(acc => acc.username && acc.password);

        GM_setValue('accounts', accounts);
        showMessage('配置已保存！');
        document.getElementById('tm-config-overlay').remove();
    }

    function isLoggedIn() {
        return document.querySelector('#toggle-current-user') !== null;
    }

    function waitForElement(selector, callback, checkVisibility = false, timeout = 5000) {
        let start = Date.now();
        let interval = setInterval(() => {
            let element = document.querySelector(selector);
            let isVisible = element && (element.offsetParent !== null);
            if (element && (!checkVisibility || isVisible)) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                console.error('等待元素超时: ', selector);
                showMessage('操作超时，脚本停止。');
                GM_setValue('scriptEnabled', false);
            }
        }, 100);
    }

    function login(account, callback) {
        if (!isLoggedIn()) {
            let loginButton = document.querySelector('.login-button');
            if (loginButton) {
                loginButton.click();
                waitForElement('#login-account-name', () => {
                    let usernameField = document.getElementById('login-account-name');
                    let passwordField = document.getElementById('login-account-password');

                    usernameField.value = '';
                    passwordField.value = '';

                    setTimeout(() => {
                        usernameField.value = account.username;
                        passwordField.value = account.password;

                        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordField.dispatchEvent(new Event('input', { bubbles: true }));

                        setTimeout(() => {
                            document.getElementById('login-button').click();

                            setTimeout(() => {
                                let alertElement = document.querySelector('#modal-alert.alert.alert-error');
                                if (alertElement && alertElement.textContent.includes('请稍后再尝试登录。')) {
                                    console.log('出现错误提示，正在重试登录...');
                                    setTimeout(() => {
                                        document.getElementById('login-button').click();
                                    }, 500);
                                } else if (typeof callback === "function") {
                                    callback();
                                }
                            }, 100);
                        }, 800);
                    }, 200);
                });
            }
        }
    }

    function logout(callback) {
        waitForElement('#toggle-current-user', (profileButton) => {
            profileButton.click();
            waitForElement('.bottom-tabs .user-menu-tab', (profileTab) => {
                profileTab.click();
                waitForElement('.logout .profile-tab-btn', (logoutButton) => {
                    logoutButton.click();
                    if (typeof callback === "function") {
                        callback();
                    }
                });
            });
        });
    }

    function main() {
        if (!GM_getValue('shouldRunMain', false)) {
            return;
        }
        console.log('开始处理账号');

        setTimeout(() => {
            console.log('开始处理账号');

            let accountIndex = GM_getValue('accountIndex', 0);

            if (scriptEnabled && accountIndex < accounts.length) {
                if (isLoggedIn()) {
                    console.log('已登录，准备登出');
                    updateRunningStatus(`账号 ${accountIndex + 1}/${accounts.length} 处理中... 准备登出`);
                    logout(() => {
                        // 登出后延迟继续下一个账号
                        setTimeout(() => {
                            main();
                        }, 2000);
                    });
                } else {
                    let account = accounts[accountIndex];
                    console.log('准备登录账号：', account.username);
                    updateRunningStatus(`正在登录：${account.username} (${accountIndex + 1}/${accounts.length})`);
                    GM_setValue('currentAccount', account.username);
                    login(account, () => {
                        console.log('登录成功，准备下一步');

                        // 根据配置决定执行流程
                        if (account.autoRead || account.autoLike) {
                            let globalSettings = GM_getValue('globalSettings', { topicsToRead: 3, dailyLikesLimit: 50 });
                            GM_setValue('autoLikeTasks', {
                                accountIndex: accountIndex,
                                remainingTopics: globalSettings.topicsToRead, // 使用全局配置
                                remainingLikes: globalSettings.dailyLikesLimit, // 每日点赞上限
                                doneTopics: [],
                                autoRead: account.autoRead,
                                autoLike: account.autoLike
                            });
                            // 优先跳转到未读页面
                            let unreadLink = document.querySelector('a[href="/unread"], a[href="/new"]');
                            if (unreadLink) {
                                unreadLink.click();
                            } else {
                                startAutoLikeFlow();
                            }
                        } else {
                            // 仅登录模式，延迟继续下一个账号
                            GM_setValue('accountIndex', accountIndex + 1);
                            setTimeout(() => {
                                main();
                            }, 2000);
                        }
                    });
                }
            } else {
                console.log('所有账号处理完毕');
                updateRunningStatus(null);
                GM_setValue('accountIndex', 0);
                GM_setValue('shouldRunMain', false);
                GM_setValue('scriptEnabled', false);
                showMessage('操作完成');
            }
        }, 2000);
    }

    function startAutoLikeFlow() {
        if (!GM_getValue('scriptEnabled', false)) return;

        let tasks = GM_getValue('autoLikeTasks', null);
        if (!tasks) return;

        if (tasks.remainingTopics <= 0) {
            console.log('该账号任务已全部完成');
            updateRunningStatus('任务完成，正在准备下一个账号...');
            GM_setValue('autoLikeTasks', null);
            GM_setValue('accountIndex', tasks.accountIndex + 1);

            // 刷新页面继续下一个账号
            setTimeout(() => {
                location.reload();
            }, 1500);
            return;
        }

        const path = window.location.pathname;

        // 首页/未读页/新帖页逻辑：选择帖子
        if (path === '/' || path === '/latest' || path === '/unread' || path === '/new' || path === '/top') {
            let actionText = [];
            if (tasks.autoRead) actionText.push('阅读');
            if (tasks.autoLike) actionText.push('点赞');
            updateRunningStatus(`自动${actionText.join('+')}... 剩余 ${tasks.remainingTopics} 个帖子`);

            // 等待帖子列表出现
            setTimeout(() => {
                // 优先选择未读帖子
                let unreadTopics = Array.from(document.querySelectorAll('tr.topic-list-item.unread a.title, tr.topic-list-item.new-topic a.title'))
                    .filter(a => !tasks.doneTopics.includes(a.href));

                // 如果没有未读，就选择普通帖子
                let topics = unreadTopics.length > 0 ? unreadTopics :
                    Array.from(document.querySelectorAll('a.title.raw-link.raw-topic-link'))
                        .filter(a => !tasks.doneTopics.includes(a.href));

                if (topics.length > 0) {
                    let randomTopic = topics[Math.floor(Math.random() * Math.min(topics.length, 10))];
                    tasks.doneTopics.push(randomTopic.href);
                    GM_setValue('autoLikeTasks', tasks);
                    console.log('SPA 跳转至：', randomTopic.href, unreadTopics.length > 0 ? '(未读)' : '(普通)');
                    randomTopic.click();
                } else {
                    console.warn('未找到合适帖子，尝试滚动加载');
                    window.scrollBy(0, 500);
                }
            }, 1000);
        }
        // 帖子内逻辑
        else if (path.includes('/t/')) {
            if (tasks.isProcessingPost) return; // 防止重复触发

            tasks.isProcessingPost = true;
            GM_setValue('autoLikeTasks', tasks);

            processTopicContent(tasks.autoRead, tasks.autoLike).then(() => {
                let currentTasks = GM_getValue('autoLikeTasks', null);
                if (!currentTasks) return;

                currentTasks.remainingTopics--;
                currentTasks.isProcessingPost = false;
                GM_setValue('autoLikeTasks', currentTasks);

                updateRunningStatus('当前帖子处理完毕，准备返回...');

                setTimeout(() => {
                    // 返回未读页面继续
                    let unreadLink = document.querySelector('a[href="/unread"], a[href="/new"]');
                    let homeLink = document.querySelector('#site-logo, a[href="/"]');
                    if (unreadLink) unreadLink.click();
                    else if (homeLink) homeLink.click();
                    else history.back();
                }, 1500);
            });
        }
    }

    async function processTopicContent(shouldRead, shouldLike) {
        let clickedPostIds = new Set();
        let likedCount = 0;

        console.log('processTopicContent 开始, shouldRead:', shouldRead, 'shouldLike:', shouldLike);

        // 边滚动边点赞
        for (let i = 0; i < 30; i++) {
            // 检查脚本是否被停止
            if (!GM_getValue('scriptEnabled', false)) {
                console.log('脚本已停止');
                return;
            }

            // 每次循环重新获取 tasks 确保数据同步
            let tasks = GM_getValue('autoLikeTasks', null);

            // 点赞当前可见的帖子
            if (shouldLike && tasks && tasks.remainingLikes > 0) {
                let posts = document.querySelectorAll('.topic-post');
                console.log('找到帖子数量:', posts.length);

                for (let post of posts) {
                    tasks = GM_getValue('autoLikeTasks', null);
                    if (!tasks || tasks.remainingLikes <= 0) break;

                    const postId = post.id || post.dataset.postId || `post_${Date.now()}`;
                    if (clickedPostIds.has(postId)) continue;

                    // 查找点赞按钮（优先找未点赞的）
                    let likeButton = post.querySelector('button.btn-toggle-reaction-like');

                    if (!likeButton) {
                        console.log('帖子', postId, '未找到点赞按钮');
                        clickedPostIds.add(postId);
                        continue;
                    }

                    // 通过 title 判断是否已点赞
                    // 未点赞: title="点赞此帖子"
                    // 已点赞: title="删除此 heart 回应"
                    let buttonTitle = likeButton.getAttribute('title') || '';
                    let isAlreadyLiked = buttonTitle.includes('删除') || buttonTitle.includes('remove');

                    if (!isAlreadyLiked) {
                        updateRunningStatus(`点赞 ${postId.replace('post_', '')} 楼 (剩余${tasks.remainingLikes})`);
                        likeButton.click();
                        clickedPostIds.add(postId);
                        likedCount++;
                        tasks.remainingLikes--;
                        GM_setValue('autoLikeTasks', tasks);
                        console.log('已点赞', postId, '剩余', tasks.remainingLikes);
                        await new Promise(r => setTimeout(r, 1200 + Math.random() * 500));

                        // 异步检测并关闭弹出的对话框（不阻塞主流程）
                        setTimeout(() => {
                            let dialog = document.querySelector('#dialog-holder .btn-primary');
                            if (dialog) {
                                console.log('检测到对话框，自动关闭');
                                dialog.click();
                            }
                        }, 200);

                    } else {
                        console.log('帖子', postId, '已点赞，跳过');
                        clickedPostIds.add(postId);
                    }
                }

            }

            // 滚动阅读
            if (shouldRead) {
                updateRunningStatus(`阅读中... 已点赞${likedCount}个`);
                window.scrollBy(0, 300);
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

                // 检查是否已到底部
                if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 100) {
                    console.log('已滚动到底部');
                    break;
                }
            } else {
                // 不需要阅读时只处理一次
                break;
            }
        }

        console.log(`处理完成，共点赞 ${likedCount} 个`);
    }



    async function processTopicLikes() {
        updateRunningStatus('正在分析楼层，准备点赞...');

        let tasks = GM_getValue('autoLikeTasks', null);
        if (!tasks || tasks.remainingLikes <= 0) {
            console.log('今日点赞配额已用完');
            return;
        }

        let likedInThisPost = 0;
        let clickedPostIds = new Set();

        // 获取当前页面所有帖子，按顺序处理（不滚动）
        let posts = document.querySelectorAll('.topic-post');

        for (let post of posts) {
            if (tasks.remainingLikes <= 0) break;

            const postId = post.id || post.dataset.postId;
            if (!postId || clickedPostIds.has(postId)) continue;

            let likeButton = post.querySelector('button.btn-toggle-reaction-like');
            let isAlreadyLiked = likeButton && likeButton.classList.contains('has-reacted');

            if (likeButton && !isAlreadyLiked) {
                updateRunningStatus(`点赞 ${postId.replace('post_', '')} 楼 (剩余${tasks.remainingLikes})`);

                likeButton.click();
                clickedPostIds.add(postId);
                likedInThisPost++;
                tasks.remainingLikes--;
                GM_setValue('autoLikeTasks', tasks);
                console.log(`已点赞 ${postId} (剩余${tasks.remainingLikes})`);

                // 等待 DOM 更新
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
            }
        }

        console.log(`本帖点赞 ${likedInThisPost} 个，今日剩余 ${tasks.remainingLikes} 个`);
    }


    // 路由监控器：监听浏览器内容变化驱动状态机
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('检测到路由变化，重新触发逻辑');
            if (GM_getValue('autoLikeTasks', null)) {
                startAutoLikeFlow();
            }
        }
    }, 500);

    window.addEventListener('load', function () {
        if (GM_getValue('shouldRunMain', false) && GM_getValue('scriptEnabled', false)) {
            let tasks = GM_getValue('autoLikeTasks', null);
            if (tasks) {
                startAutoLikeFlow();
            } else {
                let accountIndex = GM_getValue('accountIndex', 0);
                if (accountIndex < accounts.length) {
                    updateRunningStatus(`准备处理第 ${accountIndex + 1}/${accounts.length} 个账号...`);
                    main();
                } else {
                    // 完成所有账号
                    GM_setValue('shouldRunMain', false);
                    GM_setValue('scriptEnabled', false);
                    updateRunningStatus(null);
                    showMessage('所有账号及点赞任务已执行完毕！');
                }
            }
        }
    });
})();
