// ==UserScript==
// @name         LZT Mass Upload Helper
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Автоматизация вставки данных на странице lzt.market/mass-upload/steam/start с логом действий и ошибок. Независимый от регистра поиск.
// @author       steamuser
// @match        https://lzt.market/mass-upload/steam/start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505902/LZT%20Mass%20Upload%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/505902/LZT%20Mass%20Upload%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем небольшое окно для ввода данных
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px';  // 100px ниже верхнего угла
    container.style.right = '10px';
    container.style.padding = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.zIndex = '1000';
    container.style.width = '300px';

    let textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 40;
    textarea.placeholder = 'Введите строки в формате login:pass:email:pass';
    container.appendChild(textarea);

    let button = document.createElement('button');
    button.textContent = 'Запустить скрипт';
    container.appendChild(button);

    // Создаем лог действий
    let logContainer = document.createElement('div');
    logContainer.style.marginTop = '10px';
    logContainer.style.maxHeight = '200px';
    logContainer.style.overflowY = 'auto';
    logContainer.style.borderTop = '1px solid #ccc';
    logContainer.style.paddingTop = '10px';
    logContainer.style.fontSize = '12px';
    logContainer.style.color = '#333';
    container.appendChild(logContainer);

    function logMessage(message, isError = false) {
        let logEntry = document.createElement('div');
        logEntry.textContent = message;
        logEntry.style.color = isError ? 'red' : 'black';
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;  // Прокрутка вниз
    }

    document.body.appendChild(container);

    // Функция для поиска и вставки данных
    button.addEventListener('click', function() {
        logMessage('Начало выполнения скрипта...');
        let lines = textarea.value.split('\n').map(line => line.trim());

        if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
            logMessage('Ошибка: Введены пустые строки.', true);
            return;
        }

        // Ищем все элементы с классом block_result_group
        let groups = document.querySelectorAll('.block_result_group');

        if (groups.length === 0) {
            logMessage('Ошибка: Не найдены элементы с классом block_result_group.', true);
            return;
        }

        groups.forEach((group, index) => {
            // Ищем элемент с классом block_result_header-title и CookieTitle
            let titleElement = group.querySelector('.block_result_header-title.CookieTitle');

            if (titleElement) {
                // Получаем текст, ищем нужную часть
                let titleText = titleElement.textContent.trim().toLowerCase(); // Приводим к нижнему регистру
                let match = titleText.match(/\/([^\.]+)\./i); // Добавлен флаг "i" для игнорирования регистра

                if (match) {
                    let login = match[1];
                    logMessage(`Обработка элемента ${index + 1}: найден login ${login}`);

                    // Ищем строку, которая начинается с нужного логина (независимо от регистра)
                    let foundLine = lines.find(line => line.toLowerCase().startsWith(login.toLowerCase()));

                    if (foundLine) {
                        // Вставляем найденную строку в input
                        let inputElement = group.querySelector('input.textCtrl[placeholder="login:pass:email:pass"]');

                        if (inputElement) {
                            inputElement.value = foundLine;

                            // Триггерим события input и change
                            let inputEvent = new Event('input', { bubbles: true });
                            inputElement.dispatchEvent(inputEvent);

                            let changeEvent = new Event('change', { bubbles: true });
                            inputElement.dispatchEvent(changeEvent);

                            // Попробуем имитировать ввод через клавиатуру
                            inputElement.focus();
                            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
                            inputElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 }));
                            inputElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 13 }));

                            logMessage(`Успешно вставлено: ${foundLine}`);
                        } else {
                            logMessage(`Ошибка: Не найден input для элемента ${index + 1}`, true);
                        }
                    } else {
                        logMessage(`Ошибка: Строка с login ${login} не найдена в введенных данных.`, true);
                    }
                } else {
                    logMessage(`Ошибка: Не удалось извлечь login из элемента ${index + 1}.`, true);
                }
            } else {
                logMessage(`Ошибка: Не найден элемент с классом .block_result_header-title.CookieTitle для группы ${index + 1}`, true);
            }
        });

        logMessage('Завершение выполнения скрипта.');
    });
})();
