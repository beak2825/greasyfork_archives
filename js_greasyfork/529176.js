// ==UserScript==
// @name         Douban User Blocker
// @namespace    http://tampermonkey.net/
// @version      2.13
// @description  Add a draggable blocklist management button on Douban.
// @author       AAA_aaa
// @match        *://*.douban.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529176/Douban%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/529176/Douban%20User%20Blocker.meta.js
// ==/UserScript==


(function checkForUpdate() {
    const currentVersion = '2.13';
    const scriptURL = 'https://update.greasyfork.org/scripts/529176/Douban%20User%20Blocker.user.js';

    fetch(scriptURL)
        .then(response => response.text())
        .then(text => {
        const latestVersion = text.match(/@version\s+(\d+\.\d+)/)[1];
        if (latestVersion > currentVersion) {
            alert(`A new version (${latestVersion}) is available! Please update.`);
            window.location.href = 'https://greasyfork.org/scripts/your-script-id.user.js'; // Redirect to update
        }
    })
        .catch(error => console.error('Update check failed:', error));
})();




(function () {
    'use strict';

    const BLOCKLIST_KEY = 'doubanBlocklist';
    let isDragging = false;

    function loadBlocklist() {
        const stored = localStorage.getItem(BLOCKLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function saveBlocklist(blocklist) {
        localStorage.setItem(BLOCKLIST_KEY, JSON.stringify(blocklist));
    }

    function addToBlocklist(userId) {
        const blocklist = loadBlocklist();
        if (!blocklist.includes(userId)) {
            blocklist.push(userId);
            saveBlocklist(blocklist);
        } else {
            alert(`User ${userId} is already in the blocklist.`);
        }
        removeBlockedElements();
        updateBlocklistMenu();
    }

    function removeFromBlocklist(userId) {
        let blocklist = loadBlocklist().filter(id => id !== userId);
        saveBlocklist(blocklist);
        updateBlocklistMenu();
    }

    function removeBlockedElements() {
        const blocklist = loadBlocklist();

        document.querySelectorAll('.comment-item, .lite-comments,.lite-comments-item, .review-item,.reply-item, .reply-ref,.new-status status-wrapper, .bd rec, topic-card large-card, .status-item, .ctsh, tr').forEach(element => {
            if (element.classList.contains('lite-comments-item' ||'comment-item'||'reply-item')) {
                // Get all <a> tags inside .lite-comments-item (including .lite-comments-item-author a)
                const links = element.querySelectorAll('a[href^="https://www.douban.com/people/"]');
                for (const link of links) {
                    const userId = link.href.split('/')[4].toLowerCase();
                    if (blocklist.some(item => item.toLowerCase() ===userId)) {
                        element.remove();
                        break; // Stop checking once removed
                    }
                }
            } else {
                // For other elements, only check the FIRST <a> tag
                const link = element.querySelector('a[href^="https://www.douban.com/people/"]');
                if (link) {
                    const userId = link.href.split('/')[4].toLowerCase();
                    if (blocklist.some(item => item.toLowerCase() ===userId)) {
                        element.remove();
                    }
                }
            }
        });
    }



    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.id = 'floating-button';
        btn.textContent = 'Manage Blocklist';
        btn.style.position = 'fixed';
        btn.style.right = '20px';
        btn.style.bottom = '20px';
        btn.style.background = '#28a745';
        btn.style.color = 'white';
        btn.style.padding = '10px 15px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'grab';
        btn.style.zIndex = '1000';
        btn.style.userSelect = 'none';
        document.body.appendChild(btn);

        let offsetX = 0, offsetY = 0;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            btn.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            btn.style.left = `${e.clientX - offsetX}px`;
            btn.style.top = `${e.clientY - offsetY}px`;
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            btn.style.cursor = 'grab';
        });

        btn.addEventListener('click', () => {
            if (!isDragging) {
                document.querySelector('.douban-block').style.display = 'block';
            }
        });
    }

    function createBlocklistMenu() {
        const menu = document.createElement('div');
        menu.className = 'douban-block';
        menu.style.display = 'none';
        menu.style.position = 'fixed';
        menu.style.right = '20px';
        menu.style.top = '60px';
        menu.style.width = '300px';
        menu.style.background = '#fff';
        menu.style.padding = '15px';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        menu.style.zIndex = '1001';
        menu.innerHTML = `
            <h3>Blocked Users</h3>
            <ul id="blocklist" style="max-height: 150px; overflow-y: auto;"></ul>
            <input type="text" id="user-url" placeholder="Enter Douban user URL">
            <button id="add-user">Add</button>
            <button id="close-menu">Close</button>
        `;
        document.body.appendChild(menu);

        document.getElementById('add-user').addEventListener('click', () => {
            const userUrl = document.getElementById('user-url').value;
            const match = userUrl.match(/https:\/\/www\.douban\.com\/people\/([^/]+)/);
            if (match && match[1]) {
                addToBlocklist(match[1]);
                console.log(match[1]);
            } else {
                alert('Invalid Douban user URL.');
            }
        });

        document.getElementById('close-menu').addEventListener('click', () => {
            menu.style.display = 'none';
        });

        updateBlocklistMenu();
    }

    function updateBlocklistMenu() {
        const blocklist = loadBlocklist();
        const listElement = document.getElementById('blocklist');
        listElement.innerHTML = '';
        blocklist.forEach(userId => {
            const li = document.createElement('li');
            li.textContent = userId;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'del';
            removeBtn.addEventListener('click', () => removeFromBlocklist(userId));
            li.appendChild(removeBtn);
            listElement.appendChild(li);
        });
    }

    function main() {
        createFloatingButton();
        createBlocklistMenu();
        removeBlockedElements();

        const observer = new MutationObserver(removeBlockedElements);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    main();
})();