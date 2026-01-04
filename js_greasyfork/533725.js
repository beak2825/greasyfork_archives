// ==UserScript==
// @name         Griffiny.ru Video Position Saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Сохраняет позицию видео на griffiny.ru и восстанавливает с нужной секунды.
// @author       KiberAndy + Ai
// @license      MIT
// @match        *://griffiny.ru/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/533725/Griffinyru%20Video%20Position%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/533725/Griffinyru%20Video%20Position%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'griffiny_vps_';
    let lastSavedTime = 0;
    let saveIntervalId = null;

    let settings = {
        saveIntervalMS: 1000,
        minSaveDifference: 0.1
    };

    const positionCache = {};
    let positionRestored = false;

    function getVideoId() {
        try {
            // Предположим, что видео на griffiny.ru уникально по ID, например, через URL или DOM.
            const pathname = window.location.pathname;
            return pathname.split('/').pop() || "default";
        } catch (e) {
            console.error('Ошибка при определении ID видео:', e);
            return "default";
        }
    }

    function savePosition(videoElement, videoId) {
        const currentTime = videoElement.currentTime;
        if (Math.abs(currentTime - lastSavedTime) < settings.minSaveDifference) return;
        try {
            localStorage.setItem(STORAGE_KEY + videoId, currentTime);
            positionCache[videoId] = currentTime;
            lastSavedTime = currentTime;
            console.log(`[Griffiny VPS] Сохранено время для ${videoId}: ${currentTime.toFixed(2)} сек.`);
        } catch (e) {
            console.error('[Griffiny VPS] Ошибка сохранения позиции:', e);
        }
    }

    function restorePosition(videoElement, videoId) {
        let savedTime;
        if (positionCache.hasOwnProperty(videoId)) {
            savedTime = positionCache[videoId];
            console.log(`[Griffiny VPS] Из кэша для ${videoId}: ${savedTime.toFixed(2)} сек.`);
        } else {
            const saved = localStorage.getItem(STORAGE_KEY + videoId);
            if (saved) {
                savedTime = parseFloat(saved);
                console.log(`[Griffiny VPS] Из localStorage для ${videoId}: ${savedTime.toFixed(2)} сек.`);
            }
        }

        if (savedTime !== undefined && !isNaN(savedTime)) {
            const applyTime = () => {
                if (savedTime < videoElement.duration) {
                    videoElement.currentTime = savedTime;
                    // 👇 Принудительно ставим паузу и пускаем проигрывание снова (важно для возможных специфичных особенностей сайта)
                    videoElement.pause();
                    setTimeout(() => {
                        videoElement.play().catch(() => {});
                    }, 100);
                }
            };

            if (videoElement.readyState >= 1) {
                applyTime();
            } else {
                videoElement.addEventListener('loadedmetadata', applyTime, { once: true });
            }
        }
    }

    GM_registerMenuCommand('Настройки сохранения', () => {
        const newInterval = prompt("Интервал сохранения (мс):", settings.saveIntervalMS);
        const newThreshold = prompt("Порог изменения времени (сек):", settings.minSaveDifference);
        let parsedInterval = parseInt(newInterval, 10);
        let parsedThreshold = parseFloat(newThreshold);
        if (!isNaN(parsedInterval) && parsedInterval > 0) {
            settings.saveIntervalMS = parsedInterval;
        }
        if (!isNaN(parsedThreshold) && parsedThreshold > 0) {
            settings.minSaveDifference = parsedThreshold;
        }
        console.log(`[Griffiny VPS] Новые настройки: ${settings.saveIntervalMS} мс / ${settings.minSaveDifference} сек`);
        const video = document.querySelector('video');
        if (video && !video.paused) {
            clearInterval(saveIntervalId);
            saveIntervalId = setInterval(() => {
                savePosition(video, getVideoId());
            }, settings.saveIntervalMS);
        }
    });

    GM_registerMenuCommand('Очистить все позиции', () => {
        if (confirm('Удалить все сохраненные позиции?')) {
            Object.keys(localStorage)
                .filter(key => key.startsWith(STORAGE_KEY))
                .forEach(key => localStorage.removeItem(key));
            for (let key in positionCache) {
                delete positionCache[key];
            }
            console.log('[Griffiny VPS] Все позиции очищены.');
        }
    });

    function setup() {
        const video = document.querySelector('video');
        if (!video) {
            console.warn("[Griffiny VPS] Видео не найдено");
            return;
        }
        const videoId = getVideoId();
        if (!positionRestored) {
            restorePosition(video, videoId);
            positionRestored = true;
        }

        if (saveIntervalId) clearInterval(saveIntervalId);

        video.addEventListener('play', () => {
            if (saveIntervalId) return;
            saveIntervalId = setInterval(() => {
                savePosition(video, videoId);
            }, settings.saveIntervalMS);
        });

        video.addEventListener('pause', () => {
            if (saveIntervalId) {
                clearInterval(saveIntervalId);
                saveIntervalId = null;
            }
        });

        video.addEventListener('seeking', () => {
            savePosition(video, videoId);
        });

        window.addEventListener('beforeunload', () => {
            savePosition(video, videoId);
        });

        // 💾 Экстренное сохранение при закрытии/сворачивании вкладки
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                savePosition(video, videoId);
            }
        });

        window.addEventListener('pagehide', () => {
            savePosition(video, videoId);
        });
    }

    function initObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('video')) {
                obs.disconnect();
                setup();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.querySelector('video')) {
        setup();
    } else {
        initObserver();
    }

    window.addEventListener('griffiny-navigate-finish', () => {
        setTimeout(() => {
            lastSavedTime = 0;
            positionRestored = false;
            setup();
        }, 1000);
    });
})();
