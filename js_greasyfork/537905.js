// ==UserScript==
    // @name         Play with VLC Button for scloud.ninja and Subdomains (iOS Compatible)
    // @namespace    http://tampermonkey.net/
    // @version      1.2
    // @description  Adds a Play with VLC button to each result card on scloud.ninja and its subdomains to open videos in VLC for Mobile on iOS
    // @author       Grok
    // @match        https://*.scloud.ninja/*
    // @match        https://scloud.ninja/*
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537905/Play%20with%20VLC%20Button%20for%20scloudninja%20and%20Subdomains%20%28iOS%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537905/Play%20with%20VLC%20Button%20for%20scloudninja%20and%20Subdomains%20%28iOS%20Compatible%29.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Function to create and style the VLC button
        function createVLCButton(url) {
            const button = document.createElement('button');
            button.textContent = 'Play with VLC';
            button.style.padding = '6px 12px';
            button.style.marginLeft = '10px';
            button.style.backgroundColor = '#e53e3e'; // Matches red-500 from the card
            button.style.color = 'white';
            button.style.borderRadius = '8px';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.transition = 'background-color 0.2s';
            button.onmouseover = () => button.style.backgroundColor = '#c53030';
            button.onmouseout = () => button.style.backgroundColor = '#e53e3e';
            button.onclick = () => {
                window.location.href = `vlc:// ${encodeURIComponent(url)}`;
            };
            return button;
        }

        // Find all result cards
        const resultCards = document.querySelectorAll('.result-card');

        resultCards.forEach(card => {
            // Find the input element with the URL
            const input = card.querySelector('input.copy-checkbox[data-url]');
            if (input) {
                const url = input.getAttribute('data-url');
                if (url) {
                    // Create a container for the button
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.alignItems = 'center';
                    buttonContainer.style.marginTop = '10px';

                    // Create and append the VLC button
                    const vlcButton = createVLCButton(url);
                    buttonContainer.appendChild(vlcButton);

                    // Append the button container below the card content
                    card.appendChild(buttonContainer);
                }
            }
        });
    })();