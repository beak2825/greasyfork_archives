// ==UserScript==
// @name         YouTube Restart Video Button
// @namespace    https://github.com/ToLIManl
// @version      0.7
// @description  Добавляет кнопку для возврата видео на начало.
// @description:ru  Добавляет кнопку для возврата видео на начало.
// @description:en  Adds the video return button to the beginning.
// @author       ToLIMan
// @match        https://www.youtube.com/*
// @grant        none
// @license         MIT
// @name:ru         Кнопка воспроизвести видео сначала Youtube
// @name:en         YouTube Restart Video Button
// @downloadURL https://update.greasyfork.org/scripts/525164/YouTube%20Restart%20Video%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/525164/YouTube%20Restart%20Video%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания кнопки
    function addRestartButton() {
        const controls = document.querySelector('.ytp-left-controls'); // Панель управления YouTube
        if (!controls || document.querySelector('#restart-button')) return; // Проверка наличия панели и кнопки

        // Создание кнопки
        const button = document.createElement('button');
        button.id = 'restart-button';
        button.textContent = '⏪'; // Иконка кнопки
        button.title = 'Вернуть на начало';
        button.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0 10px;
        `;

        // Добавление обработчика нажатия
        button.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = 0; // Устанавливаем время на 0
            }
        });

        // Добавление кнопки в панель управления
        controls.insertBefore(button, controls.firstChild);
    }

    // Наблюдатель для динамического добавления кнопки
    const observer = new MutationObserver(() => {
        addRestartButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
