// ==UserScript==
// @name          屏蔽C站和NGA的傻逼-调试
// @namespace     http://tampermonkey.net/
// @version       0.4
// @description   屏蔽C站和NGA论坛中的指定用户，同时删除签名区块，支持一键屏蔽用户
// @author        forthejiong
// @match         *://*.chiphell.com/*
// @match         *://chiphell.com/*
// @match         *://ngabbs.com/*
// @match         *://*.nga.cn/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546731/%E5%B1%8F%E8%94%BDC%E7%AB%99%E5%92%8CNGA%E7%9A%84%E5%82%BB%E9%80%BC-%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/546731/%E5%B1%8F%E8%94%BDC%E7%AB%99%E5%92%8CNGA%E7%9A%84%E5%82%BB%E9%80%BC-%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽用户配置
    // 将用户列表作为变量直接定义，GM_getValue的键名使用字符串
    const CHIPHELL_BLOCK_KEY = 'chiphellBlockUsers';
    const NGA_BLOCK_UIDS_KEY = 'ngaBlockUids';
    const NGA_BLOCK_USERNAMES_KEY = 'ngaBlockUsernames';

    // 在这里直接添加/删除用户。修改这里保存，可生效。
    const defaultChiphellBlockUsers = [
        "destroypeter",
        "kthlon",
        "normanlu",
        "YsHaNg",
        "raoshine",
        // 在这里添加/删除 Chiphell 用户名，一行一个
        "new_user_1",
        "new_user_2"
    ];

    const defaultNgaBlockUids = [
        64542480,
        // 在这里添加/删除 NGA 的 UID，一行一个
        //建议使用UID避免用户修改名字之类的逃逸，建议手动添加或者把存储器的复制过来
        6680916,
        10086
    ];

    const defaultNgaBlockUsernames = [
        "张三",
        // 在这里添加/删除 NGA 的用户名，一行一个。“修改请注意引号和逗号格式”
        "李四",
        "王五"
    ];

    // 初始化屏蔽列表：从 Tampermonkey 存储中获取，如果没有则使用默认值
    let chiphellBlockUsers = GM_getValue(CHIPHELL_BLOCK_KEY, defaultChiphellBlockUsers);
    let ngaBlockUids = GM_getValue(NGA_BLOCK_UIDS_KEY, defaultNgaBlockUids).map(uid => Number(uid));
    let ngaBlockUsernames = GM_getValue(NGA_BLOCK_USERNAMES_KEY, defaultNgaBlockUsernames);
    // 从URL中提取UID（兼容相对/绝对URL）
    function getUidFromUrl(url) {
        try {
            const fullUrl = new URL(url, window.location.origin);
            const uid = fullUrl.searchParams.get('uid');
            return uid ? Number(uid) : null;
        } catch (e) {
            console.error(`解析UID失败: ${url}`, e);
            return null;
        }
    }

    // 检查用户是否应被屏蔽（增加类型校验）
    function shouldHideUser(site, identifier) {
        if (site === 'chiphell') {
            return typeof identifier === 'string' && chiphellBlockUsers.includes(identifier);
        } else if (site === 'nga' && typeof identifier === 'object') {
            const { uid, username } = identifier;
            return typeof uid === 'number' && ngaBlockUids.includes(uid) || typeof username === 'string' && ngaBlockUsernames.includes(username);
        }
        return false;
    }

    // 移除指定的DOM元素（增加安全校验，避免误删核心结构）
    function removeElement(element, reason) {
        // 安全校验：排除页面核心容器（根据NGA/Chiphell结构调整）
        const safeTagNames = ['TR', 'TBODY', 'DIV', 'TABLE'];
        const forbiddenIds = ['mainContent', 'postList', 'topicList'];
        const forbiddenClasses = ['forum-main', 'topic-container'];

        if (!element || !element.parentNode || !safeTagNames.includes(element.tagName) || forbiddenIds.includes(element.id) || Array.from(element.classList).some(cls => forbiddenClasses.includes(cls))) {
            console.warn(`[元素安全校验] 跳过删除非目标元素: ${element?.id || element?.tagName}`, reason);
            return false;
        }

        element.parentNode.removeChild(element);
        console.log(`[元素清理] 已移除: ${reason} (元素: ${element.id || element.tagName})`);
        return true;
    }

    // 删除id以postsign开头的div元素（增加选择器精确性）
    function removePostsignDivs() {
        // 精确匹配：仅删除class含"postsign"且id以"postsign"开头的div（避免误删其他元素）
        const postsignDivs = document.querySelectorAll('div[id^="postsign"][class*="postsign"]');
        postsignDivs.forEach(div => {
            removeElement(div, `签名区块 (ID: ${div.id})`);
        });
    }

    // 屏蔽指定用户的发言（优化选择器，避免重复操作）
    function hideTargetPosts() {
        const currentHost = window.location.hostname;

        // 处理Chiphell论坛（优化选择器，匹配首页和帖子页）
        if (currentHost.includes('chiphell.com')) {
            // 1. 处理首页/列表页的帖子（匹配tbody中的帖子行）
            const threadRows = document.querySelectorAll('tbody[id^="normalthread_"] tr:has(td.by cite a):not([data-processed])');
            threadRows.forEach(row => {
                row.setAttribute('data-processed', 'true');
                const userLink = row.querySelector('td.by cite a');
                if (!userLink) return;

                const username = userLink.textContent.trim();
                if (shouldHideUser('chiphell', username)) {
                    // 移除整个帖子行（包含标题、作者等信息的整行）
                    removeElement(row, `Chiphell帖子列表 (用户: ${username})`);
                }
            });

            // 2. 处理帖子详情页的回复（匹配帖子内容容器）
            const postContainers = document.querySelectorAll('div[id^="post_"]:has(a.xw1[href^="space-uid-"]):not([data-processed])');
            postContainers.forEach(container => {
                container.setAttribute('data-processed', 'true');
                const userLink = container.querySelector('a.xw1[href^="space-uid-"]');
                if (!userLink) return;

                const username = userLink.textContent.trim();
                if (shouldHideUser('chiphell', username)) {
                    removeElement(container, `Chiphell帖子详情 (用户: ${username}, 容器ID: ${container.id})`);
                }
            });
        }

        // 处理NGA论坛（分场景精确匹配，避免误删）
        else if (currentHost.includes('nga.cn')) {
            // 1. 处理回复帖（仅匹配.postrow行，标记已处理）
            const replyUserLinks = document.querySelectorAll('tr.postrow a.author[href*="uid="]:not([data-processed])');
            replyUserLinks.forEach(link => {
                link.setAttribute('data-processed', 'true');
                const uid = getUidFromUrl(link.href);
                const username = link.textContent.trim();
                if (uid && shouldHideUser('nga', { uid, username })) {
                    const postContainer = link.closest('tr.postrow');
                    if (postContainer) {
                        removeElement(postContainer, `NGA回复 (用户: ${username}, UID: ${uid})`);
                    }
                }
            });

            // 2. 处理主题帖（仅匹配含.c3列的tbody，标记已处理）
            const topicUserLinks = document.querySelectorAll('tbody td.c3 a.author[href*="uid="]:not([data-processed])');
            topicUserLinks.forEach(link => {
                link.setAttribute('data-processed', 'true');
                const uid = getUidFromUrl(link.href);
                const username = link.textContent.trim();
                if (uid && shouldHideUser('nga', { uid, username })) {
                    const topicContainer = link.closest('tbody');
                    if (topicContainer) {
                        removeElement(topicContainer, `NGA主题帖 (用户: ${username}, UID: ${uid})`);
                    }
                }
            });
        }
    }

    // 添加一键屏蔽按钮（避免重复添加，优化样式）
    function addBlockButtons() {
        const currentHost = window.location.hostname;
        if (!currentHost.includes('nga.cn')) return;

        // 仅匹配未添加按钮的用户链接
        const userLinks = document.querySelectorAll('a.author[href*="uid="]:not([data-has-block-btn])');
        userLinks.forEach(link => {
            link.setAttribute('data-has-block-btn', 'true');
            const uid = getUidFromUrl(link.href);
            if (!uid) return;

            // 创建屏蔽按钮（避免inline样式冲突，用GM_addStyle）
            const blockBtn = document.createElement('a');
            blockBtn.href = 'javascript:void(0)';
            blockBtn.textContent = '屏蔽';
            blockBtn.className = 'nga-block-button';
            blockBtn.dataset.uid = uid;

            // 按钮点击事件（优化逻辑，避免重复添加）
            blockBtn.addEventListener('click', () => {
                const targetUid = Number(blockBtn.dataset.uid);
                if (ngaBlockUids.includes(targetUid)) {
                    alert(`该用户（UID: ${targetUid}）已在屏蔽列表中`);
                    return;
                }

                if (confirm(`确定要屏蔽 UID: ${targetUid} 吗？`)) {
                    ngaBlockUids.push(targetUid);
                    GM_setValue(NGA_BLOCK_UIDS_KEY, ngaBlockUids);
                    console.log(`[一键屏蔽] 已添加 UID: ${targetUid} 到屏蔽列表`);
                    window.location.reload();
                }
            });

            link.after(blockBtn);
        });

        // 用GM_addStyle添加样式，避免inline样式冲突
        GM_addStyle(`
            .nga-block-button {
                font-size: 10px;
                color: #ff5722;
                margin-left: 5px;
                cursor: pointer;
                text-decoration: underline;
                padding: 0 2px;
                border: none;
                background: transparent;
            }
            .nga-block-button:hover {
                color: #e64a19;
            }
        `);
    }

    // 核心执行函数（增加防抖，避免重复执行）
    let runScriptDebounce;
    function runScript() {
        // 防抖：50ms内只执行一次，避免频繁触发
        clearTimeout(runScriptDebounce);
        runScriptDebounce = setTimeout(() => {
            removePostsignDivs();
            hideTargetPosts();
            addBlockButtons();
        }, 50);
    }

    // 初始执行：等待DOM完全加载后再执行（关键修复）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runScript);
    } else {
        runScript();
    }

    // 优化MutationObserver：缩小监听范围，减少触发频率
    const observer = new MutationObserver((mutations) => {
        // 仅当新增节点是元素节点时才执行（过滤文本/注释节点）
        const hasUsefulNodes = mutations.some(mut => Array.from(mut.addedNodes).some(node => node.nodeType === 1));
        if (hasUsefulNodes) {
            runScript();
        }
    });

    // 监听范围优化：仅监听帖子列表容器（根据NGA/Chiphell结构调整）
    const targetContainer = document.querySelector('#postList, #topicList, .forum-main, #threadlist') || document.body;
    observer.observe(targetContainer, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 页面卸载时断开监听，避免内存泄漏
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();