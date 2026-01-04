// ==UserScript==
// @name         Mobile Character.AI Full-Screen Toggle
// @namespace    https://github.com/LuxTallis
// @version      1.0.4
// @description  Adds a full-screen toggle button with an icon to the Character.AI website for Firefox mobile users, with further adjusted position and size.
// @author       LuxTallis
// @license      MIT
// @match        https://character.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519718/Mobile%20CharacterAI%20Full-Screen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/519718/Mobile%20CharacterAI%20Full-Screen%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create the button
    const fullScreenButton = document.createElement('button');
    fullScreenButton.innerHTML = '⛶'; // Full-screen icon
    fullScreenButton.id = 'fullScreenToggle';
    fullScreenButton.style.position = 'fixed';
    fullScreenButton.style.bottom = '30px'; // Raised 20px higher
    fullScreenButton.style.right = '30px'; // Moved farther to the right
    fullScreenButton.style.zIndex = '9999';
    fullScreenButton.style.padding = '10px 20px'; // Slightly wider
    fullScreenButton.style.fontSize = '20px';
    fullScreenButton.style.border = 'none';
    fullScreenButton.style.borderRadius = '5px';
    fullScreenButton.style.backgroundColor = '#343a40'; // Dark gray color
    fullScreenButton.style.color = '#FFF';
    fullScreenButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    fullScreenButton.style.cursor = 'pointer';

    // Append button to the body
    document.body.appendChild(fullScreenButton);

    // Toggle full-screen mode
    fullScreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit full-screen mode: ${err.message}`);
            });
        }
    });
})();
