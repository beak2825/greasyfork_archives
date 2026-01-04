// ==UserScript==
// @name         TW rally helper
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  tribal wars cz rally
// @author       LZ
// @match        https://greasyfork.org/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*/game.php*screen=place*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486982/TW%20rally%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486982/TW%20rally%20helper.meta.js
// ==/UserScript==

(function() {

    function runScript() {
    // Function to format date and time
    function formatDateTime(date) {
        return 'dne ' + date.toLocaleDateString('cs-CZ') + ' v/ve ' + date.toLocaleTimeString('cs-CZ');
    }

    // Function to determine if arrival time is between 23:00 and 8:00
    function isLateNight(arrivalTime) {
        var hours = arrivalTime.getHours();
        return hours >= 23 || hours < 8;
    }

    // Function to extract coordinates from HTML elements
    function extractCoordinates(element) {

        if(element == null) {
            return null;
        }

        var text = element.textContent;
        var match = text.match(/\((\d+)\|(\d+)\)/);
        if (match) {
            return {
                x: parseInt(match[1]),
                y: parseInt(match[2])
            };
        }
    }

    // Function to calculate distance between two coordinates
    function calculateDistance(coord1, coord2) {
        if (coord1 && coord2) { // Check if both coordinates are valid
            var dx = coord2.x - coord1.x;
            var dy = coord2.y - coord1.y;
            return Math.sqrt(dx*dx + dy*dy); // Return distance as a floating-point number
        }
        return null; // Return null if any coordinate is invalid
    }

    // Get the HTML elements representing the coordinates
    var firstCoordinateElement = document.querySelector('#menu_row2 td:nth-child(4) b');
    var secondCoordinateElement = document.querySelector('.village-name');

    // Extract coordinates from the elements
    var firstCoordinate = extractCoordinates(firstCoordinateElement);
    var secondCoordinate = extractCoordinates(secondCoordinateElement);

    // Check if both coordinates are valid
    if (!firstCoordinate || !secondCoordinate) {
        console.error("Invalid coordinates");
        return;
    }

    // Calculate the distance
    var distance = calculateDistance(firstCoordinate, secondCoordinate);

    // Define an object that maps input IDs to their corresponding constant values
    var constants = {
        'unit_input_spear': 18,
        'unit_input_sword': 22,
        'unit_input_axe': 18,
        'unit_input_spy': 9,
        'unit_input_light': 10,
        'unit_input_heavy': 11,
        'unit_input_ram': 30,
        'unit_input_catapult': 30,
        'unit_input_snob': 35
    };

    // Initialize a variable to store the highest constant value
    var highestConstantValue = 0;

    // Iterate through each input element
    Object.keys(constants).forEach(function(id) {
        // Get the input element by its ID
        var inputElement = document.getElementById(id);

        // Check if the input element exists and has a value greater than 0
        if (inputElement && inputElement.value && parseInt(inputElement.value) > 0) {
            // Get the constant value corresponding to the input ID
            var constantValue = constants[id];

            // Update the highest constant value if the current constant value is greater
            if (constantValue > highestConstantValue) {
                highestConstantValue = constantValue;
            }
        }
    });

    // Calculate the duration of travel in minutes
    var travelDurationMinutes = distance * highestConstantValue;

    // Function to format duration
    function formatDuration(hours, minutes, seconds) {
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    // Calculate duration components
    var travelDurationHours = Math.floor(travelDurationMinutes / 60);
    var travelDurationMinutesRemainder = Math.floor(travelDurationMinutes % 60);
    var travelDurationSeconds = Math.floor((travelDurationMinutes % 1) * 60);

    // Format duration
    var formattedDuration = formatDuration(travelDurationHours, travelDurationMinutesRemainder, travelDurationSeconds);

    // Get the current date and time
    var currentDate = new Date();

    // Calculate the arrival time by adding the travel duration to the current date and time
    var arrivalTime = new Date(currentDate.getTime() + (travelDurationMinutes * 60000)); // Convert travel duration to milliseconds

    // Format arrival time
    var formattedArrivalTime = formatDateTime(arrivalTime);

    // Check if arrival time is late night
    var lateNightArrival = isLateNight(arrivalTime);

     // Get the target div
    var targetDiv = document.getElementById('command-form-warning');

    // If arrival time is late night, format it red and add error message
    var arrivalTimeHtml = formattedArrivalTime;
    if (lateNightArrival) {
        arrivalTimeHtml = '<span style="color: red;">' + arrivalTimeHtml + '</span>';
    } else {
        // If not late night, remove error message if exists
        var errorMessageElement = document.querySelector('.error');
        if (errorMessageElement) {
            errorMessageElement.remove();
        }
    }

    // Log the distance, arrival time, and duration of travel
    //console.log("Distance:", distance);
    //console.log("Arrival Time:", arrivalTimeHtml);
    //console.log("Duration of Travel:", formattedDuration);

    // Check if any element with the class "village-distance-calculated" exists
    var villageDistanceElement = document.querySelector('.village-distance-calculated');

    // If the element exists, remove it from the page
    if (villageDistanceElement) {
        villageDistanceElement.parentElement.remove();
    }

    // Clear the contents of the target div
    targetDiv.innerHTML = '';

    // Create a new div element for wrapping the village-distance span
    var travelInfoElementWrapper = document.createElement('div');

    // Create a new span element for displaying the calculated information
    var travelInfoElement = document.createElement('span');
    travelInfoElement.classList.add('village-distance-calculated');
    var lateNightArrivalHeader = lateNightArrival ? '<h3 class="error">Noční bonus aktivní!</h3>' : ''
    travelInfoElement.innerHTML =  lateNightArrivalHeader + '<strong>Vzdálenost:</strong> ' + distance.toFixed(2) + ' polí<br>' +
                                   '<strong>Čas příjezdu:</strong> ' + arrivalTimeHtml + '<br>' +
                                   '<strong>Trvání cesty:</strong> ' + formattedDuration;

    // Append the new span element to the wrapper div
    travelInfoElementWrapper.appendChild(travelInfoElement);

    // Insert the wrapper div below the target div
    targetDiv.insertAdjacentElement('afterend', travelInfoElementWrapper);
}

// Run the script initially
runScript();

// Run the script every 1 second
setInterval(runScript, 200);


})();