// ==UserScript==
// @name         Nahj al Wadih 2nd Radio Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Listen to Nahj al Wadih 2nd Radio with play, pause, mute, and stop functionality.
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/527682/Nahj%20al%20Wadih%202nd%20Radio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/527682/Nahj%20al%20Wadih%202nd%20Radio%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the audio element
    const audio = new Audio('https://node33.obviousapproach.com:9001/stream');
    audio.autoplay = false;

    // Function to play or pause the audio
    function playPause() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    // Function to mute or unmute the audio
    function muteUnmute() {
        audio.muted = !audio.muted;
    }

    // Function to stop the audio
    function stopAudio() {
        audio.pause();
        audio.currentTime = 0;
    }

    // Register menu commands
    GM_registerMenuCommand('Play/Pause Radio', playPause, 'P');
    GM_registerMenuCommand('Mute/Unmute Radio', muteUnmute, 'M');
    GM_registerMenuCommand('Stop Radio', stopAudio, 'S');

})();
