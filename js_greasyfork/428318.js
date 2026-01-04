// ==UserScript==
// @name         twitch_change_playspeed_buttons
// @namespace    AV_TW
// @version      1.11
// @description  Changes twitch video speed. Works for vods and clips
// @include      https://www.twitch.tv/*
// @match        https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428318/twitch_change_playspeed_buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/428318/twitch_change_playspeed_buttons.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const INITIAL_PLAYBACK_RATE = 1;

    window.onload = function() {
        const videoPlayer = document.getElementsByTagName('video')[0];
        const primeBtn = document.querySelector(".top-nav__prime");

        videoPlayer.playbackRate = INITIAL_PLAYBACK_RATE;

        const decreaseSpeedBtn = document.createElement("button");
        decreaseSpeedBtn.textContent = "<";
        primeBtn.insertAdjacentElement('beforebegin', decreaseSpeedBtn);

        const increaseSpeedBtn = document.createElement("button");
        increaseSpeedBtn.textContent = ">";
        primeBtn.insertAdjacentElement('beforebegin', increaseSpeedBtn);

        const buttons = [increaseSpeedBtn, decreaseSpeedBtn];
        buttons.forEach(btn => {
            btn.style.display = "flex";
            btn.style.backgroundColor = "black";
            btn.style.border = "2px solid white";
            btn.style.borderRadius = '2px';
            btn.style.padding = "0 10px 3px 10px"
            btn.style.marginRight = '10px';
            btn.style.marginBottom = '7px';
            btn.classList.add('btnClassPlayspeed');
            btn.style.zIndex = "2000";
        })

        increaseSpeedBtn.addEventListener("click", () => {
           videoPlayer.playbackRate = INITIAL_PLAYBACK_RATE + 15;
        })

        decreaseSpeedBtn.addEventListener("click", () => {
           videoPlayer.playbackRate = INITIAL_PLAYBACK_RATE;
        })

        let windowLocation = '';
        const timerBtns = setInterval(() => {
            windowLocation = window.location.href;
            if(!windowLocation.includes('https://www.twitch.tv/videos/') && !windowLocation.includes("/clip/")) {
               buttons.forEach(btn => {
                   btn.style.display = "none";
               })
            } else {
                buttons.forEach(btn => {
                   btn.style.display = "flex";
               })
            }
        }, 3500);
    }
})();