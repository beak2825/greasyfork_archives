// ==UserScript==
// @name         Auto Play
// @namespace    http://your-website.com
// @version      1.0
// @description  Automatically clicks the play button
// @match        https://www.radiojapan.org/j-pop-powerplay
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478259/Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/478259/Auto%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the play button element by its ID
    var playButton = document.getElementById("play_pause_button");

    // Check if the play button exists
    if (playButton) {
        // Simulate a click on the play button
        playButton.click();
    } else {
        console.log("Play button not found.");
    }
})();