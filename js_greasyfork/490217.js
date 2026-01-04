// ==UserScript==
// @name         TheTVDB Hide Synopses from All Seasons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide episode synopses/descriptions from All Seasons pages on TheTVDB.com
// @author       xdpirate
// @license      GPLv3
// @match        https://thetvdb.com/series/*/allseasons/*
// @match        https://www.thetvdb.com/series/*/allseasons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thetvdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490217/TheTVDB%20Hide%20Synopses%20from%20All%20Seasons.user.js
// @updateURL https://update.greasyfork.org/scripts/490217/TheTVDB%20Hide%20Synopses%20from%20All%20Seasons.meta.js
// ==/UserScript==

let descriptions = document.querySelectorAll("div.col-xs-9 > p");
for(let i = 0; i < descriptions.length; i++) {
    descriptions[i].style.display = "none";

    let toggleNode = document.createElement("div");
    toggleNode.style = "cursor: pointer; border: 1px solid; border-radius: 10px; padding: 5px; width: fit-content; margin-top: 5px; margin-bottom: 5px;";
    toggleNode.innerText = "Toggle description";

    toggleNode.addEventListener("click", function() {
        if(this.nextElementSibling.style.display == "none") {
            this.nextElementSibling.style.display = "block";
        } else {
            this.nextElementSibling.style.display = "none"
        }
    });

    descriptions[i].insertAdjacentElement("beforebegin", toggleNode);
}
