// ==UserScript==
// @name         Proxy.php
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Enhance forum UI with animations and effects
// @match        https://zelenka.guru/proxy.php*
// @match        https://lolz.live/proxy.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504406/Proxyphp.user.js
// @updateURL https://update.greasyfork.org/scripts/504406/Proxyphp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
        /* Фоновое видео */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7); /* Затемнение фона */
            z-index: -1; /* Фон за всем контентом */
        }

        /* Фоновое видео как отдельный элемент */
        body > .background-video {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -2; /* Под затемнением */
        }

        .pageContent {
            background: transparent; /* Убираем задний фон */
        }

        .sectionMain {
            background: rgba(0, 0, 0, 0.3); /* Полупрозрачный черный фон */
            border-radius: 10px;

            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px); /* Эффект стеклянного фона */
            color: #fff; /* Белый текст */
            max-width: 600px; /* Ограничение ширины для удобства чтения */
            margin: auto; /* Центрирование по горизонтали */
        }

        .primaryContent p {
            margin: 0;

            color: #EA4C4C; /* Красный цвет для заголовка */
            font-weight: 600;
            font-size: 15px;
            line-height: 22px;
            text-align: center; /* Выравнивание текста по центру */
        }

        .primaryContent p + p {
            margin-top: 1em;
            color: #fff; /* Белый цвет для основного текста */
            text-align: center; /* Выравнивание текста по центру */
        }

        .secondaryContent {
            text-align: center;
            margin-top: 1em;
        }

        .button.primary.redirect {
            display: inline-block;
            background: #13d17f; /* зел фон */
            color: #fff; /* Белый текст */

            border-radius: 5px;
            text-decoration: none;
            font-size: 15px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
        }

        .button.primary.redirect:hover {
            background: #d43f3f; /* Темнее при наведении */
            transform: scale(1.05); /* Легкое увеличение при наведении */


        }

        .button.primary.redirect:active {
            background: #d43f3f; /* Темнее при наведении */
            transform: scale(0.98); /* Легкое увеличение при наведении */


        }

         .primaryContent, .secondaryContent {

        background: none;


    `);

    // Add the video element dynamically
    const video = document.createElement('video');
    video.className = 'background-video';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.src = 'https://static.vecteezy.com/system/resources/previews/034/701/024/mp4/simple-and-elegant-dark-minimal-background-cloud-or-smoke-texture-on-black-background-free-video.mp4';
    document.body.appendChild(video);
})();
