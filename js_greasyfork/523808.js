// ==UserScript==
// @name:zh-CN   动漫花园评论区屏蔽助手
// @name         DMHY Comment Block
// @namespace    https://github.com/xkbkx5904/dmhy-comment-block
// @version      1.0.9
// @description:zh-CN  屏蔽动漫花园评论区的用户和关键词
// @description  Block users and keywords in dmhy comment section
// @author       xkbkx5904
// @license      MIT
// @language     zh-CN
// @match        *://share.dmhy.org/topics/view/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @noframes
// @supportURL   https://github.com/xkbkx5904/dmhy-comment-block/issues
// @homepageURL  https://github.com/xkbkx5904/dmhy-comment-block
// @icon         https://share.dmhy.org/favicon.ico
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/523808/DMHY%20Comment%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/523808/DMHY%20Comment%20Block.meta.js
// ==/UserScript==

// 用户黑名单列表
let UserBlockList = [];

// 缓存常用的 DOM 选择器结果
const SELECTORS = {
    COMMENT_TABLE: '#comment_recent',
    COMMENT_ROW: 'tr[id^="comment"]',
    USERNAME: '.username',
    CONTENT: '.comment_con span:last-child'
};

// 正则表达式工具类
const RegexUtils = {
    isValid(pattern) {
        if (!pattern.startsWith('/') || !pattern.endsWith('/')) return true;
        try {
            new RegExp(pattern.slice(1, -1));
            return true;
        } catch (e) {
            return false;
        }
    },

    toRegex(pattern) {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1, -1));
        }
        return pattern;
    },

    test(pattern, text) {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            try {
                const regex = new RegExp(pattern.slice(1, -1));
                return regex.test(text);
            } catch {
                return false;
            }
        }
        return false;
    }
};

// 黑名单管理类
const BlockListManager = {
    addUser(username, commentId = null) {
        let userList = UserBlockList.find(item => item.type === 'users');
        if (!userList) {
            userList = { type: 'users', values: [] };
            UserBlockList.push(userList);
        }

        const user = {
            username,
            userId: username.startsWith('/') ? null : commentId
        };

        userList.values.push(user);
        saveBlockList();
        handleComments();
    },

    updateUsers(usernames) {
        let userList = UserBlockList.find(item => item.type === 'users');
        if (!userList) {
            userList = { type: 'users', values: [] };
            UserBlockList.push(userList);
        }

        userList.values = usernames.map(username => ({
            username,
            userId: username.startsWith('/') ? null : 
                userList.values.find(u => u.username === username)?.userId || null
        }));
    },

    updateKeywords(keywords) {
        let keywordItem = UserBlockList.find(item => item.type === 'keywords');
        if (!keywordItem) {
            keywordItem = { type: 'keywords', values: [] };
            UserBlockList.push(keywordItem);
        }
        keywordItem.values = keywords.map(RegexUtils.toRegex);
    }
};

// 从本地存储加载黑名单
function loadBlockList() {
    try {
        const saved = GM_getValue('dmhy_comment_blocklist', []);
        UserBlockList = Array.isArray(saved) ? saved.map(item => {
            if (item.type === 'keywords') {
                return {
                    type: 'keywords',
                    values: item.values.map(k => {
                        if (typeof k === 'string' && k.startsWith('/') && k.endsWith('/')) {
                            try {
                                return new RegExp(k.slice(1, -1));
                            } catch (e) {
                                return k;
                            }
                        }
                        return k;
                    })
                };
            }
            return item;
        }) : [];
    } catch (err) {
        UserBlockList = [];
    }
}

// 保存黑名单到本地存储
function saveBlockList() {
    try {
        const listToSave = UserBlockList.map(item => {
            if (item.type === 'keywords') {
                return {
                    type: 'keywords',
                    values: item.values.map(k => {
                        if (k instanceof RegExp) {
                            return `/${k.source}/`;
                        }
                        return k;
                    })
                };
            }
            return item;
        });
        GM_setValue('dmhy_comment_blocklist', listToSave);
    } catch (err) {
        console.error('保存黑名单失败:', err);
    }
}

// 处理评论显示
function handleComments() {
    const comments = document.querySelectorAll(SELECTORS.COMMENT_ROW);
    if (!comments.length) return;

    // 预先获取黑名单数据
    const userList = UserBlockList.find(item => item.type === 'users')?.values || [];
    const blockedKeywords = UserBlockList.find(item => item.type === 'keywords')?.values || [];

    comments.forEach(comment => {
        try {
            const commentId = comment.id.replace('comment', '');
            const usernameEl = comment.querySelector(SELECTORS.USERNAME);
            if (!usernameEl) return;

            const username = usernameEl.textContent.trim();
            const content = comment.querySelector(SELECTORS.CONTENT)?.textContent?.trim() || '';

            // 处理用户名链接
            if (!usernameEl.querySelector('a')) {
                const userLink = document.createElement('a');
                userLink.className = 'user-link';
                userLink.style.cssText = 'color:blue;text-decoration:underline;cursor:pointer;';
                userLink.textContent = username;
                
                userLink.oncontextmenu = (e) => {
                    e.preventDefault();
                    showContextMenu(e, commentId);
                    return false;
                };

                usernameEl.innerHTML = '';
                usernameEl.appendChild(userLink);
            }

            // 重置显示状态并检查是否需要屏蔽
            comment.style.removeProperty('display');
            if (shouldBlockComment(username, content, commentId, userList, blockedKeywords)) {
                comment.style.display = 'none';
            }
        } catch (err) {
            console.error('Error processing comment:', err);
        }
    });
}

// 判断是否需要屏蔽评论
function shouldBlockComment(username, content, commentId, userList, blockedKeywords) {
    if (!username) return false;

    // 检查用户名
    const isUserBlocked = userList.some(user => {
        // 正则匹配
        if (user.username.startsWith('/')) {
            return RegexUtils.test(user.username, username);
        }
        
        // 普通用户名匹配
        const isMatch = user.username === username;
        if (isMatch && !user.userId && commentId) {
            user.userId = parseInt(commentId);
            saveBlockList();
        }
        return isMatch || (user.userId && user.userId === parseInt(commentId));
    });

    if (isUserBlocked) return true;

    // 检查关键词
    return Boolean(content) && blockedKeywords.some(keyword => 
        typeof keyword === 'string' 
            ? content.toLowerCase().includes(keyword.toLowerCase())
            : keyword.test(content)
    );
}

// 显示右键菜单
function showContextMenu(event, commentId) {
    const menu = document.getElementById('dmhy-comment-context-menu');
    if (!menu) return;

    menu.style.position = 'fixed';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    menu.style.display = 'block';
    
    const username = event.target.textContent;
    
    const blockUserOption = document.getElementById('block-comment-user');
    if (blockUserOption) {
        blockUserOption.onclick = function(e) {
            e.stopPropagation();
            BlockListManager.addUser(username, commentId);
            menu.style.display = 'none';
        };
    }

    // 改进关闭菜单的逻辑
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.style.display = 'none';
            document.removeEventListener('click', closeMenu);
            document.removeEventListener('scroll', closeMenu);
        }
    };

    window.addEventListener('scroll', closeMenu, { once: true });
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
}

// 添加管理界面
function addBlocklistUI() {
    const maxAttempts = 5;
    let attempts = 0;

    function checkAndAddUI() {
        const mainBlocklistUI = document.getElementById('dmhy-blocklist-ui');
        
        if (mainBlocklistUI) {
            const mainButton = mainBlocklistUI.querySelector('button');
            if (mainButton) {
                mainButton.textContent = '管理种子黑名单';
            }
            
            if (!document.getElementById('show-comment-blocklist')) {
                const button = document.createElement('button');
                button.id = 'show-comment-blocklist';
                button.textContent = '管理评论黑名单';
                button.style.marginTop = '5px';
                button.style.display = 'block';
                mainBlocklistUI.appendChild(button);
                button.addEventListener('click', showBlocklistManager);
            }
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(checkAndAddUI, 200);
            } else {
                const uiHtml = `
                    <div id="dmhy-comment-blocklist-ui" style="position:fixed;left:10px;top:10px;z-index:9999;">
                        <button id="show-comment-blocklist">管理评论黑名单</button>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', uiHtml);
                document.getElementById('show-comment-blocklist')?.addEventListener('click', showBlocklistManager);
            }
        }
    }

    checkAndAddUI();
}

// 显示黑名单管理界面
function showBlocklistManager() {
    const existingManager = document.getElementById('comment-blocklist-manager');
    const existingOverlay = document.getElementById('comment-blocklist-overlay');
    if (existingManager) existingManager.remove();
    if (existingOverlay) existingOverlay.remove();

    const managerHtml = `
        <div id="comment-blocklist-manager" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
            background:white;padding:20px;border:1px solid #ccc;border-radius:5px;z-index:10000;
            width:500px;max-height:80vh;overflow-y:auto;">
            <h3 style="margin-top:0;">评论区黑名单管理</h3>
            <div style="margin-bottom:10px;">
                <label>用户黑名单（注意是用户名，用分号分隔）：</label><br>
                <textarea id="blocked-usernames" style="width:100%;height:60px;margin-top:5px;resize:none;"></textarea>
            </div>
            <div style="margin-bottom:10px;">
                <label>关键词屏蔽（用分号分隔）：</label><br>
                <textarea id="comment-keywords" style="width:100%;height:60px;margin-top:5px;resize:none;"></textarea>
                <div style="color:#666;font-size:12px;margin-top:5px;">
                    提示：支持普通文本和正则表达式<br>
                    - 普通文本直接输入，用分号分隔<br>
                    - 正则表达式用 / 包裹，例如：/\\d+/<br>
                    - 示例：文本1；/user\\d+/；文本2
                </div>
            </div>
            <div style="margin-top:10px;text-align:right;">
                <button id="save-comment-blocklist">保存</button>
                <button id="close-comment-manager">关闭</button>
            </div>
        </div>
        <div id="comment-blocklist-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;
            background:rgba(0,0,0,0.5);z-index:9999;"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', managerHtml);

    // 填充现有数据
    const userList = UserBlockList.find(item => item.type === 'users')?.values || [];
    const keywords = UserBlockList.find(item => item.type === 'keywords')?.values || [];

    document.getElementById('blocked-usernames').value = userList
        .map(user => user.username)
        .filter(username => username)
        .join('；');

    document.getElementById('comment-keywords').value = keywords.map(k => {
        if (k instanceof RegExp) {
            return `/${k.source}/`;
        }
        return k;
    }).join('；');

    // 绑定事件
    document.getElementById('close-comment-manager').addEventListener('click', function() {
        document.getElementById('comment-blocklist-manager')?.remove();
        document.getElementById('comment-blocklist-overlay')?.remove();
    });

    document.getElementById('comment-blocklist-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            document.getElementById('comment-blocklist-manager')?.remove();
            document.getElementById('comment-blocklist-overlay')?.remove();
        }
    });

    // 保存按钮事件
    document.getElementById('save-comment-blocklist').addEventListener('click', function() {
        const usernames = document.getElementById('blocked-usernames').value
            .split(/[;；]/)
            .map(name => name.trim())
            .filter(Boolean);

        const keywords = document.getElementById('comment-keywords').value
            .split(/[;；]/)
            .map(k => k.trim())
            .filter(Boolean);

        // 验证正则表达式
        const invalidUsername = usernames.find(name => !RegexUtils.isValid(name));
        if (invalidUsername) {
            showNotification(`用户名正则表达式错误: ${invalidUsername}`);
            return;
        }

        const invalidKeyword = keywords.find(k => !RegexUtils.isValid(k));
        if (invalidKeyword) {
            showNotification(`关键词正则表达式错误: ${invalidKeyword}`);
            return;
        }

        // 更新数据
        BlockListManager.updateUsers(usernames);
        BlockListManager.updateKeywords(keywords);

        saveBlockList();
        handleComments();
        
        document.getElementById('comment-blocklist-manager')?.remove();
        document.getElementById('comment-blocklist-overlay')?.remove();
        showNotification('黑名单已更新');
    });
}

// 添加右键菜单
function addContextMenu() {
    const menuHtml = `
        <div id="dmhy-comment-context-menu" style="
            display: none;
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 5px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 150px;
        ">
            <div id="block-comment-user" style="
                padding: 8px 12px;
                cursor: pointer;
                white-space: nowrap;
            ">
                添加评论用户到黑名单
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHtml);

    const blockUserOption = document.getElementById('block-comment-user');
    if (blockUserOption) {
        blockUserOption.addEventListener('mouseover', () => {
            blockUserOption.style.backgroundColor = '#f0f0f0';
        });
        blockUserOption.addEventListener('mouseout', () => {
            blockUserOption.style.backgroundColor = '';
        });
    }
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10001;
        font-size: 14px;
        transition: opacity 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 等待评论区加载
function waitForComments() {
    return new Promise((resolve) => {
        const commentTable = document.querySelector(SELECTORS.COMMENT_TABLE);
        if (commentTable?.querySelector(SELECTORS.USERNAME)) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
            const commentTable = document.querySelector(SELECTORS.COMMENT_TABLE);
            if (commentTable?.querySelector(SELECTORS.USERNAME)) {
                clearInterval(interval);
                resolve();
                return;
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

// 初始化
(function() {
    'use strict';
    
    loadBlockList();
    addBlocklistUI();
    addContextMenu();

    waitForComments().then(() => {
        handleComments();

        const commentList = document.querySelector('#comment_list');
        if (commentList) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        handleComments();
                    }
                }
            });

            observer.observe(commentList, {
                childList: true,
                subtree: true
            });
        }
    });
})();
