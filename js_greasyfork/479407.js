// ==UserScript==
// @name         ConvertInches
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Кнопка для перевода дробных размеров в инчи и см
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479407/ConvertInches.user.js
// @updateURL https://update.greasyfork.org/scripts/479407/ConvertInches.meta.js
// ==/UserScript==

(function() {
    'use strict';
/// Создаем элемент кнопки
const button = document.createElement("a");

// Устанавливаем атрибут href
button.href = "javascript:void(0)";

// Добавляем текст и классы кнопке
button.textContent = "⇑";
button.classList.add("convert-numbers-to-measure-btn", "btn", "btn-mini");

// Добавляем обработчик события click
button.addEventListener("click", function () {
    console.log("Кнопка нажата!");

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

    function calculateDecimalValueFromInput(inputName) {
        const inputElement = document.querySelector('.combo-value[name="' + inputName + '"]');

        if (inputElement) {
            const fraction = inputElement.value;
            const decimalValue = convertFractionToDecimal(fraction);
            inputElement.value = decimalValue;
            return decimalValue;
        } else {
            return 0;
        }
    }

    function updateInputsAndClickButton() {
        const decimalValue1 = calculateDecimalValueFromInput('CurrentDepthInches');
        const decimalValue2 = calculateDecimalValueFromInput('CurrentWidthInches');
        const decimalValue3 = calculateDecimalValueFromInput('CurrentHeightInches');
        const decimalValue4 = calculateDecimalValueFromInput('CurrentCurveLengthInches');

        // Находим элемент кнопки по текстовому содержимому "⇑"
        const buttonsToClick = document.querySelectorAll('.convert-numbers-to-measure-btn');

        for (let i = 0; i < buttonsToClick.length; i++) {
            if (buttonsToClick[i].textContent === '⇑') {
                // Устанавливаем класс для активации кнопки
                buttonsToClick[i].classList.add('convert-numbers-to-measure-btn-active');

                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                buttonsToClick[i].dispatchEvent(clickEvent);
                break;
            }
        }
    }

    // Устанавливаем значение 0 в CurrentFixedSizeInches
    const fixedSizeElement = document.querySelector('input.combo-value[name="CurrentFixedSizeInches"]');
    if (fixedSizeElement) {
        fixedSizeElement.focus();
        fixedSizeElement.value = '0';

        const inputEvent = new Event('input', { bubbles: true });
        fixedSizeElement.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        fixedSizeElement.dispatchEvent(changeEvent);

        console.log('Значение установлено и события отправлены');

        // Запускаем обновление инпутов и клик по кнопке
        setTimeout(updateInputsAndClickButton, 500); // Подождите 500 мс, чтобы обеспечить обработку событий
    } else {
        console.error('Элемент CurrentFixedSizeInches не найден');
    }
});

// Добавление кнопки в DOM
const targetCell = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(4)');

if (targetCell) {
    targetCell.appendChild(button);
    console.log('Кнопка добавлена в ячейку');
} else {
    console.error('Ячейка не найдена');
}

// Изменение элемента
const labelForMeasureElement = document.querySelector('.label-for-measure');
const labelForMeasureStyles = getComputedStyle(labelForMeasureElement);

const newElement = document.createElement('div');
newElement.className = 'label label-for-measure';
newElement.innerHTML = '/';

const targetCellForNewElement = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(3)');
targetCellForNewElement.innerHTML = '';
targetCellForNewElement.appendChild(newElement);


})();