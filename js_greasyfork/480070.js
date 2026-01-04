// ==UserScript==
// @name         Reddit hide blocked accounts on comments
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide comments with class starting pattern "Comment" if they contain "Blocked account"
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480070/Reddit%20hide%20blocked%20accounts%20on%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/480070/Reddit%20hide%20blocked%20accounts%20on%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom function to check if an element contains the specified text
    function containsText(element, text) {
        return element.innerText.includes(text);
    }

    // Function to hide elements with class starting with "Comment" containing "Blocked account"
    function hideComments() {
        const commentElements = document.querySelectorAll('[class^="Comment"]');

        commentElements.forEach(element => {
            if (containsText(element, 'Blocked account')) {
                element.style.display = 'none';
            }
        });
    }

    // Initial execution of the script
    hideComments();

    // Use MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(hideComments);

    const config = { childList: true, subtree: true };

    // Start observing changes in the DOM
    observer.observe(document.body, config);
})();
