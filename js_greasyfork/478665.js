// ==UserScript==
// @name            Uniteller: autocomplete fix
// @namespace       github.com/a2kolbasov
// @version         1.1.0
// @description     Fix 💳 autofill on Uniteller.ru payments processing provider
// @name:ru         Uniteller: фикс автозаполнения
// @description:ru  Исправляет автозаполнение 💳 на странице оплаты Uniteller.ru
// @author          Aleksandr Kolbasov
// @license         MIT
// @icon            https://uniteller.ru/local/templates/index/img/base/logo.svg
// @match           https://fpay.uniteller.ru/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478665/Uniteller%3A%20autocomplete%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/478665/Uniteller%3A%20autocomplete%20fix.meta.js
// ==/UserScript==

/*
 * Copyright © 2023 Aleksandr Kolbasov
 * Licensed under the MIT license (https://opensource.org/license/mit/)
 */

(() => {
    'use strict';

    /**
     * @param {?HTMLElement} element
     * @param {string} value
     */
    function setAutocomplete(element, value) {
        if (element) element.setAttribute('autocomplete', value);
    }

    setTimeout(() => {
        let cardNumber = document.getElementById('Pan');
        let month = document.getElementById('ExpMonth');
        let year = document.getElementById('ExpYear');
        let name = document.getElementById('CardholderName');
        let secureCode = document.getElementById('Cvc2');
        let email = document.getElementById('Email');
        let tel = document.getElementById('Phone');

        setAutocomplete(cardNumber, 'cc-number');
        setAutocomplete(month, 'cc-exp-month');
        setAutocomplete(year, 'cc-exp-year');
        setAutocomplete(name, 'cc-name');
        setAutocomplete(secureCode, 'cc-csc');
        setAutocomplete(email, 'email');
        setAutocomplete(tel, 'tel');
    });
})();
