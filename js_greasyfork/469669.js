// ==UserScript==
// @name         PrimeVideoControlsEnhancer
// @name:ja      PrimeVideoControlsEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Enhance Amazon Prime Video by adding volume control via mouse wheel and Picture-in-Picture mode.
// @description:ja マウスホイールによる音量調節とピクチャー・イン・ピクチャー・モードを追加し、Amazonプライム・ビデオを強化。
// @author       You
// @match        https://www.amazon.co.jp/gp/video/detail/*
// @match        https://www.amazon.com/gp/video/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469669/PrimeVideoControlsEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/469669/PrimeVideoControlsEnhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
                position: 'fixed', bottom: '10px', right: '10px', fontSize: '20px', background: 'rgba(0, 0, 0, 0.7)',
                color: 'white', padding: '10px', borderRadius: '5px', zIndex: 10000, display: 'none', fontWeight: 'bold',
                textShadow: '2px 2px 4px #000000', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', transition: 'opacity 0.3s'
            });
            document.body.appendChild(volumeDisplay);
            debugLog('Volume display initialized');
        }

        return volumeDisplay;
    }

    function updateVolumeDisplay(volumeDisplay, volume) {
        volumeDisplay.style.display = 'block';
        volumeDisplay.style.opacity = '1';
        volumeDisplay.textContent = 'Volume: ' + Math.round(volume * 100);
        debugLog('Volume display updated');

        if (volume <= 0.25) {
            volumeDisplay.style.color = '#0000FF';
        } else if (volume <= 0.5) {
            volumeDisplay.style.color = '#008000';
        } else if (volume <= 0.75) {
            volumeDisplay.style.color = '#FFFF00';
        } else {
            volumeDisplay.style.color = '#FF0000';
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

                if (volumeTimeoutId) {
                    clearTimeout(volumeTimeoutId);
                }
                // Set new timer to hide volume display
                volumeTimeoutId = setTimeout(function() {
                    debugLog('Fading out volume display');
                    volumeDisplay.style.display = 'none';
                    volumeDisplay.style.opacity = '0';
                }, 3000);

                e.preventDefault();
            }
        };
    }

    function createPiPButton() {
        let pipButton = document.getElementById('pip-button');

        if (!pipButton) {
            pipButton = document.createElement('button');
            pipButton.id = 'pip-button';
            Object.assign(pipButton.style, {
                position: 'fixed', top: '20%', left: '50%', zIndex: '10000', padding: '10px', borderRadius: '5px',
                color: '#ffffff', border: 'none', cursor: 'pointer', display: 'none', backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+CiAgICA8cGF0aCBkPSJNMTkgMTFoLTh2Nmg4di02em00IDhWNC45OEMyMyAzLjg4IDIyLjEgMyAyMSAzSDNjLTEuMSAwLTIgLjg4LTIgMS45OFYxOWMwIDEuMS45IDIgMiAyaDE4YzEuMSAwIDItLjkgMi0yem0tMiAuMDJIM1Y0Ljk3aDE4djE0LjA1eiIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+Cjwvc3ZnPgo=)',
                backgroundSize: '20px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundColor: 'rgba(223, 222, 219, 0.55)',
                transition: 'opacity 0.3s', width: '30px', height: '25px'
            });
            document.body.appendChild(pipButton);

            pipButton.addEventListener('click', function() {
                debugLog('PiP button clicked...');

                let video = document.querySelector('#dv-web-player video');
                if (video !== document.pictureInPictureElement) {
                    video.requestPictureInPicture();
                } else {
                    document.exitPictureInPicture();
                }
            });

            debugLog('PiP button created.');
        }

        return pipButton;
    }

    function handleMouseoverEvent(pipButton) {
        let pipTimeoutId = 0;
        return function(e) {
            pipButton.style.display = 'block';
            pipButton.style.opacity = '1';

            if (pipTimeoutId) {
                clearTimeout(pipTimeoutId);
            }
            pipTimeoutId = setTimeout(() => {
                debugLog('Fading out PiP button');
                pipButton.style.display = 'none';
                pipButton.style.opacity = '0';
            }, 1500);
        };
    }

    const volumeDisplay = createVolumeDisplay();
    const pipButton = createPiPButton();

    const observer = new MutationObserver(function(mutations, observer) {
        for(let mutation of mutations) {
            debugLog(mutation);
        }

        const video = document.querySelector('#dv-web-player');
        if (video) {
            debugLog("'#dv-web-player' has been loaded in the DOM.");
            video.addEventListener('wheel', handleWheelEvent(volumeDisplay), {passive: false});
            video.addEventListener('mouseover', handleMouseoverEvent(pipButton));
            observer.disconnect();
            debugLog('Disconnected the observer since the video element has been found.');
        }
    });

    debugLog('Starting to observe the whole document for addition of the video element.');
    observer.observe(document, {childList: true, subtree: true});
})();