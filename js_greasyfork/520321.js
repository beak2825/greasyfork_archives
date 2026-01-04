// ==UserScript==
// @name         Kapowarr Automation with Interactive List
// @namespace    https://greasyfork.org/fr/scripts/520321-kapowarr-automation-with-interactive-list
// @version      3.2
// @license MIT
// @description  Automate "Add Volume" with an interactive list of searches for Kapowarr instances.
// @author       thertemis
// @match        *://*/add*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520321/Kapowarr%20Automation%20with%20Interactive%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/520321/Kapowarr%20Automation%20with%20Interactive%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Variables for configuration
    const kapowarr_url = "https://your-kapowarr-instance.com"; // Base URL of the Kapowarr instance
    const marvel_only = true; // Set to true to include "&p=Marvel", false to exclude it

    let recherches = JSON.parse(localStorage.getItem('kapowarr_recherches')) || [];
    let indexRecherche = parseInt(localStorage.getItem('kapowarr_indexRecherche')) || 0;

    // Save searches and current index to local storage
    function saveSearches() {
        localStorage.setItem('kapowarr_recherches', JSON.stringify(recherches));
        localStorage.setItem('kapowarr_indexRecherche', indexRecherche);
    }

    // Automate the form after clicking "Add Volume"
    async function automateForm() {
        try {
            console.log("Automation started...");

            // Check "Start search for missing volume"
            const checkbox = document.querySelector("#auto-search-input");
            if (checkbox && !checkbox.checked) {
                checkbox.click();
                console.log("Checkbox checked");
            }

            // Select "Normal Volume"
            const selectOption = document.querySelector("#specialoverride-input > option[value='']");
            if (selectOption) {
                selectOption.selected = true;
                const select = selectOption.parentNode;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                console.log("Option 'Normal Volume' selected");
            }

            // Click "Add Volume" button
            const addVolumeButton = document.querySelector("#add-volume");
            if (addVolumeButton) {
                addVolumeButton.click();
                console.log("Add Volume button clicked");

                // Move to the next search after 1 second
                setTimeout(() => {
                    moveToNextSearch();
                    executeSearch();
                }, 1000);
            }
        } catch (error) {
            console.error("Error during automation:", error.message);
        }
    }

    // Move to the next active search
    function moveToNextSearch() {
        let attempts = 0;
        do {
            indexRecherche = (indexRecherche + 1) % recherches.length;
            attempts++;
        } while (!recherches[indexRecherche].active && attempts <= recherches.length);

        saveSearches();
    }

    // Execute the current search
    function executeSearch() {
        const activeSearch = recherches[indexRecherche];
        if (!activeSearch || !activeSearch.active) return;

        const baseURL = `${kapowarr_url}/add`;
        const cleanedSearch = activeSearch.value
            .replace(/[?%&+:]/g, " ")
            .trim()
            .replace(/\s+/g, "+");
        const querySuffix = marvel_only ? "&p=Marvel" : "";
        const searchURL = `${baseURL}?q=${cleanedSearch}&t=all${querySuffix}`;

        if (window.location.href !== searchURL) {
            window.location.href = searchURL;
        }
    }

    // Create the user interface
    function createInterface() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.backgroundColor = "#f9f9f9";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "8px";
        container.style.padding = "10px";
        container.style.width = "300px";
        container.style.zIndex = "9999";
        container.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.2)";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";

        const textArea = document.createElement("textarea");
        textArea.style.width = "100%";
        textArea.style.height = "100px";
        textArea.placeholder = "Enter your searches, one per line";
        textArea.value = recherches.map((r) => r.value).join("\n");

        const searchList = document.createElement("ul");
        searchList.style.listStyle = "none";
        searchList.style.padding = "0";
        searchList.style.margin = "0";
        searchList.style.maxHeight = "200px";
        searchList.style.overflowY = "auto";
        searchList.style.border = "1px solid #ccc";
        searchList.style.borderRadius = "4px";

        function updateSearchList() {
            searchList.innerHTML = "";
            recherches.forEach((search, i) => {
                const item = document.createElement("li");
                item.style.display = "flex";
                item.style.alignItems = "center";
                item.style.padding = "5px";
                item.style.cursor = "pointer";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = search.active;
                checkbox.addEventListener("change", () => {
                    search.active = checkbox.checked;
                    saveSearches();
                });

                const label = document.createElement("span");
                label.textContent = search.value;
                label.style.flexGrow = "1";
                label.style.marginLeft = "10px";

                item.appendChild(checkbox);
                item.appendChild(label);

                item.addEventListener("click", () => {
                    indexRecherche = i;
                    saveSearches();
                    highlightSearch(searchList, indexRecherche);
                });

                searchList.appendChild(item);
            });

            highlightSearch(searchList, indexRecherche);
        }

        function highlightSearch(list, index) {
            Array.from(list.children).forEach((item, i) => {
                if (i === index) {
                    item.style.backgroundColor = "blue";
                    item.style.color = "white";
                } else {
                    item.style.backgroundColor = "";
                    item.style.color = "";
                }
            });
        }

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.width = "100%";
        saveButton.style.padding = "10px";
        saveButton.style.backgroundColor = "#007bff";
        saveButton.style.color = "white";
        saveButton.style.border = "none";
        saveButton.style.borderRadius = "4px";
        saveButton.style.cursor = "pointer";

        saveButton.addEventListener("click", () => {
            recherches = textArea.value
                .split("\n")
                .map((line) => ({ value: line.trim(), active: true }))
                .filter((search) => search.value);
            saveSearches();
            updateSearchList();
        });

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next →";
        nextButton.style.width = "100%";
        nextButton.style.padding = "10px";
        nextButton.style.backgroundColor = "#28a745";
        nextButton.style.color = "white";
        nextButton.style.border = "none";
        nextButton.style.borderRadius = "4px";
        nextButton.style.cursor = "pointer";

        nextButton.addEventListener("click", () => {
            moveToNextSearch();
            executeSearch();
        });

        container.appendChild(textArea);
        container.appendChild(searchList);
        container.appendChild(saveButton);
        container.appendChild(nextButton);

        document.body.appendChild(container);
        updateSearchList();
    }

    // Initialize the user interface
    createInterface();

    // Listen for clicks on buttons with the "search-entry" class
    document.addEventListener("click", (event) => {
        if (event.target.closest(".search-entry")) {
            console.log("Button 'search-entry' clicked");
            setTimeout(automateForm, 1000);
        }
    });
})();
