// ==UserScript==
// @name         YouTube Arrow Key Video Control (Improved Sync)
// @name:ru      Улучшенное управление YouTube через стрелки
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Sync with native YouTube volume & avoid duplicate seeking
// @description:ru Правильное управление видео YouTube через стрелки на клавиатуре.
// @author       Boss of this gym
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503470/YouTube%20Arrow%20Key%20Video%20Control%20%28Improved%20Sync%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503470/YouTube%20Arrow%20Key%20Video%20Control%20%28Improved%20Sync%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VOLUME_STEP = 5; // persents
    const SEEK_STEP = 5;    // seconds

    function getVideoElement() {
        return document.querySelector('video');
    }

    function getPlayer() {
        // Основной контейнер плеера
        return document.querySelector('.html5-video-player');
    }

    function getVolumePercent(video) {
        const player = getPlayer();
        if (player && typeof player.getVolume === 'function') {
            // YouTube хранит громкость в 0–100, тут же двигается ползунок
            return player.getVolume();
        }
        // Фоллбек на нативный видео-элемент
        return Math.round(video.volume * 100);
    }

    function setVolumeFromPercent(video, percent) {
        const clamped = Math.min(Math.max(percent, 0), 100);
        const player = getPlayer();

        if (player && typeof player.setVolume === 'function') {
            // Если вдруг плеер был замьючен — размутаем
            if (typeof player.isMuted === 'function' && player.isMuted()) {
                if (typeof player.unMute === 'function') {
                    player.unMute();
                }
            }
            player.setVolume(clamped); // это и двигает ползунок YouTube
        } else {
            // Фоллбек: напрямую громкость видео (0–1)
            video.volume = clamped / 100;
        }

        showOverlay(`🔊 ${clamped}%`);
    }

    function seekVideo(video, delta) {
        const player = getPlayer();
        let newTime;

        if (player && typeof player.getCurrentTime === 'function' && typeof player.seekTo === 'function') {
            const cur = player.getCurrentTime();
            const duration = (typeof player.getDuration === 'function' && player.getDuration()) || video.duration || 0;
            newTime = Math.min(Math.max(cur + delta, 0), duration);
            // true = мгновенный seek без анимации
            player.seekTo(newTime, true);
        } else {
            const duration = video.duration || 0;
            newTime = Math.min(Math.max(video.currentTime + delta, 0), duration);
            video.currentTime = newTime;
        }

        showOverlay(`${delta > 0 ? '⏩' : '⏪'} ${Math.abs(delta)}s`);
    }

    function isInputElementFocused() {
        const active = document.activeElement;
        return active && (['INPUT', 'TEXTAREA'].includes(active.tagName) || active.isContentEditable);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'yt-ctrl-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-size: 20px;
            border-radius: 8px;
            z-index: 9999;
            display: none;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    const overlay = createOverlay();
    let overlayTimeout = null;

    function showOverlay(text) {
        overlay.textContent = text;
        overlay.style.display = 'block';
        clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
            overlay.style.display = 'none';
        }, 800);
    }

    window.addEventListener('keydown', function(event) {
        // Не вмешиваемся, если фокус в инпуте или зажат Alt
        if (isInputElementFocused() || event.altKey) return;

        const video = getVideoElement();
        if (!video) return;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            // Перехватываем стрелки до ютуба
            event.preventDefault();
            event.stopImmediatePropagation();

            if (document.activeElement !== video) {
                video.setAttribute('tabindex', '-1');
                video.focus();
            }

            switch (event.key) {
                case 'ArrowUp': {
                    const vol = getVolumePercent(video);
                    setVolumeFromPercent(video, vol + VOLUME_STEP);
                    break;
                }
                case 'ArrowDown': {
                    const vol = getVolumePercent(video);
                    setVolumeFromPercent(video, vol - VOLUME_STEP);
                    break;
                }
                case 'ArrowRight':
                    seekVideo(video, SEEK_STEP);
                    break;
                case 'ArrowLeft':
                    seekVideo(video, -SEEK_STEP);
                    break;
            }
        }
    }, true); // capture, чтобы обогнать YouTube
})();
