// ==UserScript==
// @name          유튜브 팝업 보기 버튼 추가
// @namespace     유튜브 팝업 보기 버튼 추가
// @version       0.2
// @description   유튜브를 팝업으로 띄우는 버튼을 추가합니다. 버튼을 클릭하면 팝업이 열리고, 동영상이 일시정지됩니다.
// @match         *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/468223/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%8C%9D%EC%97%85%20%EB%B3%B4%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/468223/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%8C%9D%EC%97%85%20%EB%B3%B4%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
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

    // Create the pop-up URL with the updated start time
    function createPopupURL(videoID, startTime) {
        const baseURL = 'https://www.youtube.com/embed/' + videoID;
        const params = new URLSearchParams({
            start: startTime,
        });

        return baseURL + '?' + params.toString();
    }

    // Open the pop-up window
    function openPopup(url) {
        window.open(url, 'YouTube Pop-up', 'width=800,height=600');
    }

    // Pause the YouTube video
    function pauseVideo() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.pause();
        }
    }

    // Update the start time when the video time changes
    function updateStartTime() {
        const currentTimeElement = document.querySelector('.ytp-time-current');
        if (currentTimeElement) {
            const currentTimeText = currentTimeElement.textContent;
            const currentTime = timeToSeconds(currentTimeText);
            const popupURL = createPopupURL(videoID, currentTime);

            const button = document.getElementById('popup-button');
            if (button) {
                button.setAttribute('data-popup-url', popupURL);
            }
        }

        requestAnimationFrame(updateStartTime);
    }

    // Create and append the pop-up button
    function createPopupButton(videoID) {
        const logoContainer = document.getElementById('logo');
        if (!logoContainer) {
            return;
        }

        const videoDuration = getVideoDuration();
        if (videoDuration === 0) {
            setTimeout(function() {
                createPopupButton(videoID);
            }, 100);
            return;
        }

        const popupURL = createPopupURL(videoID, '0');

        const button = document.createElement('button');
        button.textContent = 'Video Open in Pop-up';
        button.id = 'popup-button';
        button.setAttribute('data-popup-url', popupURL);
        button.style.cssText = `
            background-color: #f00;
            color: #fff;
            border: none;
            padding: 10px;
            margin-left: 10px;
            cursor: pointer;
            border-radius: 5px;
        `;

        button.addEventListener('click', function() {
            const popupURL = button.getAttribute('data-popup-url');
            openPopup(popupURL);
            pauseVideo(); // Pause the YouTube video
        });

        logoContainer.parentNode.insertBefore(button, logoContainer.nextSibling);

        requestAnimationFrame(updateStartTime);
    }

    function waitForLogo() {
        const logoContainer = document.getElementById('logo');
        if (logoContainer) {
            videoID = getVideoID();
            if (videoID) {
                createPopupButton(videoID);
            }
        } else {
            setTimeout(waitForLogo, 100);
        }
    }

    waitForLogo();
})();