// ==UserScript==
// @name                          YouTube - Time Indicators
// @name:fr                       YouTube - Indicateurs de temps
// @name:es                       YouTube - Indicadores de tiempo
// @name:de                       YouTube - Zeitindikatoren
// @name:it                       YouTube - Indicatori del tempo
// @name:zh-CN                    YouTube - 时间指示器（多种）
// @namespace                     https://gist.github.com/4lrick/cf14cf267684f06c1b7bc559ddf2b943
// @version                       2.3
// @description                   Shows remaining or end time in the YouTube player, taking into account the playback speed.
// @description:fr                Affiche le temps restant ou l'heure de fin dans le lecteur YouTube, en tenant compte de la vitesse de lecture.
// @description:es                Muestra el tiempo restante o la hora de finalización en el reproductor de YouTube, teniendo en cuenta la velocidad de reproducción.
// @description:de                Zeigt im YouTube-Player die verbleibende Zeit oder die Endzeit an und berücksichtigt dabei die Wiedergabegeschwindigkeit.
// @description:it                Mostra il tempo rimanente o l'orario di fine nel riproduttore YouTube, tenendo conto della velocità di riproduzione.
// @description:zh-CN             在 YouTube 播放器中显示剩余时间或结束时间，并考虑播放速度。
// @author                        4lrick
// @match                         https://www.youtube.com/*
// @icon                          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant                         none
// @license                       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/477119/YouTube%20-%20Time%20Indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/477119/YouTube%20-%20Time%20Indicators.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timeDisplay;
    let lastRenderedText = '';
    let showEndTime = localStorage.getItem('yt-player-remaining-time-mode') === 'true';

    function createTimeDisplayElement() {
        const timeDisplayElement = document.createElement('span');

        timeDisplayElement.style.display = 'inline-block';
        timeDisplayElement.style.marginLeft = '10px';
        timeDisplayElement.style.color = '#ddd';
        timeDisplayElement.style.cursor = 'pointer';
        timeDisplayElement.title = 'Click to toggle between remaining time and end time';

        timeDisplayElement.addEventListener('click', () => {
            event.stopPropagation();
            showEndTime = !showEndTime;
            localStorage.setItem('yt-player-remaining-time-mode', showEndTime);
        });

        return timeDisplayElement;
    }

    function formatTimeDisplay(videoElement) {
        if (showEndTime) {
            const endTime = new Date(Date.now() + (videoElement.duration - videoElement.currentTime) * 1000 / videoElement.playbackRate);
            return `(${endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})`;
        } else {
            const timeRemaining = (videoElement.duration - videoElement.currentTime) / videoElement.playbackRate;
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = Math.floor(timeRemaining % 60);
            return `(${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
        }
    }

    function displayRemainingTime() {
        const videoElement = document.querySelector('video');
        const isLive = document.querySelector('.ytp-time-display')?.classList.contains('ytp-live');
        const miniplayerUI = document.querySelector('.ytp-miniplayer-ui');
        const isMiniplayerVisible = miniplayerUI && getComputedStyle(miniplayerUI).display !== 'none';
        const currentTime = videoElement?.currentTime;
        const timeContainer = document.querySelector(
            isMiniplayerVisible ? '.ytp-miniplayer-ui .ytp-time-contents' : '.ytp-chrome-controls .ytp-time-contents'
        );

        if (!videoElement || isLive || !timeContainer || isNaN(videoElement.duration)) {
            if (timeDisplay) {
                timeDisplay.remove();
                timeDisplay = null;
            }
            requestAnimationFrame(displayRemainingTime);
            return;
        }

        if (!timeDisplay) {
            timeDisplay = createTimeDisplayElement();
            timeContainer.appendChild(timeDisplay);
        }

        if (!timeContainer.contains(timeDisplay)) {
            timeDisplay.remove();
            timeContainer.appendChild(timeDisplay);
        }

        const text = formatTimeDisplay(videoElement);

        if (text !== lastRenderedText) {
            timeDisplay.textContent = text;
            lastRenderedText = text;
        }

        requestAnimationFrame(displayRemainingTime);
    }

    function initRemainingCounter() {
        const timeContainer = document.querySelector('.ytp-time-contents');

        if (timeContainer) {
            timeDisplay = createTimeDisplayElement();
            timeContainer.appendChild(timeDisplay);
            requestAnimationFrame(displayRemainingTime);
            observer.disconnect();
        }
    }

    function checkVideoExists() {
        const videoElement = document.querySelector('video');

        if (videoElement) {
            initRemainingCounter();
        }
    }

    const observer = new MutationObserver(checkVideoExists);
    observer.observe(document.body, { childList: true, subtree: true });
})();