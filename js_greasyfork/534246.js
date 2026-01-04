// ==UserScript==
// @name         YouTube Emoji Comment Auto-Blocker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动屏蔽YouTube评论中包含Emoji的用户（添加到黑名单并隐藏评论），支持Gist云同步，并保留手动屏蔽功能。
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534246/YouTube%20Emoji%20Comment%20Auto-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/534246/YouTube%20Emoji%20Comment%20Auto-Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const GITHUB_TOKEN = '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';
    const GIST_ID = '54b6edbb5dcd61c3c60f205719304555';
    const GIST_FILENAME = 'youtube_blocked_users.txt';

    let blockedUsers = [];
    let isProcessingComments = false;

    // Emoji Unicode范围
    const emojiRanges = [
        { start: 0x1F600, end: 0x1F64F }, // 表情符号
        { start: 0x1F300, end: 0x1F5FF }, // 杂项符号与象形文字
        { start: 0x1F680, end: 0x1F6FF }, // 运输与地图
        { start: 0x1F700, end: 0x1F77F }, // 炼金术符号
        { start: 0x1F780, end: 0x1F7FF }, // 几何形状
        { start: 0x1F800, end: 0x1F8FF }, // 补充箭头-C
        { start: 0x1F900, end: 0x1F9FF }, // 补充符号与象形文字
        { start: 0x1FA00, end: 0x1FA6F }, // 国际象棋符号
        { start: 0x1FA70, end: 0x1FAFF }, // 扩展符号与象形文字-A
        { start: 0x2600, end: 0x26FF },   // 杂项符号
        { start: 0x2700, end: 0x27BF },   // 装饰符号
        { start: 0x2300, end: 0x23FF },   // 杂项技术符号
        { start: 0x2B00, end: 0x2BFF },   // 杂项符号与箭头
        { start: 0x3000, end: 0x303F }    // CJK符号与标点
    ];

    // --- Emoji检测函数 ---
    function isEmoji(char) {
        const code = char.codePointAt(0);
        return code && emojiRanges.some(range => code >= range.start && code <= range.end);
    }

    function containsEmoji(text) {
        if (!text) return false;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.codePointAt(i);
            if (charCode !== text.charCodeAt(i)) {
                if (isEmoji(String.fromCodePoint(charCode))) return true;
                i++;
            } else if (isEmoji(text.charAt(i))) return true;
        }
        return false;
    }

    function checkCommentForEmoji(commentElement) {
        // 检查评论文本内容
        const contentSelectors = ['#content-text', '.ytd-comment-renderer #content-text', 'yt-formatted-string[id*=content-text]', '[id*=content-text]'];
        let commentText = '';
        for (const selector of contentSelectors) {
            const contentElement = commentElement.querySelector(selector);
            if (contentElement) {
                commentText = contentElement.textContent.trim();
                if (containsEmoji(commentText)) {
                    console.log(`检测到文本Emoji: ${commentText}`);
                    return true;
                }
            }
        }

        // 检查评论中的图片Emoji
        const imgElements = commentElement.querySelectorAll('img');
        for (const img of imgElements) {
            const alt = img.getAttribute('alt') || '';
            const src = img.getAttribute('src') || '';
            if (containsEmoji(alt) || src.includes('emoji') || src.includes('twemoji')) {
                console.log(`检测到图片Emoji: alt=${alt}, src=${src}`);
                return true;
            }
        }

        console.log(`评论无Emoji: ${commentText || '空评论'}`);
        return false;
    }

    // --- 云同步函数 ---
    async function syncBlockedUsersFromGist() {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.github.com/gists/${GIST_ID}`,
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    onload: res => resolve(res),
                    onerror: err => reject(err)
                });
            });
            const gistData = JSON.parse(response.responseText);
            if (gistData.files && gistData.files[GIST_FILENAME]) {
                blockedUsers = gistData.files[GIST_FILENAME].content.split('\n').map(u => u.trim()).filter(Boolean);
                GM_setValue('blockedUsers', blockedUsers);
                console.log('云端黑名单同步成功，当前黑名单:', blockedUsers);
            }
        } catch (err) {
            console.error('同步Gist失败:', err);
        }
    }

    async function uploadBlockedUsersToGist() {
        try {
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PATCH',
                    url: `https://api.github.com/gists/${GIST_ID}`,
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    data: JSON.stringify({
                        files: { [GIST_FILENAME]: { content: blockedUsers.join('\n') } }
                    }),
                    onload: res => resolve(res),
                    onerror: err => reject(err)
                });
            });
            console.log('黑名单已上传到云端:', blockedUsers);
        } catch (err) {
            console.error('上传Gist失败:', err);
        }
    }

    // --- 黑名单管理 ---
    async function addUserToBlockList(username, isAuto = false) {
        if (!username) {
            console.error('尝试添加空用户名到黑名单');
            return false;
        }
        if (!blockedUsers.includes(username)) {
            blockedUsers.push(username);
            GM_setValue('blockedUsers', blockedUsers);
            await uploadBlockedUsersToGist();
            if (!isAuto) alert(`"${username}" 已添加到屏蔽列表`);
            console.log(`用户 "${username}" 已添加至黑名单，自动添加=${isAuto}`);
            hideBlockedUserComments();
            return true;
        }
        console.log(`用户 "${username}" 已存在于黑名单`);
        return false;
    }

    async function manageBlockedUsers() {
        if (blockedUsers.length === 0) {
            alert('屏蔽列表为空');
            return;
        }
        const userToRemove = prompt(`当前屏蔽用户:\n${blockedUsers.join('\n')}\n\n输入要移除的用户名:`);
        if (userToRemove) {
            const index = blockedUsers.indexOf(userToRemove);
            if (index > -1) {
                blockedUsers.splice(index, 1);
                GM_setValue('blockedUsers', blockedUsers);
                await uploadBlockedUsersToGist();
                alert(`"${userToRemove}" 已移除`);
                location.reload();
            } else {
                alert(`屏蔽列表中没有 "${userToRemove}"`);
            }
        }
    }

    // --- 评论处理 ---
    function addBlockButton(authorElement, authorName, commentElement) {
        if (authorElement.parentNode.querySelector('.block-user-btn')) return;

        const isBlocked = blockedUsers.includes(authorName);
        const blockButton = document.createElement('button');
        blockButton.textContent = isBlocked ? '已屏蔽' : '屏蔽';
        blockButton.className = 'block-user-btn';
        blockButton.title = isBlocked ? '此用户已被屏蔽' : '点击屏蔽此用户';
        blockButton.style.marginLeft = '8px';
        blockButton.style.fontSize = '12px';
        blockButton.style.padding = '2px 8px';
        blockButton.style.border = 'none';
        blockButton.style.borderRadius = '2px';
        blockButton.style.cursor = 'pointer';
        blockButton.style.backgroundColor = isBlocked ? '#888' : '#cc0000';
        blockButton.style.color = '#fff';
        if (isBlocked) blockButton.disabled = true;
        else {
            blockButton.addEventListener('click', async e => {
                e.preventDefault();
                e.stopPropagation();
                if (await addUserToBlockList(authorName)) {
                    blockButton.textContent = '已屏蔽';
                    blockButton.disabled = true;
                    blockButton.style.backgroundColor = '#888';
                    if (commentElement) commentElement.style.display = 'none';
                }
            });
        }
        authorElement.parentNode.insertBefore(blockButton, authorElement.nextSibling);
    }

    function findCommentElement(element) {
        let parent = element, depth = 0;
        while (parent && depth < 10) {
            if (parent.tagName?.startsWith('YTD-COMMENT') || parent.classList.contains('ytd-comment-renderer')) {
                return parent;
            }
            parent = parent.parentElement;
            depth++;
        }
        console.warn('未找到评论元素:', element);
        return null;
    }

    function processComments() {
        if (isProcessingComments) return;
        isProcessingComments = true;
        try {
            const authorSelectors = ['#author-text', '.ytd-comment-renderer #author-text', 'yt-formatted-string#author-text'];
            authorSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(async authorElement => {
                    const authorName = authorElement.textContent.trim();
                    if (!authorName) {
                        console.warn('用户名为空，跳过处理');
                        return;
                    }

                    const commentElement = findCommentElement(authorElement);
                    if (!commentElement) return;

                    // 检查评论是否包含Emoji
                    const hasEmoji = checkCommentForEmoji(commentElement);

                    // 如果包含Emoji，自动屏蔽用户
                    if (hasEmoji && !blockedUsers.includes(authorName)) {
                        await addUserToBlockList(authorName, true);
                        if (commentElement) commentElement.style.display = 'none';
                    }

                    // 添加屏蔽按钮并处理已屏蔽用户
                    addBlockButton(authorElement, authorName, commentElement);
                    if (blockedUsers.includes(authorName)) {
                        if (commentElement) commentElement.style.display = 'none';
                    }
                });
            });
        } catch (e) {
            console.error('处理评论出错:', e);
        }
        isProcessingComments = false;
    }

    function hideBlockedUserComments() {
        document.querySelectorAll('ytd-comment-renderer, ytd-comment-thread-renderer').forEach(comment => {
            const authorElement = comment.querySelector('#author-text, .ytd-comment-renderer #author-text, yt-formatted-string#author-text');
            if (authorElement && blockedUsers.includes(authorElement.textContent.trim())) {
                comment.style.display = 'none';
            }
        });
    }

    // --- 观察者 ---
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            let hasNewComments = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.matches('ytd-comment-renderer, ytd-comment-thread-renderer') || node.querySelector('ytd-comment-renderer, ytd-comment-thread-renderer'))) {
                        hasNewComments = true;
                    }
                });
            });
            if (hasNewComments) {
                processComments();
                hideBlockedUserComments();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupUrlChangeObserver() {
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(async () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('URL变化，重新同步黑名单');
                await syncBlockedUsersFromGist();
                setTimeout(() => {
                    processComments();
                    hideBlockedUserComments();
                }, 2000); // 增加延迟以确保评论加载
            }
        });
        urlObserver.observe(document, { childList: true, subtree: true });
    }

    // --- 初始化 ---
    async function init() {
        blockedUsers = GM_getValue('blockedUsers', []);
        await syncBlockedUsersFromGist();
        setTimeout(() => {
            processComments();
            hideBlockedUserComments();
        }, 2000); // 增加初始延迟

        setupMutationObserver();
        setupUrlChangeObserver();

        window.addEventListener('scroll', () => {
            clearTimeout(window.scrollTimer);
            window.scrollTimer = setTimeout(() => {
                processComments();
                hideBlockedUserComments();
            }, 300);
        }, { passive: true });

        GM_registerMenuCommand('添加用户到屏蔽列表', () => addUserToBlockList());
        GM_registerMenuCommand('查看/删除已屏蔽用户', manageBlockedUsers);
        GM_registerMenuCommand('立即同步黑名单（从Gist）', async () => {
            await syncBlockedUsersFromGist();
            alert('黑名单已同步！');
            processComments();
            hideBlockedUserComments();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();