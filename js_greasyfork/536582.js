// ==UserScript==
// @name        TikTok Video Seek Control
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*/video/*
// @match       https://www.tiktok.com/
// @grant       none
// @version     1.1
// @author      3xploiton3
// @description right arrow key (→) to forward the video 3 seconds and left arrow key (←) to rewind the video 3 seconds
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/536582/TikTok%20Video%20Seek%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/536582/TikTok%20Video%20Seek%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fungsi untuk mencari video yang sedang diputar
    function getActiveVideo() {
        // TikTok biasanya hanya menampilkan satu video pada satu waktu
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            if (!video.paused || video.readyState > 2) {
                return video;
            }
        }
        return null;
    }

    // Tambahkan event listener untuk tombol keyboard
    document.addEventListener('keydown', function (e) {
        const video = getActiveVideo();
        if (!video) return;

        // Panah kanan → untuk maju 3 detik
        if (e.key === 'ArrowRight') {
            video.currentTime += 3;
            e.preventDefault(); // Hindari scroll horizontal
        }

        // Panah kiri ← untuk mundur 3 detik
        else if (e.key === 'ArrowLeft') {
            video.currentTime -= 3;
            e.preventDefault();
        }
    }, true);
})();
