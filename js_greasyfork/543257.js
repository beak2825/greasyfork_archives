// ==UserScript==
// @name         Anna's Archive Auto-Focus on Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-focus on the "Full database" search field
// @author       Dave131
// @match        https://annas-archive.org/*
// @match        https://annas-archive.li/*
// @match        https://annas-archive.gs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543257/Anna%27s%20Archive%20Auto-Focus%20on%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543257/Anna%27s%20Archive%20Auto-Focus%20on%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function focusSearchField() {
        // Look for the "Full database" search input field
        // It's the second search input on the page, in the main content area
        const searchInputs = document.querySelectorAll('input[type="search"]');

        // The full database search field should be the second search input
        // (first is in header, second is the "Full database" one we want)
        if (searchInputs.length >= 2) {
            const fullDbSearchField = searchInputs[1];
            fullDbSearchField.focus();
            return true;
        }

        // Fallback: look for the search field in the main content area
        const mainSearchField = document.querySelector('main input[type="search"]');
        if (mainSearchField) {
            mainSearchField.focus();
            return true;
        }

        return false;
    }

    // Try to focus immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Small delay to ensure all elements are rendered
            setTimeout(focusSearchField, 100);
        });
    } else {
        // DOM is already loaded
        setTimeout(focusSearchField, 100);
    }

    // Backup attempt in case the first attempts fail
    setTimeout(function() {
        if (document.activeElement.tagName.toLowerCase() !== 'input') {
            focusSearchField();
        }
    }, 500);
})();