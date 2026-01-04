// ==UserScript==
// @name         MAL Quick Delete Button
// @namespace    https://tampermonkey.net/
// @version      1
// @description  Adds a delete button to entries of your anime list.
// @author       Rowel
// @match        https://myanimelist.net/animelist/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531944/MAL%20Quick%20Delete%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531944/MAL%20Quick%20Delete%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getCSRFToken = () => {
        const meta = document.querySelector('meta[name="csrf_token"]');
        return meta?.content || null;
    };

    const injectDeleteButtons = () => {
        const csrf = getCSRFToken();
        if (!csrf) {
            console.warn(' CSRF token not found. Are you logged in?');
            return;
        }

        const rows = document.querySelectorAll('td.data.progress');

        rows.forEach(cell => {
            const progressDiv = cell.querySelector('div[class^="progress-"]');
            if (!progressDiv || cell.querySelector('.delete-entry-button')) return;

            const match = progressDiv.className.match(/progress-(\d+)/);
            if (!match) return;

            const animeId = match[1];

            // Create the button
            const button = document.createElement('button');
            button.textContent = '❌';
            button.className = 'delete-entry-button';
            button.dataset.confirmed = 'false';
            Object.assign(button.style, {
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 5px',
                fontSize: '10px',
                cursor: 'pointer'
            });

            button.addEventListener('click', () => {
                const confirmed = button.dataset.confirmed === 'true';

                if (!confirmed) {
                    // Change appearance for confirmation
                    button.textContent = '✅';
                    button.style.backgroundColor = '#27ae60';
                    button.dataset.confirmed = 'true';
                } else {
                    // Perform delete
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://myanimelist.net/ownlist/anime/${animeId}/delete?hideLayout=1`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Origin': 'https://myanimelist.net',
                            'Referer': `https://myanimelist.net/ownlist/anime/${animeId}/edit?hideLayout=1`
                        },
                        data: `csrf_token=${encodeURIComponent(csrf)}`,
                        onload: res => {
                            if (res.status === 200) {
                                const fullRow = cell.closest('tr');
                                fullRow.style.opacity = '0.4';
                                setTimeout(() => fullRow.remove(), 500);
                            } else {
                                alert(`Failed to delete anime ID ${animeId}. Status: ${res.status}`);
                            }
                        }
                    });
                }
            });

            // Inline layout
            const progressText = progressDiv.textContent.trim();
            progressDiv.textContent = '';

            const inlineWrap = document.createElement('span');
            inlineWrap.style.display = 'inline-flex';
            inlineWrap.style.alignItems = 'center';
            inlineWrap.style.gap = '6px';

            const textNode = document.createElement('span');
            textNode.textContent = progressText;

            inlineWrap.appendChild(textNode);
            inlineWrap.appendChild(button);
            progressDiv.appendChild(inlineWrap);
        });
    };

    // Wait for table render
    const observer = new MutationObserver(() => {
        const loaded = document.querySelector('td.data.progress div[class^="progress-"]');
        if (loaded) {
            observer.disconnect();
            injectDeleteButtons();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
