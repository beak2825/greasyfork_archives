// ==UserScript==
// @name         Pimeye partial unblur
// @version      1.2
// @description  Adds overflow visibility to text labels in Pimeye results and opens a Google link on click
// @author       SH3LL
// @match        https://pimeyes.com/en/results/*
// @grant        none
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/531501/Pimeye%20partial%20unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/531501/Pimeye%20partial%20unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processedSpans = new Set(); // Set to track processed spans

    function addOverflowVisible() {
        const spans = document.querySelectorAll('span[data-v-d11d31e3]');
        spans.forEach(span => {
            if (!processedSpans.has(span)) { // Check if the span has already been processed
                span.style.overflow = 'visible';
                span.style.maxWidth = '900px';

                // Add a click listener
                span.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent the span's default behavior

                    const text = span.textContent.trim().replace("https://","").replace("http://",""); // Get the span's text
                    if (text) {
                        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
                        window.open(googleSearchUrl, '_blank'); // Open the link in a new tab
                    }
                });

                processedSpans.add(span); // Add the span to the set of processed spans
            }
        });
    }

    // Run the function on startup and on every DOM change
    addOverflowVisible();
    const observer = new MutationObserver(addOverflowVisible);
    observer.observe(document.body, { childList: true, subtree: true });
})();