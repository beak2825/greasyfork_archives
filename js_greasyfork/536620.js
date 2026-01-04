// ==UserScript==
//
// @name         Azure DevOps - Persistent Feature/DE Highlight
// @version      1.6
// @author       Chad
// @description  Maintains feature/DE highlights with minimal overhead
// @license      MIT

// @namespace    https://github.com/yourusername
// @include      https://dev.azure.com/*
// @include      https://*.visualstudio.com/*
// @grant        GM_addStyle
// @run-at       document-idle
//
// @downloadURL https://update.greasyfork.org/scripts/536620/Azure%20DevOps%20-%20Persistent%20FeatureDE%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/536620/Azure%20DevOps%20-%20Persistent%20FeatureDE%20Highlight.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Inject styles once at startup
    GM_addStyle(`
        .feature-de-highlight {
            background-color: rgba(255, 0, 0, 0.2) !important;
            outline: 2px solid rgba(255, 0, 0, 0.5) !important;
        }
    `);

    // Single efficient highlighting function
    function highlightDEPrs() {
        const rows = document.querySelectorAll(`
            .bolt-table-row[role="row"],
            [aria-rowindex][role="row"]
        `);

        rows.forEach(row => {
            const title = row.querySelector('.body-l, [role="button"].body-l');
            if (title && /feature\/de/i.test(title.textContent)) {
                row.classList.add('feature-de-highlight');
            }
        });
    }

    // Single interval (2 seconds) + MutationObserver
    const interval = setInterval(highlightDEPrs, 2000);
    const observer = new MutationObserver(highlightDEPrs);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    highlightDEPrs();

    // Clean up when leaving the page
    window.addEventListener('unload', () => {
        clearInterval(interval);
        observer.disconnect();
    });
})();