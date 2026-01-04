// ==UserScript==
// @name         YouTube Blacklist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      LGPL
// @description  在YouTube用户界面添加按钮，本地屏蔽用户的评论区发言。
// @author       Ptilopsis
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/499754/YouTube%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/499754/YouTube%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(init, 1000);
    });

    function init() {
        if (isChannelPage()) {
            const uid = extractUidFromUrl();
            if (uid && !document.querySelector('.floating-button')) {
                const floatingButton = createButton(uid);
                document.body.appendChild(floatingButton);
            }
        }

        // 监听评论区的变化
        observeComments();

        GM_registerMenuCommand('管理黑名单', showBlacklist);
    }

    function isChannelPage() {
        const path = window.location.pathname;
        return /^\/@[\w-]+\/?$/.test(path);
    }

    function extractUidFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/^\/@([\w-]+)\/?$/);
        return match ? match[1] : null;
    }

    function createButton(uid) {
        const floatingButton = document.createElement('button');
        floatingButton.innerText = '加入黑名单';
        floatingButton.style.position = 'fixed';
        floatingButton.style.bottom = '20px';
        floatingButton.style.right = '20px';
        floatingButton.style.padding = '10px 20px';
        floatingButton.style.border = '1px solid';
        floatingButton.style.borderRadius = '4px';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.zIndex = 1000;

        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-color-scheme: dark) {
                .floating-button {
                    background-color: rgba(34, 34, 34, 0.95);
                    color: white;
                    border-color: white;
                }
            }
            @media (prefers-color-scheme: light) {
                .floating-button {
                    background-color: rgba(255, 255, 255, 0.95);
                    color: black;
                    border-color: black;
                }
            }
        `;
        document.head.appendChild(style);
        floatingButton.classList.add('floating-button');

        floatingButton.onclick = () => {
            addToBlacklist(uid);
        };

        return floatingButton;
    }

    function addToBlacklist(uid) {
        let blacklist = GM_getValue('blacklist', []);
        if (!blacklist.includes(uid)) {
            blacklist.push(uid);
            GM_setValue('blacklist', blacklist);
            alert(`用户 ${uid} 已加入黑名单`);
        } else {
            alert(`用户 ${uid} 已在黑名单中`);
        }
    }

    function observeComments() {
        const target = document.querySelector('ytd-comments');

        if (target) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.tagName === 'YTD-COMMENT-THREAD-RENDERER') {
                                blockComment(node);
                                observeReplies(node);
                            }
                        });
                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });
        }
    }

    function observeReplies(commentThread) {
        const replies = commentThread.querySelector('ytd-comment-replies-renderer');

        if (replies) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.classList && node.classList.contains('style-scope') && node.classList.contains('ytd-comment-view-model')) {
                                blockComment(node);
                            }
                        });
                    }
                });
            });

            observer.observe(replies, { childList: true, subtree: true });
        }
    }

    function blockComment(comment) {
        let blacklist = GM_getValue('blacklist', []);
        const authorLink = findAuthorLink(comment);
        if (authorLink) {
            const commentUid = new URL(authorLink.href).pathname.split('/').pop().replace('@', '');
            if (blacklist.includes(commentUid)) {
                comment.style.display = 'none';
            }
        }
    }

    function findAuthorLink(element) {
        if (element.tagName === 'A' && element.href.includes('/@')) {
            return element;
        }
        for (let child of element.children) {
            const found = findAuthorLink(child);
            if (found) {
                return found;
            }
        }
        return null;
    }

    function showBlacklist() {
        let blacklist = GM_getValue('blacklist', []);
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.border = '1px solid black';
        panel.style.padding = '20px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.zIndex = 10000;
        panel.style.maxWidth = '400px';
        panel.style.width = '80%';
        panel.style.borderRadius = '8px';

        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-color-scheme: dark) {
                .blacklist-panel {
                    background-color: rgba(34, 34, 34, 0.95);
                    color: white;
                }
                .blacklist-panel button {
                    color: white;
                    background-color: #444;
                }
            }
            @media (prefers-color-scheme: light) {
                .blacklist-panel {
                    background-color: rgba(255, 255, 255, 0.95);
                    color: black;
                }
                .blacklist-panel button {
                    color: black;
                    background-color: #ddd;
                }
            }
        `;
        document.head.appendChild(style);
        panel.classList.add('blacklist-panel');

        const title = document.createElement('h2');
        title.innerText = '黑名单';
        title.style.textAlign = 'center';
        title.style.marginBottom = '15px';
        panel.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.innerText = '❌';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            document.body.removeChild(panel);
        };
        panel.appendChild(closeButton);

        const list = document.createElement('ul');
        list.style.maxHeight = '200px';
        list.style.overflowY = 'auto';
        blacklist.forEach(uid => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.innerText = uid;
            link.href = `https://www.youtube.com/@${uid}`;
            link.target = '_blank';
            link.style.color = 'inherit';
            item.appendChild(link);
            item.style.marginBottom = '10px';

            const removeButton = document.createElement('button');
            removeButton.innerText = '移除';
            removeButton.style.marginLeft = '10px';
            removeButton.style.border = '1px solid';
            removeButton.style.borderRadius = '4px';
            removeButton.style.cursor = 'pointer';
            removeButton.onclick = () => {
                removeFromBlacklist(uid);
                panel.remove();
                showBlacklist();
            };
            item.appendChild(removeButton);
            list.appendChild(item);
        });
        panel.appendChild(list);

        document.body.appendChild(panel);
    }

    function removeFromBlacklist(uid) {
        let blacklist = GM_getValue('blacklist', []);
        blacklist = blacklist.filter(item => item !== uid);
        GM_setValue('blacklist', blacklist);
        alert(`用户 ${uid} 已从黑名单中移除`);
    }
})();
