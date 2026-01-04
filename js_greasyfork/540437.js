// ==UserScript==
// @name            Прокрутка к началу YouTube
// @description     Добавляет квадратную полупрозрачную кнопку для плавной прокрутки к началу страницы YouTube: по центру на страницах с плеером (/watch), справа внизу на остальных страницах.
// @author          vsemke
// @license         MIT
// @icon            https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png
// @namespace       https://vk.com/mrxxxxxxxxxxx
// @version         1.5
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/540437/%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D0%BA%20%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D1%83%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/540437/%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D0%BA%20%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D1%83%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Иконка SVG в формате base64 (стрелка вверх)
    const iconBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIxMiAxOSAxMiA1Ij48L3BvbHlsaW5lPjxwYXRoIGQ9Im0xOSAxMi03LTctNyA3Ij48L3BhdGg+PC9zdmc+';

    // Общие стили для обеих кнопок
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top-btn {
            position: fixed;
            bottom: 20px;
            width: 50px;
            height: 50px;
            background-color: rgba(211, 47, 47, 0.7); /* Полупрозрачный красный */
            border: none;
            border-radius: 8px; /* Закруглённые края */
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 2147483647; /* Максимальный z-index */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .scroll-to-top-btn.center {
            left: 50%;
            transform: translateX(-50%);
        }
        .scroll-to-top-btn.right {
            right: 20px;
            transform: none;
        }
        .scroll-to-top-btn.center:hover {
            opacity: 1;
            transform: translateX(-50%) scale(1.1);
        }
        .scroll-to-top-btn.right:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .scroll-to-top-btn img {
            width: 24px;
            height: 24px;
        }
    `;
    document.head.appendChild(style);

    // Функция для создания кнопки
    function createButton(id, positionClass) {
        const button = document.createElement('button');
        button.id = id;
        button.classList.add('scroll-to-top-btn', positionClass);

        // Устанавливаем иконку
        const icon = document.createElement('img');
        icon.src = iconBase64;
        icon.alt = 'Прокрутить наверх';
        button.appendChild(icon);

        // Добавляем кнопку в тело страницы
        document.body.appendChild(button);

        // Плавная прокрутка к началу страницы
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return button;
    }

    // Функция для управления кнопкой на страницах с плеером (/watch)
    function handlePlayerPageButton() {
        const button = createButton('scroll-to-top-player', 'center');
        function updateVisibility() {
            const isPlayerPage = window.location.pathname.includes('/watch');
            button.style.display = isPlayerPage && window.scrollY > 100 ? 'flex' : 'none';
        }
        window.addEventListener('scroll', updateVisibility);
        updateVisibility();
        return updateVisibility;
    }

    // Функция для управления кнопкой на остальных страницах
    function handleNonPlayerPageButton() {
        const button = createButton('scroll-to-top-non-player', 'right');
        function updateVisibility() {
            const isPlayerPage = window.location.pathname.includes('/watch');
            button.style.display = !isPlayerPage && window.scrollY > 100 ? 'flex' : 'none';
        }
        window.addEventListener('scroll', updateVisibility);
        updateVisibility();
        return updateVisibility;
    }

    // Инициализация обеих функций
    let updatePlayerButton = handlePlayerPageButton();
    let updateNonPlayerButton = handleNonPlayerPageButton();

    // Отслеживание изменений URL для динамических страниц
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== lastPath) {
            lastPath = currentPath;
            updatePlayerButton();
            updateNonPlayerButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();