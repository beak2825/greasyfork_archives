// ==UserScript==
// @name         Elethor Market Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds buttons to fill in price and inventory amount in Elethor market, and calculate auto-buy based on available gold.
// @author       Baccy
// @match        https://elethor.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elethor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530775/Elethor%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/530775/Elethor%20Market%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .button-auto-sell, .button-auto-buy {
            background-color: #007BFF;
            color: white;
            font-size: 0.75rem;
            border: none;
            border-radius: 5px;
            padding: 0.5em 1em;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-left: 5px; /* Add some spacing between buttons */
        }
        .button-auto-sell:hover, .button-auto-buy:hover {
            background-color: #176cc7;
        }
    `;
    document.head.appendChild(style);

    function addAutoFillButtons() {
        const container = document.querySelector(".button.is-success.ml-auto.is-small");
        if (!container) return;
        if (container.querySelector(".button-auto-sell") || container.querySelector(".button-auto-buy")) return;

        const autoFillButton = document.createElement("button");
        autoFillButton.textContent = "Auto Sell";
        autoFillButton.className = "button-auto-sell";
        autoFillButton.addEventListener("click", () => {
            const priceElement = document.querySelector('table.w-full.is-narrow.bg-green-700\\/50.rounded-sm td.cursor-pointer');
            if (!priceElement) return;
            const priceText = priceElement.textContent.replace(/,/g, '');
            const price = priceText - 1;
            const inventoryAmountElement = document.querySelector(".basis-full p[content] span.cursor-default span");
            const inventoryAmount = inventoryAmountElement ? inventoryAmountElement.textContent.replace(/,/g, '').trim() : null;
            if (price && inventoryAmount) {
                const priceInput = document.querySelector("input[name='price']");
                const amountInput = document.querySelector("input[name='quantity']");
                if (priceInput && amountInput) {
                    priceInput.value = price;
                    amountInput.value = inventoryAmount;
                    priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                    amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                const sellRadioButton = document.querySelector("input[type='radio'][value='sell']");
                if (sellRadioButton) {
                    sellRadioButton.checked = true;
                    sellRadioButton.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        const autoBuyButton = document.createElement("button");
        autoBuyButton.textContent = "Auto Buy";
        autoBuyButton.className = "button-auto-buy";
        autoBuyButton.addEventListener("click", () => {
            const buyPriceElement = document.querySelector('table.w-full.is-narrow.bg-red-500\\/50.rounded-sm td.cursor-pointer');
            if (!buyPriceElement) return;
            const buyPriceText = buyPriceElement.textContent.replace(/,/g, '');
            const buyPrice = parseInt(buyPriceText) + 1;

            const goldAmountElement = document.querySelector("p[content='Gold in inventory'] span.cursor-default span");
            const goldAmountText = goldAmountElement ? goldAmountElement.textContent.replace(/,/g, '').trim() : null;
            const goldAmount = goldAmountText ? parseInt(goldAmountText) : 0;

            const itemsToBuy = Math.floor(goldAmount / buyPrice);
            if (buyPrice && itemsToBuy > 0) {
                const priceInput = document.querySelector("input[name='price']");
                const amountInput = document.querySelector("input[name='quantity']");

                if (priceInput && amountInput) {
                    priceInput.value = buyPrice;
                    amountInput.value = itemsToBuy;
                    priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                    amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const buyRadioButton = document.querySelector("input[type='radio'][value='buy']");
                if (buyRadioButton) {
                    buyRadioButton.checked = true;
                    buyRadioButton.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        container.insertAdjacentElement("afterend", autoFillButton);
        container.insertAdjacentElement("afterend", autoBuyButton);
    }

    function init() {
        const element = document.querySelector('a.navbar-item:nth-child(9)');
        const autoFillButton = document.createElement("button");
        autoFillButton.textContent = "Add";
        autoFillButton.className = "button-auto-sell";
        autoFillButton.addEventListener("click", addAutoFillButtons);
        element.parentElement.insertBefore(autoFillButton, element.nextSibling);
    }

    const observer = new MutationObserver(mutations => {
        if (document.querySelector('a.navbar-item:nth-child(9)')) {
            init();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
