// ==UserScript==
// @name         洋抖黑名单
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在TikTok搜索结果页面右键屏蔽用户
// @author       Anonymous
// @match        https://www.tiktok.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/533838/%E6%B4%8B%E6%8A%96%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/533838/%E6%B4%8B%E6%8A%96%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建右键菜单
    function createContextMenu() {
        const menu = document.createElement('div');
        menu.id = 'block-user-menu';
        // 设置菜单样式：绝对定位、白色背景、边框、阴影、圆角，字体颜色为黑色
        menu.style = "position:absolute; background:#fff; border:1px solid #ccc; padding:5px 10px; display:none; z-index:10000; cursor:pointer; border-radius:4px; box-shadow:2px 2px 6px rgba(0,0,0,0.2); color:#000;";
        // 设置菜单文本，带禁止图标
        menu.innerText = "🚫 屏蔽该用户";
        document.body.appendChild(menu);
        return menu;
    }

    // 隐藏右键菜单
    function hideContextMenu(menu) {
        menu.style.display = 'none';
    }

    // 从存储中加载黑名单用户
    function loadBlockedUsers() {
        return GM_getValue('blockedUsers', []);
    }

    // 保存黑名单用户到存储
    function saveBlockedUsers(blockedUsers) {
        GM_setValue('blockedUsers', blockedUsers);
    }

    // 屏蔽用户并隐藏对应元素
    function blockUser(element, username) {
        // 隐藏元素
        element.style.display = 'none';

        // 将用户添加到黑名单
        const blockedUsers = loadBlockedUsers();
        if (!blockedUsers.includes(username)) {
            blockedUsers.push(username);
            saveBlockedUsers(blockedUsers);
        }
    }

    // 应用黑名单，隐藏已屏蔽用户的元素
    function applyBlockedUsers() {
        const blockedUsers = loadBlockedUsers();
        document.querySelectorAll('div[class*="DivItemContainerForSearch"]').forEach(element => {
            const usernameElement = element.querySelector('[data-e2e="search-card-user-unique-id"]');
            if (usernameElement) {
                const username = usernameElement.textContent.trim();
                if (blockedUsers.includes(username)) {
                    element.style.display = 'none';
                }
            }
        });
    }

    // 初始化脚本
    function init() {
        const menu = createContextMenu();
        hideContextMenu(menu);

        // 监听右键事件
        document.addEventListener('contextmenu', function(e) {
            const target = e.target.closest('div[class*="DivItemContainerForSearch"]');
            if (target) {
                e.preventDefault();
                menu.style.display = 'block';
                menu.style.left = `${e.pageX}px`;
                menu.style.top = `${e.pageY}px`;

                // 存储目标元素以便后续操作
                menu.currentTarget = target;
            } else {
                hideContextMenu(menu);
            }
        });

        // 处理菜单点击事件
        menu.addEventListener('click', function() {
            if (menu.currentTarget) {
                const usernameElement = menu.currentTarget.querySelector('[data-e2e="search-card-user-unique-id"]');
                if (usernameElement) {
                    const username = usernameElement.textContent.trim();
                    blockUser(menu.currentTarget, username);
                }
            }
            hideContextMenu(menu);
        });

        // 点击页面其他地方时隐藏菜单
        document.addEventListener('click', function() {
            hideContextMenu(menu);
        });

        // 初始加载时应用黑名单
        applyBlockedUsers();

        // 监听DOM变化，确保刷新或动态加载时黑名单生效
        const observer = new MutationObserver(() => {
            applyBlockedUsers();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行初始化
    init();
})();