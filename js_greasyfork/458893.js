// ==UserScript==
// @name         PA planner
// @namespace    adobi.nieltorn.com
// @version      0.3
// @description  Automatically check the checkboxes for specified names on the faction crimes page
// @author       ChatGPT+Adobi
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458893/PA%20planner.user.js
// @updateURL https://update.greasyfork.org/scripts/458893/PA%20planner.meta.js
// ==/UserScript==
 
// Usage: Create and follow a hyperlink with this structure. 4 names will plan a PA, 8 names will plan a PH.
// https://www.torn.com/factions.php?step=your&names=Adobi,Chedburn,Duke,Tiny#/tab=crimes
// It will check checkboxes for those names in the Political Assassination crime.
// Can be modified to pass a different crime as argument if there is demand for that functionality.
 
(function() {
    'use strict';
    // Sometimes the script won't do anything, because the page loaded too slow. Timeout for 2 seconds is my bandaid fix for that.
    setTimeout(() => {
        // Get the query parameter from the URL
        let query = new URLSearchParams(window.location.search);
        let names = query.get("names").toLowerCase().split(",");
        // Kill script if there is no names parameter
        if (!names) {
            return;
        }
 
        // Get all the checkboxes on the page
        let checkboxes = document.querySelectorAll("input[type='checkbox']");
        // Create an array to store the checked checkboxes for debugging purposes
        let checkedBoxes = [];
 
        // Loop through each checkbox
        for (let i = 0; i < checkboxes.length; i++) {
            // Get the checkbox's ID
            let checkboxId = checkboxes[i].id;
 
            // Check if the checkbox's ID contains any of the names
            for (let j = 0; j < names.length; j++) {
                if (names.length === 4 && checkboxId.indexOf("political-assassination-") === 0 && checkboxId.substring(24) === names[j]) {
                    // Check the checkbox
                    checkboxes[i].checked = true;
                    checkedBoxes.push(checkboxId);
                }
                if (names.length === 8 && checkboxId.indexOf("hijack-a-plane-") === 0 && checkboxId.substring(15) === names[j]) {
                    // Check the checkbox
                    checkboxes[i].checked = true;
                    checkedBoxes.push(checkboxId);
                }
 
            }
        }
        //alert(checkedBoxes.join(", "));

        let link = document.querySelector("li.item-wrap.last a.wai-support.t-blue.h");
        link.click();

        // Wait some time, then scroll to bottom of page.
        setTimeout(function() {
            window.scrollTo(0, document.body.scrollHeight);
        }, 800);
    }, 2000);
})();