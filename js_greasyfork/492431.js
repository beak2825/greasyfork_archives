// ==UserScript==
// @name         Super Mega Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Update PPM and Rate suggestions based on state zones and mileage from a specific table, and hide the footer
// @author       You
// @match        http://190.92.151.76/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492431/Super%20Mega%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/492431/Super%20Mega%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const zoneMap = {
        "Zone 1": ["IL", "IN", "KY", "MI", "OH", "WI"],
        "Zone 2": ["DE", "DC", "GA", "IA", "KS", "MD", "MN", "MO", "NJ", "NY", "NC", "PA", "TN", "VA"],
        "Zone 3": ["AL", "AR", "CT", "ME", "MA", "NE", "NH", "OK", "RI", "SC", "TX", "VT", "WV"],
        "Zone 4": ["AZ", "CA", "CO", "FL", "LA", "MS", "NM", "ND", "SD"],
        "Zone 5": ["ID", "MT", "NV", "OR", "UT", "WA", "WY"]
    };

    const ppmRates = {
        "Zone 1": { "Zone 1": 1, "Zone 2": 1.05, "Zone 3": 1.1, "Zone 4": 1.15, "Zone 5": 1.2 },
        "Zone 2": { "Zone 1": 0.9, "Zone 2": 0.95, "Zone 3": 1.0, "Zone 4": 1.05, "Zone 5": 1.1 },
        "Zone 3": { "Zone 1": 0.8, "Zone 2": 0.85, "Zone 3": 0.9, "Zone 4": 0.95, "Zone 5": 1.0 },
        "Zone 4": { "Zone 1": 0.75, "Zone 2": 0.8, "Zone 3": 0.85, "Zone 4": 0.9, "Zone 5": 0.95 },
        "Zone 5": { "Zone 1": 0.7, "Zone 2": 0.75, "Zone 3": 0.8, "Zone 4": 0.85, "Zone 5": 0.9 }
    };

    window.addEventListener('load', function() {
        // Hide the footer
        const footer = document.querySelector('footer'); // Adjust selector if needed
        if (footer) {
            footer.style.display = 'none';
        }

        const offerBtn = document.getElementById('btnOffer');
        if (offerBtn) {
            const ppmLabel = document.createElement('div');
            const rateLabel = document.createElement('div');
            ppmLabel.innerHTML = 'Suggested PPM: (select row)';
            rateLabel.innerHTML = 'Suggested Rate: (select row)';
            ppmLabel.id = 'ppmLabel';
            rateLabel.id = 'rateLabel';

            offerBtn.parentNode.insertBefore(ppmLabel, offerBtn.nextSibling);
            offerBtn.parentNode.insertBefore(rateLabel, ppmLabel.nextSibling);

            const table = document.getElementById('my-table-id');
            let currentPPM = 0;
            if (table) {
                table.addEventListener('click', function(e) {
                    const row = e.target.closest('.tr-loads');
                    if (row) {
                        table.querySelectorAll('.tr-loads.active').forEach(tr => tr.classList.remove('active'));
                        row.classList.add('active');

                        try {
                            const puCityCell = row.cells[1].textContent;
                            const delCityCell = row.cells[3].textContent;
                            const puState = extractState(puCityCell);
                            const delState = extractState(delCityCell);
                            const puZone = getStateZone(puState);
                            const delZone = getStateZone(delState);
                            currentPPM = ppmRates[puZone][delZone];

                            ppmLabel.innerHTML = `Suggested PPM: ${currentPPM}`;
                            updateRate();
                        } catch (error) {
                            console.error('Error extracting states or updating rate:', error);
                            ppmLabel.innerHTML = 'Suggested PPM: (error)';
                            rateLabel.innerHTML = 'Suggested Rate: (error)';
                        }
                    }
                });
            }

            const milesDiv = document.getElementById('Miles');
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(updateRate);
            });
            observer.observe(milesDiv, { childList: true, subtree: true });

            function updateRate() {
                const milesText = milesDiv.textContent;
                const match = milesText.match(/Miles to pay: (\d+)\((\d+)\)/);
                if (match) {
                    const totalMiles = Number(match[1]) + Number(match[2]);
                    let suggestedRate = totalMiles * currentPPM;
                    suggestedRate = Math.max(250, roundDownToNearestFive(suggestedRate)); // Ensuring minimum of 250
                    rateLabel.innerHTML = `Suggested Rate: ${suggestedRate.toFixed(2)}`;
                }
            }
        }
    });

    function getStateZone(stateAbbreviation) {
        for (let zone in zoneMap) {
            if (zoneMap[zone].includes(stateAbbreviation.toUpperCase())) {
                return zone;
            }
        }
        return null;
    }

    function extractState(text) {
        const match = text.match(/,\s*(\w{2})\s/);
        if (match && match[1]) {
            return match[1].toLowerCase();
        } else {
            throw new Error("State abbreviation not found in text: " + text);
        }
    }

    function roundDownToNearestFive(number) {
        return Math.floor(number / 5) * 5;
    }
})();


// ==UserScript==
// @name         Miles and Pay Calculator - Dont Delete


(function() {
    'use strict';

    // Function to calculate and create a span element for different pay rates
    function createPayElement(rate, totalMiles, text, color) {
        var pay = (totalMiles * rate).toFixed(2); // Calculate pay and round to two decimal places
        var payElement = document.createElement('span');
        payElement.innerHTML = `${text}: <span style="color:black;">(${pay})</span> `;
        payElement.style.color = color; // Set the text color before the parentheses
        payElement.style.marginLeft = '10px';
        payElement.className = 'calculated-pay'; // Add a class for easy identification and removal if needed
        return payElement;
    }

    // Function to calculate and display total miles and various pay rates
    function calculateAndDisplayAll() {
        // Find the element containing 'Miles to pay'
        var milesTextElement = document.evaluate("//text()[contains(., 'Miles to pay:')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // If the element is found
        if (milesTextElement) {
            var fullText = milesTextElement.wholeText;
            var regex = /Miles to pay: (\d+)\((\d+)\)/;
            var matches = fullText.match(regex);

            if (matches && matches.length === 3) {
                // Calculate total miles
                var loadedMiles = parseInt(matches[1], 10);
                var emptyMiles = parseInt(matches[2], 10);
                var totalMiles = loadedMiles + emptyMiles;

                // Remove existing calculated elements if they exist
                document.querySelectorAll('.calculated-pay').forEach(e => e.remove());

                // Create and append new calculated elements
                var elementsToAppend = [
                    createPayElement(1, totalMiles, "Total Miles", 'green'),
                    createPayElement(0.75, totalMiles, "Driver Pay", 'red'),
                    createPayElement(0.90, totalMiles, "90C", 'blue'),
                    createPayElement(0.80, totalMiles, "80C", 'blue'),
                    createPayElement(0.70, totalMiles, "70C", 'blue'),
                    createPayElement(0.60, totalMiles, "60C", 'blue')
                ];

                elementsToAppend.forEach(span => {
                    milesTextElement.parentNode.appendChild(span);
                });
            }
        }
    }

    // Function to handle DOM changes
    function handleDOMChanges(mutations, observer) {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // For each added node, check if it contains the relevant text
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE && /Miles to pay: \d+\(\d+\)/.test(node.nodeValue)) {
                        calculateAndDisplayAll();
                        break;
                    }
                }
            }
        }
    }

    // Create an observer instance linked to the handleDOMChanges function
    const observer = new MutationObserver(handleDOMChanges);

    // Start observing the body for changes in the child list
    observer.observe(document.body, { childList: true, subtree: true });

    // Perform an initial calculation and display
    calculateAndDisplayAll();
})();


// ==UserScript==
// @name         Load Fits or No


(function() {
    'use strict';

    function displayResult(vehicleDimensionsStr, loadDimensionsStr, pieces, loadWeight, fits, tooHeavy) {
        let resultDisplay = document.getElementById('compatibility-display');
        if (!resultDisplay) {
            resultDisplay = document.createElement('div');
            resultDisplay.id = 'compatibility-display';
            resultDisplay.style.position = 'fixed';
            resultDisplay.style.bottom = '10px';
            resultDisplay.style.right = '10px';
            resultDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            resultDisplay.style.padding = '15px';
            resultDisplay.style.borderRadius = '8px';
            resultDisplay.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            resultDisplay.style.display = 'flex';
            resultDisplay.style.justifyContent = 'space-between';
            resultDisplay.style.maxWidth = '550px';
            document.body.appendChild(resultDisplay);
        }

        let compatibilityText = fits && !tooHeavy ? 'Fits' : 'Might Not Fit / Too Heavy';
        let color = fits && !tooHeavy ? 'green' : 'red';

        resultDisplay.innerHTML = `
            <div style="text-align: left;">
                <strong>Vehicle Dimensions:</strong><br>${vehicleDimensionsStr}
                <div style="color: ${color}; margin-top: 8px;">${compatibilityText}</div>
            </div>
            <div style="text-align: left; margin-left: 20px;">
                <strong>Load Dimensions:</strong><br>${loadDimensionsStr}
                <div style="margin-top: 8px;">Pieces: ${pieces}<br>Weight: ${loadWeight} lbs</div>
            </div>
        `;

        // Change the input box background based on compatibility
        let driverPayInput = document.getElementById('driverPay');
        if (driverPayInput) {
            if (!fits || tooHeavy) {
                driverPayInput.style.backgroundColor = 'red'; // Set background to red if it does not fit
            } else {
                driverPayInput.style.backgroundColor = ''; // Reset to default if it fits
            }
        }
    }

    function parseDimensions(dimensionsStr) {
        const dimensionsArr = dimensionsStr.split('x').map(Number);
        return { length: dimensionsArr[0], width: dimensionsArr[1], height: dimensionsArr[2] };
    }

    function checkCompatibility(loadDimensions, loadWeight, pieces, vehicleDimensions, vehicleWeight) {
        let loadTotalLength = loadDimensions.length * pieces;
        let fits = loadTotalLength <= vehicleDimensions.length &&
                   loadDimensions.width <= vehicleDimensions.width &&
                   loadDimensions.height <= vehicleDimensions.height;
        let tooHeavy = loadWeight > vehicleWeight;
        return { fits, tooHeavy };
    }

    function checkHighlightedLoadFitsVehicle() {
        const highlightedLoadRow = document.querySelector('.tr-loads.active');
        const highlightedVehicleRow = document.querySelector('.tr-drivers.active');

        if (!highlightedLoadRow || !highlightedVehicleRow) {
            displayResult("Waiting for selections...", "", "N/A", "N/A", true, false);
            return;
        }

        const [piecesStr, loadWeightStr] = highlightedLoadRow.cells[7].textContent.split('|').map(part => part.trim());
        const pieces = parseInt(piecesStr, 10);
        const loadWeight = parseInt(loadWeightStr, 10);

        const vehicleInfo = highlightedVehicleRow.cells[4].textContent.split('|').map(part => part.trim());
        const vehicleDimensions = parseDimensions(vehicleInfo[0]);
        const vehicleWeight = parseInt(vehicleInfo[1], 10); // Payload capacity
        const loadDimensions = parseDimensions(vehicleInfo[2]);

        const { fits, tooHeavy } = checkCompatibility(loadDimensions, loadWeight, pieces, vehicleDimensions, vehicleWeight);

        displayResult(`${vehicleDimensions.length}x${vehicleDimensions.width}x${vehicleDimensions.height}`, `${loadDimensions.length}x${loadDimensions.width}x${loadDimensions.height}`, pieces, loadWeight, fits, tooHeavy);
    }

    document.addEventListener('click', function(event) {
        if (event.target.closest('.tr-loads, .tr-drivers')) {
            setTimeout(checkHighlightedLoadFitsVehicle, 100);
        }
    });

    displayResult("Waiting for selections...", "", "N/A", "N/A", true, false);
})();

// ==UserScript==
// @name         Detailed Debug Color Code Customers by List


(function() {
    'use strict';

    console.log('Tampermonkey script initiated.');

    // Lists of customers normalized to lower case
    const currentCustomers = ["royalty gate llc", "sunteck transport - ny office", "asap express", "swan group logistics,llc", "platinum cargo logistics", "west motor freight", "saturn freight systems", "agx freight logistics", "valued freight services llc -mc# 1095265", "bronco freight sytems", "excel expedited logistics", "asset hound", "get freight llc", "agx freight logistics llc", "grand aire inc.", "express logistics llc", "c5 logistics", "sunset transporation, inc. ", "ord expedite & logistics, inc", "premier expediters, inc", "pinnacle pro logistics llc", "ait truckload solutions inc", "swick logistics", "airwingexpress", "go to logistics inc.", "lrgistics llc", "precision freight", "premium logistics services llc", "circle logistics"].map(name => name.toLowerCase().trim());
    const potentialCustomers = ["transmedik specialized inc","vectors logistic, inc.", "solid logistics", "ucw logistics", "xpo global forwarding inc", "eis logistics llc", "magellan transport logistics", "same day delivery", "loop logistics corp", "uber freight us llc", "estes forwarding worldwide", "dynamicfreight", "mcleod expedite", "1-way express", "priority 1 inc", "creekside cargo, inc.", "help logistics, inc.", "logistic dynamics, inc", "accellerare transportation movement llc", "fifth wheel freight", "ground freight solutions", "mcclays logistics usa llc", "tenpoint logistics, llc", "miller logistics", "integrated connection llc", "hmd transport inc.", "non stop service", "priority logistics inc", "cap logistics", "area wide logistics llc","expedite plus", "traffix", "meta logistic solutions inc", "freight flex ", "mtc brokerage", "freight tec management group inc", "kag logistics", "tri-state expedited service, inc.", "anchor express inc", "cargobook", "strictly van transport", "vhi express/ transport", "midex corp ", "tat logistics inc.", "jacko logistics llc", "jung express", "talatrans worldwide corp", "omni logistics c/o tiger critical", "arl transport llc", "class transportation", "g&h transport", "straight shot express", "cs-1 transportation, inc","mpv express", "tag transportation", "watco", "flamekeeperlogistics dba optimistfamily", "440 transit", "load smart", "storm logistics", "usko logistics, inc", "lenco", "absolute worldwide logistics", "armstrong transport services llc", "axis worldwide supply chain & logistics", "freeway international logistics", "merit freight systems", "rozafa transportation services inc", "xpo logistics llc", "best bay logistics inc", "top shelf expediting", "cargobarn inc", "v3 transportation", "virnich corporation", "trinity logistics inc", "candor expedite inc","andrey's delivery express ", "ace logistics, inc.", "alliance shippers, inc.","par logistics","fastmore logistics","brock transportation llc", "mountainmovers transp. & logistics", "am trans expedite", "fedex custom critical", "gsa transportation, llc", "safe express solutions llc", "malark logistics", "swift & sound logistics llc", "speed brokerage llc"].map(name => name.toLowerCase().trim());
    const doNotUseCustomers = ["ep america dba xpd global", "yellow diamond consultants llc","j b hunt transport inc", "blx inc","nln brokerage", "nolan transportation group, inc"].map(name => name.toLowerCase().trim());

    // Function to set background color based on customer status
    const setColor = (cell, name) => {
        name = name.toLowerCase().replace(/\s+|\u00a0/g, ' ').trim(); // Clean up whitespace and special characters
        console.log(`Checking company name: '${name}'`);

        if (currentCustomers.includes(name)) {
            cell.style.backgroundColor = '#90ee90'; // Light Green
        } else if (potentialCustomers.includes(name)) {
            cell.style.backgroundColor = '#65bad6'; // Light Blue
        } else if (doNotUseCustomers.includes(name)) {
            cell.style.backgroundColor = '#f77272'; // Red
        } else {
            console.log(`No match for: '${name}'`);
        }
    };

    const applyColors = () => {
        const table = document.getElementById('my-table-id');
        if (!table) {
            console.error('Table with id "my-table-id" not found.');
            return;
        }
        console.log('Table found, applying colors...');

        const rows = table.getElementsByTagName('tr');
        console.log(`Total rows found: ${rows.length}`);
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            if (cells.length > 8) {
                const companyCell = cells[8]; // Company column index
                setColor(companyCell, companyCell.textContent);
            } else {
                console.error('Unexpected cell count in row.');
            }
        }
    };

    // Check every second if the table has loaded
    const checkTableInterval = setInterval(function() {
        console.log('Checking for table...');
        applyColors();
    }, 1000); // Check every 1000 milliseconds
})();

// ==UserScript==
// @name         Date Time Icon Modifier


(function() {
    'use strict';

    // Function to check and modify date and time cells for future dates
    function highlightFutureDates() {
        const rows = document.querySelectorAll('#my-table-id tbody tr');
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of the day for comparison

        rows.forEach((row) => {
            const dateTimeCell = row.cells[4]; // Targeting the 9th cell directly
            if (dateTimeCell) {
                const dateTimeText = dateTimeCell.textContent.trim();
                const dateTimeParts = dateTimeText.split(' ');
                if (dateTimeParts.length === 2) {
                    const datePart = dateTimeParts[0].split('/');
                    const timePart = dateTimeParts[1].split(':');

                    // Reformat the date to ISO standard to avoid parsing issues
                    const formattedDate = `${datePart[2]}-${datePart[0].padStart(2, '0')}-${datePart[1].padStart(2, '0')}T${timePart[0].padStart(2, '0')}:${timePart[1].padStart(2, '0')}`;
                    const cellDate = new Date(formattedDate);
                    cellDate.setHours(0, 0, 0, 0); // Normalize cellDate to start of that day

                    // Check if the date is after today
                    if (cellDate > today) {
                        dateTimeCell.style.backgroundColor = 'yellow'; // Highlight in yellow
                    } else {
                        dateTimeCell.style.backgroundColor = ''; // Remove any highlight if not in the future
                    }
                }
            }
        });
    }

    // Apply the highlight repeatedly every 5 seconds
    setInterval(highlightFutureDates, 5000);

    // Optionally, you might still want to run the highlight function immediately when the script loads
    highlightFutureDates();
})();


// ==UserScript==
// @name         Color Code States  - DONT DELETE


(function() {
    'use strict';

    // Define your color coding here with lighter shades
    const colorCoding = {
        'IL': '#90ee90', // light green
        'IN': '#90ee90', // light green
        'KY': '#90ee90', // light green
        'MI': '#90ee90', // light green
        'OH': '#90ee90', // light green
        'WI': '#90ee90', // light green
        'DE': '#65bad6', // light blue
        'DC': '#65bad6', // light blue
        'GA': '#65bad6', // light blue
        'IA': '#65bad6', // light blue
        'KS': '#65bad6', // light blue
        'MD': '#65bad6', // light blue
        'MN': '#65bad6', // light blue
        'MO': '#65bad6', // light blue
        'NJ': '#65bad6', // light blue
        'NY': '#65bad6', // light blue
        'NC': '#65bad6', // light blue
        'PA': '#65bad6', // light blue
        'TN': '#65bad6', // light blue
        'VA': '#65bad6', // light blue
        'AL': '#f5f590', // light yellow
        'AR': '#f5f590', // light yellow
        'CT': '#f5f590', // light yellow
        'ME': '#f5f590', // light yellow
        'MA': '#f5f590', // light yellow
        'NE': '#f5f590', // light yellow
        'NH': '#f5f590', // light yellow
        'OK': '#f5f590', // light yellow
        'RI': '#f5f590', // light yellow
        'SC': '#f5f590', // light yellow
        'TX': '#f5f590', // light yellow
        'VT': '#f5f590', // light yellow
        'WV': '#f5f590', // light yellow
        'AZ': '#eda464', // peach (light orange)
        'CA': '#eda464', // peach
        'CO': '#eda464', // peach
        'FL': '#eda464', // peach
        'LA': '#eda464', // peach
        'MS': '#eda464', // peach
        'NM': '#eda464', // peach
        'ND': '#eda464', // peach
        'SD': '#eda464', // peach
        'ID': '#f77272', // light red
        'MT': '#f77272', // light red
        'NV': '#f77272', // light red
        'OR': '#f77272', // light red
        'UT': '#f77272', // light red
        'WA': '#f77272', // light red
        'WY': '#f77272', // light red
        'AK': '#d3d3d3' // light grey (for black)
    };

    // This function applies the color coding to the cells
    function colorCodeCells() {
        const rows = document.querySelectorAll('#my-table-id tbody .tr-loads');

        rows.forEach(row => {
            const puCityCell = row.querySelector('td:nth-child(2)');
            const delCityCell = row.querySelector('td:nth-child(4)');

            [puCityCell, delCityCell].forEach(cell => {
                if (cell && cell.textContent) {
                    const match = cell.textContent.match(/, ([a-z]{2}) \d{5}/);
                    if (match) {
                        const stateAbbr = match[1].toUpperCase();
                        if (colorCoding[stateAbbr]) {
                            cell.style.backgroundColor = colorCoding[stateAbbr];
                        }
                    }
                }
            });
        });
    }

    // Apply the color coding function every 5 seconds to handle dynamic content
    setInterval(colorCodeCells, 5000);
})();


// ==UserScript==
// @name         Load Posted Time Expiry


(function() {
    'use strict';

    // Wait until the DOM is fully loaded
    window.addEventListener('load', function() {
        // Function to parse date and time from the given text
        function parseDateTime(dateTimeStr) {
            // Ensuring the format is correct for parsing
            var dtParts = dateTimeStr.trim().split(' ');
            var dateParts = dtParts[0].split('/');
            var timeParts = dtParts[1].split(':');
            // Create a new Date object using extracted parts
            return new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
        }

        // Function to update row colors based on the comparison of dates
        function updateRowColors() {
            const activeRow = document.querySelector('#my-table-id tbody tr.active');
            if (!activeRow) return; // Exit if no active row

            const firstTableDateTimeStr = activeRow.children[4].textContent; // PU TIME
            const firstTableDateTime = parseDateTime(firstTableDateTimeStr);

            document.querySelectorAll('#table_detail tbody tr').forEach(row => {
                const secondTableDateTimeStr = row.children[5].textContent; // AVAILABLE FROM
                const secondTableDateTime = parseDateTime(secondTableDateTimeStr);

                if (secondTableDateTime > firstTableDateTime) {
                    row.style.backgroundColor = 'red';
                } else {
                    row.style.backgroundColor = ''; // Reset background color if condition is not met
                }
            });
        }

        // Use a MutationObserver to handle dynamic content changes in the second table
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    updateRowColors();
                }
            });
        });

        // Start observing the second table for changes
        const config = { childList: true, subtree: true };
        const targetNode = document.getElementById('table_detail').querySelector('tbody');
        observer.observe(targetNode, config);

        // Also update colors when first table rows are clicked
        document.querySelectorAll('#my-table-id tbody tr').forEach(row => {
            row.addEventListener('click', function() {
                // Delay to ensure 'active' class and data updates
                setTimeout(updateRowColors, 100);
            });
        });
    });
})();

// Fix for when script stops working.

(function() {
    'use strict';

    function initScript() {
        const footer = document.querySelector('footer'); // Adjust selector if needed
        if (footer) {
            footer.style.display = 'none';
        }

        // Additional initialization logic here
    }

    // Check for footer element repeatedly until found
    function waitForElementAndInit() {
        if (document.querySelector('footer')) {
            initScript();
        } else {
            setTimeout(waitForElementAndInit, 500); // Check every 500ms
        }
    }

    window.addEventListener('load', waitForElementAndInit);
})();


