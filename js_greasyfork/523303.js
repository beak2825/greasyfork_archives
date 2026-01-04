// ==UserScript==
// @name         YouTube Live Auto Post Bot
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Auto post in YouTube live chat with random/sequence word
// @author       YAD
// @license      MIT
// @match        https://www.youtube.com/live_chat*
// @icon         https://media.tenor.com/AF1NkMoUOVMAAAAi/blue-red.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523303/YouTube%20Live%20Auto%20Post%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/523303/YouTube%20Live%20Auto%20Post%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let words = ['Hello', 'Good vibes', 'Stay positive'];
    let interval = 60;
    let postInterval;
    let countdown = interval;
    let randomPost = false;
    let wordIndex = 0;
    let firstPostWord = '';
    let isFirstPost = true;

    // Load saved settings from localStorage
    function loadSettings() {
        const savedInterval = localStorage.getItem('autoPostInterval');
        const savedWords = localStorage.getItem('autoPostWords');
        const savedRandomPost = localStorage.getItem('autoPostRandom');

        if (savedInterval) {
            interval = parseInt(savedInterval, 10);
        }
        if (savedWords) {
            words = savedWords.split(',').map(word => word.trim());
        }
        if (savedRandomPost) {
            randomPost = savedRandomPost === 'true';
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('autoPostInterval', interval.toString());
        localStorage.setItem('autoPostWords', words.join(', '));
        localStorage.setItem('autoPostRandom', randomPost.toString());
    }

    function postMessage(wordToPost) {
        const container = document.querySelector('#container.style-scope.yt-live-chat-message-input-renderer');
        if (!container) {
            console.log('Live chat container not found.');
            return;
        }

        const chatInput = container.querySelector('[contenteditable]');
        const sendButton = container.querySelector('button[aria-label="Send"]');

        if (chatInput && sendButton) {
            chatInput.focus();
            chatInput.textContent = wordToPost;

            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, composed: true });
            chatInput.dispatchEvent(inputEvent);

            setTimeout(() => {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window
                });
                sendButton.dispatchEvent(clickEvent);

                console.log(`Posted: ${wordToPost}`);
            }, 100);
        } else {
            console.log('Chat input or send button not found.');
        }
    }

    function startAutoPosting(modal) {
        if (!firstPostWord) {
            console.log('No word to post. Please enter a word in the input.');
            return;
        }

        if (!postInterval) { // Only start if not already running
            postInterval = setInterval(() => {
                if (countdown <= 0) {
                    const wordToPost = randomPost ? words[Math.floor(Math.random() * words.length)] : words[wordIndex];
                    postMessage(wordToPost);

                    if (!randomPost) {
                        wordIndex = (wordIndex + 1) % words.length;
                    }

                    countdown = interval;
                } else {
                    countdown--;
                }
                updateCountdownDisplay();
            }, 1000);

            console.log(`Auto posting started. Interval: ${interval} seconds.`);
        }
        if (modal) modal.style.display = 'none'; // Close the modal
    }

    function stopAutoPosting() {
        if (postInterval) {
            clearInterval(postInterval);
            postInterval = null;
            console.log('Auto posting stopped.');
        }

        countdown = interval;
        updateCountdownDisplay();

        const button = document.querySelector('#auto-post-button');
        if (button) {
            button.textContent = '🤖';
            button.style.border = '3px solid #dc0000';
        }
    }

    function updateCountdownDisplay() {
        const button = document.querySelector('#auto-post-button');
        if (button) {
            button.textContent = countdown > 0 ? `${countdown}` : '🤖';
            adjustButtonSize(button);
            button.style.border = postInterval ? '3px solid #4caf50' : '3px solid #dc0000';
        }
    }

    function adjustButtonSize(button) {
        button.style.width = '50px';
        button.style.height = '50px';

        const countdownLength = countdown.toString().length;

        if (countdownLength === 1) {
            button.style.fontSize = '2rem';
        } else if (countdownLength === 2) {
            button.style.fontSize = '1.7rem';
        } else if (countdownLength === 3) {
            button.style.fontSize = '1.5rem';
        } else if (countdownLength >= 4) {
            button.style.fontSize = '1.2rem';
        }
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#2a2a2a';
        modal.style.color = '#ecf0f1';
        modal.style.padding = '20px';
        modal.style.borderRadius = '10px';
        modal.style.border = '3px solid #dc0000';
        modal.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        modal.style.zIndex = '10000';
        modal.style.display = 'none';
        modal.style.transition = 'all 0.3s ease-in-out';

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Interval (seconds): ';
        intervalLabel.style.display = 'block';
        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = interval;
        intervalInput.min = 5;
        intervalInput.style.marginBottom = '10px';
        intervalInput.style.padding = '5px';
        intervalInput.style.borderRadius = '5px';
        intervalInput.style.border = '1px solid #bdc3c7';
        intervalInput.style.width = '95%';

        intervalInput.onchange = () => {
            const userInput = parseInt(intervalInput.value);
            if (userInput < 5) {
                intervalInput.value = 5;
                alert('Interval cannot be less than 5 seconds. Setting interval to 5 seconds.');
            }
        };

        const wordsLabel = document.createElement('label');
        wordsLabel.textContent = 'Words (comma-separated): ';
        wordsLabel.style.display = 'block';
        const wordsInput = document.createElement('input');
        wordsInput.type = 'text';
        wordsInput.value = words.join(', ');
        wordsInput.style.marginBottom = '10px';
        wordsInput.style.padding = '5px';
        wordsInput.style.borderRadius = '5px';
        wordsInput.style.border = '1px solid #bdc3c7';
        wordsInput.style.width = '95%';

        const randomCheckboxLabel = document.createElement('label');
        randomCheckboxLabel.textContent = 'Random Word Posting: ';
        randomCheckboxLabel.style.display = 'inline-block';
        randomCheckboxLabel.style.verticalAlign = 'middle';
        randomCheckboxLabel.style.marginRight = '0px';

        const randomCheckbox = document.createElement('input');
        randomCheckbox.type = 'checkbox';
        randomCheckbox.checked = randomPost;
        randomCheckbox.style.verticalAlign = 'middle';
        randomCheckbox.onchange = () => {
            randomPost = randomCheckbox.checked;
            wordIndex = 0;
        };

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.style.backgroundColor = '#4caf50';
        startButton.style.color = '#fff';
        startButton.style.padding = '10px 20px';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.marginRight = '5px';
        startButton.style.transition = 'all 0.1s ease';

        startButton.onmouseover = () => startButton.style.backgroundColor = '#2ecc71';
        startButton.onmouseout = () => startButton.style.backgroundColor = '#27ae60';

        startButton.onmousedown = () => startButton.style.transform = 'scale(0.95)';
        startButton.onmouseup = startButton.onmouseleave = () => startButton.style.transform = 'scale(1)';

        startButton.onclick = () => {
            interval = parseInt(intervalInput.value);
            words = wordsInput.value.split(',').map(word => word.trim());
            firstPostWord = words[0];
            saveSettings();
            startAutoPosting(modal);
        };

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style.backgroundColor = '#f00756';
        stopButton.style.color = '#fff';
        stopButton.style.padding = '10px 20px';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.marginRight = '5px';
        stopButton.style.transition = 'all 0.1s ease';

        stopButton.onmouseover = () => stopButton.style.backgroundColor = '#c0392b';
        stopButton.onmouseout = () => stopButton.style.backgroundColor = '#e74c3c';

        stopButton.onmousedown = () => stopButton.style.transform = 'scale(0.95)';
        stopButton.onmouseup = stopButton.onmouseleave = () => stopButton.style.transform = 'scale(1)';

        stopButton.onclick = stopAutoPosting;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '4px';
        closeButton.style.backgroundColor = '#636566';
        closeButton.style.color = '#fff';
        closeButton.style.padding = '1px 5px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'all 0.1s ease';

        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#525354';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#636566';

        closeButton.onmousedown = () => closeButton.style.transform = 'scale(0.95)';
        closeButton.onmouseup = closeButton.onmouseleave = () => closeButton.style.transform = 'scale(1)';

        closeButton.onclick = () => {
            modal.style.display = 'none';
        };

        modal.appendChild(closeButton);
        modal.appendChild(intervalLabel);
        modal.appendChild(intervalInput);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(wordsLabel);
        modal.appendChild(wordsInput);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(randomCheckboxLabel);
        modal.appendChild(randomCheckbox);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(startButton);
        modal.appendChild(stopButton);

        document.body.appendChild(modal);

        const openButton = document.createElement('button');
        openButton.id = 'auto-post-button';
        openButton.textContent = '🤖';
        openButton.style.position = 'fixed';
        openButton.style.bottom = '20px';
        openButton.style.right = '20px';
        openButton.style.backgroundColor = '#2a2a2a';
        openButton.style.color = '#fff';
        openButton.style.padding = '10px';
        openButton.style.border = '3px solid #dc0000';
        openButton.style.borderRadius = '50%';
        openButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
        openButton.style.cursor = 'pointer';
        openButton.style.fontSize = '1.8rem';
        openButton.style.zIndex = '630';
        openButton.style.transition = 'transform 0.3s ease';
        openButton.onmouseover = () => openButton.style.transform = 'scale(1.1)';
        openButton.onmouseout = () => openButton.style.transform = 'scale(1)';
        openButton.onclick = () => {
            modal.style.display = 'block';
        };

        console.log('Appending openButton to document.body');
        document.body.appendChild(openButton);
        console.log('openButton appended:', document.querySelector('#auto-post-button')); // Debug
    }

    loadSettings();

    if (document.readyState === 'complete') {
        console.log('DOM ready, calling createModal');
        createModal();
    } else {
        console.log('DOM not ready, adding load listener');
        window.addEventListener('load', () => {
            console.log('DOM loaded, calling createModal');
            createModal();
        });
    }
})();