// ==UserScript==
// @name         Идеальное выделение текста на otvet.mail.ru
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Решает проблему "спотыкания" выделения, временно отключая события мыши на контейнерах во время выделения.
// @author       torch
// @match        https://otvet.mail.ru/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544504/%D0%98%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%BD%D0%B0%20otvetmailru.user.js
// @updateURL https://update.greasyfork.org/scripts/544504/%D0%98%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20%D0%BD%D0%B0%20otvetmailru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ШАГ 1: CSS ---
    // Разрешаем выделение текста и добавляем специальный класс, который будем использовать в JS.
    GM_addStyle(`
        /* 1. Глобально разрешаем выделение текста */
        body, body *, *::before, *::after {
            user-select: text !important;
            -webkit-user-select: text !important;
        }

        /* 2. Возвращаем стандартное поведение для интерактивных элементов, чтобы их текст не выделялся при клике */
        button, a, input, [role="button"], [contenteditable="true"], svg {
            user-select: none !important;
            -webkit-user-select: none !important;
        }

        /* 3. Разрешаем курсор и ввод в полях редактирования */
        .tiptap, [contenteditable="true"], input, textarea {
             user-select: auto !important;
            -webkit-user-select: auto !important;
        }

        /* 4. Наш "магический" класс. Когда он применен к элементу,
           этот элемент становится "прозрачным" для событий мыши. */
        .selection-in-progress {
            pointer-events: none !important;
        }
    `);

    // --- ШАГ 2: JavaScript ---
    // Логика для добавления и удаления "магического" класса.

    let isMouseDown = false;
    let disabledContainers = [];

    // При нажатии левой кнопки мыши
    document.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;

        isMouseDown = true;
        const target = event.target;

        // "Белый список" того, что можно кликать без проблем
        const isInteractive = target.closest(
            'a, button, input, textarea, [role="button"], [contenteditable="true"], svg, [class*="Vote"], [class*="Toggler"]'
        );

        // Если клик был не по интерактивному элементу, значит, пользователь хочет выделить текст.
        if (!isInteractive) {
            // Находим все родительские контейнеры постов и ответов
            const containers = document.querySelectorAll('._PostItem_1nwdr_1, ._ReplyItem_ypna7_2');
            containers.forEach(container => {
                if (!container.classList.contains('selection-in-progress')) {
                    // "Отключаем" его, делая "прозрачным" для мыши
                    container.classList.add('selection-in-progress');
                    disabledContainers.push(container);
                }
            });
        }
    }, true);

    // Когда отпускаем кнопку мыши - всё возвращаем как было.
    document.addEventListener('mouseup', () => {
        if (!isMouseDown) return;
        isMouseDown = false;

        disabledContainers.forEach(container => {
            container.classList.remove('selection-in-progress');
        });
        disabledContainers = [];
    }, true);

})();