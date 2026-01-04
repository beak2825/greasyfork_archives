// ==UserScript==
// @name         Map
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  Open Map for game CatLife Online!
// @author       You
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528639/Map.user.js
// @updateURL https://update.greasyfork.org/scripts/528639/Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the animation speed
    function setAnimationSpeed() {
        try {
            Game.lastSeenLevel = Array.from({length: 1000}, (_, i) => (i + 1).toString());
        } catch (e) {
            console.error("Error setting animation speed:", e);
        }
    }

    // Run the function at regular intervals
    setInterval(setAnimationSpeed, 1000); // Adjust interval as needed (currently 1 second)
})();
