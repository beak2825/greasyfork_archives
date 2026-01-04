// ==UserScript==
// @name         NitroChiptune
// @namespace    http://tampermonkey.net/
// @version      2025-02-24
// @description  Adds chiptune music to Nitrotype garage
// @author       c00lkat
// @match        https://www.nitrotype.com/garage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527976/NitroChiptune.user.js
// @updateURL https://update.greasyfork.org/scripts/527976/NitroChiptune.meta.js
// ==/UserScript==

(function() {
    function playSound(url) {
        var audio = new Audio(url);
        audio.loop = true; // Set to loop the audio
        audio.play();
    }

    // URL of the chiptune music
    var musicURL = "https://cdn.glitch.global/07099a28-733d-44ff-9708-a279d0b188e5/chiptune-ending-212716.mp3?v=1740430912623";

    // Play the sound when the page loads
    window.addEventListener('load', function() {
        playSound(musicURL);
    });
})();
