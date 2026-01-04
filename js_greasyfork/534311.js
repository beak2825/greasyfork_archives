// ==UserScript==
// @name         Stripchat - Hide Private Models (All Pages)
// @namespace    https://greasyfork.org/users/1463345-james007
// @version      1.1
// @description  Automatically hide models who are in private or ticket shows across all Stripchat pages, not just Indian section. Clean browsing experience focused on public/free models only!
// @author       YourName
// @license      MIT
// @match        https://stripchat.com/*
// @icon         https://stripchat.com/favicon.ico
// @grant        none
// @run-at       document-end
// @homepageURL  https://greasyfork.org/scripts/your-script-id
// @supportURL   https://greasyfork.org/scripts/your-script-id/feedback
// @downloadURL https://update.greasyfork.org/scripts/534311/Stripchat%20-%20Hide%20Private%20Models%20%28All%20Pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534311/Stripchat%20-%20Hide%20Private%20Models%20%28All%20Pages%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Hide models that are currently in private/ticket shows.
     * Looks for elements with class containing "ModelThumbPrivateCover" inside model-list-item blocks.
     */
    function hidePrivateModels() {
        const modelItems = document.querySelectorAll('.model-list-item');
        modelItems.forEach(item => {
            if (item.querySelector('div[class*="ModelThumbPrivateCover"]')) {
                item.style.display = 'none';
            }
        });
    }

    // Run once after the page loads
    document.addEventListener('DOMContentLoaded', hidePrivateModels);

    // Keep running whenever new models are dynamically loaded (infinite scroll, filtering, etc.)
    const observer = new MutationObserver(hidePrivateModels);
    observer.observe(document.body, { childList: true, subtree: true });
})();
