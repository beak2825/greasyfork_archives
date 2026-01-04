// ==UserScript==
// @name         Download Vidéo TikTok
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add a button for download
// @author       MTX1
// @match        https://www.tiktok.com/@*/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474954/Download%20Vid%C3%A9o%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/474954/Download%20Vid%C3%A9o%20TikTok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        let videoElement = document.querySelector("video[playsinline][preload='auto']");
        if (videoElement) {
            let downloadSrc = videoElement.getAttribute("src");
            if (downloadSrc) {
                let downloadButton = document.createElement("a");
                downloadButton.href = downloadSrc;
                downloadButton.download = "video_tiktok.mp4";
                downloadButton.textContent = "Télécharger la vidéo";
                downloadButton.style.position = "fixed";
                downloadButton.style.zIndex = "9999";
                downloadButton.style.top = "10px";
                downloadButton.style.right = "10px";
                downloadButton.style.padding = "10px 20px";
                downloadButton.style.background = "#FF0000";
                downloadButton.style.color = "#FFFFFF";
                downloadButton.style.borderRadius = "5px";
                downloadButton.style.textDecoration = "none";
                document.body.appendChild(downloadButton);
            }
        }
    }

    window.addEventListener('load', function() {
        addDownloadButton();
    });

})();
