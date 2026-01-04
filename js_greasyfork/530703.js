// ==UserScript==
// @name         Auto Barcode Modifier
// @version      1.0
// @description  Automatically modifies barcode input on bgmdolly.gminvent.fr
// @match        *://bgmdolly.gminvent.fr/*
// @grant        none
// @namespace https://greasyfork.org/users/1448578
// @downloadURL https://update.greasyfork.org/scripts/530703/Auto%20Barcode%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/530703/Auto%20Barcode%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded on bgmdolly.gminvent.fr");

    document.addEventListener("keydown", function(event) {
        // Select all input fields where ID ends with "input"
        const inputFields = document.querySelectorAll("input[id$='input']");

        // Find the active input field (the one where Enter was pressed)
        const inputField = Array.from(inputFields).find(field => field === event.target);

        if (!inputField) {
            console.log("Error: No matching input field found.");
            return;
        }

        // console.log("encontrado:", inputField.id);

        if (event.key === "Enter") {
            let barcode = inputField.value;
            console.log("Current barcode value:", barcode);

            if (barcode.startsWith("A ")) {
                console.log("Barcode starts with 'A ', modifying it...");

                event.preventDefault(); // **STOP the original Enter from executing**
                event.stopImmediatePropagation(); // **Ensures no other event listeners process Enter**

                // **Modify barcode (Remove "A " and add "cmdb0a000" as prefix)**
                let modifiedBarcode = "cmdb0a000" + barcode.substring(2);
                console.log("Modified barcode:", modifiedBarcode);

                // **Set the new modified barcode**
                inputField.value = modifiedBarcode;

                // **Force a new Enter keypress AFTER modification**
                setTimeout(() => {
                    let enterEvent = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    inputField.dispatchEvent(enterEvent); // **Simulated Enter**
                    console.log("Simulated Enter key press.");
                }, 10); // Small delay ensures value updates before new Enter
            } else {
                console.log("Barcode does not start with 'A ', proceeding with normal Enter.");
            }
        }
    });

})();
