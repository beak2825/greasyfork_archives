// ==UserScript==
// @name         Battery life search/filter
// @version      3
// @description  Adds a filter input to the top of GSMArena battery life test's table
// @author       You
// @match        https://www.gsmarena.com/battery-test*.php3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gsmarena.com
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1461061
// @downloadURL https://update.greasyfork.org/scripts/533647/Battery%20life%20searchfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/533647/Battery%20life%20searchfilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    input.filter {
        width: 100%;
        font-size: 16px;
        padding: 10px;
        border: 1px solid black;
        border-left: 0px;
        border-right: 0px;
        margin-bottom: 3px;

        &:focus {
            outline: 0px;
            border-color: red;
        }
    }

    table tr.hidden {
        display: none;
    }
    `);

    const table = getTable();

    const input = document.createElement("input");
    input.type = "text";
    input.className = "filter";
    input.placeholder = "Type words to filter this list; multiple values allowed separated by commas";

    input.addEventListener("keyup", filterList);

    table.parentNode.insertBefore(input, table);

    var savedFilter = window.localStorage.getItem("filter");
    if(savedFilter) {
        input.value = savedFilter;
        input.dispatchEvent(new Event("keyup"));
    }
})();

function filterList(event) {
    const table = getTable(),
          filterValue = document.querySelector("input.filter").value.trim(),
          filter = filterValue.toLowerCase().split(",").map((el) => el.trim());

    window.localStorage.setItem("filter", filterValue);

    for(var link of table.querySelectorAll("tr > td:first-child > a")) {
        const deviceName = link.innerText.toLowerCase(),
              row = link.closest("tr");

        if(filter.length == 0) {
            row.classList.remove("hidden");
        } else {
            filter.some((word) => deviceName.includes(word)) ? row.classList.remove("hidden") : row.classList.add("hidden");
        }
    }
}
function getTable() {
    return document.querySelector("#battery-table") || document.querySelector("table.keywords");
}