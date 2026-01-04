// ==UserScript==
// @name         Primevideo Visual Cleanup and Volume Control
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @license      MIT
// @description  Removes X-ray and black shadow from streaming, also adds mouse wheel volume control.
// @author       jkillas
// @match        *.primevideo.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527500/Primevideo%20Visual%20Cleanup%20and%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/527500/Primevideo%20Visual%20Cleanup%20and%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add custom CSS
    GM_addStyle(`
        .atvwebplayersdk-player-container .hideUntilCssLoaded .xrayQuickView {
            display: none !important;
        }
        .fkpovp9 {
            background: none !important;
        }
        .f1makowq {
            background: none !important;
        }
        #pip-button {
            display: none !important;
        }
        .f8hspre f1makowq {
            background: none !important;
        }
        .f10i0hvc {
            background: none !important;
        }
        .fvtlr3b {
            background: none !important;
        }
    `);

    const DEBUG_MODE = false;

    function debugLog(message) {
        if (DEBUG_MODE) {
            console.log(message);
        }
    }

    function createVolumeDisplay() {
        let volumeDisplay = document.getElementById('volume-display');

        if (!volumeDisplay) {
            volumeDisplay = document.createElement('div');
            volumeDisplay.id = 'volume-display';
            Object.assign(volumeDisplay.style, {
                position: 'fixed',
                top: '10px',
                left: '10px',
                fontSize: '18px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '8px',
                zIndex: 10000,
                display: 'none',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'opacity 0.3s',
                border: '1px solid rgba(255,255,255,0.2)'
            });
            document.body.appendChild(volumeDisplay);
            debugLog('Volume display initialized');
        }

        return volumeDisplay;
    }

    // Create mute icon SVG
    const muteIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
    `;

    function updateVolumeDisplay(volumeDisplay, volume) {
        volumeDisplay.style.display = 'block';
        volumeDisplay.style.opacity = '1';

        // Check if volume is muted
        if (volume <= 0.01) {
            volumeDisplay.innerHTML = muteIconSVG + 'Muted';
            volumeDisplay.style.color = '#ffffff';
            // Don't set any timeout for hiding when muted
            return;
        }

        volumeDisplay.textContent = 'Volume: ' + Math.round(volume * 100) + '%';
        debugLog('Volume display updated');

        // Color scheme for non-muted states
        if (volume <= 0.25) {
            // Low volume: Soft blue
            volumeDisplay.style.color = '#4A90E2';
        } else if (volume <= 0.5) {
            // Medium-low volume: Gentle green
            volumeDisplay.style.color = '#2ECC71';
        } else if (volume <= 0.75) {
            // Medium-high volume: Warm orange
            volumeDisplay.style.color = '#F39C12';
        } else {
            // High volume: Vibrant red
            volumeDisplay.style.color = '#E74C3C';
        }
    }

    function handleWheelEvent(volumeDisplay) {
        let volumeTimeoutId = 0;
        return function(e) {
            let video = document.querySelector('#dv-web-player video');
            debugLog('Video player found: ' + video);
            if (video) {
                let newVolume = video.volume + (e.deltaY < 0 ? 0.1 : -0.1);
                debugLog('New volume calculated: ' + newVolume);
                video.volume = Math.max(0, Math.min(1, newVolume));
                updateVolumeDisplay(volumeDisplay, video.volume);

                // Clear any existing timeout
                if (volumeTimeoutId) {
                    clearTimeout(volumeTimeoutId);
                }

                // Only set timeout to hide display if volume is above muted threshold
                if (video.volume > 0.01) {
                    volumeTimeoutId = setTimeout(function() {
                        debugLog('Fading out volume display');
                        volumeDisplay.style.display = 'none';
                        volumeDisplay.style.opacity = '0';
                    }, 3000);
                }

                e.preventDefault();
            }
        };
    }


    const volumeDisplay = createVolumeDisplay();

    const observer = new MutationObserver(function(mutations, observer) {
        for(let mutation of mutations) {
            debugLog(mutation);
        }

        const video = document.querySelector('#dv-web-player');
        if (video) {
            debugLog("'#dv-web-player' has been loaded in the DOM.");
            video.addEventListener('wheel', handleWheelEvent(volumeDisplay), {passive: false});
            observer.disconnect();
            debugLog('Disconnected the observer since the video element has been found.');
        }
    });

    debugLog('Starting to observe the whole document for addition of the video element.');
    observer.observe(document, {childList: true, subtree: true});
})();