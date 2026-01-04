// ==UserScript==
// @name         YouTube Video Position Saver with Shorts
// @name:en      YouTube Video Position Saver with Shorts
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Мгновенное сохранение и восстановление позиции. Оптимизированный движок без задержек.
// @description:en Instant save and restore of position. Optimized, lag-free engine.
// @author       KiberAndy + Ai
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         https://icons.iconarchive.com/icons/designbolts/folded-social-media/128/Youtube-icon.png
// @downloadURL https://update.greasyfork.org/scripts/533149/YouTube%20Video%20Position%20Saver%20with%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/533149/YouTube%20Video%20Position%20Saver%20with%20Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- КОНФИГУРАЦИЯ ЯДРА ---
    const CONFIG = {
        storageKey: 'yt_vps_plus_',
        maxAgeDays: 30,
        throttleMs: 1000, // Частота записи в хранилище (не чаще чем раз в X мс)
        enforceDuration: 3000, // Сколько мс "защищать" позицию от сброса
    };

    let settings = {
        minSaveDifference: 0.1, // 0.1 сек
    };

    // --- СОСТОЯНИЕ СИСТЕМЫ ---
    const State = {
        currentVideoId: null,
        lastSavedTime: 0,
        isRestoring: false,
        videoElement: null,
        handlers: {}, // Хранилище ссылок на функции для удаления
    };

    // --- УТИЛИТЫ ---
    const log = (msg) => console.log(`%c[YT VPS+] ${msg}`, 'color: #00ff00; background: #000');
    const getTimestamp = () => Date.now();

    function getVideoId() {
        try {
            const path = location.pathname;
            if (path.startsWith('/shorts/')) return path.split('/')[2];
            const urlParams = new URLSearchParams(location.search);
            return urlParams.get('v');
        } catch (e) {
            return null;
        }
    }

    // Загрузка настроек (асинхронно, но не блокирует старт)
    async function loadSettings() {
        settings.minSaveDifference = await GM_getValue('minSaveDifference', settings.minSaveDifference);
    }

    // UI: Тост-уведомление (легковесное)
    function showToast(text) {
        const id = 'yt-vps-toast';
        let toast = document.getElementById(id);
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.id = id;
        toast.textContent = text;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(33, 33, 33, 0.9)', color: '#fff', padding: '8px 16px',
            borderRadius: '4px', fontSize: '13px', zIndex: '99999', pointerEvents: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)', fontFamily: 'Roboto, Arial, sans-serif'
        });
        document.body.appendChild(toast);

        // Анимация исчезновения
        toast.animate([
            { opacity: 0, transform: 'translateX(-50%) translateY(10px)' },
            { opacity: 1, transform: 'translateX(-50%) translateY(0)' }
        ], { duration: 200, fill: 'forwards' });

        setTimeout(() => {
            if (toast && toast.parentElement) toast.remove();
        }, 2500);
    }

    // --- ЛОГИКА СОХРАНЕНИЯ ---
    // Используем throttle, чтобы не долбить localStorage каждые 16мс
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this, args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    const savePosition = throttle((video, id) => {
        if (!id || !video || State.isRestoring) return;

        // Игнорируем рекламу (у неё часто duration пустое или NaN, или класс ad-showing)
        if (document.querySelector('.ad-showing')) return;

        const currentTime = video.currentTime;
        // Если видео только началось или закончилось - не спамим, но сохраняем 0 или конец
        if (Math.abs(currentTime - State.lastSavedTime) < settings.minSaveDifference) return;

        const data = { time: currentTime, savedAt: getTimestamp() };
        localStorage.setItem(CONFIG.storageKey + id, JSON.stringify(data));
        State.lastSavedTime = currentTime;
    }, CONFIG.throttleMs);

    // --- ЛОГИКА ВОССТАНОВЛЕНИЯ ---
    function restorePosition(video, id) {
        const raw = localStorage.getItem(CONFIG.storageKey + id);
        if (!raw) return;

        let data;
        try { data = JSON.parse(raw); } catch { return; }

        if (!data || isNaN(data.time) || data.time < 1) return; // Меньше 1 сек не восстанавливаем
        if (video.duration && data.time >= video.duration - 1) return; // Если это был конец видео

        State.isRestoring = true;

        const targetTime = data.time;
        log(`Цель восстановления: ${targetTime} сек`);

        // ПРИНУДИТЕЛЬ: Жестко ставим время и следим, чтобы YT его не сбросил
        const applyTime = () => {
            video.currentTime = targetTime;
        };

        applyTime(); // Сразу

        // Проверка через короткие интервалы (защита от автосброса YouTube)
        let attempts = 0;
        const enforcer = setInterval(() => {
            attempts++;
            // Если время сбилось (напр. стало 0) и мы все еще в зоне защиты
            if (Math.abs(video.currentTime - targetTime) > 2 && video.currentTime < targetTime) {
                log(`Коррекция сброса: ${video.currentTime} -> ${targetTime}`);
                applyTime();
            }
            if (attempts > 10) { // ~2 секунды защиты
                clearInterval(enforcer);
                State.isRestoring = false;
            }
        }, 200);

        showToast(`⏪ Восстановлено на ${targetTime.toFixed(0)} сек`);
    }

    // --- УПРАВЛЕНИЕ ЖИЗНЕННЫМ ЦИКЛОМ (ENGINE) ---
    function attachToVideo(video) {
        if (State.videoElement === video) return; // Уже прикреплены к этому элементу

        // Очистка старых привязок если элемент сменился (редко, но бывает)
        if (State.videoElement) {
            State.videoElement.removeEventListener('timeupdate', State.handlers.onTimeUpdate);
            State.videoElement.removeEventListener('loadedmetadata', State.handlers.onLoaded);
        }

        State.videoElement = video;
        const currentId = getVideoId();

        // 1. Создаем обработчики (замыкания)
        State.handlers.onTimeUpdate = () => savePosition(video, State.currentVideoId);
        State.handlers.onLoaded = () => {
             if (State.currentVideoId) restorePosition(video, State.currentVideoId);
        };

        // 2. Вешаем слушатели
        video.addEventListener('timeupdate', State.handlers.onTimeUpdate);

        // Если метаданные уже есть - восстанавливаем сразу, иначе ждем
        if (video.readyState >= 1) {
            if (currentId) restorePosition(video, currentId);
        } else {
            video.addEventListener('loadedmetadata', State.handlers.onLoaded, { once: true });
        }
    }

    function initVideoHandler() {
        const newId = getVideoId();
        if (!newId) return;

        // Если перешли на то же самое видео (напр. обновление страницы), не сбрасываем всё жестко
        if (State.currentVideoId !== newId) {
            log(`Новое видео: ${newId}`);
            State.currentVideoId = newId;
            State.lastSavedTime = 0;
            State.isRestoring = false;
        }

        const video = document.querySelector('video');
        if (video) {
            attachToVideo(video);
        } else {
            // Если видео тега еще нет (очень быстрая загрузка), ждем его появления
            const obs = new MutationObserver((mutations, observer) => {
                const v = document.querySelector('video');
                if (v) {
                    observer.disconnect();
                    attachToVideo(v);
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    }

    // --- ГЛОБАЛЬНЫЕ ХУКИ ---
    function globalSetup() {
        loadSettings();

        // Перехват навигации YouTube (SPA)
        window.addEventListener('yt-navigate-start', () => {
             // Можно сохранить позицию напоследок перед уходом
             if(State.videoElement && State.currentVideoId) savePosition(State.videoElement, State.currentVideoId);
        });

        window.addEventListener('yt-navigate-finish', () => {
            // НИКАКИХ setTimeout! Запускаем инициализацию сразу.
            initVideoHandler();
        });

        // Первый запуск
        initVideoHandler();

        // Очистка старого мусора (раз в сессию)
        cleanOldEntries();
        registerMenus();
    }

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ОЧИСТКА, МЕНЮ) ---
    function cleanOldEntries() {
        const cutoff = Date.now() - CONFIG.maxAgeDays * 86400000;
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CONFIG.storageKey)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item.savedAt < cutoff) {
                        localStorage.removeItem(key);
                        count++;
                    }
                } catch { localStorage.removeItem(key); }
            }
        }
        if (count) log(`Очищено ${count} старых записей`);
    }

    function registerMenus() {
        GM_registerMenuCommand('🗑 Сброс позиции этого видео', () => {
            if (State.currentVideoId) {
                localStorage.removeItem(CONFIG.storageKey + State.currentVideoId);
                showToast('Позиция сброшена');
            }
        });
        GM_registerMenuCommand('🧹 Очистить всё', () => {
             if(confirm('Удалить историю всех видео?')) {
                 Object.keys(localStorage).filter(k => k.startsWith(CONFIG.storageKey)).forEach(k => localStorage.removeItem(k));
                 showToast('База очищена');
             }
        });
    }

    // ЗАПУСК
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', globalSetup);
    } else {
        globalSetup();
    }

})();