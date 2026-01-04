// ==UserScript==
// @name         LELU Twitch aware Video Inverter
// @version      1.1.2
// @description  Changes the appearance of the Twitch video stream to its normal state
// @author       Gullampis810
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        *://*.twitch.tv/*
// @match        *://twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/594536
// @downloadURL https://update.greasyfork.org/scripts/516523/LELU%20Twitch%20aware%20Video%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/516523/LELU%20Twitch%20aware%20Video%20Inverter.meta.js
// ==/UserScript==

// Добавляем CSS для кнопки инверсии
function addCSS() {
    const css = `
        .invert-button {
            background-color: #603b9100;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
            position: absolute;
            right: 10px;
            bottom: 50px;
            z-index: 9999;
        }
        .invert-button:hover {
            color: #ac93ce;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Функция для инверсии и поворота видео
function toggleInvert() {
    const video = document.querySelector("video");
    if (video) {
        const style = video.style;
        style.transform = style.transform ? '' : 'rotate(180deg)';
        style.filter = style.filter ? '' : 'invert(1)';
    }
}

// Функция для добавления кнопки инверсии в плеер Twitch
function addInvertButtonToTwitch() {
    const video = document.querySelector('video');
    if (!video) return;

    // Находим контейнер для кнопок управления
    const controls = document.querySelector('.player-controls__right-control-group');
    if (!controls) return;

    // Проверяем, есть ли уже такая кнопка
    if (document.querySelector('.invert-button')) return;

    // Создаем кнопку инверсии
    const button = document.createElement('button');
    button.className = 'invert-button';
    button.title = 'Invert the video screen';

    // Создаем элемент изображения
    const img = document.createElement('img');
    img.src = 'https://github.com/sopernik566/icons/blob/main/ULELU.png?raw=true'; // ссылка на изображение
    img.alt = 'Invert Icon';  // Атрибут alt для изображения
    img.style.width = '24px';  // Размер изображения
    img.style.height = '24px'; // Размер изображения

    // Вставляем изображение в кнопку
    button.appendChild(img);

    // Добавляем обработчик кликов
    button.addEventListener('click', toggleInvert);

    // Добавляем кнопку в панель управления Twitch
    controls.appendChild(button);
}

// Запускаем добавление CSS и кнопки после загрузки контента
window.addEventListener('DOMContentLoaded', () => {
    addCSS();
    addInvertButtonToTwitch();
});

// Для динамических страниц с видео (например, Twitch)
const observer = new MutationObserver(() => {
    addInvertButtonToTwitch();
});
observer.observe(document.body, { childList: true, subtree: true });
