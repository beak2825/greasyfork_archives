// ==UserScript==
// @name         Clown Mode 🤡
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  🤡 Ultra fast spin, rainbow chaos, overlapping explosions. FPS-friendly, single overlay button, Shadow DOM toggle + keyboard shortcut.
// @author       Copilot
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544465/Clown%20Mode%20%F0%9F%A4%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/544465/Clown%20Mode%20%F0%9F%A4%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMOJI = '🤡';
    const EXPLOSION = '💥';
    let clownified = false;
    const STYLE_ID = 'clownModeStyle';
    const BUTTON_ID = 'clown-toggle-shadow-btn';
    const CONTAINER_ID = 'clown-toggle-shadow-container';

    let emojiRainInterval;
    let explosionInterval;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap');

            .clown-mode img {
                animation: spin 0.3s linear infinite;
                border: 3px dashed magenta !important;
                will-change: transform;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .clown-mode * {
                font-family: 'Rubik Mono One', cursive !important;
                animation: rainbowText 2s linear infinite;
                will-change: color;
            }

            @keyframes rainbowText {
                0%   { color: red; }
                25%  { color: orange; }
                50%  { color: yellow; }
                75%  { color: green; }
                100% { color: blue; }
            }

            @keyframes fall {
                to { top: 100vh; opacity: 0; transform: rotate(720deg); }
            }

            @keyframes pop {
                0% { transform: scale(0); opacity: 1; }
                80% { transform: scale(1.6); opacity: 0.8; }
                100% { transform: scale(1.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function spawnClowns(batchSize = 30) {
        for (let i = 0; i < batchSize; i++) {
            const clown = document.createElement('div');
            clown.textContent = EMOJI;
            clown.style.position = 'fixed';
            clown.style.left = `${Math.random() * window.innerWidth}px`;
            clown.style.top = `-50px`;
            clown.style.fontSize = '24px';
            clown.style.zIndex = '99999';
            clown.style.animation = 'fall 4s linear forwards';
            clown.style.pointerEvents = 'none';
            document.body.appendChild(clown);
            setTimeout(() => clown.remove(), 5000);
        }
    }

    function spawnExplosion() {
        const explosion = document.createElement('div');
        explosion.textContent = EXPLOSION;
        explosion.style.position = 'fixed';
        explosion.style.left = `${Math.random() * window.innerWidth}px`;
        explosion.style.top = `${Math.random() * window.innerHeight}px`;
        explosion.style.fontSize = '100px';
        explosion.style.zIndex = '99999';
        explosion.style.pointerEvents = 'none';
        explosion.style.animation = 'pop 0.4s ease-out forwards';
        explosion.style.willChange = 'transform, opacity';
        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
    }

    function activateClownMode() {
        document.body.classList.add('clown-mode');
        emojiRainInterval = setInterval(() => spawnClowns(30), 300);
        explosionInterval = setInterval(spawnExplosion, 80);
    }

    function deactivateClownMode() {
        document.body.classList.remove('clown-mode');
        clearInterval(emojiRainInterval);
        clearInterval(explosionInterval);
        document.querySelectorAll('*').forEach(el => el.style.animation = '');
    }

    function toggleClownMode() {
        clownified = !clownified;
        clownified ? activateClownMode() : deactivateClownMode();
    }

    function createShadowToggleButton() {
        if (document.getElementById(CONTAINER_ID)) return;

        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.style.position = 'fixed';
        container.style.bottom = '12px';
        container.style.left = '12px';
        container.style.zIndex = '2147483647'; // max z-index
        const shadow = container.attachShadow({ mode: 'open' });

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = EMOJI;
        btn.title = 'Toggle Clown Mode';

        // Button Style
        btn.style.all = 'unset';
        btn.style.fontSize = '32px';
        btn.style.cursor = 'pointer';
        btn.style.userSelect = 'none';
        btn.style.borderRadius = '50%';
        btn.style.padding = '10px';
        btn.style.margin = '0';
        btn.style.zIndex = '2147483647';
        btn.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
        btn.style.border = '2px solid black';
        btn.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'white';
        btn.style.color = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';

        btn.addEventListener('click', toggleClownMode);
        shadow.appendChild(btn);
        document.body.appendChild(container);
    }

    window.addEventListener('load', () => {
        injectStyle();
        createShadowToggleButton();
    });

    // ⌨️ Optional: keyboard shortcut (Ctrl + Shift + C)
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
            toggleClownMode();
        }
    });
})();