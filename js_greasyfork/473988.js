// ==UserScript==
// @name         Youtube Tracker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Counts youtube watchtime
// @author       Kaanium
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473988/Youtube%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/473988/Youtube%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function secondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        if (hours > 0) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        } else {
            return `${formattedMinutes}:${formattedSeconds}`;
        }
    }

    function secondsToMoe(seconds) {
        const minutes = Math.floor(seconds / 60);
        const fractionalMinutes = (seconds % 60) / 60;
        return (minutes + fractionalMinutes).toFixed(2);
    }

    function timeToSeconds(timeString) {
        const timeParts = timeString.split(':').map(Number);
        const totalParts = timeParts.length;

        if (totalParts === 2) {
            // Format: mm:ss
            const [minutes, seconds] = timeParts;
            if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0) {
                throw new Error('Invalid time format. Please use numeric values for minutes and seconds.');
            }
            return minutes * 60 + seconds;
        } else if (totalParts === 3) {
            // Format: hh:mm:ss
            const [hours, minutes, seconds] = timeParts;
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || minutes < 0 || seconds < 0) {
                throw new Error('Invalid time format. Please use numeric values for hours, minutes, and seconds.');
            }
            return hours * 3600 + minutes * 60 + seconds;
        } else {
            throw new Error('Invalid time format. Expected format: hh:mm:ss or mm:ss');
        }
    }

    function handleTextbox1Change() {
        timeTextbox2.value = secondsToMoe(timeToSeconds(timeTextbox1.value));
        totalWatchedTime = timeToSeconds(timeTextbox1.value);
        localStorage.setItem('totalWatchedTime', totalWatchedTime);
    }

    function createStyledButton(text, onClickHandler) {
        const button = document.createElement("button");
        button.textContent = text;
        applyCommonStyles(button);
        button.onclick = onClickHandler;
        return button;
    }

    function createStyledTextbox(type, value) {
        const textbox = document.createElement("input");
        textbox.setAttribute("type", type);
        textbox.setAttribute("value", value);
        applyCommonStyles(textbox);
        return textbox;
    }

    function applyCommonStyles(element) {
        element.style.fontSize = "10px";
        element.style.backgroundColor = "hsl(0, 0%, 7%)";
        element.style.color = "#ffffffe0";
        element.style.borderColor = "hsla(0, 0%, 53.3%, 0.4)";
        element.style.borderWidth = "1px";
        element.style.borderRadius = "40px";
        element.style.fontFamily = '"Roboto","Arial",sans-serif';
        element.style.fontSize = "1.4rem";
        element.style.lineHeight = "2rem";
        element.style.fontWeight = "500";
        element.style.textAlign = "center";
        element.style.width = "5%";
        element.style.margin = "3px"
    }

    var container = document.querySelector("#masthead > div:nth-child(5)");

    const timeTextbox1 = createStyledTextbox("text", "00:00:00");
    container.insertBefore(timeTextbox1, document.getElementById("end"));

    timeTextbox1.addEventListener("input", handleTextbox1Change);

    const timeTextbox2 = createStyledTextbox("text", "0.0");
    container.insertBefore(timeTextbox2, document.getElementById("end"));

    const newButton = createStyledButton("Clipboard", function () {
    GM_setClipboard(".log listening " + timeTextbox2.value);
    });
    container.insertBefore(newButton, document.getElementById("end"));

      const resetButton = createStyledButton("Reset", function () {
    totalWatchedTime = 0;
    bufferSum = 0;
    bufferTime = 0;
    timeTextbox1.value = "00:00:00";
    timeTextbox2.value = "0.0";
    localStorage.removeItem('totalWatchedTime');
  });
  container.insertBefore(resetButton, document.getElementById("end"));

    let startTime = new Date();
    let totalWatchedTime = parseInt(localStorage.getItem('totalWatchedTime')) || 0;
    let isVideoPlaying = true;
    let bufferTime = 0;
    let bufferSum = 0;
    let seconds = 0;
    var videoPlayer = document.querySelector("video");
    var moviePlayer = null;


    function updateTimeSpent() {
        if (isVideoPlaying && !moviePlayer.classList.contains("buffering-mode")) {
            bufferSum += bufferTime
            bufferTime = 0
            seconds = parseInt((new Date() - startTime) / 1000, 10);
            var temp = parseInt(localStorage.getItem('totalWatchedTime'))
            if (temp > totalWatchedTime + seconds - bufferSum) {
                totalWatchedTime = temp
                bufferSum = 0
                startTime = new Date()
                seconds = parseInt((new Date() - startTime) / 1000, 10);
            }
            timeTextbox2.value = secondsToMoe(totalWatchedTime + seconds - bufferSum);
            timeTextbox1.value = secondsToTime(totalWatchedTime + seconds - bufferSum);
            localStorage.setItem('totalWatchedTime', totalWatchedTime + seconds - bufferSum);
        }
        else if(moviePlayer.classList.contains("buffering-mode")) {
            bufferTime = parseInt((new Date() - startTime) / 1000, 10);
            console.log("buffer time: " + bufferTime)
        }
    }

    function saveTotalWatchedTime() {
        if (videoPlayer.src) {
            let _seconds = parseInt((new Date() - startTime) / 1000, 10);
            totalWatchedTime += _seconds;
        }
    }

    const checkForVideoPlayer = () => {
        videoPlayer = document.querySelector("video");
        moviePlayer = document.querySelector("#movie_player");
        if (videoPlayer && window.location.pathname == "/watch") {
            isVideoPlaying = true;
            videoPlayer.addEventListener("timeupdate", updateTimeSpent);
            videoPlayer.addEventListener("pause", function () {
                isVideoPlaying = false;
                console.log("pause")
                saveTotalWatchedTime();
            });
            videoPlayer.addEventListener("play", function () {
                isVideoPlaying = true;
                console.log("play")
                startTime = new Date();
            });
            videoPlayer.addEventListener("canplaythrough", function () {
                console.log("video can play through");
                startTime = new Date();
        });
        } else {
            setTimeout(checkForVideoPlayer, 1000);
        }
    };

    checkForVideoPlayer();

    document.addEventListener("yt-navigate-start", function() {
        isVideoPlaying = false;
        saveTotalWatchedTime()
    });

    window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || /^[0-9]$/.test(event.key)) {
        saveTotalWatchedTime();
        startTime = new Date();
    }
    });

    window.addEventListener('popstate', function(event) {
       totalWatchedTime = timeToSeconds(timeTextbox1.value);
       startTime = new Date();
    });

    updateTimeSpent();
})();