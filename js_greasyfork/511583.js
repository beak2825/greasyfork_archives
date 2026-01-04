// ==UserScript==
// @name         Remove Content by Keywords
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Removes content containing certain keywords, directly configurable in the script.
// @author       Pier
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511583/Remove%20Content%20by%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/511583/Remove%20Content%20by%20Keywords.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keywords are directly configured here in the script
    var keywords = [/\bfedez\b/i, /\bferragni\b/i,/\bferragnez\b/i];

    // Function to remove elements with keywords
    function removeContentByKeywords() {
        var elements = document.querySelectorAll('p, h1, h2, h3, div:not(#header):not(#footer)');  // Exclude header/footer

        elements.forEach(function(element) {
            keywords.forEach(function(keyword) {
                if (keyword.test(element.textContent)) {
                    element.remove();  // Remove the element
                }
            });
        });
    }

    // MutationObserver for dynamic content
    var observer = new MutationObserver(function(mutations) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
            removeContentByKeywords();
        }, 300);  // Debounce to prevent excessive execution
    });

    // Observe changes in the body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run after page load
    window.onload = function() {
        removeContentByKeywords();
    };

})();
