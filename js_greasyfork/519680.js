// ==UserScript==
// @name         Redash Reference Items
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redash Reference Items link
// @author       You
// @match        *://tngadmin.triplenext.net/Admin/Gadget*
// @match        *://tngunix.westus.cloudapp.azure.com/*

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519680/Redash%20Reference%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/519680/Redash%20Reference%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для добавления ссылки в каждую строку таблицы
    function addLinksToRows() {
        const rows = document.querySelectorAll('body > div.container.notification > table > tbody > tr');

        rows.forEach((row) => {
            const cell = row.querySelector('td:nth-child(10)');
            if (cell) {
                // Получаем ссылку из первого элемента <a>
                const editLink = row.querySelector('a:nth-child(1)');
                if (editLink) {
                    // Извлекаем номер из href (например, 4548 из "/Admin/Gadget/Edit/4548")
                    const match = editLink.href.match(/\/Admin\/Gadget\/Edit\/(\d+)/);
                    if (match && match[1]) {
                        const rowIndex = match[1]; // Это и будет значение для ссылки

                        // Создаем элемент для добавления разделителя " | "
                        const separator = document.createElement('span');
                        separator.textContent = ' | ';

                        // Создаем новую ссылку
                        const link = document.createElement('a');
                        link.href = `http://tngunix.westus.cloudapp.azure.com/queries/109?p_Reference%20Items%20id=${rowIndex}&p_CompareModeName=All`;
                        link.target = "_blank";  // Открывать в новой вкладке
                        link.innerHTML = 'Redash';

                        // Добавляем разделитель и ссылку в ячейку
                        cell.appendChild(separator);
                        cell.appendChild(link);
                    }
                }
            }
        });
    }

    // Функция для добавления ссылки в legend
    function addLinkToLegend() {
        const legend = document.querySelector('#form-save > fieldset > legend');
        if (legend) {
            // Извлекаем rowIndex из текущего URL
            const match = window.location.href.match(/\/Admin\/Gadget\/Edit\/(\d+)/);
            if (match && match[1]) {
                const rowIndex = match[1];

                // Создаем элемент для добавления разделителя " | "
                const separator = document.createElement('span');
                separator.textContent = ' | ';

                // Создаем новую ссылку
                const link = document.createElement('a');
                link.href = `http://tngunix.westus.cloudapp.azure.com/queries/109?p_Reference%20Items%20id=${rowIndex}&p_CompareModeName=All`;
                link.target = "_blank";  // Открывать в новой вкладке
                link.innerHTML = 'Redash';

                // Добавляем разделитель и ссылку в legend
                legend.appendChild(separator);
                legend.appendChild(link);
            }
        }
    }

    // Функция для клика на кнопку на другой странице
    function clickButtonOnOtherPage() {
        const buttonSelector = 'body > section > app-view > div > div > main > div > div.bottom-controller-container > div > div:nth-child(4) > button';

        const waitForButton = setInterval(() => {
            const button = document.querySelector(buttonSelector);
            if (button) {
                button.click();
                clearInterval(waitForButton); // Останавливаем таймер после клика
            }
        }, 500); // Проверяем каждые 500 мс
    }

    // Запускаем функции
    addLinksToRows();
    addLinkToLegend();

    // Обновляем таблицу при динамическом изменении содержимого
    const observer = new MutationObserver(addLinksToRows);
    const table = document.querySelector('body > div.container.notification > table');
    if (table) {
        observer.observe(table, { childList: true, subtree: true });
    }

    // Запускаем функцию клика для другой страницы
    clickButtonOnOtherPage();
})();
