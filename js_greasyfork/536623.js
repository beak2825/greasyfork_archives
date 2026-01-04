// ==UserScript==
//
// @name         Azure DevOps - Auto-select Show Active Comments
// @version      1.1
// @author       Chad
// @description  Automatically switches to Active Comments view in Azure DevOps
// @license      MIT

// @namespace    http://tampermonkey.net/
// @include      https://dev.azure.com/*
// @include      https://*.visualstudio.com/*
// @grant        none
// @run-at       document-idle
//
// @downloadURL https://update.greasyfork.org/scripts/536623/Azure%20DevOps%20-%20Auto-select%20Show%20Active%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/536623/Azure%20DevOps%20-%20Auto-select%20Show%20Active%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menuOpened = false;

    function findAndClickActiveComments() {
        // First try to find "Active comments" anywhere on the page
        const activeComments = [...document.querySelectorAll('*')].find(el =>
            el.textContent && el.textContent.trim().match(/^Active comments\s*(\(\d+\))?$/i)
        );

        if (activeComments) {
            activeComments.click();
            return true;
        }

        // If not found and menu not opened yet
        if (!menuOpened) {
            const dropdownButton = document.querySelector('.repos-activity-filter-dropdown button.bolt-button');
            if (dropdownButton) {
                dropdownButton.click();
                menuOpened = true;

                // Try again after menu opens
                setTimeout(findAndClickActiveComments, 300);
            }
        }

        return false;
    }

    function runWithRetries(attempt = 0) {
        if (attempt >= 5) return;

        if (!findAndClickActiveComments()) {
            setTimeout(() => runWithRetries(attempt + 1), 1000 + (attempt * 500));
        }
    }

    // Initial run
    setTimeout(runWithRetries, 1000);

    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            menuOpened = false; // Reset for new page
            setTimeout(runWithRetries, 1000);
        }
    }).observe(document, {subtree: true, childList: true});
})();