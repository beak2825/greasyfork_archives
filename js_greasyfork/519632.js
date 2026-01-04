// ==UserScript==
// @name         OGUsers Auto-Reply Grinder
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Nigga read the title.
// @author       @shiv
// @match        https://oguser.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519632/OGUsers%20Auto-Reply%20Grinder.user.js
// @updateURL https://update.greasyfork.org/scripts/519632/OGUsers%20Auto-Reply%20Grinder.meta.js
// ==/UserScript==

// MIT License
//
// Copyright (c) [year] [your name or organization]
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function() {
    'use strict';

    let customMessage = localStorage.getItem('customMessage') || "Hello OGU!";
    let delayMin = parseInt(localStorage.getItem('delayMin')) || 7000;
    let delayMax = parseInt(localStorage.getItem('delayMax')) || 10000;
    let currentDelay = delayMin;
    let refreshInterval = parseInt(localStorage.getItem('refreshInterval')) || 20;
    const randomTextLength = 10;

    const sentMessages = new Set();
    let intervalId = null;
    let countdownInterval = null;
    let countdown = 0;

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function getUniqueRandomString() {
        let randomString;
        do {
            randomString = generateRandomString(randomTextLength);
        } while (sentMessages.has(randomString));
        sentMessages.add(randomString);
        return randomString;
    }

    function populateTextBox() {
        const textBox = document.querySelector('#message');
        if (textBox) {
            const randomText = `[${getUniqueRandomString()}]`;
            textBox.value = `${customMessage} ${randomText}`;
            console.log(`Populated: ${customMessage} ${randomText}`);
        } else {
            console.error("Could not find the text box.");
        }
    }

    function startScript() {
        if (!intervalId) {
            intervalId = setInterval(populateTextBox, currentDelay);
            console.log("Script resumed.");
            startCountdown();
            localStorage.setItem('scriptRunning', 'true');
        }
    }

    function stopScript() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            console.log("Script paused.");
            stopCountdown();
            localStorage.setItem('scriptRunning', 'false');
        }
    }

    function startCountdown() {
        countdown = currentDelay / 1000;
        countdownInterval = setInterval(updateCountdown, 10);
    }

    function updateCountdown() {
        countdown -= 0.01;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdown = 0;
            const postButton = document.querySelector('#quick_reply_submit');
            const spinner = document.querySelector('#quickreply_spinner');
            const quickReplyMessage = document.querySelector('.jGrowl-message');

            if (spinner && spinner.style.display !== 'none') {
                console.log("Spinner is visible. Skipping click.");
            } else if (quickReplyMessage) {
                console.log("Quick reply detected. Attempting to click Post Reply again.");
                postButton.click();
            } else if (postButton) {
                postButton.click();
                console.log("Post Reply button clicked.");
            }
        }
        updateCountdownDisplay();
    }

    function updateCountdownDisplay() {
        const countdownDisplay = document.querySelector('#countdownDisplay');
        if (countdownDisplay) {
            countdownDisplay.textContent = `Next Post in: ${countdown.toFixed(2)}s`;
        }
    }

    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    function addControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.bottom = '10px';
        controlsContainer.style.right = '10px';
        controlsContainer.style.zIndex = '1000';
        controlsContainer.style.backgroundColor = '#242424';
        controlsContainer.style.color = '#fff';
        controlsContainer.style.padding = '10px';
        controlsContainer.style.borderRadius = '5px';
        controlsContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.flexDirection = 'column';
        controlsContainer.style.gap = '10px';

        const countdownContainer = document.createElement('div');
        countdownContainer.id = 'countdownDisplay';
        countdownContainer.style.fontSize = '14px';
        countdownContainer.style.color = '#fff';
        countdownContainer.style.textAlign = 'center';
        countdownContainer.textContent = `Next Post in: 0.00s`;
        controlsContainer.appendChild(countdownContainer);

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = 'Enter message';
        messageInput.value = customMessage;
        messageInput.style.height = '30px';
        messageInput.style.borderRadius = '5px';
        messageInput.style.border = 'none';
        messageInput.style.padding = '0 10px';
        messageInput.style.textOverflow = 'ellipsis';
        messageInput.style.overflow = 'hidden';
        messageInput.style.whiteSpace = 'nowrap';
        messageInput.style.backgroundColor = '#333';
        messageInput.style.color = '#fff';
        messageInput.oninput = () => {
            customMessage = messageInput.value;
            localStorage.setItem('customMessage', customMessage);
            console.log(`Custom message updated: ${customMessage}`);
        };

        const delayInputContainer = document.createElement('div');
        delayInputContainer.style.display = 'flex';
        delayInputContainer.style.flexDirection = 'column';
        delayInputContainer.style.gap = '10px';

        const delayMinContainer = document.createElement('div');
        delayMinContainer.style.display = 'flex';
        delayMinContainer.style.justifyContent = 'space-between';
        delayMinContainer.style.alignItems = 'center';

        const delayMinInput = document.createElement('input');
        delayMinInput.type = 'number';
        delayMinInput.value = delayMin;
        delayMinInput.style.height = '30px';
        delayMinInput.style.width = '80px';
        delayMinInput.style.borderRadius = '5px';
        delayMinInput.style.border = 'none';
        delayMinInput.style.padding = '0 10px';
        delayMinInput.style.textAlign = 'center';
        delayMinInput.style.backgroundColor = '#333';
        delayMinInput.style.color = '#fff';
        delayMinInput.oninput = () => {
            delayMin = parseInt(delayMinInput.value);
            localStorage.setItem('delayMin', delayMin);
            currentDelay = Math.max(delayMin, delayMax);
            console.log(`Delay min updated: ${delayMin}`);
        };

        const delayMinLabel = document.createElement('span');
        delayMinLabel.textContent = 'Delay Min (ms)';
        delayMinLabel.style.color = '#fff';
        delayMinLabel.style.fontSize = '14px';
        delayMinLabel.style.marginRight = '10px';

        delayMinContainer.appendChild(delayMinInput);
        delayMinContainer.appendChild(delayMinLabel);

        const delayMaxContainer = document.createElement('div');
        delayMaxContainer.style.display = 'flex';
        delayMaxContainer.style.justifyContent = 'space-between';
        delayMaxContainer.style.alignItems = 'center';

        const delayMaxInput = document.createElement('input');
        delayMaxInput.type = 'number';
        delayMaxInput.value = delayMax;
        delayMaxInput.style.height = '30px';
        delayMaxInput.style.width = '80px';
        delayMaxInput.style.borderRadius = '5px';
        delayMaxInput.style.border = 'none';
        delayMaxInput.style.padding = '0 10px';
        delayMaxInput.style.textAlign = 'center';
        delayMaxInput.style.backgroundColor = '#333';
        delayMaxInput.style.color = '#fff';
        delayMaxInput.oninput = () => {
            delayMax = parseInt(delayMaxInput.value);
            localStorage.setItem('delayMax', delayMax);
            currentDelay = Math.max(delayMin, delayMax);
            console.log(`Delay max updated: ${delayMax}`);
        };

        const delayMaxLabel = document.createElement('span');
        delayMaxLabel.textContent = 'Delay Max (ms)';
        delayMaxLabel.style.color = '#fff';
        delayMaxLabel.style.fontSize = '14px';
        delayMaxLabel.style.marginRight = '10px';

        delayMaxContainer.appendChild(delayMaxInput);
        delayMaxContainer.appendChild(delayMaxLabel);

        delayInputContainer.appendChild(delayMinContainer);
        delayInputContainer.appendChild(delayMaxContainer);

        const refreshInputContainer = document.createElement('div');
        refreshInputContainer.style.display = 'flex';
        refreshInputContainer.style.justifyContent = 'space-between';
        refreshInputContainer.style.alignItems = 'center';

        const refreshInput = document.createElement('input');
        refreshInput.type = 'number';
        refreshInput.value = refreshInterval;
        refreshInput.style.height = '30px';
        refreshInput.style.width = '80px';
        refreshInput.style.borderRadius = '5px';
        refreshInput.style.border = 'none';
        refreshInput.style.padding = '0 10px';
        refreshInput.style.textAlign = 'center';
        refreshInput.style.backgroundColor = '#333';
        refreshInput.style.color = '#fff';
        refreshInput.oninput = () => {
            refreshInterval = parseInt(refreshInput.value);
            localStorage.setItem('refreshInterval', refreshInterval);
            console.log(`Refresh interval updated: ${refreshInterval}`);
        };

        const refreshLabel = document.createElement('span');
        refreshLabel.textContent = 'Auto-Refresh (s)';
        refreshLabel.style.color = '#fff';
        refreshLabel.style.fontSize = '14px';
        refreshLabel.style.marginRight = '10px';

        refreshInputContainer.appendChild(refreshInput);
        refreshInputContainer.appendChild(refreshLabel);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.gap = '10px';

        const resumeButton = document.createElement('button');
        resumeButton.textContent = 'Resume';
        resumeButton.style.flex = '1';
        resumeButton.style.height = '30px';
        resumeButton.style.borderRadius = '5px';
        resumeButton.style.border = 'none';
        resumeButton.style.backgroundColor = '#242424';
        resumeButton.style.color = '#fff';
        resumeButton.style.cursor = 'pointer';
        resumeButton.onclick = startScript;

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pause';
        pauseButton.style.flex = '1';
        pauseButton.style.height = '30px';
        pauseButton.style.borderRadius = '5px';
        pauseButton.style.border = 'none';
        pauseButton.style.backgroundColor = '#242424';
        pauseButton.style.color = '#fff';
        pauseButton.style.cursor = 'pointer';
        pauseButton.onclick = stopScript;

        buttonContainer.appendChild(resumeButton);
        buttonContainer.appendChild(pauseButton);

        controlsContainer.appendChild(countdownContainer);
        controlsContainer.appendChild(messageInput);
        controlsContainer.appendChild(delayInputContainer);
        controlsContainer.appendChild(refreshInputContainer);
        controlsContainer.appendChild(buttonContainer);
        document.body.appendChild(controlsContainer);
    }

    addControls();
    if (localStorage.getItem('scriptRunning') === 'true') {
        startScript();
    } else {
        stopScript();
    }

    setInterval(() => {
        location.reload();
    }, refreshInterval * 1000);
})();
