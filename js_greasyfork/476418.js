// ==UserScript==
// @name         Изменение цвета элементов страницы
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Позволяет настраивать цвет различных элементов страницы
// @author       Вырезано
// @match        https://logs.blackrussia.online/gslogs/20/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476418/%D0%98%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/476418/%D0%98%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Получаем сохраненные значения цветов из хранилища Tampermonkey
    const storedColors = GM_getValue('customPageColors', {
        Текст: '#000000',
        Фон: '#ffffff',
        Шапка: '#ffffff',
        ФонТ: '#ffffff'
    });

    // Создаем выпадающий список для выбора элемента
    const selectElement = document.createElement('select');
    selectElement.style.marginRight = '10px';
    selectElement.style.marginLeft = '10px';
        selectElement.style.borderRadius = '20px';
        selectElement.style.border = '1px solid #fff';
        selectElement.style.background = '#222';
        selectElement.style.color = '#fff';
        selectElement.style.fontSize = '18px';
        selectElement.style.textAlign = 'center';
        selectElement.style.padding = '4px';

    // Определяем доступные элементы для изменения цвета
    const elements = ['Текст', 'Фон', 'Шапка', 'ФонТ'];

    // Заполняем выпадающий список элементами
    elements.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.text = element.toUpperCase();
        selectElement.appendChild(option);
    });

    // Создаем элемент выбора цвета
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.marginRight = '10px';
    colorPicker.style.marginLeft = '10px';
        colorPicker.style.border = '1px solid #fff';
        colorPicker.style.background = '#222';
        colorPicker.style.color = '#fff';
        colorPicker.style.fontSize = '18px';
        colorPicker.style.textAlign = 'center';
        colorPicker.style.padding = '4px';

    // Вставляем выпадающий список и элемент выбора цвета на страницу перед указанным элементом
    const navbar = document.querySelector('.badge.bg-success');
    navbar.parentElement.insertBefore(selectElement, navbar);
    navbar.parentElement.insertBefore(colorPicker, navbar);

    // Применяем сохраненные цвета к элементам при загрузке скрипта
    applyColors();

    // Обработчик изменения значения выпадающего списка
    selectElement.addEventListener('change', function() {
        const selectedElement = selectElement.value;
        const selectedColor = storedColors[selectedElement];
        colorPicker.value = selectedColor;
    });

    // Обработчик изменения значения цвета
    colorPicker.addEventListener('input', function() {
        const selectedElement = selectElement.value;
        const selectedColor = colorPicker.value;
        storedColors[selectedElement] = selectedColor;
        GM_setValue('customPageColors', storedColors);
        applyColors();
    });

    // Применяем сохраненные цвета к элементам страницы
    function applyColors() {
        const { Текст, Фон, Шапка, ФонТ } = storedColors;
        GM_addStyle(`h1, h2, h3, h4, h5, h6 { color: ${Текст} !important; }`);
        GM_addStyle(`body { background-color: ${Фон} !important; }`);
        GM_addStyle(`#site-navbar { background-color: ${Шапка} !important; }`);
        GM_addStyle(`#log-table[data-v-2d76ca92]>:not(caption)>*>*, .table>:not(caption)>*>* { background-color: ${ФонТ} !important; }`);
    }
})();
