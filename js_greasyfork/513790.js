// ==UserScript==
// @name         Torn Item Market Max Quantity Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculates maximum affordable quantity when using max button in item market
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513790/Torn%20Item%20Market%20Max%20Quantity%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/513790/Torn%20Item%20Market%20Max%20Quantity%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to parse element text based on a regex
    function getElementValue(element, regex) {
        if (!element) return null;
        const match = element.textContent.match(regex);
        if (!match) return null;
        return parseInt(match[1].replace(/,/g, ''));
    }

    // Get user's money from either mobile or desktop
    function getUserMoney() {
        const userMoneyElement = document.querySelector('#user-money');
        if (!userMoneyElement) return null;
        return parseInt(userMoneyElement.dataset.money);
    }

    function handleMaxQuantityClick(event) {
        const maxButton = event.target.closest('.input-money-symbol');
        if (!maxButton) return;

        const moneyGroup = maxButton.closest('.input-money-group');
        const sellerRow = moneyGroup?.closest('.sellerRow___AI0m6');
        const quantityInput = moneyGroup?.querySelector('input.input-money:not([type="hidden"])');

        if (!moneyGroup || !sellerRow || !quantityInput) return;

        const userMoney = getUserMoney();
        if (!userMoney) return;

        const priceElement = sellerRow.querySelector('.price___Uwiv2');
        if (!priceElement) return;
        const price = getElementValue(priceElement, /\$([0-9,]+)/);

        if (!price) return;

        const affordableQuantity = Math.floor(userMoney / price);
        quantityInput.value = affordableQuantity;
        quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    document.addEventListener('click', handleMaxQuantityClick);
})();
