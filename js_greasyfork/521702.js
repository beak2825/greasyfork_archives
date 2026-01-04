// ==UserScript==
// @name                          YouTube - Playback Speed Slider
// @name:fr                       YouTube - Curseur de vitesse de lecture
// @name:es                       YouTube - Deslizador de velocidad de reproducción
// @name:de                       YouTube - Wiedergabegeschwindigkeit-Schieberegler
// @name:it                       YouTube - Cursore della velocità di riproduzione
// @name:zh-CN                    YouTube - 播放速度滑块
// @namespace                     https://gist.github.com/4lrick/8149bd289cf94889a97aae9732a17144
// @version                       1.2
// @description                   Adds a slider for playback speed control on YouTube videos.
// @description:fr                Ajoute un curseur pour contrôler la vitesse de lecture des vidéos YouTube.
// @description:es                Agrega un deslizador para controlar la velocidad de reproducción en videos de YouTube.
// @description:de                Fügt einen Schieberegler zur Steuerung der Wiedergabegeschwindigkeit in YouTube-Videos hinzu.
// @description:it                Aggiunge un cursore per controllare la velocità di riproduzione dei video di YouTube.
// @description:zh-CN             在YouTube视频中添加播放速度控制滑块。
// @author                        4lrick
// @match                         https://www.youtube.com/*
// @icon                          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant                         GM_getValue
// @grant                         GM_setValue
// @grant                         GM_registerMenuCommand
// @grant                         GM_unregisterMenuCommand
// @license                       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/521702/YouTube%20-%20Playback%20Speed%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/521702/YouTube%20-%20Playback%20Speed%20Slider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONSTANTS = {
        MIN_SPEED: 0.25,
        MAX_SPEED: 10.0,
        DEFAULT_SPEED: 1.0,
        DEFAULT_SPEED_STEP: 0.05,
    };

    const STORAGE_KEY = 'yt-player-speed';
    const REMEMBER_SPEED_KEY = 'rememberSpeed';
    const SPEED_STEP_KEY = 'speedStep';

    let speedStep = GM_getValue(SPEED_STEP_KEY, CONSTANTS.DEFAULT_SPEED_STEP);
    let rememberSpeed = GM_getValue(REMEMBER_SPEED_KEY, true);
    let savedSpeed = parseFloat(localStorage.getItem(STORAGE_KEY)) || CONSTANTS.DEFAULT_SPEED;
    let rememberSpeedMenuId, speedStepMenuId;
    let sliderRef = null;
    let observer = null;

    function updateRememberSpeedMenu() {
        if (rememberSpeedMenuId) {
            GM_unregisterMenuCommand(rememberSpeedMenuId);
        }
        const status = rememberSpeed ? 'ON' : 'OFF';
        rememberSpeedMenuId = GM_registerMenuCommand(`Remember speed (current: ${status})`, toggleRememberSpeed);
    }

    function updateSpeedStepMenu() {
        if (speedStepMenuId) {
            GM_unregisterMenuCommand(speedStepMenuId);
        }
        speedStepMenuId = GM_registerMenuCommand(`Set speed step (current: ${speedStep})`, setSpeedStep);
    }

    function toggleRememberSpeed() {
        const video = document.querySelector('video');
        if (!video) return;

        rememberSpeed = !rememberSpeed;

        if (rememberSpeed) {
            const currentSpeed = video.playbackRate;
            localStorage.setItem(STORAGE_KEY, currentSpeed);
            savedSpeed = currentSpeed;
        }

        GM_setValue(REMEMBER_SPEED_KEY, rememberSpeed);
        updateRememberSpeedMenu();
    }

    function setSpeedStep() {
        const input = prompt('Enter a new speed step (e.g., 0.25):', speedStep);
        const newSpeedStep = parseFloat(input);

        if (!isNaN(newSpeedStep) && newSpeedStep > 0) {
            speedStep = newSpeedStep;
            GM_setValue(SPEED_STEP_KEY, speedStep);
            updateSpeedStepMenu();
            if (sliderRef) {
                sliderRef.step = String(speedStep);
            }
        } else {
            alert('Invalid input. Please enter a positive number.');
        }
    }

    function applyRememberedSpeed(video) {
        if (rememberSpeed && video) {
            video.playbackRate = parseFloat(savedSpeed);
        }
    }

    function initMenu() {
        const menuButton = document.querySelector('.ytp-settings-button');
        const menu = document.querySelector('.ytp-settings-menu');
        if (menuButton && menu) {
            menu.style.opacity = '0';
            menuButton.click();
            menuButton.click();
            menu.style.opacity = '1';
        }
    }

    function formatSpeed(value) {
        const rounded = Math.round(value * 100) / 100;
        return rounded % 1 === 0 ? `${rounded.toFixed(0)}x` : `${rounded}x`;
    }

    function handleSlider(slider, video, speedValue) {
        const inputListener = () => {
            const newSpeed = parseFloat(slider.value);
            video.playbackRate = newSpeed;
            speedValue.textContent = formatSpeed(newSpeed);
            if (rememberSpeed) {
                savedSpeed = newSpeed;
                localStorage.setItem(STORAGE_KEY, newSpeed);
            }
            slider.style.setProperty('--yt-slider-shape-gradient-percent', `${(newSpeed / slider.max) * 100}%`);
        };

        const wheelListener = (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? speedStep : -speedStep;
            let newSpeed = parseFloat(slider.value) + delta;
            newSpeed = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), newSpeed));
            slider.value = newSpeed;
            video.playbackRate = newSpeed;
            speedValue.textContent = formatSpeed(newSpeed);
            if (rememberSpeed) {
                savedSpeed = newSpeed;
                localStorage.setItem(STORAGE_KEY, newSpeed);
            }
            slider.style.setProperty('--yt-slider-shape-gradient-percent', `${(newSpeed / slider.max) * 100}%`);
        };

        slider.addEventListener('input', inputListener);
        slider.addEventListener('wheel', wheelListener);
    }

    function createSlider(playbackSpeedContent, video) {
        playbackSpeedContent.textContent = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const speedValue = document.createElement('span');
        speedValue.textContent = formatSpeed(video.playbackRate);
        speedValue.style.width = '50px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = String(CONSTANTS.MIN_SPEED);
        slider.max = String(CONSTANTS.MAX_SPEED);
        slider.step = String(speedStep);
        slider.value = video.playbackRate;

        slider.classList.add('ytp-input-slider');
        slider.style.margin = '0 10px';
        slider.style.setProperty('--yt-slider-shape-gradient-percent', `${(video.playbackRate / slider.max) * 100}%`);

        slider.addEventListener('click', (e) => e.stopPropagation());

        handleSlider(slider, video, speedValue);

        container.appendChild(speedValue);
        container.appendChild(slider);
        playbackSpeedContent.appendChild(container);
        sliderRef = slider;
    }

    function findPlaybackSpeedMenuItem() {
        const menuItem = document.querySelector('.ytp-menuitem[aria-label*="Playback speed"]');
        if (menuItem) return menuItem;
        const speedIcon = document.querySelector('.ytp-menuitem-icon svg path[d*="M10,8v8l6-4L10,8"], .ytp-menuitem-icon svg path[d*="M9.80 1.22C8.59"], .ytp-menuitem-icon svg path[d*="M12 1c1.44"]');
        return speedIcon ? speedIcon.closest('.ytp-menuitem') : null;
    }

    function setupSliderMenuItem() {
        const video = document.querySelector('video');
        if (!video) return;

        applyRememberedSpeed(video);

        const playbackSpeedMenuItem = findPlaybackSpeedMenuItem();

        if (!playbackSpeedMenuItem) return;
        const playbackSpeedContent = playbackSpeedMenuItem.querySelector('.ytp-menuitem-content');

        if (playbackSpeedContent && !playbackSpeedContent.querySelector('input[type="range"]')) {
            createSlider(playbackSpeedContent, video);
            initMenu();
        }
    }

    function observeVideoChanges() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(setupSliderMenuItem);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    updateSpeedStepMenu();
    updateRememberSpeedMenu();
    observeVideoChanges();
})();