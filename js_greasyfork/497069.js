// ==UserScript==
// @name         Sahibinden Fiyat Sihirbazi
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  10, 15 ve 20 yil sonunda daire fiyatinin cikmasi icin kira kac olmali bilgisini liste fiyatinin altina ekleyen script.
// @author       MostlyEmre
// @match        https://www.sahibinden.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sahibinden.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497069/Sahibinden%20Fiyat%20Sihirbazi.user.js
// @updateURL https://update.greasyfork.org/scripts/497069/Sahibinden%20Fiyat%20Sihirbazi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const limit = 1000;
    const yearsToCompensate = 15;
    const moreYearsToCompensate = 20;
    const additionalYearsToCompensate = 10;

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function createPriceContainer(price, currency, years) {
        const formattedPrice = formatPrice(price);
        const newPriceContainer = document.createElement("div");
        newPriceContainer.classList.add("custom-price-container");
        newPriceContainer.innerHTML = `<span style="color: black;">${formattedPrice} ${currency} <span style="color: darkgrey;">(${years})</span></span>`;
        return newPriceContainer;
    }

    function processListings() {
        document.querySelectorAll(".searchResultsItem").forEach((listing) => {
            const listingIsFake = Array.from(listing.classList).includes("nativeAd");

            if (listingIsFake) {
                return;
            } else {
                const priceElement = listing.querySelector(".searchResultsPriceValue");
                if (priceElement.querySelector(".custom-price-container")) {
                    return;
                }

                const priceArray = priceElement
                    ? priceElement.innerText.trim().split(" ")
                    : null;
                const price = priceArray ? parseInt(priceArray[0].replaceAll(".", "")) : null;
                const currency = priceArray ? priceArray[1] : null;

                const finalPriceUSD = currency === "TL" ? (price / 18.22).toFixed(2) : price;

                const sqm = listing.querySelector(".searchResultsAttributeValue")
                    ? listing.querySelector(".searchResultsAttributeValue").innerText.trim().split(" ")[0]
                    : null;

                // console.log(finalPriceUSD / sqm <= limit ? "🤑" : "🚨", price, currency, "or", finalPriceUSD, "USD", (finalPriceUSD / sqm).toFixed(1));

                const newPrice15 = Math.floor((price / 15) / 12);
                const newPrice20 = Math.floor((price / 20) / 12);
                const newPrice10 = Math.floor((price / 10) / 12);

                priceElement.appendChild(createPriceContainer(newPrice10, currency, additionalYearsToCompensate));
                priceElement.appendChild(createPriceContainer(newPrice15, currency, yearsToCompensate));
                priceElement.appendChild(createPriceContainer(newPrice20, currency, moreYearsToCompensate));
            }
        });
    }


    processListings();

    const observer = new MutationObserver(() => {
        observer.disconnect(); // Temporarily disconnect the observer
        processListings();
        observer.observe(targetNode, config); // Reconnect the observer
    });

    const config = { childList: true, subtree: true };


    const targetNode = document.querySelector('body');
    observer.observe(targetNode, config);
})();
