// ==UserScript==
// @name         Warmane Market Price Calculator
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Calculate price per 1 coin or 1000 gold in the Warmane market and enable sorting by conversion rate.
// @author       You
// @match        https://www.warmane.com/account/trade
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525739/Warmane%20Market%20Price%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/525739/Warmane%20Market%20Price%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculatePrice() {
        let rows = document.querySelectorAll('tr[role="row"]');
        if (rows.length === 0) {
            return;
        }

        rows.forEach(row => {
            let nameCell = row.querySelector("td.nameAndDescription .name a");
            let priceCell = row.querySelector("td.costValues");

            if (!nameCell || !priceCell) {
                return;
            }

            let nameText = nameCell.innerText.trim();
            let priceText = priceCell.innerText.trim();

            let nameMatch = nameText.match(/(\d+) (gold|coins)/);
            let priceMatch = priceText.match(/(\d+) (gold|coins)/);

            if (nameMatch && priceMatch) {
                let nameValue = parseFloat(nameMatch[1]);
                let nameType = nameMatch[2];
                let priceValue = parseFloat(priceMatch[1]);
                let priceType = priceMatch[2];
                let calculatedPrice = null;
                let conversionRate = 0;

                if (nameType === "gold" && priceType === "coins") {
                    conversionRate = nameValue / priceValue;
                    calculatedPrice = conversionRate.toFixed(0) + " gold per coin";
                } else if (nameType === "coins" && priceType === "gold") {
                    conversionRate = priceValue / nameValue;
                    calculatedPrice = conversionRate.toFixed(0) + " coins per 1000 gold";
                }

                if (calculatedPrice) {
                    priceCell.setAttribute("data-conversion-rate", conversionRate);
                    if (!priceCell.querySelector('.calculated-price')) {
                        let priceElement = document.createElement("div");
                        priceElement.className = "calculated-price";
                        priceElement.style.fontSize = "12px";
                        priceElement.style.color = "#ffcc00";
                        priceElement.style.marginTop = "5px";
                        priceElement.innerText = calculatedPrice;
                        priceCell.appendChild(priceElement);
                    }
                }
            }
        });
    }

    function sortByConversionRate() {
        let table = document.querySelector("#data-table");
        if (!table) return;

        let tbody = table.querySelector("tbody");
        let rows = Array.from(tbody.querySelectorAll('tr[role="row"]'));
        let ascending = table.getAttribute("data-sort-order") === "asc";

        rows.sort((a, b) => {
            let rateA = parseFloat(a.querySelector("td.costValues")?.getAttribute("data-conversion-rate")) || 0;
            let rateB = parseFloat(b.querySelector("td.costValues")?.getAttribute("data-conversion-rate")) || 0;
            return ascending ? rateA - rateB : rateB - rateA;
        });

        rows.forEach(row => tbody.appendChild(row));
        table.setAttribute("data-sort-order", ascending ? "desc" : "asc");
    }

    function attachSortHandler() {
        let priceHeader = document.querySelector("th[aria-label^='Price']");
        if (priceHeader) {
            priceHeader.style.cursor = "pointer";
            priceHeader.addEventListener("click", (e) => {
                e.preventDefault();
                sortByConversionRate();
            });
        }
    }

    let observer = new MutationObserver(() => {
        calculatePrice();
        attachSortHandler();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(calculatePrice, 2000);

    // Sort descending by default
    setTimeout(() => {
        document.querySelector("#data-table")?.setAttribute("data-sort-order", "asc");
        sortByConversionRate();
    }, 3000);
})();
