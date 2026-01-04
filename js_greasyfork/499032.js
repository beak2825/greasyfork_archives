// ==UserScript==
// @name         Скорозвон кнопки
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Нажимает кнопку при нажатии Enter и выбирает радиокнопку при нажатии 1 на сайте App.skorozvon.ru
// @author       olegsoloviev
// @match        https://app.skorozvon.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499032/%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D0%B7%D0%B2%D0%BE%D0%BD%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/499032/%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D0%B7%D0%B2%D0%BE%D0%BD%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Нажатие Enter для выполнения действия кнопки
        if (event.key === 'Enter') {
            const button = document.querySelector('.button__primary.button__icon.save-and-next.no-hint.force'); // Сохранить
            if (button) {
                button.click();
            }
        }
        if (event.key === 'Enter') {
            const button = document.querySelector('.button.call_button.button__danger'); // Завершить
            if (button) {
                button.click();
            }
        }
        if (event.key === '1') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[4].click(); // перезвонить
            }
        }
        if (event.key === '2') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[3].click(); // автоответчик
            }
        }
        if (event.key === '3') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[8].click(); // За последние 30 дней был отказ от Альфа банка
            }
        }
        if (event.key === '4') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[9].click(); // отказался
            }
        }
        if (event.key === '5') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[11].click(); // удалить из базы
            }
        }
        if (event.key === '6') {
            let radioButtons = document.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[7].click(); // уже звонили
            }
        }
    });
})();