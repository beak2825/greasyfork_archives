// ==UserScript==
// @name         DTF Avatar Zoom
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Zoom user avatars on dtf.ru
// @author       Avicenna
// @match        https://dtf.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528175/DTF%20Avatar%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/528175/DTF%20Avatar%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания увеличенного медиа (изображение или видео)
    function createZoomedMedia(src, isVideo) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.cursor = 'zoom-out';

        let mediaElement;
        if (isVideo) {
            mediaElement = document.createElement('video');
            mediaElement.src = src;
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.controls = true; // Добавляем элементы управления для видео
            mediaElement.style.maxWidth = '90%';
            mediaElement.style.maxHeight = '90%';
            mediaElement.style.borderRadius = '8px';
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = src;
            mediaElement.style.maxWidth = '90%';
            mediaElement.style.maxHeight = '90%';
            mediaElement.style.borderRadius = '8px';
        }

        overlay.appendChild(mediaElement);
        document.body.appendChild(overlay);

        // Закрытие при клике на оверлей
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // Обработчик клика на аватарку
    function handleAvatarClick(event) {
        const avatarLink = event.target.closest('a.author__avatar');
        if (avatarLink) {
            event.preventDefault(); // Отменяем стандартное действие (переход по ссылке)
            event.stopPropagation(); // Останавливаем всплытие события

            // Сохраняем оригинальные атрибуты и содержимое ссылки
            const originalHref = avatarLink.href;
            const originalRouterLink = avatarLink.getAttribute('data-router-link');
            const originalGtmClick = avatarLink.getAttribute('data-gtm-click');
            const originalInnerHTML = avatarLink.innerHTML;

            // Временно заменяем ссылку на span
            const span = document.createElement('span');
            span.innerHTML = originalInnerHTML;
            avatarLink.parentNode.replaceChild(span, avatarLink);

            // Проверяем, является ли аватарка видео
            const video = span.querySelector('video');
            const img = span.querySelector('img');

            if (video) {
                // Если это видео, используем его src
                const src = video.src.replace('/scale_crop/', '/'); // Убираем параметры масштабирования
                createZoomedMedia(src, true);
            } else if (img) {
                // Если это изображение, используем его src
                const src = img.src.replace('/scale_crop/', '/'); // Убираем параметры масштабирования
                createZoomedMedia(src, false);
            }

            // Восстанавливаем ссылку после небольшой задержки
            setTimeout(() => {
                span.parentNode.replaceChild(avatarLink, span);
                avatarLink.href = originalHref;
                avatarLink.setAttribute('data-router-link', originalRouterLink);
                avatarLink.setAttribute('data-gtm-click', originalGtmClick);
                avatarLink.innerHTML = originalInnerHTML;
            }, 100); // 100 мс достаточно для предотвращения перехода
        }
    }

    // Добавляем обработчик клика на все аватарки
    document.addEventListener('click', handleAvatarClick);
    document.addEventListener('mousedown', handleAvatarClick);

    // Дополнительно отключаем переход по ссылке через контекстное меню
    document.addEventListener('contextmenu', handleAvatarClick);
})();