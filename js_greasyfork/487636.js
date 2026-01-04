// ==UserScript==
// @name         TW fake rally helper
// @namespace    http://tampermonkey.net/
// @version      2024-02-14
// @description  tribal wars cz fake rally helper
// @author       LZ
// @match        https://greasyfork.org/en
// @match        https://*/game.php*screen=place*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487636/TW%20fake%20rally%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/487636/TW%20fake%20rally%20helper.meta.js
// ==/UserScript==

(function() {
    function runScript() {

        // Function to simulate key press
        function simulateKeyPress(character) {
            // Create a new event
            var event = new KeyboardEvent('keydown', {
                key: character,
                keyCode: character.charCodeAt(0), // For '0', the keyCode is 48
                which: character.charCodeAt(0), // For compatibility with older browsers
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                metaKey: false,
                bubbles: true
            });

            // Dispatch the event on the document body
            document.body.dispatchEvent(event);
        }

        if (document.querySelector('span.groupJump')) {
            console.log("MOVE D");
            simulateKeyPress('D');
        }


        var firstCoordinateElement = document.querySelector('#menu_row2 td:nth-child(4) b'); // Origin village
        var firstCoordinate = extractCoordinates(firstCoordinateElement);
        var firstCoordinateStr = firstCoordinate.x + "|" + firstCoordinate.y
        console.log("Origin: " + firstCoordinateStr);

        console.log("sucAttackSent: " + localStorage.getItem("sucAttackSent"));
        var moveD = firstCoordinateStr.localeCompare(localStorage.getItem("sucAttackSent")) === 0;
        console.log(moveD);
        var submitAttackBtn = document.getElementById('troop_confirm_submit');
        if (submitAttackBtn) {
            submitAttackBtn.click(); // Clicks the button if it's not late night
        } else if (moveD) {
            console.log("MOVE D");
            simulateKeyPress('D');
        }

        simulateKeyPress('0');

        // Select all table rows in the table with class 'vis'
        const attackRows = document.querySelectorAll('.vis tr');

        // Initialize an array to hold the matched strings
        const attackingCoords = [];

        // Regular expression to match strings containing "Útok na" and extract coordinates
        const regex = /Útok na.*\((\d{3}\|\d{3})\)/;

        // Iterate over each row in the table
        attackRows.forEach(row => {
            // Convert row.cells from HTMLCollection to Array to use forEach
            const cells = Array.from(row.cells);

            // Iterate over each cell
            cells.forEach(cell => {
                // Check if the cell's text matches the pattern
                const match = cell.textContent.match(regex);
                if (match) {
                    // If a match is found, push the entire string for logging and extracting coordinates later
                    const crd = match[0].match(/\d{3}\|\d{3}/);
                    if (crd) {
                        attackingCoords.push(crd);
                        console.log("Pushed: " + crd);
                    }
                }
            });
        });

        // Function to determine if arrival time is between 23:00 and 8:00
        function isLateNight(arrivalTime) {
            var hours = arrivalTime.getHours();
            return hours >= 23 || hours < 8;
        }

        // Function to extract coordinates from HTML elements
        function extractCoordinates(element) {
            if (element == null) {
                return null;
            }
            var text = element.textContent;
            var match = text.match(/\((\d+)\|(\d+)\)/);
            if (match) {
                return { x: parseInt(match[1]), y: parseInt(match[2]) };
            }
        }

        // Convert string coordinate to object
        function convertStringToObject(coordinateString) {
            console.log("coordinateString: " + coordinateString);
            var parts = coordinateString.split('|');
            if (parts.length === 2) {
                return { x: parseInt(parts[0]), y: parseInt(parts[1]) };
            } else {
                return null;
            }
        }

        // Function to calculate distance between two coordinates
        function calculateDistance(coord1, coord2) {
            if (coord1 && coord2) {
                var dx = coord2.x - coord1.x;
                var dy = coord2.y - coord1.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
            return null;
        }

        // Extract coordinates
        var secondCoordinateElement = document.querySelector('.village-name'); // Destination village
        var secondCoordinate = extractCoordinates(secondCoordinateElement);
        console.log("Destination: " + secondCoordinate);

        console.log(attackingCoords);
        attackingCoords.forEach(str => {
            console.log("str: " + str);
            if (secondCoordinate && (secondCoordinate.x + "|" + secondCoordinate.y).localeCompare(str) === 0) {
                console.log("SKIPPED 0");
                //simulateKeyPress('0');
                setTimeout(simulateKeyPress('0'), 1000);
            } else {
                console.log("NOT SKIPPED 0");
            }
        })

        if (!firstCoordinate || !secondCoordinate) {
            console.error("Invalid coordinates");
            return;
        }

        var distance = calculateDistance(firstCoordinate, secondCoordinate);

        // Constants mapping
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

        var highestConstantValue = 0;

        Object.keys(constants).forEach(function(id) {
            var inputElement = document.getElementById(id);
            if (inputElement && inputElement.value && parseInt(inputElement.value) > 0) {
                var constantValue = constants[id];
                if (constantValue > highestConstantValue) {
                    highestConstantValue = constantValue;
                }
            }
        });

        var travelDurationMinutes = distance * highestConstantValue;
        var currentDate = new Date();
        var arrivalTime = new Date(currentDate.getTime() + (travelDurationMinutes * 60000));
        var lateNightArrival = isLateNight(arrivalTime);

        var targetAlreadyAttacked = false;
        // Function to manage coordinates in local storage
        function manageCoordinatesInLocalStorage(secondCoordinateStr) {
            var currentDate = new Date();
            var localStorageKey = currentDate.getFullYear() + "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                currentDate.getDate().toString().padStart(2, '0') + "-" +
                currentDate.getHours().toString().padStart(2, '0');
            var coordinatesList = JSON.parse(localStorage.getItem(localStorageKey)) || [];

            if (coordinatesList.includes(secondCoordinateStr)) {
                console.log("EXISTS");
                debugger;
                targetAlreadyAttacked = true;
            } else {
                coordinatesList.push(secondCoordinateStr);
                localStorage.setItem(localStorageKey, JSON.stringify(coordinatesList));
                targetAlreadyAttacked = false;
            }
        }

        // Function to click on the target element if it's not late night
        function clickIfNotLateNight() {
            var targetButton = document.getElementById('target_attack');
            if (!lateNightArrival && targetButton && highestConstantValue > 0) {
                var secondCoordinateStr = secondCoordinate.x + "|" + secondCoordinate.y;
                manageCoordinatesInLocalStorage(secondCoordinateStr); // Manage coordinates in local storage
                if (!targetAlreadyAttacked) {
                    localStorage.setItem("sucAttackSent", firstCoordinateStr);
                    debugger;
                    targetButton.click(); // Clicks the button if it's not late night
                    console.log("clicked");
                } else {
                    debugger;
                    setTimeout(simulateKeyPress('0'), 1000);
                }
            } else {
                //simulateKeyPress('0');
                debugger;
                setTimeout(simulateKeyPress('0'), 1000);
            }
        }

        // Click the button if not late night arrival
        clickIfNotLateNight();
    }

    runScript();
    setInterval(runScript, 2000); // Adjust the interval as per your requirement
})();
