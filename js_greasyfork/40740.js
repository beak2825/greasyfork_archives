// ==UserScript==
// @name         YouTube Detailed Timecode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Displays a time in seconds to 3 decimal places when paused.
// @author       Charlie Laabs
// @match        https://*.youtube.com/*
// @match        http://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40740/YouTube%20Detailed%20Timecode.user.js
// @updateURL https://update.greasyfork.org/scripts/40740/YouTube%20Detailed%20Timecode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Running YTDT');
    var ytPlayer;
    var ytPlayerUnwrapped;
    var detailedTime = document.createElement('span');
    var playerInitialized = false;

    function getElements() {
        ytPlayer = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
        ytPlayerUnwrapped = ytPlayer.wrappedJSObject;
        if (ytPlayer)
        {
            detailedTime.innerHTML = "";
            ytPlayer.addEventListener("onStateChange", playerChanged, true );
            document.addEventListener("keyup", keyUp, true );
        }
    }

    function playerStarted()
    {
        var timeDisp = ytPlayer.getElementsByClassName("ytp-time-display")[0];
        detailedTime.className = 'us-detailed-time';
        detailedTime.style.paddingLeft = '5px';
        timeDisp.appendChild(detailedTime);
        playerInitialized = true;

    }

    function playerChanged(state)
    {
        //console.log("stateChanged: ", state);
        if (state != -1 && !playerInitialized ) {
            playerStarted();
        }
        if (state == 2) {
            detailedTime.innerHTML = '| ' + ytPlayerUnwrapped.getCurrentTime().toFixed(3);
        }

    }

    function keyUp(e)
    {
        //console.log('keyUp:', e);
        if (e.keyCode == 188 || e.keyCode == 190) {
            detailedTime.innerHTML = '| ' + ytPlayerUnwrapped.getCurrentTime().toFixed(3);
        }
    }
    getElements(); //for embedded videos
    document.addEventListener("yt-navigate-finish", getElements, true ); //for YouTube


})();