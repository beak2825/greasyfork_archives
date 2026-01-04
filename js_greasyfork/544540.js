// ==UserScript==
// @name         YouTube Music - Skip Liked/Disliked (Vanilla Fix + Toggle)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Пропуск лайкнутых/дизлайкнутых треков + кнопка паузы. Без библиотек.
// @author       Anon & Torch
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544540/YouTube%20Music%20-%20Skip%20LikedDisliked%20%28Vanilla%20Fix%20%2B%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544540/YouTube%20Music%20-%20Skip%20LikedDisliked%20%28Vanilla%20Fix%20%2B%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === КОНФИГУРАЦИЯ ===
    const DEBUG = true;           // true - показывать логи в консоли
    const CHECK_INTERVAL_MS = 500; // Частота проверки (мс)
    const STORAGE_KEY = 'ytm_skipper_paused'; // Ключ для сохранения настроек
    // ====================

    let lastTitle = "";
    let isSkipping = false;
    let isPaused = localStorage.getItem(STORAGE_KEY) === 'true'; // Загружаем состояние

    // Логгер
    function log(msg) {
        if (DEBUG) console.log(`[YTM Skipper] ${new Date().toLocaleTimeString()} > ${msg}`);
    }

    // === UI: ПЛАВАЮЩАЯ КНОПКА ===
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'ytm-skipper-toggle';
        updateButtonStyle(btn);

        // Стили кнопки
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '80px', // Чуть выше стандартных контролов плеера
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            borderRadius: '25px',
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Roboto, Arial, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'background 0.3s, transform 0.1s',
            opacity: '0.9'
        });

        // Наведение
        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.9';

        // Клик
        btn.onclick = () => {
            isPaused = !isPaused;
            localStorage.setItem(STORAGE_KEY, isPaused); // Сохраняем
            updateButtonStyle(btn);
            log(`Script is now: ${isPaused ? 'PAUSED' : 'ACTIVE'}`);
        };

        document.body.appendChild(btn);
    }

    function updateButtonStyle(btn) {
        if (isPaused) {
            btn.innerText = 'Skipper: OFF 🛑';
            btn.style.background = '#d32f2f'; // Красный
        } else {
            btn.innerText = 'Skipper: ON ✅';
            btn.style.background = '#2e7d32'; // Зеленый
        }
    }

    // === ЛОГИКА ===
    function clickNext() {
        // Ищем кнопку Next именно в панели плеера
        const nextBtn = document.querySelector('ytmusic-player-bar .next-button');
        if (nextBtn) {
            log("SKIP TRIGGERED");
            nextBtn.click();
            isSkipping = true;
            // Короткий кулдаун, чтобы не кликать дважды на одной песне
            setTimeout(() => { isSkipping = false; }, 1500);
        } else {
            log("ERROR: Next button not found");
        }
    }

    function checkStatus() {
        // Если скрипт на паузе или сейчас идет пропуск - ничего не делаем
        if (isPaused || isSkipping) return;

        const titleEl = document.querySelector('ytmusic-player-bar .title');
        const currentTitle = titleEl ? (titleEl.title || titleEl.textContent) : "";
        const likeRenderer = document.querySelector('ytmusic-player-bar ytmusic-like-button-renderer');

        if (!likeRenderer) {
            // Плеер еще не загрузился
            return;
        }

        const status = likeRenderer.getAttribute('like-status');

        // Лог только при смене трека или статуса
        if (currentTitle !== lastTitle) {
            log(`New Track: "${currentTitle}" | Status: ${status}`);
            lastTitle = currentTitle;
        }

        // Проверяем статус
        if (status === 'LIKE' || status === 'DISLIKE') {
            log(`Detected ${status} - Skipping...`);
            clickNext();
        }
    }

    // Горячая клавиша 'D' для дизлайка
    document.addEventListener('keydown', (e) => {
        // Не срабатывать в полях ввода и если скрипт на паузе
        if (isPaused) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.key.toLowerCase() === 'd') {
            e.preventDefault();
            log("Manual Dislike pressed");

            const dislikeBtn = document.querySelector('ytmusic-player-bar #button-shape-dislike button');
            const likeRenderer = document.querySelector('ytmusic-player-bar ytmusic-like-button-renderer');
            const currentStatus = likeRenderer ? likeRenderer.getAttribute('like-status') : '';

            // Если уже дизлайк - просто пропускаем
            if (currentStatus === 'DISLIKE') {
                clickNext();
                return;
            }

            if (dislikeBtn) {
                dislikeBtn.click();
                isSkipping = true; // Блокируем авто-проверку на секунду
                // Ждем чуть-чуть, чтобы YTM засчитал клик, и пропускаем
                setTimeout(() => {
                    clickNext();
                    setTimeout(() => { isSkipping = false; }, 1000);
                }, 300);
            } else {
                log("Dislike button not found");
            }
        }
    });

    // === ЗАПУСК ===
    log("Script initialized (Vanilla + Toggle)");
    createToggleButton();
    setInterval(checkStatus, CHECK_INTERVAL_MS);

})();