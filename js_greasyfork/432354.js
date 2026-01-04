// ==UserScript==
// @name         Radio.net space for toggle play/pause
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.4
// @description  Makes it so spacebar toggles pause/play instead of scrolling down the page.
// @author       Alistair1231
// @match        https://www.radio.net/s/*
// @icon         https://icons.duckduckgo.com/ip2/radio.net.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432354/Radionet%20space%20for%20toggle%20playpause.user.js
// @updateURL https://update.greasyfork.org/scripts/432354/Radionet%20space%20for%20toggle%20playpause.meta.js
// ==/UserScript==

(function() {
    'use strict';

function togglePlayingState(e){
    if(e.keyCode==32){
        e.preventDefault();
        let playButton = document.querySelector(".player__button.player__button--stopped.icon-play-circle")
        let stopButton = document.querySelector(".player__button.player__button--playing.icon-play-circle")

        let currentlyPlaying= playButton.style["display"]=='none' // play button hidden

        if(currentlyPlaying){
            console.log("stop")
            stopButton.click()
        }
        else{
            console.log("start")
            playButton.click()
        }
    }
}

document.addEventListener('keydown', togglePlayingState, false);


})();