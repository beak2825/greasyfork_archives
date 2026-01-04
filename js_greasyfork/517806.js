// ==UserScript==
// @name         Unsubscribe All Subreddits (Target Links)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Unsubscribes from all subreddits by targeting <a> elements.
// @author       cross7139
// @match        https://www.reddit.com/subreddits
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517806/Unsubscribe%20All%20Subreddits%20%28Target%20Links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517806/Unsubscribe%20All%20Subreddits%20%28Target%20Links%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Script started: Looking for 'Leave' links...");

    const MAX_RETRIES = 50;
    let retryCount = 0;

    // Function to locate and click 'Leave' links
    function findAndClickLeaveLinks() {
        // Select all <a> tags with the 'option active remove login-required' class
        const links = document.querySelectorAll('a.option.active.remove.login-required');

        if (links.length > 0) {
            console.log(`${links.length} 'Leave' links found.`);
            links.forEach((link, index) => {
                setTimeout(() => {
                    try {
                        console.log(`Clicking 'Leave' link for subreddit #${index + 1}`);
                        link.click();
                        console.log(`Successfully clicked 'Leave' link for subreddit #${index + 1}`);
                    } catch (err) {
                        console.error(`Error clicking 'Leave' link for subreddit #${index + 1}:`, err);
                    }
                }, index * 1000); // 1-second delay to prevent throttling
            });
        } else if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.warn(
                `Retrying to find 'Leave' links (#${retryCount}/${MAX_RETRIES}) in 2 seconds...`
            );
            setTimeout(findAndClickLeaveLinks, 2000); // Retry after 2 seconds
        } else {
            console.error("Max retries reached. Could not find 'Leave' links.");
        }
    }

    // Debugging: Log all <a> elements periodically
    setInterval(() => {
        const allLinks = document.querySelectorAll('a');
        console.log(`Total links on page: ${allLinks.length}`);
        allLinks.forEach((link, idx) => {
            console.log(
                `Link #${idx}: Text = "${link.textContent.trim()}" | Classes = "${link.className}"`
            );
        });
    }, 5000); // Logs every 5 seconds

    // Start the process
    findAndClickLeaveLinks();
})();
