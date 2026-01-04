// ==UserScript==
// @name         Monkey Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Say monkey when opening a new tab
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467455/Monkey%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/467455/Monkey%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current tab is a new tab
    if (window.location.href === "about:blank") {
        // Create an audio element
        var audio = document.createElement("audio");
        // Set the source to a monkey sound
        audio.src = "https://freesound.org/data/previews/169/169731_3022696-lq.mp3";
        // Play the audio
        audio.play();
        // Display a message on the tab
        document.body.innerHTML = "<h1>Monkey!</h1>";
    }
})();