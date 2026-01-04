// ==UserScript==
// @name        Pestpac - Easy Quick Scheduler Buttons
// @version     5.2.29
// @description Adds buttons to select technicians by area and dates up to 7 days from the latest selected date in the calendar in Pestpac
// @match       https://app.pestpac.com/appointment/*
// @author      Jamie Cruz
// @grant       none
// @license MIT
// @namespace https://greasyfork.org/users/1433767
// @downloadURL https://update.greasyfork.org/scripts/527359/Pestpac%20-%20Easy%20Quick%20Scheduler%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/527359/Pestpac%20-%20Easy%20Quick%20Scheduler%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates and inserts the button container for technician selection.
     * This container is styled as a scrollable two-column grid.
     * It is placed next to the "Refresh Search" button for accessibility.
     * @returns {HTMLElement} The created container element.
     */
    function createButtonContainer() {
        var container = document.createElement("div");
        container.id = "techbuttons";
        container.classList.add("slim-scrollbar", "pr-tiny"); // Applies styling for custom scrollbar
        container.style.display = "grid";
        container.style.gridTemplateColumns = "auto auto"; // Two columns with flexible sizing
        container.style.gap = "5px"; // Space between buttons
        container.style.overflowY = "auto"; // Enables vertical scrolling
        container.style.maxHeight = "125px"; // Limits height for a compact view
        container.style.border = "1px solid #ccc"; // Adds a border for clarity
        container.style.padding = "10px";
        container.style.marginBottom = "10px";
        container.style.width = "fit-content"; // Prevents unnecessary horizontal scrolling

        var refreshSearchButton = document.getElementById("butRefreshSearch");
        if (refreshSearchButton) {
            refreshSearchButton.parentNode.insertBefore(container, refreshSearchButton.nextSibling);
        } else {
            console.error("Element with ID 'butRefreshSearch' not found."); // Logs an error if the expected element is missing
        }
        return container;
    }

    /**
     * Adds a technician selection button to the container.
     * Clicking the button selects specific rows based on given range IDs.
     * @param {string} buttonText - Label for the button.
     * @param {string} color - Background color for the button.
     * @param {Array} rowRanges - Array of start and end row IDs to select.
     * @param {HTMLElement} container - The container to add the button to.
     * @param {string} position - Positioning data for organizational purposes.
     */
    function addTechButton(buttonText, color, rowRanges, container, position) {
        var button = document.createElement("button");
        button.innerHTML = buttonText;
        button.style.width = "90px"; // Uniform button size
        button.style.height = "28px";
        button.style.fontSize = "12px"; // Smaller text for clarity
        button.style.backgroundColor = color;
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.textAlign = "center";
        button.setAttribute("data-position", position); // Stores position metadata
        
        var positionParts = position.split(":");
        button.style.gridRow = positionParts[0];  // Assigns the row number
        button.style.gridColumn = positionParts[1]; // Assigns the column number 

        container.appendChild(button);

        button.addEventListener("click", function() {
            // Deselects all previously selected rows
            document.querySelectorAll("tr.SelectedRow").forEach(row => {
                row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                row.classList.remove("SelectedRow");
            });

            // Selects new rows based on predefined ID ranges
            for (let range of rowRanges) {
                for (let i = range.start; i <= range.end; i++) {
                    let row = document.querySelector("table.insetTable #MultiTechRow" + i);
                    if (row) {
                        row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                        row.classList.add("SelectedRow");
                    } else {
                        console.error("Row with ID 'MultiTechRow" + i + "' not found.");
                    }
                }
            }
        });
    }

    /**
     * Adds a button to automatically select the next 7 calendar dates after the last selected date.
     * Useful for scheduling appointments efficiently.
     */
    function addSelectButton() {
        var button = document.createElement("button");
        button.innerHTML = "+7";
        button.style.width = "60px"; // Compact button
        button.style.height = "28px";
        button.style.fontSize = "12px";
        button.style.backgroundColor = "#1565C0";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        var updateCalendarButton = document.getElementById("butUpdateCalendarDate");
        if (updateCalendarButton) {
            updateCalendarButton.parentNode.insertBefore(button, updateCalendarButton.nextSibling);
        } else {
            console.error("Element with ID 'butUpdateCalendarDate' not found.");
        }

        button.addEventListener("click", function() {
            var selectedDates = document.querySelectorAll(".selectedcalendarlink");
            if (selectedDates.length === 0) {
                alert("No date selected.");
                return;
            }

            var latestSelectedDate = selectedDates[selectedDates.length - 1];
            var latestDateText = latestSelectedDate.textContent.trim();
            var latestDate = new Date(latestDateText);

            var calendarDates = document.querySelectorAll("table.insetTable .calendarlink, table.insetTable .selectedcalendarlink");
            var count = 0;
            var latestFound = false;
            for (var i = 0; i < calendarDates.length; i++) {
                var dateText = calendarDates[i].textContent.trim();
                if (latestFound && count < 7) {
                    calendarDates[i].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    count++;
                }
                if (dateText === latestDateText) {
                    latestFound = true;
                }
            }
        });
    }

    /**
     * Initializes the script by creating the button container and adding technician selection buttons.
     * Also adds the "+7" button for date selection.
     */
    window.onload = function() {
        var container = createButtonContainer();

addTechButton("VA Techs", "#262F6A", [ { start: 3, end: 8 } ], container, "1:1");
addTechButton("MD Techs", "#262F6A", [ { start: 9, end: 19 } ], container, "1:2");
addTechButton("Tide", "#262F6A", [ { start: 20, end: 23 } ], container, "4:1");
addTechButton("VA ACT", "#0057E9", [ { start: 3, end: 6 }, { start: 8, end: 8 } ], container, "2:1");
addTechButton("MD ACT", "#0057E9", [ { start: 9, end: 13 }, { start: 15, end: 15 } ], container, "2:2");
addTechButton("VA TM", "#EF4255", [ { start: 4, end: 4 }, { start: 6, end: 6 }, { start: 8, end: 8 } ], container, "3:1");
addTechButton("MD TM", "#EF4255", [ { start: 9, end: 11 } ], container, "3:2");

        addSelectButton("+7", "#1565C0");
    };
})();
