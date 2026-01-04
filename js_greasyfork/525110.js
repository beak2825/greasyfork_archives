// ==UserScript==
// @name         RYM Track Rating Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort RYM track ratings by score with a toggle button
// @author       You
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?domain=rateyourmusic.com
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/525110/RYM%20Track%20Rating%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/525110/RYM%20Track%20Rating%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #rymSortBtn {
            all: unset !important;
            padding: 8px 15px !important;
            margin: 15px 0 !important;
            background: #4CAF50 !important;
            color: white !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 9999 !important;
            font-family: Arial !important;
            display: block !important;
        }
    `);

    function log(message) {
        console.log('[RYM Sorter]', message);
    }

    function findTracklistContainer() {
        // Try multiple selectors in priority order
        const selectors = [
            'div[data-testid="tracklist"]', // New RYM selector
            '.release_tracklist',
            '.tracklist_wrapper',
            '.tracklist',
            '.tracklist_list',
            '#tracks',
            'div.tracks'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                log(`Found container using selector: ${selector}`);
                return element;
            }
        }

        console.error('Tracklist container not found. Tried selectors:', selectors);
        return null;
    }

    function initialize() {
        const container = findTracklistContainer();
        if (!container) {
            // Retry after short delay for dynamic content
            setTimeout(initialize, 1000);
            return;
        }

        log('Initializing with container:', container);

        // Create and insert button
        const btn = document.createElement('button');
        btn.id = 'rymSortBtn';
        btn.textContent = 'Sort by Rating ▼';
        container.parentNode.insertBefore(btn, container);

        // Tracklist handling logic
        let originalHTML = container.innerHTML;
        let isSorted = false;

        btn.addEventListener('click', () => {
            if (isSorted) {
                container.innerHTML = originalHTML;
                btn.textContent = 'Sort by Rating ▼';
            } else {
                const tracks = Array.from(container.querySelectorAll('.track, [data-testid="track"]'));
                tracks.sort((a, b) => {
                    const getRating = el => {
                        const ratingEl = el.querySelector('.track_rating, .track_rating_value, [class*="rating"]');
                        return ratingEl ? parseFloat(ratingEl.textContent.replace('%', '')) || 0 : 0;
                    };
                    return getRating(b) - getRating(a);
                });

                container.replaceChildren(...tracks);
                btn.textContent = 'Restore Original Order ▲';
            }
            isSorted = !isSorted;
        });
    }

    // Start initialization with multiple fallbacks
    const init = () => {
        if (findTracklistContainer()) {
            initialize();
        } else {
            // Use MutationObserver as fallback
            const observer = new MutationObserver((mutations) => {
                if (findTracklistContainer()) {
                    observer.disconnect();
                    initialize();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Final fallback timeout
            setTimeout(() => {
                if (!document.getElementById('rymSortBtn')) {
                    initialize();
                }
            }, 3000);
        }
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        document.addEventListener('DOMContentLoaded', init);
    }
})();