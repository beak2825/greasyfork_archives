// ==UserScript==
// @name         YouTube Playback Speed Control Pro
// @icon         https://i.ibb.co/7tmpKX6/fast-time-clock-or-speed-19009.png
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adjust YouTube playback speed with "[" and "]", show speed popup in video top-right corner, and reset with "\" key.
// @author       Lalit1022
// @match        *://www.youtube.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522314/YouTube%20Playback%20Speed%20Control%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/522314/YouTube%20Playback%20Speed%20Control%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Popup style settings
    const popupStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#fff',
        fontSize: '16px',
        position: { top: '10px', right: '10px' },
        fontFamily: '"Arial", "Helvetica", "sans-serif"' // Enforcing font for popup
    };

    // Function to display a temporary popup message
    function showPopup(message) {
        const videoContainer = document.querySelector('video');
        if (!videoContainer) return;

        // Check if in full-screen mode
        const isFullScreen = document.fullscreenElement !== null;

        // Adjust popup size if in full-screen mode
        const popupSize = isFullScreen ? '20px' : popupStyle.fontSize;

        // Create popup
        let popup = document.createElement('div');
        popup.id = 'speed-popup';
        popup.textContent = message;
        popup.style.position = 'absolute';
        popup.style.top = popupStyle.position.top;
        popup.style.right = popupStyle.position.right;
        popup.style.backgroundColor = popupStyle.backgroundColor;
        popup.style.color = popupStyle.textColor;
        popup.style.padding = '10px 15px';
        popup.style.borderRadius = '7px';
        popup.style.fontSize = popupSize;
        popup.style.fontFamily = popupStyle.fontFamily;
        popup.style.zIndex = '10000';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s';

        // Position inside video container
        const container = videoContainer.parentElement;
        container.style.position = 'relative'; // Ensure parent has relative positioning
        container.appendChild(popup);

        // Fade in the popup
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        // Remove the popup after 2 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.remove();
            }, 300);
        }, 2000);
    }

    // Event listener for key presses to adjust speed
    document.addEventListener('keydown', (event) => {
        const video = document.querySelector('video');
        if (!video) return;

        const currentSpeed = video.playbackRate;

        if (event.key === '[') {
            const newSpeed = Math.max(0.25, currentSpeed - 0.25);
            video.playbackRate = newSpeed;
            showPopup(`Speed : ×${newSpeed.toFixed(2)}`);
        } else if (event.key === ']') {
            const newSpeed = Math.min(16, currentSpeed + 0.25);
            video.playbackRate = newSpeed;
            showPopup(`Speed : ×${newSpeed.toFixed(2)}`);
        } else if (event.key === '\\') {
            video.playbackRate = 1.0;
            showPopup(`Speed : Default`);
        }
    });

    // Show keybinding information overlay on page load (if no speed is saved)
    window.addEventListener('load', () => {
        const overlay = document.createElement('div');
        overlay.textContent = 'Press "[" to decrease and "]" to increase playback speed. Press "\\" to reset.';
        overlay.style.position = 'absolute';
        overlay.style.bottom = '33px';
        overlay.style.left = '10px';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.color = '#fff';
        overlay.style.padding = '10px 15px';
        overlay.style.borderRadius = '7px';
        overlay.style.fontSize = '14px';
        overlay.style.fontFamily = '"Arial", "Helvetica", "sans-serif"';
        overlay.style.zIndex = '10000';

        const body = document.querySelector('body');
        body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 5000); // Remove after 5 seconds
    });

    // Persistent Speed Setting: Save and load playback speed
    window.addEventListener('load', () => {
        const video = document.querySelector('video');
        if (!video) return;

        const savedSpeed = localStorage.getItem('youtubePlaybackSpeed');
        if (savedSpeed) {
            video.playbackRate = parseFloat(savedSpeed);
            showPopup(`Speed : ×${video.playbackRate.toFixed(2)}`);
        }

        video.addEventListener('ratechange', () => {
            localStorage.setItem('youtubePlaybackSpeed', video.playbackRate);
        });
    });
})();
