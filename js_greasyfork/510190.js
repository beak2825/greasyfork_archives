// ==UserScript==
// @name         EZ Upkeep
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  Use the Torn API to manage upkeep and display amount
// @author       JeffBezas | xDp64x
// @match        https://www.torn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510190/EZ%20Upkeep.user.js
// @updateURL https://update.greasyfork.org/scripts/510190/EZ%20Upkeep.meta.js
// ==/UserScript==
function addButton() {
    console.log("Initializing buttons...");

    // Create buttons and result span
    const upkeepButton = $('<button id="Upkeep" style="color: var(--default-blue-color); cursor: pointer; margin-right: 10px;">Loading Upkeep...</button>');
    const resetButton = $('<button id="ResetKey" style="color: var(--default-red-color); cursor: pointer;">Reset API Key</button>');
    const resultSpan = $('<span id="Result" style="font-size: 12px; font-weight: 100;"></span>');

    $('div.content-title > h4').append(upkeepButton);
    $('div.content-title > h4').append(resetButton);
    $('div.content-title > h4').append(resultSpan);

    // Check for existing API token
    let apiToken = localStorage.getItem('tornApiToken');

    if (!apiToken) {
        apiToken = prompt("Please enter your Torn API token key:");
        if (apiToken) {
            localStorage.setItem('tornApiToken', apiToken);
        }
    }

    if (apiToken) {
        fetchPropertyId(apiToken).then(propertyId => {
            if (propertyId) {
                console.log("Property ID retrieved: ", propertyId);
                const totalNum = fetchCurrentUpkeep(propertyId, apiToken);
                console.log(totalNum);
                fetchUpkeepData(propertyId, apiToken).then(totalCost => {
                    console.log("Total cost fetched: ", totalCost);

                    // Check if totalCost is valid before updating the button
                    if (totalCost !== null && totalCost !== undefined) {
                        $('#Upkeep').text(`Pay Upkeep: $${totalCost}`);
                        const upkeepUrl = `https://www.torn.com/properties.php#/p=options&ID=${propertyId}&tab=upkeep`;

                        $('#Upkeep').off('click').on('click', () => {
                            console.log("Redirecting to upkeep URL...");
                            window.location.href = upkeepUrl; // Redirect to the upkeep URL
                        });
                    } else {
                        $('#Result').text('Failed to retrieve upkeep amount.').css('color', 'red');
                        console.error('Total cost is invalid.');
                    }
                }).catch(error => {
                    $('#Result').text('Error fetching upkeep data.').css('color', 'red');
                    console.error('Error in fetchUpkeepData:', error);
                });
            } else {
                $('#Result').text('Failed to retrieve property ID.').css('color', 'red');
                console.error('Failed to retrieve property ID.');
            }
        });
    } else {
        $('#Result').text('No API token provided.').css('color', 'red');
        console.error('No API token provided.');
    }

    // Reset API key button click event
    $('#ResetKey').on('click', () => {
        const newApiToken = prompt("Please enter your new Torn API token key:");
        if (newApiToken) {
            localStorage.setItem('tornApiToken', newApiToken);
            $('#Result').text('API token updated.').css('color', 'green');
        } else {
            $('#Result').text('No API token provided.').css('color', 'red');
        }
    });
}

async function fetchPropertyId(apiToken) {
    console.log("Fetching property ID with token: ", apiToken);
    try {
        const apiURL = `https://api.torn.com/user/?key=${apiToken}&comment=TornAPI&selections=properties`;
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log("Fetched property data: ", data);

        const propertyIds = Object.keys(data.properties);
        return propertyIds.length > 0 ? propertyIds[0] : null; // Return the first property ID or null if none exist
    } catch (error) {
        console.error('Error fetching property ID:', error);
        return null; // Return null if there is an error
    }
}

async function fetchCurrentUpkeep(propertyId, apiToken) {
    const upkeepUrl = `https://www.torn.com/properties.php#/p=options&ID=${propertyId}&tab=upkeep`;

    try {
        const response = await fetch(upkeepUrl);
        const text = await response.text();

        // Create a DOM parser to extract the upkeep amount from the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Log the parsed document to see its structure
        console.log(doc.documentElement.innerHTML);

        console.log("Doc2: ", doc.documentElement);

        // Step 1: Select the desired <ul> element with the specific data-id
        const upkeepList = doc.querySelector(`ul.options-list.left.upkeep[data-id="${propertyId}"]`);
        console.log("UpkeepList: ", upkeepList);
        //content-wrapper autumn travelling
        console.log("Testing: ", doc.querySelector(`content-wrapper autumn traveling`));

        if (upkeepList) {
            // Step 2: Find the <li> with the specific class and get the <span class="desc">
            const upkeepItem = upkeepList.querySelector('li.t-last.warning.upkeep-prop-act span.desc');

            if (upkeepItem) {
                // Step 3: Extract the text content from the span
                const textContent = upkeepItem.textContent;

                // Step 4: Use a regular expression to extract the numeric part
                const numberMatch = textContent.match(/\$[\d,]+/); // Matches "$885,761"

                if (numberMatch) {
                    // Step 5: Extract the matched number
                    const numericValue = numberMatch[0]; // This will be "$885,761"

                    // Optional: If you want to convert it to a number, remove the '$' and ',' characters
                    const amount = parseFloat(numericValue.replace(/[$,]/g, ''));

                    console.log(`Extracted Upkeep Amount: ${numericValue}`); // Logs: $885,761
                    console.log(`Numeric Value: ${amount}`); // Logs: 885761
                    return numericValue; // Return the numeric value if needed
                } else {
                    console.warn('No numeric value found in the text.');
                    return null; // Return null if no numeric value is found
                }
            } else {
                console.warn('No upkeep item found.');
                return null; // Return null if the upkeep item is not found
            }
        } else {
            console.warn(`No upkeep list found for property ID: ${propertyId}`);
            return null; // Return null if the upkeep list is not found
        }
} catch (error) {
    console.error('Error fetching upkeep data:', error);

}
}
//This is only getting total cost via staff and regular upkeep, not currently owed, but seems off with upgrades perhaps
async function fetchUpkeepData(propertyId, apiToken) {
    console.log("Fetching upkeep data for property ID: ", propertyId);
    try {
        //Access Property for user via API token, sort the data from upkeep and staff cost
        const apiURL = `https://api.torn.com/user/?key=${apiToken}&comment=TornAPI&selections=properties`;
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log("Fetched upkeep data: ", data);

        const properties = data.properties;

        if (properties && properties[propertyId]) {
            const upkeepAmount = properties[propertyId].upkeep || 0; // Get the upkeep amount or default to 0
            const staffAmount = properties[propertyId].staff_cost || 0; // Get the staff cost or default to 0
            const totalCost = upkeepAmount + staffAmount; // Calculate total cost

            console.log(`Upkeep for property ID ${propertyId}: $${upkeepAmount}`);
            console.log(`Staff cost for property ID ${propertyId}: $${staffAmount}`);
            console.log(`Total cost for property ID ${propertyId}: $${totalCost}`);

            return totalCost; // Return the total cost
        } else {
            console.warn(`Property ID ${propertyId} not found.`);
            return 0; // Return 0 if the property ID does not exist
        }
    } catch (error) {
        console.error('Error fetching upkeep data:', error);
        return null; // Return null if there is an error
    }
}

(function() {
    'use strict';
    addButton();
})();
