// ==UserScript==
// @name         Keyword-based Tweet Filtering for Threads
// @name:zh-TW   Threads 關鍵字過濾推文
// @name:zh-CN   Threads 关键字过滤推文
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  As long as any section of a tweet—such as the main content, hashtags, or username—matches a keyword, the entire tweet will be hidden. Supports adding, listing, and individually deleting keywords. Supports quick blocking, listing, and individually deleting blocked users. Menu can be switched between Chinese and English.
// @description:zh-TW 只要推文主體、標籤、用戶名等任一區塊命中關鍵字，整則推文一起隱藏。支援關鍵字新增、清單、單獨刪除。支援快速封鎖、清單、單獨刪除。中英菜單切換。
// @description:zh-CN 只要推文主体、标签、用户名等任一区块命中关键字，整则推文一起隐藏。支援关键字新增、清单、单独删除。支援快速封锁、清单、单独删除。中英菜单切换。
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545432/Keyword-based%20Tweet%20Filtering%20for%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/545432/Keyword-based%20Tweet%20Filtering%20for%20Threads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 多語言支援 =====
    const LANGS = {
        zh: {
            addKeyword: '新增關鍵字',
            keywordList: '關鍵字清單/刪除',
            clearKeywords: '清除所有關鍵字',
            blockList: '封鎖名單管理',
            clearBlocks: '清除所有封鎖用戶',
            langSwitch: '語言 中文',
            blockUser: '封鎖用戶',
            confirmBlock: username => `確定要封鎖 @${username} 嗎？\n（此用戶所有推文將被隱藏）`,
            blocked: username => `已封鎖 @${username}！`,
            addKeywordPrompt: '請輸入要新增的關鍵字（可用半形或全形逗號分隔，一次可多個）：',
            addedKeyword: '已新增關鍵字！',
            noKeyword: '目前沒有設定任何關鍵字。',
            keywordListMsg: (list) => `目前關鍵字如下：\n${list}\n請輸入要刪除的關鍵字編號（可多個，用逗號分隔），或留空取消：`,
            deletedKeyword: '已刪除指定關鍵字！',
            clearedKeyword: '已清除所有關鍵字！',
            noBlockUser: '目前沒有封鎖任何用戶。',
            blockListMsg: (list) => `目前封鎖用戶如下：\n${list}\n請輸入要解除封鎖的用戶編號（可多個，用逗號分隔），或留空取消：`,
            unblocked: '已解除指定用戶封鎖！',
            clearedBlock: '已清除所有封鎖用戶！',
        },
        en: {
            addKeyword: 'Add Keyword',
            keywordList: 'Keyword List/Delete',
            clearKeywords: 'Clear All Keywords',
            blockList: 'Blocked Users',
            clearBlocks: 'Clear All Blocked Users',
            langSwitch: 'language EN',
            blockUser: 'Block User',
            confirmBlock: username => `Are you sure to block @${username}?\n(All posts from this user will be hidden)`,
            blocked: username => `@${username} has been blocked!`,
            addKeywordPrompt: 'Enter keywords to add (comma or Chinese comma separated, multiple allowed):',
            addedKeyword: 'Keyword(s) added!',
            noKeyword: 'No keywords set.',
            keywordListMsg: (list) => `Current keywords:\n${list}\nEnter the number(s) to delete (comma separated), or leave blank to cancel:`,
            deletedKeyword: 'Selected keyword(s) deleted!',
            clearedKeyword: 'All keywords cleared!',
            noBlockUser: 'No users blocked.',
            blockListMsg: (list) => `Blocked users:\n${list}\nEnter the number(s) to unblock (comma separated), or leave blank to cancel:`,
            unblocked: 'Selected user(s) unblocked!',
            clearedBlock: 'All blocked users cleared!',
        }
    };

    function getLang() {
        return GM_getValue('lang', (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
    }
    function setLang(lang) {
        GM_setValue('lang', lang);
    }
    function t(key, ...args) {
        const lang = getLang();
        const str = LANGS[lang][key];
        return typeof str === 'function' ? str(...args) : str;
    }

    // 關鍵字相關
    function getKeywords() {
        return GM_getValue('keywords', []);
    }
    function setKeywords(keywords) {
        GM_setValue('keywords', keywords);
    }

    // 封鎖用戶相關
    function getBlockedUsers() {
        return GM_getValue('blockedUsers', []);
    }
    function setBlockedUsers(users) {
        GM_setValue('blockedUsers', users);
    }

    // 取得所有推文主容器
    function getAllPostContainers() {
        return document.querySelectorAll('div[data-pressable-container][class*=" "]');
    }

    // 在推文主容器下，找所有可能含有文字的區塊
    function getAllTextBlocks(container) {
        return container.querySelectorAll('span[dir="auto"]:not([translate="no"]), a[role="link"], span, div');
    }

    // 取得用戶名稱（Threads 通常在 a[href^="/@"] 內）
    function getUsername(container) {
        let a = container.querySelector('a[href^="/@"]');
        if (a) {
            let username = a.getAttribute('href').replace('/', '').replace('@', '');
            return username;
        }
        return null;
    }

    // 過濾推文（不區分大小寫）
    function filterPosts() {
        let keywords = getKeywords().map(k => k.toLowerCase());
        let blockedUsers = getBlockedUsers();
        let containers = getAllPostContainers();
        containers.forEach(container => {
            let blocks = getAllTextBlocks(container);
            let matched = false;
            // 關鍵字過濾（不區分大小寫）
            blocks.forEach(block => {
                let text = (block.innerText || block.textContent || "").trim().toLowerCase();
                if (text && keywords.some(keyword => keyword && text.includes(keyword))) {
                    matched = true;
                }
            });
            // 封鎖用戶過濾
            let username = getUsername(container);
            if (username && blockedUsers.includes(username)) {
                matched = true;
            }
            if (matched) {
                container.style.display = 'none';
            } else {
                container.style.display = '';
            }
        });
    }

    // 插入封鎖用戶按鈕（插在「分享」按鈕右邊）
    function insertBlockButtons() {
        let shareSvgs = document.querySelectorAll('svg[aria-label="分享"], svg[aria-label="Share"]');
        let blockedUsers = getBlockedUsers();

        shareSvgs.forEach(svg => {
            let shareBtnDiv = svg.closest('div[role="button"]');
            if (!shareBtnDiv) return;

            // 找到推文主容器
            let container = shareBtnDiv;
            for (let i = 0; i < 10; i++) {
                if (!container) break;
                if (container.hasAttribute('data-pressable-container')) break;
                container = container.parentElement;
            }
            if (!container || !container.hasAttribute('data-pressable-container')) return;

            // 避免重複插入
            if (container.querySelector('.tm-block-user-btn')) return;

            let username = getUsername(container);
            if (!username) return;

            // 建立封鎖按鈕
            let blockBtn = document.createElement('button');
            blockBtn.className = 'tm-block-user-btn';
            blockBtn.title = t('blockUser');
            blockBtn.style.marginLeft = '8px';
            blockBtn.style.background = 'none';
            blockBtn.style.border = 'none';
            blockBtn.style.cursor = 'pointer';
            blockBtn.style.fontSize = '18px';
            blockBtn.style.color = '#d00';
            blockBtn.textContent = '🚫'; // 這裡改成 textContent

            blockBtn.onclick = function(e) {
                e.stopPropagation();
                if (confirm(t('confirmBlock', username))) {
                    let users = getBlockedUsers();
                    if (!users.includes(username)) {
                        users.unshift(username);
                        setBlockedUsers(users);
                        alert(t('blocked', username));
                        filterPosts();
                    }
                }
            };

            shareBtnDiv.parentNode.insertBefore(blockBtn, shareBtnDiv.nextSibling);
        });
    }

    // observer 只監控新節點
    const observer = new MutationObserver(mutations => {
        let needFilter = false;
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length > 0) {
                needFilter = true;
                break;
            }
        }
        if (needFilter) {
            filterPosts();
            insertBlockButtons();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始執行一次
    filterPosts();
    insertBlockButtons();

    // 新增關鍵字
    GM_registerMenuCommand(t('addKeyword'), () => {
        let input = prompt(t('addKeywordPrompt'));
        if (input !== null) {
            let arr = input.trim().split(/[\s,，]+/).map(s => s.trim()).filter(Boolean);
            let keywords = getKeywords();
            let newKeywords = [...keywords];
            arr.forEach(k => {
                if (!newKeywords.includes(k)) newKeywords.unshift(k);
            });
            setKeywords(newKeywords);
            alert(t('addedKeyword'));
            location.reload();
        }
    });

    // 關鍵字清單與單獨刪除（分頁，跨頁連續編號）
    GM_registerMenuCommand(t('keywordList'), () => {
    let keywords = getKeywords();
    if (keywords.length === 0) {
        alert(t('noKeyword'));
        return;
    }
    const pageSize = 500;
    let currentPage = 0;
    const totalPages = Math.ceil(keywords.length / pageSize);

    while (true) {
        const start = currentPage * pageSize;
        const end = Math.min(start + pageSize, keywords.length);
        const pageItems = keywords.slice(start, end)
            .map((k, i) => `${start + i + 1}. ${k}`).join('\n');
        const pageInfo = `(${currentPage + 1} / ${totalPages} 頁)`;
        let msg = `${pageInfo}\n${pageItems}\n\n${t('keywordListMsg', '')}\n> 下一頁  < 上一頁`;
        let input = prompt(msg, '');
        if (input === null || input.trim() === '') break;

        const cmd = input.trim();
        if (cmd === '>' && currentPage < totalPages - 1) {
            currentPage++;
            continue;
        }
        if (cmd === '<' && currentPage > 0) {
            currentPage--;
            continue;
        }

        // 刪除指定編號（全清單編號）
        let idxArr = input.trim().split(/[\s,，]+/)
            .map(s => parseInt(s.trim(), 10) - 1)
            .filter(i => !isNaN(i) && i >= 0 && i < keywords.length);

        if (idxArr.length > 0) {
            keywords = keywords.filter((_, i) => !idxArr.includes(i));
            setKeywords(keywords);

            // 若刪除後頁數減少，確保 currentPage 在範圍內
            currentPage = Math.min(currentPage, Math.ceil(keywords.length / pageSize) - 1);

            alert(t('deletedKeyword'));
            if (keywords.length === 0) break; // 全刪完就跳出
            continue; // 保留在當前頁面繼續操作
        }
    }
});

    // 清除所有關鍵字
    GM_registerMenuCommand(t('clearKeywords'), () => {
        setKeywords([]);
        alert(t('clearedKeyword'));
        location.reload();
    });

    // 封鎖名單管理（分頁，跨頁連續編號）
    GM_registerMenuCommand(t('blockList'), () => {
    let users = getBlockedUsers();
    if (users.length === 0) {
        alert(t('noBlockUser'));
        return;
    }
    const pageSize = 500;
    let currentPage = 0;
    const totalPages = Math.ceil(users.length / pageSize);

    while (true) {
        const start = currentPage * pageSize;
        const end = Math.min(start + pageSize, users.length);
        const pageItems = users.slice(start, end)
            .map((u, i) => `${start + i + 1}. @${u}`).join('\n');
        const pageInfo = `(${currentPage + 1} / ${totalPages} 頁)`;
        let msg = `${pageInfo}\n${pageItems}\n\n${t('blockListMsg', '')}\n> 下一頁  < 上一頁`;
        let input = prompt(msg, '');
        if (input === null || input.trim() === '') break;

        const cmd = input.trim();
        if (cmd === '>' && currentPage < totalPages - 1) {
            currentPage++;
            continue;
        }
        if (cmd === '<' && currentPage > 0) {
            currentPage--;
            continue;
        }

        // 解除封鎖（全清單編號）
        let idxArr = input.trim().split(/[\s,，]+/)
            .map(s => parseInt(s.trim(), 10) - 1)
            .filter(i => !isNaN(i) && i >= 0 && i < users.length);

        if (idxArr.length > 0) {
            users = users.filter((_, i) => !idxArr.includes(i));
            setBlockedUsers(users);

            // 若刪除後頁數減少，確保 currentPage 在範圍內
            currentPage = Math.min(currentPage, Math.ceil(users.length / pageSize) - 1);

            alert(t('unblocked'));
            if (users.length === 0) break; // 全刪完就跳出
            continue; // 保留在當前頁面繼續操作
        }
    }
});

    // 清除所有封鎖用戶
    GM_registerMenuCommand(t('clearBlocks'), () => {
        setBlockedUsers([]);
        alert(t('clearedBlock'));
        location.reload();
    });

    // ===== 語言切換按鈕（放在最後） =====
    GM_registerMenuCommand(t('langSwitch'), () => {
        let current = getLang();
        let next = current === 'zh' ? 'en' : 'zh';
        setLang(next);
        location.reload();
    });

})();