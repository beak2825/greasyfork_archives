// ==UserScript==
// @name         Highlighter with TTS and Lasso Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight text and read using TTS with options for voice and speed.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510642/Highlighter%20with%20TTS%20and%20Lasso%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/510642/Highlighter%20with%20TTS%20and%20Lasso%20Tool.meta.js
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
            <button id="lassoButton">Select Text</button>
            <br><br>
            <button id="readButton">Read</button>
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

    // Lasso tool to select text
    let selectedText = '';
    document.getElementById('lassoButton').addEventListener('click', () => {
        document.body.style.cursor = 'crosshair';
        document.onmouseup = function() {
            selectedText = window.getSelection().toString();
            document.body.style.cursor = 'default';
            document.onmouseup = null;
        };
    });

    // Read selected text using TTS
    document.getElementById('readButton').addEventListener('click', () => {
        if (selectedText) {
            let utterThis = new SpeechSynthesisUtterance(selectedText);
            utterThis.voice = voices[document.getElementById('voiceSelect').value];
            utterThis.rate = document.getElementById('speedRange').value;
            synth.speak(utterThis);
        } else {
            alert('Please select text first.');
        }
    });
})();
