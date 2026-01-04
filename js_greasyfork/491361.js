// ==UserScript==
// @name         Убираем блок с 1-о апрельской шуткой с главной страницы форума.
// @namespace    http://tampermonkey.net/
// @version      2024-03-31
// @description  Данный скрипт убирает блок с "Пройдите верификацию на форуме через ГОСУСЛУГИ" с главной страницы форума.
// @author       Elfiyka
// @match        *://*.lolz.guru/*
// @match        *://*.lolz.live/*
// @match        *://*.zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491361/%D0%A3%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%B1%D0%BB%D0%BE%D0%BA%20%D1%81%201-%D0%BE%20%D0%B0%D0%BF%D1%80%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%BE%D0%B9%20%D1%88%D1%83%D1%82%D0%BA%D0%BE%D0%B9%20%D1%81%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491361/%D0%A3%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%B1%D0%BB%D0%BE%D0%BA%20%D1%81%201-%D0%BE%20%D0%B0%D0%BF%D1%80%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%BE%D0%B9%20%D1%88%D1%83%D1%82%D0%BA%D0%BE%D0%B9%20%D1%81%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsByClass(className) {
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    removeElementsByClass("tournament-block-2");
})();
