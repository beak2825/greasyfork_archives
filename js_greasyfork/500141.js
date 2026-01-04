// ==UserScript==
// @name         disables display of advertising articles on pikabu.ru
// @namespace    http://tampermonkey.net/
// @version      0.4.7
// @description  Отключает показ рекламных статей на pikabu.ru 
// @author       necoop
// @match        https://pikabu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500141/disables%20display%20of%20advertising%20articles%20on%20pikaburu.user.js
// @updateURL https://update.greasyfork.org/scripts/500141/disables%20display%20of%20advertising%20articles%20on%20pikaburu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Массив с возможными значениями data-name
    const dataNames = ['pikabu.education', 'rabota.pikabu', 'vacancies.pikabu', 'practicum.yandex','Eduson', 'yandex.travel']; // Список блокированных авторов

    // Функция для проверки наличия тега a с нужным data-name
    function hasMatchingLink(element) {
        return dataNames.some(dataName => element.querySelector(`a[data-name="${dataName}"]`));
    }

    // Основная функция для обработки статей
    function processArticles() {
        const articles = document.querySelectorAll('article.story');
        articles.forEach(article => {
            if (hasMatchingLink(article)) {
                article.style.display = 'none';
            }
        });
    }

    // Запуск при загрузке страницы
    window.addEventListener('load', processArticles);

    // Дополнительно запускаем при динамических изменениях на странице (например, при прокрутке бесконечного скролла)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processArticles();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
