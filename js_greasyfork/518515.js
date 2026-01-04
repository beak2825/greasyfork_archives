// ==UserScript==
// @name ! Кнопки для телефона by B.Soliev
// @match https://forum.blackrussia.online/*
// @version 1.3
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518515/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%20by%20BSoliev.user.js
// @updateURL https://update.greasyfork.org/scripts/518515/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%20by%20BSoliev.meta.js
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
    { text: 'РАЗДЕЛ 77', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kostroma.3429/', color: '#BF835C' },
    { text: 'ЖБ ТЕХ 77', link: 'https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3428/', color: '#BF835C' },
    { text: 'ИГРОКИ 77', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3449/', color: '#BF835C' },
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

