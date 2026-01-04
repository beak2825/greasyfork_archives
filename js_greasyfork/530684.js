// ==UserScript==
// @name         Osu! Beatmap Star Filter
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Integrates star rating, length, and ranked date filters into osu!'s built-in site filters.
// @author       YourName
// @match        https://osu.ppy.sh/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530684/Osu%21%20Beatmap%20Star%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/530684/Osu%21%20Beatmap%20Star%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Osu! Beatmap Star Filter script is running...");

    function convertToMinutes(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    function convertToRankedFormat(dateString) {
        let parts = dateString.split("-");
        return `${parts[1]}/${parts[0]}`; // Convert from YYYY-MM to MM/YYYY
    }

    function integrateFilters() {
        let filters = document.querySelectorAll(".beatmapsets-search-filter");
        let explicitContentFilter = null;

        filters.forEach(filter => {
            let header = filter.querySelector(".beatmapsets-search-filter__header");
            if (header && header.textContent.trim() === "Explicit Content") {
                explicitContentFilter = filter;
            }
        });

        if (!explicitContentFilter || document.getElementById("osu-custom-filters")) return;

        console.log("Explicit content filter found, adding custom filters below...");

        let customFilterDiv = document.createElement("div");
        customFilterDiv.id = "osu-custom-filters";
        customFilterDiv.className = "beatmapsets-search-filter beatmapsets-search-filter--grid";

        let filterHeader = document.createElement("span");
        filterHeader.className = "beatmapsets-search-filter__header";
        filterHeader.textContent = "Custom Filters";

        let filterItems = document.createElement("div");
        filterItems.className = "beatmapsets-search-filter__items";
        filterItems.style.display = "flex";
        filterItems.style.gap = "10px";
        filterItems.style.alignItems = "center";

        function createFilterInput(labelText) {
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.gap = "5px";

            let label = document.createElement("span");
            label.textContent = labelText + ":";
            label.style.color = "white";

            let minInput = document.createElement("input");
            let maxInput = document.createElement("input");
            minInput.type = maxInput.type = "text";
            minInput.placeholder = "Min";
            maxInput.placeholder = "Max";
            minInput.className = maxInput.className = "beatmapsets-search-input";
            minInput.style.width = maxInput.style.width = "60px";
            minInput.style.backgroundColor = maxInput.style.backgroundColor = "hsl(200, 10%, 30%)";
            minInput.style.border = maxInput.style.border = "1px solid hsl(200, 10%, 20%)";
            minInput.style.padding = maxInput.style.padding = "5px";
            minInput.style.borderRadius = maxInput.style.borderRadius = "5px";

            [minInput, maxInput].forEach(input => {
                input.addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        applyFilters();
                    }
                });
            });

            container.appendChild(label);
            container.appendChild(minInput);
            container.appendChild(maxInput);
            return { container, minInput, maxInput };
        }

        let starFilter = createFilterInput("Stars");
        let lengthFilter = createFilterInput("Length");
        let rankedFilter = createFilterInput("Ranked Date");

        let applyButton = document.createElement("button");
        applyButton.textContent = "Apply";
        applyButton.style.padding = "5px 10px";
        applyButton.style.border = "none";
        applyButton.style.background = "#ff66aa";
        applyButton.style.color = "white";
        applyButton.style.borderRadius = "5px";
        applyButton.style.cursor = "pointer";
        applyButton.style.marginLeft = "10px";
        applyButton.addEventListener("click", applyFilters);

        function populateFiltersFromURL() {
            let queryParams = new URLSearchParams(window.location.search);
            let query = queryParams.get("q");
            if (!query) return;

            let starMatch = query.match(/stars>=(\d+(\.\d+)?)/);
            if (starMatch) starFilter.minInput.value = starMatch[1];

            let starMaxMatch = query.match(/stars<=(\d+(\.\d+)?)/);
            if (starMaxMatch) starFilter.maxInput.value = starMaxMatch[1];

            let lengthMinMatch = query.match(/length>=(\d+)/);
            if (lengthMinMatch) lengthFilter.minInput.value = convertToMinutes(lengthMinMatch[1]);

            let lengthMaxMatch = query.match(/length<=(\d+)/);
            if (lengthMaxMatch) lengthFilter.maxInput.value = convertToMinutes(lengthMaxMatch[1]);

            let rankedMinMatch = query.match(/ranked>=(\d{4}-\d{2})/);
            if (rankedMinMatch) rankedFilter.minInput.value = convertToRankedFormat(rankedMinMatch[1]);

            let rankedMaxMatch = query.match(/ranked<(\d{4}-\d{2})/);
            if (rankedMaxMatch) rankedFilter.maxInput.value = convertToRankedFormat(rankedMaxMatch[1]);
        }
        function applyFilters() {
            let queryParams = new URLSearchParams(window.location.search);
            let query = "";

            let minStars = starFilter.minInput.value.trim();
            let maxStars = starFilter.maxInput.value.trim();
            if (minStars) query += `stars>=${minStars} `;
            if (maxStars) query += `stars<=${maxStars} `;

            let minLength = lengthFilter.minInput.value.trim();
            let maxLength = lengthFilter.maxInput.value.trim();
            if (minLength) query += `length>=${convertToSeconds(minLength)} `;
            if (maxLength) query += `length<=${convertToSeconds(maxLength)} `;

            let minRanked = rankedFilter.minInput.value.trim();
            let maxRanked = rankedFilter.maxInput.value.trim();
            if (minRanked) query += `ranked>=${convertToRankedDate(minRanked)} `;
            if (maxRanked) query += `ranked<${convertToRankedDate(maxRanked, true)} `;

            queryParams.set("q", query.trim());
            window.location.search = queryParams.toString();
        }

        function convertToSeconds(time) {
            let parts = time.split(":");
            if (parts.length === 1) {
            // If there's no colon, treat it as seconds
                return parseInt(parts[0]) || 0;
            } else {
            // Otherwise, convert minutes:seconds
                let minutes = parseInt(parts[0]) || 0;
                let seconds = parseInt(parts[1]) || 0;
                return minutes * 60 + seconds;
            }
        }

        function convertToRankedDate(date, isUpperBound = false) {
            let parts = date.split("/"), month = parts[0].padStart(2, "0"), year = parts[1] || new Date().getFullYear();
            return `${year}-${month}${isUpperBound ? "-01" : ""}`;
        }

        filterItems.appendChild(starFilter.container);
        filterItems.appendChild(lengthFilter.container);
        filterItems.appendChild(rankedFilter.container);
        filterItems.appendChild(applyButton);

        customFilterDiv.appendChild(filterHeader);
        customFilterDiv.appendChild(filterItems);

        explicitContentFilter.parentNode.insertBefore(customFilterDiv, explicitContentFilter.nextSibling);

        populateFiltersFromURL();

    }

    function handleNavigation() {
        window.addEventListener("popstate", () => {
            setTimeout(integrateFilters, 100);
        });
    }

    let observer = new MutationObserver(() => {
        if (document.querySelector(".beatmapsets-search-filter")) {
            observer.disconnect();
            integrateFilters();
            handleNavigation();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
