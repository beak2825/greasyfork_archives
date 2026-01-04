// ==UserScript==
// @name         Fronius Celsius to Fahrenheit and Windspeed Converter
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version      1.2
// @description  Convert EU units to U.S. 2024-09-28
// @author       Mark Zinzow
// @match        https://www.solarweb.com/PvSystems/PvSystem*
// @icon         https://www.google.com/s2/favicons?sz=64&www.solarweb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510623/Fronius%20Celsius%20to%20Fahrenheit%20and%20Windspeed%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/510623/Fronius%20Celsius%20to%20Fahrenheit%20and%20Windspeed%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert Celsius to Fahrenheit
    function celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    // Function to convert m/s to mph
    function metersPerSecondToMph(mps) {
        return mps * 2.23694;
    }

    // Regular expressions to match temperatures in Celsius
    const celsiusRegex = /(-?\d+(\.\d+)?)\s*°?\s*C/g;

    // Function to replace Celsius temperatures with Fahrenheit
    function replaceCelsiusWithFahrenheit(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(celsiusRegex, (match, p1) => {
                const celsius = parseFloat(p1);
                const fahrenheit = celsiusToFahrenheit(celsius).toFixed(1);
                return `${fahrenheit}°F`;
            });
        } else {
            node.childNodes.forEach(replaceCelsiusWithFahrenheit);
        }
    }

    // Function to replace wind speeds in m/s with mph
    function replaceWindspeed() {
        const valueElements = document.querySelectorAll('.parameter-value');
        const unitElements = document.querySelectorAll('.parameter-unit');

        valueElements.forEach((valueElement, index) => {
            const unitElement = unitElements[index];
            if (unitElement && unitElement.textContent.trim() === 'm/s') {
                const mps = parseFloat(valueElement.textContent.trim());
                const mph = metersPerSecondToMph(mps).toFixed(1);
                valueElement.textContent = `${mph}`;
                unitElement.textContent = 'mph';
            }
        });
    }

    // Loop to ensure all temperatures and wind speeds are converted
    function convertAllValues() {
        const observer = new MutationObserver(() => {
            replaceCelsiusWithFahrenheit(document.body);
            replaceWindspeed();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        replaceCelsiusWithFahrenheit(document.body);
        replaceWindspeed();
    }

    // Start the conversion process
    convertAllValues();
})();