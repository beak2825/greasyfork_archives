// ==UserScript==
// @name         ReddTube Video Downloader and Next Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds download and next buttons to the video player and changes the background color on www.redd.tube
// @author       Your Name
// @match        *://www.redd.tube/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538113/ReddTube%20Video%20Downloader%20and%20Next%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/538113/ReddTube%20Video%20Downloader%20and%20Next%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var videoSource = document.querySelector('#video-player source');
        var downloadVideoBtn = document.createElement('button');
        downloadVideoBtn.style.backgroundImage = 'url("https://i.ibb.co/bm8j1jj/download.png")';
        downloadVideoBtn.style.backgroundRepeat = 'no-repeat';
        downloadVideoBtn.style.backgroundPosition = 'center';
        downloadVideoBtn.style.backgroundSize = 'contain';
        downloadVideoBtn.id = 'download-video-btn';
        downloadVideoBtn.style.position = 'absolute';
        downloadVideoBtn.style.top = '10px';
        downloadVideoBtn.style.left = '10px';
        downloadVideoBtn.style.zIndex = '999';
        downloadVideoBtn.style.width = '30px';
        downloadVideoBtn.style.height = '30px';
        downloadVideoBtn.style.border = 'none';

        document.querySelector('.fixed-container')?.appendChild(downloadVideoBtn);

        downloadVideoBtn.addEventListener('click', function() {
            var videoUrl = videoSource?.getAttribute('src');
            if (videoUrl) window.open(videoUrl, '_blank');
        });

        var nextVideoBtn = document.createElement('button');
        nextVideoBtn.style.backgroundImage = 'url("https://i.ibb.co/qmY24dL/next.png")';
        nextVideoBtn.style.backgroundRepeat = 'no-repeat';
        nextVideoBtn.style.backgroundPosition = 'center';
        nextVideoBtn.style.backgroundSize = 'contain';
        nextVideoBtn.id = 'next-video-btn';
        nextVideoBtn.style.position = 'absolute';
        nextVideoBtn.style.top = '10px';
        nextVideoBtn.style.left = '50px';
        nextVideoBtn.style.zIndex = '999';
        nextVideoBtn.style.width = '30px';
        nextVideoBtn.style.height = '30px';
        nextVideoBtn.style.border = 'none';

        document.querySelector('.fixed-container')?.appendChild(nextVideoBtn);

        nextVideoBtn.addEventListener('click', function() {
            var nextButton = Array.from(document.querySelectorAll('a.btn')).find(el => el.textContent.includes("Next"));
            nextButton?.click();
        });

        var videoPlayer = document.getElementById("video-player");
        if (videoPlayer) {
            videoPlayer.style.backgroundColor = "#333333";
            if (videoPlayer.muted) videoPlayer.muted = false;
            if (videoPlayer.paused) {
                videoPlayer.play().catch(() => {});
            }
        }

        document.body.style.backgroundColor = "#333333";

        var style = document.createElement('style');
        style.innerHTML = `
            body {
                background-color: #333333 !important;
            }
            #video-player {
                background-color: #333333 !important;
            }
            #download-video-btn, #next-video-btn {
                background-color: transparent;
                border: none;
                cursor: pointer;
            }
            #js-header > div > nav {
                background-color: #333333;
                color: white;
            }
            body > div.shortcode-html {
                background-color: #333333 !important;
            }
        `;
        document.head.appendChild(style);
    });

})();
