// ==UserScript==
// @name         YouTube - Фикс Изображений + Квадратные аватарки
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Делает аватары квадратными везде, включая Главную страницу и Рекомендации, а также восстанавливает иконки YouTube
// @match        *://*.youtube.com/*
// @grant        none
// @author       https://t.me/aisingers
// @source       https://t.me/aisingers
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503342/YouTube%20-%20%D0%A4%D0%B8%D0%BA%D1%81%20%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20%2B%20%D0%9A%D0%B2%D0%B0%D0%B4%D1%80%D0%B0%D1%82%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/503342/YouTube%20-%20%D0%A4%D0%B8%D0%BA%D1%81%20%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20%2B%20%D0%9A%D0%B2%D0%B0%D0%B4%D1%80%D0%B0%D1%82%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const AVATAR_SELECTORS = [
        'yt-img-shadow#avatar img', // Аватары в разделах "Подписки"
        '#guide-content yt-img-shadow img', // Аватары в боковом меню
        '#comments yt-img-shadow img', // Аватары в комментариях
        'ytd-video-owner-renderer yt-img-shadow img', // Аватар автора видео
        'ytd-channel-renderer yt-img-shadow img', // Аватары в результатах поиска каналов
        'ytd-comment-renderer #img', // Аватары в комментариях (дополнительный селектор)
        'ytd-comment-thread-renderer #author-thumbnail img', // Дополнительный селектор для комментариев
        'ytd-rich-item-renderer #avatar-link yt-img-shadow img', // Аватары на главной странице
        'ytd-rich-grid-media #avatar img', // Аватары на главной странице (дополнительный селектор)
        'ytd-video-renderer #img', // Аватары в рекомендациях и других списках видео
        'img[src^="https://yt3.ggpht.com/"]' // Общий селектор для всех аватаров YouTube
    ];

    function redirectImageURL(url) {
        return url.replace(/^https:\/\/yt3\.ggpht\.com\//, 'https://yt4.ggpht.com/');
    }

    function applySquareStyle(element) {
        element.style.borderRadius = '4px';
        element.style.overflow = 'hidden';
        let img = element.querySelector('img') || element;
        img.style.borderRadius = '4px';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
    }

    function processAvatars() {
        AVATAR_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.src && element.src.includes('yt3.ggpht.com')) {
                    element.src = redirectImageURL(element.src);
                }
                let target = element.closest('yt-img-shadow') || element;
                applySquareStyle(target);
                // Применяем стили к родительскому элементу для дополнительной гарантии
                if (target.parentElement) {
                    target.parentElement.style.borderRadius = '4px';
                }
            });
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    processAvatars();
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Инициализация
    processAvatars();
    observeDOMChanges();

    // Обработка динамически загружаемого контента
    window.addEventListener('yt-navigate-finish', processAvatars);

    // Дополнительная обработка для гарантии применения стилей
    setInterval(processAvatars, 1000);
})();