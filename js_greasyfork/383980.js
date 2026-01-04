// ==UserScript==
// @name         YouTube Speedrun Timer
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Adds quality of life features for YouTube frame timing
// @author       Michael "Msbmteam" Y.
// @match        https://*.youtube.com/*
// @match        http://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383980/YouTube%20Speedrun%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/383980/YouTube%20Speedrun%20Timer.meta.js
// ==/UserScript==

// This script is based on the "YouTube Detailed Timecode" script by Charlie Laabs (https://greasyfork.org/en/scripts/40740-youtube-detailed-timecode)

(function() {
    'use strict';

    // console.log('Running YouTube Speedrun Timer');
    var ytPlayer;
    var ytPlayerUnwrapped;
    var ytpCurrentTime;
    var timeHour = document.createElement('span');
    var timeMinute = document.createElement('span');
    var timeSecond = document.createElement('span');
    var frameCount = document.createElement('span');
    var lastDisplayedTime = 0;
    var playerInitialized = false;
    var fps;
    var frame;

    function getElements() {
        // get the YouTube player element from the page
        ytPlayer = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
        ytPlayerUnwrapped = ytPlayer.wrappedJSObject;
        if (ytPlayer)
        {
            frameCount.innerHTML = "";
            ytPlayer.addEventListener("onStateChange", playerChanged, true );
            document.addEventListener("keyup", keyUp, true );
            document.addEventListener("keydown", keyDown, true);

            setFps();
        }
    }

    function playerStarted()
    {
        var timeDisp = ytPlayerUnwrapped.getElementsByClassName("ytp-time-display")[0];

        timeHour.className = 'ytsrt-hr';
        timeHour.style.paddingLeft = "0px";
        timeMinute.className = 'ytsrt-min';
        timeMinute.style.paddingLeft = "0px";
        timeSecond.className = 'ytsrt-sec';
        timeSecond.style.paddingLeft = "0px";


        frameCount.className = 'ytsrt-frame';
        frameCount.style.paddingLeft = '20px';
        timeDisp.appendChild(frameCount);

        playerInitialized = true;

    }

    function playerChanged(state)
    {
        //console.log("stateChanged: ", state);
        if (state != -1 && !playerInitialized ) {
            playerStarted();
        }
        if (state == 2) {
            displayTime();
        }

    }

    function keyUp(e)
    {
        displayTime();
    }

    function keyDown(e)
    {
        // "D" -- advance 1 second forward
        if (e.keyCode == 68) {
            ytPlayerUnwrapped.seekTo(ytPlayerUnwrapped.getCurrentTime() + 1);
        }
        // "A" -- advance 1 second backward
        if (e.keyCode == 65) {
            ytPlayerUnwrapped.seekTo(ytPlayerUnwrapped.getCurrentTime() - 1);
        }
        // "S" -- Toggle between regular speed, slow-mo, or super slow-mo (1.0, 0.5, or 0.1)
        if (e.keyCode == 83) {
            var playback_rate = ytPlayerUnwrapped.getPlaybackRate();
            if (playback_rate == 1.0)
            {
                ytPlayerUnwrapped.setPlaybackRate(0.5);
            }
            else if (ytPlayerUnwrapped.getPlaybackRate() == 0.5)
            {
                playback_rate.setPlaybackRate(0.1);
            }
            else
            {
                playback_rate.setPlaybackRate(1.0);
            }
        }
    }

    function setFps()
    {
        // Find fps from Stats for Nerds (can get manually by right clicking on YT player)
        var resolution = ytPlayerUnwrapped.getStatsForNerds().resolution;
        fps = resolution.substr(resolution.search('@')+1, 2);
        fps = Number.parseInt(fps);
        frame = 1/fps;
    }

    function frameAdvance(keycode, dir)
    {
        var num = Number(String.fromCharCode(keycode));
        if (num === 0) num = 10;
        if (dir == -1) num *= -1;
        ytPlayerUnwrapped.seekTo(ytPlayerUnwrapped.getCurrentTime() + num * frame, true);
    }

    function displayTime()
    {
        ytpCurrentTime = document.getElementsByClassName("ytp-time-current")[0];
        var currentTime = ytPlayerUnwrapped.getCurrentTime();
        ytpCurrentTime.innerHTML = "";
        var hour = Math.floor(currentTime / 3600);
        var minute = Math.floor(currentTime / 60) - (hour * 60);
        var second = (currentTime - (hour * 3600) - (minute * 60));
        if (hour > 0)
        {
            timeHour.innerHTML = hour.toString() + ":";
            ytpCurrentTime.appendChild(timeHour);
        }
        timeMinute.innerHTML = minute.toString() + ":";
        ytpCurrentTime.appendChild(timeMinute);
        if (second < 10)
        {
            timeSecond.innerHTML = "0" + (second.toFixed(3)).toString();
        }
        else
        {
            timeSecond.innerHTML = second.toFixed(3);
        }
        ytpCurrentTime.appendChild(timeSecond);

        setFps();

        var frameNum = Math.floor(currentTime * fps);
        frameCount.innerHTML = 'Current frame: ' + frameNum + ' (' + fps + ' FPS)';
    }

    getElements(); //for embedded videos
    document.addEventListener("yt-navigate-finish", getElements, true ); //for YouTube


})();