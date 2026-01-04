// ==UserScript==
// @name         Blackout and Open Tab (prototype)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns the page black and opens a new tab with hidden visibility
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504425/Blackout%20and%20Open%20Tab%20%28prototype%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504425/Blackout%20and%20Open%20Tab%20%28prototype%29.meta.js
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
            }

            // Optionally, you can redirect to a specific URL
            // newTab.location.href = 'https://example.com';
        }, 1000); // Time for the overlay fade out
    });
})();
