// ==UserScript==
// @name         Snake.io Cheat GUI with Backend
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds cheats and custom audio to Snake.io with server-side interaction.
// @author       Your Name
// @match        *://snake.io/*
// @grant        GM_xmlhttpRequest
// @connect      your-backend-server.com
// @downloadURL https://update.greasyfork.org/scripts/504885/Snakeio%20Cheat%20GUI%20with%20Backend.user.js
// @updateURL https://update.greasyfork.org/scripts/504885/Snakeio%20Cheat%20GUI%20with%20Backend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gui.style.color = 'white';
    gui.style.padding = '10px';
    gui.style.zIndex = '1000';
    gui.style.borderRadius = '5px';
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.innerHTML = `
        <h3>Snake.io Cheats</h3>
        <button id="barrierBypass">Barrier Bypass</button><br><br>
        <button id="speedBoost">Speed Boost</button><br><br>
        <button id="characterChanger">Change Character</button><br><br>
        <input type="text" id="nameChanger" placeholder="Enter New Name"><br><br>
        <button id="applyNameChange">Change Name</button><br><br>
        <input type="text" id="audioURL" placeholder="Enter YouTube Audio URL"><br><br>
        <button id="applyAudioChange">Change Audio</button><br><br>
    `;
    document.body.appendChild(gui);

    // Helper function for server communication
    function sendToBackend(action, data) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://your-backend-server.com/api/cheats',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ action, data }),
            onload: function(response) {
                console.log('Server response:', response.responseText);
            },
            onerror: function(error) {
                console.error('Error communicating with the server:', error);
            }
        });
    }

    // Cheat Functions
    function barrierBypass() { sendToBackend('barrierBypass'); }
    function speedBoost() { sendToBackend('speedBoost'); }
    function changeCharacter() { sendToBackend('changeCharacter'); }
    function changeName(newName) { sendToBackend('changeName', newName); }
    function startCustomAudio(url) { sendToBackend('customAudio', url); }

    // Event Listeners for GUI buttons
    document.getElementById('barrierBypass').addEventListener('click', barrierBypass);
    document.getElementById('speedBoost').addEventListener('click', speedBoost);
    document.getElementById('characterChanger').addEventListener('click', changeCharacter);
    document.getElementById('applyNameChange').addEventListener('click', () => {
        const newName = document.getElementById('nameChanger').value;
        if (newName) { changeName(newName); }
    });
    document.getElementById('applyAudioChange').addEventListener('click', () => {
        const audioURL = document.getElementById('audioURL').value;
        if (audioURL) { startCustomAudio(audioURL); }
    });

})();
