// ==UserScript==
// @name         YouTube Studio - Highlight Non-Monetized Videos
// @namespace    https://greasyfork.org/en/users/yourusername
// @version      1.0
// @description  Highlights YouTube videos in YouTube Studio that are not monetized (yellow/red icons).
// @author       ChatGPT
// @match        https://studio.youtube.com/channel/*/videos
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534581/YouTube%20Studio%20-%20Highlight%20Non-Monetized%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/534581/YouTube%20Studio%20-%20Highlight%20Non-Monetized%20Videos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        highlightUnmonetized();
    });

    const highlightUnmonetized = () => {
        const rows = document.querySelectorAll('ytcp-video-list-cell-monetization-status');

        rows.forEach(row => {
            const icon = row.querySelector('iron-icon');
            if (icon && icon.getAttribute('icon')) {
                const monetizationIcon = icon.getAttribute('icon');
                const parentRow = row.closest('ytcp-video-row');

                if (monetizationIcon.includes('monetization_off') || monetizationIcon.includes('monetization_limited')) {
                    if (parentRow) {
                        parentRow.style.backgroundColor = '#ffe5e5'; // light red
                        parentRow.style.border = '2px solid red';
                    }
                }
            }
        });
    };

    const waitForTable = () => {
        const container = document.querySelector('ytcp-video-table');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
            highlightUnmonetized();
        } else {
            setTimeout(waitForTable, 1000);
        }
    };

    waitForTable();
})();
