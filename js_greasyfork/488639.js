// ==UserScript==
// @name         Tag Column for Kanka Entity Lists
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      4
// @description  Adds a Tags column to entity lists (in table view) in Kanka
// @author       Salvatos
// @match        https://app.kanka.io/*
// @exclude      https://app.kanka.io/*/bookmarks
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @connect      kanka.io
// @downloadURL https://update.greasyfork.org/scripts/488639/Tag%20Column%20for%20Kanka%20Entity%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/488639/Tag%20Column%20for%20Kanka%20Entity%20Lists.meta.js
// ==/UserScript==

/* You can set after which column Tags should go.
 * Note that not all entities have the same columns, so the safe choices are, from left to right:
 - ".col-checkbox"
 - ".dg-avatar"
 - ".dg-name"
 - ".dg-type"
 - ".dg-is_private"
 */
const insertAfter = ".dg-type";

// Try to run only in tabled entity lists
if (document.querySelector(".table-entities")) {
    // In Tags list, clarify the headings
    try {
        document.querySelector(".dg-tags").textContent = "Subtags";
    }
    catch {
    }

    // Add column heading
    document.querySelector(insertAfter).insertAdjacentHTML("afterend", `<th class="dg-tags dg-tagged hidden lg:table-cell">Tags</th>`);

    // Not every entity type displays the same columns, so we need to figure out the column number to populate the rows
    const colNum = document.querySelector(".dg-tagged").cellIndex;

    // Create a parser for our JSON/HTML
    const parser = new DOMParser();

    // Cycle through rows
    document.querySelectorAll(".table-striped tbody tr").forEach((row , index)=>{
        // Add a cell for Tags (.font-normal prevents bold in Nested view for items with descendants)
        row.querySelector('td:nth-child('+colNum+')').insertAdjacentHTML("afterend", `<td class="tooltip-tags font-normal truncated max-w-fit"></td>`);

        // Get the tooltip URL for the current row
        let tooltipURL = row.querySelector("a.name").dataset.url;

        // Fetch and parse the tooltip’s JSON
        var xhr = new XMLHttpRequest();
        xhr.open("GET", tooltipURL, true);
        xhr.responseType = 'json';
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let tooltipObject = parser.parseFromString(xhr.response[0], "text/html");

                    // Look for tags in tooltip and append if any
                    try {
                        let new_element = tooltipObject.querySelector(".tooltip-tags").cloneNode(true);
                        row.querySelector("td.tooltip-tags").append(new_element);
                    }
                    catch {
                    }
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    });
}