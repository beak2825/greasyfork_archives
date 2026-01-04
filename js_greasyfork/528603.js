// ==UserScript==
// @name        Admute
// @namespace   https://greasyfork.org/en/users/1441726-d155
// @match       *://*spotify.com/*
// @grant       none
// @version     2.0
// @author      d155
// @description Mute/unmute based on ad presence.
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528603/Admute.user.js
// @updateURL https://update.greasyfork.org/scripts/528603/Admute.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let muteButton = null;
    let adDetected = false;

    function findMuteButton() {
        const button = document.querySelector('[data-testid="volume-bar-toggle-mute-button"]');
        if (button) {
            muteButton = button;
        }
    }

    function isAd() {
        return document.querySelector('[aria-label="Advertisement"]') !== null;
    }

    function update() {
        if (!muteButton || !document.body.contains(muteButton)) {
            findMuteButton();
        }

        const adIsPlaying = isAd();

        if (adIsPlaying && !adDetected) {
            adDetected = true;
            if (muteButton) muteButton.click();
        }

        if (!adIsPlaying && adDetected) {
            adDetected = false;
            if (muteButton) muteButton.click();
        }
    }

    setInterval(update, 500);
})();
