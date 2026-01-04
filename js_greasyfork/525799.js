// ==UserScript==
// @name         Mydealz Bookmark Button
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Bringt auf Übersichtsseiten das Bookmark Icon zurück, um einen Deal per Klick für später zu speichern
// @match        https://www.mydealz.de/*
// @exclude      https://www.mydealz.de/profile/*
// @exclude      /https:\/\/www\.mydealz\.de\/.*-[0-9]+/
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525799/Mydealz%20Bookmark%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/525799/Mydealz%20Bookmark%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ICON = {
        active: '/assets/img/ico_707ed.svg#bookmark-active',
        inactive: '/assets/img/ico_707ed.svg#bookmark'
    };

    function getBookmarkState(thread) {
        try {
            const vueData = JSON.parse(thread.querySelector('[data-vue2]').dataset.vue2);
            return vueData.props.thread.isBookmarked;
        } catch (e) {
            console.error('Metadaten-Parsing fehlgeschlagen:', e);
            return false;
        }
    }

    function updateButtonState(button, isBookmarked) {
        button.dataset.bookmarked = isBookmarked;
        button.querySelector('use').setAttribute('xlink:href',
            isBookmarked ? ICON.active : ICON.inactive
        );
    }

    function createBookmarkButton() {
        const button = document.createElement('button');
        button.className = 'button button--type-text button--mode-secondary';
        button.innerHTML = `
<span class="flex--inline boxAlign-ai--all-c">
<svg width="16" height="20" class="icon icon--bookmark">
<use xlink:href="${ICON.inactive}"></use>
</svg>
</span>
`;
        return button;
    }

    function handleBookmarkClick(button, threadId) {
        const currentState = button.dataset.bookmarked === 'true';
        const newState = !currentState;

        toggleBookmark(threadId, newState).then(success => {
            if (success) {
                updateButtonState(button, newState);
            }
        });
    }

    async function toggleBookmark(threadId, state) {
        try {
            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('xsrf_t='))
                ?.split('=')[1]
                .replace(/"/g, '');

            const response = await fetch('https://www.mydealz.de/threads/thread-save/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },
                body: JSON.stringify({
                    threadId,
                    state
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Fehler beim Toggle:', error);
            return false;
        }
    }

    function initBookmarks() {
        document.querySelectorAll('.thread:not([data-bm-init])').forEach(thread => {
            const button = createBookmarkButton();
            const threadId = thread.id.replace('thread_', '');

            // Initialzustand setzen
            updateButtonState(button, getBookmarkState(thread));

            // Click-Handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBookmarkClick(button, threadId);
            });

            thread.querySelector('.threadListCard-footer').prepend(button);
            thread.dataset.bmInit = 'true';
        });
    }

    // Mutation Observer für dynamische Inhalte
    new MutationObserver(initBookmarks)
        .observe(document.body, {
            childList: true,
            subtree: true
        });

    initBookmarks();
})();