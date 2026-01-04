// ==UserScript==
// @name         GeoGuessr Compact Score Display
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Compacte score display met vaste viewport-posities
// @match        https://www.geoguessr.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532426/GeoGuessr%20Compact%20Score%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/532426/GeoGuessr%20Compact%20Score%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuratie (viewport percentages)
    const CONFIG = {
        positions: [
            { left: '35%', top: '2%', id: 'score-1' },
            { left: '65%', top: '2%', id: 'score-2' }
        ],
        boxColor: '#18242c',
        boxStyle: {
            padding: '0.5vh 1.2vw',    // Compactere padding
            fontSize: 'min(4.5vw, 54px)', // Iets kleiner lettertype
            borderRadius: '8px'        // Subtielere afronding
        }
    };

    // State
    let scores = [0, 0];
    let isVisible = true;
    const scoreElements = [];

    function createScoreElements() {
        // Verwijder bestaande
        scoreElements.forEach(el => el && el.remove());
        scoreElements.length = 0;

        // Maak nieuwe elementen
        CONFIG.positions.forEach((pos, index) => {
            const el = document.createElement('div');
            el.id = pos.id;

            el.style.cssText = `
                position: fixed;
                top: ${pos.top};
                left: ${pos.left};
                transform: translate(-50%, 0);
                z-index: 9999;
                color: white;
                font-size: ${CONFIG.boxStyle.fontSize};
                font-weight: bold;
                font-family: var(--default-font), sans-serif;
                background-color: ${CONFIG.boxColor};
                padding: ${CONFIG.boxStyle.padding};
                border-radius: ${CONFIG.boxStyle.borderRadius};
                display: ${isVisible ? 'block' : 'none'};
                opacity: ${isVisible ? '1' : '0'};
                transition: opacity 0.3s ease;
                text-shadow: 0 0 5px rgba(0,0,0,0.8);
                box-shadow: 0 0 8px rgba(0,0,0,0.4);
                white-space: nowrap;
                line-height: 1.2;
            `;

            el.textContent = scores[index];
            document.body.appendChild(el);
            scoreElements.push(el);
        });
    }

    // Toggle zichtbaarheid
    function toggleVisibility() {
        isVisible = !isVisible;
        scoreElements.forEach(el => {
            if (!el) return;
            el.style.display = isVisible ? 'block' : 'none';
            setTimeout(() => el.style.opacity = isVisible ? '1' : '0', 10);
        });
    }

    // Update scores
    function updateScores() {
        scoreElements.forEach((el, index) => {
            if (el) el.textContent = scores[index];
        });
    }

    // Toetsenbord controls
    function setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Insert' || e.key === 'Home') {
                e.preventDefault();
                toggleVisibility();
                return;
            }

            if (!isVisible) return;

            switch(e.key) {
                case 'ArrowUp': scores[0]++; break;
                case 'ArrowDown': scores[0]--; break;
                case 'ArrowRight': scores[1]++; break;
                case 'ArrowLeft': scores[1]--; break;
                default: return;
            }
            updateScores();
        });
    }

    // Initialisatie
    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createScoreElements();
        setupControls();
    }

    // Start
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();