// ==UserScript==
// @name         Use shortcut to open your github
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Use shortcut open your github
// @author       You
// @include     https://github.com/
// @match       https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464444/Use%20shortcut%20to%20open%20your%20github.user.js
// @updateURL https://update.greasyfork.org/scripts/464444/Use%20shortcut%20to%20open%20your%20github.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let commaCount = 0; // We can move the counter outside of the event listener
    let timer = null
    document.addEventListener('keydown', function(event) {
        const href = `https://github1s.com${location.pathname}`;
        if (timer) clearTimeout(timer)
        // We can check if the key pressed is the comma key (key code 188)
        if (event.code === 'Semicolon' && event.key === ';') {
            // We can increment the counter each time the comma key is pressed
            commaCount++;
            // If the comma key has been pressed twice, we can open a link
            if (commaCount === 2) {
                window.open(href);
                // We can reset the counter after the link is opened
                commaCount = 0;
            }
        } else {
            // We can reset the counter if any other key is pressed
            commaCount = 0;
        }

        timer = setTimeout(() => { commaCount = 0 }, 1e3)
    });
})();