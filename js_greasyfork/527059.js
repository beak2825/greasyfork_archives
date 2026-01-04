// ==UserScript==
// @name         Drawaria Music Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Music player for drawaria.online
// @author       You
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527059/Drawaria%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/527059/Drawaria%20Music%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create music player container
    const playerContainer = document.createElement('div');
    playerContainer.style.position = 'fixed';
    playerContainer.style.top = '20px';
    playerContainer.style.right = '20px';
    playerContainer.style.zIndex = '1000';
    playerContainer.style.backgroundColor = 'white';
    playerContainer.style.padding = '1.5rem';
    playerContainer.style.borderRadius = '0.75rem';
    playerContainer.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    playerContainer.style.minWidth = '320px';

    // State variables
    let audioFiles = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    let volume = 0.5;
    let currentTime = 0;
    let duration = 0;
    const audioElement = new Audio();

    // UI Elements
    const title = document.createElement('h2');
    title.textContent = 'Music Player';
    title.style.fontSize = '1.5rem';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '1rem';
    title.style.textAlign = 'center';

    const uploadLabel = document.createElement('label');
    uploadLabel.style.display = 'block';
    uploadLabel.style.backgroundColor = '#3b82f6';
    uploadLabel.style.color = 'white';
    uploadLabel.style.padding = '0.5rem 1rem';
    uploadLabel.style.borderRadius = '0.375rem';
    uploadLabel.style.cursor = 'pointer';
    uploadLabel.style.textAlign = 'center';
    uploadLabel.style.marginBottom = '1rem';
    uploadLabel.innerHTML = `
        Upload Music
        <input type="file" id="audio-upload" multiple accept="audio/*" style="display:none;">
    `;

    const fileList = document.createElement('ul');
    fileList.style.maxHeight = '128px';
    fileList.style.overflowY = 'auto';
    fileList.style.marginTop = '0.5rem';

    const trackInfo = document.createElement('div');
    trackInfo.style.display = 'flex';
    trackInfo.style.justifyContent = 'space-between';
    trackInfo.style.marginBottom = '0.5rem';

    const timeDisplay = document.createElement('div');
    const progressSlider = document.createElement('input');
    progressSlider.type = 'range';
    progressSlider.style.width = '100%';
    progressSlider.style.marginBottom = '1rem';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '1rem';
    controls.style.marginTop = '1rem';

    const prevButton = createButton('❮', () => prevTrack());
    const playButton = createButton('▶', () => playPause());
    const nextButton = createButton('❯', () => nextTrack());

    const volumeContainer = document.createElement('div');
    volumeContainer.style.display = 'flex';
    volumeContainer.style.alignItems = 'center';
    volumeContainer.style.gap = '0.5rem';
    volumeContainer.style.marginTop = '1rem';
    volumeContainer.innerHTML = '🔊';
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = volume;
    volumeSlider.style.flexGrow = '1';
    volumeContainer.appendChild(volumeSlider);

    // Assemble UI
    controls.append(prevButton, playButton, nextButton);
    trackInfo.append(timeDisplay);
    playerContainer.append(
        title,
        uploadLabel,
        fileList,
        trackInfo,
        progressSlider,
        controls,
        volumeContainer
    );
    document.body.appendChild(playerContainer);

    // Event listeners
    uploadLabel.querySelector('input').addEventListener('change', handleFileUpload);
    playButton.addEventListener('click', () => updatePlayButton());
    prevButton.addEventListener('click', () => updateUI());
    nextButton.addEventListener('click', () => updateUI());
    progressSlider.addEventListener('input', handleProgressChange);
    volumeSlider.addEventListener('input', handleVolumeChange);
    audioElement.addEventListener('timeupdate', updateTimeDisplay);
    audioElement.addEventListener('durationchange', updateDuration);
    audioElement.addEventListener('ended', handleTrackEnd);

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '0.5rem';
        btn.style.borderRadius = '9999px';
        btn.style.backgroundColor = '#e5e7eb';
        btn.addEventListener('click', onClick);
        return btn;
    }

    function handleFileUpload(e) {
        const files = Array.from(e.target.files);
        audioFiles = [...audioFiles, ...files];
        updateFileList();
        if (audioFiles.length === 1) loadTrack(0);
    }

    function updateFileList() {
        fileList.innerHTML = '';
        audioFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.textContent = file.name;
            li.style.padding = '0.5rem';
            li.style.cursor = 'pointer';
            li.style.backgroundColor = index === currentTrackIndex ? '#f3f4f6' : 'transparent';
            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(index);
                updateUI();
            });
            fileList.appendChild(li);
        });
    }

    function loadTrack(index) {
        if (!audioFiles[index]) return;
        const url = URL.createObjectURL(audioFiles[index]);
        audioElement.src = url;
        audioElement.volume = volume;
        if (isPlaying) audioElement.play();
        updateTimeDisplay();
    }

    function playPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
        updatePlayButton();
    }

    function updatePlayButton() {
        playButton.textContent = isPlaying ? '⏸' : '▶';
        playButton.style.backgroundColor = isPlaying ? '#3b82f6' : '#e5e7eb';
        playButton.style.color = isPlaying ? 'white' : 'inherit';
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
        loadTrack(currentTrackIndex);
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
        loadTrack(currentTrackIndex);
    }

    function handleProgressChange(e) {
        const time = parseFloat(e.target.value);
        currentTime = time;
        audioElement.currentTime = time;
    }

    function handleVolumeChange(e) {
        volume = parseFloat(e.target.value);
        audioElement.volume = volume;
    }

    function updateTimeDisplay() {
        currentTime = audioElement.currentTime;
        duration = audioElement.duration || 0;
        progressSlider.max = duration;
        progressSlider.value = currentTime;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    function updateDuration() {
        duration = audioElement.duration;
        progressSlider.max = duration;
    }

    function handleTrackEnd() {
        nextTrack();
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateUI() {
        updateFileList();
        updateTimeDisplay();
        updatePlayButton();
    }
})();