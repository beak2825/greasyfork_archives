// ==UserScript==
// @name         Change YouTube Text Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the text color of YouTube's website to a bright and vibrant color every second
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480709/Change%20YouTube%20Text%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/480709/Change%20YouTube%20Text%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random bright and vibrant color in hexadecimal format
    function getRandomColor() {
        const brightness = 50; // Adjust brightness (0 to 100)
        const hue = Math.floor(Math.random() * 360); // Random hue (0 to 359)
        return `hsl(${hue}, 100%, ${brightness}%)`;
    }

    // Function to change the text color to a random bright and vibrant color
    function changeTextColor() {
        document.querySelectorAll('*').forEach(function(element) {
            element.style.color = getRandomColor();
        });
    }

    // Set interval to change the text color every second
    setInterval(changeTextColor, 1000);
})();
