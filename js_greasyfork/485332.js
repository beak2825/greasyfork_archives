// ==UserScript==
// @name         DoneDeal Mi / £ Converter to Km / Euro
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Custom mileage and price converter for DoneDeal website
// @author       Danyuh
// @match        https://www.donedeal.ie/cars*
// @match        https://www.donedeal.ie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donedeal.ie
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485332/DoneDeal%20Mi%20%20%C2%A3%20Converter%20to%20Km%20%20Euro.user.js
// @updateURL https://update.greasyfork.org/scripts/485332/DoneDeal%20Mi%20%20%C2%A3%20Converter%20to%20Km%20%20Euro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert miles to kilometers
    function convertMilesToKilometers(miles) {
        return Math.round(miles * 1.60934).toLocaleString() + " km";
    }

    // Function to convert pounds to euros
    function convertPoundsToEuros(pounds) {
        return "€" + Math.round(pounds * 1.14).toLocaleString();
    }

    // Function to update mileage and price on the list page
    function updateMileageAndPrice() {
        // Update mileage
        $('li[data-testid^="listing-card-index-"] .BasicHeaderstyled__KeyInfoItem-sc-78ow8b-2').each(function() {
            const originalText = $(this).text();
            const regex = /\bmi\b/; // Use a regex to match "mi" as a whole word
            if (regex.test(originalText)) {
                const miles = parseInt(originalText.replace(/\D/g, "").trim()); // Remove non-digit characters
                if (!isNaN(miles)) {
                    const convertedText = convertMilesToKilometers(miles);
                    $(this).text(convertedText).css('color', 'red');
                }
            }
        });

        // Update price
        $('li[data-testid^="listing-card-index-"] .Pricestyled__Text-sc-1dt81j8-5:contains("£")').each(function() {
            const originalText = $(this).text();
            const pounds = parseInt(originalText.replace("£", "").replace(",", "").trim());
            if (!isNaN(pounds)) {
                const convertedText = convertPoundsToEuros(pounds);
                $(this).text(convertedText).css('color', 'red');
            }
        });
    }

    // Function to update additional elements on the Item page
    function updateAdditionalElements() {
        // Update price on the details page
        const priceElement = $('#__next > div.DefaultLayout__Wrapper-sc-6l0atd-0.iRUvaN > main > div.row.small-collapse.medium-uncollapse > div.columns.small-12.large-8 > div:nth-child(2) > div.AdTitleBox__PriceAndActionsContainer-sc-1p2v1sf-2.ocMHn > div.AdTitleBox__PriceAndDeliveryContainer-sc-1p2v1sf-3.bKdNXS > div > p');
        const originalPrice = priceElement.text();
        const pounds = parseInt(originalPrice.replace("£", "").replace(",", "").trim());
        if (!isNaN(pounds)) {
            const convertedPrice = "€" + Math.round(pounds * 1.14).toLocaleString();
            priceElement.text(convertedPrice).css('color', 'red');
        }

        // Update mileage on the details page
        const mileageElement = $('#__next > div.DefaultLayout__Wrapper-sc-6l0atd-0.iRUvaN > main > div.row.small-collapse.medium-uncollapse > div.columns.small-12.large-8 > div:nth-child(4) > div.InfoPanel__KeyInfoListContainer-sc-1j25gal-4.cjGXsF > div.KeyInfoList__Grid-sc-sxpiwc-0.gThfCS > div:nth-child(6) > div.KeyInfoList__Text-sc-sxpiwc-2.dQdfES');
        const originalMileage = mileageElement.text();
        const miles = parseInt(originalMileage.replace(" mi", "").replace(",", "").trim());
        if (!isNaN(miles)) {
            const convertedMileage = convertMilesToKilometers(miles);
            mileageElement.text(convertedMileage).css('color', 'red');
        }
    }

    // Wait for the page to fully load
    $(document).ready(function() {
        // Check if it's the list page and update mileage and price every 3 seconds
        if (document.location.href.includes('/cars')) {
            setInterval(updateMileageAndPrice, 3000);
        }

        // Check if it's the details page and update additional elements
        if (document.location.href.includes('/cars-for-sale/')) {
            updateAdditionalElements();
        }
    });
})();
