// ==UserScript==
// @name         [Bzimor] Open All Bazaars
// @namespace    https://github.com/TravisTheTechie
// @version      1.0
// @description  Opens up multiple bazaars in Torn that match your criteria on Bzimor. 
// @author       Travis Smith
// @match        https://torn.bzimor.dev/items/bazaar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bzimor.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531364/%5BBzimor%5D%20Open%20All%20Bazaars.user.js
// @updateURL https://update.greasyfork.org/scripts/531364/%5BBzimor%5D%20Open%20All%20Bazaars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const numbersInUrl = window.location.href.replace(/\D/g, "");

    if (numbersInUrl == "") return;

    const itemId = parseInt(numbersInUrl);

    const controlsDiv = document.createElement("div");
    controlsDiv.id = "automation-controls";
    controlsDiv.style.paddingTop = "10px";
    controlsDiv.style.paddingBottom = "10px";

    const openAllBtn = document.createElement("button");
    openAllBtn.onclick = openAll;
    openAllBtn.textContent = "Open all Bazaars";

    const skipOneDollarLabel = document.createElement("label");
    skipOneDollarLabel.textContent = "Skip $1 Entries";
    skipOneDollarLabel.style.paddingLeft = "10px";
    const skipOneDollarCheckbox = document.createElement("input");
    skipOneDollarCheckbox.type = "checkbox";
    skipOneDollarCheckbox.checked = localStorage.getItem(`${itemId}_skip_one_dollar`) || false;

    const maxValueLabel = document.createElement("label");
    maxValueLabel.textContent = "Max cost to open";
    maxValueLabel.style.paddingLeft = "10px";
    const maxValueInput = document.createElement("input");
    maxValueInput.type = "number";
    maxValueInput.value = localStorage.getItem(`${itemId}_max_value`);

    [
        openAllBtn,
        skipOneDollarLabel,
        skipOneDollarCheckbox,
        maxValueLabel,
        maxValueInput,
    ].forEach(el => controlsDiv.appendChild(el));


    const stockWrapper = document.querySelector("#stocks_wrapper");

    if (stockWrapper) {
        stockWrapper.insertAdjacentElement('beforebegin', controlsDiv);
    }


    function openAll() {
        openAllBtn.disabled = true;
        const dataRows = document.querySelectorAll("#stocks_wrapper .dataTables_scrollBody tbody tr");
        let sleep = 250;

        // save settings
        localStorage.setItem(`${itemId}_skip_one_dollar`, skipOneDollarCheckbox.checked);
        if (maxValueInput.value != null) {
            localStorage.setItem(`${itemId}_max_value`, maxValueInput.value);
        } else {
            localStorage.removeItem(`${itemId}_max_value`);
        }

        for(const row of dataRows) {
            const elements = row.children[0].children;
            const url = elements[elements.length - 1].href;
            const playerId = parseInt(url.replace(/\D/g, "")); // replace non-digits
            const now = new Date();
            const anHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Current time minus one hour
            const value = parseInt(row.children[2].textContent.replace(/\D/g, ""));

            if (new Date(localStorage.getItem(`visit_${playerId}`) || 0) < anHourAgo) {
                if (skipOneDollarCheckbox.checked && value == 1) continue;
                if (maxValueInput.value != null && value > maxValueInput.value) continue;

                localStorage.setItem(`visit_${playerId}`, now);
                setTimeout(() => window.open(url, "_blank"), sleep);
                sleep += 50;
            }
        }
        setTimeout(() => { openAllBtn.disabled = false; }, sleep + 50);
    }
})();