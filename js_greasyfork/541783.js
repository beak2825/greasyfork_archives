// ==UserScript==
// @name          Mirror Creator Link Checker (Enhanced)
// @namespace     https://github.com/MeGaNeKoS/Mirror-Creator-Link-Checker
// @version       1.5
// @description   Automatically clicks all "Check" links on mirrored.to/files/ pages, revealing link statuses without manual clicks! Enhanced version based on MeGaNeKo's script.
// @author        sharmanhall (Based on MeGaNeKo(めがねこ)'s script)
// @license       MIT
// @match         *://www.mirrored.to/files/*
// @grant         none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/541783/Mirror%20Creator%20Link%20Checker%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541783/Mirror%20Creator%20Link%20Checker%20%28Enhanced%29.meta.js
// ==/UserScript==

// Ensure jQuery is loaded and the DOM is ready before executing your code
$(document).ready(function() {
    console.log("Mirror Creator Link Checker (Enhanced): Script started. jQuery loaded:", typeof $);

    // Function to click on all "Check" buttons
    function clickAllCheckButtons() {
        // Select all 'a' tags whose 'onclick' attribute starts with 'showStatus'
        const unclickedLinks = $('a[onclick^="showStatus"]');

        if (unclickedLinks.length > 0) {
            console.log(`Mirror Creator Link Checker (Enhanced): Found ${unclickedLinks.length} 'Check' links.`);
            unclickedLinks.each(function(index) {
                // Add a small, increasing delay between clicks to mimic human behavior
                // and avoid triggering potential anti-bot measures for rapid-fire clicks.
                // This also gives the site's JS time to process each click.
                setTimeout(() => {
                    $(this).click();
                    // Optional: Add a class to clicked links to prevent re-processing in subsequent checks
                    // $(this).addClass('clicked-by-userscript');
                    console.log(`Mirror Creator Link Checker (Enhanced): Clicking link ${index + 1}.`);
                }, 100 * index); // 100ms delay between each link click
            });
        } else {
            console.log("Mirror Creator Link Checker (Enhanced): No 'Check' links found yet or all visible ones processed.");
        }
    }

    // --- Initial Run and Periodic Check for Dynamically Loaded Content ---

    // Give the page a brief moment to fully settle and dynamic content to load.
    // This is often more reliable than just $(document).ready() for heavily dynamic pages.
    setTimeout(() => {
        console.log("Mirror Creator Link Checker (Enhanced): Running initial check after 1 second delay.");
        clickAllCheckButtons();

        // Set up a periodic check for any new links that might appear
        // after initial AJAX requests complete or content streams in.
        // We'll stop this interval once no new links are found over several checks.
        let consecutiveNoLinksCount = 0;
        const maxConsecutiveNoLinks = 5; // Number of times to find no new links before stopping

        const checkIntervalId = setInterval(() => {
            const currentLinks = $('a[onclick^="showStatus"]'); // Re-select to catch newly added elements
            if (currentLinks.length > 0) {
                console.log(`Mirror Creator Link Checker (Enhanced): Found ${currentLinks.length} links in interval check.`);
                currentLinks.each(function(index) {
                     // Only click if it hasn't been clicked already (optional, if you add class logic above)
                     // if (!$(this).hasClass('clicked-by-userscript')) {
                         setTimeout(() => {
                            $(this).click();
                            // $(this).addClass('clicked-by-userscript'); // Add this if you uncomment the if condition above
                         }, 100 * index);
                     // }
                });
                consecutiveNoLinksCount = 0; // Reset count if links are found
            } else {
                consecutiveNoLinksCount++;
                console.log(`Mirror Creator Link Checker (Enhanced): No new links found in this interval. Consecutive 'no links' count: ${consecutiveNoLinksCount}`);
                if (consecutiveNoLinksCount >= maxConsecutiveNoLinks) {
                    clearInterval(checkIntervalId);
                    console.log("Mirror Creator Link Checker (Enhanced): Stopping periodic checks (no new links found for a while).");
                }
            }
        }, 2000); // Check every 2 seconds for new links
    }, 1000); // Initial delay of 1 second before starting the process
});