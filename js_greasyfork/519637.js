// ==UserScript==
// @name         Web Speech API to WebSocket (Speech-to-Text)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Captures speech input using the Web Speech API and sends it to a WebSocket server in real-time
// @author       Psycho
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519637/Web%20Speech%20API%20to%20WebSocket%20%28Speech-to-Text%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519637/Web%20Speech%20API%20to%20WebSocket%20%28Speech-to-Text%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WebSocket connection (replace with your server's WebSocket URL)
    const ws = new WebSocket('wss://echo.websocket.events');  // Replace with the correct WebSocket URL

    ws.onopen = () => console.log('WebSocket connected');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    // Setup Web Speech API (SpeechRecognition)
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        console.log('Speech to Text:', transcript);
        
        // Send speech data to WebSocket
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(transcript);
        }
    };

    // Start speech recognition
    recognition.start();
})();