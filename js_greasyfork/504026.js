// ==UserScript==
// @name         [AO3] Collapsed Work Tags
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.1
// @description  Collapse work tags into categorized drop-down menus for easier reading and less space.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504026/%5BAO3%5D%20Collapsed%20Work%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/504026/%5BAO3%5D%20Collapsed%20Work%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const minTags = 0;

    const typeLabels = {
        "warnings": "Warnings",
        "relationships": "Relationships",
        "characters": "Characters",
        "freeforms": "Miscellaneous"
    }
    const works = document.querySelectorAll("ul.tags.commas");
    for (let work of works) {
        for (let type in typeLabels) {
            const tags = work.querySelectorAll(`li.${type}`);
            if (tags.length > minTags) {
                var dropdown = document.createElement("details");
                var label = document.createElement("summary");
                label.innerText = `${typeLabels[type]} (${tags.length})`;
                label.style.cursor = "pointer";
                label.style["user-select"] = "none";
                dropdown.style.padding = "0.33em";
                dropdown.style["margin-bottom"] = "0.33em";
                dropdown.appendChild(label);
                for (let tag of tags) {
                    dropdown.appendChild(tag);
                }
                work.appendChild(dropdown);
            }
        }
    }
})();