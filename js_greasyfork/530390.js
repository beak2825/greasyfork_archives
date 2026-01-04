// ==UserScript==
// @name         Trippy Rainbow Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make the screen trippy with rainbow cycling colors and animations
// @author       Golden
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530390/Trippy%20Rainbow%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/530390/Trippy%20Rainbow%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element for trippy effects
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes rainbowBg {
            0% { background: red; }
            14% { background: orange; }
            28% { background: yellow; }
            42% { background: green; }
            57% { background: blue; }
            71% { background: indigo; }
            85% { background: violet; }
            100% { background: red; }
        }

        @keyframes hueRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }

        @keyframes pulsate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        body {
            animation: rainbowBg 10s linear infinite, hueRotate 5s linear infinite;
        }

        * {
            animation: pulsate 2s infinite alternate ease-in-out;
        }
    `;

    // Append the style to the document head
    document.head.appendChild(style);
})();
