// ==UserScript==
// @name         Скрытие блока "Проблема с доменом zelenka.guru."
// @namespace    Геї
// @version      v1
// @description  Скрытие блока "Проблема с доменом zelenka.guru." Lzt
// @author       https://zelenka.guru/whereismymind/
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495825/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20%22%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0%20%D1%81%20%D0%B4%D0%BE%D0%BC%D0%B5%D0%BD%D0%BE%D0%BC%20zelenkaguru%22.user.js
// @updateURL https://update.greasyfork.org/scripts/495825/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20%22%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0%20%D1%81%20%D0%B4%D0%BE%D0%BC%D0%B5%D0%BD%D0%BE%D0%BC%20zelenkaguru%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    }

    hideElement('.main-alert_block');
})();
