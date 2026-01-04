// ==UserScript==
// @name         Remove History Suggestions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      CC BY-NC
// @description  Don't want to see your search history, well don't see it :p
// @author       Unknown Hacker
// @match        https://outlook.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525349/Remove%20History%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/525349/Remove%20History%20Suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeHistorySuggestions() {
        document.querySelectorAll('[aria-label]').forEach(el => {
            if (el.getAttribute('aria-label')?.includes('History Suggestion')) {
                el.remove();
            }
        });
    }

    setInterval(removeHistorySuggestions, 10);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.getAttribute('aria-label')?.includes('History Suggestion')) {
                    node.remove();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
