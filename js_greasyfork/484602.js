// ==UserScript==
// @name          유튜브 팟 플레이어로 보기 버튼 추가
// @namespace     유튜브 팟 플레이어로 보기 버튼 추가
// @version       0.4
// @description   유튜브 동영상을 팟 플레이어로 열 수 있는 버튼을 추가합니다. 기존 영상은 일시 정지 됩니다.
// @match         *://*.youtube.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/484602/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%8C%9F%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%EB%A1%9C%20%EB%B3%B4%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/484602/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%8C%9F%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%EB%A1%9C%20%EB%B3%B4%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoID = '';

    // Extract video ID from the URL
    function getVideoID() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    // Get the current video's duration in seconds
    function getVideoDuration() {
        const videoElement = document.querySelector('video');
        return videoElement ? videoElement.duration : 0;
    }

    // Convert time format (hh:mm:ss or mm:ss) to seconds
    function timeToSeconds(time) {
        const parts = time.split(':');
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (parts.length === 3) {
            hours = parseInt(parts[0]) || 0;
            minutes = parseInt(parts[1]) || 0;
            seconds = parseInt(parts[2]) || 0;
        } else if (parts.length === 2) {
            minutes = parseInt(parts[0]) || 0;
            seconds = parseInt(parts[1]) || 0;
        }

        return hours * 3600 + minutes * 60 + seconds;
    }

    // Create the PotPlayer URL with the updated start time
    function createPotPlayerURL(videoID, startTime) {
        const baseURL = 'potplayer:https://www.youtube.com/watch?v=' + videoID;
        const params = new URLSearchParams({
            t: startTime,
        });

        return baseURL + '?' + params.toString();
    }

    // Open the video in PotPlayer with the current playback position
    function openInPotPlayer() {
        const player = document.querySelector('.html5-main-video');
        if (player) {
            // Pause YouTube player
            player.pause();

            // Get the current playback time in seconds
            const currentTime = Math.floor(player.currentTime);

            // Create the PotPlayer URL
            const potPlayerURL = createPotPlayerURL(videoID, currentTime);

            // Open the video in PotPlayer with the current playback position
            window.location.href = potPlayerURL;
        }
    }

    // Create and append the PotPlayer button
    function createPotPlayerButton(videoID) {
        // Check if the button already exists
        if (document.getElementById('potplayer-button')) {
            return;
        }

        const logoContainer = document.getElementById('logo');
        if (!logoContainer) {
            return;
        }

        const videoDuration = getVideoDuration();
        if (videoDuration === 0) {
            setTimeout(function() {
                createPotPlayerButton(videoID);
            }, 100);
            return;
        }

        // Create the PotPlayer URL
        const potPlayerURL = createPotPlayerURL(videoID, '0');

        const button = document.createElement('button');
        button.textContent = 'Open in PotPlayer';
        button.id = 'potplayer-button';
        button.setAttribute('data-potplayer-url', potPlayerURL);
        button.style.cssText = `
            background-color: #ff0;
            color: #000;
            border: none;
            padding: 10px;
            margin-left: 10px;
            cursor: pointer;
            border-radius: 5px;
        `;

        button.addEventListener('click', openInPotPlayer);

        logoContainer.parentNode.insertBefore(button, logoContainer.nextSibling);
    }

    function updateVideoID() {
        const newVideoID = getVideoID();
        if (newVideoID && newVideoID !== videoID) {
            videoID = newVideoID;
            createPotPlayerButton(videoID);
        }

        requestAnimationFrame(updateVideoID);
    }

    function waitForLogo() {
        const logoContainer = document.getElementById('logo');
        if (logoContainer) {
            videoID = getVideoID();
            if (videoID) {
                createPotPlayerButton(videoID);
                updateVideoID();
            }
        } else {
            setTimeout(waitForLogo, 100);
        }
    }

    waitForLogo();
})();
