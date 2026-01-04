// ==UserScript==
// @name         Fix YouTube
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Fix YouTube feed bug and the hitboxes of the buttons
// @author       Kalakaua
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513465/Fix%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/513465/Fix%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove extra hitbox on fullscreen button
    const removeFullscreenHitbox = () => {
        const fullscreenStyle = '.ytp-fullscreen-button::after { content: none !important; }';
        const style = document.createElement('style');
        style.innerHTML = fullscreenStyle;
        document.head.appendChild(style);
    };

    // Remove extra hitbox on Play or Pause button
    const removePlayHitbox = () => {
        const playHitboxStyle = '#contentContainer::after, .ytp-play-button::before { content: none !important; }';
        const style = document.createElement('style');
        style.innerHTML = playHitboxStyle;
        document.head.appendChild(style);
    };

    // Find and delete rows with the blank space bug
    const deleteRowsWithBlankSpace = () => {
        const rows = document.querySelectorAll('ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer');
        rows.forEach(row => {
            const contents = row.querySelector('div#contents.style-scope.ytd-rich-grid-row');
            if (!contents) return;

            const itemRenderers = row.querySelectorAll('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row');
            if (itemRenderers.length !== 6) return;

            const contentDivs = [...itemRenderers].map(itemRenderer => itemRenderer.querySelector('div#content.style-scope.ytd-rich-item-renderer'));
            if (!contentDivs.every(div => div)) return;

            const isValidRow = contentDivs.every(div => {
                const mediaElements = div.querySelectorAll('ytd-rich-grid-media.style-scope.ytd-rich-item-renderer');
                return mediaElements.length === 1;
            });

            if (!isValidRow) {
                row.remove();
            }
        });
    };

    // Function to delete rows containing `ytd-rich-section-renderer`
    const deleteRichSectionRows = () => {
        const sections = document.querySelectorAll('ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer');
        sections.forEach(section => {
            if (section) {
                section.remove(); // Remove the section itself
            }
        });
    };

    // Function to run all removals
    const runAllRemovals = () => {
        removeFullscreenHitbox();
        removePlayHitbox();
        deleteRowsWithBlankSpace();
        deleteRichSectionRows(); // Delete rows with ytd-rich-section-renderer
    };

    // Run the functions initially
    runAllRemovals();

    // Observe changes in the DOM to catch newly added elements
    const observer = new MutationObserver(() => {
        runAllRemovals();
    });

    // Observe the entire body for new nodes being added
    observer.observe(document.body, {
        childList: true,
        subtree: true // Watch deeply inside the DOM
    });

})();
