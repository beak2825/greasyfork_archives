// ==UserScript==
// @name         Twitch Front Page Carousel Remover
// @version      1.1
// @icon         https://img.icons8.com/?size=100&id=VJpqTKPYvnx2&format=png&color=000000
// @description  Removes front page carousel and mutes its audio
// @author       LiquidJesus
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/1169082
// @downloadURL https://update.greasyfork.org/scripts/538672/Twitch%20Front%20Page%20Carousel%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/538672/Twitch%20Front%20Page%20Carousel%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeCarousel() {
        // Look for any element that contains "carousel" in its class name
        const carousels = document.querySelectorAll('[class*="carousel"]');
        
        carousels.forEach(carousel => {
            // Only target elements on the front page that are likely the main carousel
            if (window.location.pathname === '/' || window.location.pathname === '') {
                // Hide the carousel
                carousel.style.display = 'none';
                
                // Mute any videos inside
                const videos = carousel.querySelectorAll('video');
                videos.forEach(video => {
                    video.muted = true;
                    video.pause();
                });
            }
        });
    }

    // Run on load
    removeCarousel();

    // Watch for changes and re-run
    new MutationObserver(removeCarousel).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
