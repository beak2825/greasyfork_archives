// ==UserScript==
// @name         Tap to Scroll (Ignore Links)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Tap the top or bottom of the screen to scroll the page up or down, while ignoring taps on links and interactive elements.
// @author       Your Name
// @homepage     https://greasyfork.org/en/scripts/525817
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525817/Tap%20to%20Scroll%20%28Ignore%20Links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525817/Tap%20to%20Scroll%20%28Ignore%20Links%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Define the threshold for tap zones (e.g., top 20% and bottom 20% of the screen)
    const tapZoneThreshold = 0.2; // 20% of the screen height
 
    document.addEventListener('click', function(event) {
        // Check if the tap is on an interactive element (e.g., link, button, input)
        // li in freshrss
        const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL', 'AUDIO', 'VIDEO', 'LI'];
        if (interactiveElements.includes(event.target.tagName)) {
            return; // Ignore taps on interactive elements
        }
 
        const screenHeight = window.innerHeight;
        const tapY = event.clientY; // Y-coordinate of the tap
 
        // Determine if the tap is in the top or bottom zone
        if (tapY < screenHeight * tapZoneThreshold) {
            // Tap in the top zone: scroll up
            window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        } else if (tapY > screenHeight * (1 - tapZoneThreshold)) {
            // Tap in the bottom zone: scroll down
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
    });
})();
