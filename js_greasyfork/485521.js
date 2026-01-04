// ==UserScript==
// @name         Torn Poker Sound
// @namespace    https://github.com/Madnn
// @version      0.0.1
// @description  Disables all the sound but your turn sound.
// @author       Madnn [3082866]
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=holdem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/485521/Torn%20Poker%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/485521/Torn%20Poker%20Sound.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the Howler library is available
if (typeof Howl !== 'undefined') {
    // Save a reference to the original play method
    const originalPlay = Howl.prototype.play;

    // Override the play method
    Howl.prototype.play = function(soundID) {
        if (this._src && this._src.includes("your_turn")) {
            // Allow playing selected sounds
            originalPlay.call(this);
        } else {
            // Prevent playing other sounds
            console.log("Sound disabled:", soundID);
        }
    };
} else {
    console.error("Howler library not found.");
}

})();