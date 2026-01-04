// ==UserScript==
// @name         Голосовые сообщения для лолза
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Добавляет кнопку записи гс на страницах создания тем и в других местах
// @author       eretly
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getUserMedia
// @downloadURL https://update.greasyfork.org/scripts/522738/%D0%93%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D1%8B%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%BE%D0%BB%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522738/%D0%93%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D1%8B%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%BE%D0%BB%D0%B7%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHAT_ID = '-'; // Замените на айди вашего канала
    const BOT_TOKEN = ''; // Замените на токен тг бота
    const ENABLE_TRANSCRIPTION = true; // Переключатель для функции транскрипции

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = false;

    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    let transcriptText = '';

    recognition.onresult = function(event) {
        if (ENABLE_TRANSCRIPTION) {
            const last = event.results.length - 1;
            transcriptText += event.results[last][0].transcript + ' ';
        }
    };

    recognition.onerror = function(event) {
        console.error('Ошибка распознавания речи:', event.error);
    };

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function bufferToWav(audioBuffer) {
        const numOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const samples = audioBuffer.getChannelData(0);
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');

        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numOfChannels * 2, true);
        view.setUint16(32, numOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        let offset = 44;
        for (let i = 0; i < samples.length; i++) {
            view.setInt16(offset, samples[i] * 0x7FFF, true);
            offset += 2;
        }

        return new Blob([view], { type: 'audio/wav' });
    }

    GM_addStyle(`
    .lzt-fe-se-extraButton[data-cmd="voiceRecord"] {
        width: 24px;
        height: 24px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        cursor: pointer;
    }
    .lzt-fe-se-extraButton[data-cmd="voiceRecord"] svg {
        width: 20px;
        height: 20px;
        stroke: #8c8c8c;
        transition: stroke 0.3s ease;
    }
    .lzt-fe-se-extraButton[data-cmd="voiceRecord"]:hover svg {
        stroke: #d6d6d6;
    }
    .lzt-fe-se-extraButton[data-cmd="voiceRecord"].recording svg {
        stroke: #cc0000;
    }
    .fr-command[data-cmd="voiceRecord"] {
        position: relative;
    }
    .fr-command[data-cmd="voiceRecord"].recording i {
        color: #cc0000;
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }с
        100% { opacity: 1; }
    }
`);

    function createRecordButton(isToolbarButton = false) {
        const recordButton = document.createElement(isToolbarButton ? 'button' : 'div');
        recordButton.type = 'button';
        recordButton.tabIndex = -1;
        recordButton.setAttribute('role', 'button');
        recordButton.setAttribute('aria-disabled', 'false');
        recordButton.className = isToolbarButton ? 'fr-command fr-btn' : 'lzt-fe-se-extraButton';
        recordButton.setAttribute('data-cmd', 'voiceRecord');
        recordButton.title = 'Начать / Остановить Запись голоса';

        if (isToolbarButton) {
            recordButton.innerHTML = `
            <i class="fal fa-microphone" aria-hidden="true"></i>
            <span class="fr-sr-only">Запись голоса</span>
        `;
        } else {
            recordButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        }

        recordButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Кнопка нажата (прямой обработчик)');
            handleRecordButtonClick(this);
        });

        return recordButton;
    }


    function addRecordButton() {
        const buttonContainers = [
            { container: document.querySelector('.lzt-fe-se-extraButtonsContainer'), isToolbar: false },
            { container: document.querySelector('.js-lzt-fe-extraButtons'), isToolbar: false },
            { container: document.querySelector('.fr-toolbar .fr-btn-grp.fr-float-left'), isToolbar: true }
        ];

        buttonContainers.forEach(({ container, isToolbar }) => {
            if (container) {
                const existingButton = container.querySelector('[data-cmd="voiceRecord"]');
                if (!existingButton) {
                    const recordButton = createRecordButton(isToolbar);
                    container.appendChild(recordButton);
                    console.log('Кнопка записи добавлена в контейнер', container);
                }
            }
        });
    }

    function handleRecordButtonClick(button) {
        if (!isRecording) {
            startRecording(button);
        } else {
            stopRecording(button);
        }
    }

    async function startRecording(button) {
        if (!button || !button.classList) {
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (mediaRecorder && mediaRecorder.state === 'recording') {
                console.warn('MediaRecorder уже записывает');
                return;
            }

            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunks = [];
            transcriptText = '';

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                convertToOgg(audioBlob, button);
                stream.getTracks().forEach(track => track.stop());
                if (ENABLE_TRANSCRIPTION) {
                    recognition.stop();
                }
            });

            setTimeout(() => {
                mediaRecorder.start();
                if (ENABLE_TRANSCRIPTION) {
                    recognition.start();
                }
                isRecording = true;
                button.classList.add('recording');
            }, 10);

        } catch (err) {
            console.error('Ошибка при получении доступа к микрофону:', err);
            alert('Не удалось получить доступ к микрофону: ' + err.message);
        }
    }

    function stopRecording(button) {
        if (!button || !button.classList) {
            return;
        }

        if (!mediaRecorder || mediaRecorder.state === 'inactive' || mediaRecorder.state === 'paused') {
            console.warn('Запись уже остановлена или не была запущена.');
            return;
        }

        setTimeout(() => {
            mediaRecorder.stop();
            isRecording = false;
            button.classList.remove('recording');
            console.log('Запись остановлена');
        }, 10);
    }


    function convertToOgg(audioBlob, button) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const reader = new FileReader();
        reader.onload = async function() {
            const audioBuffer = await audioContext.decodeAudioData(reader.result);
            const duration = audioBuffer.duration;
            const offlineContext = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            offlineContext.startRendering().then(function(renderedBuffer) {
                const wavBlob = bufferToWav(renderedBuffer);
                const oggBlob = convertWavToOgg(wavBlob);
                sendAudioToTelegram(oggBlob, duration, button);
            });
        };
        reader.readAsArrayBuffer(audioBlob);
    }

    function convertWavToOgg(wavBlob) {
        return wavBlob;
    }

    function sendAudioToTelegram(audioBlob, duration, button) {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('voice', audioBlob, 'voice.mp3');
        formData.append('duration', Math.round(duration));

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                if (responseData.ok && responseData.result && responseData.result.message_id) {
                    const telegramPostLink = `https://t.me/${responseData.result.chat.username}/${responseData.result.message_id}`;
                    insertTextAndLinkIntoInput(button, transcriptText, telegramPostLink);
                } else {
                    alert('Не удалось получить ссылку на пост в Telegram');
                }
            } else {
                alert('Ошибка при отправке аудио в Telegram');
            }
        };

        xhr.onerror = function() {
            alert('Ошибка при отправке аудио в Telegram');
        };

        xhr.send(formData);
    }

    function insertTextAndLinkIntoInput(button, transcription, telegramLink) {
        const inputElement = button.closest('.fr-wrapper')?.querySelector('.fr-element.fr-view[contenteditable="true"]') ||
              document.querySelector('.fr-element.fr-view');

        if (inputElement) {
            const linkElement = document.createElement('a');
            linkElement.href = telegramLink;
            linkElement.target = '_blank';
            linkElement.textContent = telegramLink;
            inputElement.appendChild(linkElement);

            inputElement.appendChild(document.createElement('br'));

            if (ENABLE_TRANSCRIPTION && transcription.trim()) {
                const transcriptionText = document.createTextNode(`Транскрипция: [${transcription.trim()}]`);
                inputElement.appendChild(transcriptionText);
                inputElement.appendChild(document.createElement('br'));
            }

            const inputEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);

            inputElement.scrollTop = inputElement.scrollHeight;
        } else {
            console.error('Не удалось найти поле ввода');
        }
    }

    addRecordButton();

    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.lzt-fe-se-extraButton[data-cmd="voiceRecord"]')) {
            console.log('Кнопка нажата через делегирование');
            handleRecordButtonClick(e);
        }
    });

    function init() {
        addRecordButton();

        document.addEventListener('click', function(e) {
            const recordButton = e.target.closest('[data-cmd="voiceRecord"]');
            if (recordButton) {
                console.log('Кнопка нажата (делегирование)');
                handleRecordButtonClick(recordButton);
            }
        });

        recognition.onresult = function(event) {
            if (ENABLE_TRANSCRIPTION) {
                const last = event.results.length - 1;
                transcriptText += event.results[last][0].transcript + ' ';
            }
        };

        recognition.onerror = function(event) {
            console.error('Ошибка распознавания речи:', event.error);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addRecordButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

