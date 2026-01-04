// ==UserScript==
// @name        ChatGPT play sound when finish generating
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Plays a custom chime when chatgpt finishes
// @author      Salvador Martinez
// @match       https://chatgpt.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/528001/ChatGPT%20play%20sound%20when%20finish%20generating.user.js
// @updateURL https://update.greasyfork.org/scripts/528001/ChatGPT%20play%20sound%20when%20finish%20generating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGenerating = false;

    function logEvent(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const styles = {
            info: 'color: blue; font-weight: bold;',
            success: 'color: green; font-weight: bold;',
            warning: 'color: orange; font-weight: bold;',
            error: 'color: red; font-weight: bold;'
        };
        if (type === 'warning' || type === 'error' || type === 'success' || message.includes('started') || message.includes('finished')) {
            console.log(`%c[Task Finished - ${timestamp}] ${message}`, styles[type] || styles.info);
        }
    }

    function playCustomChime() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.value = 0.2; // Adjust volume as needed

        // Frequencies for the chime
        const frequencies = [659.26, 659.26, 659.26, 987.76]; // E5, E5, E5, B5
        const durations = [150, 150, 150, 300]; // Note durations

        let startTime = context.currentTime;

        frequencies.forEach((freq, index) => {
            const oscillator = context.createOscillator();
            oscillator.connect(gainNode);
            oscillator.type = 'triangle'; // Triangle wave for that custom sound
            oscillator.frequency.value = freq;
            oscillator.start(startTime);
            oscillator.stop(startTime + durations[index] / 1000);
            startTime += durations[index] / 1000;
        });

    }

    function checkGeneration() {
        const generatingButton = document.querySelector('button[data-testid="stop-button"]');

        if (generatingButton) {
            if (!isGenerating) {
                isGenerating = true;
            }
        } else {
            if (isGenerating) {
                isGenerating = false;
                playCustomChime();
            }
        }
    }

    setInterval(checkGeneration, 500);
})();
