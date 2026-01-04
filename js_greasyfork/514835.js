// ==UserScript==
// @name         YouTube Shorts Blocker (Pro Version)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Блокирует Shorts, устойчив к смене классов и оптимизирован
// @author       necoop
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514835/YouTube%20Shorts%20Blocker%20%28Pro%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514835/YouTube%20Shorts%20Blocker%20%28Pro%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация: какие теги или классы считаются контейнерами полки
    // YouTube обычно использует ytd-rich-shelf-renderer для полок на главной
    const SHELF_SELECTORS = [
        'ytd-rich-shelf-renderer',
        'ytd-reel-shelf-renderer',
        '.ytGridShelfViewModelHost', // старый класс из твоего запроса (на всякий случай)
        '.ytd-shelf-renderer'
    ];

    let timeout = null;

    function cleanShorts() {
        // Ищем только те спаны, которые мы еще НЕ обрабатывали (нет атрибута data-checked)
        // Это сильно ускоряет работу при скролле
        const spans = document.querySelectorAll('span.yt-core-attributed-string[role="text"]:not([data-shorts-checked])');

        spans.forEach(span => {
            // Помечаем, что мы проверили этот спан, чтобы не проверять его вечно
            span.setAttribute('data-shorts-checked', 'true');

            if (span.textContent.includes('Shorts')) {
                // Пытаемся найти родителя-контейнер
                // closest сработает, если родитель соответствует любому селектору из списка через запятую
                const container = span.closest(SHELF_SELECTORS.join(','));

                if (container) {
                    container.style.display = 'none';
                    // console.log('Tampermonkey: Removed Shorts shelf via', container.tagName);
                } else {
                    // Фолбэк: если специфичный контейнер не найден,
                    // можно попробовать подняться на фиксированное число уровней вверх (опасно, но работает)
                    // let parent = span.parentElement;
                    // while(parent) { ... }
                }
            }
        });
    }

    // Оптимизированный Observer
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldCheck = true;
                break;
            }
        }

        if (shouldCheck) {
            // Debounce: если изменений много, ждем паузу перед запуском
            // Это предотвращает выполнение скрипта 50 раз за секунду при быстрой загрузке
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(cleanShorts, 100); // задержка 100мс
        }
    });

    // Запуск
    cleanShorts();
    observer.observe(document.body, { childList: true, subtree: true });

})();