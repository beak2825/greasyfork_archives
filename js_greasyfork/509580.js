// ==UserScript==
// @name         Скачивание гуда с масс загрузки лолза
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скачивание гуда с масс загрузки посредством кнопки 
// @author       You
// @match        https://lzt.market/mass-upload/*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509580/%D0%A1%D0%BA%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%83%D0%B4%D0%B0%20%D1%81%20%D0%BC%D0%B0%D1%81%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8%20%D0%BB%D0%BE%D0%BB%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/509580/%D0%A1%D0%BA%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B3%D1%83%D0%B4%D0%B0%20%D1%81%20%D0%BC%D0%B0%D1%81%D1%81%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8%20%D0%BB%D0%BE%D0%BB%D0%B7%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем, существует ли элемент с id="MarketRecheckForm"
    const recheckForm = document.getElementById('MarketRecheckForm');
    if (!recheckForm) return;

    // Создаем новую кнопку
    const button = document.createElement('button');
    button.innerText = 'LINK';
    button.style.backgroundColor = 'rgb(0,146,100)'; // Более тёмный цвет
    button.style.width = '50px';
    button.style.height = '34px';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '6px'; // Закругление углов

    // Добавляем кнопку после блока с классом "mn-15-0-0 buttons_block_control"
    const buttonBlock = document.querySelector('.mn-15-0-0.buttons_block_control');
    if (buttonBlock) {
        buttonBlock.appendChild(button);
    }

    // Функция для генерации файла
    button.addEventListener('click', () => {
        // Получаем ID страницы из URL
        const pageId = window.location.pathname.split('/').filter(Boolean).pop();

        // Создаем массив для хранения всех ссылок
        const links = [];

        // Ищем все элементы с классом "account checked valid"
        const validAccounts = document.querySelectorAll('.account.checked.valid');

        validAccounts.forEach(account => {
            // Находим элемент <span> с классом "AccountStatus"
            const accountStatus = account.querySelector('.AccountStatus a');
            if (accountStatus) {
                // Добавляем ссылку в массив
                links.push(accountStatus.href);
            }
        });

        // Создаем текст файла
        const fileContent = links.join('\n');

        // Создаем файл и инициируем его скачивание
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mass-upload-${pageId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
})();
