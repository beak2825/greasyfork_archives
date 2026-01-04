// ==UserScript==
// @name         Rainbow Everything
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes everything on the website rainbow-colored
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517951/Rainbow%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/517951/Rainbow%20Everything.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to generate a rainbow color based on an angle
    function rainbowColor(angle) {
        const r = Math.round(127 * Math.sin(0.1 * angle + 0) + 128);
        const g = Math.round(127 * Math.sin(0.1 * angle + 2) + 128);
        const b = Math.round(127 * Math.sin(0.1 * angle + 4) + 128);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Apply rainbow effect
    function applyRainbowEffect() {
        let angle = 0;

        setInterval(() => {
            angle += 10;

            // Change text color
            document.querySelectorAll('*').forEach((el) => {
                el.style.color = rainbowColor(angle);
                el.style.backgroundColor = rainbowColor(angle + 120); // Offset for contrast
                el.style.borderColor = rainbowColor(angle + 240); // Offset for more variety
            });

            // Change body background
            document.body.style.backgroundColor = rainbowColor(angle);
        }, 100);
    }

    // Ensure the script runs after the page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyRainbowEffect);
    } else {
        applyRainbowEffect();
    }
})();
