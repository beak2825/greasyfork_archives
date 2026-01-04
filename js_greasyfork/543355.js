// ==UserScript==
// @name         Hide YouTube Mobile Search Suggestions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the dropdown search suggestions on m.youtube.com when tapping the search bar
// @author       You
// @license      MIT
// @match        https://m.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543355/Hide%20YouTube%20Mobile%20Search%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/543355/Hide%20YouTube%20Mobile%20Search%20Suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const suggestionBox = document.querySelector('[role="listbox"]');
        if (suggestionBox) {
            suggestionBox.style.display = 'none';
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();