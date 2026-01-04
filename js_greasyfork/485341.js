// ==UserScript==
// @name         Donedeal Car Value Estimation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Add input boxes and a submit button for car valuation on DoneDeal
// @author       danyuh
// @match        https://www.donedeal.ie/cars*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485341/Donedeal%20Car%20Value%20Estimation.user.js
// @updateURL https://update.greasyfork.org/scripts/485341/Donedeal%20Car%20Value%20Estimation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to convert miles to kilometers
    function convertMilesToKilometers(miles) {
        return Math.round(miles * 1.60934);
    }

    // Function to add input boxes and submit button
    function addCarValueEstimationUI() {
        // Create input for registration number
        const regInput = $('<input type="text" id="regNumberInput" class="input-group__input" placeholder="Registration Number" style="color: #000000; font-size: 1rem; line-height: 1; border: 1px solid #ccc; border-radius: 5px; padding: 8px; width: 48%; margin-right: 2%;" />');

        // Create input for mileage
        const mileageInput = $('<input type="text" id="mileageInput" class="input-group__input" placeholder="Mileage (km)" style="color: #000000; font-size: 1rem; line-height: 1; border: 1px solid #ccc; border-radius: 5px; padding: 8px; width: 48%;" />');

        // Create submit button
        const submitButton = $('<button id="submitCarValueEstimation" class="input-group__button" style="padding: 10px; margin: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Valuate</button>');

        // Create result box
        const resultBox = $('<div id="valuationResultBox" class="input-group__result" placeholder="Valuated Result" style="padding: 10px; margin: 5px; border: 1px solid #ccc; border-radius: 5px; width: 48%;">Result</div>');

        // Create a container div for the inputs, button, and result box
        const containerDiv = $('<div class="input-group" style="max-width: 400px; margin: 20px auto; display: flex; flex-wrap: wrap;"></div>');

        // Append inputs, button, and result box to the container div
        containerDiv.append(regInput, mileageInput, submitButton, resultBox);

        // Insert the container div before the "Key Info" section
        $('.columns.small-12.large-8 > div:nth-child(2)').append(containerDiv);

        // Update mileage on the details page
        const mileageElement = $('#__next > div.DefaultLayout__Wrapper-sc-6l0atd-0.iRUvaN > main > div.row.small-collapse.medium-uncollapse > div.columns.small-12.large-8 > div:nth-child(2) > ul');
        const originalMileage = mileageElement.text();
        const miles = parseInt(originalMileage.replace(" mi", "").replace(",", "").trim());

        if (!isNaN(miles)) {
            const convertedMileage = convertMilesToKilometers(miles);

            // Create a new element to display the converted mileage
            const convertedMileageElement = $('<li class="input-group__label"></li>').text(`${convertedMileage} km`).css('color', 'red');

            // Insert the new element as the last child of the existing ul element
            mileageElement.append(convertedMileageElement);
        } else {
            // If the mileage is already in kilometers, keep the original text
            mileageElement.css('color', 'red');
        }

        // Handle click event for the submit button
        submitButton.on('click', function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();

            // Retrieve values from inputs
            const regNumber = $('#regNumberInput').val();
            const mileage = $('#mileageInput').val();

            // TODO: Add logic to use the values for valuation
            // For now, just log the values
            console.log('Registration Number:', regNumber);
            console.log('Mileage:', mileage);

            // Fetch the valuation result from the specified site
            fetchValuationResult(regNumber, mileage)
                .then(valuationResult => {
                // Display the valuation result in the result box
                resultBox.text(`Valuation Result: ${valuationResult}`);
            })
                .catch(error => {
                console.error('Error fetching valuation result:', error);
                resultBox.text('Error fetching valuation result.');
            });
        });
    }

    // Function to fetch valuation result from the specified site
    async function fetchValuationResult(regNumber, mileage) {
        const valuationUrl = `https://www.donedeal.ie/private-valuation/${regNumber}/${mileage}`;
        const response = await fetch(valuationUrl);
        const html = await response.text();

        console.log(valuationUrl);

        // Create a temporary div and inject the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Find the valuation result element
        const valuationResultElement = tempDiv.querySelector('.CarSummaryPanel__PrivateValuationPriceRange-sc-1ag4oue-13.hSFDCt');

        if (valuationResultElement) {
            return valuationResultElement.textContent.trim();
        } else {
            throw new Error('Valuation result element not found.');
        }
    }

    // Wait for the page to fully load
    $(document).ready(function () {
        // Check if it's the car details page and add UI accordingly
        if (document.location.href.includes('/cars-for-sale/')) {
            addCarValueEstimationUI();
        }
    });
})();
