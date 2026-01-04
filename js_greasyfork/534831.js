// ==UserScript==
// @name         kassellabs watermark/ads remover
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  Remove watermark and ads from starwarsintrocreator.kassellabs.io and add a fullscreen button
// @author       You
// @match        https://starwarsintrocreator.kassellabs.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kassellabs.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534831/kassellabs%20watermarkads%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/534831/kassellabs%20watermarkads%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStylesheet(cssString) {
        const style = document.createElement('style');
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    addStylesheet(`
        svg {
            filter: opacity(0);
        }
        #playing-download-button {
            display: none;
        }
        .help-button {
            display: none;
        }
        footer {
            display: none;
        }
        #playButtonSpan {
            display: none;
        }
        #downloadButton {
            display: none !important;
        }
    `);

    document.addEventListener('fullscreenchange', () => {
        const buttonsDiv = document.querySelector('.playing-buttons');
        if (buttonsDiv && !document.fullscreenElement) {
            buttonsDiv.style.display = 'flex';
        }
    });

    window.addEventListener("load", (event) => {
        const buttonsDiv = document.querySelector('.playing-buttons');
        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'playing-button';
        fullscreenButton.textContent = 'fullscreen';
        fullscreenButton.onclick = () => {
            document.getElementById("animationContainer").requestFullscreen()
            buttonsDiv.style.display = "none";
        };
        if (buttonsDiv) {
            buttonsDiv.appendChild(fullscreenButton);
        } else {
            console.error('Target div not found.');
        }
    });

    function addFullscreenButton() {
        const buttonsDiv = document.querySelector('.playing-buttons');
        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'playing-button';
        fullscreenButton.textContent = 'fullscreen';
        fullscreenButton.onclick = () => {
            document.getElementById("animationContainer").requestFullscreen()
            buttonsDiv.style.display = "none";
        };
        if (buttonsDiv) {
            buttonsDiv.appendChild(fullscreenButton);
        } else {
            console.error('Target div not found.');
        }
    }

    document.getElementById("requestInteractionButton").addEventListener("click", (event) => {
        setTimeout(addFullscreenButton, 100);
    });

    document.getElementById("playButton").addEventListener("click", (event) => {
        setTimeout(addFullscreenButton, 300);
    });

})();