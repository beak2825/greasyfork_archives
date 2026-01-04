// ==UserScript==
// @name         Steam Auto-Click "Show More Content" (v4.2, with Pause Button)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Быстрая версия: автоматически нажимает "Показать еще" без задержки. Добавлена плавающая кнопка для паузы/возобновления работы.
// @author       Gemini & Community
// @match        https://steamcommunity.com/app/*
// @match        https://steamcommunity.com/workshop/browse/*
// @match        https://steamcommunity.com/id/*/myworkshopfiles/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://store.steampowered.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544381/Steam%20Auto-Click%20%22Show%20More%20Content%22%20%28v42%2C%20with%20Pause%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544381/Steam%20Auto-Click%20%22Show%20More%20Content%22%20%28v42%2C%20with%20Pause%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    const MAX_CLICKS = 150; // Увеличено, так как клики происходят быстрее
    const POLL_INTERVAL_MS = 1000; // Интервал для запасной проверки (в мс)
    // --- КОНЕЦ НАСТРОЕК ---

    let clickCount = 0;
    let isClicking = false;
    let isPaused = false; // Новая переменная состояния паузы
    let observer;
    let pollIntervalId;
    let pauseButton; // Переменная для кнопки паузы

    console.log("Userscript v4.2 (with Pause Button) запущен.");

    // Функция для создания и управления кнопкой паузы
    const createPauseButton = () => {
        pauseButton = document.createElement('button');
        pauseButton.id = 'tm-pause-button';
        pauseButton.textContent = 'Пауза';

        // Применяем стили через GM_addStyle для большей совместимости
        GM_addStyle(`
            #tm-pause-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 10px 15px;
                background-color: #4CAF50; /* Зеленый - работает */
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.3s;
            }
            #tm-pause-button:hover {
                opacity: 0.9;
            }
        `);

        pauseButton.addEventListener('click', () => {
            isPaused = !isPaused; // Инвертируем состояние паузы
            if (isPaused) {
                pauseButton.textContent = 'Возобновить';
                pauseButton.style.backgroundColor = '#f44336'; // Красный - на паузе
                console.log("Скрипт поставлен на паузу.");
            } else {
                pauseButton.textContent = 'Пауза';
                pauseButton.style.backgroundColor = '#4CAF50'; // Зеленый - работает
                console.log("Скрипт возобновлен.");
                // Сразу после возобновления пытаемся кликнуть
                processContent();
            }
        });

        document.body.appendChild(pauseButton);
    };


    // Функция для очистки: отключает наблюдатель, интервал и удаляет кнопку
    const cleanup = () => {
        console.log("Завершение работы скрипта. Очистка...");
        if (observer) {
            observer.disconnect();
        }
        if (pollIntervalId) {
            clearInterval(pollIntervalId);
        }
        if (pauseButton) {
            pauseButton.remove();
        }
    };

    // Основная функция для обработки контента
    const processContent = () => {
        // Если скрипт на паузе, ничего не делаем
        if (isPaused || isClicking) return;

        const noMoreContent = document.getElementById('NoMoreContent');
        if (noMoreContent && noMoreContent.style.display !== 'none') {
            console.log("Больше контента нет. Скрипт остановлен.");
            cleanup();
            return;
        }

        if (clickCount >= MAX_CLICKS) {
            console.warn(`Достигнут лимит в ${MAX_CLICKS} кликов. Скрипт остановлен.`);
            cleanup();
            return;
        }

        const moreButton = document.getElementById('GetMoreContentBtn');
        if (moreButton && moreButton.style.display !== 'none') {
            isClicking = true;
            clickCount++;
            console.log(`Кнопка найдена. Мгновенный клик #${clickCount}...`);

            // --- Клик происходит немедленно ---
            moreButton.querySelector('a')?.click();

            requestAnimationFrame(() => {
                 isClicking = false;
            });
        }
    };

    // --- ЗАПУСК СКРИПТА ---

    // Создаем кнопку паузы при старте
    createPauseButton();

    // Целевой узел для наблюдения.
    const targetNode = document.body;

    // Конфигурация для наблюдателя: следим за структурой и ИЗМЕНЕНИЕМ АТРИБУТОВ
    const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    };

    // Создаем наблюдателя
    observer = new MutationObserver(() => {
        // Проверяем паузу перед обработкой мутаций
        if (isPaused) return;
        processContent();
    });

    // Начинаем наблюдение
    observer.observe(targetNode, config);

    // Запускаем периодическую проверку как надежный запасной вариант
    pollIntervalId = setInterval(processContent, POLL_INTERVAL_MS);

    // Выполняем первую проверку немедленно при запуске
    processContent();

})();