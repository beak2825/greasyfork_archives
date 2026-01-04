// ==UserScript==
// @name         YouTube Music Miniplayer COPPA Unblocker (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Force-enable YouTube Music Miniplayer on COPPA-flagged videos (children content).
// @author       OMS UI
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511408/YouTube%20Music%20Miniplayer%20COPPA%20Unblocker%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511408/YouTube%20Music%20Miniplayer%20COPPA%20Unblocker%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMiniplayerBlock() {
        var blockMessage = document.querySelector("#player[disabled]"); 
        if (blockMessage) {
            blockMessage.removeAttribute("disabled"); 
            console.log("Miniplayer block removed.");
        }
    }

    // Wymusza wznowienie odtwarzania
    function resumePlayback() {
        var videoElement = document.querySelector("video"); 
        if (videoElement && videoElement.paused) {
            videoElement.play(); 
            console.log("Resumed playback.");
        }
    }

    function forcePlay() {
        var playButton = document.querySelector(".play-button"); 
        if (playButton) {
            playButton.click(); 
            console.log("Force-clicked Play button.");
        }
    }

    function mainFunction() {
        setInterval(function() {
            var videoElement = document.querySelector("video");

            if (videoElement) {
                removeMiniplayerBlock(); 
                resumePlayback();       
                forcePlay();            
            } else {
                console.log("No video element found yet.");
            }
        }, 1000); 
    }

    mainFunction();
})();
