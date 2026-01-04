// ==UserScript==
// @name         Kick Stream Delay Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays real-time stream latency next to viewer count on Kick.com with auto speed adjustment
// @author       Premiumsmart
// @match        https://kick.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504074/Kick%20Stream%20Delay%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/504074/Kick%20Stream%20Delay%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Opcjonalnie, zmień te wartości według własnych potrzeb
    const targetDelay = 5; // Opóźnienie w sekundach, przy którym zmieniamy prędkość
    const speedUpFactor = 1.25; // Współczynnik przyspieszenia

    function adjustPlaybackRate() {
        const video = document.querySelector('video');
        let delayText = '';

        if (video) {
            // Oblicz opóźnienie
            const currentTime = video.currentTime;
            const buffered = video.buffered;

            if (buffered.length > 0) {
                const bufferEnd = buffered.end(buffered.length - 1);
                const delay = bufferEnd - currentTime;

                if (delay > targetDelay) {
                    video.playbackRate = speedUpFactor;
                } else {
                    video.playbackRate = 1.0; // Przywróć normalną prędkość
                }

                delayText = `${delay.toFixed(2)}s`;
            }
        }

        updateDelayDisplay(delayText);

        setTimeout(adjustPlaybackRate, 1000);
    }

    function updateDelayDisplay(delayText) {
        // Szukamy kontenera z liczbą widzów - kick.com używa data-testid="viewer-count"
        const viewerStatsContainer = document.querySelector('[data-testid="viewer-count"]');

        if (viewerStatsContainer) {
            let delayElement = document.getElementById('delay-display');
            if (!delayElement) {
                delayElement = document.createElement('div');
                delayElement.id = 'delay-display';
                delayElement.className = 'flex items-center gap-1 text-sm font-bold';
                delayElement.style.marginRight = '10px'; // Margines z prawej, aby oddzielić od liczby widzów
                delayElement.style.color = '#53FC18'; // Zielony kolor Kick
                delayElement.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L12 6H10V12H6V6H4L8 1Z"></path>
                    </svg>
                    <span id="delay-text">${delayText}</span>
                `;
                // Wstaw PRZED pierwszym dzieckiem (po lewej)
                viewerStatsContainer.insertBefore(delayElement, viewerStatsContainer.firstChild);
            } else {
                // Aktualizuj tekst
                const textSpan = document.getElementById('delay-text');
                if (textSpan) {
                    textSpan.textContent = delayText;
                }
            }
        }
    }

    // Czekamy aż strona się w pełni załaduje
    function waitForVideoAndContainer() {
        const video = document.querySelector('video');
        const container = document.querySelector('[data-testid="viewer-count"]');

        if (video && container) {
            console.log('Kick Stream Delay Display: Started');
            adjustPlaybackRate();
        } else {
            setTimeout(waitForVideoAndContainer, 500);
        }
    }

    waitForVideoAndContainer();
})();
