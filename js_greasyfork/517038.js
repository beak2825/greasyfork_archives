// ==UserScript==
// @name         Decimal Killer LOLZ
// @namespace    http://tampermonkey.net/
// @version      2024-11-14
// @description  Decimal Killer LOLZ EN
// @author       Eliot
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://nztcdn.com/avatar/l/1730732417/8821727.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517038/Decimal%20Killer%20LOLZ.user.js
// @updateURL https://update.greasyfork.org/scripts/517038/Decimal%20Killer%20LOLZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        const getElements = (...classNames) => {
            return classNames.flatMap(className => Array.from(document.querySelectorAll(`.${className}`)));
        };


        const updateBalance = (elements) => {
            elements.forEach(element => {
                if (element) {
                    const balanceValueText = element.textContent.replace(/[^0-9\s,]/g, '');
                    const wholePart = balanceValueText.split(',')[0].trim();
                    const formattedValue = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    element.textContent = formattedValue;
                } else {
                    console.warn('Элемент не найден или пуст:', element);
                }
            });
        };


        const allBalanceElements = getElements(
            'balanceValue',
            'balanceValue muted',
            'Incomes',
            'Outgoings',
            'amount mainc',
            'out',
            'amountChange .in span'
        );


        if (allBalanceElements.length > 0) {
            updateBalance(allBalanceElements);
        }

    };
})();