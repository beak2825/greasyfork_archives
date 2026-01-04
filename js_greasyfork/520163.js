// ==UserScript==
// @name         |Force Delete Top Experiences| - [Romonitor Stats Glitch]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Top Experiences Glitch by Rominotor Stats FIXED
// @author       Emree.el
// @match        https://www.roblox.com/home
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520163/%7CForce%20Delete%20Top%20Experiences%7C%20-%20%5BRomonitor%20Stats%20Glitch%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/520163/%7CForce%20Delete%20Top%20Experiences%7C%20-%20%5BRomonitor%20Stats%20Glitch%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSelector = '.game-carousel'; // Selector for the element to remove

    function deleteElement() {
        const elements = document.querySelectorAll(targetSelector);
        elements.forEach(element => {
            element.remove(); // Remove the element
            console.log(`Removed element: ${element}`);
        });
    }

    // Initial deletion
    deleteElement();

    // MutationObserver to monitor for new additions to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            deleteElement(); // Check and delete again if it reappears
        });
    });

    observer.observe(document.body, {
        childList: true, // Watch for changes in child nodes
        subtree: true    // Watch entire subtree
    });

    console.log("Script initialized: Force delete active.");
})();
