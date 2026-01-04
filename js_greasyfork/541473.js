// ==UserScript==
// @name         Voxiom.io Music Player
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Plays custom MP3 music on voxiom.io with timestamps, persistence, and live tracking with a toggleable GUI
// @author       AlanKoss
// @license      MIT
// @match        https://voxiom.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541473/Voxiomio%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/541473/Voxiomio%20Music%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        url: 'https://files.catbox.moe/vvejh9.mp3', // Your MP3 link
        volume: 0.7,
        loop: false,
        title: 'Blade Runner Aesthetic Mix',
        timestamps: [
            { time: '00:00:00', label: 'Memory Reboot' },
            { time: '00:03:56', label: 'Resonance' },
            { time: '00:07:29', label: 'After Dark' },
            { time: '00:11:46', label: 'A Brighter Future' },
            { time: '00:13:56', label: 'SimpsonWave1995' },
            { time: '00:16:17', label: 'Silhouette' },
            { time: '00:20:07', label: 'Iris' },
            { time: '00:23:46', label: 'Maria_Did_U_Hear' },
            { time: '00:25:39', label: 'Untitled_13' },
            { time: '00:27:34', label: 'Sleepwalker' },
            { time: '00:31:06', label: 'Jealous' },
            { time: '00:33:08', label: 'The_scarlett_empress' },
            { time: '00:34:35', label: 'A_Real_Hero' },
            { time: '00:39:02', label: 'bessiliye' },
            { time: '00:43:56', label: 'Make Me a Blood_Eagle' },
            { time: '00:46:34', label: 'Wave To Me' },
            { time: '00:52:10', label: 'In My Head' },
            { time: '00:58:04', label: 'Separate' },
            { time: '01:00:06', label: 'walkin forever' },
        ]
    };

    const audio = new Audio(CONFIG.url);
    audio.volume = CONFIG.volume;
    audio.loop = CONFIG.loop;

    // Load saved playback position
    const savedTime = parseFloat(localStorage.getItem('musicCurrentTime'));
    if (!isNaN(savedTime)) {
        audio.currentTime = savedTime;
    }

    // Save current playback time every second
    setInterval(() => {
        localStorage.setItem('musicCurrentTime', audio.currentTime);
    }, 1000);

    // Helper to convert HH:MM:SS to seconds
    function toSeconds(time) {
        const parts = time.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    // Play audio, handle autoplay blocking
    function tryPlay() {
        audio.play().catch(() => {
            console.warn('Autoplay blocked. Click anywhere to start music.');
            document.body.addEventListener('click', () => {
                audio.play();
            }, { once: true });
        });
    }

    // Create the GUI panel and toggle button
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'musicPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '10px';
        panel.style.right = '10px';
        panel.style.padding = '10px';
        panel.style.background = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = 'white';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '12px';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = 9999;
        panel.style.maxHeight = '250px';
        panel.style.overflowY = 'auto';
        panel.style.backdropFilter = 'blur(4px)';
        panel.style.display = 'block';  // Start visible

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🎵 Hide';
        toggleBtn.style.position = 'fixed';  // So it stays clickable outside panel
        toggleBtn.style.bottom = '270px';
        toggleBtn.style.right = '10px';
        toggleBtn.style.padding = '4px 8px';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.borderRadius = '6px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.background = '#222';
        toggleBtn.style.color = 'white';
        toggleBtn.style.cursor = 'pointer';

        toggleBtn.onclick = () => {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                toggleBtn.textContent = '🎵 Hide';
            } else {
                panel.style.display = 'none';
                toggleBtn.textContent = '🎵 Show';
            }
        };

        document.body.appendChild(toggleBtn);

        panel.innerHTML = `<div style="margin-bottom:6px;"><b>🎶 Now Playing:</b> <span id="nowPlaying">Loading...</span></div>`;

        CONFIG.timestamps.forEach(ts => {
            const btn = document.createElement('button');
            btn.textContent = ts.label;
            btn.style.display = 'block';
            btn.style.margin = '2px 0';
            btn.style.width = '100%';
            btn.style.background = '#444';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.onclick = () => {
                audio.currentTime = toSeconds(ts.time);
                audio.play();
            };
            panel.appendChild(btn);
        });

        document.body.appendChild(panel);
    }

    // Update now playing label based on current time
    function updateNowPlaying() {
        const currentTime = audio.currentTime;
        let currentLabel = 'Unknown';
        for (let i = 0; i < CONFIG.timestamps.length; i++) {
            const seconds = toSeconds(CONFIG.timestamps[i].time);
            if (currentTime >= seconds) {
                currentLabel = CONFIG.timestamps[i].label;
            } else {
                break;
            }
        }
        const labelElement = document.getElementById('nowPlaying');
        if (labelElement) labelElement.textContent = currentLabel;
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createUI();
            tryPlay();
            updateNowPlaying();
            setInterval(updateNowPlaying, 1000);
        }, 3000);
    });

    // Optional: pause when tab inactive, play when focused
    window.addEventListener('blur', () => audio.pause());
    window.addEventListener('focus', () => audio.play());

})();
