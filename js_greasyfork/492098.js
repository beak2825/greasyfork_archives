// ==UserScript==
// @name         ConvertInches1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Кнопка для перевода дробных размеров в инчи и см
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492098/ConvertInches1.user.js
// @updateURL https://update.greasyfork.org/scripts/492098/ConvertInches1.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
// Создаем элемент кнопки
const button = document.createElement("a");
 
// Устанавливаем атрибут href
button.href = "javascript:void(0)";
 
// Добавляем текст и классы кнопке
button.textContent = "⇑";
button.classList.add("convert-numbers-to-measure-btn", "btn", "btn-mini");
 
// Добавляем обработчик события click
button.addEventListener("click", function () {
    // Ваш код обработки события
    console.log("Кнопка нажата!");
 
    // Функция для конвертации дробных чисел в десятичные числа
    function convertFractionToDecimal(fraction) {
        const fractionParts = fraction.split(' ');
 
        let wholePart = 0;
        if (fractionParts[0]) {
            const wholePartParts = fractionParts[0].split('/').map(parseFloat);
            if (wholePartParts.length === 2) {
                wholePart = wholePartParts[0] / wholePartParts[1];
            } else {
                wholePart = parseFloat(fractionParts[0]) || 0;
            }
        }
 
        let decimalPart = 0;
        if (fractionParts[1]) {
            const [numerator, denominator] = fractionParts[1].split('/').map(parseFloat);
            if (numerator && denominator) {
                decimalPart = numerator / denominator;
            }
        }
 
        const decimalValue = wholePart + decimalPart;
        return isNaN(decimalValue) ? 0 : decimalValue;
    }
 
    // Определение функции для вычисления десятичных чисел из дробей в инпуте
    function calculateDecimalValueFromInput(inputName) {
        // Находим элемент input с указанным именем
        const inputElement = document.querySelector('.combo-value[name="' + inputName + '"]');
 
        if (inputElement) {
            const fraction = inputElement.value; // Получаем значение дроби из input
            const decimalValue = convertFractionToDecimal(fraction); // Вычисляем десятичное значение
            inputElement.value = decimalValue; // Устанавливаем десятичное значение в инпут
            return decimalValue;
        } else {
            return 0; // Возвращаем 0, если input не найден
        }
    }
 
    // Пример использования функции для обновления и конвертации значений
 
    // Вычисляем десятичные значения из ваших input элементов и устанавливаем их в инпуты
    const decimalValue1 = calculateDecimalValueFromInput('CurrentDepthInches');
    const decimalValue2 = calculateDecimalValueFromInput('CurrentWidthInches');
    const decimalValue3 = calculateDecimalValueFromInput('CurrentHeightInches');
    const decimalValue4 = calculateDecimalValueFromInput('CurrentCurveLengthInches');
 
    // Находим элемент кнопки по текстовому содержимому "⇑"
    const buttonsToClick = document.querySelectorAll('.convert-numbers-to-measure-btn');
 
    for (let i = 0; i < buttonsToClick.length; i++) {
        if (buttonsToClick[i].textContent === '⇑') {
            // Создаем инициирующее событие MouseEvent
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
 
            // Диспетчеризуем событие на кнопке
            buttonsToClick[i].dispatchEvent(clickEvent);
            break; // Выходим из цикла после выполнения клика
        }
    }
 
    // Если не нашли элемент с текстом "⇑"
    if (i === buttonsToClick.length) {
        console.error('Кнопка с текстом "⇑" не найдена');
    }
});
 
// Находим указанную ячейку таблицы
const targetCell = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(4)');
 
// Проверяем, найдена ли ячейка
if (targetCell) {
    // Вставляем кнопку внутрь ячейки
    targetCell.appendChild(button);
} else {
    console.error('Ячейка не найдена');
}
 
// Получаем стили из .label-for-measure
const labelForMeasureElement = document.querySelector('.label-for-measure');
const labelForMeasureStyles = getComputedStyle(labelForMeasureElement);
 
// Создаем новый элемент
const newElement = document.createElement('div');
newElement.className = 'label label-for-measure';
newElement.innerHTML = '/';
 
// Находим нужную ячейку и заменяем ее содержимое
const targetCellForNewElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(3)');
targetCellForNewElement.innerHTML = '';
targetCellForNewElement.appendChild(newElement);
 
})();