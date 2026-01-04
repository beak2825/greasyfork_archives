// ==UserScript==
// @name         Showtime: enable YouTube-style keyboard controls
// @namespace    showtime.keyboard
// @version      0.4
// @description  Use similar controls as on YouTube when watching Showtime (`f` for full screen, `k` to play/pause, `c` for captions, `m` to mute/unmute, `p` to enable/disable PiP, `j`/`l` to go back/skip 10 seconds, left/right arrows for 5 seconds, `0`..`9` for 0% .. 90%)
// @match        https://showtime.com/*
// @match        https://www.showtime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420364/Showtime%3A%20enable%20YouTube-style%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/420364/Showtime%3A%20enable%20YouTube-style%20keyboard%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // change these constants if you prefer to use a different key
    // (or change the letter to uppercase if you want the shortcut to require the use of Shift)
    const FULL_SCREEN_KEY = 'f';
    const PLAY_PAUSE_KEY = 'k';
    const FORWARDS_TEN_SECONDS_KEY = 'l';
    const BACKWARDS_TEN_SECONDS_KEY = 'j';
    const FORWARDS_FIVE_SECONDS_KEY = 'ArrowRight';
    const BACKWARDS_FIVE_SECONDS_KEY = 'ArrowLeft';
    const CLOSED_CAPTIONS_KEY = 'c';
    const MUTE_UNMUTE_KEY = 'm';
    const PICTURE_IN_PICTURE_KEY = 'p';
    const NUMBER_KEYS_ENABLED = true; // 0 for 0%, 1 for 10%… up to 9 for 90%
    const CODE_ZERO = 48; // keycode for character '0'

    function clickButton(className) {
        const buttons = document.querySelectorAll('button.' + className);
        if (buttons && buttons.length == 1) {
            buttons[0].click();
        } else {
            console.error('Button not found!');
        }
    }

    function isPlaying(videoElement) {
        return !!(videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);
    }

    addEventListener("keydown", function(e) {
        if (e.ctrlKey || e.altKey) { // return early if any modifier key like Control or Alt is part of the key press
            return;
        }
        const videos = document.getElementsByTagName('video');
        const video = videos && videos.length == 1 ? videos[0] : null;

        if (e.key == FULL_SCREEN_KEY) {
            clickButton(window.innerHeight == screen.height ? 'exit-fullscreen' : 'enter-fullscreen');
        } else if (e.key == PLAY_PAUSE_KEY) {
            clickButton(video && isPlaying(video) ? 'pause' : 'play');
        } else if (e.key == MUTE_UNMUTE_KEY) {
            clickButton('volume');
        } else if (e.key == PICTURE_IN_PICTURE_KEY) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                video && video.requestPictureInPicture();
            }
        } else if (e.key == FORWARDS_TEN_SECONDS_KEY && video) {
            video.currentTime += 10;
        } else if (e.key == BACKWARDS_TEN_SECONDS_KEY && video) {
            video.currentTime -= 10;
        } else if (e.key == FORWARDS_FIVE_SECONDS_KEY && video) {
            video.currentTime += 5;
        } else if (e.key == BACKWARDS_FIVE_SECONDS_KEY && video) {
            video.currentTime -= 5;
        } else if (NUMBER_KEYS_ENABLED && e.keyCode >= CODE_ZERO && e.keyCode <= CODE_ZERO + 9) {
            video.currentTime = (e.keyCode - CODE_ZERO) * (video.duration / 10.0);
        } else if (e.key == CLOSED_CAPTIONS_KEY) {
            const ccContainer = document.querySelectorAll('div.player-closed-captioning-container > div');
            if (ccContainer && ccContainer.length == 1) {
                clickButton(ccContainer[0].classList.contains('closed-captioning-enabled') ? 'closed-captioning-disable' : 'closed-captioning-enable');
            } else {
                console.error('No CC container found');
            }
        }
    });
})();