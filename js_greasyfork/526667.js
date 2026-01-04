// ==UserScript==
// @name         Reveal Hidden PE ID
// @namespace    http://example.com
// @version      1.3
// @description  Reveals hidden PE IDs from emails.
// @match        *://*/*
// @grant        none
// @license      MIT  // Choose a license! See below for options.
// @downloadURL https://update.greasyfork.org/scripts/526667/Reveal%20Hidden%20PE%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/526667/Reveal%20Hidden%20PE%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function revealPeIDs() {
        const hiddenElements = document.querySelectorAll('div[style*="font-size:0px"][style*="overflow:hidden"], span[style*="font-size:0px"][style*="overflow:hidden"]'); // Include spans as well

        hiddenElements.forEach(element => {
            if (/PE-\d+/i.test(element.textContent)) {
                element.style.fontSize = "14px";
                element.style.lineHeight = "normal";
                element.style.color = "black";
                element.style.height = "auto";
                element.style.overflow = "visible";
                element.style.backgroundColor = "#ffffe0";
                element.style.border = "1px dashed red";

                // More robust way to remove inline styles that might interfere
                element.style.removeProperty('font-size');
                element.style.removeProperty('overflow');
            }
        });
    }

    // Run on load and after mutations
    function initialize() {
        setTimeout(revealPeIDs, 500); // Shorter initial delay, might not need 3 seconds
        const observer = new MutationObserver(revealPeIDs);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true }); // Observe more changes
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize(); // Handle cases where the script loads after the DOM is ready
    }

})();