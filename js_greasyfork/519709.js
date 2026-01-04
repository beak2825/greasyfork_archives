// ==UserScript==
// @name ! Кнопки для телефона 16-20
// @match https://forum.blackrussia.online/*
// @version 1.1
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/519709/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%2016-20.user.js
// @updateURL https://update.greasyfork.org/scripts/519709/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%2016-20.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log("Скрипт загружен"); // Проверка загрузки скрипта
 
    // Добавляем стили для кнопок и меню
    GM_addStyle(`
        .button-container {
            position: fixed;
            left: 50%;
            top: 50px; /* Располагаем кнопки ниже меню */
            transform: translateX(-50%); /* Центрирование по горизонтали */
            z-index: 9999;
            display: none; /* Скрываем контейнер кнопок по умолчанию */
            flex-direction: row; /* Горизонтальное расположение кнопок */
            justify-content: center; /* Центрируем кнопки по горизонтали */
            transition: opacity 0.3s ease; /* Плавный переход для видимости */
            margin: 8px; /* Отступ между кнопками */
}
 
            transition: opacity 0.3s ease; /* Плавный переход для видимости */
        }
 
        .custom-button {
            color: white;
            padding: 5px 10px; /* Уменьшенные отступы для удобства */
            border: none;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px; /* Размер шрифта */
            cursor: pointer;
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.2s; /* Плавный переход цвета фона и трансформации */
            margin: 10px; /* Отступ между кнопками */
            display: inline-block; /* Позволяет кнопке подстраиваться под размер текста */
            text-align: center; /* Центрируем текст внутри кнопки */
 
}
 
 
 
        }
 
        .custom-button:hover {
            opacity: 0.8; /* Прозрачность при наведении */
            transform: scale(1.05); /* Увеличение при наведении */
        }
 
        .menu-button {
            position: fixed;
            right: 20px; /* Располагаем кнопку меню справа */
            top: 8px; /* Располагаем кнопку меню чуть выше */
            z-index: 9999;
            padding: 3px 10px; /* Уменьшенные отступы для кнопки меню */
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px; /* Закругленные углы */
            cursor: pointer;
            font-size: 14px; /* Уменьшенный размер шрифта кнопки меню */
            width: 120px; /* Автоширина для кнопки меню */
        }
 
        .open-forum-button {
            position: fixed;
            right: 20px; /* Располагаем кнопку "Открыть форум" рядом с кнопкой меню */
            top: 8px; /* Располагаем кнопку чуть выше */
            z-index: 9999;
            padding: 3px 10px; /* Уменьшенные отступы для кнопки "Открыть форум" */
            background-color: #28a745; /* Цвет фона для кнопки "Открыть форум" */
            color: white;
            border: none;
            border-radius: 5px; /* Закругленные углы */
            cursor: pointer;
            font-size: 14px; /* Размер шрифта кнопки "Открыть форум" */
            width: auto; /* Автоширина для кнопки "Открыть форум" */
        }
    `);
 
    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    document.body.appendChild(buttonContainer);
 
    // Массив с данными кнопок (текст, ссылки и цвет)
    const buttonsData = [
    { text: 'РАЗДЕЛ 16', link: 'https://forum.blackrussia.online/forums/Технический-раздел-azure.701/', color: '#3097FF' },
    { text: 'ЖБ ТЕХ 16', link: 'https://forum.blackrussia.online/forums/Сервер-№16-azure.1197/', color: '#3097FF' },
    { text: 'ИГРОКИ 16', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.723/', color: '#3097FF' },

    { text: 'РАЗДЕЛ 17', link: 'https://forum.blackrussia.online/forums/Технический-раздел-platinum.757/', color: '#868480' },
    { text: 'ЖБ ТЕХ 17', link: 'https://forum.blackrussia.online/forums/Сервер-№17-platinum.1198/', color: '#868480' },
    { text: 'ИГРОКИ 17', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.785/', color: '#868480' },

    { text: 'РАЗДЕЛ 18', link: 'https://forum.blackrussia.online/forums/Технический-раздел-aqua.815/', color: '#0DEDED' },
    { text: 'ЖБ ТЕХ 18', link: 'https://forum.blackrussia.online/forums/Сервер-№18-aqua.1199/', color: '#0DEDED' },
    { text: 'ИГРОКИ 18', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.844/', color: '#0DEDED' },

    { text: 'РАЗДЕЛ 19', link: 'https://forum.blackrussia.online/forums/Технический-раздел-gray.857/', color: '#C7C2C1' },
    { text: 'ЖБ ТЕХ 19', link: 'https://forum.blackrussia.online/forums/Сервер-№19-gray.1200/', color: '#C7C2C1' },
    { text: 'ИГРОКИ 19', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.885/', color: '#C7C2C1' },

    { text: 'РАЗДЕЛ 20', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ice.925/', color: '#B6F1FE' },
    { text: 'ЖБ ТЕХ 20', link: 'https://forum.blackrussia.online/forums/Сервер-№20-ice.1201/', color: '#B6F1FE' },
    { text: 'ИГРОКИ 20', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.954/', color: '#B6F1FE' },
    ];
 
    // Функция для создания кнопок
    buttonsData.forEach((buttonData) => {
        const button = document.createElement('div');
        button.className = 'custom-button';
        button.innerHTML = buttonData.text;
        button.style.backgroundColor = buttonData.color; // Устанавливаем цвет фона кнопки
        button.setAttribute('aria-label', buttonData.text); // Добавляем атрибут для доступности
 
        // Обработчик события нажатия на кнопку
        button.addEventListener('click', function() {
            window.location.href = buttonData.link; // Открываем ссылку в том же окне
        });
 
        // Добавляем кнопку в контейнер
        buttonContainer.appendChild(button);
    });
 
    // Создаем кнопку меню
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = 'Меню'; // Текст кнопки меню
 
    // Обработчик события нажатия на кнопку меню
    menuButton.addEventListener('click', function() {
        const isVisible = buttonContainer.style.display === 'flex';
        buttonContainer.style.display = isVisible ? 'none' : 'flex'; // Переключаем видимость контейнера
        console.log(isVisible ? "Контейнер скрыт" : "Контейнер показан"); // Логируем состояние
    });
 
    // Добавляем кнопку меню на страницу
    document.body.appendChild(menuButton);
 
 
        // Добавляем кнопку меню на страницу
    document.body.appendChild(menuButton);
    console.log("Кнопка меню добавлена"); // Проверка добавления кнопки меню
 
})();
 