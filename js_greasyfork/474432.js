// ==UserScript==
// @name         VoiceTools
// @namespace    Android/lolz
// @version      0.1
// @license MIT
// @description  Голосовые сообщения и голосовой ввод
// @author       Android
// @match        *://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474432/VoiceTools.user.js
// @updateURL https://update.greasyfork.org/scripts/474432/VoiceTools.meta.js
// ==/UserScript==

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
if (!SpeechRecognition) {
    console.error("Ваш браузер не поддерживает голосовой ввод");
}

(async function () {

    'use strict';

    const COLORS = {
        GRAY: '#8c8c8c',
        GREEN: '#2BAD72',
        LIGHT_GREEN: '#33cc87',
        LIGHT_GRAY: '#D6D6D6',
        RED: '#fa3939'
    };

    const SELECTORS = {
        PARAGRAPH: '.fr-element p',
        WRAPPER: '.fr-wrapper',
        BOX: '.fr-box',
        BUTTON: '.lzt-fe-se-extraButton',
    };

    const BUTTON_SIZES = {
        WIDTH: '24px',
        HEIGHT: '24px',
    };

    const TIMEOUT_DURATION = 10 * 1000;

    let token = '';

    const inputElement = document.querySelector('input[name="_xfToken"]');
    const xfToken = inputElement.value;

    let isListening = false;
    const button = createButton();
    let mediaRecorder;
    let recognition;
    let timeoutId;

    let isMouseDown = false;
    let pressTimeout;
    let holdTimeout;

    function createButton() {
        const button = document.createElement('button');
        button.style.width = BUTTON_SIZES.WIDTH;
        button.style.height = BUTTON_SIZES.HEIGHT;
        button.style.color = COLORS.GRAY;
        button.style.borderRadius = '100%'
        button.classList.add('main__block-color_taupe');
        button.type = 'button';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';

        const SVG_SIZES = {
            WIDTH: 20,
            HEIGHT: 20,
        };

        const microphoneSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SVG_SIZES.WIDTH}" height="${SVG_SIZES.HEIGHT}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `;

        button.innerHTML = microphoneSvg;

        const element = document.querySelector(SELECTORS.BUTTON);
        element.parentNode.insertBefore(button, element);

        button.addEventListener('mousedown', function () {
            pressTimeout = setTimeout(function () {
                if (!isListening) {
                    startRecording()
                    clearTimeout(pressTimeout);
                    isMouseDown = true;
                }
            }, 500);
        });

        button.addEventListener('mouseup', function () {
            clearTimeout(pressTimeout);
            clearTimeout(holdTimeout);

            if (!isMouseDown) {
                toggleListening()
            } else {
                stopRecording()
                isMouseDown = false;
            }
        });

        button.addEventListener('mouseleave', function () {
            clearTimeout(pressTimeout);
            clearTimeout(holdTimeout);
        });

        return button;
    }


    function startListening() {
        button.style.color = COLORS.GREEN;
        isListening = true;

        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = true;

        recognition.onstart = () => {
            clearTimeout(timeoutId);
        };

        recognition.onresult = (event) => {
            clearTimeout(timeoutId);

            const result = event.results[event.results.length - 1][0].transcript;
            const paragraphElement = document.querySelector(SELECTORS.PARAGRAPH);
            const frWrapperElement = document.querySelector(SELECTORS.WRAPPER);
            const frBoxElement = document.querySelector(SELECTORS.BOX);

            paragraphElement.textContent = paragraphElement.textContent.replace(/\u200B/g, '').replace(/\u00A0/g, '');
            const shouldAppendSpace = paragraphElement.textContent.trim() !== '';
            paragraphElement.textContent += shouldAppendSpace ? ' ' + result : result;
            frWrapperElement.classList.remove('show-placeholder');
            frBoxElement.classList.add('is-focused');

            timeoutId = setTimeout(() => {
                stopListening();
            }, TIMEOUT_DURATION);
        };

        recognition.onend = () => {
            if (isListening) {
                timeoutId = setTimeout(() => {
                    stopListening();
                }, TIMEOUT_DURATION);
            }
        };

        recognition.start();
    }


    function stopListening() {
        recognition.stop();
        isListening = false;
        button.style.color = COLORS.GRAY;
    };

    function toggleListening() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    async function initMediaRecorder() {
        const streamOptions = { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(streamOptions);
        const options = { mimeType: 'video/webm; codecs=h264' };
        mediaRecorder = new MediaRecorder(stream, options);
        let recordedBlobs = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedBlobs, { type: 'video/webm' });

            try {
                const file = await uploadVideoFile(token, blob);
                addVoiceMessageReply(file)
            } catch (uploadError) {
                console.error('Error uploading the video file:', uploadError);
            }

            recordedBlobs = [];
        };
    }

    function addVoiceMessageReply(link) {
        const message = '[MEDIA=cdn]' + link + '[/MEDIA]'

        const threadUrl = document.querySelector('link[rel="canonical"]').getAttribute('href')
        const addReplyUrl = threadUrl + 'add-reply'

        const regex = /\/threads\/\d+\//;
        const match = threadUrl.match(regex);
        const threadAndNum = match[0]

        let formdata = new FormData;
        formdata.append("message_html", message)
        formdata.append("_xfRelativeResolver", threadUrl)
        formdata.append("last_date", Math.floor(Date.now() / 1e3))
        formdata.append("last_known_date", Math.floor(Date.now() / 1e3))
        formdata.append("_xfRequestUri", threadAndNum)
        formdata.append("_xfNoRedirect", 1)
        formdata.append("_xfResponseType", "json")
        formdata.append("_xfToken", xfToken)

        let addReplyRequestOptions = {
            method: 'POST',
            headers: {
                'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
            },
            body: formdata,
        };
        fetch(addReplyUrl, addReplyRequestOptions)
    }

    async function startRecording() {
        button.style.color = COLORS.RED;
        mediaRecorder.start();
    }

    function stopRecording() {
        button.style.color = COLORS.GRAY;
        mediaRecorder.stop();
    }

    async function getToken() {
        try {
            const getTokenUrl = 'https://zelenka.guru/editor/cdn';
            const tokenData = {
                _xfToken: xfToken,
                _xfResponseType: 'json',
            };
            const tokenFormData = new URLSearchParams(tokenData).toString();
            const tokenRequestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: tokenFormData,
            };

            const response = await fetch(getTokenUrl, tokenRequestOptions);
            const data = await response.json();
            token = data.token;
        } catch (error) {
            console.error('Error while getting token:', error);
        }
    }

    async function uploadVideoFile(token, blob) {
        const formData = new FormData();
        formData.append('file', blob);

        const baseCdnUrl = 'https://lztcdn.com/';
        const uploadUrl = baseCdnUrl + 'upload/';
        const filesUrl = baseCdnUrl + 'files/';

        const requestOptions = {
            method: 'POST',
            headers: {
                'X-Cdn-Filename': 'File',
                'X-Cdn-Token': token,
            },
            body: formData,
        };

        try {
            const response = await fetch(uploadUrl, requestOptions);
            const data = await response.json();
            return data.key;
        } catch (error) {
            console.error('Error while uploading mp4 file:', error);
            return null;
        }
    }

    initMediaRecorder();
    getToken();
})();