// ==UserScript==
// @name        YouTube Latest Videos Default
// @description A script that makes https://www.youtube.com/@*/videos default to 'Latest' instead of 'For You'.
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/@*/featured
// @grant       none
// @version 0.0.1.20230521155403
// @downloadURL https://update.greasyfork.org/scripts/466693/YouTube%20Latest%20Videos%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/466693/YouTube%20Latest%20Videos%20Default.meta.js
// ==/UserScript==

let lastUrl = window.location.href;

// Function to click the "Latest" button
function clickLatestButton() {
    const targetElement = document.querySelector('yt-formatted-string[title="Latest"]');
    if (targetElement) {
        targetElement.click();
        // Wait for 200ms and check if the button is still present
        setTimeout(() => {
            const targetElementAfterClick = document.querySelector('yt-formatted-string[title="Latest"]');
            if (targetElementAfterClick) {
                // If the "Latest" button is still there, click it again
                targetElementAfterClick.click();
            }
        }, 200);
    }
}

// Observe for URL changes
new MutationObserver(() => {
    let url = window.location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(clickLatestButton, 200);
    }
}).observe(document.body, { childList: true, subtree: true });

// Click the "Latest" button on page load
clickLatestButton();
