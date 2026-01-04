// ==UserScript==
// @name            HDrezka 1.75x Speed Toggle Button
// @name:en         HDrezka 1.75x Speed Toggle Button
// @name:uk         HDrezka 1.75x Speed Toggle Button
// @name:ru         HDrezka 1.75x Speed Toggle Button
// @author          zlost666
// @namespace       http://tampermonkey.net/
// @version         1.0
// @license         MIT
// @description     Add custom speed toggle button for HDrezka media player
// @description:uk  Add custom speed toggle button for HDrezka media player
// @description:ru  Add custom speed toggle button for HDrezka media player
// @include         http*://*rezka*/*
// @include         http*://hdrezka*/*
// @include         http*://rezka*/*
// @include         http*://hdrezka.me/*
// @include         http*://hdrezka.co/*
// @include         http*://rezka.ag/*
// @include         http*://rezkify.com/*
// @include         http*://rezkery.com/*
// @include         http*://kinopub.me/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/527782/HDrezka%20175x%20Speed%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527782/HDrezka%20175x%20Speed%20Toggle%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSpeedSet = false;

    // Function to create and add the custom speed button
    function addSpeedButton() {
        let videoPlayer = document.querySelector('video');

        if (videoPlayer) {
            let button = document.createElement('button');
            button.innerText = '1.75x';
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.zIndex = 1000;
            button.style.padding = '5px';
            button.style.backgroundColor = 'rgba(0,0,0,0.5)';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';

            button.addEventListener('click', function() {
                if (isSpeedSet) {
                    videoPlayer.playbackRate = 1;
                    button.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    button.innerText = '1.75x';
                } else {
                    videoPlayer.playbackRate = 1.75;
                    button.style.backgroundColor = 'rgba(0,150,0,0.5)';
                    button.innerText = 'Normal';
                }
                isSpeedSet = !isSpeedSet;
            });

            document.body.appendChild(button);
        } else {
            console.warn('HDrezka video player not found.');
        }
    }

    // Add the button when the page loads
    window.addEventListener('load', function() {
        setTimeout(addSpeedButton, 1000);
    });

    // Add the button when a new video is loaded
    document.addEventListener('DOMNodeInserted', function(event) {
        if (event.target && event.target.tagName === 'VIDEO') {
            addSpeedButton();
        }
    });

    console.log('HDrezka Custom Speed Toggle Button script loaded.');
})();