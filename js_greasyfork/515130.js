// ==UserScript==
// @name         YouTube Music WebSocket Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  11
// @match        *://music.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515130/YouTube%20Music%20WebSocket%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/515130/YouTube%20Music%20WebSocket%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let socket;

    function connectWebSocket() {
        if (socket && socket.readyState !== WebSocket.CLOSED) {
            console.log("WebSocket is already connecting or open.");
            return;
        }
        socket = new WebSocket("ws://localhost:5000/trackInfo");

        socket.addEventListener('open', function(event) {
            console.log("WebSocket connection established.");
        });

        socket.addEventListener('close', function(event) {
            console.log("WebSocket connection closed. Retrying in 5 seconds...");
            setTimeout(connectWebSocket, 5000);
        });

        socket.addEventListener('error', function(event) {
            console.log("WebSocket error. Closing socket...");
            socket.close();
        });
    }

    connectWebSocket();

    function sendTrackInfo() {
        let trackTitle = document.querySelector('.title.style-scope.ytmusic-player-bar').innerText;
        let artistName = document.querySelector('.byline.style-scope.ytmusic-player-bar').innerText;
        let buttonTitle = document.querySelector('.play-pause-button').title;
        let coverImage = document.querySelector('.thumbnail-image-wrapper .image').src;
        let videoId = '';

        const linkElement = document.querySelector('a.ytp-title-link.yt-uix-sessionlink');
        if (linkElement) {
            const url = new URL(linkElement.href);
            videoId = url.searchParams.get('v');
        }
        const progressBar = document.querySelector('#progress-bar');
        const currentTime = parseInt(progressBar.getAttribute('aria-valuenow'), 10);
        const totalDuration = parseInt(progressBar.getAttribute('aria-valuemax'), 10);
        console.log("Current Time:", currentTime, "Duration:", totalDuration);
        console.log("Полученный videoId:", videoId);
        if (trackTitle && artistName && coverImage) {
            let isPlaying = buttonTitle !== 'Play';

            let data = JSON.stringify({
            track: trackTitle,
            artist: artistName,
            cover: coverImage,
            currentTime: currentTime,
            totalDuration: totalDuration,
            isPlaying: isPlaying,
            videoId: videoId
        });

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            } else if (socket.readyState === WebSocket.CLOSED) {
                console.log("WebSocket is closed. Reconnecting...");
                connectWebSocket();
            }
        } else {
            console.log("Track information is not available yet.");
        }
    }

    setInterval(sendTrackInfo, 1000);
})();