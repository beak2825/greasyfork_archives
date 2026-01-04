// ==UserScript==
// @name         Bo3 & Custom BG - Game Master Mode
// @namespace    NK GeoGuessr plugin
// @version      1.0.1
// @description  Change the background of the gamemaster mode to a custom image, modify the existing SVG, and add big-zero elements with a delay.
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/yzhD2N9.png
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/531372/Bo3%20%20Custom%20BG%20-%20Game%20Master%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/531372/Bo3%20%20Custom%20BG%20-%20Game%20Master%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // URL van de achtergrondafbeelding (vervang dit door je eigen URL)
    const backgroundImageUrl = "https://i.imgur.com/KBKHefn.png";

    // Aangepaste SVG-code voor de notch
    const customSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1482" height="140" viewBox="-30 0 1482 140" fill="none">
            <path d="M0,0c2.2,8.9,10.2,15.1,19.4,15.1h280.7c14.5,0,27.8,7.8,34.9,20.4l44,76.6c7.1,12.6,20.4,20.5,34.9,20.5h585.8c15.4,0,29.4-8.8,36-22.6l44.5-72.2c6.7-13.8,20.7-22.6,36-22.6h279.1c9.2,0,17.2-6.2,19.4-15.1" fill="#10101C"></path>
        </svg>
    `;

    // Variabelen om de cijfers bij te houden
    let number1 = 0;
    let number2 = 0;
    let numbersVisible = false;

    // Referenties naar de big-zero elementen
    let bigZero1, bigZero2;

    // Functie om de cijfers bij te werken
    const updateNumbers = () => {
        if (bigZero1) bigZero1.innerHTML = number1;
        if (bigZero2) bigZero2.innerHTML = number2;
    };

    // Functie om de zichtbaarheid van de cijfers te wisselen
    const toggleNumbersVisibility = () => {
        numbersVisible = !numbersVisible;
        if (bigZero1) bigZero1.style.display = numbersVisible ? 'block' : 'none';
        if (bigZero2) bigZero2.style.display = numbersVisible ? 'block' : 'none';
    };

    // Functie om wijzigingen toe te passen
    const applyChanges = () => {
        // Pas de achtergrond van gamemaster-modus aan
        const gmBackground = document.querySelector('[class*="gamemaster-mode_"]');
        if (gmBackground) {
            gmBackground.style.background = `url('${backgroundImageUrl}') no-repeat center center/cover`;
        }

        // Pas de achtergrond van de body aan
        document.body.style.background = `url('${backgroundImageUrl}') no-repeat center center/cover`;

        // Pas de achtergrond van de round wrapper aan
        const roundWrapper = document.querySelector('[class*="views_activeRoundWrapper__"]');
        if (roundWrapper) {
            roundWrapper.style.background = `url('${backgroundImageUrl}') no-repeat center center/cover`;
        }

        // Pas de bestaande SVG aan (met een vertraging van 2 seconden)
        setTimeout(() => {
            const shieldContainer = document.querySelector('.game-notch_shield__YiqT7');
            if (shieldContainer) {
                const existingSVG = shieldContainer.querySelector('svg');
                if (existingSVG) {
                    shieldContainer.innerHTML = customSVG;
                }
            }
        }, 2000); // 2000 milliseconden = 2 seconden
    };

    // Voeg de twee big-zero elementen toe (met een vertraging van 2 seconden)
    const addBigZeroElements = () => {
        setTimeout(() => {
            // Maak de big-zero elementen alleen als ze nog niet bestaan
            if (!bigZero1) {
                bigZero1 = document.createElement('div');
                bigZero1.style.position = 'fixed';
                bigZero1.style.top = '55px';
                bigZero1.style.left = '765px';
                bigZero1.style.fontSize = '60px';
                bigZero1.style.fontWeight = 'bold';
                bigZero1.style.color = 'white';
                bigZero1.style.zIndex = '9999';
                bigZero1.style.transform = 'translate(-50%, -50%)';
                bigZero1.style.fontFamily = 'var(--default-font)';
                bigZero1.style.webkitFontSmoothing = 'antialiased';
                bigZero1.style.mozOsxFontSmoothing = 'grayscale';
                bigZero1.style.textShadow = '0 0 4px rgba(0, 0, 0, 0.5)';
                bigZero1.style.display = 'none'; // Standaard verborgen
                bigZero1.innerHTML = number1;
                document.body.appendChild(bigZero1);
            }

            if (!bigZero2) {
                bigZero2 = document.createElement('div');
                bigZero2.style.position = 'fixed';
                bigZero2.style.top = '55px';
                bigZero2.style.left = '1145px';
                bigZero2.style.fontSize = '60px';
                bigZero2.style.fontWeight = 'bold';
                bigZero2.style.color = 'white';
                bigZero2.style.zIndex = '9999';
                bigZero2.style.transform = 'translate(-50%, -50%)';
                bigZero2.style.fontFamily = 'var(--default-font)';
                bigZero2.style.webkitFontSmoothing = 'antialiased';
                bigZero2.style.mozOsxFontSmoothing = 'grayscale';
                bigZero2.style.textShadow = '0 0 4px rgba(0, 0, 0, 0.5)';
                bigZero2.style.display = 'none'; // Standaard verborgen
                bigZero2.innerHTML = number2;
                document.body.appendChild(bigZero2);
            }
        }, 2000); // 2000 milliseconden = 2 seconden
    };

    // Voeg toetsenbordshortcuts toe voor elk cijfer
    const addKeyboardShortcuts = () => {
        document.addEventListener('keydown', (event) => {
            // INS-toets om zichtbaarheid te wisselen
            if (event.key === 'Insert') {
                toggleNumbersVisibility();
            }

            // Alleen reageren op pijltjestoetsen als de cijfers zichtbaar zijn
            if (!numbersVisible) return;

            if (event.key === 'ArrowUp') {
                number1++; // Verhoog het eerste cijfer
                updateNumbers();
            } else if (event.key === 'ArrowDown') {
                number1--; // Verlaag het eerste cijfer
                updateNumbers();
            } else if (event.key === 'ArrowRight') {
                number2++; // Verhoog het tweede cijfer
                updateNumbers();
            } else if (event.key === 'ArrowLeft') {
                number2--; // Verlaag het tweede cijfer
                updateNumbers();
            }
        });
    };

    // Voer de wijzigingen uit zodra de pagina is geladen
    window.addEventListener('load', () => {
        applyChanges();
        addBigZeroElements();
        addKeyboardShortcuts();
    });

    // Voer de wijzigingen uit wanneer de DOM wordt gewijzigd
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                applyChanges();
                addBigZeroElements();
                break; // Stop na de eerste wijziging om overbodige uitvoeringen te voorkomen
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();