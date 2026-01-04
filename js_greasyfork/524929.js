// ==UserScript==
// @name         Erev - Feed All Pets
// @namespace    http://www.erevollution.com/
// @version      0.0.4
// @description  One button to feed all pets once.
// @author       SkyIsTheLimit (modified for dynamic pages)
// @match        https://www.erevollution.com/*/pets
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erevollution.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524929/Erev%20-%20Feed%20All%20Pets.user.js
// @updateURL https://update.greasyfork.org/scripts/524929/Erev%20-%20Feed%20All%20Pets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // A unique key for localStorage to track the feeding queue
    const FEED_ALL_KEY = 'feed-all-pets-queue';

    /**
     * This is the main loop that checks what to do.
     * 1. It dismisses confirmation popups.
     * 2. It processes the next pet in the queue from localStorage.
     */
    function mainLoop(btnElem) {
        // Priority 1: Check for and dismiss any confirmation popups (modals).
        // The script looks for a visible confirmation button and clicks it.
        const okButton = document.querySelector('button.swal2-confirm.styled');
        if (okButton && okButton.offsetParent !== null) { // .offsetParent is a reliable way to check for visibility
            okButton.click();
            return; // Exit and let the next interval handle the next pet
        }

        // Priority 2: Check if there's a feeding task in the localStorage queue.
        const ls = localStorage.getItem(FEED_ALL_KEY);
        if (ls === null) {
            // No task is active. Ensure the main button is enabled and do nothing else.
            if (btnElem.classList.contains('disabled')) {
                btnElem.className = 'buttonT';
            }
            return;
        }

        // A task is active, so ensure the main button remains disabled.
        btnElem.className = 'buttonT disabled';
        let index = parseInt(ls, 10);

        if (index > 0) {
            // Find the button for the pet corresponding to the current index.
            const feedButton = document.querySelector(`#panel-1 > div > table > tbody > tr:nth-child(${index}) > td:nth-child(3) > span:nth-child(4) > form > button`);

            if (feedButton) {
                // IMPORTANT: Set the index for the *next* pet before clicking.
                // This prevents an error if the page updates slowly.
                localStorage.setItem(FEED_ALL_KEY, (index - 1).toString());
                feedButton.click();
            } else {
                // If the button can't be found, something is wrong.
                // To prevent getting stuck, clear the task.
                localStorage.removeItem(FEED_ALL_KEY);
            }
        } else { // index is 0, meaning the last pet was just processed.
            // Task complete! Clear the key from localStorage. The loop will re-enable the button.
            localStorage.removeItem(FEED_ALL_KEY);
        }
    }

    // Wait for the page to be fully loaded before setting anything up.
    window.addEventListener('load', function() {
        // --- Create and append the 'Feed All' button ---
        let btnContent = document.createElement('div');
        btnContent.className = 'content';
        btnContent.textContent = 'Feed All';

        let btnElem = document.createElement('button');
        btnElem.className = 'buttonT';
        btnElem.id = 'feed-all-btn';
        btnElem.style = 'margin-left: 10px';
        btnElem.appendChild(btnContent);

        let mpd = document.querySelector('#content-wrapper > div > div > div > div > div.vsPanel-heading > div.vsPanel-title');
        if (mpd) {
            mpd.appendChild(btnElem);
        } else {
            console.error("Feed All Pets Script: Could not find the target panel to add the button.");
            return; // Stop if the page layout isn't recognized
        }

        // --- Handle the initial click on the 'Feed All' button ---
        btnElem.onclick = function () {
            // Find all available "Feed" buttons at the moment of clicking.
            const feedBtns = document.querySelectorAll('#panel-1 > div > table > tbody > tr > td:nth-child(3) > span:nth-child(4) > form > button');
            const totalPetsToFeed = feedBtns.length;

            if (totalPetsToFeed > 0) {
                // Disable the button and start the process by setting the initial count in localStorage.
                // The mainLoop will see this and start clicking.
                this.className = 'buttonT disabled';
                localStorage.setItem(FEED_ALL_KEY, totalPetsToFeed.toString());
            }
        };

        // --- Start the main processing loop ---
        // This loop runs continuously, checking for tasks every 750 milliseconds.
        setInterval(() => mainLoop(btnElem), 750);
    });

})();