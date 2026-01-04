// ==UserScript==
// @name         RSS: FreshRSS Read Aloud (Obsolete)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Read aloud the current article in FreshRSS or the text from a webpage using a custom TTS API
// @author       Your Name
// @homepage     https://greasyfork.org/en/scripts/526473
// @match        http://192.168.1.2:1030/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/526473/RSS%3A%20FreshRSS%20Read%20Aloud%20%28Obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526473/RSS%3A%20FreshRSS%20Read%20Aloud%20%28Obsolete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract text from the webpage or FreshRSS article
    function extractText() {
        const isFreshRSS = document.querySelector('.flux_content') !== null;
        if (isFreshRSS) {
            const articleContent = document.querySelector('.flux.active.current .flux_content .text');
            if (articleContent) {
                let text = articleContent.innerText.trim();

                // Remove "Summarize" from the beginning and end
                if (text.startsWith('✨Summarize')) {
                    text = text.substring('✨Summarize'.length).trim();
                }
                if (text.endsWith('✨Summarize')) {
                    text = text.substring(0, text.length - '✨Summarize'.length).trim();
                }

                return text;
            }
        } else {
            const elementsToRemove = document.querySelectorAll('script, style');
            elementsToRemove.forEach(el => el.remove());
            return document.body.innerText.trim();
        }
        return null;
    }

    // Function to check if the text contains Chinese characters
    function containsChinese(text) {
        const chineseRegex = /[\u4e00-\u9fa5]/;
        return chineseRegex.test(text);
    }

    // Function to fetch and set audio source
    async function fetchAudioSource() {
        const text = extractText();
        if (!text) {
            throw new Error('No text content found on the webpage.');
        }

        const audioPlayer = document.getElementById('tts-audio');
        let apiUrl = `http://192.168.1.2:1209/api/tts?download=true&shardLength=10000&thread=1000&text=${encodeURIComponent(text)}`;

        // Add voiceName parameter only if the text does NOT contain Chinese characters
        if (!containsChinese(text)) {
            apiUrl += '&voiceName=en-US-AndrewNeural';
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = new Blob([response.response], { type: 'audio/mpeg' });
                        const url = URL.createObjectURL(blob);

                        // Clean up old URL if it exists
                        if (audioPlayer.dataset.blobUrl) {
                            URL.revokeObjectURL(audioPlayer.dataset.blobUrl);
                        }
                        audioPlayer.dataset.blobUrl = url;
                        audioPlayer.src = url;
                        resolve();
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network request failed: ' + error.message));
                }
            });
        });
    }

    // Function to display a message at the center of the screen
    function showMessage(message) {
        const existingMessage = document.getElementById('tts-message');
        if (existingMessage) {
            existingMessage.textContent = message;
            return existingMessage;
        }

        const messageElement = document.createElement('div');
        messageElement.id = 'tts-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        `;
        document.body.appendChild(messageElement);
        return messageElement;
    }

    // Function to remove the message
    function removeMessage() {
        const messageElement = document.getElementById('tts-message');
        if (messageElement) {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 500);
        }
    }

    // Initialize the audio player
    function initializeAudioPlayer() {
        const container = document.createElement('div');
        container.id = 'tts-audio-container';
        container.style.cssText = 'display: inline-block; margin: 0; padding: 0; vertical-align: middle; margin-top: 8px;';

        const audioPlayer = document.createElement('audio');
        audioPlayer.id = 'tts-audio';
        audioPlayer.controls = true;
        audioPlayer.style.cssText = 'width: 50px; height: 20px; opacity: 0.3; margin: 0; padding: 0;';
        audioPlayer.innerHTML = 'Your browser does not support the audio element.';

        let isInitialPlay = true;

        audioPlayer.addEventListener('play', async (e) => {
            if (isInitialPlay) {
                e.preventDefault();
                audioPlayer.pause();

                const messageElement = showMessage('Preparing audio...');

                try {
                    await fetchAudioSource();
                    isInitialPlay = false;
                    audioPlayer.play();
                } catch (error) {
                    console.error('Error fetching audio:', error);
                    messageElement.textContent = 'Error preparing audio';
                    setTimeout(removeMessage, 2000);
                    isInitialPlay = true;
                }
            }
        });

        audioPlayer.addEventListener('playing', () => {
            removeMessage();
        });

        audioPlayer.addEventListener('ended', () => {
            if (audioPlayer.dataset.blobUrl) {
                URL.revokeObjectURL(audioPlayer.dataset.blobUrl);
                delete audioPlayer.dataset.blobUrl;
            }
            audioPlayer.src = '';
            isInitialPlay = true;
        });

        container.appendChild(audioPlayer);

        // Find the last .group div and insert the audio player after it
        const lastGroupDiv = document.querySelector('.group:last-of-type');
        if (lastGroupDiv) {
            lastGroupDiv.parentNode.insertBefore(container, lastGroupDiv.nextSibling);
        } else {
            console.error('Could not find the last .group element.');
        }
    }

    // Initialize the audio player
    initializeAudioPlayer();
})();