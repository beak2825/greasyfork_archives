// ==UserScript==
// @name         LSD v3
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Subtelne efekty LSD, które są utrzymywane po przejściu na inną stronę w tej samej karcie. Stworzony przez weedtv.
// @author       weedtv
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514019/LSD%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/514019/LSD%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tworzenie przycisków Start i Stop
    const startButton = document.createElement('button');
    const stopButton = document.createElement('button');

    startButton.innerText = 'Start';
    stopButton.innerText = 'Stop';

    startButton.style.position = 'fixed';
    startButton.style.top = '10px';
    startButton.style.right = '70px';
    startButton.style.zIndex = '10000';

    stopButton.style.position = 'fixed';
    stopButton.style.top = '10px';
    stopButton.style.right = '10px';
    stopButton.style.zIndex = '10000';

    document.body.appendChild(startButton);
    document.body.appendChild(stopButton);

    let intervalId;
    let blinkIntervalId;
    let effectSequence;
    let originalPositions = new Map();

    // Funkcja losująca subtelne zmiany w elementach
    function getRandomTransform() {
        const randomScale = Math.random() * 0.5 + 0.75; // Skala od 0.75 do 1.25
        const randomRotate = Math.floor(Math.random() * 11) - 5; // Obrót od -5deg do 5deg
        return `scale(${randomScale}) rotate(${randomRotate}deg)`;
    }

    function applyEffects() {
        const elements = document.querySelectorAll('div, p, img, span, h1, h2, h3, h4, h5, h6');

        elements.forEach(element => {
            if (!originalPositions.has(element)) {
                originalPositions.set(element, {
                    top: element.style.top || '',
                    left: element.style.left || '',
                    position: element.style.position || '',
                    transform: element.style.transform || ''
                });
            }

            // Wybierz losowy efekt z sekwencji
            const effect = effectSequence[Math.floor(Math.random() * effectSequence.length)];
            element.style.position = 'relative';
            element.style.transition = 'transform 2s ease-in-out'; // Płynna zmiana
            element.style.transform = effect();
        });
    }

    function resetElements() {
        originalPositions.forEach((position, element) => {
            element.style.transition = 'transform 2s ease-in-out'; // Płynne przywracanie
            element.style.position = position.position;
            element.style.transform = position.transform;
        });
        originalPositions.clear();
    }

    function createBlinkingDots() {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.backgroundColor = 'rgba(0, 255, 0, 0.6)';
        dot.style.borderRadius = '50%';
        dot.style.top = Math.random() * window.innerHeight + 'px';
        dot.style.left = Math.random() * window.innerWidth + 'px';
        dot.style.zIndex = '9999';

        document.body.appendChild(dot);

        setTimeout(() => {
            dot.remove();
        }, Math.random() * 2000 + 1000); // Kropka znika po 1000-3000 ms
    }

    function startEffects() {
        effectSequence = [
            () => getRandomTransform(),
            () => 'scale(1)', // Przywracanie skali
            () => 'rotate(0deg)', // Przywracanie rotacji
            () => 'translate(0, 0)' // Przywracanie pozycji
        ];
        intervalId = setInterval(applyEffects, 3000); // Zmienia pozycję co 3 sekundy
        blinkIntervalId = setInterval(createBlinkingDots, 1000); // Dodaje migające kropki co 1 sekundę
    }

    function stopEffects() {
        clearInterval(intervalId);
        clearInterval(blinkIntervalId);
        intervalId = null;
        blinkIntervalId = null;
        resetElements();
    }

    startButton.addEventListener('click', () => {
        if (!intervalId) {
            localStorage.setItem('lsdEffectActive', 'true'); // Zapisz stan aktywacji w localStorage
            startEffects();
        }
    });

    stopButton.addEventListener('click', () => {
        localStorage.setItem('lsdEffectActive', 'false'); // Zapisz stan deaktywacji w localStorage
        stopEffects();
    });

    // Sprawdź stan przy ładowaniu strony
    if (localStorage.getItem('lsdEffectActive') === 'true') {
        startEffects();
    } else {
        stopEffects();
    }
})();
