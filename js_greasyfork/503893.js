// ==UserScript==
// @name            Youtube Playback Speed Toggle 1.6
// @description     Adds a styled toggle button next to the fullscreen button on YouTube's video player to toggle playback speed between normal and 1.15x for non-music videos, showing the current speed in a white circle. Attempts to start at 1.15x by default for non-music videos.
// @author          Luke-L
// @version         1.6
// @match           https://www.youtube.com/watch*
// @namespace       youtube-speed-toggle
// @grant           none
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon            https://raw.githubusercontent.com/Luke-L/Youtube-Faster-Script/main/YT%20Fast%20Speed%202.png
// @update          https://raw.githubusercontent.com/Luke-L/Youtube-Faster-Script/main/youtube-speed-toggle.js
// @homepage        https://github.com/Luke-L/Youtube-Faster-Script/
// @downloadURL https://update.greasyfork.org/scripts/503893/Youtube%20Playback%20Speed%20Toggle%2016.user.js
// @updateURL https://update.greasyfork.org/scripts/503893/Youtube%20Playback%20Speed%20Toggle%2016.meta.js
// ==/UserScript==

// working now. doesnt quite get the music distinction right idk

(function() {
    'use strict';
    const customSpeed = 1.15; // Change this value to your preferred speed

    function isMusicVideo() {
        const metadataRows = document.querySelectorAll('#meta-contents #content #container #title yt-formatted-string');
        for (let i = 0; i < metadataRows.length; i++) {
            if (metadataRows[i].textContent.toLowerCase().includes('music')) {
                return true;
            }
        }
        return false;
    }

    function setInitialPlaybackRate() {
        const video = document.querySelector('video');
        if (video && !isMusicVideo()) {
            video.playbackRate = customSpeed; // Set to 1.15x by default for non-music videos
            console.log(`Initial playback rate set to: ${video.playbackRate}x`);
            updateButtonLabel();
        }
    }

    function togglePlaybackRate() {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = video.playbackRate === 1.0 ? customSpeed : 1.0;
            console.log(`Playback rate toggled to: ${video.playbackRate}x`);
            updateButtonLabel();
        }
    }

    function updateButtonLabel() {
        const video = document.querySelector('video');
        const buttonText = document.querySelector('#speed-toggle-btn svg text');
        if (video && buttonText) {
            buttonText.textContent = `${video.playbackRate}x`;
        }
    }

    // This was neater, but Youtube started requiring TrustedHTML Types for any changes made, so we have to make this manually
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'speed-toggle-btn';
        button.classList.add('ytp-button');
        button.setAttribute('title', 'Toggle Speed');

        // Create the SVG structure manually
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', '90%');
        svg.setAttribute('height', '90%');
        svg.setAttribute('viewBox', '0 0 36 36');
        svg.setAttribute('fill', '#fff');

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('r', '15');
        circle.setAttribute('fill', 'white');
        svg.appendChild(circle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', '18');
        text.setAttribute('y', '22');
        text.setAttribute('font-size', '10');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'black');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('dominant-baseline', 'inherit');
        text.textContent = `${customSpeed}`;
        svg.appendChild(text);

        button.appendChild(svg);
        button.addEventListener('click', togglePlaybackRate);

        return button;
    }

    function addToggleButton() {
        const controls = document.querySelector('.ytp-right-controls');
        if (controls && !document.querySelector('#speed-toggle-btn')) {
            const button = createToggleButton();

            const fullscreenButton = controls.querySelector('.ytp-fullscreen-button');
            if (fullscreenButton) {
                controls.insertBefore(button, fullscreenButton);
            } else {
                controls.appendChild(button);
            }

            setInitialPlaybackRate(); // Set initial playback rate when button is added
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length && !document.querySelector('#speed-toggle-btn')) {
                addToggleButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(addToggleButton, 1000); // Delay to ensure elements are fully loaded
    });

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(addToggleButton, 1000);
    });
})();
