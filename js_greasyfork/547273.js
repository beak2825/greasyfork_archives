// ==UserScript==
// @name         Spotify Shuffle & Repeat Fix
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  If Shuffle and Repeat are enabled on Spotify, automatically enable them when the song or playlist is changed.
// @author       Erffy
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547273/Spotify%20Shuffle%20%20Repeat%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547273/Spotify%20Shuffle%20%20Repeat%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enableButtons = () => {
        const shuffleButton = document.querySelector('[data-testid="control-button-shuffle"]');
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]');

        if (shuffleButton && shuffleButton.getAttribute('aria-checked') === 'false') {
            shuffleButton.click();
            console.log('[Spotify Auto] Shuffle enabled');
        }

        if (repeatButton && repeatButton.getAttribute('aria-checked') === 'false') {
            repeatButton.click();
            console.log('[Spotify Auto] Repeat enabled');
        }
    };

    const observeChanges = () => {
        const player = document.querySelector('.Root__now-playing-bar');
        const playlistArea = document.querySelector('[data-testid="tracklist-row"]');

        if (!player) {
            setTimeout(observeChanges, 1000);
            return;
        }

        let lastTrack = '';

        const checkTrackChange = () => {
            const trackNameElement = document.querySelector('[data-testid="now-playing-widget"] [data-testid="track-name"]');
            if (trackNameElement) {
                const currentTrack = trackNameElement.textContent.trim();
                if (currentTrack !== lastTrack) {
                    lastTrack = currentTrack;
                    enableButtons();
                }
            }
        };

        const observer = new MutationObserver(checkTrackChange);

        observer.observe(player, { childList: true, subtree: true });
        if (playlistArea) observer.observe(playlistArea, { childList: true, subtree: true });

        enableButtons();
    };

    observeChanges();
})();