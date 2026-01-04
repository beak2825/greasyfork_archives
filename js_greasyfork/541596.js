// ==UserScript==
// @name         Nitro Type Auto Typer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto typer for Nitro Type with 150 WPM and 100% accuracy
// @author       Benjamin Herasme
// @match        *://www.nitrotype.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541596/Nitro%20Type%20Auto%20Typer.user.js
// @updateURL https://update.greasyfork.org/scripts/541596/Nitro%20Type%20Auto%20Typer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate typing
    function typeText(text) {
        let index = 0;
        const interval = 1000 / 150; // 150 WPM means 1000 ms per 150 words, so ~6.67 ms per character
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                const inputField = document.querySelector('.race-input');
                if (inputField) {
                    inputField.value += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            } else {
                clearInterval(typeInterval);
            }
        }, interval);
    }

    // Function to start the auto typer
    function startAutoTyper() {
        const raceText = document.querySelector('.race-text').innerText;
        typeText(raceText);
    }

    // Wait for the race to start and then start typing
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const raceText = document.querySelector('.race-text');
                if (raceText) {
                    startAutoTyper();
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();