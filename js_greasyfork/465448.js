// ==UserScript==
// @name         FT Netdown Marco's Toggle
// @namespace    http://tampermonkey.net/
// @author       Greg
// @version      1.1
// @description  Internal Userscript.
// @match        https://info.foodtecsolutions.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465448/FT%20Netdown%20Marco%27s%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/465448/FT%20Netdown%20Marco%27s%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleRows() {
        const rows = document.querySelectorAll("tr.even-row, tr.odd-row");
        const searchText = "Marco's";
        rows.forEach(row => {
            const anchor = row.querySelector("td a");
            if (anchor && anchor.innerText.includes(searchText)) {
                row.style.display = row.style.display === "none" ? "" : "none";
            }
        });
    }

    const button = document.createElement("button");
    button.innerText = "Toggle Marco's";
    button.id = "toggle-marcos-button";
    button.addEventListener("click", toggleRows);

    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "10px";
    div.style.right = "10px";
    div.appendChild(button);

    document.body.appendChild(div);

    button.addEventListener("click", function() {
        const isToggledOn = button.style.backgroundColor === "red";
        button.style.backgroundColor = isToggledOn ? "green" : "red";
    });
})();


