// ==UserScript==
// @name         YouTube Playlist Autoplay Stopper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Prevents YouTube from automatically playing the next video in a playlist by using the player's own API.
// @author       the pie stealer
// @match        *://www.youtube.com/*
// @grant        none
// @license Apache 2.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546046/YouTube%20Playlist%20Autoplay%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/546046/YouTube%20Playlist%20Autoplay%20Stopper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isListenerAttached = false;

    let player;

    window.onPlayerStateChangeHook = function(state) {
        if (state === 0 && window.location.href.includes('list=')) {
            console.log('Playlist Stopper: Video ended in a playlist. Intervening.');

            setTimeout(() => {
                if (player && typeof player.pauseVideo === 'function') {
                    player.pauseVideo();
                }
            }, 50);
        }
    };

    function initializePlayerHook() {
        player = document.getElementById('movie_player');

        if (player && typeof player.addEventListener === 'function' && !isListenerAttached) {
            console.log('Playlist Stopper: Player object found. Attaching API listener.');

            player.addEventListener('onStateChange', 'onPlayerStateChangeHook');

            isListenerAttached = true;
        }
    }

    const observer = new MutationObserver(() => {
        if (!document.getElementById('movie_player')?.contains(player)) {
             isListenerAttached = false;
        }

        initializePlayerHook();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    initializePlayerHook();
})();