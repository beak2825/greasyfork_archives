// ==UserScript==
// @name        Kick Auto Click "Show More"
// @namespace   Violentmonkey Scripts
// @match       *://*.kick.com/*
// @grant       none
// @version     2.4
// @license     MIT
// @icon
// @author      Trilla_G
// @description This script automatically clicks the "Show More" button twice on the sidebar, on kick.com.
// @downloadURL https://update.greasyfork.org/scripts/483412/Kick%20Auto%20Click%20%22Show%20More%22.user.js
// @updateURL https://update.greasyfork.org/scripts/483412/Kick%20Auto%20Click%20%22Show%20More%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickCount = 0;
    const maxClicks = 2;

    function clickShowMore() {
        // Updated selector
        const showMoreButton = document.querySelector('div.mx-3:nth-child(2) > button:nth-child(1) > span:nth-child(2)');

        if (showMoreButton) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            showMoreButton.dispatchEvent(clickEvent);
            clickCount++;
            console.log(`Clicked 'Show More' button ${clickCount} time(s)`);
            if (clickCount >= maxClicks) {
                clearInterval(clickInterval);
            }
        } else {
            console.log("'Show More' button not found");
        }
    }

    const clickInterval = setInterval(() => {
        if (clickCount < maxClicks) {
            clickShowMore();
        } else {
            clearInterval(clickInterval);
        }
    }, 1000); // Try every second until the button is clicked twice
})();
