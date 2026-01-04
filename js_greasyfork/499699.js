// ==UserScript==
// @name         Pixiv Blacklist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      LGPL
// @description  本地屏蔽pixiv用户评论
// @author       Ptilopsis
// @match        https://www.pixiv.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/499699/Pixiv%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/499699/Pixiv%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const path = window.location.pathname;

    // 检查是否在用户页面
    if (path.startsWith('/users/')) {
        const floatingButton = document.createElement('button');
        floatingButton.innerText = '加入黑名单';
        floatingButton.style.position = 'fixed';
        floatingButton.style.bottom = '35px';
        floatingButton.style.right = '90px';
        floatingButton.style.padding = '10px 20px';
        floatingButton.style.border = '1px solid';
        floatingButton.style.borderRadius = '4px';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.zIndex = 1000;

        // 根据浏览器主题调整颜色
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
            const uid = path.split('/').pop();
            addToBlacklist(uid);
        };
        document.body.appendChild(floatingButton);
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

    function blockComments() {
        let blacklist = GM_getValue('blacklist', []);
        const comments = document.querySelectorAll('li');
        comments.forEach(comment => {
            const userLink = comment.querySelector('a[data-user_id]');
            if (userLink) {
                const commentUid = userLink.getAttribute('data-user_id');
                if (blacklist.includes(commentUid)) {
                    comment.style.display = 'none';
                }
            }
        });
    }

    function observeMutations() {
        const observer = new MutationObserver(blockComments);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        blockComments();
        observeMutations();
    });

    setInterval(blockComments, 1000);

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

        // Adding dark and light mode styles
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

        const title = document.createElement('h3');
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
            link.href = `https://www.pixiv.net/users/${uid}`;
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

    GM_registerMenuCommand('管理黑名单', showBlacklist);

})();
