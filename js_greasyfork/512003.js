// ==UserScript==
// @name         CVAT - Fast Add Polygon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  fast add polygon
// @author       Nikitin
// @match        https://app.cvat.ai/tasks/*/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cvat.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512003/CVAT%20-%20Fast%20Add%20Polygon.user.js
// @updateURL https://update.greasyfork.org/scripts/512003/CVAT%20-%20Fast%20Add%20Polygon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переменная для задержки (в миллисекундах)
const delay = 10;

// Функция для эмуляции события нажатия клавиши
function simulateKeyPress(element, key) {
    const keydownEvent = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(keyupEvent);
}

// Функция для открытия списка и выбора лейбла по индексу
function openDropdownAndSelectLabel(index) {
    console.log('Попытка нажать на иконку для рисования полигона...');
    const polygonControlIcon = document.querySelector('.anticon.cvat-draw-polygon-control');
    if (polygonControlIcon) {
        polygonControlIcon.click();
        console.log('Иконка для рисования полигона нажата.');

        setTimeout(() => {
            console.log('Проверяем наличие формы...');
            const container = document.querySelector('.ant-popover-inner-content .cvat-draw-shape-popover-content');
            if (container) {
                console.log('Форма найдена:', container);

                const inputElement = container.querySelector('input.ant-select-selection-search-input');
                if (inputElement) {
                    console.log('Input найден:', inputElement);
                    inputElement.focus();
                    inputElement.click();
                    simulateKeyPress(inputElement, 'a');
                    console.log('Эмуляция нажатия клавиши для открытия выпадающего списка выполнена.');

                    setTimeout(() => {
                        console.log('Проверяем наличие лейблов...');
                        const labels = document.querySelectorAll('.ant-select-item-option');
                        if (labels && labels.length > 0) {
                            console.log(`Найдено ${labels.length} лейблов.`);
                            if (labels[index]) {
                                console.log(`Кликаем на лейбл с индексом ${index}:`, labels[index]);
                                labels[index].click();

                                setTimeout(() => {
                                    console.log('Поиск кнопки Shape...');
                                    const shapeButton = document.querySelector('.cvat-draw-polygon-shape-button');
                                    if (shapeButton) {
                                        shapeButton.click();
                                        console.log('Кнопка Shape нажата.');
                                    } else {
                                        console.log('Кнопка Shape не найдена.');
                                    }
                                }, delay);
                            } else {
                                console.log(`Лейбл с индексом ${index} не найден.`);
                            }
                        } else {
                            console.log('Лейблы не найдены. Возможно, выпадающий список не открылся.');
                        }
                    }, delay);
                } else {
                    console.log('Input внутри формы не найден. Проверьте структуру DOM.');
                }
            } else {
                console.log('Контейнер с формой не найден.');
            }
        }, delay);
    } else {
        console.log('Иконка для рисования полигона не найдена.');
    }
}

// Обработка нажатия клавиш NUM и блокировка их стандартного поведения
document.addEventListener('keydown', (event) => {
    if (event.code.startsWith('Numpad')) {
        const numKey = event.code.replace('Numpad', ''); // Получаем цифру из названия клавиши, например 'Numpad1' -> '1'
        const index = parseInt(numKey); // Преобразуем в число

        if (!isNaN(index) && index >= 0 && index <= 9) {
            openDropdownAndSelectLabel(index); // Вызов функции с нужным индексом
            event.preventDefault(); // Блокируем стандартное поведение NUM клавиш
            console.log(`Вызвана функция для индекса ${index}.`);
        }
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const doneButton = document.querySelector('.cvat-annotation-header-done-button');
        if (doneButton) {
            doneButton.click();
            console.log('Кнопка Done нажата.');
        } else {
            console.log('Кнопка Done не найдена.');
        }
    }
});

})();