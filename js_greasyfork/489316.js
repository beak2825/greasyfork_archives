// ==UserScript==
// @name         CRM Tools Dropdown
// @version      2.0
// @description  Add a dropdown box labeled "Tools" next to the existing 'Options'dropdown box
// @author       Rob Clayton
// @match        https://workplace.plus.net/apps/customerdetails/*
// @grant        GM_none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/489316/CRM%20Tools%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/489316/CRM%20Tools%20Dropdown.meta.js
// ==/UserScript==

// Function to create a new dropdown box
function createDropdown() {
    // Clone the existing dropdown box
    var existingDropdown = $('.dropdownTop').eq(0);
    var newDropdown = existingDropdown.clone();

    // Modify the button text to "Tools"
    newDropdown.find('a.button').text('Tools');

    // Remove existing dropdown items
    var dropdownList = newDropdown.find('ul');
    dropdownList.empty(); // Remove all existing items

    // Append the new dropdown box to the document
    existingDropdown.after(newDropdown);

    // Function to extract UK postcodes from the current page
    function extractPostcode() {
        // Regular expression to match UK postcodes with or without space, ensuring they are not part of a larger string
        var postcodeRegex = /\b[A-Z]{1,2}[0-9R][0-9A-Z]?(?:\s?)[0-9][ABD-HJLNP-UW-Z]{2}\b/gi;

        // Search for postcodes in the page
        var matches = $('body').text().match(postcodeRegex);
        if (matches && matches.length > 0) {
            // Return the first matched postcode without spaces
            return matches[0].replace(/\s/g, '');
        } else {
            return null; // No postcode found
        }
    }

    // Function to add a button to the dropdown menu and handle its click event
    function addButton() {
        var postcode = extractPostcode();
        if (postcode) {
            var dropdown = newDropdown.find('ul'); // Use the new dropdown
            if (dropdown) {
                // Add "Check MiFi Coverage" button
                var button1 = $('<li><a href="#" style="color: yellow; background: green;">Check MiFi Coverage</a></li>').appendTo(dropdown);
                button1.find('a').click(function() {
                    // Open the EE coverage checker in a new tab with the extracted postcode
                    window.open("https://ee.co.uk/help/mobile-coverage-checker/results?postcode=" + postcode + "&origin=home", "_blank");
                });

                // Add "MiFi Request Form" button
                var button2 = $('<li><a href="#" style="color: White; background: #870051;">MiFi Request Form</a></li>').appendTo(dropdown);
                button2.find('a').click(function() {
                    // Open the MiFi request form in a new tab
                    window.open("https://apps.powerapps.com/play/e/default-a7f35688-9c00-4d5e-ba41-29f146377ab0/a/88f06c4f-3070-4001-abbb-2f8bd6e6ba7f?tenantId=a7f35688-9c00-4d5e-ba41-29f146377ab0&hidenavbar=true", "_blank");
                });

                // Add "MSO Lookup" button
                var button3 = $('<li><a href="#" style="color: White; background: #870051;">MSO Lookup</a></li>').appendTo(dropdown);
                button3.find('a').click(function() {
                    // Open the MSO Lookup in a new tab
                    window.open("https://rabit.intra.bt.com/auth/testarea/CandISearch.cfm", "_blank");
                });

                // Add "MGS Generator" button
                var button4 = $('<li><a href="#" style="color: White; background: #870051;">MGS Generator</a></li>').appendTo(dropdown);
                button4.find('a').click(function() {
                    // Open the MGS Generator in a new tab
                    window.open("https://apps.powerapps.com/play/e/default-a7f35688-9c00-4d5e-ba41-29f146377ab0/a/8a4a4ca1-5bc5-4ab1-954f-42be8a03b8db?tenantId=a7f35688-9c00-4d5e-ba41-29f146377ab0&hint=9fe40c17-781e-4063-bade-be24ccde2d5b&sourcetime=1699292842677&hidenavbar=true", "_blank");
                });

                // Add "Secret Radius" button
                var button5 = $('<li><a href="#" style="color: white; background: #870051;">Secret Radius</a></li>').appendTo(dropdown);
                button5.find('a').click(function() {
                    // Open the Secret Radius URL in a new tab
                    window.open("https://workplace.plus.net/RADIUS/RadiusReporting_replicated/cli_search.html", "_blank");
                });
                                // Add "EBAC" button
                var button6 = $('<li><a href="#" style="color: white; background: #870051;">EBAC</a></li>').appendTo(dropdown);
                button6.find('a').click(function() {
                    // Open the EBAC URL in a new tab
                    window.open("https://bbactotl.btwholesale.com/bbac-ui/totl/totlSearch/#/ADSL", "_blank");
                });
            }
        }
    }

    // Call the addButton function when the page is loaded
    addButton();
}

// Call the function to create the new dropdown box
createDropdown();
