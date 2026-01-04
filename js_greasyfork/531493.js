// ==UserScript==
// @name         KNMI Temperature °C/°F Switcher (Scroll down to see table)
// @namespace    http://tampermonkey.net/
// @version      1.15 // Incremented version
// @description  Adds a C/F slider switch above the column containing the KNMI forecast table.
// @author       Patrick Smits / Google AI Studio
// @match        https://www.knmi.nl/nederland-nu/weer/verwachtingen*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU GPLv3
// @icon         https://cdn.worldvectorlogo.com/logos/knmi.svg
// @source       https://gitlab.com/psmits/own-scripts/-/blob/main/UserScripts/KNMI-Temperature-Switcher.user.js
// @homepageURL  https://greasyfork.org/en/scripts/531493-knmi-temperature-switch-slider-v1-7-above-table-column
// @supportURL   https://greasyfork.org/en/scripts/531493-knmi-temperature-switch-slider-v1-7-above-table-column/feedback

// @downloadURL https://update.greasyfork.org/scripts/531493/KNMI%20Temperature%20%C2%B0C%C2%B0F%20Switcher%20%28Scroll%20down%20to%20see%20table%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531493/KNMI%20Temperature%20%C2%B0C%C2%B0F%20Switcher%20%28Scroll%20down%20to%20see%20table%29.meta.js
// ==/UserScript==

/* global $ */ // This is an ESLint directive. It informs the linter that $ should be treated as a known global variable, preventing the no-undef (no undefined variable) error for $.

(function() {
    'use strict';

    // --- Selectors ---
    const tempElementsSelector = '.weather-forecast__temperature-range';
    // Selector for the column div containing the compact forecast table
    const tableColumnContainerSelector = '.col-sm-12.col-md-10.col-md-offset-1:has(.weather-forecast__table--compact)';

    // --- Storage & State ---
    const storageKey = 'displayFahrenheit_knmi_slider_table_col'; // Use a distinct key
    let displayFahrenheit = GM_getValue(storageKey, false);
    let switchCreated = false; // Flag to prevent multiple switches

    // --- Helper Functions ---

    function celsiusToFahrenheit(celsius) {
        if (celsius === null || isNaN(celsius)) return null;
        return (celsius * 9 / 5) + 32;
    }

    // Parses Celsius from text like "14°" or "0/3°"
    // Returns an array [celsius1, celsius2] (celsius2 is null for single values)
    function parseCelsius(text) {
        const values = [];
        // Remove degree/C/F symbols for easier parsing
        const cleanText = text.replace(/[°cCfF]/g, '');

        if (cleanText.includes('/')) {
            const parts = cleanText.split('/');
            values.push(parseFloat(parts[0]));
            values.push(parseFloat(parts[1]));
        } else {
            values.push(parseFloat(cleanText));
            values.push(null);
        }

        // Basic validation
        if (isNaN(values[0]) || (values[1] !== null && isNaN(values[1]))) {
            console.warn('KNMI Script: Could not parse Celsius from:', text);
            return [null, null]; // Indicate parsing failure
        }
        return values;
    }

    // --- Core Logic ---

    function updateTemperatures() {
        // console.log("KNMI Script: Updating temperatures. Fahrenheit:", displayFahrenheit); // Debug log
        $(tempElementsSelector).each(function() {
            const $el = $(this);
            let originalCelsius = $el.data('originalCelsius'); // Array [c1, c2]

            // If original data isn't stored yet, parse and store it
            if (originalCelsius === undefined) { // Check for undefined specifically
                const originalText = $el.text();
                originalCelsius = parseCelsius(originalText);
                // Store even if parsing failed (as [null, null]) to avoid re-parsing errors
                $el.data('originalCelsius', originalCelsius);
                 // Store original text too, for perfect restoration
                $el.data('originalText', originalText);
            }

            // Check if parsing was successful before attempting conversion
            if (!originalCelsius || originalCelsius[0] === null) {
                 // Restore original text if we somehow lost it or failed parsing
                if ($el.data('originalText')) { $el.text($el.data('originalText')); }
                return; // Skip elements we couldn't parse
            }

            const celsius1 = originalCelsius[0];
            const celsius2 = originalCelsius[1]; // Might be null

            if (displayFahrenheit) {
                const fahrenheit1 = celsiusToFahrenheit(celsius1);
                if (celsius2 !== null) {
                    const fahrenheit2 = celsiusToFahrenheit(celsius2);
                    $el.text(`${Math.round(fahrenheit1)}/${Math.round(fahrenheit2)}°F`);
                } else {
                    $el.text(`${Math.round(fahrenheit1)}°F`);
                }
            } else {
                // Restore from stored original text if available for perfect formatting,
                // otherwise reconstruct from stored numbers.
                 if ($el.data('originalText')) { $el.text($el.data('originalText')); }
                 else {
                     // Fallback reconstruction if original text somehow lost
                    if (celsius2 !== null) { $el.text(`${Math.round(celsius1)}/${Math.round(celsius2)}°`); }
                    else { $el.text(`${Math.round(celsius1)}°`); }
                 }
            }
        });
    }

     // Function to create the C/F toggle switch
    function createToggleSwitch() {
        if (switchCreated) return;

        // --- CSS for the Toggle Switch ---
        GM_addStyle(`
            /* Container for the switch, placed above the table's column */
            /* Container for the switch, now using column classes for layout */
            .temp-switch-placement-container {
                 /* display: block; - Let column classes handle display */
                 text-align: right;   /* Align the switch span to the right */
                 padding-bottom: 10px;/* Add space below the switch before the next element */
                 /* margin-bottom: 15px; - Replaced by padding-bottom */
                 /* padding-right: 5px; - Padding likely handled by column classes, remove if needed */
                 /* position: relative; - Removed, likely not needed */
            }
            /* The actual switch elements container */
            .temp-switch-container {
                display: inline-block; /* Keep switch elements together */
                vertical-align: middle;
                font-family: sans-serif;
                font-size: 0.9em;      /* Size adjustment */
                white-space: nowrap;
            }
            .temp-switch-label {
                display: inline-block;
                position: relative;
                width: 2.8em;
                height: 1.2em;
                background-color: #ccc;
                border-radius: 0.7em;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
                margin: 0 0.5em;
                vertical-align: middle;
            }
            .temp-switch-knob {
                display: block;
                position: absolute;
                width: 0.9em;
                height: 0.9em;
                background-color: white;
                border-radius: 50%;
                top: 0.15em;
                left: 0.15em;
                transition: transform 0.2s ease-in-out;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .temp-switch-checkbox {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
                vertical-align: middle;
            }
            .temp-switch-checkbox:checked + .temp-switch-label {
                background-color: #007BC7;
            }
            .temp-switch-checkbox:checked + .temp-switch-label .temp-switch-knob {
                transform: translateX(calc(2.8em - 1.1em - 0.15em)); /* 1.55em */
            }
            .temp-switch-text {
                 color: #555;
                 transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out;
                 font-weight: normal;
                 vertical-align: middle;
            }
            .temp-switch-text.active {
                 color: #000;
                 font-weight: bold;
            }
        `);

        // --- HTML Structure (Wrapped in a placement div) ---
        const placementContainer = $('<div class="temp-switch-placement-container col-sm-12 col-md-10 col-md-offset-1"></div>'); // Outer div for positioning
        const switchContainer = $('<span class="temp-switch-container"></span>'); // Inner span holds the switch parts
        const textC = $('<span class="temp-switch-text temp-switch-text-c">°C</span>');
        const textF = $('<span class="temp-switch-text temp-switch-text-f">°F</span>');
        const checkbox = $('<input type="checkbox" id="tempUnitToggle" class="temp-switch-checkbox">');
        const label = $('<label for="tempUnitToggle" class="temp-switch-label"><span class="temp-switch-knob"></span></label>');

        // Set initial state
        if (displayFahrenheit) { checkbox.prop('checked', true); textF.addClass('active'); }
        else { textC.addClass('active'); }

        // Append switch elements to the inner container
        switchContainer.append(textC).append(checkbox).append(label).append(textF);
        // Append the inner container to the outer placement container
        placementContainer.append(switchContainer);

        // Event Listener (remains the same)
        checkbox.on('change', function() {
            displayFahrenheit = $(this).prop('checked');
            GM_setValue(storageKey, displayFahrenheit);
            updateTemperatures();
            if (displayFahrenheit) { textF.addClass('active'); textC.removeClass('active'); }
            else { textC.addClass('active'); textF.removeClass('active'); }
        });

        // --- Add the switch to the page (Before the table's column container) ---
        const targetElement = $(tableColumnContainerSelector).first(); // Find the specific column div
        if (targetElement.length > 0) {
            // console.log("KNMI Script: Inserting switch before table column container:", targetElement);
            targetElement.before(placementContainer); // Use .before() on the column div
            switchCreated = true;
        } else {
             console.warn("KNMI Script: Target element for switch insertion ('" + tableColumnContainerSelector + "') not found.");
             // Fallback is effectively disabled as we don't set switchCreated = true
        }

         // Perform the initial update *after* the switch is created & state set
         // Ensure it runs only if switch was successfully placed
         if (switchCreated) {
            updateTemperatures();
         }
    }


    // --- Initialization with Wait ---
    const maxAttempts = 20;
    let attempts = 0;

    const checkInterval = setInterval(function() {
        attempts++;
        // console.log(`KNMI Script: Check attempt ${attempts}`);

        // Check if the target column container element exists
        const targetElementExists = $(tableColumnContainerSelector).first().length > 0;
        // Also ensure the elements we modify exist (optional but good practice)
        const forecastElementsExist = $(tempElementsSelector).length > 0;

        if (switchCreated) { // If already created by a previous check, stop.
             clearInterval(checkInterval);
             return;
        }

        if (targetElementExists && forecastElementsExist) {
            // console.log("KNMI Script: Target insertion point AND forecast elements found!");
            clearInterval(checkInterval); // Stop checking
            createToggleSwitch();       // Create SWITCH & run initial update
        }
         else if (attempts >= maxAttempts) {
            clearInterval(checkInterval); // Stop checking
            console.log("KNMI Script: Required elements for switch placement not found after multiple attempts.");
        }
    }, 500);

})();