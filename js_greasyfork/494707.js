// ==UserScript==
// @name        De-Junk my Chub Trunk
// @namespace   https://www.chub.ai
// @match       https://*.chub.ai/*
// @version     1.0
// @author      LoafyLemon
// @description Bypassess login requirement, removes paid feature buttons, removes blur from NSFW images, fixes CSS, and more...
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494707/De-Junk%20my%20Chub%20Trunk.user.js
// @updateURL https://update.greasyfork.org/scripts/494707/De-Junk%20my%20Chub%20Trunk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the URL for redirection
    const subpageURL = 'https://www.chub.ai/characters?page=1&sort=last_activity_at&first=100';

    // Redirect to the subpage
    if (window.location.pathname === '/') {
        window.location.href = subpageURL;
    }

    // Define custom CSS
    const customCSS = `
        .nsfw-pixels-sm, .nsfw-pixels-lg, .nsfw-pixels-xs {
            -webkit-filter: none !important;
            filter: none !important;
            image-rendering: auto !important;
            padding: 0px !important;
            max-height: 600px;
        }
        .mb-4 {
            display: none !important;
        }
    `;

    // Add custom CSS styles to the webpage
    GM_addStyle(customCSS);

    // Function to hide elements with the class 'ant-btn' containing specific text
    function hideElements() {
        // Find all elements with class 'ant-btn'
        const elementsToHide = document.querySelectorAll('.ant-btn');

        // Loop through each element
        elementsToHide.forEach(element => {
            // Check if the element's text content contains 'text'
            if (element.textContent.includes('🔒')) {
                // Hide the element
                element.style.display = 'none';
            }
        });
    }

    // Observe changes to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if nodes were added
            if (mutation.addedNodes.length > 0) {
                // Call the function to hide elements
                hideElements();
            }
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Initially hide elements on page load
    hideElements();
})();
