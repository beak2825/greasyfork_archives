// ==UserScript==
// @name         YouTube 6 Videos Per Row (Custom)
// @namespace    http://tampermonkey.net/
// @version      1.21
// @license MIT
// @description  Custom script to force 6 videos per row on YouTube homepage with a small gap
// @author       mechanicalfluff
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533561/YouTube%206%20Videos%20Per%20Row%20%28Custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533561/YouTube%206%20Videos%20Per%20Row%20%28Custom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyCustomLayout() {
        const styleId = 'youtube-6-videos-custom';
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #contents.ytd-rich-grid-renderer {
                display: grid !important;
                grid-template-columns: repeat(6, calc(16.6667% - 3px)) !important; /* Adjusted for gap */
                gap: 15px !important; /* Cursor-width gap between videos to avoid triggering mouseover. (approx. 15px) */
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }
            ytd-rich-item-renderer {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            }
            @media (max-width: 1800px) {
                #contents.ytd-rich-grid-renderer {
                    grid-template-columns: repeat(5, calc(20% - 2.4px)) !important;
                    gap: 2px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Apply on load
    window.addEventListener('load', applyCustomLayout);

    // Reapply on navigation
    window.addEventListener('yt-navigate-finish', applyCustomLayout);

    // Observe changes
    const observer = new MutationObserver(() => applyCustomLayout());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial application
    applyCustomLayout();
})();