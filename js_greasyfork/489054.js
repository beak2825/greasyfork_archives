// ==UserScript==
// @name         [KPX] Dog train/fed notification
// @namespace    https://cartelempire.online/
// @version      0.3
// @description  Dog train/fed notification for Inventory
// @author       KPCX
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489054/%5BKPX%5D%20Dog%20trainfed%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/489054/%5BKPX%5D%20Dog%20trainfed%20notification.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Define the waitForElements function
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Function to count occurrences of a string in the document body
    const countOccurrences = (stringToCount) => (document.body.innerText.match(new RegExp(stringToCount, 'g')) || []).length;

    // Check if we're on the Inventory page
    if (window.location.href.includes("Inventory")) {
        // Count occurrences and log to console
        const actions = ['Train \\(50 Energy\\)', 'Feed \\(1 Food Used\\)'];
        const counts = actions.map(action => countOccurrences(action));

        actions.forEach((action, index) => console.log(`${action}: ${counts[index]}/${counts[index]}`));

        // Save the count to local storage
        localStorage.setItem('inventoryCount', counts.reduce((a, b) => a + b, 0));
    }

    // Add the count to the text after "Inventory"
    const menuItems = await waitForElements('#menu .nav-link', 200, 50, 'menu items');
    if (menuItems) {
        // Retrieve the count from local storage
        const count = localStorage.getItem('inventoryCount');

        // Only change the text if the count is not 0
        if (count !== '0') {
            menuItems.forEach(item => {
                if (item.href.endsWith('/Inventory')) {
                    const textElement = item.querySelector('.d-none.mx-4.d-md-inline');
                    if (textElement) {
                        textElement.textContent = `Inventory - ${count}`;
                        textElement.style.fontWeight = 'bold';
                        textElement.style.color = 'white';
                    }
                }
            });
        }
    }
})();