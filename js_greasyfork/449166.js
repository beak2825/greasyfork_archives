// ==UserScript==
// @name         WaniKani Review Bar Rainbowizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns the review progress bar into a rainbow
// @author       Wantitled
// @match        https://www.wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449166/WaniKani%20Review%20Bar%20Rainbowizer.user.js
// @updateURL https://update.greasyfork.org/scripts/449166/WaniKani%20Review%20Bar%20Rainbowizer.meta.js
// ==/UserScript==

const animateBar = true; // Whether the bar is animated or not (true/false)
const animationSpeed = 8; // Animation duration in seconds (smaller = faster)

(function() {
    'use strict';
    let barDiv = document.getElementById("bar");
    barDiv.style.background = `linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0vw,
        rgba(255, 154, 0, 1) 10vw,
        rgba(208, 222, 33, 1) 20vw,
        rgba(79, 220, 74, 1) 30vw,
        rgba(63, 218, 216, 1) 40vw,
        rgba(47, 201, 226, 1) 50vw,
        rgba(28, 127, 238, 1) 60vw,
        rgba(95, 21, 242, 1) 70vw,
        rgba(186, 12, 248, 1) 80vw,
        rgba(251, 7, 217, 1) 90vw,
        rgba(255, 0, 0, 1) 100vw
        ) 0 0/100vw 200vw`
    if (animateBar){
        barDiv.animate([
            {backgroundPosition: "0 0"},{backgroundPosition: "100vw 0"}], {
            duration: animationSpeed * 1000,
            iterations: Infinity
        });
    }
})();