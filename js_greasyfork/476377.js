// ==UserScript==
// @name         Blooket Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  Dark mode for Blooket (yay xander is no longer metalic)
// @author       generic
// @match        https://*.blooket.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476377/Blooket%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/476377/Blooket%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change colors of non-text elements (excluding images)
    function changeColors() {
        const elements = document.querySelectorAll('*:not(img):not(svg):not(path):not(script):not(style):not([data-original-color])');

        elements.forEach(element => {
            const computedStyle = getComputedStyle(element);
            const backgroundColor = computedStyle.backgroundColor;
            const textColor = computedStyle.color;

            if (backgroundColor) {
                // Calculate luminance for background color
                const bgLuminance = calculateLuminance(backgroundColor);
                if (bgLuminance > calculateLuminance('rgb(195, 195, 195)')) {
                    element.style.backgroundColor = '#161616';
                    // Store the original background color to prevent repeated changes
                    element.setAttribute('data-original-color', backgroundColor);
                }
            }

            if (textColor) {
                // Change text color to white
                element.style.color = '#fcfcfc';
            }
        });
    }

    // Function to calculate luminance from RGB values
    function calculateLuminance(rgb) {
        const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (parts) {
            const r = parseInt(parts[1]) / 255;
            const g = parseInt(parts[2]) / 255;
            const b = parseInt(parts[3]) / 255;
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
        return 0;
    }

    // Function to periodically check and change colors
    function periodicallyCheckColors() {
        setInterval(changeColors, 1); // Check every 0.00001 seconds (10 milliseconds)
    }

    // Function to apply color change when navigating within the site
    function applyColorChangeOnNavigation() {
        const observer = new MutationObserver(changeColors);
        const config = { childList: true, subtree: true };

        observer.observe(document.body, config);
    }

    // Run the color-changing function when the page loads
    window.addEventListener('load', () => {
        changeColors();
        applyColorChangeOnNavigation();
        periodicallyCheckColors();
    });
})();
