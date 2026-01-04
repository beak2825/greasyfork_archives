// ==UserScript==
// @name         Audio in Drawaria
// @namespace    https://tampermonkey.net/
// @version      1.2
// @license      MIT
// @author       Dipsan dhimal
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZDUqjRko7Ws05tXGYs6VXi40C2R4qo5dQdA&s
// @match        https://drawaria.online/*
// @grant        none
// @description  play music!
// @downloadURL https://update.greasyfork.org/scripts/536270/Audio%20in%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/536270/Audio%20in%20Drawaria.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create container box
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.left = '10px';
    box.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    box.style.color = '#fff';
    box.style.padding = '10px';
    box.style.borderRadius = '8px';
    box.style.zIndex = '9999';
    box.style.fontFamily = 'Arial';
    box.style.fontSize = '14px';
    box.innerHTML = '<b>🎵 Audio Player</b><br><br>';

    // File input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.marginBottom = '5px';
    box.appendChild(fileInput);

    // Audio element (hidden)
    const audio = document.createElement('audio');
    audio.controls = false;
    audio.style.display = 'none';
    document.body.appendChild(audio);

    // Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = '▶️ Play';
    playBtn.style.marginRight = '5px';
    playBtn.onclick = () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            audio.src = URL.createObjectURL(file);
            audio.play();
        } else {
            alert('Please upload an audio file first.');
        }
    };
    box.appendChild(playBtn);

    // Stop button
    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹️ Stop';
    stopBtn.onclick = () => {
        audio.pause();
        audio.currentTime = 0;
    };
    box.appendChild(stopBtn);

    // Add to page
    document.body.appendChild(box);
})();
