// ==UserScript==
// @name         ChatGPT Voice-to-Text
// @namespace    openai_voice_to_text
// @version      2.6
// @description  Enables voice-to-text functionality on chat.openai by holding down the 'v' key and speaking into your microphone, using the Web Speech API, and automatically inserting the transcribed text into the chat input field.
// @author       letsplayto 1
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464608/ChatGPT%20Voice-to-Text.user.js
// @updateURL https://update.greasyfork.org/scripts/464608/ChatGPT%20Voice-to-Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    let isListening = false;
    let finalTranscript = '';
    let lastResult = '';

    const langSelector = document.createElement('select');
    langSelector.style.position = 'fixed';
    langSelector.style.top = '10px';
    langSelector.style.right = '10px';
    langSelector.style.zIndex = '99999';
    langSelector.style.fontSize = '18px';
    langSelector.style.padding = '10px';
    langSelector.style.borderRadius = '5px';
    langSelector.style.fontWeight = 'bold';
    langSelector.addEventListener('change', event => {
        recognition.lang = event.target.value;
    });

    langSelector.style.backgroundColor = '#565759';

    const langOptions = [
    { label: 'English (US)', value: 'en-US' },
    { label: 'English (UK)', value: 'en-GB' },
    { label: 'Español (España)', value: 'es-ES' },
    { label: 'Español (México)', value: 'es-MX' },
    { label: 'Français (France)', value: 'fr-FR' },
    { label: 'Français (Canada)', value: 'fr-CA' },
    { label: 'Italiano (Italia)', value: 'it-IT' },
    { label: 'Deutsch (Deutschland)', value: 'de-DE' },
    { label: '日本語 (日本)', value: 'ja-JP' },
    { label: '中文 (中国)', value: 'zh-CN' },
    { label: '한국어 (대한민국)', value: 'ko-KR' },
    { label: 'Português (Brasil)', value: 'pt-BR' },
    { label: 'Русский (Россия)', value: 'ru-RU' },
    { label: 'العربية (السعودية)', value: 'ar-SA' },
    { label: 'Nederlands (Nederland)', value: 'nl-NL' },
    { label: 'Dansk (Danmark)', value: 'da-DK' },
    { label: 'Norsk Bokmål (Norge)', value: 'nb-NO' },
    { label: 'Svenska (Sverige)', value: 'sv-SE' },
    { label: 'Suomi (Suomi)', value: 'fi-FI' },
    { label: 'Polski (Polska)', value: 'pl-PL' },
    { label: 'Čeština (Česká republika)', value: 'cs-CZ' },
    { label: 'Slovenčina (Slovensko)', value: 'sk-SK' },
    { label: 'Magyar (Magyarország)', value: 'hu-HU' },
    { label: 'Română (România)', value: 'ro-RO' },
    { label: 'Български (България)', value: 'bg-BG' },
    { label: 'Ελληνικά (Ελλάδα)', value: 'el-GR' },
    { label: 'Türkçe (Türkiye)', value: 'tr-TR' },
    { label: 'Samoan (Samoa)', value: 'sm' },
];
    langOptions.forEach(option => {
        const langOption = document.createElement('option');
        langOption.value = option.value;
        langOption.textContent = option.label;
        if (option.value === recognition.lang) {
            langOption.selected = true;
        }
        langSelector.appendChild(langOption);
    });

    document.body.appendChild(langSelector);

    const micIcon = document.createElement('div');
    micIcon.style.position = 'fixed';
    micIcon.style.bottom = '10px';
    micIcon.style.right = '10px';
    micIcon.style.zIndex = '99999';
    micIcon.style.fontSize = '18px';
    micIcon.style.color = 'white';
    micIcon.style.padding = '10px';
    micIcon.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    micIcon.style.borderRadius = '5px';
    micIcon.style.fontWeight = 'bold';
    micIcon.textContent = 'Press and hold V to talk';
    document.body.appendChild(micIcon);

    document.addEventListener('keydown', event => {
        if (event.key === 'v' && !isListening) {
            micIcon.textContent = 'Recording... (Release V to Stop)';
            startRecognition();
        }
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'v' && isListening) {
            micIcon.textContent = 'Press and hold V to talk';
            stopRecognition();
        }
    });

    recognition.addEventListener('result', event => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');

        if (event.results[0].isFinal) {
            if (transcript !== lastResult) {
                lastResult = transcript;
                finalTranscript += transcript;
                insertText(finalTranscript);
                finalTranscript = '';
            }
        }
    });

    function startRecognition() {
        isListening = true;
        recognition.start();
        console.log('Recording... (Release V to Stop)');
    }

    function stopRecognition() {
        isListening = false;
        recognition.stop();
        console.log('Stopped Recording');
        lastResult = '';
    }

    function insertText(text) {
        const input = document.querySelector('textarea');
        input.value += text;
    }
})();