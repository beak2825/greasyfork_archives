// ==UserScript==
// @name ! Кнопки тел 16-20
// @match https://forum.blackrussia.online/*
// @version 1.1
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/519710/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%82%D0%B5%D0%BB%2016-20.user.js
// @updateURL https://update.greasyfork.org/scripts/519710/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D1%82%D0%B5%D0%BB%2016-20.meta.js
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
    { text: 'ТЕХ 16', link: 'https://forum.blackrussia.online/forums/Технический-раздел-azure.701/', color: '#3097FF' },
    { text: 'ЖБТ 16', link: 'https://forum.blackrussia.online/forums/Сервер-№16-azure.1197/', color: '#3097FF' },
    { text: 'ИГР 16', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.723/', color: '#3097FF' },

    { text: 'ТЕХ 17', link: 'https://forum.blackrussia.online/forums/Технический-раздел-platinum.757/', color: '#868480' },
    { text: 'ЖБТ 17', link: 'https://forum.blackrussia.online/forums/Сервер-№17-platinum.1198/', color: '#868480' },
    { text: 'ИГР 17', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.785/', color: '#868480' },

    { text: 'ТЕХ 18', link: 'https://forum.blackrussia.online/forums/Технический-раздел-aqua.815/', color: '#0DEDED' },
    { text: 'ЖБТ 18', link: 'https://forum.blackrussia.online/forums/Сервер-№18-aqua.1199/', color: '#0DEDED' },
    { text: 'ИГР 18', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.844/', color: '#0DEDED' },

    { text: 'ТЕХ 19', link: 'https://forum.blackrussia.online/forums/Технический-раздел-gray.857/', color: '#C7C2C1' },
    { text: 'ЖБТ 19', link: 'https://forum.blackrussia.online/forums/Сервер-№19-gray.1200/', color: '#C7C2C1' },
    { text: 'ИГР 19', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.885/', color: '#C7C2C1' },

    { text: 'ТЕХ 20', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ice.925/', color: '#B6F1FE' },
    { text: 'ЖБТ 20', link: 'https://forum.blackrussia.online/forums/Сервер-№20-ice.1201/', color: '#B6F1FE' },
    { text: 'ИГР 20', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.954/', color: '#B6F1FE' },
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