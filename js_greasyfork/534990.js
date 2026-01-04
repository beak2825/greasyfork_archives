// ==UserScript==
// @name         小红书黑名单
// @namespace    http://tampermonkey.net/
// @version      1.63
// @description  隐藏黑名单用户帖子和评论，支持屏蔽用户名含特定关键词的用户，适配搜索结果页
// @author       AI
// @license      MIT
// @match        https://www.xiaohongshu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534990/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/534990/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blacklist = GM_getValue('xhs_blacklist', []);
    let keywordList = GM_getValue('xhs_keyword_blacklist', []);

    function updateHiddenCSS() {
        const style = document.getElementById('xhs-hidden-style') || document.createElement('style');
        style.id = 'xhs-hidden-style';
        const rules = blacklist.map(entry => {
            const userId = entry.split(': ')[1];
            return `
                div.list-container div.comment-item-sub:has(a[href*="/user/profile/${userId}"], [data-user-id="${userId}"]),
                div[class*="comments"] div.comment-item-sub:has(a[href*="/user/profile/${userId}"], [data-user-id="${userId}"]),
                div[class*="comment"] div.comment-item-sub:has(a[href*="/user/profile/${userId}"], [data-user-id="${userId}"]) {
                    display: none !important;
                }
                section.note-item:not(:has(.list-container, [class*="comments"], [class*="comment"])):has(a.author[href*="/user/profile/${userId}"], .author-wrapper a[href*="/user/profile/${userId}"], .user-info a[href*="/user/profile/${userId}"]),
                div.note-item:not(:has(.list-container, [class*="comments"], [class*="comment"])):has(a.author[href*="/user/profile/${userId}"], .author-wrapper a[href*="/user/profile/${userId}"], .user-info a[href*="/user/profile/${userId}"]),
                article.note-item:not(:has(.list-container, [class*="comments"], [class*="comment"])):has(a.author[href*="/user/profile/${userId}"], .author-wrapper a[href*="/user/profile/${userId}"], .user-info a[href*="/user/profile/${userId}"]),
                div[class*="note-card"]:not(:has(.list-container, [class*="comments"], [class*="comment"])):has(a.author[href*="/user/profile/${userId}"], .author-wrapper a[href*="/user/profile/${userId}"], .user-info a[href*="/user/profile/${userId}"]),
                div[class*="search-result"]:not(:has(.list-container, [class*="comments"], [class*="comment"])):has(a.author[href*="/user/profile/${userId}"], .author-wrapper a[href*="/user/profile/${userId}"], .user-info a[href*="/user/profile/${userId}"]) {
                    display: none !important;
                }
            `;
        }).join('');
        style.textContent = `
            .xhs-hidden,
            div.comment-item-sub.xhs-hidden {
                display: none !important;
            }
            div.comment-item-sub:not(.xhs-processed),
            section.note-item:not(.xhs-processed),
            div.note-item:not(.xhs-processed),
            article.note-item:not(.xhs-processed),
            div[class*="note-card"]:not(.xhs-processed),
            div[class*="search-result"]:not(.xhs-processed) {
                visibility: hidden !important;
            }
            ${rules}
        `;
        document.head.appendChild(style);
    }

    function saveBlacklist() {
        GM_setValue('xhs_blacklist', blacklist);
        updateHiddenCSS();
    }

    function saveKeywordList() {
        GM_setValue('xhs_keyword_blacklist', keywordList);
    }

    function processElement(elem) {
        const isMainComment = elem.classList.contains('parent-comment') || elem.matches('div[class*="comment"]') && elem.closest('div.list-container, div[class*="comments"], div[class*="comment"], div[class*="reply-container"]');
        const isSubComment = elem.classList.contains('comment-item-sub') || elem.matches('div[class*="sub-comment"]') && elem.closest('div.list-container, div[class*="comments"], div[class*="comment"], div[class*="reply-container"]');
        const isPost = elem.matches('section.note-item, div.note-item, article.note-item, div[class*="note-card"], div[class*="search-result"]');

        if (!isMainComment && !isSubComment && !isPost) return;

        const targetElem = isSubComment ? elem : (isMainComment ? elem.querySelector('div.comment-item:not(.comment-item-sub)') || elem : elem);
        const authorSelector = isPost
            ? 'a.author, .author-wrapper a, .user-info a, .author-info a, .note-author a, a[class*="author"], a[class*="user"], a.name'
            : 'a[href*="/user/profile/"], a.author, .author-wrapper a, .user-info a, .author-info a, .note-author a, a[class*="author"], a[class*="user"], a.name, [data-user-id]';
        const authorLink = targetElem.querySelector(authorSelector);
        if (!authorLink) {
            elem.classList.add('xhs-processed');
            return;
        }

        const userId = authorLink.href?.match(/\/user\/profile\/([a-f0-9]+)/)?.[1] ||
                      authorLink.getAttribute('data-user-id') ||
                      authorLink.getAttribute('data-id') ||
                      targetElem.querySelector('[data-user-id]')?.getAttribute('data-user-id');
        const usernameElem = targetElem.querySelector('a.name, span.name, .author a, .author-wrapper a, .author-wrapper span, .user-info span, .author-info span, .note-author span, span[class*="name"], div[class*="name"], span[class*="user"], div[class*="user"], a[class*="name"]');
        let rawUsername = usernameElem ? usernameElem.textContent.trim() : '';
        if (!rawUsername && authorLink) {
            rawUsername = authorLink.textContent.trim() || authorLink.innerText.trim();
        }
        const username = rawUsername.replace(/[\u200B-\u200F\uFEFF\u3000\s]/g, '').normalize('NFKC').trim();
        if (!username) {
            elem.classList.add('xhs-processed');
            return;
        }

        const hideTarget = isSubComment ? elem : (isMainComment ? elem : targetElem);
        if (blacklist.some(entry => entry.split(': ')[1] === userId) ||
            keywordList.some(k => username.includes(k))) {
            hideTarget.classList.add('xhs-hidden');
        } else {
            hideTarget.classList.remove('xhs-hidden');
        }
        hideTarget.classList.add('xhs-processed');
    }

    function hideBlockedContent(targetElement = null) {
        if (targetElement) {
            processElement(targetElement);
            return;
        }

        const containers = document.querySelectorAll('div.feeds-container, div[class*="search"], div[class*="result"], div[class*="notes"], div[class*="feed"]');
        containers.forEach(container => {
            container.querySelectorAll('section.note-item, div.note-item, article.note-item, div[class*="note-card"], div[class*="search-result"]').forEach(processElement);
        });

        const commentContainer = document.querySelector('div.list-container, div[class*="comments"], div[class*="comment"], div[class*="reply-container"]');
        if (commentContainer) {
            commentContainer.querySelectorAll('div.parent-comment, div.comment-item-sub').forEach(processElement);
        }
    }

    function debounce(fn, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), wait);
        };
    }

    function createContextMenu() {
        const menu = document.createElement('div');
        menu.id = 'xhs-block-menu';
        menu.style.cssText = 'position:fixed;background:white;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:999999999;padding:0;display:none;min-width:120px;color:black';

        const blockUserItem = document.createElement('div');
        blockUserItem.textContent = '屏蔽该用户';
        blockUserItem.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:14px;background-color:#f8f8f8;color:#333;';
        blockUserItem.addEventListener('mouseover', () => blockUserItem.style.backgroundColor = '#ffcccc');
        blockUserItem.addEventListener('mouseout', () => blockUserItem.style.backgroundColor = '#f8f8f8');
        blockUserItem.addEventListener('click', () => {
            const { userId, username } = menu.dataset;
            if (userId && !blacklist.some(entry => entry.split(': ')[1] === userId)) {
                blacklist.push(`${username}: ${userId}`);
                saveBlacklist();
                hideBlockedContent();
            }
            menu.style.display = 'none';
        });

        const blockKeywordItem = document.createElement('div');
        blockKeywordItem.textContent = '添加屏蔽关键词';
        blockKeywordItem.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:14px;background-color:#f0f0f0;color:#333;';
        blockKeywordItem.addEventListener('mouseover', () => blockKeywordItem.style.backgroundColor = '#ffcccc');
        blockKeywordItem.addEventListener('mouseout', () => blockKeywordItem.style.backgroundColor = '#f0f0f0');
        blockKeywordItem.addEventListener('click', () => {
            menu.style.display = 'none';
            const keyword = prompt('请输入要屏蔽的关键词：', '').trim();
            if (keyword && !keywordList.includes(keyword)) {
                keywordList.push(keyword);
                saveKeywordList();
                hideBlockedContent();
            }
        });

        menu.appendChild(blockUserItem);
        menu.appendChild(blockKeywordItem);
        document.body.appendChild(menu);
        document.addEventListener('click', () => menu.style.display = 'none', { capture: true });
        document.addEventListener('scroll', debounce(() => menu.style.display = 'none', 100), { passive: true });
    }

    function setupContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            const targetElement = e.target.closest('section.note-item, div.note-item, article.note-item, div[class*="note-card"], div[class*="search-result"], div.list-container div.parent-comment, div[class*="comments"] div.parent-comment, div[class*="comment"] div.parent-comment, div.list-container div.comment-item-sub, div[class*="comments"] div.comment-item-sub, div[class*="comment"] div.comment-item-sub');
            if (!targetElement) return;

            e.preventDefault();
            const menu = document.getElementById('xhs-block-menu');
            if (!menu) return;

            const authorLink = targetElement.querySelector('a.author, a[href*="/user/profile/"], .author-wrapper a, .user-info a, .author-info a, .note-author a, a[class*="author"], a[class*="user"], a.name, [data-user-id]');
            if (!authorLink) return;

            const userId = authorLink.href?.match(/\/user\/profile\/([a-f0-9]+)/)?.[1] ||
                          authorLink.getAttribute('data-user-id') ||
                          authorLink.getAttribute('data-id') ||
                          targetElement.querySelector('[data-user-id]')?.getAttribute('data-user-id');
            const rawUsername = targetElement.querySelector('span.name, .author-wrapper span, .user-info span, .author-info span, .note-author span, span[class*="name"], div[class*="name"], span[class*="user"], div[class*="user"], a.name')?.textContent.trim() || '';
            const username = rawUsername.replace(/[\u200B-\u200F\uFEFF\u3000\s]/g, '').normalize('NFKC').trim();
            if (!userId || !username) return;

            menu.dataset.userId = userId;
            menu.dataset.username = username;

            menu.style.display = 'block';
            const menuRect = menu.getBoundingClientRect();
            let left = e.clientX + 5;
            let top = e.clientY + 5;

            if (left + menuRect.width > window.innerWidth) left = e.clientX - menuRect.width - 5;
            if (top + menuRect.height > window.innerHeight) top = e.clientY - menuRect.height - 5;
            if (top < 0) top = 5;
            if (left < 0) left = 5;

            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
        }, { capture: true, passive: false });
    }

    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('section.note-item, div.note-item, article.note-item, div[class*="note-card"], div[class*="search-result"], div.parent-comment, div.comment-item-sub')) {
                                processElement(node);
                            } else if (node.querySelector) {
                                node.querySelectorAll('section.note-item, div.note-item, article.note-item, div[class*="note-card"], div[class*="search-result"], div.parent-comment, div.comment-item-sub').forEach(processElement);
                            }
                        }
                    }
                }
            }
        });

        const containers = document.querySelectorAll('div.feeds-container, div[class*="search"], div[class*="result"], div[class*="notes"], div[class*="feed"], div.list-container, div[class*="comments"], div[class*="comment"], div[class*="reply-container"], div');
        containers.forEach(container => observer.observe(container, { childList: true, subtree: true }));

        if (!containers.length) {
            setTimeout(observeDOM, 500);
        }
    }

    function init() {
        keywordList = GM_getValue('xhs_keyword_blacklist', []);
        updateHiddenCSS();
        createContextMenu();
        setupContextMenu();
        hideBlockedContent();
        observeDOM();
        setInterval(() => hideBlockedContent(), 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();