// ==UserScript==
// @name         Hide Temu "Local" Listings
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide any .EKDT7a3v container that contains the word "local" on Temu
// @match        *://*.temu.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544562/Hide%20Temu%20%22Local%22%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/544562/Hide%20Temu%20%22Local%22%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check all .EKDT7a3v elements and hide those that include "local"
    function hideLocalElements() {
        document.querySelectorAll('.EKDT7a3v').forEach(container => {
            // Use innerText which sometimes captures more visible text than textContent.
            if (container.innerText && container.innerText.toLowerCase().includes("local")) {
                if (container.style.display !== "none") {
                    container.style.display = "none";
                    console.log("Hiding element:", container);
                }
            }
        });
    }

    // Run the check immediately
    //hideLocalElements();

    // Wait a bit over a second first so we can see how much high shipping options go!
    setTimeout(hideLocalElements, 1500);

    // Set up a MutationObserver to catch dynamically added content.
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        // Every time there's a change, run the hide function.
        hideLocalElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also, run the check every second for 30 seconds as a fallback.
    const intervalId = setInterval(hideLocalElements, 1000);
    setTimeout(() => clearInterval(intervalId), 30000);
})();
