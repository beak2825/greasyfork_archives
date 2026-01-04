// ==UserScript==
// @name         EdX Transcript Copier
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a button to the EdX video player to copy subtitles. Runs inside the video iframe.
// @author       Yang Chyi-Jen
//
// @match        *://courses.edx.org/*
//
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542832/EdX%20Transcript%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/542832/EdX%20Transcript%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Subtitle Copier (v1.5): Script running inside iframe.");

    // --- Style for the button ---
    GM_addStyle(`
        #subtitle-copier-btn-iframe {
            all: revert;
            position: absolute; /* Positioned relative to the menu */
            display: block;
            top: 8px;
            right: 8px;
            z-index: 99999; /* High z-index to appear on top */
        }
        /* Ensure the parent has relative positioning for our button */
        .subtitles-menu {
            position: relative !important;
        }
    `);

    /**
     * Finds the subtitle list items, extracts their text, and copies to clipboard.
     * @param {HTMLElement} subtitlesMenu - The .subtitles-menu element.
     * @returns {boolean} - True if text was successfully copied, false otherwise.
     */
    function copySubtitles(subtitlesMenu) {
        const listItems = subtitlesMenu.querySelectorAll('ol > li');
        if (listItems.length < 3) {
            console.log("Subtitle Copier: Not enough items to copy (< 3).");
            return false;
        }
        const relevantItems = Array.from(listItems).slice(1, -1);
        const textToCopy = relevantItems
            .map(item => item.textContent.trim())
            .join('\n');

        if (textToCopy) {
            GM_setClipboard(textToCopy);
            console.log("Subtitles copied to clipboard.");
            return true;
        }
        console.log("Subtitle Copier: No text found to copy.");
        return false;
    }

    /**
     * Creates the "Copy" button and adds it to the subtitles menu.
     * @param {HTMLElement} subtitlesMenu - The .subtitles-menu element.
     */
    function addCopyButton(subtitlesMenu) {
        // Prevent adding multiple buttons
        if (subtitlesMenu.querySelector('#subtitle-copier-btn-iframe')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'subtitle-copier-btn-iframe';
        btn.textContent = 'Copy';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent the click from closing the menu

            if (copySubtitles(subtitlesMenu)) {
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            } else {
                btn.textContent = 'Failed';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            }
        });

        subtitlesMenu.appendChild(btn);
        console.log("Subtitle Copier: Button added to menu.");
    }


    // --- Main Execution ---
    // Observe the document body for the subtitles menu to appear.
    const observer = new MutationObserver((mutationsList, obs) => {
        const subtitlesMenu = document.querySelector('.subtitles-menu');
        if (subtitlesMenu) {
            addCopyButton(subtitlesMenu);
            // We don't disconnect, as the menu might be recreated.
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
