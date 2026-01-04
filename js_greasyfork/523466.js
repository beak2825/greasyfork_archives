// ==UserScript==
// @name         MPP Image Support
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MIT
// @description  поддержка изображений для Multiplayer Piano.
// @author       gtnntg
// @match        https://multiplayerpiano.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523466/MPP%20Image%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/523466/MPP%20Image%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки, является ли ссылка изображением
    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    // Функция для обработки сообщений
    function processMessages() {
        // Находим все элементы <li>, которые еще не обработаны
        const messages = document.querySelectorAll('li:not([data-processed="true"])');

        messages.forEach(message => {
            const textElement = message.querySelector('.message');
            if (!textElement) return; // Если текстового элемента нет, пропускаем

            const content = textElement.textContent; // Получаем текст сообщения

            // Проверяем, содержит ли текст тег [img="url"]
            const imgTagRegex = /\[img="(.*?)"\]/;
            const match = content.match(imgTagRegex);

            if (match) {
                const url = match[1]; // Получаем URL из тега
                if (isImageUrl(url)) {
                    // Создаем контейнер для изображения
                    const imgContainer = document.createElement('div');
                    imgContainer.style.marginTop = '10px';

                    // Создаем элемент <img>
                    const imgElement = document.createElement('img');
                    imgElement.src = url;
                    imgElement.alt = "Image";
                    imgElement.style.maxWidth = "300px";
                    imgElement.style.maxHeight = "300px";
                    imgElement.style.display = "block";

                    // Добавляем изображение в контейнер
                    imgContainer.appendChild(imgElement);

                    // Удаляем оригинальное текстовое сообщение
                    textElement.remove();

                    // Добавляем изображение в сообщение (в начало)
                    message.appendChild(imgContainer);

                    // Перемещаем контейнер с изображением в конец <li>
                    message.appendChild(imgContainer);
                }
            }

            // Помечаем сообщение как обработанное
            message.setAttribute('data-processed', 'true');
        });
    }

    // Автоматическая обработка новых сообщений
    const observer = new MutationObserver(() => {
        processMessages(); // Запускаем обработку при добавлении новых сообщений
    });

    // Наблюдаем за изменениями в основном контейнере чата
    const chatContainer = document.querySelector('#chat'); // Укажи ID или класс контейнера чата
    if (chatContainer) {
        observer.observe(chatContainer, { childList: true, subtree: true });
        console.log("Tampermonkey скрипт для корректного размещения изображений активирован.");
    }
})();