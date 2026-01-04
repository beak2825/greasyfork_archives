// ==UserScript==
// @name         Звук уведомлений как ВК 
// @namespace    https://lolz.live/
// @version      1.2
// @description  lolzteam 
// @author       lolzteam
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518332/%D0%97%D0%B2%D1%83%D0%BA%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BA%D0%B0%D0%BA%20%D0%92%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/518332/%D0%97%D0%B2%D1%83%D0%BA%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BA%D0%B0%D0%BA%20%D0%92%D0%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //  (прямая загрузка)
    const soundUrl = 'https://www.dropbox.com/scl/fi/2bf1hf6hxlf4sc4a1gafq/zvuk-soobscheniya-vkontakte-30452.wav?rlkey=yxc1ztbp5n85343fda08u9dm2&st=xwlb7ll9&raw=1';

    // Создаем и предзагружаем аудио
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.7; // Оптимальная громкость

    let audioLoaded = false;
    let lastNotificationCount = 0;
    let checkInterval = null;

    // Кэшируем селекторы для производительности
    const selectors = {
        counter: '#AlertsMenu_Counter .Total',
        container: '.navTab.alerts'
    };

    // Функция предзагрузки звука
    function loadAudio() {
        audio.src = soundUrl;
        audio.load();

        audio.addEventListener('canplaythrough', function() {
            audioLoaded = true;
            console.log('Аудио загружено и готово к воспроизведению');
        }, { once: true });

        audio.addEventListener('error', function(e) {
            console.error('Ошибка загрузки аудио:', e);
            // Попытка использовать резервный источник
            setTimeout(() => {
                if (!audioLoaded) {
                    console.log('Попытка повторной загрузки аудио...');
                    audio.src = soundUrl + '&t=' + Date.now(); // Добавляем timestamp для избежания кэширования
                    audio.load();
                }
            }, 1000);
        });
    }

    //  функция проверки уведомлений
    function checkForNewNotifications() {
        const notificationElement = document.querySelector(selectors.counter);

        if (!notificationElement) {
            // Если элемент не найден, уменьшаем частоту проверок
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = setInterval(checkForNewNotifications, 1000);
            }
            return;
        }

        const currentText = notificationElement.textContent.trim();
        const currentNotificationCount = parseInt(currentText, 10) || 0;

        // Быстрая проверка на изменения
        if (currentNotificationCount !== lastNotificationCount) {
            const notificationContainer = document.querySelector(selectors.container);

            if (currentNotificationCount > lastNotificationCount &&
                notificationContainer &&
                !notificationContainer.classList.contains('Zero')) {

                console.log(`Новое уведомление: ${lastNotificationCount} → ${currentNotificationCount}`);

                if (audioLoaded) {
                    playNotificationSound();
                } else {
                    // Если аудио еще не загружено, пытаемся воспроизвести сразу
                    audio.play().catch(e => {
                        console.log('Аудио еще не готово, откладываем воспроизведение...');
                        setTimeout(playNotificationSound, 500);
                    });
                }
            }

            lastNotificationCount = currentNotificationCount;
        }
    }

    // Функция воспроизведения звука с обработкой ошибок
    function playNotificationSound() {
        if (audio.paused) {
            audio.currentTime = 0; // Перематываем в начало
            audio.play().catch(error => {
                console.warn('Ошибка воспроизведения звука:', error);

                // Попытка восстановить воспроизведение
                if (error.name === 'NotAllowedError') {
                    console.log('Пользователь должен взаимодействовать со страницей для воспроизведения звука');
                }
            });
        }
    }

    // Оптимизированный наблюдатель за изменениями DOM
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Быстрая проверка при изменениях в DOM
                    setTimeout(checkForNewNotifications, 50);
                    break;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return observer;
    }

    // Инициализация скрипта
    function init() {
        console.log('Инициализация звука уведомлений...');

        // Загружаем аудио
        loadAudio();

        // Начальная проверка
        setTimeout(checkForNewNotifications, 100);

        // Устанавливаем наблюдатель за DOM
        const observer = setupMutationObserver();

        // Интервал проверки (реже, т.к. есть MutationObserver)
        checkInterval = setInterval(checkForNewNotifications, 100);

        // Восстанавливаем нормальную частоту проверок при взаимодействии пользователя
        document.addEventListener('click', function() {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = setInterval(checkForNewNotifications, 100);
            }
        });

        // Очистка при разгрузке страницы
        window.addEventListener('beforeunload', function() {
            if (checkInterval) clearInterval(checkInterval);
            if (observer) observer.disconnect();
        });
    }

    // Запускаем после полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();