// ==UserScript==
// @name         Кнопка копирования для YouTube, ВКонтакте, vkvideo.ru и Rutube
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Добавляет кнопку для копирования текста с названием видео на YouTube, ВКонтакте, vkvideo.ru и Rutube
// @author       Ваше Имя
// @match        https://www.youtube.com/watch*
// @match        https://vk.com/*
// @match        https://vkvideo.ru/*
// @match        https://rutube.ru/*
// @match        https://youtu.be/*
// @match        https://www.kinopoisk.ru/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519284/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20YouTube%2C%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%2C%20vkvideoru%20%D0%B8%20Rutube.user.js
// @updateURL https://update.greasyfork.org/scripts/519284/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20YouTube%2C%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%2C%20vkvideoru%20%D0%B8%20Rutube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для добавления кнопки на YouTube
    function addCopyButtonYouTube() {
        const titleElement = document.querySelector('h1.style-scope.ytd-watch-metadata yt-formatted-string');

        if (titleElement && !document.querySelector('#copy-button-youtube')) {
            const button = document.createElement('button');
            button.id = 'copy-button-youtube';
            button.textContent = 'Копировать';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#cc0000';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const textToCopy = `Смотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc`;
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            });

            titleElement.parentNode.appendChild(button);
        }
    }

    // Функция для добавления кнопки на ВКонтакте
    function addCopyButtonVK() {
        const titleElement = document.querySelector('.mv_title_wrap .mv_title');

        if (titleElement && !document.querySelector('#copy-button-vk')) {
            const button = document.createElement('button');
            button.id = 'copy-button-vk';
            button.textContent = 'Копировать';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#4c75b5';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const videoUrl = window.location.href;  // Получаем текущий URL страницы
                const textToCopy = `Смотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc`;
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            });

            titleElement.parentNode.appendChild(button);
        }
    }

    // Функция для добавления кнопки на vkvideo.ru
    function addCopyButtonVKVideo() {
        const titleElement = document.querySelector('div[data-testid="video_modal_title"]');

        if (titleElement && !document.querySelector('#copy-button-vkvideo')) {
            const button = document.createElement('button');
            button.id = 'copy-button-vkvideo';
            button.textContent = 'Копировать';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#4c75b5';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const videoUrl = window.location.href;  // Получаем текущий URL страницы
                const textToCopy = `Смотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc`;
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            });

            titleElement.parentNode.appendChild(button);
        }
    }

    // Функция для добавления кнопки на Rutube
    function addCopyButtonRutube() {
        const titleElement = document.querySelector('.video-pageinfo-container-module__videoTitleSectionHeader');

        if (titleElement && !document.querySelector('#copy-button-rutube')) {
            const button = document.createElement('button');
            button.id = 'copy-button-rutube';
            button.textContent = 'Копировать';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#009d89';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const textToCopy = `Смотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc`;
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            });

            titleElement.parentNode.appendChild(button);
        }
    }

    // Функция для добавления кнопки на Kinopoisk
    function addCopyButtonKinopoisk() {
    // Находим заголовок фильма или сериала
    const titleElement = document.querySelector('h1[data-tid="f22e0093"] span');
    const yearElement = document.querySelector('.styles_years__s0WWl');

    if (titleElement && !document.querySelector('#copy-button-kinopoisk')) {
        // Получаем год, если он существует
        const year = yearElement ? yearElement.textContent.trim() : 'Неизвестно';

        // Извлекаем текст названия фильма/сериала
        const videoTitle = titleElement.textContent.trim();

        // Проверяем, содержится ли уже год в названии (например, "1997 – 1998")
        const titleWithYearRegex = /\(\d{4}(?: – \d{4})?\)/;
        const titleHasYear = titleWithYearRegex.test(videoTitle);

        // Если год не указан в названии, добавляем его
        const finalTitle = titleHasYear ? videoTitle : `${videoTitle} (${year})`;

        // Создаем кнопку
        const button = document.createElement('button');
        button.id = 'copy-button-kinopoisk';
        button.textContent = 'Копировать';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4e8e2b';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';

        // Обработчик для кнопки
        button.addEventListener('click', () => {
            // Формируем текст с годом, если это сериал
            const textToCopy = `${finalTitle} - https://live.vkvideo.ru/grpzdc\n\${finalTitle} - https://live.vkvideo.ru/grpzdc\n\${finalTitle} - https://live.vkvideo.ru/grpzdc`;

            // Пытаемся скопировать в буфер обмена
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('Ссылка скопирована');
            }).catch(err => {
                console.error('Ошибка копирования:', err);
            });
        });

        // Добавляем кнопку в DOM
        titleElement.parentNode.appendChild(button);
    }
}

    // Функция для добавления кнопки на vkvideo.ru для видео с внешними ссылками
    function addCopyButtonVKVideoExt() {
        const titleElement = document.querySelector('.videoplayer_title .videoplayer_title_link');

        if (titleElement && !document.querySelector('#copy-button-vkvideo-ext')) {
            const button = document.createElement('button');
            button.id = 'copy-button-vkvideo-ext';
            button.textContent = 'Копировать';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#4c75b5';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const videoUrl = window.location.href;  // Получаем текущий URL страницы
                const textToCopy = `Смотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc\nСмотрим *${videoTitle}* - https://live.vkvideo.ru/grpzdc`;
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Ошибка копирования:', err);
                });
            });

            titleElement.parentNode.appendChild(button);
        }
    }

    // Наблюдатели для всех платформ
    const observerYouTube = new MutationObserver(addCopyButtonYouTube);
    observerYouTube.observe(document.body, { childList: true, subtree: true });

    const observerVK = new MutationObserver(addCopyButtonVK);
    observerVK.observe(document.body, { childList: true, subtree: true });

    const observerVKVideo = new MutationObserver(addCopyButtonVKVideo);
    observerVKVideo.observe(document.body, { childList: true, subtree: true });

    const observerRutube = new MutationObserver(addCopyButtonRutube);
    observerRutube.observe(document.body, { childList: true, subtree: true });

    const observerKinopoisk = new MutationObserver(addCopyButtonKinopoisk);
    observerKinopoisk.observe(document.body, { childList: true, subtree: true });


    if (window.location.hostname.includes('vk.com')) {
        addStreamLinkButtonVK();
        addCopyButtonVK();
    }

    if (window.location.hostname.includes('vkvideo.ru')) {
        addStreamLinkButtonVK();
        addCopyButtonVK();
    }

    // Инициализация кнопок при загрузке страницы
    if (window.location.hostname.includes('youtube.com')) {
        addCopyButtonYouTube();
    }

    if (window.location.hostname.includes('vk.com')) {
        addCopyButtonVK();
    }

    if (window.location.hostname.includes('vkvideo.ru')) {
        addCopyButtonVKVideo();
    }

    if (window.location.hostname.includes('rutube.ru')) {
        addCopyButtonRutube();
    }
    if (window.location.hostname.includes('kinopoisk.ru')) {
        addCopyButtonKinopoisk();
    }
    if (window.location.hostname.includes('vkvideo.ru') && window.location.href.includes('video_ext.php?')) {
        addCopyButtonVKVideoExt();
}
})();
