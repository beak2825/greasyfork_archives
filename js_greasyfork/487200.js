// ==UserScript==
// @name         Seterra Bot
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  simple hack for seterra: clicks on the correct country/location with customizable click speed.
// @author       azzlam's, script was used to help create this, GooseisGoose.
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @update       https://update.greasyfork.org/scripts/487200/Seterra%20Bot.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487200/Seterra%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/487200/Seterra%20Bot.meta.js
// ==/UserScript==

// Prompt the user for the click speed
const speedOptions = {
    "fastest": 0.002,
    "extreme": 2,
    "fast": 45,
    "quick": 100,
    "medium": 400,
    "slow": 800,
    "extremely slow": 1000
};

const speedInput = prompt("Enter the click speed (fastest (may not work due to network speed), extreme, fast, quick, medium, slow, extremely slow):");
const interval = speedOptions[speedInput.toLowerCase()];

if (!interval) {
    alert("Invalid input. Please enter a valid speed option.");
    throw new Error("Invalid input.");
}

// Start clicking on elements at the specified interval
setInterval(() => {
    const gameHeader = document.querySelector("#__next [class^='seterra'] [class^='seterra_content'] [class^='seterra_main'] [class^='game-container'] [class^='game-container'] [class^='game-page_gameAreaWrapper'] [class^='game-area_gameWrapper'] [class^='game-header_wrapper']");
    if (gameHeader) {
        const currentQuestionId = gameHeader.getAttribute('data-current-question-id').replace(/ /g, "_");
        const correct = document.querySelector("#".concat(currentQuestionId));
        if (correct) {
            // Create and dispatch a mouse click event on the correct element
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            correct.dispatchEvent(clickEvent);
        } else {
            console.log("Current question ID not found");
        }
    } else {
        console.log("Game element not found");
    }
}, interval);
