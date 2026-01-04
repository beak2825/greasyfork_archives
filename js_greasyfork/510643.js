// ==UserScript==
// @name         Text Highlighter with TTS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight text on any website and have it read using TTS with options for voice and speed.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510643/Text%20Highlighter%20with%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/510643/Text%20Highlighter%20with%20TTS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI
    let gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '20px';
    gui.style.left = '20px';
    gui.style.width = '300px';
    gui.style.height = '200px';
    gui.style.background = 'gray';
    gui.style.borderRadius = '10px';
    gui.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.5)';
    gui.innerHTML = `
        <div style="background-color: #ccc; padding: 10px; border-radius: 10px 10px 0 0;">
            <span style="font-size: 18px;">Highlighter</span>
        </div>
        <div style="padding: 10px;">
            <button id="readButton">Read Selected Text</button>
            <br><br>
            <label for="voiceSelect">Voice: </label>
            <select id="voiceSelect"></select>
            <br><br>
            <label for="speedRange">Speed: </label>
            <input type="range" id="speedRange" min="0.5" max="2" step="0.1" value="1">
        </div>
    `;
    document.body.appendChild(gui);

    // Drag functionality
    gui.onmousedown = function(e) {
        let shiftX = e.clientX - gui.getBoundingClientRect().left;
        let shiftY = e.clientY - gui.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            gui.style.left = pageX - shiftX + 'px';
            gui.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        gui.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            gui.onmouseup = null;
        };
    };

    gui.ontouchstart = function(e) {
        let shiftX = e.touches[0].clientX - gui.getBoundingClientRect().left;
        let shiftY = e.touches[0].clientY - gui.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            gui.style.left = pageX - shiftX + 'px';
            gui.style.top = pageY - shiftY + 'px';
        }

        function onTouchMove(e) {
            moveAt(e.touches[0].pageX, e.touches[0].pageY);
        }

        document.addEventListener('touchmove', onTouchMove);

        gui.ontouchend = function() {
            document.removeEventListener('touchmove', onTouchMove);
            gui.ontouchend = null;
        };
    };

    // Disable text selection while dragging
    gui.ondragstart = function() {
        return false;
    };

    // TTS setup
    let synth = window.speechSynthesis;
    let voices = [];

    function populateVoiceList() {
        voices = synth.getVoices();
        let voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';
        voices.forEach((voice, index) => {
            let option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            option.value = index;
            voiceSelect.appendChild(option);
        });
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Detect selected text
    let selectedText = '';
    document.addEventListener('selectionchange', () => {
        let selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            selectedText = selection.toString().trim();
        }
    });

    // Read selected text using TTS
    document.getElementById('readButton').addEventListener('click', () => {
        if (selectedText) {
            let utterThis = new SpeechSynthesisUtterance(selectedText);
            utterThis.voice = voices[document.getElementById('voiceSelect').value];
            utterThis.rate = document.getElementById('speedRange').value;
            synth.speak(utterThis);
        } else {
            alert('Please select some text first.');
        }
    });
})();
