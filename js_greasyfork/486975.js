// ==UserScript==
// @name         Search box for filtering torrent tracker list in qBittorrent Web UI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a search box inside the filter wrapper to filter list elements in real-time
// @author       Haarrdy
// @match        http://localhost:8080/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486975/Search%20box%20for%20filtering%20torrent%20tracker%20list%20in%20qBittorrent%20Web%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/486975/Search%20box%20for%20filtering%20torrent%20tracker%20list%20in%20qBittorrent%20Web%20UI.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Function to filter list items based on the search box text
    function filterListItems() {
        const filterText = searchBox.value.toLowerCase();
        const listItems = document.querySelectorAll("#trackerFilterList li");

        // Hide or show list items based on if they contain the search box text
        listItems.forEach(item => {
            const text = item.textContent || item.innerText;
            if (text.toLowerCase().indexOf(filterText) > -1) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Function to match the search box visibility with the filter list visibility
    // (when hidden qBittorrent adds "invisible" class to the filter list)
    // Required because the search box is not a child of the filter list, and can't be either since
    // the filter list deletes and recreates its children upon certain events
    function toggleFilterDisplay(filterType) {
        const filterList = document.getElementById("trackerFilterList");
        if (!filterList) return;

        if (filterList.classList.contains("invisible")) {
            searchBox.style.display = "none";
        } else {
            searchBox.style.display = "";
        }
    }

    // Create and insert the search box element
    const searchBox = document.createElement("input");
    searchBox.setAttribute("type", "text");
    searchBox.setAttribute("placeholder", "Filter...");
    searchBox.setAttribute("id", "filterSearchBox");
    searchBox.style.margin = "5px 5px";
    searchBox.style.padding = "5px";
    searchBox.style.width = "calc(100% - 25px)"; // Adjusting width to prevent horizontal scrollbar

    // Try get parent of tracker filter list element, retry every 200ms until it's found
    // Necessary because the tracker filter list is usually created after the search box
    const interval = setInterval(() => {
        const filterList = document.getElementById("trackerFilterList");

        // If the filter list is not found, return and retry
        if (!filterList) return;

        // Filter list found!

        // Insert the search box before the filter list
        filterList.parentNode.insertBefore(searchBox, filterList);

        // Add event listener to the search box
        // This will call the filterListItems function every time the search box text changes
        searchBox.addEventListener("input", filterListItems);

        // Add event listener to the filter list visibility change (class change)
        // This will call the toggleFilterDisplay function every time the filter list visibility changes
        const observer = new MutationObserver(toggleFilterDisplay);
        observer.observe(filterList, { attributes: true });

        // Call the toggleFilterDisplay function once to set the initial visibility
        toggleFilterDisplay();

        // Stop the retry interval
        clearInterval(interval);
    }, 200);
})();