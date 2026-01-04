// ==UserScript==
// @name         Drawaria Enhancer (Word + Timer Highlight)
// @namespace    https://drawaria.online/
// @version      1.3
// @description  Displays the secret word clearly when drawing and highlights the timer. Fully compatible with Violentmonkey. No language is forced.
// @author       Lucas
// @match        *://drawaria.online/*
// @icon         https://drawaria.online/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541654/Drawaria%20Enhancer%20%28Word%20%2B%20Timer%20Highlight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541654/Drawaria%20Enhancer%20%28Word%20%2B%20Timer%20Highlight%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showDrawingWord() {
        const wordElement = document.querySelector('.drawer-word');
        const existingDisplay = document.getElementById('drawingWordDisplay');

        if (wordElement && wordElement.textContent.trim() !== '' && !existingDisplay) {
            const container = document.createElement('div');
            container.id = 'drawingWordDisplay';
            container.textContent = '🎨 Word: ' + wordElement.textContent.trim();
            container.style.position = 'fixed';
            container.style.top = '80px';
            container.style.left = '10px';
            container.style.padding = '10px 15px';
            container.style.background = 'rgba(0, 0, 0, 0.7)';
            container.style.color = '#ffffff';
            container.style.fontSize = '20px';
            container.style.fontWeight = 'bold';
            container.style.borderRadius = '10px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        // Remove the display if you're no longer the drawer
        if (!wordElement && existingDisplay) {
            existingDisplay.remove();
        }
    }

    function highlightRoundTimer() {
        const timer = document.querySelector('.round-timer');
        if (timer) {
            timer.style.color = '#ff4444';
            timer.style.fontSize = '24px';
            timer.style.fontWeight = 'bold';
        }
    }

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        showDrawingWord();
        highlightRoundTimer();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case elements are already loaded
    setTimeout(() => {
        showDrawingWord();
        highlightRoundTimer();
    }, 1500);
})();
