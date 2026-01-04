// ==UserScript==
// @name         TikTok UI Enabler
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрывает капчу/модальные окна и обеспечивает интерактивность основного интерфейса TikTok.
// @author       Gemini
// @match        *://*.tiktok.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544304/TikTok%20UI%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/544304/TikTok%20UI%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Скрываем капчу, оверлеи и модальные окна с помощью CSS.
    //    Также гарантируем, что основной контейнер всегда будет принимать клики.
    GM_addStyle(`
        /* Контейнеры капчи и модальных окон */
        #tiktok-verify-ele,
        .captcha-verify-container,
        div[data-floating-ui-portal] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* Оверлеи (полупрозрачный фон) */
        .TUXModal-overlay,
        .css-1o4zb36-DivModalMask {
            display: none !important;
            visibility: hidden !important;
        }

        /* Гарантируем, что основной контейнер приложения всегда интерактивен */
        #app, #main-content-video_detail {
            pointer-events: auto !important;
            filter: none !important; /* Убирает размытие, если оно применяется */
        }
    `);

    // 2. Используем MutationObserver для отслеживания и отмены блокирующих действий.
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Цель: главный контейнер <div id="app">
            const appElement = document.getElementById('app');
            if (appElement && appElement.hasAttribute('inert')) {
                appElement.removeAttribute('inert');
                console.log('UserScript: Атрибут "inert" удален, UI разблокирован.');
            }

            // Цель: элемент <body>
            const bodyElement = document.body;
            if (bodyElement) {
                // Если JS пытается заблокировать прокрутку через стиль
                if (bodyElement.style.overflow === 'hidden') {
                    bodyElement.style.overflow = 'auto'; // или 'scroll'
                    console.log('UserScript: Прокрутка для <body> принудительно включена.');
                }
                // Если JS пытается заблокировать прокрутку через класс
                if (bodyElement.classList.contains('disable-scroll')) {
                    bodyElement.classList.remove('disable-scroll');
                    console.log('UserScript: Класс "disable-scroll" удален, UI разблокирован.');
                }
            }
        }
    });

    // Начинаем отслеживание изменений в <body> и его дочерних элементах
    // как только DOM будет доступен.
    window.addEventListener('DOMContentLoaded', () => {
        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, {
                attributes: true, // отслеживать изменения атрибутов (style, class)
                childList: true, // отслеживать добавление/удаление дочерних элементов
                subtree: true,   // отслеживать изменения во всех вложенных элементах
            });
            console.log('UserScript: Отслеживание блокировки UI активно.');
        }
    });
})();