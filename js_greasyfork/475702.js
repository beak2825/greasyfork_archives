// ==UserScript==
// @name         PI - no hands talk :)
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Chat with PI on pi.ai using this script that enables speech recognition.
// @author       Guki
// @match        https://pi.ai/talk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pi.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475702/PI%20-%20no%20hands%20talk%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475702/PI%20-%20no%20hands%20talk%20%3A%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // if you have a job for a person who interested in ML, AI agents, LLMs
    // please contact me, my email: sokolovivanf@gmail.com

    // options
    const sendDelay = 3000 // time in ms after last registered spoken word before sending a message
    const startActive = false // activate the script on start
    const checkRecognition = 1000 // time in ms of how often to check recognition status to restart it if its become inactive

    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.interimResults = true;

    let recognitionActive = false;
    if (startActive) {
        recognitionActive = true
    }
    recognition.onstart = function() {
        recognitionActive = true;
    };
    recognition.onend = function() {
        recognitionActive = false;
        if (scriptActive) {
            setTimeout(() => {
                // rarely might be active by the interval
                if (!recognitionActive) {
                    recognition.start()
                }
            }, 5)
        }
    };

    let scriptActive = false
    if (startActive) {
        scriptActive = true
        recognition.start();
    }


    // script toggle button
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.left = '24px';
    button.style.borderRadius = '50%';
    button.style.width = '42px';
    button.style.height = '42px';
    button.style.zIndex = '9999';
    button.style.color = 'white';
    button.style.opacity = '0.8';
    if (startActive) {
        button.style.background = '#e63946';
    } else {
        button.style.background = '#a8dadc';
    }
    button.style.paddingLeft = "5px";
    button.style.transition = "all 200ms"
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>'
    button.onclick = function() {
        if (scriptActive) {
            scriptActive = false
            button.style.background = '#a8dadc';
        } else {
            scriptActive = true
            button.style.background = '#e63946';
        }
        if (!scriptActive && recognitionActive) {
            recognition.stop();
        } else if (scriptActive && !recognitionActive) {
            recognition.start();
        }
    };
    document.body.appendChild(button);

    // infinite recognition restart when script is active
    setInterval(function() {
        if (scriptActive && !recognitionActive) {
            recognition.start();
        }
    }, checkRecognition);

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    let completeTranscript = ''
    function cleanCompleteTranscript() {
        completeTranscript = ''
    }

    function pressEnter() {
        var textarea = document.querySelector('.block.w-full.resize-none.overflow-y-hidden.whitespace-pre-wrap.bg-transparent');
        var enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            cancelable: true
        });
        textarea.dispatchEvent(enterEvent);
        cleanCompleteTranscript()
    }
    const debouncedPressEnter = debounce(pressEnter, sendDelay);

    recognition.onresult = function(event) {
        let textarea = document.querySelector('.block.w-full.resize-none.overflow-y-hidden.whitespace-pre-wrap.bg-transparent');
        let transcript = event.results[0][0].transcript
        if(!event.results[0].isFinal) {
            // only visual
            textarea.value = completeTranscript + ' ' + transcript;
        } else {
            textarea.value = completeTranscript + ' ' + transcript;
            completeTranscript += ' ' + transcript

            // value is not registered correctly without this workaround
            textarea.value = ''
            Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, textarea.value + completeTranscript);
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
        }
        debouncedPressEnter();
    };
})();