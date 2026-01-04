// ==UserScript==
// @name         Read Aloud ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add "🗣️", "🀄", and "⏹️" buttons to read aloud elements with the "prose" class in English, Chinese, and to stop reading aloud respectively.
// @author       Hillman Being
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465182/Read%20Aloud%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/465182/Read%20Aloud%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let synth = window.speechSynthesis;
    let voices = [];
    let voiceIndex = {};
    let processedElements = new Set();

    function populateVoiceList() {
        voices = synth.getVoices();

        for (let i = 0; i < voices.length; i++) {
            voiceIndex[voices[i].lang] = i;
        }
    }

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Function to create a speech button with the given text content and language
    function createSpeechButton(textContent, lang) {
        const button = document.createElement('button');
        button.textContent = textContent;
        button.style.marginLeft = '8px';

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const proseElement = event.target.closest('.relative').querySelector('.prose');
            if (proseElement) {
                const text = proseElement.textContent;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.voice = voices[voiceIndex[lang]];
                synth.speak(utterance);
            }
        });

        return button;
    }

    // Function to create a stop button
    function createStopButton() {
        const button = document.createElement('button');
        button.textContent = '⏹️';
        button.style.marginLeft = '8px';

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            synth.cancel();
        });

        return button;
    }

    // Function to add speech and stop buttons to elements with the "mt-2" class
    function addButtonToElements() {
        const elements = document.querySelectorAll('.mt-2');

        for (const element of elements) {
            if (!processedElements.has(element)) {
                processedElements.add(element);
                const englishSpeechButton = createSpeechButton('🗣️', 'en-US');
                const chineseSpeechButton = createSpeechButton('🀄', 'zh-CN');
                const stopButton = createStopButton();
                element.appendChild(englishSpeechButton);
                element.appendChild(chineseSpeechButton);
                element.appendChild(stopButton);
            }
        }
    }

    // Function to observe DOM changes and call addButtonToElements when necessary
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldAddButtons = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    shouldAddButtons = true;
                    break;
                }
            }

            if (shouldAddButtons) {
                addButtonToElements();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    addButtonToElements();
    observeDOMChanges();
})();
