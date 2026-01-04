// ==UserScript==
// @name        Barcode Modifier General
// @version      1.0
// @description  Automatically modifies barcode input on bgmdolly.gminvent.fr
// @match        *://bgmdolly.gminvent.fr/*
// @grant        none
// @namespace https://greasyfork.org/users/1456248
// @downloadURL https://update.greasyfork.org/scripts/532429/Barcode%20Modifier%20General.user.js
// @updateURL https://update.greasyfork.org/scripts/532429/Barcode%20Modifier%20General.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey script loaded on bgmdolly.gminvent.fr");

    function simulateCarriageReturn(inputField) {
        inputField.value += "\r";
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("Injected raw carriage return and dispatched input/change events.");
    }

    document.addEventListener("keydown", function (event) {
        const inputFields = document.querySelectorAll("input[id$='input']");
        const inputField = Array.from(inputFields).find(field => field === event.target);

        if (!inputField) {
            console.log("Error: No matching input field found.");
            return;
        }

        console.log(`Key pressed: "${event.key}" on field ID: ${inputField.id}`);

        if (event.key === "Tab") {
            event.preventDefault();
            event.stopImmediatePropagation();

            let barcode = inputField.value.trim();
            console.log("Original barcode:", barcode);

            let modifiedBarcode = null;

            // Case 1: Starts with "la", "re", "ch", "cm" followed by digits
            const match = barcode.match(/^(la|re|ch|cm)(\d+)$/i);
            if (match) {
                const prefix = match[1];
                const digits = match[2];
                const totalLength = 10;
                const paddedDigits = digits.padStart(totalLength - prefix.length, '0');
                modifiedBarcode = "SEMLG" + prefix + paddedDigits;
                console.log("Matched prefix case → transformed to:", modifiedBarcode);
            }

            // Case 2: Starts with "A "
            else if (barcode.startsWith("A ")) {
                modifiedBarcode = "cmdb0a000" + barcode.substring(2);
                console.log("Matched 'A ' case → transformed to:", modifiedBarcode);
            }

            if (modifiedBarcode !== null) {
                inputField.value = modifiedBarcode;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log("Modified barcode applied and events dispatched.");
            } else {
                console.log("No matching pattern. No transformation applied.");
            }

            simulateCarriageReturn(inputField);
        }
    });
})();
