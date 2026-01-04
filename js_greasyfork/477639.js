// ==UserScript==
// @name         Boo World Audio Message Recorder
// @namespace    https://github.com/Maxhem2/BooWeb-RecordVoiceMessages
// @version      1.0
// @description  Adds a convenient audio recording button to the Boo World website, enhancing your chat experience by allowing you to record and send audio messages with ease
// @match        https://boo.world/*/messages
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477639/Boo%20World%20Audio%20Message%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/477639/Boo%20World%20Audio%20Message%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mediaStream = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let auth_token = "";
    let chatId = "";

    let isRecording = false;

    const audioConstraints = {
        audio: {
            sampleRate: 44100,
            channelCount: 2,
            bitRate: 128000
        }
    };

    function createAudioRecordButton() {
        const sendMessageButton = document.querySelector("#sendMessageButton");

        if (sendMessageButton) {
            const audioRecordButton = document.createElement("button");
            audioRecordButton.style.borderRadius = "50%";
            audioRecordButton.style.backgroundColor = "blue";

            const microphoneSVG = document.createElement("img");
            microphoneSVG.src = "https://www.svgrepo.com/show/158180/microphone.svg";
            microphoneSVG.style.width = "32px";
            microphoneSVG.style.height = "32px";

            audioRecordButton.appendChild(microphoneSVG);

            audioRecordButton.addEventListener("click", () => {
                if (isRecording) {
                    stopRecording();
                    audioRecordButton.style.backgroundColor = "blue";
                } else {
                    refreshTokenUsingIndexedDB(startRecording);
                    audioRecordButton.style.backgroundColor = "red";
                }
            });

            sendMessageButton.parentNode.insertBefore(audioRecordButton, sendMessageButton.nextSibling);
        } else {
            setTimeout(createAudioRecordButton, 1000);
        }
    }

    function startRecording() {
        isRecording = true;
        navigator.mediaDevices.getUserMedia(audioConstraints)
            .then(function (stream) {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = function () {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    refreshTokenUsingIndexedDB(sendAudio, audioBlob, chatId);

                    isRecording = false;

                    stopRecording();
                };

                mediaRecorder.start();
            })
            .catch(function (error) {
                console.error("Error accessing microphone:", error);
            });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    }

    function sendAudio(audioBlob, chatId) {
        if (auth_token && chatId) {
            const url = `https://api.prod.boo.dating/v1/message/audio?chatId=${chatId}`;

            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');

            const headers = new Headers({
                "authorization": auth_token,
            });

            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Request succeeded.");
                    } else {
                        console.error(`Request failed with status code ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error("Request failed:", error);
                });
        } else {
            console.error("Authentication token or chatId is missing.");
        }
    }

    function refreshTokenUsingIndexedDB(callback, ...args) {
        indexedDB.open('firebaseLocalStorageDb').onsuccess = e => {
            const t = e.target.result;
            const s = t.transaction(['firebaseLocalStorage'], 'readonly').objectStore('firebaseLocalStorage');
            s.getAll().onsuccess = e => {
                const r = e.target.result.find(e => e.value?.stsTokenManager?.refreshToken);
                const refreshToken = r ? r.value.stsTokenManager.refreshToken : '';
                t.close();

                const data = {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                };
                const url = "https://securetoken.googleapis.com/v1/token?key=AIzaSyCsyxwwMvs6AlhW1U3gDk3Jdxvlsqfo6w0";
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                })
                .then(response => response.json())
                .then(authentication => {
                    if (authentication.access_token) {
                        auth_token = authentication.access_token;
                        console.log("Token refreshed:", auth_token);

                        const element = document.querySelector('.shadow-container.clickable.hoverable.hover-grow-size-2.active-shrink-size.p-3.mb-3.selected-chat');
                        if (element) {
                            chatId = element.getAttribute('id');
                        }

                        if (callback && typeof callback === 'function') {
                            callback(...args);
                        }
                    } else {
                        console.error(`Request failed with status code ${response.status}`, url);
                        console.error("Response:", response.text);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            };
        };
    }

    createAudioRecordButton();
})();