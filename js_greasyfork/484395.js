// ==UserScript==
// @name         Artfight Donation Calculator
// @namespace    none
// @version      2024-01-09 2
// @description  none
// @author       nate
// @match        https://artfight.net/admin/donations*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484395/Artfight%20Donation%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/484395/Artfight%20Donation%20Calculator.meta.js
// ==/UserScript==

(function() {
    let total = 0;
    let rows = document.querySelectorAll(".table-striped tr");

    for (let row of rows)
    {
        let value = parseFloat(row.firstElementChild.innerHTML.substring(1));

        if (!isNaN(value)) {
            total += value
        }
    }

    console.log("$" + total);
    navigator.clipboard.writeText(total);

    alert("Copied to clipboard: " + total + "\n" +
        "Click OK to navigate to the next page.");

    let nextButton = document.querySelector(".pagination").lastElementChild.querySelector(".page-link");
    window.location.href = nextButton.href;
})();