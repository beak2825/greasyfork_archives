// ==UserScript==
// @name         Kick Stream Delay Display
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays real-time stream latency next to viewer count on Kick.com with auto speed adjustment and Mo'Kick compatibility
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
    const targetDelay = 6; // Opóźnienie w sekundach, przy którym zmieniamy prędkość
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

    function isMoKickStreamDataEnabled() {
        // Sprawdź czy Mo'Kick dodał swoje statystyki - przeszukaj CAŁĄ stronę
        // Bo statystyki mogą być w zupełnie innym miejscu DOM

        // Szukaj elementów zawierających tekst Mo'Kick w całym dokumencie
        const allElements = document.querySelectorAll('*');

        for (const el of allElements) {
            // Sprawdzaj tylko bezpośredni textContent (bez dzieci)
            const directText = Array.from(el.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent)
                .join('');

            if (directText.includes('Chatters') ||
                directText.includes('Participation') ||
                directText.includes('Avg.')) {
                console.log('[Delay Debug] ✓ Mo\'Kick aktywny (znaleziono tekst Mo\'Kick)');
                return true;
            }
        }

        console.log('[Delay Debug] ✗ Mo\'Kick nieaktywny');
        return false;
    }

    function updateDelayDisplay(delayText) {
        // Szukamy kontenera z liczbą widzów - kick.com używa data-testid="viewer-count"
        const viewerStatsContainer = document.querySelector('[data-testid="viewer-count"]');

        if (viewerStatsContainer) {
            let delayElement = document.getElementById('delay-display');
            const moKickActive = isMoKickStreamDataEnabled();

            if (!delayElement) {
                delayElement = document.createElement('div');
                delayElement.id = 'delay-display';
                delayElement.className = 'flex items-center gap-1 text-sm font-bold';
                delayElement.style.color = '#53FC18'; // Zielony kolor Kick
                delayElement.style.display = 'flex';
                delayElement.style.alignItems = 'center';
                delayElement.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L12 6H10V12H6V6H4L8 1Z"></path>
                    </svg>
                    <span id="delay-text">${delayText}</span>
                `;

                if (moKickActive) {
                    // Mo'Kick aktywny - wstaw PRZED kontenerem viewer-count (na zewnątrz)
                    delayElement.style.marginRight = '10px';
                    viewerStatsContainer.parentElement.insertBefore(delayElement, viewerStatsContainer);
                } else {
                    // Bez Mo'Kick - wstaw WEWNĄTRZ kontenera, przed viewers
                    delayElement.style.marginRight = '10px';
                    viewerStatsContainer.insertBefore(delayElement, viewerStatsContainer.firstChild);
                }
            }

            // ZAWSZE sprawdź pozycję (nawet jeśli element już istnieje)
            // Bo Mo'Kick może się załadować PÓŹNIEJ
            if (delayElement) {
                const isInsideContainer = delayElement.parentElement === viewerStatsContainer;

                console.log('[Delay Debug] moKickActive:', moKickActive, 'isInsideContainer:', isInsideContainer);

                if (moKickActive && isInsideContainer) {
                    // Mo'Kick włączony, ale delay jest w środku - przenieś na zewnątrz
                    console.log('[Delay Debug] Przenoszę delay NA ZEWNĄTRZ kontenera');
                    viewerStatsContainer.parentElement.insertBefore(delayElement, viewerStatsContainer);
                } else if (!moKickActive && !isInsideContainer) {
                    // Mo'Kick wyłączony, ale delay jest na zewnątrz - przenieś do środka
                    console.log('[Delay Debug] Przenoszę delay DO ŚRODKA kontenera');
                    viewerStatsContainer.insertBefore(delayElement, viewerStatsContainer.firstChild);
                }

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
