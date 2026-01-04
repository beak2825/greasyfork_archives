// ==UserScript==
// @name ! Кнопки навигации by B.Soliev
// @match https://forum.blackrussia.online/*
// @version 1.5
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518118/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20by%20BSoliev.user.js
// @updateURL https://update.greasyfork.org/scripts/518118/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20by%20BSoliev.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // Добавляем стили для кнопок и часов
    GM_addStyle(`
        .button-container {
            position: fixed;
            left: 50%;
            top: 2px; /* Располагаем кнопки ниже часов */
            transform: translateX(-50%); /* Центрирование по горизонтали */
            z-index: 9999;
            display: flex; /* Используем flexbox для выравнивания кнопок */
            flex-direction: row; /* Горизонтальное расположение кнопок */
            justify-content: center; /* Центрируем кнопки по горизонтали */
        }

        .custom-button {
            color: white;
            padding: 8px 10px; /* Уменьшенные отступы для компактности */
            border: none;
            border-radius: 5px;
            z-index: 9999;
            font-size: 10px; /* Уменьшенный размер шрифта */
            cursor: pointer;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s; /* Плавный переход цвета фона */
            margin: 0 2px; /* Отступ между кнопками */
        }

        .custom-button:hover {
            opacity: 0.8; /* Прозрачность при наведении */
        }

        .clock {
            position: fixed;
            left: 10px; /* Располагаем часы на 10px от левой границы */
            bottom: 10px; /* Располагаем часы на 10px от нижней границы */
            z-index: 9999;
            color: red; /* Цвет текста часов */
            font-size: 30px; /* Размер шрифта часов */
            font-weight: bold; /* Жирный шрифт */
        }
    `);

    // Создаем элемент для часов
    const clockElement = document.createElement('div');
    clockElement.className = 'clock';
    document.body.appendChild(clockElement);

    // Функция для обновления часов
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.innerHTML = `${hours}:${minutes}:${seconds}`; // Обновляем текст часов
    }

    // Обновляем часы каждую секунду
    setInterval(updateClock, 1000);
    updateClock(); // Первоначальное обновление

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
        { text: 'ЛОГИ 21-25', link: 'https://logs.blackrussia.online/gslogs/', color: '#00FF00' }
    ];

    // Функция для создания кнопок
    buttonsData.forEach((buttonData) => {
        const button = document.createElement('div');
        button.className = 'custom-button';
        button.innerHTML = buttonData.text;
        button.style.backgroundColor = buttonData.color; // Устанавливаем цвет фона кнопки

        // Обработчик события нажатия на кнопку
        button.addEventListener('click', function() {
            if (buttonData.text === 'ЛОГИ 21-25') {
                window.open(buttonData.link, '_blank'); // Открываем ссылку в новом окне
            } else {
                window.location.href = buttonData.link; // Открываем ссылку в текущем окне
            }
        });

        // Добавляем кнопку в контейнер
        buttonContainer.appendChild(button);
    });
})();
