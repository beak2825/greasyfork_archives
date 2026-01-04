// ==UserScript==
// @name         Bypass reCAPTCHA v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script untuk mengotomatisasi interaksi dengan reCAPTCHA v2 (Hanya untuk tujuan pembelajaran)
// @author       Ojo Ngono
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495336/Bypass%20reCAPTCHA%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/495336/Bypass%20reCAPTCHA%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClick(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
            }
        }, 100);
    }

    // Klik checkbox reCAPTCHA
    waitForElement('.g-recaptcha', (element) => {
        simulateClick(element);
    });

    // Tunggu 5 detik lalu klik tombol audio
    setTimeout(() => {
        waitForElement('button[aria-label="Get an audio challenge"]', (audioButton) => {
            simulateClick(audioButton);
        });
    }, 5000);

    // Tunggu 10 detik lalu mulai mendengarkan dan menerjemahkan audio
    setTimeout(() => {
        waitForElement('audio', (audioElement) => {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            audioElement.play();
            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;

                waitForElement('.response-field', (inputBox) => {
                    inputBox.value = transcript;

                    waitForElement('form', (form) => {
                        form.submit();
                    });
                });
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
        });
    }, 10000);

})();
