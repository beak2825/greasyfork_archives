// ==UserScript==
// @name         Pre Filter1
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Для упрощения поиска размеров на префильтре и кнопки быстрой отправки в бп
// @author       You
// @match        *://*/Admin/PrefilterPictures*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492100/Pre%20Filter1.user.js
// @updateURL https://update.greasyfork.org/scripts/492100/Pre%20Filter1.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function addCustomBackgroundColorToNumbersAndLabels(elementSelector, customColorNumbers, customColorLabels) {
    const element = document.querySelector(elementSelector);
    if (element) {
        const textNodes = [];
        collectTextNodes(element, textNodes);
 
        textNodes.forEach(textNode => {
            const text = textNode.textContent.toLowerCase();
            const modifiedText = text.replace(/(\d+(\.\d+)?(\s?\/\s?\d+)?(?!(?:\s?(cts|carat|k)))|size|mm|cm|depth|width|height|length|dimensions|white|rose|yellow|platinum)/g, match => {
                let color = isNaN(match) ? customColorLabels : customColorNumbers;
                if (['white', 'rose', 'yellow', 'platinum'].includes(match)) {
                    color = '#fff0b8'; // Color for specific words
                }
                return `<span style='background-color: ${color};'>${match}</span>`;
            });
 
            const wrapper = document.createElement('span');
            wrapper.innerHTML = modifiedText;
 
            textNode.parentNode.replaceChild(wrapper, textNode);
        });
    }
}
    function collectTextNodes(element, textNodes) {
        if (element.nodeType === Node.TEXT_NODE) {
            textNodes.push(element);
        } else {
            for (let i = 0; i < element.childNodes.length; i++) {
                collectTextNodes(element.childNodes[i], textNodes);
            }
        }
    }
 
    addCustomBackgroundColorToNumbersAndLabels("#dimensionInfo", "#b8fffa", "#FAB8FF");
    addCustomBackgroundColorToNumbersAndLabels("#description", "#b8fffa", "#FAB8FF");
    addCustomBackgroundColorToNumbersAndLabels("body > div.container.notification > div:nth-child(8) > div > dl > dd:nth-child(6)", "#b8fffa", "#FAB8FF");
 
 
    // Функция для создания кнопки
function createButton(text, id, comment, selectId) {
    let button = document.createElement('button');
    button.classList.add('created-by-script');
    button.type = 'button';
    button.id = id;
    button.style.marginLeft = '5px';
    button.style.height = '30px';
    button.style.cursor = 'pointer';
    button.style.color = 'white';
    button.style.textShadow = '0 -1px 0 rgba(0, 0, 0, 0.25)';
    button.style.backgroundColor = '#b5b5b5';
    button.style.backgroundRepeat = 'repeat-x';
    button.style.borderColor = 'rgb(170 170 170 / 20%)';
    button.style.padding = '4px 14px';
    button.style.borderRadius = '4px';
 
    // Создаем элемент <i> для иконки
    let icon = document.createElement('i');
    icon.classList.add('icon-remove', 'icon-white');
    icon.style.marginRight = '5px';
    button.appendChild(icon);
 
    // Создаем текстовый узел для текста кнопки
    let buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
 
    button.addEventListener('dblclick', function() {
        let selectComments = $("#" + selectId);
        selectComments.empty();
        let newComment = new Option(comment, comment, false, true);
        selectComments.append(newComment).trigger('chosen:updated');
 
        // Выполняем код после нажатия кнопки
        // Кликаем по кнопке с id "btnBadDimensions"
        document.getElementById("btnBadDimensions").click();
    });
 
    // Находим родительский элемент кнопки с id "btnBadDimensions" и добавляем кнопку после него
    const btnBadDimensions = document.getElementById('btnBadDimensions');
    btnBadDimensions.parentNode.insertBefore(button, btnBadDimensions.nextSibling);
 
    return button;
}
 
$(document).ready(function() {
    $("#SelectedComments").chosen();
 
    const buttonsData = [
        ['Wrong Category', 'wrongCategoryButton', 'Wrong Category', 'SelectedComments'],
        ['Not Supported', 'notSupportedButton', 'Product Not Supported by Tangiblee', 'SelectedComments'],
    ];
 
    for (const buttonData of buttonsData) {
        createButton(...buttonData);
    }
});
 
 
 
})();