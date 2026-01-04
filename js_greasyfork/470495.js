// ==UserScript==
// @name         Anti anti ad blocker key-hub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удаляет прозьбу выключить ad block на сайте key-hub
// @author       Role_Play
// @match        https://key-hub.eu/drops
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470495/Anti%20anti%20ad%20blocker%20key-hub.user.js
// @updateURL https://update.greasyfork.org/scripts/470495/Anti%20anti%20ad%20blocker%20key-hub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для удаления элемента
    function removeElement(element) {
        if (element) {
            element.remove();
        }
    }

    // Ожидаем загрузку страницы и удаляем элемент
    window.addEventListener('load', function() {
        var adBlockElement = document.querySelector('.fc-ab-root');
        removeElement(adBlockElement);
    });

    // Проверяем и удаляем элемент каждую секунду
    setInterval(function() {
        var adBlockElement = document.querySelector('.fc-ab-root');
        removeElement(adBlockElement);
    }, 1000);
})();
