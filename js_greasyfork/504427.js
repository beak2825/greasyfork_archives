// ==UserScript==
// @name         Blackout and Open Tab
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Turns the page black, opens a new tab with hidden visibility, and makes it visible again after 3 seconds
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504427/Blackout%20and%20Open%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/504427/Blackout%20and%20Open%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style a blackout overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '10000';
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity 1s';
    document.body.appendChild(overlay);

    // Create a button
    const button = document.createElement('button');
    button.textContent = 'Click for a Variety of Tampermonkey Scripts';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '10001';
    document.body.appendChild(button);

    // Button click handler
    button.addEventListener('click', () => {
        overlay.style.opacity = '0';

        // Wait for overlay to disappear
        setTimeout(() => {
            // Open a new tab
            const newTab = window.open('', '_blank');

            // Hide new tab's visibility by setting styles
            if (newTab) {
                newTab.document.write('<style>body{display:none;}</style>');
                newTab.document.close();

                // Make the new tab visible again after 3 seconds
                setTimeout(() => {
                    newTab.document.body.style.display = 'block';
                }, 3000); // Time to wait before making the tab visible again
            }
        }, 1000); // Time for the overlay fade out
    });
})();
