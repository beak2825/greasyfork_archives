// ==UserScript==
// @name         Yandex Translate Selection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет контекстное меню для перевода выделенного текста через Яндекс.Переводчик
// @author       motorrin
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532014/Yandex%20Translate%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/532014/Yandex%20Translate%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем и добавляем стили
    const style = document.createElement('style');
    style.textContent = `
        .translate-menu-item {
            padding: 8px 12px;
            cursor: pointer;
            background: #292C2F;
            color: #fffff0;
            border: 1px solid #fffff0;
            border-radius: 4px;
            text-decoration: none;
            white-space: nowrap;
            font-size: 13px;
        }
        .translate-menu-item .ya-letter {
            color: #ff3333;
        }
        .translate-menu {
            position: fixed;
            background: transparent;
            z-index: 10000;
        }
        .translate-menu-item:hover {
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);

    let currentMenu = null;
    let menuTimeout = null;
    let translatorWindow = null;
    let lastScrollPosition = window.scrollY;
    let scrollTimeout = null;

    // Функция открытия переводчика в новом окне
    function openTranslator(text) {
        // Закрываем предыдущее окно переводчика, если оно существует
        if (translatorWindow && !translatorWindow.closed) {
            translatorWindow.close();
        }

        // Вычисляем размеры и позицию для нового окна
        const width = 800;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        // Открываем новое окно с заданными параметрами
        translatorWindow = window.open(
            `https://translate.yandex.ru/?text=${encodeURIComponent(text)}`,
            'YandexTranslate',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,menubar=no,toolbar=no`
        );

        // Фокусируем новое окно
        if (translatorWindow) {
            translatorWindow.focus();
        }
    }

    // Функция закрытия меню
    function closeMenu() {
        if (currentMenu) {
            currentMenu.remove();
            currentMenu = null;
        }
    }

    // Отслеживаем прокрутку страницы
    document.addEventListener('scroll', function() {
        // Используем throttling для оптимизации производительности
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (Math.abs(window.scrollY - lastScrollPosition) > 5) { // Минимальный порог прокрутки
                    closeMenu();
                }
                lastScrollPosition = window.scrollY;
                scrollTimeout = null;
            }, 50);
        }
    }, { passive: true }); // Оптимизация производительности

    // Отслеживаем отпускание кнопки мыши
    document.addEventListener('mouseup', function(e) {
        // Очищаем предыдущий таймер, если он есть
        if (menuTimeout) {
            clearTimeout(menuTimeout);
        }

        // Устанавливаем новый таймер
        menuTimeout = setTimeout(() => {
            const selectedText = window.getSelection().toString().trim();

            // Удаляем предыдущее меню
            closeMenu();

            if (selectedText) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                const menu = document.createElement('div');
                menu.className = 'translate-menu';

                const menuItem = document.createElement('div');
                menuItem.className = 'translate-menu-item';
                menuItem.innerHTML = 'Перевести в <span class="ya-letter">Я</span>ндекс';
                menuItem.onclick = (e) => {
                    e.preventDefault();
                    openTranslator(selectedText);
                    closeMenu();
                };

                menu.appendChild(menuItem);

                // Позиционируем меню выше выделенного текста
                const menuVerticalOffset = 35;
                menu.style.left = `${rect.left}px`;
                menu.style.top = `${rect.top - menuVerticalOffset}px`;

                document.body.appendChild(menu);
                currentMenu = menu;

                // Корректируем позицию, если меню выходит за пределы экрана
                const menuRect = menu.getBoundingClientRect();

                if (menuRect.top < 0) {
                    menu.style.top = `${rect.bottom + 10}px`;
                }

                if (menuRect.right > window.innerWidth) {
                    menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
                }
            }
        }, 200);
    });

    // Закрываем меню при клике вне его
    document.addEventListener('mousedown', function(e) {
        if (currentMenu && !currentMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Очищаем таймер при отмене выделения
    document.addEventListener('selectionchange', function() {
        if (!window.getSelection().toString().trim() && menuTimeout) {
            clearTimeout(menuTimeout);
        }
    });
})();