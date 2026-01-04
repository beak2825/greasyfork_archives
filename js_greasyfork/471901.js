// ==UserScript==
// @name         PA+PH planner
// @namespace    torn.com
// @version      0.3
// @description  Automatically check the checkboxes for specified names on the faction crimes page
// @author       Ziticca+ChatGPT+Adobi
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471901/PA%2BPH%20planner.user.js
// @updateURL https://update.greasyfork.org/scripts/471901/PA%2BPH%20planner.meta.js
// ==/UserScript==

// Usage: Create and follow a hyperlink with this structure
// https://www.torn.com/factions.php?step=your&names=Adobi,Chedburn,Duke,Tiny#/tab=crimes
// It will check checkboxes for those names in the Political Assassination crime.
// Can be modified to pass a different crime as argument if there is demand for that functionality.

(function() {
    'use strict';
    // Sometimes the script won't do anything, because the page loaded too slow. Timeout for 2 seconds is my bandaid fix for that.
    setTimeout(() => {
        // Get the query parameter from the URL
        const query = new URLSearchParams(window.location.search);
        let names = query.get("names")
        if (names) {
            names = names.toLowerCase().split(",");
        }
        let ocType = query.get("octype")
        // Kill script if there is no names parameter
        if (!names) {
            return;
        }

        let memberList = document.querySelector(`div.plans-wrap[data-crime='${ocType}']`)

        for (let i = 0; i < names.length; i++) {
            const query = `div[data-crime='${ocType}'] input[id$='${names[i]}']`
            console.log(query)
            const checkbox = document.querySelector(query)
            if (checkbox) {
                checkbox.checked = true
            } else {
                let note = document.createElement("div")
                note.innerHTML = `Member <strong>${names[i]}</strong> not available for crime, please check your spreadsheet`
                note.style.padding = "1em"
                note.style.color = "#ff0000"
                memberList.insertBefore(note, memberList.firstChild)
            }

        }

        memberList.parentNode.classList.add("active")

        // Wait some time, then scroll to bottom of page.
        setTimeout(function() {
            window.scrollTo(0, document.body.scrollHeight);
        }, 800);
    }, 2000);
})();