// ==UserScript==
// @name         Mydealz Bookmark Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt Bookmark-Button neben Kommentare hinzu
// @author       QuickFix
// @match        https://www.mydealz.de/*
// @exclude      https://www.mydealz.de/profile/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525173/Mydealz%20Bookmark%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/525173/Mydealz%20Bookmark%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getXsrfToken() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'xsrf_t') {
                return value.replace(/"/g, '');
            }
        }
        return null;
    }

    function toggleBookmark(threadId, state) {
        const xsrfToken = getXsrfToken();
        if (!xsrfToken) {
            console.error('XSRF Token nicht gefunden');
            return;
        }

        fetch('https://www.mydealz.de/threads/thread-save/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Request-Type': 'application/vnd.pepper.v1+json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Pepper-Txn': 'threads.show.deal',
                'X-XSRF-TOKEN': xsrfToken
            },
            body: JSON.stringify({
                threadId: threadId,
                state: state
            })
        }).then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    function addBookmarkButton() {
        const threads = document.querySelectorAll('.thread');

        threads.forEach(thread => {
            const commentsButton = thread.querySelector('a[href*="comments"]');
            if (!commentsButton || thread.querySelector('.bookmark-button')) return;

            const threadId = thread.id.replace('thread_', '');

            const bookmarkButton = document.createElement('button');
            bookmarkButton.className = 'button button--type-text button--mode-secondary bookmark-button';
            bookmarkButton.innerHTML = `
                <span class="flex--inline boxAlign-ai--all-c">
                    <svg width="16" height="20" class="icon icon--bookmark">
                        <use xlink:href="/assets/img/ico_707ed.svg#bookmark"></use>
                    </svg>
                </span>
            `;

            bookmarkButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isActive = bookmarkButton.classList.contains('active');
                toggleBookmark(threadId, !isActive);
                bookmarkButton.classList.toggle('active');

                const iconUse = bookmarkButton.querySelector('use');
                iconUse.setAttribute('xlink:href',
                    isActive ? '/assets/img/ico_707ed.svg#bookmark' : '/assets/img/ico_707ed.svg#bookmark-active'
                );
            });

            commentsButton.parentNode.insertBefore(bookmarkButton, commentsButton.nextSibling);
        });
    }

    const observer = new MutationObserver(() => {
        addBookmarkButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addBookmarkButton();
})();
