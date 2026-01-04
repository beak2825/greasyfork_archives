// ==UserScript==
// @name        Dispatch Filter
// @namespace   https://violentmonkey.github.io
// @version     1.0.2
// @description Add a search bar to the dispatch home page to filter FA's by name and status.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/Dispatch.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/500352/Dispatch%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/500352/Dispatch%20Filter.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const statusNames = [
        "All",
        "Break",
        "Loading Vehicle",
        "Maintenance",
        "Materials Travel",
        "Off",
        "Production",
        "Travel",
        "Travel Home",
        "No Status"
    ];

    const buildFilterContainer = () => {
        const filterContainer = document.createElement("div");

        filterContainer.style.display = "flex";
        filterContainer.style.alignItems = "center";
        filterContainer.style.gap = "10px";
        filterContainer.style.width = "572px";
        filterContainer.style.float = "right";
        filterContainer.style.margin = "10px";

        return filterContainer;
    };

    const buildSearchBar = () => {
        const searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.id = "tech-search-bar";
        searchBar.placeholder = "Search Tech";

        searchBar.style.flex = "1";
        searchBar.style.borderRadius = "5px";
        searchBar.style.border = "1px solid #dddddd";
        searchBar.style.height = "40px";
        searchBar.style.padding = "0 10px";
        searchBar.style.color = "#333333";
        searchBar.style.boxSizing = "border-box";

        return searchBar;
    };

    const buildStatusDropdown = () => {
        const select = document.createElement("select");
        select.id = "tech-status-dropdown";

        select.style.flex = "1";
        select.style.borderRadius = "5px";
        select.style.border = "1px solid #dddddd";
        select.style.height = "40px";
        select.style.padding = "0 10px";
        select.style.color = "#333333";
        select.style.boxSizing = "border-box";

        for (const status of statusNames) {
            const option = document.createElement("option");
            option.value = status;
            select.appendChild(option);
        }

        return select;
    };

    const buildBanner = (bannerText) => {
        const banner = document.createElement("div");
        banner.textContent = bannerText;

        banner.style.display = "none";
        banner.style.width = "550px";
        banner.style.float = "right";
        banner.style.margin = "10px";
        banner.style.padding = "15px 10px";
        banner.style.border = "1px solid #fecaca";
        banner.style.borderRadius = "5px";
        banner.style.backgroundColor = "#fee2e2";
        banner.style.color = "#b91c1c";
        banner.style.textAlign = "center";

        return banner;
    };

    const techDetails = Array.from(document.querySelectorAll("#displatch-boxes")).map((card) => {
        const techElement = card.querySelector("h2.tech");
        const [_, name, status] = techElement?.textContent.trim().match(/^(.*?)\s+\((.*?)\)$/) || [];

        return {
            card,
            techName: name.toLowerCase().trim(),
            techStatus: status ? status.trim() : "No Status"
        };
    });

    const referenceElement = document.querySelector("body > div:nth-child(11) > div:nth-child(5)");

    const filterContainer = buildFilterContainer();
    referenceElement.parentNode.insertBefore(filterContainer, referenceElement.nextSibling);

    const searchBar = buildSearchBar();
    filterContainer.appendChild(searchBar);

    const select = buildStatusDropdown();
    filterContainer.appendChild(select);

    const noResultsBanner = buildBanner("No results found.");
    referenceElement.parentNode.insertBefore(noResultsBanner, filterContainer.nextSibling);

    /**
     * Update status counts in the status dropdown options.
     * @param {Array<{card: Element, techName: string, techStatus: string}>} techDetails
     * @returns {Object<string, number>}
     */
    const updateStatusCounts = (techDetails) => {
        const statusCounts = {};
        for (const status of statusNames) {
            statusCounts[status] = 0;
        }

        statusCounts.All = techDetails.length;
        for (const { techStatus } of techDetails) {
            statusCounts[techStatus] = (statusCounts[techStatus] ?? 0) + 1;
        }

        for (const option of select.options) {
            const count = statusCounts[option.value] ?? 0;
            option.textContent = `${option.value} (${count})`;
        }

        return statusCounts;
    };

    /**
     * Filter cards based on search term and status.
     */
    const filterCards = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedStatus = select.value;

        const filteredTechDetails = techDetails.filter(({ card, techName, techStatus }) => {
            const matchesSearch = techName.includes(searchTerm);
            const matchesStatus = selectedStatus === "All" || techStatus === selectedStatus;
            card.style.display = matchesSearch && matchesStatus ? "" : "none";
            return matchesSearch;
        });

        const statusCounts = updateStatusCounts(filteredTechDetails);
        noResultsBanner.style.display = statusCounts[selectedStatus] === 0 ? "" : "none";
    };

    updateStatusCounts(techDetails);

    searchBar.addEventListener("keyup", filterCards);
    select.addEventListener("change", filterCards);
})();
