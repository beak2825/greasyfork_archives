// ==UserScript==
// @name         101soundboards generator
// @namespace    joshclark756@gmail.com
// @version      2
// @description  Generate tts messages 
// @author       joshclark756
// @match        https://www.101soundboards.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520492/101soundboards%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/520492/101soundboards%20generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minAmount = 290;
    const maxAmount = 300;

    function generateMessage(baseMessage) {
        const randomAmount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
        return `${baseMessage}`;
    }

    async function sendRequest(message, boardId) {
        const response = await fetch(`https://www.101soundboards.com/api/v1/boards/${boardId}/tts_phrase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phrase_text: message, gpt_requested: true })
        });
        return response.json();
    }

    function createGenerateButton() {
        const button = document.createElement('button');
        button.innerText = 'Generate';
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.top = '100px'; // Adjusted position
        button.style.zIndex = '1000';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            const baseMessage = prompt("Enter your message:");
            const timesToGenerate = parseInt(prompt("How many times would you like to generate this message?"), 10);
            const urlParts = window.location.href.split('/');
            const boardId = urlParts[urlParts.length - 1].split('-')[0];
            if (baseMessage && !isNaN(timesToGenerate) && timesToGenerate > 0 && boardId) {
                for (let i = 0; i < timesToGenerate; i++) {
                    const message = generateMessage(baseMessage);
                    sendRequest(message, boardId);
                }
                alert(`Message successfully sent ${timesToGenerate} times`);
            }
        });
    }

    createGenerateButton();
})();
