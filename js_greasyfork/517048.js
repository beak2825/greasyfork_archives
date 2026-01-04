// ==UserScript==
// @name            Solution Hub Provider Backend
// @description     Adds functionality to the Solution Hub Provider Backend
// @author          mykarean
// @version         20241112
// @match           https://provider.solutionhub.oxid-esales.com/admin/*
// @icon            https://icons.duckduckgo.com/ip2/oxid-esales.com.ico
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @license         GPL3
// @noframes
// @namespace https://greasyfork.org/users/1367334
// @downloadURL https://update.greasyfork.org/scripts/517048/Solution%20Hub%20Provider%20Backend.user.js
// @updateURL https://update.greasyfork.org/scripts/517048/Solution%20Hub%20Provider%20Backend.meta.js
// ==/UserScript==

"use strict";

function waitForElm(selector, index = 0) {
    return new Promise((resolve) => {
        if (document.querySelectorAll(selector)[index]) {
            return resolve(document.querySelectorAll(selector)[index]);
        }

        const observer = new MutationObserver((mutations, me) => {
            if (document.querySelectorAll(selector)[index]) {
                resolve(document.querySelectorAll(selector)[index]);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

function disablePagination() {
    let entriesPerPageElement = document.querySelector("#crudTable_length > label > select");

    if (entriesPerPageElement != null && entriesPerPageElement.value != -1) {
        entriesPerPageElement.value = -1;
        entriesPerPageElement.dispatchEvent(
            new Event("change", {
                bubbles: true,
            })
        );
    }

    if (entriesPerPageElement != null && entriesPerPageElement.value != -1) {
        entriesPerPageElement.value = -1;
        entriesPerPageElement.dispatchEvent(
            new Event("change", {
                bubbles: true,
            })
        );
    }
}

function createFilterButtons() {
    if (window.location.href.match(/admin\/solution/)) {
        GM_addStyle(`
        a#crudTable_reset_button {
            margin-left: 0.6rem !important;
        }
   `);

        waitForElm("#datatable_info_stack").then((element) => {
            let targetElement = element;

            // Filter Button
            let filterLink = document.createElement("a");
            filterLink.href = "#";
            filterLink.classList.add("ml-1");
            filterLink.id = "crudTable_filter_button";
            filterLink.textContent = "Filter";

            // Button event
            filterLink.addEventListener("click", function (event) {
                event.preventDefault();
                filterRows();
            });

            // Reset Filter Button
            let resetLink = document.createElement("a");
            resetLink.href = "#";
            resetLink.classList.add("ml-1");
            resetLink.id = "crudTable_reset_button";
            resetLink.textContent = "DeFilter";

            // Reset Filter Button event
            resetLink.addEventListener("click", function (event) {
                event.preventDefault();
                resetRows();
            });

            // element to insert the new buttons into
            let smallElement = document.createElement("small");
            smallElement.id = "filterElements";
            smallElement.appendChild(filterLink);
            smallElement.appendChild(resetLink);
            targetElement.insertAdjacentElement("afterend", smallElement);

            // execute Filter
            function filterRows() {
                let table = document.querySelector("table#crudTable");
                let rows = table.querySelectorAll("tbody > tr");

                rows.forEach(function (row) {
                    let activeColumn = row.querySelector("td:nth-child(3)").innerText;
                    let checkColumn = row.querySelector("td:nth-child(6)").innerText;

                    if (activeColumn !== "active" || checkColumn !== "pending") {
                        row.style.display = "none";
                    }
                });
            }

            // reset filter
            function resetRows() {
                let table = document.querySelector("table#crudTable");
                if (table) {
                    let rows = table.querySelectorAll("tr:not(:first-child)");
                    rows.forEach(function (row) {
                        row.style.display = "";
                    });
                }
            }
        });
    }
}

function main() {
    disablePagination();
    createFilterButtons();
}

main();