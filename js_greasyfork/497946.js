// ==UserScript==
// @name         Size comparison
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Сomparison of sizes on the main task page
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497946/Size%20comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/497946/Size%20comparison.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Регулярное выражение для проверки формата "число x число x число"
    const dimensionRegex = /\b\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\b/g;

    // Функция для проверки содержимого ячейки на наличие размеров и выделения зелёным цветом
    function highlightDimensionsInCell(cell) {
        const textContent = cell.textContent.trim();
        const matches = textContent.match(dimensionRegex);
        if (matches && matches.length > 0) {
            // Выделяем зелёным цветом и добавляем атрибут данных
            cell.style.color = 'green';
            cell.setAttribute('data-dimensions', textContent);
        }
    }

    // Функция для сравнения размеров в строке и изменения цвета на красный при несоответствии
    function compareRowDimensions(row) {
        let dimensions = [];

        // Находим все ячейки в текущей строке с размерами
        row.querySelectorAll('[data-dimensions]').forEach(cell => {
            dimensions.push(cell.getAttribute('data-dimensions'));
            // Сбрасываем цвет выделения
            cell.style.color = '';
        });

        // Сравниваем размеры
        if (dimensions.length > 1) {
            const firstSize = dimensions[0];
            const allSame = dimensions.every(size => size === firstSize);
            // Если все размеры одинаковы, выделяем зелёным цветом
            if (allSame) {
                row.querySelectorAll('[data-dimensions]').forEach(cell => {
                    cell.style.color = 'green';
                });
            } else {
                // Иначе меняем цвет на красный
                row.querySelectorAll('[data-dimensions]').forEach(cell => {
                    cell.style.color = 'red';
                });
            }
        }
    }

    // Функция для запуска скрипта с задержкой
    function runScriptWithDelay() {
        // Находим все таблицы на странице
        document.querySelectorAll('table').forEach(table => {
            // Находим все строки в текущей таблице
            table.querySelectorAll('tr').forEach(row => {
                // Находим все ячейки в текущей строке
                row.querySelectorAll('td, th').forEach(cell => {
                    // Проверяем содержимое ячейки на наличие размеров и выделяем зелёным цветом
                    highlightDimensionsInCell(cell);
                });

                // Сравниваем размеры в текущей строке и меняем цвет при необходимости
                compareRowDimensions(row);
            });
        });
    }

    // Запускаем скрипт с задержкой 5 секунд после загрузки страницы
    setTimeout(runScriptWithDelay, 5000);

})();