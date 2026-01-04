// ==UserScript==
// @name         YouTube Enhanced Player
// @name:en      YouTube Enhanced Player
// @name:es      YouTube Reproductor Mejorado
// @namespace    http://tampermonkey.net/
// @version      1.6.3.1
// @description  Запоминает позицию просмотра видео и громкость, возобновляет с этого места (минус 5 секунд)
// @description:en Remembers video playback position and volume, resumes from that point (minus 5 seconds)
// @description:es Recuerda la posición y volumen de reproducción, continúa desde ese punto (menos 5 segundos)
// @author       LegonYY
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://img.icons8.com/?size=100&id=55200&format=png&color=000000
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533450/YouTube%20Enhanced%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/533450/YouTube%20Enhanced%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function saveVideoTime(videoId, currentTime) {
        localStorage.setItem(`yt_time_${videoId}`, currentTime.toString());
    }

    function loadVideoTime(videoId) {
        const savedTime = localStorage.getItem(`yt_time_${videoId}`);
        return savedTime ? parseFloat(savedTime) : 0;
    }

    function saveVolumeLevel(volume) {
        localStorage.setItem('yt_volume_global', volume.toString());
    }

    function loadVolumeLevel() {
        const savedVolume = localStorage.getItem('yt_volume_global');
        return savedVolume ? parseFloat(savedVolume) : 100;
    }

    function showSaveNotification() {
        const overlay = document.querySelector('.html5-video-player .ytp-player-content')
            || document.querySelector('.ytp-chrome-top')
            || document.body;

        if (getComputedStyle(overlay).position === 'static') {
            overlay.style.position = 'relative';
        }

        const old = overlay.querySelector('.timeSaveNotification');
        if (old) old.remove();

        const notif = document.createElement('div');
        notif.className = 'timeSaveNotification';
        Object.assign(notif.style, {
            position: 'absolute',
            bottom: '0px',
            right: '5px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            zIndex: '9999',
            fontSize: '14px',
            opacity: '0',
            transition: 'opacity 0.5s ease',
        });
        notif.innerText = 'Время просмотра сохранено!';
        overlay.appendChild(notif);
        requestAnimationFrame(() => notif.style.opacity = '1');
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }

function initResumePlayback() {
    const video = document.querySelector('video');
    if (!video) return;

    const videoId = getVideoId();
    if (!videoId) return;

    const savedTime = loadVideoTime(videoId);


    video.addEventListener('loadedmetadata', () => {
        if (savedTime > 0 && video.duration > savedTime - 5) {
            const resumeTime = Math.max(0, savedTime - 5);
            video.currentTime = resumeTime;
        }
    });

    setInterval(() => {
        if (!video.paused && !video.seeking) {
            const videoId = getVideoId();
            if (videoId) {
                saveVideoTime(videoId, video.currentTime);
            }
        }
    }, 5000);

    window.addEventListener('beforeunload', () => {
        const videoId = getVideoId();
        if (videoId) {
            saveVideoTime(videoId, video.currentTime);
        }
    });
}


    function calculateVolume(position, sliderMax) {
        const volume = (position / sliderMax) * 1400;
        return volume.toFixed();
    }

    function updateVolumeDisplay(volume) {
        const old = document.getElementById('customVolumeDisplay');
        if (old) old.remove();

        const btn = document.getElementById('volumeBoostButton');
        if (!btn) return;

        const volumeDisplay = document.createElement('div');
        volumeDisplay.id = 'customVolumeDisplay';
        volumeDisplay.innerText = `${volume}%`;

        Object.assign(volumeDisplay.style, {
            position: 'absolute',
            fontSize: '14px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            padding: '2px 6px',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: '0',
            transform: 'translate(-50%, -10px)',
        });

        const btnContainer = btn.parentElement;
        btnContainer.style.position = 'relative';
        btnContainer.appendChild(volumeDisplay);

        const btnRect = btn.getBoundingClientRect();
        const containerRect = btnContainer.getBoundingClientRect();
        const offsetX = btnRect.left - containerRect.left + btnRect.width / 2;
        const offsetY = btnRect.top - containerRect.top;

        volumeDisplay.style.left = `${offsetX}px`;
        volumeDisplay.style.top = `${offsetY}px`;

        requestAnimationFrame(() => {
            volumeDisplay.style.opacity = '1';
            volumeDisplay.style.transform = 'translate(-50%, -20px)';
        });

        setTimeout(() => {
            volumeDisplay.style.opacity = '0';
            volumeDisplay.style.transform = 'translate(-50%, -10px)';
            setTimeout(() => volumeDisplay.remove(), 300);
        }, 1000);
    }

    function createControlPanel(video) {
        const style = document.createElement('style');
        style.textContent = `
        #volumeBoostButton input[type=range] {
            -webkit-appearance: none;
            width: 100px;
            height: 4px;
            background: #ccc;
            border-radius: 2px;
            outline: none;
        }
        #volumeBoostButton input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }`;
        document.head.appendChild(style);

        const saveButton = document.createElement('button');
        saveButton.id = 'manualSaveButton';
        saveButton.innerText = '💾';
        Object.assign(saveButton.style, {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '1px',
            fontSize: '18px',
            transition: 'transform 0.2s ease',
        });
        saveButton.title = 'Сохранить текущее время просмотра';

        const volumeBoostButton = document.createElement('button');
        volumeBoostButton.id = 'volumeBoostButton';
        volumeBoostButton.innerText = '🔊';
        Object.assign(volumeBoostButton.style, {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '1px',
            fontSize: '18px',
            transition: 'transform 0.2s ease',
        });
        volumeBoostButton.title = 'Усилитель громкости';

        const customVolumeSlider = document.createElement('input');
        Object.assign(customVolumeSlider, {
            type: 'range',
            min: '100',
            max: '1400',
            step: '1',
        });

        Object.assign(customVolumeSlider.style, {
            display: 'none',
            opacity: '0',
            transform: 'scale(0.8)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
        });

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        const videoSource = audioContext.createMediaElementSource(video);
        videoSource.connect(gainNode);

        const initialVolume = loadVolumeLevel();
        gainNode.gain.value = initialVolume / 100;
        customVolumeSlider.value = initialVolume.toString();
        updateVolumeDisplay(initialVolume.toString());

        customVolumeSlider.addEventListener('input', function () {
            const volume = calculateVolume(this.value, this.max);
            gainNode.gain.value = volume / 100;
            updateVolumeDisplay(volume);
            saveVolumeLevel(volume);
        });

        function resetVolumeTo100() {
            customVolumeSlider.value = '100';
            gainNode.gain.value = 1.0;
            updateVolumeDisplay('100');
            saveVolumeLevel(100);
        }

        volumeBoostButton.addEventListener('mouseenter', () => {
            customVolumeSlider.style.display = 'block';
            requestAnimationFrame(() => {
                customVolumeSlider.style.opacity = '1';
                customVolumeSlider.style.transform = 'scale(1)';
            });
        });

        volumeBoostButton.addEventListener('click', (e) => {
            e.stopPropagation();
            resetVolumeTo100();
        });

        let hideTimeout;
        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.position = 'relative';
        sliderContainer.style.cursor = 'pointer';

        sliderContainer.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                customVolumeSlider.style.opacity = '0';
                customVolumeSlider.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    customVolumeSlider.style.display = 'none';
                }, 300);
            }, 300);
        });

        sliderContainer.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        const controls = document.querySelector('.ytp-chrome-controls');
        if (controls) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.marginRight = '10px';

            sliderContainer.appendChild(volumeBoostButton);
            sliderContainer.appendChild(customVolumeSlider);
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(sliderContainer);
            controls.insertBefore(buttonContainer, controls.firstChild);

            sliderContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                const step = 50;
                let val = parseInt(customVolumeSlider.value, 10);
                if (e.deltaY < 0) {
                    val = Math.min(val + step, parseInt(customVolumeSlider.max, 10));
                } else {
                    val = Math.max(val - step, parseInt(customVolumeSlider.min, 10));
                }
                customVolumeSlider.value = val;
                customVolumeSlider.dispatchEvent(new Event('input'));
            });
        }

        saveButton.addEventListener('click', () => {
            const videoId = getVideoId();
            if (videoId) {
                saveVideoTime(videoId, video.currentTime);
                showSaveNotification();
            }
        });
    }

function init() {
    initResumePlayback();
    const video = document.querySelector('video');
    if (video) {
        createControlPanel(video);
        createSpeedControl();
    }
}


    const checkVideo = setInterval(() => {
        if (document.querySelector('video') && document.querySelector('.ytp-chrome-controls')) {
            clearInterval(checkVideo);
            init();
        }
    }, 500);

   function createSpeedControl() {
    const style = document.createElement("style");
    style.textContent = `
        .ytp-speed-button {
            color: white;
            background: transparent;
            border: none;
            font-size: 14px;
            cursor: pointer;
            position: relative;
            align-self: center;
            margin-left: auto;
            margin-right: auto;
            transition: transform 0.2s ease;
        }

        .ytp-speed-menu {
            position: absolute;
            bottom: 30px;
            left: 0;
            background: #303031;
            color: white;
            border-radius: 5px;
            display: none;
            z-index: 9999;
        }

        .ytp-speed-option {
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
        }

        .ytp-speed-option:hover,
        .ytp-speed-option.active {
            background: Dodgerblue;
            color: #fff;
        }
    `;
    document.head.appendChild(style);

    const speeds = [0.5, 0.75, 1.0, 1.15, 1.25, 1.5, 2.0];
    let currentSpeed = parseFloat(localStorage.getItem('yt_speed') || 1.0);

    const controls = document.querySelector(".ytp-right-controls");
    if (!controls) return;

    const button = document.createElement("button");
    button.className = "ytp-speed-button";
    button.textContent = `${currentSpeed}×`;

    Object.assign(button.style, {
        color: '#fff',
        background: 'transparent',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        position: 'relative',
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        transition: 'transform 0.2s ease',
    });

    const menu = document.createElement("div");
    menu.className = "ytp-speed-menu";

    speeds.forEach(speed => {
        const item = document.createElement("div");
        item.className = "ytp-speed-option";
        item.textContent = `${speed}×`;
        item.dataset.speed = speed;
        if (speed === currentSpeed) item.classList.add("active");
        menu.appendChild(item);
    });

    button.appendChild(menu);
    controls.prepend(button);

    button.addEventListener("click", () => {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    menu.addEventListener("click", (e) => {
        if (e.target.classList.contains("ytp-speed-option")) {
            const newSpeed = parseFloat(e.target.dataset.speed);
            document.querySelector("video").playbackRate = newSpeed;
            currentSpeed = newSpeed;
            localStorage.setItem('yt_speed', newSpeed);
            button.firstChild.textContent = `${newSpeed}×`;
            menu.querySelectorAll(".ytp-speed-option").forEach(opt => opt.classList.remove("active"));
            e.target.classList.add("active");
            menu.style.display = "none";
        }
    });

    const video = document.querySelector("video");
    if (video) video.playbackRate = currentSpeed;
}
})();
