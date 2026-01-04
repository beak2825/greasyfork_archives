// ==UserScript==
// @name         Remove oni-assistant Hydrocactus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       PicardOrion
// @license MIT
// @description  Removes Oxygen not included hydrocactus from Oni Assistant Food Calculator
// @match        https://oni-assistant.com/tools/foodcalculator
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513346/Remove%20oni-assistant%20Hydrocactus.user.js
// @updateURL https://update.greasyfork.org/scripts/513346/Remove%20oni-assistant%20Hydrocactus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const plantDumpElement = document.getElementById("plantdump");

    if (plantDumpElement) {
        // Parse the current content
        let n = JSON.parse(plantDumpElement.innerHTML);

        // Modify the array as needed
        const index = n.findIndex(item => item.Name === "Hydrocactus");
        if (index !== -1) {
            n.splice(index, 1); // Remove Hydrocactus
            console.log("Removed Hydrocactus from array 'n'");

            // Update the plantdump element with the modified array
            plantDumpElement.innerHTML = JSON.stringify(n);
        } else {
            console.log("Hydrocactus not found in array 'n'");
        }
    }
})();