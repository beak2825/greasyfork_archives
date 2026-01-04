// ==UserScript==
// @name         Copy Google Maps Route Locations
// @version      1.3
// @description  Copies all locations from a Google Maps route to clipboard
// @author       carl
// @match        https://www.google.*/maps/*
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/184979
// @downloadURL https://update.greasyfork.org/scripts/528444/Copy%20Google%20Maps%20Route%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/528444/Copy%20Google%20Maps%20Route%20Locations.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function copyLocations() {
        let locations = [];
        document.querySelectorAll("[role='listitem'] input.tactile-searchbox-input").forEach(el => {
            let text = el.getAttribute("aria-label");
            if (text) locations.push(text.replace(/^(Start(?:ing point)? |Ziel |Destination )/, '').trim());
        });

        if (locations.length === 0) {
            return;
        }

        let output = locations.join("\n");
        try {
            GM_setClipboard(output);
        } catch (e) {
            console.error("Failed to copy locations!");
        }
    }

    function addButton() {
        let list = document.querySelector("ul.ODXihb");
        if (!list) return;

        let buttonItem = document.createElement("li");
        buttonItem.className = "bzdiDe L4t5Vb";

        let button = document.createElement("button");
        button.innerText = "Copy";
        button.className = "wR3cXd fontLabelMedium";
        button.onclick = copyLocations;

        buttonItem.appendChild(button);
        let lastItem = list.querySelector("li.bzdiDe.L4t5Vb");
        if (lastItem) {
            list.insertBefore(buttonItem, lastItem);
        } else {
            list.appendChild(buttonItem);
        }
    }

    setTimeout(addButton, 3000);
    document.addEventListener("DOMContentLoaded", addButton);
})();
