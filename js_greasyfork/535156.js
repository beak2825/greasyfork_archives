// ==UserScript==
// @name         Ensure Ctrl+A & Ctrl+C on DisplaySpecifications
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tries to ensure Ctrl+A (Select All) and Ctrl+C (Copy) functionality on displayspecifications.com.
// @author       Your Name
// @match        https://www.displayspecifications.com/*
// @license MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535156/Ensure%20Ctrl%2BA%20%20Ctrl%2BC%20on%20DisplaySpecifications.user.js
// @updateURL https://update.greasyfork.org/scripts/535156/Ensure%20Ctrl%2BA%20%20Ctrl%2BC%20on%20DisplaySpecifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Принудительно разрешить выделение текста через CSS
    // Это самая мягкая и часто эффективная мера.
    GM_addStyle(`
        body, body *, ::selection {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
        }
    `);

    // Функция для обнуления потенциально блокирующих обработчиков
    function clearEventHandlersOnElement(element, eventName) {
        if (!element) return;
        try {
            if (typeof element[eventName] === 'function') {
                console.log(`[UserScript] Clearing ${eventName} on`, element.tagName || element.constructor.name);
                element[eventName] = null;
            }
        } catch (e) {
            // console.warn(`[UserScript] Failed to clear ${eventName} on ${element.tagName || element.constructor.name}:`, e);
        }
    }

    // 2. Обнулить некоторые специфические обработчики, которые могут мешать.
    // Делаем это после загрузки основного контента DOM, чтобы убедиться, что body существует.
    document.addEventListener('DOMContentLoaded', function() {
        // Для onselectstart и oncopy обычно достаточно document и document.body
        clearEventHandlersOnElement(document, 'onselectstart');
        clearEventHandlersOnElement(document.body, 'onselectstart');

        clearEventHandlersOnElement(document, 'oncopy');
        clearEventHandlersOnElement(document.body, 'oncopy');

        // Иногда onmousedown может мешать выделению, но на этом сайте вроде бы не проблема.
        // clearEventHandlersOnElement(document, 'onmousedown');
        // clearEventHandlersOnElement(document.body, 'onmousedown');
    });


    // 3. Более агрессивный перехват keydown (опционально, и для этого сайта, скорее всего, не нужен)
    // Если вышеперечисленное не помогает (что маловероятно для displayspecifications.com),
    // можно раскомментировать этот блок.
    /*
    const keydownInterceptor = function(event) {
        const isCtrlA = event.ctrlKey && (event.key === 'a' || event.key === 'A' || event.keyCode === 65);
        const isCtrlC = event.ctrlKey && (event.key === 'c' || event.key === 'C' || event.keyCode === 67);

        if (isCtrlA || isCtrlC) {
            // Мы пытаемся остановить другие обработчики на этом же элементе
            // от отмены стандартного действия.
            if (event.isTrusted) { // Только если событие создано браузером
                console.log(`[UserScript] ${isCtrlA ? 'Ctrl+A' : 'Ctrl+C'} detected. Attempting to stop immediate propagation.`);
                event.stopImmediatePropagation();
            }
            // Не вызываем preventDefault(), чтобы стандартное действие сработало.
        }
    };

    // Используем capture фазу, чтобы сработать раньше
    window.addEventListener('keydown', keydownInterceptor, true);
    */

    console.log('[UserScript] "Ensure Ctrl+A & Ctrl+C on DisplaySpecifications" activated.');

})();