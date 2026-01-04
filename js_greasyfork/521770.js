// ==UserScript==
// @name         Место хакеров дравы
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Кнопка для просмотра видео с чертями под "Хорошо у нас в аду!"
// @author       minish
// @match        drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521770/%D0%9C%D0%B5%D1%81%D1%82%D0%BE%20%D1%85%D0%B0%D0%BA%D0%B5%D1%80%D0%BE%D0%B2%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521770/%D0%9C%D0%B5%D1%81%D1%82%D0%BE%20%D1%85%D0%B0%D0%BA%D0%B5%D1%80%D0%BE%D0%B2%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем кнопку
    const button = document.createElement('button');
    button.innerText = "Место хакеров дравы";
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#ff0000';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.zIndex = '1000';
    button.style.cursor = 'pointer';

    // Добавляем обработчик события нажатия на кнопку
    button.onclick = () => {
        const videoUrl = "https://www.youtube.com/embed/G_79EFFB9qs?autoplay=1&mute=0";
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '1001';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // Добавляем iframe с видео
        const iframe = document.createElement('iframe');
        iframe.width = '80%';
        iframe.height = '80%';
        iframe.src = videoUrl;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;

        modal.appendChild(iframe);
        document.body.appendChild(modal);

        // Закрытие модального окна при клике
        modal.onclick = () => {
            document.body.removeChild(modal);
        };
    };

    // Добавляем кнопку на страницу
    document.body.appendChild(button);
})();
