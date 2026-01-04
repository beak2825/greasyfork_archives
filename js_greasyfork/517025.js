// ==UserScript==
// @name         Elethor Fatigue Monitor
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Monitor a value on elethor.com and play sounds based on its state
// @author       Eugene
// @match        https://elethor.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/517025/Elethor%20Fatigue%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/517025/Elethor%20Fatigue%20Monitor.meta.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    let audioContext;

    function createAudioContext() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser');
            return;
        }
    }

    function createPingSound(frequency, duration) {
        return function() {
            if (!audioContext) {
                console.warn('AudioContext is not initialized');
                return;
            }
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    const playNegativeSound = createPingSound(800, 0.1);
    const playZeroSound = createPingSound(1000, 0.1);

    function checkValue() {
        const valueElement = document.querySelector('span.font-bold');
        if (!valueElement) {
            console.log('Value element not found');
            return;
        }

        const value = parseFloat(valueElement.textContent.replace(',', ''));
        console.log('Current value:', value);

        if (value < 0) {
            playNegativeSound();
        } else if (value === 0) {
            playZeroSound();
        }
    }

    // Create the AudioContext after a user gesture
    document.addEventListener('click', function() {
        createAudioContext();
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
            // Run the check every second after the context is ready
            setInterval(checkValue, 1000);
        });
        // Remove the event listener after the first click
        document.removeEventListener('click', arguments.callee);
    });
})();