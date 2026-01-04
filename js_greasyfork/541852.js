// ==UserScript==
// @name         YouTube 4-Column Home Page Layout
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Force YouTube to use a 4-column grid, fix layout, and remove section renderers like Shorts etc.
// @author       violettt
// @match        https://www.youtube.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541852/YouTube%204-Column%20Home%20Page%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/541852/YouTube%204-Column%20Home%20Page%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectCustomCSS() {
        const style = document.createElement('style');
        style.textContent = `
            ytd-rich-item-renderer {
                width: calc(92% / 4) !important;
            }

            /* Optional: reduce spacing if needed */
            ytd-rich-grid-renderer #contents {
                column-gap: 0 !important;
                row-gap: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function observeAndFixGrid() {
        const observer = new MutationObserver(() => {
            updateGrid();
        });

        const container = document.querySelector('#contents');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
            updateGrid(); // initial run
        }
    }

    function updateGrid() {
        // Remove sections like Shorts or "Recommended topics"
        document.querySelectorAll('ytd-rich-section-renderer').forEach(el => el.remove());

        const items = Array.from(document.querySelectorAll('ytd-rich-item-renderer'));

        items.forEach((item, index) => {
            // Change attribute to 4
            item.setAttribute('items-per-row', '4');

            // Update "is-in-first-column" class
            item.classList.remove('is-in-first-column');
            if (index % 4 === 0) {
                item.classList.add('is-in-first-column');
            }
        });
    }

    function waitForGrid() {
        const check = setInterval(() => {
            if (document.querySelector('ytd-rich-item-renderer')) {
                clearInterval(check);
                injectCustomCSS();
                observeAndFixGrid();
            }
        }, 500);
    }

    waitForGrid();
})();
