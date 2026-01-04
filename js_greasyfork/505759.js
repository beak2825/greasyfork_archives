// ==UserScript==
// @name         Universal Time clock (All timezones)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display the current time with a bigger and modern style. I made this cause i'm blind so i cant see the small time lol
// @author       Emree.el on instagram, y'all
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505759/Universal%20Time%20clock%20%28All%20timezones%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505759/Universal%20Time%20clock%20%28All%20timezones%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the time display element
    const timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'fixed';
    timeDisplay.style.bottom = '20px';
    timeDisplay.style.right = '20px';
    timeDisplay.style.fontSize = '3em';
    timeDisplay.style.color = 'white';
    timeDisplay.style.padding = '15px 20px';
    timeDisplay.style.backgroundColor = '#171717';
    timeDisplay.style.borderRadius = '15px';  // Rounded corners
    timeDisplay.style.fontWeight = 'bold';  // Bold font
    timeDisplay.style.fontFamily = 'Arial, sans-serif';  // Modern font
    timeDisplay.style.boxShadow = '0 0 15px 5px rgba(128, 0, 128, 0.75)';  // Glowing purple outline
    timeDisplay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';  // Smooth animation
    timeDisplay.style.opacity = '0';
    timeDisplay.style.transform = 'scale(0.95)';  // Slight shrink on hide
    document.body.appendChild(timeDisplay);

    // Create the toggle checkbox
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.style.position = 'fixed';
    toggleCheckbox.style.bottom = '20px';
    toggleCheckbox.style.right = '20px';
    toggleCheckbox.style.margin = '10px';
    toggleCheckbox.style.display = 'block';
    toggleCheckbox.style.accentColor = '#171717';  // Dark checkbox
    document.body.appendChild(toggleCheckbox);

    // Function to update the displayed time
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Function to toggle the time display with animation
    function toggleDisplay() {
        if (toggleCheckbox.checked) {
            timeDisplay.style.display = 'block';
            timeDisplay.style.opacity = '1';
            timeDisplay.style.transform = 'scale(1)';  // Full size on show
        } else {
            timeDisplay.style.opacity = '0';
            timeDisplay.style.transform = 'scale(0.95)';  // Slight shrink on hide
            setTimeout(() => {
                if (!toggleCheckbox.checked) {
                    timeDisplay.style.display = 'none';
                }
            }, 500);  // Wait for animation to finish before hiding
        }
    }

    // Update time every second
    setInterval(updateTime, 1000);
    toggleCheckbox.addEventListener('change', toggleDisplay);
})();
