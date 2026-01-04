// ==UserScript==
// @name         VK Image Blur for Specific Users
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Blurs images from specific users in VK conversations and removes blur on hover
// @author       antowkas
// @match        https://vk.com/im*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521285/VK%20Image%20Blur%20for%20Specific%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/521285/VK%20Image%20Blur%20for%20Specific%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Задайте список имен пользователей, чьи изображения нужно размыть
    const targetNames = ["Дима Михайлов", "ミリフ 遺構"];

    function blurImagesForUsers() {
        // Находим все сообщения в истории беседы
        const messages = document.querySelectorAll('.ConvoHistory__dateStack section');

        messages.forEach(message => {
            // Находим имя отправителя сообщения
            const authorElement = message.querySelector('.ConvoMessageHeader__authorLink .PeerTitle__title');
            if (authorElement && targetNames.includes(authorElement.textContent.trim())) {
                // Находим все изображения в сообщении и применяем к ним blur
                const images = message.querySelectorAll('img.PhotoItem__img, img.ReImage__img');
                images.forEach(img => {
                    img.style.filter = 'blur(10px)'; // Применяем размытие

                    // Добавляем обработчики событий для наведения и ухода курсора
                    img.addEventListener('mouseenter', () => {
                        img.style.filter = 'none'; // Убираем размытие при наведении
                    });

                    img.addEventListener('mouseleave', () => {
                        img.style.filter = 'blur(10px)'; // Возвращаем размытие при уходе курсора
                    });
                });
            }
        });
    }

    // Выполняем функцию сразу после загрузки страницы
    window.addEventListener('load', blurImagesForUsers);

    // Также добавляем наблюдатель за изменениями в DOM, чтобы обрабатывать новые сообщения
    const observer = new MutationObserver(blurImagesForUsers);
    observer.observe(document.body, { childList: true, subtree: true });

})();