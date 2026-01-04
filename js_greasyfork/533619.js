// ==UserScript==
// @name         Автоматическое раскрытие списка Яндекс Нейро в поисковике ya.ru
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Автоматически нажимает кнопку "Нейро" и вторую кнопку на ya.ru и yandex.ru, как только они появятся
// @author       Алехан
// @match        *://ya.ru/*
// @match        *://www.ya.ru/*
// @match        *://yandex.ru/*
// @match        *://www.yandex.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533619/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%9D%D0%B5%D0%B9%D1%80%D0%BE%20%D0%B2%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%B8%D0%BA%D0%B5%20yaru.user.js
// @updateURL https://update.greasyfork.org/scripts/533619/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%9D%D0%B5%D0%B9%D1%80%D0%BE%20%D0%B2%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%B8%D0%BA%D0%B5%20yaru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для поиска и клика на кнопку "Нейро"
    function clickNeuroButton() {
        // Ищем все элементы <a> с классом HeaderNav-Tab
        const tabs = document.querySelectorAll('a.HeaderNav-Tab');

        // Перебираем найденные элементы
        tabs.forEach(tab => {
            // Проверяем, есть ли внутри элемент <span> с текстом "Нейро"
            const neuroSpan = Array.from(tab.querySelectorAll('span')).find(span => span.textContent.includes('Нейро'));
            if (neuroSpan) {
                console.log('Кнопка "Нейро" найдена, кликаем...');
                tab.click(); // Кликаем на кнопку
            }
        });
    }

    // Функция для поиска и клика на вторую кнопку
    function clickSecondButton() {
        // Ищем вторую кнопку по классу FactFold-ButtonContent
        const secondButton = document.querySelector('.FactFold-ButtonContent');

        if (secondButton) {
            console.log('Вторая кнопка найдена, кликаем...');
            secondButton.click(); // Кликаем на кнопку
            return true; // Возвращаем true, если кнопка найдена и клик выполнен
        }
        return false; // Возвращаем false, если кнопка не найдена
    }

    // Запускаем функцию после загрузки страницы
    window.addEventListener('load', () => {
        // Кликаем на кнопку "Нейро" сразу
        clickNeuroButton();

        // Наблюдаем за изменениями в DOM
        const observer = new MutationObserver((mutationsList, observer) => {
            // Проверяем, появилась ли вторая кнопка
            if (clickSecondButton()) {
                // Если кнопка найдена и клик выполнен, отключаем observer
                observer.disconnect();
                console.log('Наблюдение за изменениями DOM остановлено.');
            }
        });

        // Начинаем наблюдение за изменениями в DOM
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Наблюдение за изменениями DOM начато.');
    });
})();