// ==UserScript==
// @name         Цветной тект в Google
// @license      MIT
// @version      11:11
// @author       k1erry
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.google.com/
// @description  Изменяет цвет на поисковой странице Google
// @match        https://www.google.com/*
// @namespace    http://example.com
// @downloadURL https://update.greasyfork.org/scripts/476427/%D0%A6%D0%B2%D0%B5%D1%82%D0%BD%D0%BE%D0%B9%20%D1%82%D0%B5%D0%BA%D1%82%20%D0%B2%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/476427/%D0%A6%D0%B2%D0%B5%D1%82%D0%BD%D0%BE%D0%B9%20%D1%82%D0%B5%D0%BA%D1%82%20%D0%B2%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeTextColor(element, color) {
        element.style.color = color;
    }

    function handleVisibleElements() {
        const h3Elements = document.querySelectorAll('h3.LC20lb.MBeuO.DKV0Md');

        h3Elements.forEach(element => {
            changeTextColor(element, '#ffba66'); // Тут основной цвет
        });

        const links = document.querySelectorAll('a');

        links.forEach(link => {
            if (link.href.includes('google.com')) {
                changeTextColor(link, '#ffba66'); // Тут тоже основной цвет
            } else {
                changeTextColor(link, '#e39332'); // Тут второй цвет для кнопочек
            }
        });
    }

    window.addEventListener('scroll', handleVisibleElements);

    handleVisibleElements();
})();
