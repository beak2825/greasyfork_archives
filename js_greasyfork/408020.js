// ==UserScript==
// @name         Nemlig Extensions
// @namespace    fillipuster.com
// @version      1.0
// @description  Provides useful functionality to Nemlig.com, such as calculating and sorting by percentage savings.
// @author       Fillipuster
// @match        *://www.nemlig.com/*
// @downloadURL https://update.greasyfork.org/scripts/408020/Nemlig%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/408020/Nemlig%20Extensions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let productsListElement = document.querySelector(".productlist-show-all__item-container")
    let productElements = document.querySelectorAll(".productlist-item");

    let headerElement = document.querySelector(".site-header__content");

    let sortSavingsBtn = document.createElement("button");
    sortSavingsBtn.innerText = "Sort by savings percentage";
    sortSavingsBtn.addEventListener("click", () => { sortByPercentSavings() });
    headerElement.parentNode.prepend(sortSavingsBtn);

    let sortKiloPriceBtn = document.createElement("button");
    sortKiloPriceBtn.innerText = "Sort by kilo/litre price";
    sortKiloPriceBtn.addEventListener("click", () => { sortByKiloPrice() });
    headerElement.parentNode.prepend(sortKiloPriceBtn);

    let recalculateSavingsBtn = document.createElement("button");
    recalculateSavingsBtn.innerText = "Re-calculate percentage savings";
    recalculateSavingsBtn.addEventListener("click", () => { calculatePercentSavings() });
    headerElement.parentNode.prepend(recalculateSavingsBtn);

    function calculatePercentSavings() {
        console.log("Calculating percentage savings for products.");

        // Refetch elements, as they may be fetched prematurely during initialization
        productsListElement = document.querySelector(".productlist-show-all__item-container")
        productElements = document.querySelectorAll(".productlist-item");

        productElements.forEach(productElement => {
            // Only checks for products with direct savings, not X for Y specials.
            let priceElement = productElement.querySelector(".pricecontainer.has-campaign")

            if (priceElement && !productElement.fp_percentSaving) {
                let campaignPriceElement = priceElement.children[0];
                let basePriceElement = priceElement.children[1];

                let campaignPriceStr = campaignPriceElement.children[0].innerText + "." + campaignPriceElement.children[1].innerText;
                let basePriceStr = basePriceElement.children[0].innerText + "." + basePriceElement.children[1].innerText;

                let campaignPrice = parseFloat(campaignPriceStr);
                let basePrice = parseFloat(basePriceStr);

                let percentSaving = (1 - campaignPrice / basePrice) * 100;

                // priceElement.appendChild(document.createElement("br"));
                priceElement.appendChild(document.createTextNode(` ${Math.round(percentSaving * 10) / 10}%`));

                productElement.fp_percentSaving = percentSaving;
            } else {
                productElement.fp_percentSaving = -1; // Maybe not the best, but ensures correct sorting.
            }

        });
    }

    function sortByPercentSavings() {
        console.log("Sorting products by percentage savings.");
        let productElementsArray = Array.prototype.slice.call(productElements, 0);

        productElementsArray.sort((a, b) => {
            // Notice the inverted sorting. We want to highest savings first in the array.
            if (a.fp_percentSaving > b.fp_percentSaving) return -1;
            if (a.fp_percentSaving < b.fp_percentSaving) return 1;
            return 0
        });

        productsListElement.innerHTML = "";
        productElementsArray.forEach(e => {
            productsListElement.appendChild(e);
        })
    }

    function sortByKiloPrice() {
        console.log("Sorting products by kilo/litre price.");
        let productElementsArray = Array.prototype.slice.call(productElements, 0);

        productElementsArray.sort((a, b) => {
            if (a.querySelector(".pricecontainer-unitprice__label").innerText == "kr./Stk." || b.querySelector(".pricecontainer-unitprice__label").innerText == "kr./Stk.") return 1;
            let aPrice = a.querySelector(".pricecontainer-unitprice__campaign-price").innerText || a.querySelector(".pricecontainer-unitprice__base-price").innerText;
            let bPrice = b.querySelector(".pricecontainer-unitprice__campaign-price").innerText || b.querySelector(".pricecontainer-unitprice__base-price").innerText;

            aPrice = parseFloat(aPrice);
            bPrice = parseFloat(bPrice);

            if (aPrice > bPrice) return 1;
            if (aPrice < bPrice) return -1;
            return 0
        });

        productsListElement.innerHTML = "";
        productElementsArray.forEach(e => {
            productsListElement.appendChild(e);
        })
    }

    // Doesn't work?
    // window.onhashchange = function () {
    //     setTimeout(calculatePercentSavings, 3000);
    // }

    setTimeout(calculatePercentSavings, 3000);

})();