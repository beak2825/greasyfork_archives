// ==UserScript==
// @name         Spotify Web Player Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Draggable red-finished mod menu with playback, volume, shuffle, repeat, like, lyrics toggle, playback speed, captions, hide/show and more for Spotify Web Player https://open.spotify.com/ .
// @author       Marley
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538784/Spotify%20Web%20Player%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/538784/Spotify%20Web%20Player%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -- Styles for the mod menu --
    const style = document.createElement('style');
    style.textContent = `
    #spotifyModMenu {
        position: fixed;
        top: 100px;
        left: 20px;
        width: 280px;
        max-height: 420px;
        background: #111;
        border: 2px solid #b22222;
        border-radius: 10px;
        color: #eee;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
        box-shadow: 0 0 12px #b22222aa;
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        user-select: none;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #b22222 #222;
    }
    #spotifyModMenu::-webkit-scrollbar {
        width: 8px;
    }
    #spotifyModMenu::-webkit-scrollbar-track {
        background: #222;
        border-radius: 10px;
    }
    #spotifyModMenu::-webkit-scrollbar-thumb {
        background-color: #b22222;
        border-radius: 10px;
    }
    #spotifyModMenu header {
        background: #b22222;
        padding: 8px 10px;
        font-weight: bold;
        font-size: 16px;
        cursor: move;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        color: #fff;
        user-select: none;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #spotifyModMenu header .header-buttons {
        display: flex;
        gap: 8px;
    }
    #spotifyModMenu button, #spotifyModMenu input[type=range] {
        margin: 6px 10px;
        padding: 6px 10px;
        background: #222;
        border: 1.5px solid #b22222;
        border-radius: 6px;
        color: #eee;
        cursor: pointer;
        transition: background 0.3s ease;
        font-size: 14px;
        user-select: none;
    }
    #spotifyModMenu button:hover {
        background: #b22222;
        color: white;
    }
    #spotifyModMenu input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: #222;
        cursor: pointer;
        user-select: none;
    }
    #spotifyModMenu input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #b22222;
        cursor: pointer;
        border-radius: 50%;
        border: none;
        margin-top: -5px;
    }
    #spotifyModMenu input[type=range]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #b22222;
        cursor: pointer;
        border-radius: 50%;
        border: none;
    }
    #spotifyModMenu .track-info {
        padding: 8px 12px;
        font-size: 13px;
        color: #eee;
        min-height: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-top: 1.5px solid #b22222;
        border-bottom: 1.5px solid #b22222;
        user-select: text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #spotifyModMenu .playback-time {
        font-size: 12px;
        color: #ccc;
        padding: 0 10px 6px;
        user-select: none;
    }
    #spotifyModMenu .btn-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 6px 10px 10px;
        gap: 6px;
    }
    #spotifyModMenu .btn-row button {
        flex: 1 1 45%;
    }
    #spotifyModMenu .status-row {
        font-size: 12px;
        color: #bbb;
        padding: 0 12px 8px;
        user-select: none;
        display: flex;
        justify-content: space-between;
    }
    #spotifyModMenu .toggle-btn {
        background: none;
        border: none;
        color: #eee;
        font-size: 18px;
        cursor: pointer;
        padding: 0 6px;
        user-select: none;
    }
    #spotifyModMenu.light {
        background: #eee;
        color: #222;
        border-color: #b22222;
        box-shadow: 0 0 12px #b22222aa;
    }
    #spotifyModMenu.light header {
        background: #b22222;
        color: white;
    }
    #spotifyModMenu.light button {
        background: #f0f0f0;
        color: #222;
        border-color: #b22222;
    }
    #spotifyModMenu.light button:hover {
        background: #b22222;
        color: white;
    }
    #spotifyModMenu.light input[type=range] {
        background: #ccc;
    }
    #spotifyModMenu.light input[type=range]::-webkit-slider-thumb {
        background: #b22222;
    }
    #spotifyModMenu.light input[type=range]::-moz-range-thumb {
        background: #b22222;
    }
    `;

    document.head.appendChild(style);

    // -- Create UI --
    const menu = document.createElement('div');
    menu.id = 'spotifyModMenu';
    menu.innerHTML = `
    <header>
      Spotify Mod Menu
      <div class="header-buttons">
        <button title="Hide Menu" id="btnHideMenu" class="toggle-btn">&#128065;</button>
        <button title="Close Menu" id="btnCloseMenu" class="toggle-btn">&#10005;</button>
      </div>
    </header>
    <div class="track-info" title="Track — Artist">Loading track info...</div>
    <div class="playback-time">00:00 / 00:00</div>
    <div class="status-row">
      <div id="shuffleStatus">Shuffle: Off</div>
      <div id="repeatStatus">Repeat: Off</div>
      <div id="speedStatus">Speed: 1x</div>
    </div>
    <div class="btn-row">
      <button id="btnPlayPause">Play / Pause ▶️⏸️</button>
      <button id="btnPrev">Previous ⏮️</button>
      <button id="btnNext">Next ⏭️</button>
      <button id="btnShuffle">Toggle Shuffle ♻️</button>
      <button id="btnRepeat">Cycle Repeat 🔁</button>
      <button id="btnLike">Like ❤️</button>
      <button id="btnUnlike">Unlike 💔</button>
      <button id="btnMute">Mute 🔇</button>
      <button id="btnToggleLyrics">Toggle Lyrics 📝</button>
      <button id="btnToggleDevices">Toggle Devices 📱</button>
      <button id="btnRestartTrack">Restart Track 🔄</button>
      <button id="btnToggleSpeed">Toggle Speed 1x/1.5x ⚡</button>
      <button id="btnToggleCaptions">Toggle Captions 🗨️</button>
    </div>
    <div style="padding: 0 10px 10px;">
      <label for="volRange" style="font-size:12px;">Volume:</label>
      <input type="range" id="volRange" min="0" max="100" value="50" />
    </div>
    <div style="padding: 0 10px 10px;">
      <button id="btnDarkMode">Toggle Light/Dark Mode</button>
    </div>
    `;
    document.body.appendChild(menu);

    // -- Dragging logic --
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    const header = menu.querySelector('header');

    header.addEventListener('mousedown', (e) => {
        // Avoid dragging when clicking buttons
        if (e.target.closest('button')) return;
        isDragging = true;
        dragOffsetX = e.clientX - menu.offsetLeft;
        dragOffsetY = e.clientY - menu.offsetTop;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - dragOffsetX;
        let y = e.clientY - dragOffsetY;
        // Keep menu inside viewport
        const maxX = window.innerWidth - menu.offsetWidth;
        const maxY = window.innerHeight - menu.offsetHeight;
        if (x < 0) x = 0;
        else if (x > maxX) x = maxX;
        if (y < 0) y = 0;
        else if (y > maxY) y = maxY;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
    });

    // -- Buttons --
    const btnCloseMenu = menu.querySelector('#btnCloseMenu');
    const btnHideMenu = menu.querySelector('#btnHideMenu');

    btnCloseMenu.addEventListener('click', () => {
        menu.remove();
    });

    btnHideMenu.addEventListener('click', () => {
        if(menu.style.display !== 'none') {
            menu.style.display = 'none';
            // Add a small fixed show button so user can bring it back
            addShowButton();
        }
    });

    function addShowButton() {
        if(document.querySelector('#btnShowMenu')) return; // Already exists
        const btnShow = document.createElement('button');
        btnShow.id = 'btnShowMenu';
        btnShow.textContent = 'Show Mod Menu';
        Object.assign(btnShow.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: '99999999',
            padding: '8px 12px',
            fontSize: '14px',
            backgroundColor: '#b22222',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 12px #b22222aa',
            userSelect: 'none',
        });
        document.body.appendChild(btnShow);
        btnShow.addEventListener('click', () => {
            menu.style.display = 'flex';
            btnShow.remove();
        });
    }

    // -- Spotify Web Player DOM selectors & helpers --

    function getSpotifyButton(ariaLabel) {
        return document.querySelector(`button[aria-label="${ariaLabel}"]`);
    }

    function getPlayPauseBtn() {
        return getSpotifyButton('Play') || getSpotifyButton('Pause');
    }

    function getNextBtn() {
        return getSpotifyButton('Next');
    }

    function getPrevBtn() {
        return getSpotifyButton('Previous');
    }

    function getShuffleBtn() {
        return getSpotifyButton('Shuffle');
    }

    function getRepeatBtn() {
        // Repeat button aria-label cycles through "Repeat Off", "Repeat All", "Repeat One"
        // Sometimes it's "Repeat"
        return getSpotifyButton('Repeat') || getSpotifyButton('Repeat Off') || getSpotifyButton('Repeat All') || getSpotifyButton('Repeat One');
    }

    function getLikeBtn() {
        return document.querySelector('button[aria-label="Save to Your Library"], button[aria-label="Remove from Your Library"]');
    }

    function getVolumeSlider() {
        return document.querySelector('input[type="range"][aria-label="Volume"]');
    }

    // Lyrics panel toggle
    function getLyricsBtn() {
        return getSpotifyButton('Lyrics');
    }

    // Devices panel toggle
    function getDevicesBtn() {
        return getSpotifyButton('Connect to a device');
    }

    // Audio element to get playback info and control seeking
    function getAudioElement() {
        return document.querySelector('audio');
    }

    // Captions / Subtitles button - this might be tricky, try to find a button related to captions or subtitles in the UI
    function getCaptionsBtn() {
        // Spotify captions might be in a button with aria-label "Captions" or "Closed captions"
        return getSpotifyButton('Captions') || getSpotifyButton('Closed captions') || getSpotifyButton('Subtitles');
    }

    // -- Playback control functions --

    function playPause() {
        const btn = getPlayPauseBtn();
        if (btn) btn.click();
    }
    function nextTrack() {
        const btn = getNextBtn();
        if (btn) btn.click();
    }
    function prevTrack() {
        const btn = getPrevBtn();
        if (btn) btn.click();
    }
    function toggleShuffle() {
        const btn = getShuffleBtn();
        if (btn) btn.click();
    }
    function cycleRepeat() {
        const btn = getRepeatBtn();
        if (btn) btn.click();
    }
    function toggleLike() {
        const btn = getLikeBtn();
        if (btn && btn.getAttribute('aria-label') === 'Save to Your Library') btn.click();
    }
    function toggleUnlike() {
        const btn = getLikeBtn();
        if (btn && btn.getAttribute('aria-label') === 'Remove from Your Library') btn.click();
    }
    function muteToggle() {
        const volSlider = getVolumeSlider();
        if (!volSlider) return;
        if (volSlider.value > 0) {
            volSlider.dataset.lastVolume = volSlider.value;
            volSlider.value = 0;
        } else {
            volSlider.value = volSlider.dataset.lastVolume || 50;
        }
        triggerVolumeEvents(volSlider);
    }
    function setVolume(value) {
        const volSlider = getVolumeSlider();
        if (!volSlider) return;
        volSlider.value = value;
        triggerVolumeEvents(volSlider);
    }

    // Helper to trigger input and change events for volume slider reliably
    function triggerVolumeEvents(elem) {
        elem.dispatchEvent(new Event('input', { bubbles: true }));
        elem.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function toggleLyrics() {
        const btn = getLyricsBtn();
        if (btn) btn.click();
    }
    function toggleDevices() {
        const btn = getDevicesBtn();
        if (btn) btn.click();
    }
    function restartTrack() {
        const audio = getAudioElement();
        if (audio) audio.currentTime = 0;
    }

    // Playback speed toggle (1x or 1.5x)
    let currentSpeed = 1;
    function toggleSpeed() {
        const audio = getAudioElement();
        if (!audio) return;
        if (currentSpeed === 1) currentSpeed = 1.5;
        else currentSpeed = 1;
        audio.playbackRate = currentSpeed;
    }

    // Toggle captions/subtitles
    function toggleCaptions() {
        const btn = getCaptionsBtn();
        if (btn) btn.click();
        else alert('Captions/Subtitles button not found or not available');
    }

    // -- Update track info and playback time & status --

    const trackInfoDiv = menu.querySelector('.track-info');
    const playbackTimeDiv = menu.querySelector('.playback-time');
    const shuffleStatusDiv = menu.querySelector('#shuffleStatus');
    const repeatStatusDiv = menu.querySelector('#repeatStatus');
    const speedStatusDiv = menu.querySelector('#speedStatus');

    function formatTime(sec) {
        if (isNaN(sec) || sec === Infinity) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }

    function updateStatuses() {
        // Shuffle status
        const shuffleBtn = getShuffleBtn();
        if (shuffleBtn) {
            const ariaPressed = shuffleBtn.getAttribute('aria-pressed');
            shuffleStatusDiv.textContent = 'Shuffle: ' + (ariaPressed === 'true' ? 'On' : 'Off');
        } else {
            shuffleStatusDiv.textContent = 'Shuffle: N/A';
        }
        // Repeat status - check aria-label or aria-pressed
        const repeatBtn = getRepeatBtn();
        if (repeatBtn) {
            let repeatText = 'Repeat: Off';
            const label = repeatBtn.getAttribute('aria-label');
            if (label) {
                if (label.toLowerCase().includes('off')) repeatText = 'Repeat: Off';
                else if (label.toLowerCase().includes('all')) repeatText = 'Repeat: All';
                else if (label.toLowerCase().includes('one')) repeatText = 'Repeat: One';
            }
            repeatStatusDiv.textContent = repeatText;
        } else {
            repeatStatusDiv.textContent = 'Repeat: N/A';
        }
        // Speed status
        speedStatusDiv.textContent = `Speed: ${currentSpeed}x`;
    }

    function updateTrackInfo() {
        const trackName = document.querySelector('.Root__now-playing-bar .track-info__name a')?.textContent?.trim();
        const artistName = document.querySelector('.Root__now-playing-bar .track-info__artists a')?.textContent?.trim();
        if (trackName && artistName) {
            trackInfoDiv.textContent = `${trackName} — ${artistName}`;
        } else {
            trackInfoDiv.textContent = 'No track playing';
        }
        const audio = getAudioElement();
        if (audio) {
            playbackTimeDiv.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        } else {
            playbackTimeDiv.textContent = '00:00 / 00:00';
        }
        updateStatuses();
    }

    // -- Volume slider control --
    const volRange = menu.querySelector('#volRange');
    volRange.addEventListener('input', (e) => {
        setVolume(e.target.value);
    });

    // Sync slider with actual volume changes from Spotify
    function syncVolumeSlider() {
        const volSlider = getVolumeSlider();
        if (!volSlider) return;
        volRange.value = volSlider.value;
    }

    // -- Button events --
    menu.querySelector('#btnPlayPause').addEventListener('click', () => { playPause(); });
    menu.querySelector('#btnNext').addEventListener('click', () => { nextTrack(); });
    menu.querySelector('#btnPrev').addEventListener('click', () => { prevTrack(); });
    menu.querySelector('#btnShuffle').addEventListener('click', () => {
        toggleShuffle();
        setTimeout(updateStatuses, 500);
    });
    menu.querySelector('#btnRepeat').addEventListener('click', () => {
        cycleRepeat();
        setTimeout(updateStatuses, 500);
    });
    menu.querySelector('#btnLike').addEventListener('click', () => { toggleLike(); });
    menu.querySelector('#btnUnlike').addEventListener('click', () => { toggleUnlike(); });
    menu.querySelector('#btnMute').addEventListener('click', () => { muteToggle(); });
    menu.querySelector('#btnToggleLyrics').addEventListener('click', () => { toggleLyrics(); });
    menu.querySelector('#btnToggleDevices').addEventListener('click', () => { toggleDevices(); });
    menu.querySelector('#btnRestartTrack').addEventListener('click', () => { restartTrack(); });
    menu.querySelector('#btnToggleSpeed').addEventListener('click', () => {
        toggleSpeed();
        updateStatuses();
    });
    menu.querySelector('#btnToggleCaptions').addEventListener('click', () => { toggleCaptions(); });

    // Dark/Light mode toggle
    menu.querySelector('#btnDarkMode').addEventListener('click', () => {
        if(menu.classList.contains('light')) {
            menu.classList.remove('light');
        } else {
            menu.classList.add('light');
        }
    });

    // -- Periodic updates --
    setInterval(() => {
        updateTrackInfo();
        syncVolumeSlider();
    }, 1000);

})();
