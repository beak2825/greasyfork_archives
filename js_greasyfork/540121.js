// ==UserScript==
// @name         Speech-to-Text for Textareas
// @namespace    http://yourdomain.example
// @version      1.0
// @description  Adds a microphone button to textareas for speech-to-text input
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540121/Speech-to-Text%20for%20Textareas.user.js
// @updateURL https://update.greasyfork.org/scripts/540121/Speech-to-Text%20for%20Textareas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function addMicButton(textarea) {
        if (textarea.nextSibling && textarea.nextSibling.className === 'stt-mic-btn') return;

        const btn = document.createElement('button');
        btn.textContent = '🎤';
        btn.className = 'stt-mic-btn';
        btn.style.marginLeft = '5px';
        btn.title = 'Click to start speech-to-text';

        btn.onclick = function(e) {
            e.preventDefault();
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                textarea.value += (textarea.value ? ' ' : '') + transcript;
            };
            recognition.onerror = function(event) {
                alert('Speech recognition error: ' + event.error);
            };
            recognition.start();
        };

        textarea.parentNode.insertBefore(btn, textarea.nextSibling);
    }

    document.querySelectorAll('textarea').forEach(addMicButton);

    const observer = new MutationObserver(() => {
        document.querySelectorAll('textarea').forEach(addMicButton);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();


