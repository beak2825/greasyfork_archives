// ==UserScript==
// @name         Highlight Gender Cells with Gradient
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight cells with specific gender values using gradient effect
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494439/Highlight%20Gender%20Cells%20with%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/494439/Highlight%20Gender%20Cells%20with%20Gradient.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для добавления стилей
    function addGradientStyle(gender, color) {
        GM_addStyle(`
            td.highlight-${gender} {
                background: linear-gradient(to right, ${color}, transparent); // Градиентный фон
                background-clip: text; // Определение области для фона
                -webkit-background-clip: text; // Для браузеров на основе Webkit (например, Chrome, Safari)
                color: transparent; // Делаем текст прозрачным, чтобы виден был градиент
            }
        `);
    }

    // Добавляем стили для разных значений гендера
    addGradientStyle('female', 'pink'); // Для Female - розовый
    addGradientStyle('male', 'blue'); // Для Male - синий
    addGradientStyle('unisex', 'purple'); // Для Unisex - фиолетовый
    addGradientStyle('infant', 'green'); // Для Infant - зелёный

    // Находим все ячейки с разными значениями гендера и применяем к ним соответствующие классы подсветки
    var cells = document.querySelectorAll('td');

    cells.forEach(function(cell) {
        var gender = cell.textContent.trim().toLowerCase();
        if (gender === "female" || gender === "male" || gender === "unisex" || gender === "infant") {
            cell.classList.add(`highlight-${gender}`);
        }
    });
})();
