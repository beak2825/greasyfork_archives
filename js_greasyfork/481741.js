// ==UserScript==
// @name         autoBoo
// @namespace    http://your.namespace/
// @version      0.2
// @description  Clicks on an element with a random delay, repeats the process, and refreshes the page every 5 minutes on https://boo.world/match
// @author       You
// @match        https://boo.world/match
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481741/autoBoo.user.js
// @updateURL https://update.greasyfork.org/scripts/481741/autoBoo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random delay between given minimum and maximum values
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Recursive function to find and click on an element with a random delay
    function clickElement() {
        // XPath to locate the element on the page
        const path = '//div[@id="actionButtons"]/div/div/div[7]/img';
        const xPathRes = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = xPathRes.singleNodeValue;

        if (element) {
            // If the element is found, click it
            element.click();
            console.log('Element clicked successfully.');

            // Repeat the process after a random delay
            const randomDelay = getRandomDelay(1000, 10000);
            console.log(`Repeating in ${randomDelay} milliseconds...`);
            setTimeout(clickElement, randomDelay);
        } else {
            // If the element is not found, wait with a random delay and then retry
            const randomDelay = getRandomDelay(1000, 10000);
            console.log(`Element not found. Retrying in ${randomDelay} milliseconds...`);
            setTimeout(clickElement, randomDelay);
        }
    }

    // Function to refresh the page every 5 minutes
    function refreshPage() {
        console.log('Refreshing page...');
        location.reload(true);
    }

    // Start the recursive function
    clickElement();

    // Refresh the page every 5 minutes (300,000 milliseconds)
    setInterval(refreshPage, 300000);
})();
