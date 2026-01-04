// ==UserScript==
// @name         Gartic Phone Auto Draw + Music Player + Random Fruit(AI)
// @namespace    https://greasyfork.org/en/users/fdslalkad
// @version      3.0
// @description  Fixes auto-draw, music playback, and drag & drop issues.
// @author       fdslalkad
// @match        *://garticphone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530944/Gartic%20Phone%20Auto%20Draw%20%2B%20Music%20Player%20%2B%20Random%20Fruit%28AI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530944/Gartic%20Phone%20Auto%20Draw%20%2B%20Music%20Player%20%2B%20Random%20Fruit%28AI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedImage = null;
    let audio = new Audio();
    let musicPlaylist = [
        { name: "Monkeys Spinning Monkeys", author: "Kevin MacLeod", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Monkeys_Spinning_Monkeys/Monkeys_Spinning_Monkeys.mp3" },
        { name: "Sneaky Snitch", author: "Kevin MacLeod", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Sneaky_Snitch/Sneaky_Snitch.mp3" }
    ];
    let currentSongIndex = 0;

    function playMusic(index) {
        if (index < 0 || index >= musicPlaylist.length) return;
        let song = musicPlaylist[index];
        audio.src = song.url;
        audio.play();
        document.getElementById("nowPlaying").innerText = `Now Playing: ${song.name} | by ${song.author}`;
    }

    function autoDraw(imageSrc) {
        let canvas = document.querySelector("canvas");
        if (!canvas) {
            console.error("Canvas not found!");
            return;
        }
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = function() {
            console.error("Failed to load image for auto-drawing");
        };
    }

    function handleImageUpload(event) {
        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                selectedImage = e.target.result;
                autoDraw(selectedImage);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleImageUrl() {
        let url = document.getElementById("imageUrl").value;
        if (url) {
            selectedImage = url;
            autoDraw(selectedImage);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                selectedImage = e.target.result;
                autoDraw(selectedImage);
            };
            reader.readAsDataURL(file);
        }
    }

    let gui = document.createElement('div');
    gui.id = 'customGui';
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.right = '10px';
    gui.style.background = 'rgba(0,0,0,0.8)';
    gui.style.color = 'white';
    gui.style.padding = '10px';
    gui.style.borderRadius = '5px';
    gui.style.zIndex = '10000';
    gui.style.display = 'block';
    gui.innerHTML = `
        <button id="autoDrawBtn">Auto Draw</button><br>
        <input type="file" id="uploadImage" accept="image/*"><br>
        <input type="text" id="imageUrl" placeholder="Image URL">
        <button id="loadImageBtn">Load Image</button><br>
        <button id="playMusicBtn">Play Random Music</button>
        <button id="pauseMusicBtn">Pause</button>
        <button id="resumeMusicBtn">Play</button>
        <button id="nextMusicBtn">Next</button>
        <button id="prevMusicBtn">Previous</button>
        <button id="stopMusicBtn">Stop</button>
        <p id="nowPlaying"></p>
    `;
    document.body.appendChild(gui);

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
        }
    });

    document.getElementById("autoDrawBtn").addEventListener("click", () => {
        if (selectedImage) {
            autoDraw(selectedImage);
        }
    });
    document.getElementById("uploadImage").addEventListener("change", handleImageUpload);
    document.getElementById("loadImageBtn").addEventListener("click", handleImageUrl);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    document.getElementById("playMusicBtn").addEventListener("click", () => playMusic(currentSongIndex));
    document.getElementById("pauseMusicBtn").addEventListener("click", () => audio.pause());
    document.getElementById("resumeMusicBtn").addEventListener("click", () => audio.play());
    document.getElementById("nextMusicBtn").addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % musicPlaylist.length;
        playMusic(currentSongIndex);
    });
    document.getElementById("prevMusicBtn").addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
        playMusic(currentSongIndex);
    });
    document.getElementById("stopMusicBtn").addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
    });
})();
