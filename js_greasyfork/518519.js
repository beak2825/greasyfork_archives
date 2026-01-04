// ==UserScript==
// @name ! Кнопки by ТЕЛ+ B.Soliev 
// @match https://forum.blackrussia.online/*
// @version 1.0.3
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518519/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20by%20%D0%A2%D0%95%D0%9B%2B%20BSoliev.user.js
// @updateURL https://update.greasyfork.org/scripts/518519/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20by%20%D0%A2%D0%95%D0%9B%2B%20BSoliev.meta.js
// ==/UserScript==



(function() {
    'use strict';

    console.log("Скрипт загружен");

    // Добавляем стили для кнопок и меню
    GM_addStyle(`
        .button-container {
            position: fixed;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
            z-index: 9999;
            display: none;
            flex-wrap: wrap; /* Позволяет кнопкам обтекать */
            justify-content: center; /* Центрируем кнопки по горизонтали */
            width: 300px; /* Ширина контейнера */
        }

        .custom-button {
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.2s;
            margin: 5px; /* Отступ между кнопками */
            width: calc(33.33% - 7px); /* Ширина кнопок для 3 в ряд с учетом отступов */
            text-align: center;
        }

        .custom-button:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }

        .menu-button, .open-forum-button {
            position: fixed;
            right: 20px;
            z-index: 9999;
            padding: 3px 10px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 120px;
        }

        .menu-button {
            top: 8px;
            background-color: #007bff;
        }

        .open-forum-button {
            top: 50px;
            background-color: #28a745;
        }
    `);

    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    document.body.appendChild(buttonContainer);

    // Массив с данными кнопок (текст, ссылки и цвет)
    const buttonsData = [
        { text: 'ЖБТ 21', link: 'https://forum.blackrussia.online/forums/Сервер-№21-chilli.1202/', color: '#ff0033' },
        { text: 'ТЕХ 21', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chilli.1007/', color: '#ff0033' },
        { text: 'ИГР 21', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.994/', color: '#ff0033' },
        
        { text: 'ЖБТ 22', link: 'https://forum.blackrussia.online/forums/Сервер-№22-choco.1203/', color: '#b4674d' },
        { text: 'ТЕХ 22', link: 'https://forum.blackrussia.online/forums/Технический-раздел-choco.1048/', color: '#b4674d' },
        { text: 'ИГР 22', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1036/', color: '#b4674d' },
        
        { text: 'ЖБТ 23', link: 'https://forum.blackrussia.online/forums/Сервер-№23-moscow.1204/', color: '#e06666' },
        { text: 'ТЕХ 23', link: 'https://forum.blackrussia.online/forums/Технический-раздел-moscow.1052/', color: '#e06666' },
        { text: 'ИГР 23', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1082/', color: '#e06666' },
        
        { text: 'ЖБТ 24', link: 'https://forum.blackrussia.online/forums/Сервер-№24-spb.1205/', color: '#11a6fa' },
        { text: 'ТЕХ 24', link: 'https://forum.blackrussia.online/forums/Технический-раздел-spb.1095/', color: '#11a6fa' },
        { text: 'ИГР 24', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/', color: '#11a6fa' },
        
        { text: 'ЖБТ 25', link: 'https://forum.blackrussia.online/forums/Сервер-№25-ufa.1206/', color: '#f1c232' },
        { text: 'ТЕХ 25', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ufa.1138/', color: '#f1c232' },
        { text: 'ИГР 25', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1167/', color: '#f1c232' },
        
        { text: 'ЖБТ 76', link: 'https://forum.blackrussia.online/forums/Сервер-№76-chita.3393/', color: '#35ca68' },
        { text: 'ТЕХ 76', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chita.3394/', color: '#35ca68' },
        { text: 'ИГР 76', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3414/', color: '#35ca68' },

        { text: 'ЖБТ 77', link: 'https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3428/', color: '#f1b10d' },
        { text: 'ТЕХ 77', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kostroma.3429/', color: '#f1b10d' },
        { text: 'ИГР 77', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3449/', color: '#f1b10d' },

        { text: 'ЖБТ 78', link: 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/', color: '#f58041' },
        { text: 'ТЕХ 78', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vladimir.3464/', color: '#f58041' },
        { text: 'ИГР 78', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/', color: '#f58041' },

        { text: 'ЖБТ 79', link: 'https://forum.blackrussia.online/forums/Сервер-№79-kaluga.3498/', color: '#3032a4' },
        { text: 'ТЕХ 79', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kaluga.3499/', color: '#3032a4' },
        { text: 'ИГР 79', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3519/', color: '#3032a4' },
        
        { text: 'ЖБТ 80', link: 'https://forum.blackrussia.online/forums/Сервер-№80-novgorod.3533/', color: '#ffc700' },
        { text: 'ТЕХ 80', link: 'https://forum.blackrussia.online/forums/Технический-раздел-novgorod.3535/', color: '#ffc700' },
        { text: 'ИГР 80', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3555/', color: '#ffc700' },
        
        
    ];

    // Функция для создания кнопок
    buttonsData.forEach((buttonData) => {
        const button = document.createElement('div');
        button.className = 'custom-button';
        button.innerHTML = buttonData.text;
        button.style.backgroundColor = buttonData.color;

        button.addEventListener('click', function() {
            window.location.href = buttonData.link;
        });

        buttonContainer.appendChild(button);
    });

    // Создаем кнопку меню
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = 'Меню';

    menuButton.addEventListener('click', function() {
        const isVisible = buttonContainer.style.display === 'flex';
        buttonContainer.style.display = isVisible ? 'none' : 'flex';
        console.log(isVisible ? "Контейнер скрыт" : "Контейнер показан");
    });

    document.body.appendChild(menuButton);
    console.log("Кнопка меню добавлена");

})();