// ==UserScript==
// @license      MIT
// @name         Watch DLC on Kinocat
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  Replace Chat channels's video feed with DLCs's video stream
// @author       Azagro
// @match        https://www.twitch.tv/tapa_tapa_mateo
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509226/Watch%20DLC%20on%20Kinocat.user.js
// @updateURL https://update.greasyfork.org/scripts/509226/Watch%20DLC%20on%20Kinocat.meta.js
// ==/UserScript==
// How to use this script: Get the Tampermonkey extension -> create new script -> post this script -> save -> restart browser or reload page.

(function() {
    'use strict';

    // Define the Twitch channel as a variable
    const channelName = 'potazio980';

    // Wait for the page to load fully
    window.addEventListener('load', function() {
        // Delay the execution by 1 second
        setTimeout(function() {
            // Find the Twitch video player
            const player = document.querySelector('.video-player__container');

            if (player) {
                // Remove the current video player
                player.innerHTML = '';

                // Create a new iframe for the specified channel's stream
                var iframe = document.createElement('iframe');
                iframe.src = `https://player.twitch.tv/?channel=${channelName}&parent=twitch.tv&quality=1080p&muted=false`;
                iframe.width = "100%"; // Full width
                iframe.height = "100%"; // Full height
                iframe.allowFullscreen = true;

                // Append the iframe into the original player container
                player.appendChild(iframe);
            }
        }, 2000); // 2-second delay (2000 milliseconds)
    }, false);
})();
