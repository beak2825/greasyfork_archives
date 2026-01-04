// ==UserScript==
// @name         Amex Hotel Price Extractor
// @description  Extract hotel pricing details from web pages
// @version      1.0
// @license      MIT
// @author       jnjustice
// @namespace    http://tampermonkey.net
// @match        https://www.amextravel.com/hotel-searches/*/hotels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483661/Amex%20Hotel%20Price%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/483661/Amex%20Hotel%20Price%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format cents to currency
    function formatCurrency(cents, currencySymbol, centToCurrencyRatio) {
        const dollars = cents / centToCurrencyRatio;
        return currencySymbol + dollars.toFixed(2);
    }

    // Function to calculate the number of nights
    function calculateNights(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
    }

    // Function to format and display hotel fees
    function formatAndDisplayHotelFees(hotelFees) {
        return hotelFees.map(fee => {
            const feeAmount = formatCurrency(
                fee.amount.cents,
                fee.amount.symbol,
                fee.amount.cent_to_currency_ratio
            );
            return `${feeAmount} (${fee.fee_type.code})`;
        }).join(', ');
    }

    // Function to extract and display hotel pricing details
    function extractPricingDetails() {
        if (typeof window.appData !== 'undefined') {
            const details = window.appData.hotelDetailsResults;

            // Extracting and formatting specific fields
            const startDate = details.start_date;
            const endDate = details.end_date;
            const nights = calculateNights(details.start_date, details.end_date);
            const lowestNightlyRate = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.lowest_nightly_rate.cents,
                details.hotel.room_with_all_rates.display_rate.lowest_nightly_rate.symbol,
                details.hotel.room_with_all_rates.display_rate.lowest_nightly_rate.cent_to_currency_ratio
            );
            const averageNightlyRate = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.average_nightly_rate.cents,
                details.hotel.room_with_all_rates.display_rate.average_nightly_rate.symbol,
                details.hotel.room_with_all_rates.display_rate.average_nightly_rate.cent_to_currency_ratio
            );
            const nightlyRackRate = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.nightly_rack_rate.cents,
                details.hotel.room_with_all_rates.display_rate.nightly_rack_rate.symbol,
                details.hotel.room_with_all_rates.display_rate.nightly_rack_rate.cent_to_currency_ratio
            );
            const totalCostExclusive = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.total_cost_exclusive.cents,
                details.hotel.room_with_all_rates.display_rate.total_cost_exclusive.symbol,
                details.hotel.room_with_all_rates.display_rate.total_cost_exclusive.cent_to_currency_ratio
            );
            const totalTaxesAndFees = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.total_taxes_and_fees.cents,
                details.hotel.room_with_all_rates.display_rate.total_taxes_and_fees.symbol,
                details.hotel.room_with_all_rates.display_rate.total_taxes_and_fees.cent_to_currency_ratio
            );
            const totalCostInclusive = formatCurrency(
                details.hotel.room_with_all_rates.display_rate.total_cost_inclusive.cents,
                details.hotel.room_with_all_rates.display_rate.total_cost_inclusive.symbol,
                details.hotel.room_with_all_rates.display_rate.total_cost_inclusive.cent_to_currency_ratio
            );
            const hotelFeesFormatted = formatAndDisplayHotelFees(details.hotel.room_with_all_rates.display_rate.hotel_fees);
            const totalRoomCost = details.hotel.room_with_all_rates.display_rate.total_cost_exclusive.cents / details.hotel.room_with_all_rates.display_rate.total_cost_exclusive.cent_to_currency_ratio;
            const totalTaxesFees = details.hotel.room_with_all_rates.display_rate.total_taxes_and_fees.cents / details.hotel.room_with_all_rates.display_rate.total_taxes_and_fees.cent_to_currency_ratio;
            const totalHotelFees = details.hotel.room_with_all_rates.display_rate.hotel_fees.reduce((total, fee) => total + (fee.amount.cents / fee.amount.cent_to_currency_ratio), 0);
            const totalTripCost = totalRoomCost + totalTaxesFees + totalHotelFees;


            // Create a div to display the information
            const infoDiv = document.createElement('div');
            infoDiv.style.position = 'fixed';
            infoDiv.style.top = '10px';
            infoDiv.style.left = '10px';
            infoDiv.style.backgroundColor = 'white';
            infoDiv.style.border = '1px solid black';
            infoDiv.style.padding = '10px';
            infoDiv.innerHTML = `<strong>Start Date:</strong> ${startDate}<br>
                                 <strong>End Date:</strong> ${endDate}<br>
                                 <strong>Number of Nights:</strong> ${nights}<br><br>
                                 <strong>Lowest Nightly Rate:</strong> ${lowestNightlyRate}<br>
                                 <strong>Average Nightly Rate:</strong> ${averageNightlyRate}<br><br>
                                 <strong>Total Trip Cost:</strong> $${totalTripCost.toFixed(2)}<br>
                                 Room Cost: $${totalRoomCost.toFixed(2)}<br>
                                 Estimated Taxes and Fees: $${totalTaxesFees.toFixed(2)}<br>
                                 Additional Property Fees: ${hotelFeesFormatted}<br><br>
                                 <strong>Pay Today:</strong> ${totalCostInclusive}<br>
                                 <strong>Total Due at Hotel:</strong> $${totalHotelFees.toFixed(2)}`;

            // Append the div to the body of the page
            document.body.appendChild(infoDiv);
        }
    }

    // Call the function when the page loads
    window.addEventListener('load', extractPricingDetails);
})();