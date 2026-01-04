// ==UserScript==
// @name         Skroutz.gr Follow Function
// @namespace    https://www.skroutz.gr/u/poutsa
// @version      1.0
// @description  Automatically clicks on follow buttons on skroutz.gr, use the follow() function in the console
// @author       Pennoulakos
// @match        https://www.skroutz.gr/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480625/Skroutzgr%20Follow%20Function.user.js
// @updateURL https://update.greasyfork.org/scripts/480625/Skroutzgr%20Follow%20Function.meta.js
// ==/UserScript==

function follow(maxButtons, batchNumber, delay, useShuffle) {
    const buttons = document.querySelectorAll('button.follow-button');

    // Filter buttons with data-action="unfollow"
    const filteredButtons = Array.from(buttons).filter((button) => {
        return button.getAttribute('data-action') !== 'unfollow';
    });

    // Apply shuffle if enabled
    const shuffledButtons = useShuffle ? shuffle(filteredButtons) : filteredButtons;

    // Determine the number of buttons to click
    const buttonsToClick = Math.min(maxButtons, shuffledButtons.length);

    for (let i = 0; i < buttonsToClick; i++) {
        const button = shuffledButtons[i];

        // Extract the ID from the button's class
        const classList = button.classList;
        const idRegex = /js-follow-(.+?)-button/;
        const idMatch = Array.from(classList).find((className) => idRegex.test(className));
        if (idMatch) {
            const id = idMatch.match(idRegex)[1];
            // Click the button
            const currentBatch = Math.floor(i / batchNumber);
            const currentDelay = delay + (currentBatch * delay);
            setTimeout(() => {
                button.click();
                console.log(`Clicked button with ID: ${id}`);
            }, currentDelay);
        }
    }
}

// Expose the follow() function to the console
window.follow = follow;

// Utility function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}