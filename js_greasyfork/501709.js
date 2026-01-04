// ==UserScript==
// @name         Boosty Auto Clicker Читать далее
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Automatically clicks the "Read More" buttons on boosty.to
// @match        https://boosty.to/*
// @downloadURL https://update.greasyfork.org/scripts/501709/Boosty%20Auto%20Clicker%20%D0%A7%D0%B8%D1%82%D0%B0%D1%82%D1%8C%20%D0%B4%D0%B0%D0%BB%D0%B5%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/501709/Boosty%20Auto%20Clicker%20%D0%A7%D0%B8%D1%82%D0%B0%D1%82%D1%8C%20%D0%B4%D0%B0%D0%BB%D0%B5%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для эмуляции нажатия левой кнопкой мыши
    function simulateClick(element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Функция для сканирования страницы и поиска всех кнопок "Читать далее"
    function scanPage() {
        // Используем селектор для поиска элементов, содержащих ключевое слово 'Post_readMore_'
        var readMoreButtons = document.querySelectorAll('[class*="Post_readMore_"]');

        readMoreButtons.forEach(function(button) {
            simulateClick(button);
        });
    }

    // Функция для ожидания окончания загрузки страницы
    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            // Когда страница загружена, выполняем сканирование
            scanPage();
        }
    }

    // Устанавливаем обработчик события на окончание загрузки страницы
    document.addEventListener('readystatechange', waitForPageLoad);

    // Устанавливаем интервал сканирования страницы (в миллисекундах)
    setInterval(scanPage, 3000);

    // Дополнительно запускаем сканирование при первоначальной загрузке скрипта
    scanPage();
})();
