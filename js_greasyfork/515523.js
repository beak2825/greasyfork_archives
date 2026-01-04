// ==UserScript==
// @name         Enhanced YouTube Player with Custom Styles
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Customize YouTube player on watch page with a solid red progress bar, no gradients, and additional styling options.
// @author       GPT
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515523/Enhanced%20YouTube%20Player%20with%20Custom%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/515523/Enhanced%20YouTube%20Player%20with%20Custom%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom CSS styling to modify the YouTube player appearance
    GM_addStyle(`
        /* Remove gradients from the progress bar */
        .ytp-swatch-background-color, 
        .ytp-progress-bar-container, 
        .ytp-progress-bar-padding {
            background: transparent !important;
        }

        /* Set progress bar to solid red */
        .ytp-play-progress {
            background-color: #FF0000 !important;
            background-image: none !important;
        }

        /* Customize other player controls */
        .ytp-chrome-top, 
        .ytp-chrome-controls, 
        .ytp-gradient-bottom, 
        .ytp-gradient-top, 
        .ytp-chrome-bottom {
            background: none !important;
        }

        /* Change play button color */
        .ytp-play-button {
            background-color: rgba(255, 0, 0, 0.8) !important;
            border-radius: 4px !important;
        }

        /* Change volume slider color */
        .ytp-volume-slider {
            background-color: #FF0000 !important;
        }

        /* Style the volume level */
        .ytp-volume-bar {
            background-color: rgba(255, 0, 0, 0.5) !important;
        }

        /* Style the fullscreen button */
        .ytp-fullscreen-button {
            background-color: rgba(255, 0, 0, 0.8) !important;
        }

        /* Change hover effects */
        .ytp-button:hover {
            background-color: rgba(255, 0, 0, 1) !important;
        }

        /* Additional styles for controls */
        .ytp-button {
            border-radius: 5px !important;
        }
    `);

    // Function to toggle custom styles on and off
    const toggleCustomStyles = () => {
        const customStylesEnabled = document.body.classList.toggle('custom-youtube-styles');
        if (customStylesEnabled) {
            console.log("Custom YouTube player styles enabled.");
        } else {
            console.log("Custom YouTube player styles disabled.");
        }
    };

    // Create a button to toggle styles
    const createToggleButton = () => {
        const button = document.createElement('button');
        button.innerText = 'Toggle YouTube Styles';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#FF0000';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', toggleCustomStyles);
        document.body.appendChild(button);
    };

    // Initialize the toggle button
    createToggleButton();

    console.log("Enhanced YouTube player styling applied: solid red progress bar, no gradients, and additional custom styles.");
})();
