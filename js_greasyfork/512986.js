// ==UserScript==
// @name         YouTube Float Input Box for Playback Speed
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  Adds a float input box to adjust playback speed on YouTube after 2 seconds of user input
// @author       CigiMundus
// @license MIT
// @icon         https://img.icons8.com/?size=96&id=hAc8LzPCcNEX&format=png
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/512986/YouTube%20Float%20Input%20Box%20for%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/512986/YouTube%20Float%20Input%20Box%20for%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playbackTimer;
    const defaultSpeed = 1.064;

    function addFloatInputBox() {
        const likeButtonContainer = document.querySelector('#top-level-buttons-computed');

        if (likeButtonContainer && !document.querySelector('.custom-float-input')) {
            const floatInput = document.createElement('input');
            floatInput.type = 'number';
            floatInput.step = '0.1';
            floatInput.min = '0.1';
            floatInput.max = '2';
            floatInput.value = defaultSpeed;
            floatInput.placeholder = 'Speed (0.1 - 2)';
            floatInput.className = 'custom-float-input';

            floatInput.style.padding = '8px 12px';
            floatInput.style.borderRadius = '12px';
            floatInput.style.border = '2px solid #00796b';
            floatInput.style.backgroundColor = '#e0f2f1';
            floatInput.style.color = '#00796b';
            floatInput.style.fontSize = '14px';
            floatInput.style.marginRight = '10px';
            floatInput.style.outline = 'none';
            floatInput.style.transition = 'border 0.3s, box-shadow 0.3s';

            floatInput.addEventListener('focus', () => {
                floatInput.style.border = '2px solid #004d40';
                floatInput.style.boxShadow = '0 0 8px rgba(0, 77, 64, 0.4)';
            });

            floatInput.addEventListener('blur', () => {
                floatInput.style.border = '2px solid #00796b';
                floatInput.style.boxShadow = 'none';
            });

            floatInput.addEventListener('input', (event) => {
                let newSpeed = parseFloat(event.target.value);
                if (isNaN(newSpeed) || newSpeed < 0.1) {
                    newSpeed = 0.1;
                    floatInput.value = newSpeed;
                } else if (newSpeed > 2) {
                    newSpeed = 2;
                    floatInput.value = newSpeed;
                }

                if (playbackTimer) {
                    clearTimeout(playbackTimer);
                }

                playbackTimer = setTimeout(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.playbackRate = newSpeed;
                        console.log(`Video playback speed set to: ${newSpeed}`);
                    } else {
                        console.error('No video element found.');
                    }
                }, 2000);
            });

            likeButtonContainer.insertBefore(floatInput, likeButtonContainer.firstChild);

            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = defaultSpeed;
                console.log(`Video playback speed set to default: ${defaultSpeed}`);
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            addFloatInputBox();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addFloatInputBox();
})();
