// ==UserScript==
// @name         MP3 to Transcript with Auto-Detection and Persistent Storage
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Automatically scan the last conversation message for MP3 links, transcribe them, and avoid duplicates using local storage. Limits to 3 entries.
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518879/MP3%20to%20Transcript%20with%20Auto-Detection%20and%20Persistent%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/518879/MP3%20to%20Transcript%20with%20Auto-Detection%20and%20Persistent%20Storage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to get API key from local storage or prompt user to input it
    function getApiKey() {
        let apiKey = localStorage.getItem('google_cloud_api_key');
        if (!apiKey) {
            apiKey = prompt("Please enter your Google Cloud API key for speech recognition:");
            if (apiKey) {
                localStorage.setItem('google_cloud_api_key', apiKey);
            } else {
                alert("API key is required to proceed.");
                return null;
            }
        }
        return apiKey;
    }

    // Fetch the API key
    let API_KEY = getApiKey();
    if (!API_KEY) {
        return; // Exit if no API key provided
    }

    const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`;

    // Create a button to toggle the transcription panel
    const toggleButton = document.createElement('div');
    toggleButton.innerHTML = `
        <button id="toggle-transcription-panel" style="position: relative; top: 10px; right: 0px; left: 10px; padding: 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; z-index: 1001;">Show MP3 Transcription Tool</button>
    `;

    // Append the button to DCstoragePanel if available, otherwise to the body
DCstoragePanel.appendChild(toggleButton);

    // Add a simple panel to the webpage
    const panelHTML = `
        <div id="transcription-panel" style="display: none;">
            <h3>MP3 Transcription Tool</h3>
            <input type="text" id="mp3-url" placeholder="Enter MP3 URL here" />
            <button id="transcribe-button">Transcribe</button>
            <textarea id="transcription-result" placeholder="Transcript will appear here..." readonly></textarea>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Add styles for the panel
    GM_addStyle(`
        #transcription-panel {
            position: fixed;
            bottom: 50px;
            right: 10px;
            width: 300px;
            background: #f8f9fa;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        #transcription-panel h3 {
            margin: 0 0 10px;
            font-size: 16px;
        }
        #transcription-panel input, #transcription-panel textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
        }
        #transcription-panel button {
            width: 100%;
            padding: 5px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
        }
        #transcription-done-message {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 10px;
            border-radius: 3px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            display: none;
        }
    `);

    // Add event listener to the toggle button
    document.getElementById('toggle-transcription-panel').addEventListener('click', () => {
        const panel = document.getElementById('transcription-panel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            document.getElementById('toggle-transcription-panel').innerText = 'Hide MP3 Transcription Tool';
        } else {
            panel.style.display = 'none';
            document.getElementById('toggle-transcription-panel').innerText = 'Show MP3 Transcription Tool';
        }
    });

    // Add event listener to the Transcribe button
    document.getElementById('transcribe-button').addEventListener('click', transcribe);
    // Function to transcribe the entered MP3 URL
    function transcribe() {
        const mp3Url = document.getElementById('mp3-url').value.trim();
        if (!mp3Url) {
            alert('Please enter a valid MP3 URL.');
            return;
        }

        // Check if the transcript already exists in local storage
        const storedTranscript = localStorage.getItem(mp3Url);
        if (storedTranscript) {
            document.getElementById('transcription-result').value = storedTranscript;
            return;
        }

        // Fetch MP3 file using GM_xmlhttpRequest and process it
        GM_xmlhttpRequest({
            method: 'GET',
            url: mp3Url,
            responseType: 'arraybuffer', // Required for audio data
            onload: (response) => {
                // Convert the audio file to Base64
                const audioBase64 = arrayBufferToBase64(response.response);

                // Send the Base64-encoded audio to Google Cloud Speech-to-Text API
                sendToGoogleCloud(audioBase64, mp3Url);
            },
            onerror: (err) => {
                alert('Failed to fetch the MP3 file.');
                console.error(err);
            },
        });
    }

    // Function to send the Base64 audio data to Google Cloud Speech-to-Text API
    function sendToGoogleCloud(audioBase64, mp3Url) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                config: {
                    encoding: 'MP3',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US',
                },
                audio: {
                    content: audioBase64,
                },
            }),
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                if (result.error) {
                    alert(`Error: ${result.error.message}`);
                } else {
                    const transcript = result.results
                        ?.map((r) => r.alternatives[0].transcript)
                        .join('\n');
                    document.getElementById('transcription-result').value =
                        transcript || 'No transcript found.';

                    // Store the transcript in local storage
                    localStorage.setItem(mp3Url, transcript || 'No transcript found.');

                    // Limit local storage to 3 entries
                    manageLocalStorageLimit();

                    // Show "Transcript done!" message
                    showTranscriptionDoneMessage();
                }
            },
            onerror: (err) => {
                alert('Failed to process the transcription.');
                console.error(err);
            },
        });
    }

    // Function to convert ArrayBuffer to Base64
    function arrayBufferToBase64(buffer) {
        const binary = [];
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary.push(String.fromCharCode(bytes[i]));
        }
        return btoa(binary.join(''));
    }

    // Observe the conversation for changes and detect MP3 links
    const observer = new MutationObserver(() => {
        const messageItems = document.querySelectorAll('div[class*="messageContent_"]');
        const lastMessage = messageItems[messageItems.length - 1];

        if (lastMessage) {
            const mp3LinkMatch = lastMessage.innerText.match(/https:\/\/files\.shapes\.inc\/.*\.mp3/);
            if (mp3LinkMatch) {
                const mp3Link = mp3LinkMatch[0];
                const storedLink = localStorage.getItem('lastMp3Link');

                // Check if the link is new or different
                if (mp3Link !== storedLink) {
                    localStorage.setItem('lastMp3Link', mp3Link); // Store the new link
                    document.getElementById('mp3-url').value = mp3Link; // Populate the input
                    transcribe(); // Automatically transcribe the new link
                }
            }
        }
    });

    // Start observing the document body for new messages
    observer.observe(document.body, { childList: true, subtree: true });

    // Function to manage local storage limit of 3 entries
    function manageLocalStorageLimit() {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith('http'));
        if (keys.length > 10) {
            // Remove oldest entries until only 3 remain
            while (keys.length > 10) {
                localStorage.removeItem(keys.shift());
            }
        }
    }

    // Function to show "Transcript done!" message
    function showTranscriptionDoneMessage() {
        let messageDiv = document.getElementById('transcription-done-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'transcription-done-message';
            messageDiv.innerText = 'Transcript done!';
            document.body.appendChild(messageDiv);
        }

        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
})();
