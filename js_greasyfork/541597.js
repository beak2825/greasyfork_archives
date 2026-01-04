// ==UserScript==
// @name         Discord Spam Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a GUI to spam a word in Discord
// @author       Benjamin Herasme
// @match        *://discord.com/*
// @match        *://discordapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541597/Discord%20Spam%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/541597/Discord%20Spam%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '9999';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter word to spam';
    input.style.width = '150px';
    input.style.padding = '5px';
    input.style.marginRight = '5px';

    const button = document.createElement('button');
    button.textContent = 'Spam';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';

    container.appendChild(input);
    container.appendChild(button);

    document.body.appendChild(container);

    // Function to spam the word
    function spamWord(word) {
        const interval = setInterval(() => {
            const channel = document.querySelector('[data-channel-id]');
            if (channel) {
                const textArea = channel.querySelector('textarea');
                if (textArea) {
                    textArea.focus();
                    textArea.value = word;
                    textArea.dispatchEvent(new Event('input', { bubbles: true }));
                    textArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                }
            }
        }, 1000); // Send message every second
    }

    // Add event listener to the button
    button.addEventListener('click', () => {
        const word = input.value;
        if (word) {
            spamWord(word);
        }
    });
})();