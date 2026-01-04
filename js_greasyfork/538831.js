// ==UserScript==
// @name         Iwara Video Downloader & Opener
// @namespace    https://iwara.tv/
// @version      2.0
// @description  Получает прямую ссылку на видео с iwara.tv и предоставляет кнопки для скачивания и открытия.
// @match        https://iwara.tv/video/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/538831/Iwara%20Video%20Downloader%20%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/538831/Iwara%20Video%20Downloader%20%20Opener.meta.js
// ==/UserScript==

// ==UserScript==

(function() {
    'use strict';

    // Задержка перед поиском видео, чтобы пропустить рекламные видео
    const initialDelay = 5000; // 5 секунд

    setTimeout(() => {
        const waitForVideo = setInterval(() => {
            const videoElement = document.querySelector("video");
            // Проверяем, что видеоэлемент существует и у него есть src, начинающийся с 'http'
            if (videoElement && videoElement.src && videoElement.src.startsWith('http')) {
                clearInterval(waitForVideo);

                const videoSrc = videoElement.src;
                // Очищаем заголовок от недопустимых символов для имени файла
                const title = document.title.replace(/[^\w\d\-_. ]/g, '').replace(/\s+/g, '_');
                const filename = title + '.mp4'; // Предполагаем MP4

                // Контейнер для кнопок
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.top = '10px';
                container.style.right = '10px';
                container.style.background = 'rgba(0,0,0,0.85)';
                container.style.padding = '10px';
                container.style.borderRadius = '8px';
                container.style.zIndex = '9999';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '8px'; // Расстояние между кнопками

                // --- Кнопка "Скачать видео" ---
                const downloadButton = document.createElement('a');
                downloadButton.href = videoSrc;
                downloadButton.download = filename; // Этот атрибут заставляет браузер скачивать файл
                downloadButton.textContent = '⬇️ Скачать видео';
                downloadButton.style.cssText = `
                    color: #fff;
                    background-color: #007bff;
                    text-decoration: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-family: sans-serif;
                    text-align: center;
                    cursor: pointer;
                    display: block;
                `;
                container.appendChild(downloadButton);


                // --- Кнопка "Открыть в новой вкладке" ---
                const openButton = document.createElement('a');
                openButton.href = videoSrc;
                openButton.target = '_blank'; // Открывает ссылку в новой вкладке
                openButton.rel = 'noopener noreferrer'; // Рекомендуется для target="_blank"
                openButton.textContent = '↗️ Открыть видео';
                openButton.style.cssText = `
                    color: #fff;
                    background-color: #28a745;
                    text-decoration: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-family: sans-serif;
                    text-align: center;
                    cursor: pointer;
                    display: block;
                `;
                container.appendChild(openButton);

                document.body.appendChild(container);

            } else if (videoElement && !videoElement.src) {
                // Если videoElement существует, но src пуст или невалиден,
                // возможно, видео загружается динамически.
                // В этом случае можно попробовать подождать еще, или вывести сообщение.
                // Для Iwara.tv, обычно src появляется достаточно быстро.
                // Если очень долго не появляется, можно увеличить setInterval
                // или добавить таймаут для clearInterval.
            }
        }, 1000); // Проверяем каждую секунду после начальной задержки
    }, initialDelay); // Начальная задержка 5 секунд
})();
