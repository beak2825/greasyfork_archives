// ==UserScript==
// @name         Reddit Old
// @namespace    https://tampermonkey.net
// @version      1.21
// @description  Redirects to old.reddit.com if the user chooses to use it on Reddit's new design.
// @author       Ondry
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470764/Reddit%20Old.user.js
// @updateURL https://update.greasyfork.org/scripts/470764/Reddit%20Old.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPrompt() {
        const promptDiv = document.createElement('div');
        promptDiv.setAttribute('id', 'old-reddit-prompt');
        promptDiv.setAttribute('class', 'old-reddit-prompt');
        promptDiv.setAttribute('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 2px solid black; z-index: 9999; color: black; text-align: center;');
        const promptText = document.createElement('p');
        promptText.textContent = 'Do you want to use old Reddit?';
        promptDiv.appendChild(promptText);
        const buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('style', 'display: flex; justify-content: space-between; margin-top: 10px;');
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.addEventListener('click', redirectToOldReddit);
        buttonContainer.appendChild(yesButton);
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', closePrompt);
        buttonContainer.appendChild(noButton);
        promptDiv.appendChild(buttonContainer);
        document.body.appendChild(promptDiv);
    }

    function redirectToOldReddit() {
        window.location.href = 'https://old.reddit.com';
    }

    function closePrompt() {
        const promptDiv = document.getElementById('old-reddit-prompt');
        promptDiv.parentNode.removeChild(promptDiv);
    }

    createPrompt();
})();