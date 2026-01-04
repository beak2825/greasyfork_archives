// ==UserScript==
// @name         Shikimori: Показ сырого текста комментария
// @namespace    http://shikimori.me/
// @version      1.2
// @description  Добавляет кнопку для отображения сырого комментария.
// @author       pirate~
// @match        *://shikimori.tld/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527456/Shikimori%3A%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%20%D1%81%D1%8B%D1%80%D0%BE%D0%B3%D0%BE%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/527456/Shikimori%3A%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%20%D1%81%D1%8B%D1%80%D0%BE%D0%B3%D0%BE%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addRawButton(comment) {
        const aside = comment.querySelector('aside.buttons .main-controls');
        if (!aside) return;
        const btn = document.createElement('button');
        btn.textContent = '¶';
        btn.style.marginLeft = '10px';
        btn.style.cursor = 'pointer';
        btn.style.color = 'var(--headline-color)';
        btn.addEventListener('click', () => {
            toggleRawText(comment, btn);
        });
        aside.appendChild(btn);
    }
    async function toggleRawText(comment, btn) {
        let rawDiv = comment.querySelector('div[data-raw]');
        if (rawDiv) {
            rawDiv.remove();
            btn.textContent = '¶';
            return;
        }
        const commentId = comment.getAttribute('id');
        if (!commentId) return;
        const apiUrl = `https://shikimori.one/api/comments/${commentId}`;
        try {
            const response = await fetch(apiUrl, { credentials: 'include' });
            if (!response.ok) {
                console.error('ошибка загрузки:', response.status);
                return;
            }
            const data = await response.json();
            const rawText = data.body;
            rawDiv = document.createElement('div');
            rawDiv.setAttribute('data-raw', 'true');
            rawDiv.style.background = '#f0f0f0';
            rawDiv.style.padding = '10px';
            rawDiv.style.clear = 'both';
            rawDiv.style.whiteSpace = 'pre-wrap';
            rawDiv.textContent = rawText;
            const inner = comment.querySelector('.inner');
            if (inner) {
                inner.appendChild(rawDiv);
            } else {
                comment.appendChild(rawDiv);
            }
            btn.textContent = '<<';
        } catch (error) {
            console.error('ошибка запроса:', error);
        }
    }
    function init() {
        const comments = document.querySelectorAll('.b-comment');
        comments.forEach(comment => {
            if (!comment.dataset.rawButtonAdded) {
                addRawButton(comment);
                comment.dataset.rawButtonAdded = 'true';
            }
        });
    }
    init();
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 500);
        }
    }, 1000);
})();
