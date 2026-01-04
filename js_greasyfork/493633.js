// ==UserScript==
// @name         Удаление огонька
// @namespace    https://zelenka.guru/jenny
// @version      1.0
// @description  Удаление значка огня в списке тем и в самих темах.
// @author       Timka251
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @license      MIT
// @icon         https://img.icons8.com/?size=64&id=19679&format=png
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493633/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B3%D0%BE%D0%BD%D1%8C%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493633/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B3%D0%BE%D0%BD%D1%8C%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для удаления элементов по селектору
    function removeElementsByClass(className) {
        const elements = document.querySelectorAll('.' + className.replace(/ /g, '.'));
        for (let element of elements) {
            element.parentNode.removeChild(element);
        }
    }

    // Удаление элементов при каждой загрузке страницы
    window.addEventListener('load', function() {
        // Список классов для удаления, классы указаны в одну строку через пробел
        removeElementsByClass('hot fa fa-solid fa-fire Tooltip');
        removeElementsByClass('titleBarIcon hotThreadIcon fa fa-fire Tooltip');
    });

})();