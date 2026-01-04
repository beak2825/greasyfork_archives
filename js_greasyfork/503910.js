// ==UserScript==
// @name         Forum Enhancement
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  Enhance forum UI with animations and effects
// @match        https://lolz.live/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503910/Forum%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/503910/Forum%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Основные стили
    GM_addStyle(`
        /* Основные категории */
        .nodeTitle {
            transition: background-color 0.3s ease, color 0.3s ease, border-bottom 0.3s ease;
            position: relative;
            padding-bottom: 2px;
            border-bottom: 2px solid transparent;
        }

        .nodeTitle:hover,
        .nodeTitle.active {
            background-color: rgba(0, 186, 120, 0.1);
            color: rgb(0, 186, 120);
            border-bottom: 2px solid rgb(0, 186, 120);
        }

        /* Плавное изменение цвета текста подкатегорий при наведении */
        .node {
            transition: color 0.3s ease;
        }

        .node:hover {
            color: rgb(0, 186, 120);
        }

        .nodeTitle.active ~ .node {
            color: rgb(0, 186, 120);
        }

        /* Стиль для стрелки */
        .node .nodeTitle .expandSubForumList {
            position: absolute;
            right: 7px;
            top: 2px;
            font-size: 16px;
            z-index: 5;
            color: rgb(82, 80, 80);
            width: 30px;
            text-align: center;
            line-height: 32px;
            height: 32px;
            opacity: 0;
            transition: .2s;
        }

        /* Отображение стрелки при наведении на блок */
        .node:hover .nodeTitle .expandSubForumList,
        .nodeTitle.active .expandSubForumList {
            opacity: 1;
        }

        /* Стили для кнопки "Создать тему" */
        .CreateThreadButton {
            display: inline-block;
            background-color: rgb(34, 142, 93); /* Цвет кнопки */
            color: white;
            font-size: 13px; /* Размер шрифта */
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
            line-height: 34px; /* Высота строки для центрирования текста */
            border-radius: 8px;
            height: 34px; /* Высота кнопки */
            border: none; /* Убираем границу, если она есть */
            padding: 0; /* Убираем padding */
        }

        .CreateThreadButton:hover {
            background-color: rgb(26, 114, 67); /* Темный оттенок вашего цвета */
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .CreateThreadButton::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
            transition: transform 0.5s ease;
            z-index: 1;
            transform: translateX(-100%);
        }

        .CreateThreadButton:hover::before {
            transform: translateX(100%);
        }

        .CreateThreadButton span {
            position: relative;
            z-index: 2;
        }

        /* Стили для иконки лайка */
        .LikeLink {
            position: relative;
            display: inline-block;
        }

        .LikeLink .icon.like2Icon {
            fill: rgb(140, 140, 140);
            transition: fill 0.3s ease, transform 0.2s ease;
        }

        .LikeLink:hover .icon.like2Icon {
            transform: scale(1.2);
        }

        .LikeLink:active .icon.like2Icon {
            transform: scale(0.9);
            animation: confetti 0.6s ease forwards;
        }

        @keyframes confetti {
            0% {
                fill: rgb(140, 140, 140);
            }
            50% {
                fill: rgb(34, 142, 93);
                transform: scale(1.2);
            }
            100% {
                fill: rgb(34, 142, 93);
                transform: scale(1);
            }
        }

        /* Стили для иконки счетчика лайков */
        .likeCounterIcon {
            fill: rgb(140, 140, 140); /* Цвет по умолчанию */
            transition: fill 0.3s ease, transform 0.2s ease;
            position: relative;
            display: inline-block;
        }

        .likeCounterIcon:hover {
            transform: scale(1.2);
        }

        .likeCounterIcon:active {
            transform: scale(0.9);
            animation: confetti 0.6s ease forwards;
        }

        /* Стили для логотипа */
        #lzt-logo {
            display: inline-block;
            transition: transform 0.2s ease;
        }

        #lzt-logo:active {
            transform: scale(0.95);
        }

        /* Стили для сообщения Redirect */
        .redirect-message {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 186, 120, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            display: none;
            z-index: 9999;
            display: flex;
            align-items: center;
        }

        .redirect-message .loading-bar {
            margin-left: 10px;
            border: 2px solid white;
            border-radius: 5px;
            width: 100px;
            height: 6px;
            position: relative;
            overflow: hidden;
        }

        .redirect-message .loading-bar::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            height: 100%;
            width: 100%;
            background-color: white;
            animation: loading-bar 2s linear infinite;
        }

        @keyframes loading-bar {
            0% {
                left: -100%;
            }
            50% {
                left: 0;
            }
            100% {
                left: 100%;
            }
        }

        /* Анимация тележки */
        .cart-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background-image: url('https://lzt.market/styles/market/logo_by_DaWeed_X_KASTE.svg');
            background-size: cover;
            animation: moveCart 1s ease-in-out infinite;
        }

        @keyframes moveCart {
            0% {
                transform: translateX(-50px);
            }
            50% {
                transform: translateX(10px);
            }
            100% {
                transform: translateX(-50px);
            }
        }
    `);

    // Функция для отображения сообщения Redirect
    function showRedirectMessage(redirectUrl, showCart = false) {
        const message = document.createElement('div');
        message.className = 'redirect-message';
        message.innerHTML = `
            Redirecting...
            <div class="loading-bar"></div>
            ${showCart ? '<div class="cart-animation"></div>' : ''}
        `;
        document.body.appendChild(message);
        message.style.display = 'flex';

        // Перенаправление через короткую задержку, чтобы сообщение успело отобразиться
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 300); // Задержка 300 мс
    }

    // Обработчик для клика на ссылку "Маркет"
    document.querySelector('a[href="https://lzt.market"]').addEventListener('click', function(event) {
        event.preventDefault(); // Отменяем стандартное действие перехода по ссылке
        showRedirectMessage('https://lzt.market', true); // Показываем сообщение с анимацией тележки
    });

          // Восстановление прежнего кода для логотипа
        document.getElementById('lzt-logo').addEventListener('click', function(event) {
            event.preventDefault(); // Отменяем стандартное действие перехода по ссылке
            showRedirectMessage('https://lolz.live/'); // Показываем сообщение без анимации тележки
        });
})();
