// ==UserScript==
// @name         Catwar Mark as Unread (with storage)
// @namespace    https://catwar.net/
// @version      1.2
// @description  Добавляет кнопку, позволяющую помечать сообщения.
// @match        https://catwar.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526216/Catwar%20Mark%20as%20Unread%20%28with%20storage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526216/Catwar%20Mark%20as%20Unread%20%28with%20storage%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для получения номера текущей страницы из URL
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page') || '1', 10);
    }

    // Считаем из localStorage список помеченных ID для каждой страницы
    function getMarkedMessagesForPage(page) {
        const stored = JSON.parse(localStorage.getItem('markedMessages') || '{}');
        return stored[page] || [];
    }

    // Сохраняем состояние помеченных сообщений для каждой страницы
    function saveMarkedMessagesForPage(page, messages) {
        const stored = JSON.parse(localStorage.getItem('markedMessages') || '{}');
        stored[page] = messages;
        localStorage.setItem('markedMessages', JSON.stringify(stored));
    }

    // Логика работы с сообщениями после загрузки страницы
    window.addEventListener('load', () => {
        const currentPage = getCurrentPage();
        let markedMessages = getMarkedMessagesForPage(currentPage);

        // Функция сохранения актуального состояния
        function saveState() {
            saveMarkedMessagesForPage(currentPage, markedMessages);
        }

        // После загрузки страницы ищем все строки с классом .msg_read
        const rows = document.querySelectorAll('tr.msg_read');
        rows.forEach(row => {
            // Ищем ID сообщения
            const delBtn = row.querySelector('.del, .msg_open');
            if (!delBtn) {
                return;
            }

            const msgID = delBtn.dataset.id;
            if (!msgID) {
                return;
            }

            // Если ID уже в списке помеченных, красим фон в желтый
            if (markedMessages.includes(msgID)) {
                row.style.backgroundColor = 'yellow';
            }

            // Создаем кнопку переключения
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = markedMessages.includes(msgID)
                ? 'Снять пометку'
                : 'Пометить';

            // Логика переключения
            toggleBtn.addEventListener('click', () => {
                // Если строка НЕ закрашена желтым => помечаем
                if (row.style.backgroundColor !== 'yellow') {
                    row.style.backgroundColor = 'yellow';
                    markedMessages.push(msgID);
                    toggleBtn.textContent = 'Снять пометку';
                } else { // Иначе (если уже желтая) => снимаем пометку
                    row.style.backgroundColor = '';
                    markedMessages = markedMessages.filter(id => id !== msgID);
                    toggleBtn.textContent = 'Пометить';
                }
                saveState(); // Обновляем состояние в localStorage
            });

            // Вставляем кнопку в последнюю ячейку
            const lastTd = row.querySelector('td:last-of-type');
            if (lastTd) {
                lastTd.appendChild(document.createTextNode(' ')); // пробел
                lastTd.appendChild(toggleBtn);
            }
        });
    });

    // Добавление обработчика события для изменения страницы (в форме выбора страницы)
    const pageSelect = document.querySelector('#page');
    if (pageSelect) {
        pageSelect.addEventListener('change', () => {
            // При изменении страницы сохраняем актуальное состояние
            const currentPage = getCurrentPage();
            let markedMessages = getMarkedMessagesForPage(currentPage);
            saveMarkedMessagesForPage(currentPage, markedMessages);
        });
    }
})();