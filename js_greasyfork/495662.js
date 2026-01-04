// ==UserScript==
// @name         Нет аукам и черновикам | Шмель
// @namespace    Violentmonkey Scripts
// @version      1
// @description  Закроет вкладку если вдруг поймёт что он на ауке или черновике
// @author       Семён
// @match        https://a24.biz/order/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/495662/%D0%9D%D0%B5%D1%82%20%D0%B0%D1%83%D0%BA%D0%B0%D0%BC%20%D0%B8%20%D1%87%D0%B5%D1%80%D0%BD%D0%BE%D0%B2%D0%B8%D0%BA%D0%B0%D0%BC%20%7C%20%D0%A8%D0%BC%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/495662/%D0%9D%D0%B5%D1%82%20%D0%B0%D1%83%D0%BA%D0%B0%D0%BC%20%D0%B8%20%D1%87%D0%B5%D1%80%D0%BD%D0%BE%D0%B2%D0%B8%D0%BA%D0%B0%D0%BC%20%7C%20%D0%A8%D0%BC%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        if (window.location.href.endsWith('?ord=success')) {
            window.close();
        }
    }, 500);


    // Функция для проверки наличия div с текстом "Кажется, такого задания не существует"
    function checkDiv() {
        // Получаем все div элементы на странице
        const divs = document.querySelectorAll('div');

        // Перебираем все div элементы
        for (const div of divs) {
            // Проверяем, есть ли внутри div нужный текст
            if (div.textContent.includes('Кажется, такого задания не существует')) {
                console.log('Найден div с текстом: "Кажется, такого задания не существует"');
                window.close();
                return true; // Возвращаем true, если нашли нужный элемент
            }
        }
        return false; // Возвращаем false, если не нашли нужный элемент
    }

    // Настройки для MutationObserver
    const observerConfig = {
        childList: true,
        subtree: true
    };

    // Callback функция для MutationObserver
    function observerCallback(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (checkDiv()) {
                    observer.disconnect(); // Останавливаем наблюдение, если элемент найден
                    break;
                }
            }
        }
    }

    // Создаем экземпляр MutationObserver и запускаем его
    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, observerConfig);

    // Также запускаем проверку сразу после загрузки страницы
    window.addEventListener('load', () => {
        if (checkDiv()) {
            observer.disconnect(); // Останавливаем наблюдение, если элемент найден сразу
        }
    });


})();
