// ==UserScript==
// @name        notdrink.ru samAdBlockDetected remove (FIXED v5: Targeted)
// @namespace   https://greasyfork.org/ru/users/717310-alina-novikova
// @version     0.5
// @description Удаляет предупреждение о включенном блокировщике на сайте notdrink.ru (Исправлено v5: Точечный удар по samNotice)
// @author      servakov / Modified
// @supportURL  https://greasyfork.org/ru/scripts/418687-notdrink-ru-samadblockdetected-remove
// @match       https://notdrink.ru/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/418687/notdrinkru%20samAdBlockDetected%20remove%20%28FIXED%20v5%3A%20Targeted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418687/notdrinkru%20samAdBlockDetected%20remove%20%28FIXED%20v5%3A%20Targeted%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** СЕЛЕКТОРЫ, ПОДТВЕРЖДЕННЫЕ ВАШИМ КОДОМ ***
    const NOTICE_ID = 'samNotice';
    const BODY_CLASS = 'samAdBlockDetected';

    // 1. Немедленное CSS-скрытие (срабатывает сразу при появлении)
    const style = document.createElement('style');
    style.textContent = `
        #${NOTICE_ID} {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        body.${BODY_CLASS} {
            overflow: auto !important; /* Разрешаем прокрутку */
            position: static !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    /**
     * Функция, которая выполняет удаление уведомления и очистку body.
     */
    function removeAdBlockNotice() {
        // Удаляем контейнер
        const notice = document.getElementById(NOTICE_ID);
        if (notice) {
            notice.remove();
        }

        // Очищаем body
        if (document.body && document.body.classList.contains(BODY_CLASS)) {
            document.body.classList.remove(BODY_CLASS);
        }

        // Клик по кнопке не нужен, если мы удаляем элемент
    }

    // 2. MutationObserver для постоянного наблюдения
    const observer = new MutationObserver(function(mutationsList, observer) {
        let removed = false;
        // Проверяем, был ли добавлен элемент с ID 'samNotice'
        if (document.getElementById(NOTICE_ID)) {
             removeAdBlockNotice();
             removed = true;
        }
        // Проверяем, был ли добавлен класс 'samAdBlockDetected'
        if (document.body && document.body.classList.contains(BODY_CLASS)) {
            document.body.classList.remove(BODY_CLASS);
            removed = true;
        }

        // Если элемент удален, останавливаем Observer, чтобы не тратить ресурсы
        if (removed) {
             // observer.disconnect(); // Можно отключить, но лучше оставить для борьбы с повторной вставкой
        }
    });

    // Начинаем наблюдение как можно раньше
    const targetNode = document.body || document.documentElement;
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,   // Отслеживать добавление/удаление дочерних узлов
            subtree: true,     // Отслеживать во всех потомках
            attributes: true   // Отслеживать изменения атрибутов
        });
    }

    // 3. Агрессивный таймаут
    // Поскольку мы знаем, что уведомление вставляется через 1000 мс (1 сек) после DOMContentLoaded,
    // мы можем поставить таймауты немного позже, чтобы гарантированно поймать его.
    setTimeout(removeAdBlockNotice, 1100);
    setTimeout(removeAdBlockNotice, 1500);
    setTimeout(removeAdBlockNotice, 2000);

    // Вызываем один раз сразу
    removeAdBlockNotice();

})();