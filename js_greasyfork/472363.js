// ==UserScript==
// @name         YouTube Music Transformer: Remove Video for Fluid Audio
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Transform YouTube Music into a more fluid and user-friendly music player NO MORE VIDEO. This script optimizes the layout to create a more focused and enjoyable music-listening experience.
// @author       Ameer Jamal
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472363/YouTube%20Music%20Transformer%3A%20Remove%20Video%20for%20Fluid%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/472363/YouTube%20Music%20Transformer%3A%20Remove%20Video%20for%20Fluid%20Audio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var ctrlHitCounter = 0;
    var isActive = true; // This sets Fluid Mode to ON by default

    // Toggle styles based on the default value of isActive
    togglePlayerStyles();
    function showBanner(message, isError) {
        var banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.width = '100%';
        banner.style.top = '-50px'; // start offscreen
        banner.style.zIndex = '99999';
        banner.style.padding = '10px';
        banner.style.textAlign = 'center';
        banner.style.fontSize = '18px';
        banner.style.color = 'white';
        banner.style.background = isError ? '#F44336' : '#4CAF50'; // Material Design colors
        banner.style.transition = 'top 0.3s ease-in-out'; // Add transition
        banner.style.boxShadow = isError ? '0 0 10px rgba(244,67,54,0.7)' : '0 0 10px rgba(76,175,80,0.7)'; // box shadow color based on banner color
        banner.style.animation = 'glitter 2s infinite linear';
        banner.style.borderBottom = 'none'; // remove bottom border
        banner.style.borderTopLeftRadius = '5px'; // round top left corner
        banner.style.borderTopRightRadius = '5px'; // round top right corner
        banner.innerText = message;

        var style = document.createElement('style');
        style.innerHTML = `
    @keyframes glitter {
        0% { box-shadow: ${isError ? '0 0 10px rgba(244,67,54,0.7)' : '0 0 10px rgba(76,175,80,0.7)'}; }
        50% { box-shadow: ${isError ? '0 0 20px rgba(244,67,54,1), 0 0 30px rgba(244,67,54,1)' : '0 0 20px rgba(76,175,80,1), 0 0 30px rgba(76,175,80,1)'}; }
        100% { box-shadow: ${isError ? '0 0 10px rgba(244,67,54,0.7)' : '0 0 10px rgba(76,175,80,0.7)'}; }
    }`;
    document.head.appendChild(style);

    document.body.appendChild(banner);

    setTimeout(function() { // Start slide down after a short delay
        banner.style.top = '0';
    }, 100);

    setTimeout(function() { // Slide up and remove after 600ms
        banner.style.top = '-50px';
        setTimeout(function() {
            banner.remove();
            style.remove();
        }, 300 + 1250); // Remove after transition finishes and 600ms delay
    }, 1250);
}

    function togglePlayerStyles() {
        var divToToggle = document.getElementById('main-panel');
        if (divToToggle) {
            divToToggle.style.display = (isActive && divToToggle.style.display !== 'none') ? 'none' : '';
        }

        var contentElements = document.querySelectorAll('.content.ytmusic-player-page');
        contentElements.forEach(function(element) {
            element.style.padding = (isActive && element.style.padding !== '0px') ? '0px' : '';
        });

        var queueItemElements = document.querySelectorAll('ytmusic-player-queue-item');
        queueItemElements.forEach(function(element) {
            element.style.borderTop = (isActive && element.style.borderTop !== '1px dotted black') ? '1px dotted black' : '';
        });

        var ytmusicPlayerPageElements = document.getElementsByTagName('ytmusic-player-page');
        if (ytmusicPlayerPageElements.length > 0) {
            var firstElement = ytmusicPlayerPageElements[0];
            if (isActive) {
                firstElement.classList.add('customToggle');
            } else {
                firstElement.classList.remove('customToggle');
            }
        }

        var existingStyleElement = document.getElementById('customToggleStyle');
        if (!existingStyleElement) {
            var style = document.createElement('style');
            style.id = 'customToggleStyle';
            style.innerHTML = `
                .customToggle {
                    --ytmusic-player-page-content-gap: 0px !important;
                    --ytmusic-player-page-side-panel-width: 100% !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    window.addEventListener('keyup', (event) => {
        if (event.key === 'Control') { // Change this key if you want a diffent key to turn on and off https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
            ctrlHitCounter += 1;

            if (ctrlHitCounter === 2) {
                isActive = !isActive;
                togglePlayerStyles();
                ctrlHitCounter = 0;

                if (isActive) {
                    showBanner('Fluid Mode ON (Zoom WebPage to Enhance)');
                } else {
                    showBanner('Fluid Mode OFF', true);
                }
            }

            setTimeout(() => {
                ctrlHitCounter = 0;
            }, 300);
        }
    });
})();
