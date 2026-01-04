// ==UserScript==
// @name         4chan Post Enhancer
// @namespace    4chan Post Enhancer
// @version      1.0
// @description  Меняет дизайн ответов постов на 2ch, исправляет код который позволяет перевести сообщения Google Translate
// @author       Maesta_Nequitia
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @grant        GM_addStyle
// @icon         https://www.4chan.org/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487066/4chan%20Post%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/487066/4chan%20Post%20Enhancer.meta.js
// ==/UserScript==

GM_addStyle(`
    .translate-preview {
        position: absolute;
        padding: 10px;
        font-size: 13px;
        color: black !important;
        z-index: 1000; /* Измените это значение на более высокий, если необходимо */
    }

    .translate-preview img {
        max-width: 100%;
        height: auto;
    }
`);

(function() {
    'use strict';

    // Функция для добавления translate preview
    function addTranslatePreviewOnHover(replyLink) {
        replyLink.addEventListener('mouseenter', function() {
            const previewBlock = document.createElement('div');
            previewBlock.classList.add('translate-preview');

            const postId = replyLink.getAttribute('href').replace('#p', '');
            const repliedPost = document.getElementById('p' + postId);
            const repliedPostMessage = repliedPost ? repliedPost.querySelector('.postMessage') : null;

            if (repliedPostMessage) {
                const clonedPost = repliedPost.cloneNode(true);
                const images = clonedPost.querySelectorAll('.fileThumb img');
                images.forEach(image => {
                    const imageUrl = image.parentElement.getAttribute('href');
                    image.src = imageUrl.replace('//', 'https://');
                });
                previewBlock.appendChild(clonedPost);
            }

            replyLink.appendChild(previewBlock);
        });

        replyLink.addEventListener('mouseleave', function() {
            const previewBlock = replyLink.querySelector('.translate-preview');
            if (previewBlock) {
                previewBlock.remove();
            }
        });
    }

    // Функция для проверки наличия класса "translated-ltr" в корневом элементе
    function checkForTranslationClass() {
        const htmlElement = document.documentElement;
        if (htmlElement.classList.contains('translated-ltr')) {
            // Если класс найден, начинаем добавлять translate preview
            const replyLinks = document.querySelectorAll('.backlink a');
            replyLinks.forEach(replyLink => {
                addTranslatePreviewOnHover(replyLink);
            });
            // Отключаем наблюдение, так как нам не нужно больше отслеживать изменения
            observer.disconnect();
        }
    }

    // Настройка MutationObserver для отслеживания изменений в структуре документа
    const observer = new MutationObserver(checkForTranslationClass);

    // Начинаем отслеживание изменений в атрибутах корневого элемента
    observer.observe(document.documentElement, { attributes: true });

    // Изменение дизайна постов на 4chan
    // Находим все элементы с классом .post на странице
    var postElements = document.querySelectorAll('.post');

    // Проходимся по каждому посту
    postElements.forEach(function(postElement) {
        // Находим блок с классом .backlink внутри .postInfo.desktop
        var backlinkElement = postElement.querySelector('.postInfo.desktop .backlink');

        // Если блок найден, перемещаем его внутрь .post
        if (backlinkElement) {
            postElement.appendChild(backlinkElement);
        }
    });
})();
