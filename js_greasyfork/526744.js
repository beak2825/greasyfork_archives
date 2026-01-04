// ==UserScript==
// @name         YouTube Redirect to Rick Roll or Skibidi Toilet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects YouTube to Rick Roll or Skibidi Toilet if no key is pressed when YouTube opens.
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526744/YouTube%20Redirect%20to%20Rick%20Roll%20or%20Skibidi%20Toilet.user.js
// @updateURL https://update.greasyfork.org/scripts/526744/YouTube%20Redirect%20to%20Rick%20Roll%20or%20Skibidi%20Toilet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keyPressed = false;

    // Detect if any key is pressed
    window.addEventListener('keydown', () => {
        keyPressed = true;
    });

    // Redirect logic
    window.addEventListener('load', () => {
        if (!keyPressed) {
            const redirects = [
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll
                "https://www.youtube.com/watch?v=jysTQyDbD0A"  // Skibidi Toilet
            ];

            // Choose a random redirect
            const randomRedirect = redirects[Math.floor(Math.random() * redirects.length)];
            window.location.href = randomRedirect;
        }
    });
})();
