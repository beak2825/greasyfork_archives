// ==UserScript==
// @name         Hide Teammates Guess
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides teammate guess markers during Team Duels in GeoGuessr
// @author       BrainyGPT
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538512/Hide%20Teammates%20Guess.user.js
// @updateURL https://update.greasyfork.org/scripts/538512/Hide%20Teammates%20Guess.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to hide teammate markers
    function hideTeammateMarkers() {
        const markers = document.querySelectorAll('.duels-guess-map_otherTeamMemberGuessPin__glsP0');
        markers.forEach(marker => {
            marker.style.display = 'none';
        });
    }

    // Observe the page for changes (teammates guessing after you, or round starts)
    const observer = new MutationObserver(() => {
        hideTeammateMarkers();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run it once immediately
    hideTeammateMarkers();
})();
