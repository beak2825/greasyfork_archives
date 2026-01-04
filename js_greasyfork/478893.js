// ==UserScript==
// @name         Comments and BP
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Для упрощения установки комментариев и отправки продуктов в бп + кнопка полной закраски продукта
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478893/Comments%20and%20BP.user.js
// @updateURL https://update.greasyfork.org/scripts/478893/Comments%20and%20BP.meta.js
// ==/UserScript==

(function() {
    'use strict';

///////////////////////////////////////////////// Восстановление состояния видимости элементов при загрузке страницы
window.addEventListener('load', function() {
    const buttonsVisibility = localStorage.getItem('buttonsVisibility');
    if (buttonsVisibility === 'hidden') {
        // Скрыть все элементы и кнопки, созданные данным скриптом
        const elementsAndButtonsToHide = document.querySelectorAll('.created-by-script');
        elementsAndButtonsToHide.forEach(function(element) {
            element.style.display = 'none';
        });
        // Скрываем кнопку "Скрыть все элементы" и отображаем кнопку "Показать скрытые элементы"
        hideElementsButton.style.display = 'none';
        showHiddenElementsButton.style.display = 'block';
    }
});
///////////////////////////////////////////////// Создание кнопки
function createButton(text, id, top, comment, selectId) {
    let button = document.createElement('button');
    button.classList.add('created-by-script');
    button.textContent = text;
    button.type = 'button';
    button.id = id;
    button.style.position = 'fixed';
    button.style.top = top;
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.width = '130px';
    button.style.height = '25px';
    button.style.textAlign = 'center';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = 'transparent';
    button.style.color = 'black';
    button.style.padding = '1px 0';
    button.style.fontSize = '10px';
    button.style.cursor = 'pointer';
///////////////////////////////////////////////// Функция для двойного клика
function performCommonActions() {
    let imageElement = document.querySelector(".box-item-image-holder > img[src*='yrulermgr.triplenext.net//Admin/comparebag/image?retailer']");
    if (imageElement) {
        imageElement.click();
        imageElement.click();

        let thumbnailElement = document.querySelector("#thumbs > ul > li > a.thumb > img");
        if (thumbnailElement) {
            let doubleClickEvent = new MouseEvent("dblclick", {
                bubbles: true,
                cancelable: true,
                view: window
            });
            thumbnailElement.dispatchEvent(doubleClickEvent);
        } else {
            console.error("Элемент с миниатюрой изображения не найден");
        }
    } else {
        console.error("Изображение не найдено или ссылка не соответствует ожидаемому URL");
    }

    updateAndConvert('CurrentDepth', '9');
    updateAndConvert('CurrentWidth', '9');
    updateAndConvert('CurrentHeight', '9');

    let button = document.querySelector(statusSelect.offsetParent !== null ? 'input#btn-save-and-next' : 'input#btn-save');
    if (button) {
        button.click();
    } else {
        console.log("Кнопка не найдена");
    }
}

// Получить элемент селектора статуса
let statusSelect = document.getElementById("StatusId");

// Добавить обработчик события для кнопки
button.addEventListener('dblclick', function() {
    console.log("button double-clicked.");

    // Установить значение селектора в зависимости от видимости элемента статуса
    $("#StatusId").val(statusSelect.offsetParent !== null ? "5" : "6");

    performCommonActions();
});

///////////////////////////////////////////////// Изменение цвета при наведении и убирании курсора
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    });

    button.addEventListener('click', function() {
    let selectComments = $("#" + selectId);
    let commentToAdd = comment; // Начальное значение комментария, которое будет добавлено

    // Получаем список уже выбранных комментариев
    let selectedComments = selectComments.val() || [];

    // Проверяем, есть ли уже выбранный комментарий в списке
    if (!selectedComments.includes(commentToAdd)) {
        // Если выбранный комментарий еще не добавлен, добавляем его
        selectedComments.push(commentToAdd);
        // Обновляем список выбранных комментариев
        selectComments.val(selectedComments).trigger('chosen:updated');
    } else {
        // Если выбранный комментарий уже есть в списке, ничего не делаем
        console.log('Комментарий уже выбран.');
    }
});


    document.body.appendChild(button);
    return button;
}

///////////////////////////////////////////////// Создание квадратов
let heights = [75, 25, 50, 125, 25, 50];

for (let i = 0; i < 6; i++) {
    let transparentSquare = document.createElement('div');
    transparentSquare.classList.add('created-element', 'created-by-script');
    transparentSquare.style.position = 'fixed';
    transparentSquare.style.top = (69 + heights.slice(0, i).reduce((a, b) => a + b + 5, 0)) + 'px';
    transparentSquare.style.right = '8px';
    transparentSquare.style.width = '132px';
    transparentSquare.style.height = heights[i] + 'px';
    transparentSquare.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    transparentSquare.style.border = '1px solid #33a6e8';
    transparentSquare.style.borderRadius = '5px';

    document.body.appendChild(transparentSquare);
}
///////////////////////////////////////////////// Кнопки для скрытия и показа созданных елементов
// Создание кнопки для скрытия всех элементов и кнопок, созданных скриптом
const hideElementsButton = createButton('Скрыть комментарии', 'hideElementsButton', '12px');
hideElementsButton.classList.add('created-by-script'); // Добавляем класс для идентификации кнопки
hideElementsButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
hideElementsButton.style.border = '2px solid #33a6e8';

// Создание кнопки для показа всех скрытых элементов
const showHiddenElementsButton = createButton('Открыть', 'showHiddenElementsButton', '12px');
showHiddenElementsButton.classList.add('created-by-script'); // Добавляем класс для идентификации кнопки
showHiddenElementsButton.style.display = 'none'; // Начально скрываем кнопку
showHiddenElementsButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
showHiddenElementsButton.style.border = '2px solid #33a6e8';

// Добавление обработчика события для кнопки скрытия элементов и отображения кнопки "Показать скрытые элементы"
hideElementsButton.addEventListener('click', function() {
    // Скрыть только элементы и кнопки, созданные данным скриптом
    const elementsAndButtonsToHide = document.querySelectorAll('.created-by-script');
    elementsAndButtonsToHide.forEach(function(element) {
        element.style.display = 'none';
    });

    // Сохраняем состояние видимости кнопок в локальном хранилище
    localStorage.setItem('buttonsVisibility', 'hidden');

    // Скрываем кнопку "Скрыть все элементы" и отображаем кнопку "Показать скрытые элементы"
    hideElementsButton.style.display = 'none';
    showHiddenElementsButton.style.display = 'block';
});

// Добавление обработчика события для кнопки "Показать скрытые элементы"
showHiddenElementsButton.addEventListener('click', function() {
    // Показать все скрытые элементы и кнопки, созданные данным скриптом
    const elementsAndButtonsToShow = document.querySelectorAll('.created-by-script');
    elementsAndButtonsToShow.forEach(function(element) {
        element.style.display = 'block';
    });

    // Сохраняем состояние видимости кнопок в локальном хранилище
    localStorage.setItem('buttonsVisibility', 'visible');

    // Отображаем кнопку "Скрыть все элементы" и скрываем кнопку "Показать скрытые элементы"
    hideElementsButton.style.display = 'block';
    showHiddenElementsButton.style.display = 'none';
});

///////////////////////////////////////////////// Комментарии
$(document).ready(function() {
    $("#SelectedComments").chosen();


            const buttonsData = [
                ['Inappropriate Resolution', 'lowResolutionButton', '70px', 'Bad Image (inappropriate resolution and inability to remove the background)'],
                ['Unusable Angle', 'unusableAngleButton', '95px', 'Bad Image (Unusable Angle and Pieces of products)'],
                ['No Image on PDP', 'noImageOnPDPButton', '120px', 'No Image on PDP'],

                ['Several Products (Set)', 'severalProductsButton', '150px', 'Several Products (Set)'],

                ['No Dimensions on PDP', 'noDimensionsOnPDPButton', '180px', 'No Dimensions on PDP'],
                ['Incorrect Dimensions', 'incorrectDimensionsButton', '205px', 'Incorrect Dimensions'],

                ['Scaled by width', 'scaledByWidthButton', '235px', 'Scaled by width, causes height decoration to appear disproportionate'],
                ['Scaled by height', 'scaledByHeightButton', '260px', 'Scaled by height, causes width decoration to appear disproportionate'],
                ['Only one dimension', 'oneDimensionButton', '285px', 'There is only one dimension on the PDP'],
                ['No length on the PDP', 'noLengthOnThePDPButton', '310px', 'There is no length listed on the PDP'],
                ['No depth on the PDP', 'noDepthOnThePDPButton', '335px', 'There is no depth listed on the PDP'],

                ['(URL) not available', 'errorButton', '365px', 'Product detail page (URL) not available'],

                ['Category not supported', 'wrongCategoryButton', '395px', 'Category not supported'],
                ['Not Supported', 'notSupportedButton', '420px', 'Product Not Supported by Tangiblee'],
            ];
        // Создаем кнопки из данных
    for (const buttonData of buttonsData) {
        createButton(...buttonData, 'SelectedComments');
    }

///////////////////////////////////////////////// Кнопка "To Moderation"
var buttonStyle = document.querySelector('.created-by-script').style;

// Получаем элемент <select> по id
let statusSelect = document.getElementById("StatusId");

// Проверяем, скрыт ли элемент
if (statusSelect.offsetParent === null) {
    // Элемент скрыт, создаем кнопку "To Moderation"
    var button = document.createElement("button");
    button.innerHTML = "To Moderation";
    button.id = "ModerationBtn";
    button.type = "button";

    // Добавляем обработчик события для двойного клика
    button.addEventListener('dblclick', function() {
        var select = document.getElementById("StatusId");
        select.value = "9";
        var event = new Event('change');
        select.dispatchEvent(event);

        let saveButton = document.querySelector('input#btn-save');
        if (saveButton) {
            saveButton.click();
        } else {
            console.log("Кнопка 'input#btn-save' не найдена");
        }
    });

    // Устанавливаем стили для кнопки
    Object.assign(button.style, {
        position: 'fixed',
        top: '450px',
        right: '10px',
        zIndex: '9999',
        width: '130px',
        height: '25px',
        textAlign: 'center',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: 'rgb(61, 170, 233)',
        fontSize: '10px',
        cursor: 'pointer'
    });

    // Добавляем кнопку на страницу
    document.body.appendChild(button);
}

});

///////////////////////////////////////////////// Функция перевода см в инчи
function updateAndConvert(parameterName, value) {
    let hiddenInputElement = document.querySelector('.cm-inputs .combo-value[name="' + parameterName + '"]');
    let visibleInputElement = document.querySelector('.cm-inputs .combo-text');

    if (hiddenInputElement && visibleInputElement) {
        if (hiddenInputElement.value === '0') { // Проверяем, равно ли значение скрытой ячейки 0
            hiddenInputElement.value = value;
            visibleInputElement.value = value;
            visibleInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            let convertButton = document.querySelector('.convert-numbers-to-measure-btn');

            if (convertButton) {
                convertButton.click();
            }
        } else {
            console.log("Скрытая ячейка не равна 0. Не вводить значение.");
        }
    } else {
        console.log("StatusId is hidden.");
    }
}

let statusSelect = document.querySelector('select#StatusId');



///////////////////////////////////////////////// Кнопка полной закраски
const markerSizeButton = document.querySelector('a[href="javascript:tangiblee.webManager.backgroundMarker.setMarkerSize()"]');

// Создать кнопку
const fillCanvasButton = document.createElement('button');
fillCanvasButton.type = 'button';
fillCanvasButton.id = 'fillCanvasButton';
fillCanvasButton.textContent = '';

// Установить стили для кнопки
fillCanvasButton.style.width = '30px';
fillCanvasButton.style.height = '30px';
fillCanvasButton.style.backgroundColor = '#99cc66';
fillCanvasButton.style.border = '1px solid #cccccc';
fillCanvasButton.style.borderRadius = '4px';

// Вставить кнопку справа от элемента markerSizeButton
markerSizeButton.parentNode.insertBefore(fillCanvasButton, markerSizeButton.nextSibling);

// Добавить обработчик события 'click' для кнопки
fillCanvasButton.addEventListener('click', () => {
    const self = tangiblee.webManager.backgroundMarker;
    const fillColor = "rgb(0, 250, 0)";

    self.canvasContext.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.canvasContext.fillStyle = fillColor;
    self.canvasContext.fillRect(0, 0, self.canvas.width, self.canvas.height);

    self.imageWasChanged = true;
    self.isSelectionCleared = false;
});



})();