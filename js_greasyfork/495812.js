// ==UserScript==
// @name         jfnjnsljnlds
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Скрипт для Руководства сервера
// @author       Valik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/495812/jfnjnsljnlds.user.js
// @updateURL https://update.greasyfork.org/scripts/495812/jfnjnsljnlds.meta.js
// ==/UserScript==

// Функция для добавления текста в элементы
function addTextToElements() {
    // Получаем необходимые элементы
    var textarea = document.querySelector('data-xf-init="textarea-handler suggested-threads"');
    var messageBox = document.querySelector('.fr-element.fr-view.fr-element-scroll-visible');
    
    // Добавляем текст в элементы
    if (textarea) {
        textarea.value = 'Привет';
    }
    if (messageBox) {
        messageBox.innerHTML = 'Привет еще раз';
    }
}

// Функция для отправки формы
function submitForm() {
    // Находим кнопку отправки формы
    var submitButton = document.querySelector('.ripple-container');
    
    // Если кнопка найдена, кликаем по ней
    if (submitButton) {
        submitButton.click();
    } else {
        console.log('Кнопка отправки формы не найдена');
    }
}

// Создаем кнопку и добавляем обработчик события
var startButton = document.createElement('button');
startButton.textContent = 'Start Script';
document.body.appendChild(startButton);

startButton.addEventListener('click', function() {
    addTextToElements();
    submitForm();
});