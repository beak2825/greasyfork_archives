// ==UserScript==
// @name         Invidious to YouTube Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  (DEFUNCT) TOTAL INVIDIOUS DEATH
// @author       Chud
// @match        *://soyjak.party/*
// @match        *://soyjak.st/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514933/Invidious%20to%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/514933/Invidious%20to%20YouTube%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert Invidious iframe to YouTube iframe
    function convertInvidiousToYouTube() {
        const iframes = document.querySelectorAll('iframe#ytplayer');
        iframes.forEach(iframe => {
            const invidiousUrl = iframe.src;
            const videoId = invidiousUrl.split('/').pop(); // Get video ID from URL
            const youtubeUrl = `https://www.youtube.com/embed/${videoId}`; // Create YouTube URL
            iframe.src = youtubeUrl; // Replace the src attribute
            iframe.setAttribute('allowfullscreen', ''); // Optional: allow fullscreen
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', convertInvidiousToYouTube);
})();