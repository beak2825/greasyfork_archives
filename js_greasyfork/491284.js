// ==UserScript==
// @name         Google Gemini: Search Links for Strong Text
// @namespace    http://tampermonkey.net/
// @version      2024-03-30
// @description  Grab all strong tags on the page (continuously as they are added) and have them converted to urls for relevant Google Searches in new tabs. This means you can easily search any major topic Gemini references.
// @author       Google Gemini mostly - but overseen and with light editing by Brian Handy
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491284/Google%20Gemini%3A%20Search%20Links%20for%20Strong%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/491284/Google%20Gemini%3A%20Search%20Links%20for%20Strong%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to convert strong elements to links
    function convertStrongToLinks() {
        var strongElements = document.querySelectorAll("strong");

        for (var i = 0; i < strongElements.length; i++) {
            var strongElement = strongElements[i];
            var textContentWithColon = strongElement.textContent.trim(); // Preserve text content with colon

            // Remove colon for URL construction
            var textContentForUrl = textContentWithColon.replace(/:\s*$/, "");
            var googleSearchUrl = "https://www.google.com/search?q=" + encodeURIComponent(textContentForUrl);

            // Create anchor element for the URL (excluding colon)
            var anchorElement = document.createElement("a");
            anchorElement.href = googleSearchUrl;
            anchorElement.textContent = textContentWithColon; // Display text content with colon

            // Apply CSS styles for bold and black color (to the anchor)
            anchorElement.style.fontWeight = "bold";
            anchorElement.style.color = "black";

            // Set rel attribute for new tab behavior (directly during creation)
            anchorElement.rel = "noopener noreferrer";
            anchorElement.target="_blank";

            // Replace strong element with the anchor element
            strongElement.parentNode.replaceChild(anchorElement, strongElement);
        }
    }

    // Create a MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length > 0) {
                convertStrongToLinks(); // Run the conversion function for newly added nodes
            }
        }
    });

    // Observe the entire document for changes
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Call the conversion function initially to handle existing strong elements
    convertStrongToLinks();

})();