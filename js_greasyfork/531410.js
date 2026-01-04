// ==UserScript==
// @name         RGB Everything
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Make everything on a webpage RGB animated!
// @author       TiemBrent
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531410/RGB%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/531410/RGB%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hue = 0;
    function updateColors() {
        hue = (hue + 5) % 360; // Faster animation
        const color = `hsl(${hue}, 100%, 50%)`;
        const invertedColor = `hsl(${(hue + 180) % 360}, 100%, 50%)`; // Inverted RGB for text
        document.querySelectorAll('*').forEach(el => {
            el.style.backgroundColor = color;
            el.style.color = invertedColor;
            el.style.textShadow = `0 0 5px ${invertedColor}, 0 0 10px ${invertedColor}`;
            el.style.boxShadow = `0 0 10px ${color}`;
        });
    }
    setInterval(updateColors, 30); // Faster color changes
})();
