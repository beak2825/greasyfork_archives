// ==UserScript==
// @name         GeoGuessr UI Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @author       YourName
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525251/GeoGuessr%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/525251/GeoGuessr%20UI%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements by selector
    function removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }

    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        removeElement('.slanted-wrapper_root__XmLse');  // Slanted wrapper element
        removeElement('button[data-qa="pano-zoom-in"]');  // Zoom in button
        removeElement('button[data-qa="pano-zoom-out"]');  // Zoom out button
        removeElement('button[data-qa="in-game-settings-button"]');  // Settings button
        removeElement('.friend-chat-in-game-button_root__ezPKt');  // Friend chat button
        removeElement('.game_inGameLogos__T9d3L');  // In-game logos
    });

    // Start observing the body for added nodes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

