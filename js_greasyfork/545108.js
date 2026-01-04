// ==UserScript==
// @name         Drawaria - Music Player PRO (Fixed)
// @namespace    http://violentmonkey.com/
// @version      6.5
// @description  Listen to music with this
// @match        https://drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://n.drawaria.online/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @author       YouTubeDrawaria
// @downloadURL https://update.greasyfork.org/scripts/545108/Drawaria%20-%20Music%20Player%20PRO%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545108/Drawaria%20-%20Music%20Player%20PRO%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles
    const style = document.createElement('style');
    style.textContent = `
    #music-mod {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-height: 80vh;
        background: rgba(10, 15, 25, 0.95);
        border: 1px solid #1e3a5a;
        border-radius: 12px;
        padding: 0;
        z-index: 9999;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 10px 25px rgba(0, 50, 100, 0.5);
        backdrop-filter: blur(8px);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    #music-mod-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: linear-gradient(to right, #0a1a2a, #0d2b40);
        cursor: move;
        user-select: none;
    }

    #music-mod-title {
        margin: 0;
        color: #00e1ff;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(0, 225, 255, 0.5);
    }

    #music-mod-controls {
        display: flex;
        gap: 8px;
    }

    .mod-btn-control {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 6px;
        background: rgba(0, 150, 255, 0.2);
        color: #00e1ff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .mod-btn-control:hover {
        background: rgba(0, 180, 255, 0.4);
        transform: scale(1.1);
    }

    #music-mod-content {
        padding: 15px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
    }

    .mod-btn {
        width: 100%;
        padding: 12px 15px;
        margin: 8px 0;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #0d2b40, #003366);
        color: white;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .mod-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0, 200, 255, 0.3), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .mod-btn:hover {
        background: linear-gradient(135deg, #0e3a5a, #004488);
        box-shadow: 0 6px 10px rgba(0, 100, 200, 0.3);
        transform: translateY(-2px);
    }

    .mod-btn:hover::before {
        opacity: 1;
    }

    .mod-btn:active {
        transform: translateY(0);
    }

    .mod-btn i {
        font-size: 16px;
    }

    .mod-section {
        margin: 15px 0;
        padding: 15px;
        background: rgba(5, 15, 25, 0.5);
        border-radius: 10px;
        border: 1px solid #1a3a5a;
    }

    .mod-section-title {
        margin: 0 0 12px 0;
        color: #00a8ff;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #music-mod-content::-webkit-scrollbar {
        width: 6px;
    }

    #music-mod-content::-webkit-scrollbar-track {
        background: rgba(10, 20, 30, 0.3);
        border-radius: 3px;
    }

    #music-mod-content::-webkit-scrollbar-thumb {
        background: linear-gradient(#00a8ff, #0088ff);
        border-radius: 3px;
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 200, 255, 0.4); }
        70% { box-shadow: 0 0 0 12px rgba(0, 200, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 200, 255, 0); }
    }

    .playing {
        animation: pulse 2s infinite;
    }

    select, input[type="text"], input[type="range"] {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        background: rgba(0, 20, 40, 0.7);
        border: 1px solid #1a3a5a;
        border-radius: 6px;
        color: white;
    }

    input[type="range"] {
        padding: 0;
        height: 6px;
        -webkit-appearance: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: #00e1ff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 225, 255, 0.5);
    }
    `;
    document.head.appendChild(style);

    // HTML Structure
    const mod = document.createElement('div');
    mod.id = 'music-mod';
    mod.innerHTML = `
    <div id="music-mod-header">
        <h3 id="music-mod-title">MUSIC PLAYER PRO</h3>
        <div id="music-mod-controls">
            <button id="collapse-btn" class="mod-btn-control">−</button>
            <button id="close-btn" class="mod-btn-control">×</button>
        </div>
    </div>
    <div id="music-mod-content">
        <div class="mod-section">
            <div class="mod-section-title">🎵 MUSIC CONTROL</div>
            <button id="add-music-btn" class="mod-btn"><i>🎵</i> ADD TRACKS</button>
            <input type="file" id="file-input" accept=".mp3,audio/*" multiple style="display:none">
            <select id="song-list" size="4"></select>

            <div style="display:flex; gap:8px; margin-top:10px;">
                <button id="play-btn" class="mod-btn" style="flex:1;"><i>▶️</i> PLAY</button>
                <button id="stop-btn" class="mod-btn" style="flex:1;"><i>⏹</i> STOP</button>
            </div>

            <div style="display:flex; gap:8px;">
                <button id="prev-btn" class="mod-btn" style="flex:1;"><i>⏮</i> PREVIOUS</button>
                <button id="next-btn" class="mod-btn" style="flex:1;"><i>⏭</i> NEXT</button>
            </div>
        </div>

        <div class="mod-section">
            <div class="mod-section-title">⚙️ SETTINGS</div>
            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">SPEED:</span>
                    <span id="speed-value" style="color:#00e1ff;">1.0x</span>
                </div>
                <input type="range" id="speed-slider" min="0.5" max="2" step="0.1" value="1">
            </div>

            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#88ccff;">VOLUME:</span>
                    <span id="volume-value" style="color:#00e1ff;">70%</span>
                </div>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.7">
            </div>

            <div style="display:flex; gap:8px;">
                <button id="loop-btn" class="mod-btn" style="flex:1;"><i>🔁</i> LOOP</button>
                <button id="shuffle-btn" class="mod-btn" style="flex:1;"><i>🔀</i> SHUFFLE</button>
            </div>
        </div>

        <div class="mod-section">
            <div class="mod-section-title">💾 PLAYLIST MANAGEMENT</div>
            <input type="text" id="playlist-name" placeholder="Playlist Name">
            <button id="save-playlist-btn" class="mod-btn"><i>💾</i> SAVE</button>
            <select id="playlist-select"></select>
            <div style="display:flex; gap:8px;">
                <button id="load-playlist-btn" class="mod-btn" style="flex:1;"><i>📂</i> LOAD</button>
                <button id="delete-playlist-btn" class="mod-btn" style="flex:1;"><i>🗑️</i> DELETE</button>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(mod);

    // Initialize player
    const audio = new Audio();
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let loopMode = true;
    let isShuffled = false;
    let originalPlaylist = [];

    // Get all elements
    const modElement = document.getElementById('music-mod');
    const header = document.getElementById('music-mod-header');
    const content = document.getElementById('music-mod-content');
    const collapseBtn = document.getElementById('collapse-btn');
    const closeBtn = document.getElementById('close-btn');
    const addBtn = document.getElementById('add-music-btn');
    const fileInput = document.getElementById('file-input');
    const songList = document.getElementById('song-list');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const loopBtn = document.getElementById('loop-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const speedSlider = document.getElementById('speed-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistNameInput = document.getElementById('playlist-name');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const playlistSelect = document.getElementById('playlist-select');
    const loadPlaylistBtn = document.getElementById('load-playlist-btn');
    const deletePlaylistBtn = document.getElementById('delete-playlist-btn');

    // Key for storing playlists
    const PLAYLIST_STORAGE_KEY = "music_player_playlists";

    // Function to save playlist
    function savePlaylist() {
        const name = playlistNameInput.value.trim();
        if (!name) {
            alert("Please enter a playlist name!");
            return;
        }

        // Get the current list of playlists
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");

        // Save the playlist
        playlists[name] = {
            songs: songs.map(song => ({
                name: song.name,
                url: song.url
            })),
            currentIndex: currentSongIndex
        };

        localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
        updatePlaylists();
        alert(`Playlist "${name}" saved successfully!`);
        playlistNameInput.value = '';
    }

    // Function to load playlist
    function loadPlaylist() {
        const name = playlistSelect.value;
        if (!name) return;

        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlist = playlists[name];

        if (playlist) {
            songs = playlist.songs;
            currentSongIndex = playlist.currentIndex || 0;
            updateSongList();
            alert(`Playlist "${name}" loaded!`);
        } else {
            alert("Playlist not found!");
        }
    }

    // Function to delete playlist
    function deletePlaylist() {
        const name = playlistSelect.value;
        if (!name) return;

        if (confirm(`Are you sure you want to delete the playlist "${name}"?`)) {
            const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
            delete playlists[name];
            localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
            updatePlaylists();
            alert(`Playlist "${name}" deleted!`);
        }
    }

    // Update the list of playlists in the dropdown menu
    function updatePlaylists() {
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlistNames = Object.keys(playlists);

        // Clear the list
        playlistSelect.innerHTML = '';

        if (playlistNames.length === 0) {
            const option = document.createElement('option');
            option.textContent = "No saved playlists";
            playlistSelect.appendChild(option);
        } else {
            playlistNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                playlistSelect.appendChild(option);
            });
        }
    }

    // Assign handlers for playlist buttons
    savePlaylistBtn.addEventListener('click', savePlaylist);
    loadPlaylistBtn.addEventListener('click', loadPlaylist);
    deletePlaylistBtn.addEventListener('click', deletePlaylist);

    // Player functions
    function playMusic() {
        if (songs.length === 0) {
            alert("Add music first!");
            return;
        }

        const song = songs[currentSongIndex];
        audio.src = song.url;
        audio.play()
            .then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i>⏸</i> PAUSE';
                playBtn.classList.add('playing');
            })
            .catch(err => alert("Playback error: " + err.message));
    }

    function stopMusic() {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playBtn.innerHTML = '<i>▶️</i> PLAY';
        playBtn.classList.remove('playing');
    }

    function playNext() {
        if (songs.length === 0) return;

        currentSongIndex = (currentSongIndex + 1) % songs.length;
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    function playPrev() {
        if (songs.length === 0) return;

        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    function toggleLoop() {
        loopMode = !loopMode;
        audio.loop = loopMode;
        loopBtn.innerHTML = loopMode ? '<i>🔁</i> LOOP' : '<i>🔂</i> ONE';
        loopBtn.style.background = loopMode
            ? 'linear-gradient(135deg, #0d2b40, #003366)'
            : 'linear-gradient(135deg, #0d3b40, #005566)';
    }

    function toggleShuffle() {
        isShuffled = !isShuffled;

        if (isShuffled) {
            originalPlaylist = [...songs];
            const currentSong = songs[currentSongIndex];
            songs = songs.filter((_, i) => i !== currentSongIndex);

            // Shuffle
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }

            songs.unshift(currentSong);
            currentSongIndex = 0;
        } else {
            if (originalPlaylist.length > 0) {
                currentSongIndex = originalPlaylist.findIndex(
                    song => song.url === songs[currentSongIndex].url
                );
                songs = [...originalPlaylist];
            }
        }

        shuffleBtn.innerHTML = isShuffled ? '<i>🔀</i> NORMAL' : '<i>🔀</i> SHUFFLE';
        shuffleBtn.style.background = isShuffled
            ? 'linear-gradient(135deg, #0d3b40, #005566)'
            : 'linear-gradient(135deg, #0d2b40, #003366)';

        updateSongList();
    }

    function updateSongList() {
        songList.innerHTML = songs.map((song, i) =>
            `<option value="${i}" ${i === currentSongIndex ? 'selected' : ''}>${song.name}</option>`
        ).join('');
    }

    // Player button handlers
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i>▶️</i> PLAY';
            playBtn.classList.remove('playing');
        } else {
            playMusic();
        }
    });

    stopBtn.addEventListener('click', stopMusic);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    loopBtn.addEventListener('click', toggleLoop);
    shuffleBtn.addEventListener('click', toggleShuffle);

    // Adding music
    addBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                songs.push({
                    name: file.name.replace('.mp3', ''),
                    url: URL.createObjectURL(file),
                    file: file
                });
            }
        });
        updateSongList();
    });

    songList.addEventListener('change', (e) => {
        currentSongIndex = e.target.selectedIndex;
        if (isPlaying) playMusic();
    });

    // Sound settings
    speedSlider.addEventListener('input', () => {
        audio.playbackRate = speedSlider.value;
        document.getElementById('speed-value').textContent = `${speedSlider.value}x`;
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        document.getElementById('volume-value').textContent = `${Math.round(volumeSlider.value * 100)}%`;
    });

    // Window management
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('mod-btn-control')) return;

        isDragging = true;
        const rect = modElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        modElement.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        modElement.style.left = `${e.clientX - offsetX}px`;
        modElement.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        modElement.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    });

    let isCollapsed = false;
    collapseBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        content.style.display = isCollapsed ? 'none' : 'block';
        collapseBtn.textContent = isCollapsed ? '+' : '−';
    });

    closeBtn.addEventListener('click', () => {
        modElement.style.transform = 'scale(0.8)';
        modElement.style.opacity = '0';
        setTimeout(() => modElement.remove(), 300);
    });

    // Handling end of track
    audio.addEventListener('ended', () => {
        if (loopMode) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playNext();
        }
    });

    // Initialization
    audio.volume = volumeSlider.value;
    audio.playbackRate = speedSlider.value;
    updatePlaylists();
    updateSongList();
})();
