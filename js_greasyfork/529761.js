// ==UserScript==
// @name         YouTube More Videos on Homepage
// @namespace    https://github.com/ToLIManl
// @version      0.6
// @description  This script allows you to increase the number of videos displayed in a single row on the YouTube homepage.
// @description:ru Этот скрипт позволяет увеличить количество видео, отображаемых в одном ряду на главной странице YouTube
// @description:en This script allows you to increase the number of videos displayed in a single row on the YouTube homepage.
// @author       ToLIMan
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/?*
// @grant        none
// @license      MIT
// @compatible         firefox
// @compatible         chrome
// @compatible         opera
// @compatible         safari
// @compatible         edge
// @compatible         opera
// @name:ru      Больше видео на домашней странице YouTube
// @name:en      YouTube More Videos on Homepage
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529761/YouTube%20More%20Videos%20on%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/529761/YouTube%20More%20Videos%20on%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Определяем язык пользователя
    const userLanguage = navigator.language.startsWith('ru') ? 'ru' : 'en';

    // Локализация
    const translations = {
        en: {
            menuCommand: 'Change number of videos',
            promptMessage: 'Enter the number of videos per row (e.g., 6, 8, 10):',
            invalidInput: 'Invalid input. Please enter a number.',
            successMessage: (count) => `Number of videos per row changed to ${count}. Reload the page.`,
            consoleLog: (count) => `Set to ${count} videos per row.`,
        },
        ru: {
            menuCommand: 'Изменить количество видео',
            promptMessage: 'Введите количество видео в ряду (например, 6, 8, 10):',
            invalidInput: 'Некорректное значение. Введите число.',
            successMessage: (count) => `Количество видео в ряду изменено на ${count}. Перезагрузите страницу.`,
            consoleLog: (count) => `Установлено ${count} видео в ряду.`,
        },
    };

    const t = translations[userLanguage];

    // Функция для настройки количества видео
    function setupVideoCount() {
        const currentCount = GM_getValue('videoCount', 6); // По умолчанию 6 видео в ряду
        const newCount = prompt(t.promptMessage, currentCount);

        if (newCount && !isNaN(newCount)) {
            GM_setValue('videoCount', parseInt(newCount, 10));
            alert(t.successMessage(newCount));
        } else {
            alert(t.invalidInput);
        }
    }

    // Регистрируем команду в меню Tampermonkey
    GM_registerMenuCommand(t.menuCommand, setupVideoCount);

    // Функция для оптимизации главной страницы YouTube
    function optimizeYouTube() {
        // Проверяем, что мы на главной странице
        if (!window.location.pathname.match(/^\/($|feed\/home)/)) return;

        const grid = document.querySelector('ytd-rich-grid-renderer');
        if (grid) {
            // Получаем количество видео из настроек
            const videoCount = GM_getValue('videoCount', 6);

            // Устанавливаем количество видео в строке
            grid.style.setProperty('--ytd-rich-grid-items-per-row', videoCount, 'important');
            grid.style.setProperty('--ytd-rich-grid-item-margin', '8px', 'important');

            // Ограничиваем количество загруженных видео (чтобы не лагало)
            let videos = grid.querySelectorAll('ytd-rich-item-renderer');
            if (videos.length > 200) { // Ограничение: максимум 60 видео
                for (let i = 200; i < videos.length; i++) {
                    videos[i].remove();
                }
            }

            console.log(t.consoleLog(videoCount));
        }
    }

    // Первоначальный запуск
    optimizeYouTube();

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(() => {
        optimizeYouTube();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();