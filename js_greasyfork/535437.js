// ==UserScript==
// @name         Search Bar for Booster Creator
// @namespace    https://github.com/encumber
// @version      2025-03-12
// @description  Search Bar for the Booster Creator on steam to make it easier to find the pack you are wanting to create
// @author       Nitoned
// @match        https://steamcommunity.com/tradingcards/boostercreator/
// @icon         https://community.fastly.steamstatic.com/public/images/economy/tradingcards/boostercreator_art.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535437/Search%20Bar%20for%20Booster%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/535437/Search%20Bar%20for%20Booster%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
    // Find the target select element
    let select = document.getElementById("booster_game_selector");
    if (!select) {
        console.warn("Select element with ID 'booster_game_selector' not found.");
        return;
    }

    // Find the reference div
    let referenceDiv = document.querySelector(".booster_game_selector");
    if (!referenceDiv) {
        console.warn("Div with class 'booster_game_selector' not found.");
        return;
    }

    // Create the search input
    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.style.width = "100%";
    searchInput.style.marginBottom = "5px";
    searchInput.style.padding = "5px";

    // Insert search bar after the div but before the select
    referenceDiv.insertAdjacentElement("afterend", searchInput);

    // Store original options
    let options = Array.from(select.options);

    // Add search functionality
    searchInput.addEventListener("input", function() {
        let searchTerm = this.value.toLowerCase();
        select.innerHTML = ""; // Clear existing options

        // Filter and re-add options that match search term
        options.forEach(option => {
            if (option.text.toLowerCase().includes(searchTerm)) {
                select.appendChild(option);
            }
        });
    });
})();

})();