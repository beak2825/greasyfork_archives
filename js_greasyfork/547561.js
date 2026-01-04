// ==UserScript==
// @name         Claude AI Hotkeys
// @namespace    https://blog.valley.town/@zeronox
// @version      1.1
// @description  Alt+S: 사이드바, Ctrl+Shift+Z: 새 채팅, Alt+T: 스레드 검색 (방향키 지원)
// @author       zeronox
// @license      MIT
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547561/Claude%20AI%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/547561/Claude%20AI%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #thread-search-popup {
            position: fixed; top: 40%; left: 50%;
            transform: translate(-50%, -50%);
            width: 600px; max-width: 90%;
            background-color: rgba(30, 30, 35, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: none; flex-direction: column;
            padding: 12px;
        }
        #thread-search-popup.visible { display: flex; }
        #thread-search-input {
            width: 100%; background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #f0f0f0; padding: 12px 16px;
            border-radius: 8px; font-size: 16px;
            margin-bottom: 10px; outline: none;
        }
        #thread-search-input:focus { border-color: #FFEAA7; }
        #thread-search-results { max-height: 400px; overflow-y: auto; }
        .thread-item {
            display: block; padding: 10px 12px;
            color: #d1d1d1; text-decoration: none;
            border-radius: 6px; margin-bottom: 2px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            cursor: pointer;
        }
        /* 포커스된 아이템을 위한 새로운 스타일 */
        .thread-item:hover, .thread-item.focused {
            background-color: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            outline: none;
        }
    `);

    let chatData = [];
    let focusedIndex = -1;

    function createSearchPopup() {
        if (document.getElementById('thread-search-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'thread-search-popup';
        popup.innerHTML = `
            <input id="thread-search-input" type="text" placeholder="스레드 검색...">
            <div id="thread-search-results"></div>
        `;
        document.body.appendChild(popup);

        const input = document.getElementById('thread-search-input');
        input.addEventListener('input', () => {
            focusedIndex = -1;
            renderResults(input.value);
        });

        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && popup.classList.contains('visible')) {
                togglePopup(false);
            }
        });
    }

    function fetchChatData() {
        chatData = Array.from(document.querySelectorAll('nav a[href^="/chat/"]'))
            .map(link => {
                const titleSpan = link.querySelector('span.truncate');
                return titleSpan ? { title: titleSpan.textContent.trim(), href: link.href } : null;
            })
            .filter(item => item && item.title !== "제목 없음");
    }

    function renderResults(searchTerm = '') {
        const resultsContainer = document.getElementById('thread-search-results');
        resultsContainer.innerHTML = '';

        const filteredData = searchTerm
            ? chatData.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
            : chatData;

        if (filteredData.length > 0) {
            filteredData.forEach(chat => {
                const item = document.createElement('a');
                item.href = chat.href;
                item.className = 'thread-item';
                item.textContent = chat.title;
                item.onclick = () => togglePopup(false);
                resultsContainer.appendChild(item);
            });
        } else {
            resultsContainer.innerHTML = '<div style="color: #888; padding: 10px;">검색 결과가 없습니다.</div>';
        }
    }

    function updateFocus() {
        const items = document.querySelectorAll('.thread-item');
        items.forEach((item, index) => {
            if (index === focusedIndex) {
                item.classList.add('focused');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('focused');
            }
        });
    }

    function togglePopup(forceState) {
        const popup = document.getElementById('thread-search-popup');
        const isVisible = popup.classList.contains('visible');
        const shouldBeVisible = forceState !== undefined ? forceState : !isVisible;

        if (shouldBeVisible) {
            fetchChatData();
            renderResults();
            popup.classList.add('visible');
            const input = document.getElementById('thread-search-input');
            input.value = '';
            input.focus();
            focusedIndex = -1;
        } else {
            popup.classList.remove('visible');
        }
    }

    createSearchPopup();

    document.addEventListener('keydown', function(event) {
        const popup = document.getElementById('thread-search-popup');
        const isPopupVisible = popup && popup.classList.contains('visible');
        if (isPopupVisible) {
            const items = document.querySelectorAll('.thread-item');

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (items.length > 0) {
                        focusedIndex = (focusedIndex + 1) % items.length;
                        updateFocus();
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (items.length > 0) {
                        focusedIndex = (focusedIndex - 1 + items.length) % items.length;
                        updateFocus();
                    }
                    break;
                case 'Enter':
                    if (focusedIndex >= 0 && items[focusedIndex]) {
                        event.preventDefault();
                        items[focusedIndex].click();
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    togglePopup(false);
                    break;
            }
            return;
        }
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            document.querySelector('button[data-testid="pin-sidebar-toggle"]')?.click();
        }
        else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            document.querySelector('a[href="/new"]')?.click();
        }
        else if (event.altKey && !event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 't') {
            event.preventDefault();
            togglePopup();
        }
    });
})();