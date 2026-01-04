// ==UserScript==
// @name         Lolz VoiceInput
// @namespace    Android/lolzteam
// @version      0.1
// @description  Добавляет голосовой ввод на лолз
// @author       Android
// @match        *://zelenka.guru/*
// @match        *://lzt.market/*
// @match        *://lolz.guru/*
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474246/Lolz%20VoiceInput.user.js
// @updateURL https://update.greasyfork.org/scripts/474246/Lolz%20VoiceInput.meta.js
// ==/UserScript==

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
if (!SpeechRecognition) {
    console.error("Ваш браузер не поддерживает голосовой ввод");
    return;
}

(() => {
    'use strict';

    const COLOR = {
        GRAY: '#8c8c8c',
        GREEN: '#2BAD72',
        LIGHT_GREEN: '#33cc87',
        LIGHT_GRAY: '#D6D6D6',
    };

    const ELEMENT_SELECTOR = {
        PARAGRAPH: '.fr-element p',
        WRAPPER: '.fr-wrapper',
        BOX: '.fr-box',
        BUTTON: '.lzt-fe-se-extraButton',
    };

    const BUTTON_SIZE = {
        WIDTH: '24px',
        HEIGHT: '24px',
    };

    const TIMEOUT_DURATION = 10 * 1000;

    const createButton = () => {
        const buttonStyle = document.createElement('button');
        buttonStyle.style.width = BUTTON_SIZE.WIDTH;
        buttonStyle.style.height = BUTTON_SIZE.HEIGHT;
        buttonStyle.style.color = COLOR.GRAY;
        buttonStyle.classList.add('main__block-color_taupe');
        buttonStyle.type = 'button';
        buttonStyle.style.cursor = 'pointer';
        buttonStyle.style.backgroundColor = 'transparent';
        buttonStyle.style.border = 'none';
        buttonStyle.style.display = 'flex';
        buttonStyle.style.alignItems = 'center';
        buttonStyle.style.justifyContent = 'center';
        return buttonStyle;
    };

    let isListening = false;
    let recognition;
    let timeoutId;

    const startListening = () => {
        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = true;
    
        recognition.onstart = () => {
            console.log('onstart')
            clearTimeout(timeoutId);
        };
    
        recognition.onresult = (event) => {
            console.log('onresult')
            clearTimeout(timeoutId);
    
            const result = event.results[event.results.length - 1][0].transcript;
            const paragraphElement = document.querySelector(ELEMENT_SELECTOR.PARAGRAPH);
            const frWrapperElement = document.querySelector(ELEMENT_SELECTOR.WRAPPER);
            const frBoxElement = document.querySelector(ELEMENT_SELECTOR.BOX);
    
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
            console.log('onend')
            if (isListening) {
                timeoutId = setTimeout(() => {
                    stopListening();
                }, TIMEOUT_DURATION);
            }
        };
    
        recognition.start();
    };


    const stopListening = () => {
        recognition.stop();
        isListening = false;
        microphoneButton.style.color = COLOR.GRAY;
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
            isListening = true;
            microphoneButton.style.color = COLOR.GREEN;
        }
    };

    const microphoneButton = createButton();

    const SVG_SIZE = {
        WIDTH: 20,
        HEIGHT: 20,
    };

    const microphoneSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SVG_SIZE.WIDTH}" height="${SVG_SIZE.HEIGHT}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
    `;

    microphoneButton.innerHTML = microphoneSvg;
    microphoneButton.addEventListener('click', toggleListening);

    microphoneButton.addEventListener('mouseenter', () => {
        microphoneButton.style.color = isListening ? COLOR.LIGHT_GREEN : COLOR.LIGHT_GRAY;
    });

    microphoneButton.addEventListener('mouseleave', () => {
        microphoneButton.style.color = isListening ? COLOR.GREEN : COLOR.GRAY;
    });

    const element = document.querySelector(ELEMENT_SELECTOR.BUTTON);
    element.parentNode.insertBefore(microphoneButton, element);
})();