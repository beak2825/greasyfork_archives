// ==UserScript==
// @name         DuoHelper
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  This tool helps you listen to music while studying
// @author       @kietxx_163 and @bot1.py
// @match        https://*.duolingo.com/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/leagues/da3da435ad26e5c57d4c5235406ff938.svg
// @downloadURL https://update.greasyfork.org/scripts/506604/DuoHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/506604/DuoHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let basePing = 100; // Basic Ping (ms)
    let baseFps = 60; // Basic FPS

    let ping = basePing; // Current ping value (ms)
    let fps = baseFps; // Current FPS value
    let sessionStartTime = Date.now(); // Session start time

    function isLocalStorageSupported() {
        try {
            const testKey = '__testKey';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    if (!isLocalStorageSupported()) {
        console.error('LocalStorage is not supported.');
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --text-color: black; /* Default text color */
            --background-color: white; /* Default background color */
        }

        @keyframes rainbow-border {
            100% { border-color: black; }
        }

        #performanceMonitor {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px;
            border: 5px solid;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            width: 200px;
            height: auto;
            text-align: left;
            overflow: hidden;
            cursor: pointer;
            z-index: 9999;
            transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out, transform 0.3s ease-in-out;
            background-color: var(--background-color); /* Use the CSS variable for background color */
            background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAAA...');
            background-size: 32px 32px;
            background-repeat: no-repeat;
            background-position: 10px center;
            animation: rainbow-border 3s linear infinite;
            color: var(--text-color); /* Use the CSS variable for text color */
        }
        #performanceMonitor.hidden {
            width: 80px;
            transform: scale(0.9);
        }
        #performanceContentWrapper {
            transition: opacity 0.3s ease-in-out;
        }
        #performanceContentWrapper.hidden {
            opacity: 0;
            height: 0;
            overflow: hidden;
        }
        #performanceMonitor button {
            display: block;
            margin-bottom: 5px;
            cursor: pointer;
            background-color: #444; /* Fixed button background color */
            color: white; /* Fixed button text color */
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            transition: background-color 0.3s, transform 0.3s;
        }
        #performanceMonitor button:hover {
            background-color: #666;
            transform: scale(1.05);
        }
        .modal {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            background-color: rgba(255, 255, 255, 0.9); /* Default modal background */
            color: var(--text-color); /* Use the CSS variable for modal text color */
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
        }
        .modal.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        .modal h3 {
            margin-bottom: 10px;
        }
        .modal label {
            display: block;
            margin-bottom: 5px;
        }
        .modal input[type="email"], .modal textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: #f9f9f9; /* Default input background color */
            color: var(--text-color); /* Use the CSS variable for input text color */
        }
        .modal textarea {
            height: 100px; /* Set height for feedback textarea */
            resize: vertical; /* Allow vertical resizing */
        }
        .modal button {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #1cb0f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .modal button:hover {
            background-color: #0a7bb0;
        }
        #settingsPanel {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            background-color: rgba(255, 255, 255, 0.9); /* Default settings panel background */
            color: var(--text-color); /* Use the CSS variable for settings panel text color */
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
        }
        #settingsPanel.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        #settingsPanel h3 {
            margin-bottom: 10px;
        }
        #musicMenu {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            background-color: rgba(255, 255, 255, 0.9);
            color: var(--text-color);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
            max-height: 80%;
            overflow-y: auto;
        }
        #musicMenu.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        #musicMenu button {
            display: block;
            margin-bottom: 5px;
            cursor: pointer;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            transition: background-color 0.3s, transform 0.3s;
        }
        #musicMenu button:hover {
            background-color: #666;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);

    // Add audio element
    const audio = document.createElement('audio');
    audio.id = 'backgroundMusic';
    audio.src = 'https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3';
    audio.loop = true; // Lặp lại nhạc liên tục
    document.body.appendChild(audio);

    const container = document.createElement('div');
    container.id = 'performanceMonitor';
    container.title = 'Click to hide/show';
    document.body.appendChild(container);

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'performanceContentWrapper';
    container.appendChild(contentWrapper);

    const content = document.createElement('div');
    content.id = 'performanceContent';
    contentWrapper.appendChild(content);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide';
    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.backgroundColor = '#666';
    });
    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.backgroundColor = '#444';
    });
    toggleButton.addEventListener('click', () => {
        const isVisible = !contentWrapper.classList.contains('hidden');
        contentWrapper.classList.toggle('hidden', isVisible);
        toggleButton.textContent = isVisible ? 'Show' : 'Hide';

        const monitor = document.getElementById('performanceMonitor');
        monitor.classList.toggle('hidden', isVisible);
    });
    container.appendChild(toggleButton);

    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload';
    reloadButton.addEventListener('click', () => {
        location.reload();
    });
    contentWrapper.appendChild(reloadButton);

    const discordButton = document.createElement('button');
    discordButton.textContent = 'Discord';
    discordButton.addEventListener('click', () => {
        window.open('https://discord.gg/XSXPtD5hD4', '_blank');
         window.open('https://discord.gg/TcFcpsPVNm', '_blank');
    });
    contentWrapper.appendChild(discordButton);

    // New Music Button
    const chooseMusicButton = document.createElement('button');
    chooseMusicButton.textContent = 'Music';
    chooseMusicButton.addEventListener('click', () => {
        showMusicMenu();
    });
    contentWrapper.appendChild(chooseMusicButton);

    // Music Menu
    const musicMenu = document.createElement('div');
    musicMenu.id = 'musicMenu';
    musicMenu.innerHTML = `
        <h3>Select Music</h3>
   <button data-music-url="https://ia601604.us.archive.org/29/items/gio-jank/GI%C3%93%20-%20JANK.mp3">Gió (Song by JanK)</button>
<button data-music-url="https://ia803408.us.archive.org/29/items/keo-bong-gon-xuan-ken/Keo-Bong-Gon-XuanKen.mp3">Kẹo Bông Gòn</button>
  <button data-music-url="https://ia904609.us.archive.org/24/items/VicetoneFeat.CoziZuehlsdorff-Nevadamp3edm.eu/Vicetone%20feat.%20Cozi%20Zuehlsdorff%20%E2%80%93%20Nevada%20%5Bmp3edm.eu%5D.mp3">Nevada</button>
 <button data-music-url="https://ia801709.us.archive.org/20/items/10-lies/06%20Runaway.mp3">Runaway</button>
         <button data-music-url="https://ia902307.us.archive.org/35/items/the-kid-laroi-justin-bieber-stay_20211019/The%20Kid%20LAROI%20Justin%20Bieber%20STAY.mp3">STAY</button>
                  <button data-music-url="https://ia801801.us.archive.org/26/items/tuyet-sac-orinn-remix-nam-duc-nhac-tre-mo-xuyen-tet-v.-a-playlist-nhac-cua-tui/Tuy%E1%BB%87t%20S%E1%BA%AFc%20%28Orinn%20Remix%29%20-%20Nam%20%C4%90%E1%BB%A9c%20-%20Nh%E1%BA%A1c%20Tr%E1%BA%BB%20M%E1%BB%9F%20Xuy%C3%AAn%20T%E1%BA%BFt%20-%20V.A%20-%20Playlist%20NhacCuaTui.mp3">Tuyệt Sắc</button>
                <button data-music-url="https://ia601409.us.archive.org/9/items/youtube-Ko63BameVgI/Ko63BameVgI.mp4">少女A</button>
                         <button data-music-url="https://ia601502.us.archive.org/0/items/NoiNayCoAnhSonTungMTPZingMP3/N%C6%A1i%20N%C3%A0y%20C%C3%B3%20Anh%20-%20S%C6%A1n%20T%C3%B9ng%20M-TP%20_%20Zing%20MP3.MP3">Nơi Này Có Anh</button>
                               <button data-music-url="https://ia801404.us.archive.org/28/items/duong-toi-cho-em-ve-cukak-remix-buitruonglinh-cukak/%C4%90%C6%B0%E1%BB%9Dng%20T%C3%B4i%20Ch%E1%BB%9F%20Em%20V%E1%BB%81%20%28Cukak%20Remix%29%20-%20buitruonglinh%2C%20Cukak.mp3">đường tôi chở  em về</button>
                                                  <button data-music-url="https://ia600304.us.archive.org/16/items/soundcloud-295595865/Alan_Walker_-_Fade-295595865.mp3">Faded</button>
                                                  <button data-music-url="https://ia800909.us.archive.org/0/items/AlanWalkerAlone_201902/Alan_Walker_-_Alone.mp3">Alone by Alan Walker</button>
                                                  <button data-music-url="https://ia801503.us.archive.org/26/items/soundcloud-251045088/Janji_Heroes_Tonight_feat_Johnning_SNC-251045088.mp3">Heroes Tonight</button>
                                                  <button data-music-url="https://ia601403.us.archive.org/24/items/soundcloud-1013787601/1013787601.mp3">Royalty</button>
                                                  <button data-music-url="https://ia903402.us.archive.org/5/items/100-years-love-nam-duc-hello-lover-v.-a-playlist-nhac-cua-tui/100%20Years%20LOVE%20-%20Nam%20%C4%90%E1%BB%A9c%20-%20Hello%20Lover%20-%20V.A%20-%20Playlist%20NhacCuaTui.mp3">100 Years Love</button>
                                                  <button data-music-url="https://ia801808.us.archive.org/20/items/eternxlkz-slay-official-audio/Eternxlkz%20-%20SLAY%21%20%28Official%20Audio%29.mp3">SLAY</button>
                                                  <button data-music-url="https://ia804705.us.archive.org/27/items/grimace-cg-5/GRIMACE%20-%20CG5.mp3">CG5 - Grimace</button>
                                                  <button data-music-url="https://ia601407.us.archive.org/19/items/dom-dom-jack_202210/%C4%90om%20%C4%90%C3%B3m%20-%20Jack.mp3">đom đóm</button>
                                                  <button data-music-url="https://ia801607.us.archive.org/21/items/mice-on-venus-vinyl/Mice%20on%20Venus.mp3">Mice On Venus by C418</button>
                                                  <button data-music-url="https://ia804708.us.archive.org/17/items/mice-on-venus-but-make-it-extra-nostalgic-1-hour/Mice%20On%20Venus%20but%20make%20it%20extra%20nostalgic%20%281%20hour%29.mp3">Mice On Venus But Make It Extra Nostalgic</button>
                                                  <button data-music-url="https://ia800407.us.archive.org/3/items/avicii-the-nights_202409/Avicii_-_The_Nights.mp3">Avicii The Nights</button>
                                                  <button data-music-url="https://ia902309.us.archive.org/5/items/avicii-waiting-for-love_202109/Avicii%20-%20Waiting%20For%20Love.mp4">Avicii Waiting For Love</button>
              <button data-music-url="https://example.com/your-other-music.mp3">Stop Music</button>
        <button id="closeMusicMenu">Close</button
    `;
    document.body.appendChild(musicMenu);

    document.getElementById('closeMusicMenu').addEventListener('click', () => {
        musicMenu.classList.remove('show');
    });

    musicMenu.querySelectorAll('button[data-music-url]').forEach(button => {
        button.addEventListener('click', () => {
            const musicUrl = button.getAttribute('data-music-url');
            const audioElement = document.getElementById('backgroundMusic');
            audioElement.src = musicUrl;
            audioElement.play();
            chooseMusicButton.textContent = 'Music';
            musicMenu.classList.remove('show');
        });
    });

    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = 'Feedback';
    feedbackButton.addEventListener('click', () => {
        showFeedbackModal();
    });
    contentWrapper.appendChild(feedbackButton);

    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Settings';
    settingsButton.addEventListener('click', () => {
        showSettingsPanel();
    });
    contentWrapper.appendChild(settingsButton);

    async function measurePing(url) {
        try {
            const start = performance.now();
            const response = await fetch(url, { method: 'HEAD' });
            await response;
            const end = performance.now();
            const pingValue = Math.round(end - start) + ' ms';
            updateDisplay(pingValue);
        } catch (error) {
            console.error('Ping Error:', error);
            updateDisplay('Error');
        }
    }

    let lastFrameTime = performance.now();
    let frameCount = 0;

    function measureFPS() {
        const now = performance.now();
        const delta = now - lastFrameTime;
        frameCount++;

        if (delta >= 1000) {
            const fpsValue = Math.round((frameCount * 1000) / delta);
            updateDisplay(null, fpsValue);
            frameCount = 0;
            lastFrameTime = now;
        }

        requestAnimationFrame(measureFPS);
    }

    function updateDisplay(pingValue, fpsValue) {
        if (pingValue !== undefined) {
            ping = pingValue;
        }
        if (fpsValue !== undefined) {
            fps = fpsValue;
        }

        const elapsedTime = formatSessionTime(Date.now() - sessionStartTime);

        const display = document.getElementById('performanceContent');
        display.innerHTML = `
            <div><strong>Ping:</strong> ${ping}</div>
            <div><strong>FPS:</strong> ${fps}</div>
            <div><strong>Session Time:</strong> ${elapsedTime}</div>
        `;
    }

    function formatSessionTime(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    const feedbackModal = document.createElement('div');
    feedbackModal.className = 'modal';
    feedbackModal.innerHTML = `
        <h3>Send Feedback</h3>
        <div>
            <label for="feedbackMessage">Your Report:</label>
            <textarea id="feedbackMessage"></textarea>
        </div>
        <button id="sendFeedback" style="margin-top: 10px;">Submit</button>
        <button id="cancelFeedback" style="margin-top: 10px;">Cancel</button>
    `;
    document.body.appendChild(feedbackModal);

    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settingsPanel';
    settingsPanel.innerHTML = `
        <h3>Settings</h3>
        <div>
            <label for="fontSize">Font Size:</label>
            <input type="number" id="fontSize" value="14" min="10" max="30" />
        </div>
        <div>
            <label for="backgroundColor">Background Color:</label>
            <input type="color" id="backgroundColor" value="#ffffff" />
        </div>
        <div>
            <label for="transparentBackground">Transparent Background:</label>
            <input type="checkbox" id="transparentBackground" />
        </div>
        <button id="applySettings" style="margin-top: 10px;">Apply</button>
        <button id="resetSettings" style="margin-top: 10px;">Reset to Default</button>
        <button id="cancelSettings" style="margin-top: 10px;">Cancel</button>
    `;
    document.body.appendChild(settingsPanel);

    function hideAllPanels() {
        feedbackModal.classList.remove('show');
        settingsPanel.classList.remove('show');
        musicMenu.classList.remove('show');
        document.getElementById('performanceContentWrapper').classList.remove('hidden');
    }

    document.getElementById('sendFeedback').addEventListener('click', () => {
        const feedback = document.getElementById('feedbackMessage').value;
        if (feedback) {
            // Normally, you would send the feedback to your backend here.
            console.log('Feedback:', feedback);
            alert('Feedback sent!');
            feedbackModal.classList.remove('show');
        } else {
            alert('Please enter your feedback.');
        }
    });

    document.getElementById('cancelFeedback').addEventListener('click', () => {
        feedbackModal.classList.remove('show');
    });

    document.getElementById('applySettings').addEventListener('click', () => {
        const fontSize = document.getElementById('fontSize').value + 'px';
        const backgroundColor = document.getElementById('backgroundColor').value;
        const isTransparent = document.getElementById('transparentBackground').checked;

        const performanceMonitor = document.getElementById('performanceMonitor');
        performanceMonitor.style.fontSize = fontSize;
        performanceMonitor.style.backgroundColor = isTransparent ? 'rgba(255, 255, 255, 0)' : backgroundColor;

        // Update text color based on background color
        const textColor = getContrastColor(backgroundColor);
        document.documentElement.style.setProperty('--text-color', textColor);

        alert('Settings applied.');
    });

    document.getElementById('resetSettings').addEventListener('click', () => {
        document.getElementById('fontSize').value = '14';
        document.getElementById('backgroundColor').value = '#ffffff';
        document.getElementById('transparentBackground').checked = false;

        const performanceMonitor = document.getElementById('performanceMonitor');
        performanceMonitor.style.fontSize = '14px';
        performanceMonitor.style.backgroundColor = 'white';

        // Reset text color to default
        document.documentElement.style.setProperty('--text-color', 'black');

        alert('Settings reset to default.');
    });

    document.getElementById('cancelSettings').addEventListener('click', () => {
        settingsPanel.classList.remove('show');
    });

    function showFeedbackModal() {
        hideAllPanels();
        feedbackModal.classList.add('show');
    }

    function showSettingsPanel() {
        hideAllPanels();
        settingsPanel.classList.add('show');
    }

    function showMusicMenu() {
        hideAllPanels();
        musicMenu.classList.add('show');
    }

    function getContrastColor(hex) {
        // Calculate luminance and return black or white based on contrast
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 128 ? 'black' : 'white';
    }

    measureFPS();

    setInterval(() => {
        measurePing('https://www.google.com');
    }, 30000);

})();
