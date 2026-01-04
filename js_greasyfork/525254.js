// ==UserScript==
// @name         Hide Map Element on M Key Press
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the map element in GeoGuessr using M
// @author       Your Name
// @match        *://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525254/Hide%20Map%20Element%20on%20M%20Key%20Press.user.js
// @updateURL https://update.greasyfork.org/scripts/525254/Hide%20Map%20Element%20on%20M%20Key%20Press.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isHidden = false;

    // Function to toggle the visibility of the element
    function toggleMapVisibility() {
        const mapElement = document.querySelector('.game_guessMap__8jK3B');
        if (mapElement) {
            if (isHidden) {
                mapElement.style.display = '';
            } else {
                mapElement.style.display = 'none';
            }
            isHidden = !isHidden;
        }
    }

    // Add event listener for the M key to toggle visibility
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'm') {
            toggleMapVisibility();
        }
    });

})();
