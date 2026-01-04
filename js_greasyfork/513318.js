// ==UserScript==
// @name         Fix Meme flags to il or in
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fix Meme Flags
// @author       You
// @match        *://boards.4chan.org/pol/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513318/Fix%20Meme%20flags%20to%20il%20or%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/513318/Fix%20Meme%20flags%20to%20il%20or%20in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixFlags() {
        // Select all elements that have classes starting with "bfl bfl-"
        var elements = document.querySelectorAll('[class*="bfl bfl-"]');

        // Iterate over each element and swap the class
        elements.forEach(function(element) {
            element.classList.forEach(function(cls) {
                // Check if the class matches the "bfl bfl-XX" pattern
                if (cls.startsWith('bfl-')) {
                    // Remove both "bfl" and the specific "bfl-XX" class
                    element.classList.remove('bfl', cls);
                    // Add "flag flag-il" in their place
                    element.classList.add('flag', 'flag-il');

                    // Append the India flag span after the current element
                    const indiaFlagSpan = document.createElement('span');
                    indiaFlagSpan.className = 'flag flag-in';
                    indiaFlagSpan.title = 'india';
                    element.insertAdjacentElement('afterend', indiaFlagSpan);
                }
            });
        });
    }

    // Initial call to fix flags
    fixFlags();

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                fixFlags(); // Re-run the flag fixing function when DOM changes occur
            }
        });
    });

    // Observe the body for changes
    observer.observe(document.body, {
        childList: true, // Watch for added/removed child elements
        attributes: true, // Watch for changes to attributes
        subtree: true // Observe the entire subtree, not just immediate children
    });

})();
