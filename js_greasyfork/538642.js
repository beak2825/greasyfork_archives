// ==UserScript==
// @name         RYM Toggle Review Section
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create a button to hide/show the reviews section on RateYourMusic
// @author       https://greasyfork.org/users/1320826-polachek
// @match        *://*.rateyourmusic.com/release/*
// @match        *://*.rateyourmusic.com/film/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538642/RYM%20Toggle%20Review%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/538642/RYM%20Toggle%20Review%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .toggle-review-btn {
            background: var(--mono-fb);
            border: 1px solid #d0d0d0;
            border-radius: 3px;
            color: var(--mono-4);
            cursor: pointer;
            font-size: 11px;
            margin-left: 10px;
            padding: 2px 8px;
            vertical-align: middle;
            transition: all 0.2s ease;
        }
        .toggle-review-btn:hover {
            background: var(--mono-e);
        }
        .release_page_header {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Animação suave */
        .review_content {
            overflow: hidden;
            transition:
                max-height 0.5s ease-in-out,
                opacity 0.3s ease-in-out,
                padding 0.3s ease-in-out;
        }
        .section_reviews.collapsed .review_content {
            max-height: 0 !important;
            opacity: 0;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
        .section_reviews:not(.collapsed) .review_content {
            max-height: 5000px; /* Valor grande o suficiente */
            opacity: 1;
            transition:
                max-height 0.5s ease-in-out,
                opacity 0.5s ease-in-out 0.1s,
                padding 0.3s ease-in-out;
        }
    `);

    function initToggleButton() {
        const reviewSections = document.querySelectorAll('.section_reviews');

        reviewSections.forEach(section => {
            const header = section.querySelector('.release_page_header');
            if (!header) return;

            const btn = document.createElement('button');
            btn.className = 'toggle-review-btn';
            btn.textContent = 'Show';

            header.appendChild(btn);

            const content = section.querySelector('.review_list, .review_help, [id^="review_shell_"]');
            if (!content) return;

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'review_content';

            let nextElement = header.nextElementSibling;
            while (nextElement) {
                contentWrapper.appendChild(nextElement.cloneNode(true));
                nextElement.remove();
                nextElement = header.nextElementSibling;
            }

            header.parentNode.insertBefore(contentWrapper, header.nextSibling);

            section.classList.add('collapsed');

            btn.addEventListener('click', () => {
                const wasCollapsed = section.classList.contains('collapsed');

                section.classList.toggle('collapsed');
                btn.textContent = section.classList.contains('collapsed') ? 'Show' : 'Hide';

                if (wasCollapsed) {
                    contentWrapper.style.display = 'block';
                    void contentWrapper.offsetHeight; 
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggleButton);
    } else {
        initToggleButton();
    }
})();