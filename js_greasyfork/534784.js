// ==UserScript==
// @name         Hiển thị thông tin tài khoản VOZ
// @namespace    43vn
// @version      0.5
// @description  Hiển  thị Joined, Last Seen, và Reaction Score cho tải khoản voz khi xem bài viết mà không cần rê vào tên tài khoản
// @author       43vn
// @match        https://voz.vn/t/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534784/Hi%E1%BB%83n%20th%E1%BB%8B%20th%C3%B4ng%20tin%20t%C3%A0i%20kho%E1%BA%A3n%20VOZ.user.js
// @updateURL https://update.greasyfork.org/scripts/534784/Hi%E1%BB%83n%20th%E1%BB%8B%20th%C3%B4ng%20tin%20t%C3%A0i%20kho%E1%BA%A3n%20VOZ.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const userData = new Map();
    const processedUsers = new Set();

    const debounce = (fn, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    function parseUserInfo(jsonData) {
        try {
            const html = typeof jsonData === 'string' ? JSON.parse(jsonData).html.content : jsonData.html.content;
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const findText = (sel, label) =>
                Array.from(doc.querySelectorAll(sel)).find(dt => dt.textContent.includes(label))?.nextElementSibling;

            return {
                Joined: findText('dl.pairs--inline dt', 'Joined')?.querySelector('time')?.textContent.trim() || 'N/A',
                LastSeen: findText('dl.pairs--inline dt', 'Last seen')?.querySelector('time')?.textContent.trim() || 'N/A',
                ReactionScore: findText('dl.pairs--rows dt', 'Reaction score')?.textContent.trim() || 'N/A',
            };
        } catch (e) {
            console.error('Parse error:', e);
            return null;
        }
    }

    function insertUserInfo() {
        document.querySelectorAll('.message-userDetails:not([data-inserted])').forEach(container => {
            const usernameEl = container.querySelector('a.username');
            const href = usernameEl?.href;
            if (!href || !userData.has(href)) return;

            const info = userData.get(href);
            const div = document.createElement('div');
            div.className = 'userTitle message-userTitle';
            div.innerHTML = Object.entries(info).map(([k, v]) => `<p>${k}: ${v}</p>`).join('');
            container.appendChild(div);
            container.setAttribute('data-inserted', 'true');
        });
    }

    function extractUserInfo() {
        document.querySelectorAll('.message-name > a.username:not([data-processed])').forEach(usernameEl => {
            const href = usernameEl.href;
            if (!href || processedUsers.has(href)) return;

            processedUsers.add(href);
            usernameEl.setAttribute('data-processed', 'true');

            if (userData.has(href)) {
                insertUserInfo();
                return;
            }

            fetch(`${href}?tooltip=true&_xfResponseType=json&_xfWithData=1`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    const info = parseUserInfo(data);
                    if (info) {
                        userData.set(href, info);
                        insertUserInfo();
                    }
                })
                .catch(err => console.error('Fetch error:', err));
        });
    }

    const debouncedExtract = debounce(extractUserInfo, 300);

    new MutationObserver(mutations => {
        if (mutations.some(m =>
            [...m.addedNodes].some(n =>
                n.nodeType === Node.ELEMENT_NODE && (n.matches?.('a.username') || n.querySelector?.('a.username'))
            )
        )) {
            debouncedExtract();
        }
        insertUserInfo();
    }).observe(document.body, { childList: true, subtree: true });

    debouncedExtract();
})();
