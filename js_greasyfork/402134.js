// ==UserScript==
// @name         Google Push to Talk
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hold down the spacebar to unmute the mic in Google Meet; tapping the spacebar toggles mute.
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402134/Google%20Push%20to%20Talk.user.js
// @updateURL https://update.greasyfork.org/scripts/402134/Google%20Push%20to%20Talk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window._getGoogleMeetMuteEl = function() {
        if(window._googleMeetMuteEl === undefined) {
            window._googleMeetMuteEl = document.querySelector('div[role=\"button\"][data-tooltip*=\"microphone\"]');
        }
        return window._googleMeetMuteEl;
    };

    window._clickMute = function() {
        window._getGoogleMeetMuteEl().click();
    };

    window._isMuted = function() {
        return window._getGoogleMeetMuteEl().attributes["data-tooltip"].value.match(/turn on microphone/i) !== null;
    };

    document.body.onkeyup = function(e) {
        if(e.keyCode == 32){
            e.stopPropagation();
            e.preventDefault();
            window._clickMute();
            window._meetupSpaceDown = false;
        }
    };

    document.body.onkeydown = function(e) {
        if(e.keyCode == 32 && window._meetupSpaceDown !== true){
            e.stopPropagation();
            e.preventDefault();
            if(window._isMuted()) {
                window._clickMute();
            }
            window._meetupSpaceDown = true;
        }
    };
})();