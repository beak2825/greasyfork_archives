// ==UserScript==
// @name         贴吧黑名单
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  拉黑特定用户建立用户名黑名单
// @author       AI
// @match        https://tieba.baidu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/537437/%E8%B4%B4%E5%90%A7%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/537437/%E8%B4%B4%E5%90%A7%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 Tampermonkey storage 初始化黑名单（JSON 格式）
    let blockedUsersObj = JSON.parse(GM_getValue('tiebaBlockedUsers', '{"tiebaBlockedUsers": []}'));
    let blockedUsers = blockedUsersObj.tiebaBlockedUsers;

    // 保存黑名单到 Tampermonkey storage（JSON 格式）
    function saveBlockedUsers() {
        GM_setValue('tiebaBlockedUsers', JSON.stringify({ tiebaBlockedUsers: blockedUsers }));
    }

    // 检查用户是否在黑名单中
    function isBlocked(username) {
        return blockedUsers.includes(username);
    }

    // 添加用户到黑名单（插入到顶部）
    function blockUser(username) {
        if (!isBlocked(username)) {
            blockedUsers.unshift(username); // 新用户名添加到数组顶部
            saveBlockedUsers();
            hideUserContent(username);
        }
    }

    // 缓存用户信息（id 到 show_nickname 的映射）
    const userCache = new Map();

    // 获取 show_nickname
    function getShowNickname(url, callback) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const userId = urlParams.get('id');
        if (userCache.has(userId)) {
            callback(userCache.get(userId));
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.no === 0 && data.data?.show_nickname) {
                        userCache.set(userId, data.data.show_nickname);
                        callback(data.data.show_nickname);
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    console.error('解析用户信息失败:', e);
                    callback(null);
                }
            },
            onerror: function() {
                console.error('获取用户信息失败:', url);
                callback(null);
            }
        });
    }

    // 隐藏特定用户的内容
    function hideUserContent(username) {
        // 隐藏帖子（情况 a）
        document.querySelectorAll('.j_thread_list').forEach(thread => {
            const authorLink = thread.querySelector('.frs-author-name');
            if (authorLink && authorLink.href.includes('/home/main')) {
                getShowNickname(authorLink.href, (showNickname) => {
                    if (showNickname === username) {
                        thread.style.display = 'none';
                    }
                });
            }
        });

        // 隐藏帖子内容和评论（情况 b 和 c）
        document.querySelectorAll('.l_post').forEach(post => {
            const authorLink = post.querySelector('.p_author_name, .j_user_card');
            if (authorLink && authorLink.textContent.trim() === username) {
                post.style.display = 'none';
            }
        });

        // 隐藏子评论（情况 d）
        document.querySelectorAll('.lzl_single_post').forEach(comment => {
            const authorLink = comment.querySelector('.j_user_card, .at.j_user_card');
            if (authorLink && authorLink.textContent.trim() === username) {
                comment.style.display = 'none';
            }
        });
    }

    // 创建右键菜单
    function createContextMenu() {
        const menu = document.createElement('div');
        menu.id = 'tiebaBlockMenu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            z-index: 100000; /* 高 z-index 避免被其他悬停内容覆盖 */
            padding: 5px 15px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(menu);
        return menu;
    }

    // 隐藏右键菜单
    function hideContextMenu(menu) {
        if (menu) {
            menu.style.display = 'none';
        }
    }

    // 显示右键菜单
    function showContextMenu(menu, x, y, username, isThread, target) {
        if (isThread) {
            const url = target.href;
            if (url && url.includes('/home/main')) {
                getShowNickname(url, (showNickname) => {
                    if (showNickname) {
                        menu.textContent = `屏蔽 ${showNickname}`;
                        menu.style.left = `${x + 5}px`; // 稍偏右避免覆盖鼠标
                        menu.style.top = `${y + 5}px`; // 稍偏下
                        menu.style.display = 'block';
                        menu.onclick = () => {
                            blockUser(showNickname);
                            hideContextMenu(menu);
                        };
                    } else {
                        menu.textContent = '屏蔽用户（获取用户名失败）';
                        menu.style.display = 'none';
                    }
                });
            } else {
                menu.style.display = 'none';
            }
        } else {
            menu.textContent = `屏蔽 ${username}`;
            menu.style.left = `${x + 5}px`;
            menu.style.top = `${y + 5}px`;
            menu.style.display = 'block';
            menu.onclick = () => {
                blockUser(username);
                hideContextMenu(menu);
            };
        }
    }

    // 初始化右键菜单
    const contextMenu = createContextMenu();
    hideContextMenu(contextMenu);

    // 给用户名元素添加右键监听（带调试日志）
    document.addEventListener('contextmenu', (e) => {
        console.log('右键触发:', {
            tagName: e.target.tagName,
            classList: e.target.classList ? Array.from(e.target.classList) : [],
            parentElement: e.target.parentElement ? {
                tagName: e.target.parentElement.tagName,
                classList: Array.from(e.target.parentElement.classList)
            } : null,
            textContent: e.target.textContent.trim(),
            href: e.target.href || '无 href'
        });

        if (e.target.tagName === 'A' && (
            e.target.classList.contains('frs-author-name') ||
            e.target.classList.contains('p_author_name') ||
            e.target.classList.contains('j_user_card') ||
            (e.target.classList.contains('at') && e.target.classList.contains('j_user_card'))
        )) {
            e.preventDefault();
            console.log('匹配到用户名链接:', e.target.textContent.trim());
            const isThread = e.target.classList.contains('frs-author-name');
            const username = e.target.textContent.trim();
            showContextMenu(contextMenu, e.pageX, e.pageY, username, isThread, e.target);
        } else {
            console.log('未匹配到用户名链接，隐藏菜单');
            hideContextMenu(contextMenu);
        }
    });

    // 点击页面其他地方隐藏右键菜单
    document.addEventListener('click', () => {
        console.log('点击页面，隐藏菜单');
        hideContextMenu(contextMenu);
    });

    // 页面加载时隐藏所有黑名单用户的内容
    blockedUsers.forEach(hideUserContent);

    // 观察 DOM 变化以处理动态加载的内容
    const observer = new MutationObserver(() => {
        console.log('检测到 DOM 变化，重新检查黑名单内容');
        blockedUsers.forEach(hideUserContent);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();