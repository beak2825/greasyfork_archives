// ==UserScript==
// @name         LZT Market Steam RT Profile Checker
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Проверка профилей Steam на наличие определенного элемента и логирование результатов на странице LZT Market
// @author       ChatGPT
// @match        https://lzt.market/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506465/LZT%20Market%20Steam%20RT%20Profile%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/506465/LZT%20Market%20Steam%20RT%20Profile%20Checker.meta.js
// ==/UserScript==

if (window.location.href.match(/^https:\/\/lzt\.market\/\d+\/?$/)) {

(function() {
    'use strict';

    // Настройка для включения/отключения лога
    const logEnabled = true; // Установите false, чтобы отключить лог

    // Добавляем CSS для лога и флага КТ
    GM_addStyle(`
        #logDiv {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 400px;
            max-height: 300px;
            overflow-y: auto;
            background-color: black;
            color: white;
            font-size: 16px;
            padding: 10px;
            z-index: 9999;
        }
        .kt-message {
            color: red;
            font-size: 18px;
            font-weight: bold;
        }
        .kt-flag, .no-flag, .error-flag {
            display: inline-block;
            width: 65px; /* Устанавливаем одинаковую ширину */
            height: 50px; /* Устанавливаем одинаковую высоту */
            padding: 0; /* Убираем padding для точного размера */
            color: white;
            font-size: 20px; /* Увеличенный размер шрифта */
            font-weight: bold;
            border-radius: 5px;
            border: 2px solid #3a3a3a; /* Подобный стиль контейнеру */
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Тень для визуального соответствия */
            text-align: center;
            line-height: 50px; /* Центрирование текста по вертикали */
        }
        .kt-flag {
            background-color: rgb(136, 68, 68); /* Цвет для КТ (красный) */
        }
        .no-flag {
            background-color: rgb(34, 142, 93); /* Цвет для NO (зеленый) */
        }
        .error-flag {
            background-color: orange;
        }
    `);

    let logDiv;
    if (logEnabled) {
        // Создаем лог, если логирование включено
        logDiv = document.createElement('div');
        logDiv.id = 'logDiv';
        document.body.appendChild(logDiv);
    }

    function logMessage(message, isKT = false) {
        if (logEnabled) {
            const p = document.createElement('p');
            p.textContent = message;
            if (isKT) {
                p.classList.add('kt-message');
            }
            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight; // Автопрокрутка вниз
        }
    }

    // Функция для добавления флага справа от mainContainer
    function addFlag(flagType) {
        const mainContainer = document.querySelector('.mainContainer');
        if (mainContainer) {
            const flag = document.createElement('div');
            flag.className = flagType;
            if (flagType === 'kt-flag') {
                flag.textContent = 'KT';
            } else if (flagType === 'no-flag') {
                flag.textContent = 'NONONONONONONONONONONONONONONO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
            } else {
                flag.textContent = 'ER';
            }

            // Вставляем флаг рядом с контейнером
            mainContainer.style.position = 'relative';
            flag.style.position = 'absolute';
            flag.style.right = '-80px'; // Смещение на границу контейнера
            flag.style.top = '10px'; // Выравнивание по верху контейнера
            mainContainer.appendChild(flag);

            logMessage(`Флаг ${flag.textContent} добавлен.`);
        } else {
            logMessage('Не удалось найти контейнер для добавления флага.', true);
            addFlag('error-flag');
        }
    }

    // Ищем ссылку на профиль Steam
    const steamLinkElement = document.querySelector('div.contact.dark.wide .data');

    if (steamLinkElement) {
        const steamProfileUrl = steamLinkElement.textContent.trim();
        logMessage(`Найдена ссылка на профиль Steam: ${steamProfileUrl}`);

        // Открываем страницу профиля Steam в фоне
        GM_xmlhttpRequest({
            method: 'GET',
            url: steamProfileUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Ищем элемент на странице Steam
                    const element = doc.querySelector('div.responsive_count_link_area');

                    if (element) {
                        logMessage('Элемент найден на странице Steam.');
                        addFlag('no-flag'); // Обнаружен элемент, значит, NO
                    } else {
                        logMessage('Элемент не найден. Вероятно, аккаунт КТ.', true);
                        addFlag('kt-flag'); // Элемент не найден, значит, это КТ
                    }
                } else {
                    logMessage(`Ошибка при загрузке страницы Steam: ${response.status}`);
                    addFlag('error-flag'); // Ошибка загрузки страницы Steam
                }
            },
            onerror: function(error) {
                logMessage(`Ошибка запроса: ${error}`);
                addFlag('error-flag'); // Ошибка при запросе
            }
        });
    } else {
        logMessage('Ссылка на профиль Steam не найдена на странице.');
        addFlag('error-flag'); // Ссылка на профиль Steam не найдена
    }
})();
}
