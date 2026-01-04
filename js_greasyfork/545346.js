// ==UserScript==
// @name         Comick Mention Notifier
// @namespace    https://github.com/GooglyBlox
// @version      1.2
// @description  Shows notifications when someone mentions you in Comick comments
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      auth.comick.dev
// @connect      api.comick.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545346/Comick%20Mention%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/545346/Comick%20Mention%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userData = null;
    let mentionCache = new Set(GM_getValue('mentionCache', []));
    let readMentions = new Set(GM_getValue('readMentions', []));
    let lastChecked = GM_getValue('lastChecked', 0);
    let isInitialized = GM_getValue('isInitialized', false);
    let currentMentions = [];
    let currentPage = 1;
    let totalPages = 1;

    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    async function extractUserIdFromHeader() {
        const myListLink = await waitForElement('a[href*="/user/"][href*="/list"]');
        if (myListLink) {
            const match = myListLink.href.match(/\/user\/([^\/]+)\/list/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    async function fetchUsername(userId) {
        try {
            const response = await makeRequest('https://auth.comick.dev/sessions/whoami');
            const username = response?.identity?.traits?.username;
            if (username) {
                return username;
            }
        } catch (error) {
            // Silent error handling
        }
        return null;
    }

    async function initializeUserData() {
        const userId = await extractUserIdFromHeader();
        if (!userId) return null;

        const username = await fetchUsername(userId);
        if (!username) return null;

        return { id: userId, username: username };
    }

    function makeRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function fetchUserComments(userId, page = 1) {
        try {
            const response = await makeRequest(`https://api.comick.dev/user/${userId}/comments?page=${page}`);
            return response || [];
        } catch (error) {
            return [];
        }
    }

    function buildCommentUrl(comment, commentId) {
        const comic = comment.md_chapters?.md_comics;
        const chapter = comment.md_chapters;

        if (!comic?.slug || !chapter?.hid || !chapter?.chap || !chapter?.lang) {
            return null;
        }

        return `https://comick.dev/comic/${comic.slug}/${chapter.hid}-chapter-${chapter.chap}-${chapter.lang}#comment-${commentId}`;
    }

    function removeMentionFromContent(content, username) {
        if (!content || !username) return content;

        const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const mentionPattern = new RegExp(`@${escapedUsername}\\b`, 'gi');

        return content.replace(mentionPattern, '').replace(/^\s+/, '').trim();
    }

    function findMentions(comments, username) {
        const mentions = [];
        const mentionPattern = new RegExp(`@${username}\\b`, 'i');

        comments.forEach((comment) => {
            if (comment.other_comments && comment.other_comments.length > 0) {
                const repliesWithMentions = comment.other_comments.filter(reply => {
                    const replyUsername = reply.identities?.traits?.username;
                    return replyUsername !== username &&
                           reply.parsed &&
                           mentionPattern.test(reply.parsed);
                });

                if (repliesWithMentions.length > 0) {
                    mentions.push({
                        id: `mention-${comment.id}`,
                        originalComment: {
                            id: comment.id,
                            content: comment.parsed,
                            createdAt: comment.created_at,
                            url: buildCommentUrl(comment, comment.id)
                        },
                        replies: repliesWithMentions.map(reply => ({
                            id: reply.id,
                            content: removeMentionFromContent(reply.parsed, username),
                            author: reply.identities?.traits?.username,
                            createdAt: reply.created_at,
                            url: buildCommentUrl(comment, reply.id)
                        })),
                        chapterTitle: comment.md_chapters?.md_comics?.title || 'Unknown',
                        chapterNumber: comment.md_chapters?.chap || 'Unknown',
                        chapterUrl: buildCommentUrl(comment, comment.id)?.split('#')[0]
                    });
                }
            }
        });

        return mentions;
    }

    async function performFirstTimeInitialization() {
        if (!userData || isInitialized) {
            return;
        }

        const allMentions = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages && page <= 50) {
            const comments = await fetchUserComments(userData.id, page);

            if (comments.length === 0) {
                hasMorePages = false;
                break;
            }

            const mentions = findMentions(comments, userData.username);
            allMentions.push(...mentions);

            page++;

            if (page > 50) {
                break;
            }
        }

        allMentions.forEach(mention => {
            mentionCache.add(mention.id);
            readMentions.add(mention.id);

            mention.replies.forEach(reply => {
                readMentions.add(`reply-${reply.id}`);
            });
        });

        isInitialized = true;
        lastChecked = Date.now();

        GM_setValue('isInitialized', true);
        GM_setValue('lastChecked', lastChecked);
        GM_setValue('mentionCache', Array.from(mentionCache));
        GM_setValue('readMentions', Array.from(readMentions));
    }

    async function checkForMentions() {
        if (!userData) {
            return [];
        }

        const allMentions = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages && page <= 10) {
            const comments = await fetchUserComments(userData.id, page);

            if (comments.length === 0) {
                hasMorePages = false;
                break;
            }

            const mentions = findMentions(comments, userData.username);
            allMentions.push(...mentions);

            const oldestComment = comments[comments.length - 1];
            if (oldestComment && new Date(oldestComment.created_at).getTime() < lastChecked) {
                hasMorePages = false;
            }

            page++;
        }

        const newMentions = allMentions.filter(mention =>
            !mentionCache.has(mention.id) ||
            new Date(mention.originalComment.createdAt).getTime() > lastChecked
        );

        newMentions.forEach(mention => mentionCache.add(mention.id));

        return allMentions;
    }

    function createNotificationIcon() {
        const icon = document.createElement('div');
        icon.className = 'relative cursor-pointer';
        icon.innerHTML = `
            <div class="rounded-full h-8 w-8 flex-none flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-600 dark:text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </div>
            <div id="mention-badge" class="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hidden z-10" style="font-size: 10px; line-height: 1; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); bottom: -5px; right: -2px;">
                <span id="mention-count">0</span>
            </div>
        `;
        return icon;
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'mention-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center hidden backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Mentions</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments mentioning you across ComicK</p>
                    </div>
                    <button id="close-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div id="mentions-list" class="overflow-y-auto" style="max-height: calc(85vh - 180px);">
                    <div class="flex items-center justify-center p-8">
                        <div class="text-gray-500 dark:text-gray-400">Loading mentions...</div>
                    </div>
                </div>

                <div id="modal-pagination" class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hidden">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        Page <span id="current-page">1</span> of <span id="total-pages">1</span>
                    </div>
                    <div class="flex space-x-2">
                        <button id="prev-page" class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        <button id="next-page" class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    function renderMentionItem(mention) {
        const isRead = readMentions.has(mention.id);
        const unreadReplies = mention.replies.filter(reply => !readMentions.has(`reply-${reply.id}`));
        const allRepliesRead = mention.replies.every(reply => readMentions.has(`reply-${reply.id}`));
        const showMentionButton = !isRead || !allRepliesRead;

        return `
            <div class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div class="p-6 bg-white dark:bg-gray-900">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <h3 class="font-medium text-gray-900 dark:text-gray-100">${mention.chapterTitle}</h3>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Chapter ${mention.chapterNumber}</span>
                            ${unreadReplies.length > 0 ? `<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">${unreadReplies.length} new</span>` : ''}
                        </div>
                        ${showMentionButton ? `
                            <button class="mark-mention-read text-xs px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" data-mention-id="${mention.id}">
                                Mark as Read
                            </button>
                        ` : ''}
                    </div>
                    <div class="space-y-4">
                        <div class="flex space-x-3">
                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span class="text-white text-sm font-medium">You</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center space-x-2 mb-1">
                                    <span class="font-medium text-gray-900 dark:text-gray-100">${userData?.username || 'You'}</span>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">${new Date(mention.originalComment.createdAt).toLocaleString()}</span>
                                    ${mention.originalComment.url ? `<a href="${mention.originalComment.url}" target="_blank" class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline">View</a>` : ''}
                                </div>
                                <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">${mention.originalComment.content.trim()}</div>
                            </div>
                        </div>
                        <div class="pl-11 space-y-4">
                            ${mention.replies.map(reply => {
                                const replyIsRead = readMentions.has(`reply-${reply.id}`);
                                return `
                                    <div class="flex space-x-3">
                                        <div class="w-8 h-8 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span class="text-white text-sm font-medium">${reply.author.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center space-x-2 mb-1">
                                                <span class="font-medium text-gray-900 dark:text-gray-100">${reply.author}</span>
                                                <span class="text-sm text-gray-500 dark:text-gray-400">${new Date(reply.createdAt).toLocaleString()}</span>
                                                ${!replyIsRead ? '<span class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>' : ''}
                                                ${reply.url ? `<a href="${reply.url}" target="_blank" class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline">View</a>` : ''}
                                                ${!replyIsRead ? `
                                                    <button class="mark-reply-read text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" data-reply-id="${reply.id}">
                                                        Mark Read
                                                    </button>
                                                ` : ''}
                                            </div>
                                            <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">${reply.content.trim()}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateMentionDisplay(mentions) {
        const badge = document.getElementById('mention-badge');
        const count = document.getElementById('mention-count');

        if (!badge || !count) return;

        currentMentions = mentions;

        const unreadCount = mentions.reduce((total, mention) => {
            const unreadReplies = mention.replies.filter(reply => !readMentions.has(`reply-${reply.id}`));
            return total + unreadReplies.length;
        }, 0);

        if (unreadCount > 0) {
            badge.classList.remove('hidden');
            count.textContent = unreadCount > 99 ? '99+' : unreadCount;
        } else {
            badge.classList.add('hidden');
        }
    }

    function renderMentions(mentions, page = 1) {
        const list = document.getElementById('mentions-list');
        const pagination = document.getElementById('modal-pagination');

        if (!list) return;

        const itemsPerPage = 5;
        totalPages = Math.max(1, Math.ceil(mentions.length / itemsPerPage));
        currentPage = Math.min(page, totalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = mentions.slice(startIndex, endIndex);

        if (pageItems.length > 0) {
            list.innerHTML = pageItems.map(renderMentionItem).join('');
            setupItemEvents();

            if (totalPages > 1) {
                pagination.classList.remove('hidden');
                document.getElementById('current-page').textContent = currentPage;
                document.getElementById('total-pages').textContent = totalPages;
                document.getElementById('prev-page').disabled = currentPage === 1;
                document.getElementById('next-page').disabled = currentPage === totalPages;
            } else {
                pagination.classList.add('hidden');
            }
        } else {
            list.innerHTML = '<div class="flex items-center justify-center p-8"><div class="text-gray-500 dark:text-gray-400">No mentions found</div></div>';
            pagination.classList.add('hidden');
        }
    }

    function setupItemEvents() {
        document.querySelectorAll('.mark-mention-read').forEach(button => {
            button.addEventListener('click', function() {
                const mentionId = this.getAttribute('data-mention-id');
                markMentionAsRead(mentionId);
            });
        });

        document.querySelectorAll('.mark-reply-read').forEach(button => {
            button.addEventListener('click', function() {
                const replyId = this.getAttribute('data-reply-id');
                markReplyAsRead(replyId);
            });
        });
    }

    function setupModalEvents() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        if (prevButton) {
            prevButton.replaceWith(prevButton.cloneNode(true));
            document.getElementById('prev-page').addEventListener('click', () => {
                if (currentPage > 1) {
                    renderMentions(currentMentions, currentPage - 1);
                }
            });
        }

        if (nextButton) {
            nextButton.replaceWith(nextButton.cloneNode(true));
            document.getElementById('next-page').addEventListener('click', () => {
                if (currentPage < totalPages) {
                    renderMentions(currentMentions, currentPage + 1);
                }
            });
        }
    }

    function markMentionAsRead(mentionId) {
        readMentions.add(mentionId);

        const mention = currentMentions.find(m => m.id === mentionId);
        if (mention) {
            mention.replies.forEach(reply => {
                readMentions.add(`reply-${reply.id}`);
            });
        }

        GM_setValue('readMentions', Array.from(readMentions));
        renderMentions(currentMentions, currentPage);
        updateBadgeCount();
    }

    function markReplyAsRead(replyId) {
        readMentions.add(`reply-${replyId}`);
        GM_setValue('readMentions', Array.from(readMentions));
        renderMentions(currentMentions, currentPage);
        updateBadgeCount();
    }

    function updateBadgeCount() {
        const badge = document.getElementById('mention-badge');
        const count = document.getElementById('mention-count');

        if (!badge || !count) return;

        const unreadCount = currentMentions.reduce((total, mention) => {
            const unreadReplies = mention.replies.filter(reply => !readMentions.has(`reply-${reply.id}`));
            return total + unreadReplies.length;
        }, 0);

        if (unreadCount > 0) {
            badge.classList.remove('hidden');
            count.textContent = unreadCount > 99 ? '99+' : unreadCount;
        } else {
            badge.classList.add('hidden');
        }
    }

    async function showModal() {
        const modal = document.getElementById('mention-modal');
        if (!modal) return;

        modal.classList.remove('hidden');

        const list = document.getElementById('mentions-list');
        if (list) {
            list.innerHTML = '<div class="flex items-center justify-center p-8"><div class="text-gray-500 dark:text-gray-400">Loading mentions...</div></div>';
        }

        if (!userData) {
            userData = await initializeUserData();
        }

        if (userData) {
            const mentions = await checkForMentions();
            currentMentions = mentions;
            renderMentions(mentions);
            setupModalEvents();
        } else {
            if (list) {
                list.innerHTML = '<div class="flex items-center justify-center p-8"><div class="text-red-500 dark:text-red-400">Unable to load user data</div></div>';
            }
        }
    }

    async function insertNotificationIcon() {
        const container = await waitForElement('.flex.items-center.justify-between.space-x-2.md\\:space-x-3');
        if (!container || document.getElementById('mention-notifier')) return;

        const icon = createNotificationIcon();
        icon.id = 'mention-notifier';

        const genderIconContainer = container.querySelector('.items-center.flex.justify-center.w-8.h-8');
        if (genderIconContainer) {
            container.insertBefore(icon, genderIconContainer);
        } else {
            container.insertBefore(icon, container.firstElementChild);
        }

        let modal = document.getElementById('mention-modal');
        if (!modal) {
            modal = createModal();
            document.body.appendChild(modal);
        }

        icon.addEventListener('click', showModal);

        const closeButton = document.getElementById('close-modal');
        if (closeButton) {
            closeButton.replaceWith(closeButton.cloneNode(true));
            document.getElementById('close-modal').addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    async function initializeMentionChecker() {
        userData = await initializeUserData();
        if (!userData) {
            setTimeout(initializeMentionChecker, 5000);
            return;
        }

        if (!isInitialized) {
            await performFirstTimeInitialization();
        }

        const mentions = await checkForMentions();
        await insertNotificationIcon();
        updateMentionDisplay(mentions);

        lastChecked = Date.now();
        GM_setValue('lastChecked', lastChecked);
        GM_setValue('mentionCache', Array.from(mentionCache));
    }

    function startPeriodicCheck() {
        initializeMentionChecker();
        setInterval(async () => {
            if (userData) {
                const mentions = await checkForMentions();
                updateMentionDisplay(mentions);
                lastChecked = Date.now();
                GM_setValue('lastChecked', lastChecked);
                GM_setValue('mentionCache', Array.from(mentionCache));
            }
        }, 300000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPeriodicCheck);
    } else {
        startPeriodicCheck();
    }

    const observer = new MutationObserver(() => {
        if (!document.getElementById('mention-notifier') && userData) {
            insertNotificationIcon();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();