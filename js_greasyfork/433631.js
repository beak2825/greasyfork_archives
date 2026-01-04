// ==UserScript==
// @name         RTHK Player Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTHK Player Controls: back / forward / change volume / play / pause
// @author       wishrivers
// @match        https://programme.rthk.hk/channel/radio/*
// @icon         https://www.google.com/s2/favicons?domain=rthk.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433631/RTHK%20Player%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/433631/RTHK%20Player%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key Listener
    document.onkeydown = function(e){
        console.log(e.keyCode);
        switch(e.keyCode) {
            case 37: //Left Key: back 30s
                seek(-30);
                break;
            case 39: //Right Key: forward 30s
                seek(30);
                break;
            case 38: //Up Key: +10 volume
                setVolume(10);
                break;
            case 40: //Down Key: +10 volume
                setVolume(-10);
                break;
            case 32: //Space Key: play/pause
                togglePlay();
                break;
        }
    };

    // Run when page fully loaded
    setTimeout(function(){
        seekPlay();
    }, 500); // after 0.5s

})();


function seekPlay() {
    // console.log("seekPlay()");
    var rthkPlayer = jwplayer('player');

    // programme name
    var programme = document.getElementById("programmeText").value;

    if (programme === "第一台 那些年 張偉基") {
        // skip news 
        rthkPlayer.seek(215);
    }

}

function togglePlay() {
    var rthkPlayer = jwplayer('player');
    rthkPlayer.getState() === "playing" ? rthkPlayer.pause() : rthkPlayer.play()
}

function seek(delta) {
    var rthkPlayer = jwplayer('player');
    var seekSec = rthkPlayer.getPosition() + delta;

    var totalTime = rthkPlayer.getDuration();
    if (seekSec > totalTime) {
        seekSec = totalTime;
    }
    if (seekSec < 0) {
        seekSec = 0;
    }
    rthkPlayer.seek(seekSec);
}

function setVolume(vol) {
    var rthkPlayer = jwplayer('player');
    var currentVol = rthkPlayer.getVolume();

    currentVol +=vol;
    if (currentVol >=100) {
        currentVol = 100;
    }
    if (currentVol <=0) {
        currentVol = 0;
    }

    rthkPlayer.setVolume(currentVol);
}
