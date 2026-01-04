// ==UserScript==
// @name         T3 Chat STT with Whisper API (Configurable API Key)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds speech-to-text functionality to t3.chat using OpenAI's Whisper API with configurable API key via UI.
// @author       wearifulpoet
// @match        https://t3.chat/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529116/T3%20Chat%20STT%20with%20Whisper%20API%20%28Configurable%20API%20Key%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529116/T3%20Chat%20STT%20with%20Whisper%20API%20%28Configurable%20API%20Key%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ********** API Key Configuration **********
    // Use localStorage to store the API key.
    // Initially, if no API key is stored, an empty string is returned.
    const getApiKey = () => localStorage.getItem("whisper_api_key") || "";
    const setApiKey = (key) => localStorage.setItem("whisper_api_key", key);
    // *********************************************

    // Create the STT button.
    const sttButton = document.createElement('button');
    sttButton.innerHTML = "🎙️ Start STT";
    sttButton.style.position = "fixed";
    sttButton.style.bottom = "20px";
    sttButton.style.right = "20px";
    sttButton.style.zIndex = "9999";
    sttButton.style.padding = "10px";
    sttButton.style.fontSize = "16px";
    document.body.appendChild(sttButton);

    // Create the API Key configuration button.
    const apiKeyButton = document.createElement('button');
    apiKeyButton.innerHTML = "API Key";
    apiKeyButton.style.position = "fixed";
    apiKeyButton.style.bottom = "20px";
    apiKeyButton.style.right = "140px";
    apiKeyButton.style.zIndex = "9999";
    apiKeyButton.style.padding = "10px";
    apiKeyButton.style.fontSize = "16px";
    document.body.appendChild(apiKeyButton);

    // Event listener to set/update the API key.
    apiKeyButton.addEventListener("click", () => {
        const currentKey = getApiKey();
        const newKey = prompt("Enter your Whisper API key:", currentKey);
        if (newKey !== null) {
            setApiKey(newKey.trim());
            alert("API key updated!");
        }
    });

    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;

    sttButton.addEventListener("click", async () => {
        if (!isRecording) {
            // Check if the API key has been set.
            const storedKey = getApiKey();
            if (!storedKey) {
                alert("Please set your Whisper API key using the API Key button.");
                return;
            }
            // Start recording
            sttButton.innerHTML = "Stop Recording";
            isRecording = true;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                });

                mediaRecorder.addEventListener("stop", async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    // Prepare the file to send to Whisper API.
                    const audioFile = new File([audioBlob], "audio.wav", { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append("file", audioFile);
                    formData.append("model", "whisper-1");

                    try {
                        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${getApiKey()}`
                            },
                            body: formData
                        });
                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error("Whisper API error:", errorText);
                            alert("Error with Whisper API:\n" + errorText);
                            return;
                        }
                        const result = await response.json();
                        const transcription = result.text;
                        // Find the chat input textarea and insert the transcription.
                        const chatInput = document.querySelector("textarea");
                        if (chatInput) {
                            chatInput.value = transcription;
                            // Dispatch an input event if the site relies on it.
                            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            alert("Chat input not found!");
                        }
                    } catch (error) {
                        console.error("Error calling Whisper API:", error);
                        alert("Error calling Whisper API: " + error.message);
                    }
                });

                mediaRecorder.start();
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Error accessing microphone: " + error.message);
                sttButton.innerHTML = "🎙️ Start STT";
                isRecording = false;
            }
        } else {
            // Stop recording
            sttButton.innerHTML = "🎙️ Start STT";
            isRecording = false;
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        }
    });
})();
