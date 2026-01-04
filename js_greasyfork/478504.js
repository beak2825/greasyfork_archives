// ==UserScript==
// @name         Metric Unit Converter - AliExpress (Dark Mode)
// @namespace    CriminalMuppet
// @version      1.0
// @license MIT
// @description  Convert metric units to standard units and kilometers to miles per hour (km/h) with a convenient popup. Toggle the conversion tool using the hotkey Ctrl+Shift+X.
// @include https://www.aliexpress.us/*
// @include  https://www.aliexpress.com/*
// @include  https://*.aliexpress.*/*
// @downloadURL https://update.greasyfork.org/scripts/478504/Metric%20Unit%20Converter%20-%20AliExpress%20%28Dark%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478504/Metric%20Unit%20Converter%20-%20AliExpress%20%28Dark%20Mode%29.meta.js
// ==/UserScript==

(function() {
    // Create a popup element
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "10px";
    popup.style.right = "10px";
    popup.style.padding = "10px";
    popup.style.background = "#333"; // Dark background color
    popup.style.border = "1px solid #555"; // Dark border color
    popup.style.zIndex = "9999";
    popup.style.display = "none"; // Initially hide the popup

    // Add HTML content for the popup
    popup.innerHTML = `
        <input type="text" id="inputValue" placeholder="Enter value (metric)">
        <select id="fromUnit">
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="km">km/h</option>
        </select>
        <span>to</span>
        <select id="toUnit">
            <option value="inches">inches</option>
            <option value="feet">feet</option>
            <option value="mph">mph</option>
        </select>
        <button id="convertButton">Convert</button>
        <div id="result" style="color: #fff;"></div> <!-- Light text on dark background -->
    `;

    // Append the popup to the body
    document.body.appendChild(popup);

    // Add event listener to the hotkey combination (Ctrl+Shift+X)
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === "X") {
            togglePopup();
        }
    });

    // Function to toggle the popup visibility
    function togglePopup() {
        if (popup.style.display === "none" || popup.style.display === "") {
            popup.style.display = "block";
        } else {
            popup.style.display = "none";
        }
    }

    // Function to perform the conversion
    function convert() {
        const inputValue = document.getElementById("inputValue").value;
        const fromUnit = document.getElementById("fromUnit").value;
        const toUnit = document.getElementById("toUnit");
        const result = document.getElementById("result");

        const value = parseFloat(inputValue);

        if (!isNaN(value)) {
            let convertedValue = value;

            // Perform the metric to standard unit conversion
            if (fromUnit === "mm" && toUnit.value === "inches") {
                convertedValue = value * 0.0393701;
            } else if (fromUnit === "cm" && toUnit.value === "inches") {
                convertedValue = value * 0.393701;
            } else if (fromUnit === "m" && toUnit.value === "inches") {
                convertedValue = value * 39.3701;
            } else if (fromUnit === "km") {
                toUnit.value = "mph";
                convertedValue = value * 0.621371;
            } else if (fromUnit === "mm" && toUnit.value === "feet") {
                convertedValue = value * 0.00328084;
            } else if (fromUnit === "cm" && toUnit.value === "feet") {
                convertedValue = value * 0.0328084;
            } else if (fromUnit === "m" && toUnit.value === "feet") {
                convertedValue = value * 3.28084;
            }

            result.textContent = `${value} ${fromUnit} is approximately ${convertedValue.toFixed(2)} ${toUnit.value}.`;
        } else {
            result.textContent = "Invalid input. Please enter a valid number.";
        }
    }

    // Add event listener to the conversion button
    const convertButton = document.getElementById("convertButton");
    convertButton.addEventListener("click", convert);

    // Add event listener to the "fromUnit" select to update "toUnit" immediately
    const fromUnitSelect = document.getElementById("fromUnit");
    fromUnitSelect.addEventListener("change", () => {
        const selectedFromUnit = fromUnitSelect.value;
        const toUnitSelect = document.getElementById("toUnit");

        if (selectedFromUnit === "km") {
            toUnitSelect.value = "mph";
        }
    });

    // Add event listener to convert when hitting Enter in the value textbox
    const inputValueField = document.getElementById("inputValue");
    inputValueField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            convert();
        }
    });
})();
