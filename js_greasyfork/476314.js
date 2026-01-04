// ==UserScript==
// @name         Zeit+ Kalender Assistant
// @namespace    merkur.at
// @version      1.3.0
// @description  Zeit in Infoniqa in der Seite "Kalender" nützliche Informationen wie die verbleibenden Homeoffice Tage diesen Monat an
// @author       Julian
// @license      MIT
// @match        https://mdc-as400-hr.merkur.net:8080/zeit_webp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476314/Zeit%2B%20Kalender%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/476314/Zeit%2B%20Kalender%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title = document.getElementById("dvtitle")?.textContent.trim().split(" ")[0].toLowerCase();
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Get the current month (1-based)


    if(title == null || title.trim() != "kalender") return;

    // Get the rows within the table body
    const calendarRows = document.querySelectorAll("#tbgrid tbody tr");

    // Iterate through all rows in the table and skip the first two (title rows)
    // Each row represents a month
    for(let i = 2; i < calendarRows.length; i++) {

        // Variable to store how many workdays this month has
        let possibleWorkDaysMonth = 0;

        // Variable to store the home office days for this month
        let homeOfficeDaysMonth = 0;

        // Get the current row
        const calendarRow = calendarRows[i];

        // Check if the current row represents the current month
        if (i === currentMonth + 1) { // +1 to account for header row
            calendarRow.style.backgroundColor = "yellow";
        }

        // Select all cells with class "TAG" and the linked "a" element in this row
        const cells = calendarRow.querySelectorAll(".TAG a");

        cells.forEach(cell => {
            // Get the title of the cell, which contains the day of the week
            const cellTitle = cell.getAttribute("title");
            const dayOfWeek = cellTitle.split(",")[0].trim();

            // Check if the day of the week is "Sa" (Saturday) or "So" (Sunday)
            if (dayOfWeek === "Sa" || dayOfWeek === "So") {
                return; // Skip weekends
            }

            // Get the content of the cell
            const cellContent = cell.textContent.trim().toLowerCase();

            //cell.style.backgroundColor = "green";

            switch(cellContent) {
                // If the content indicates that the day was a home office day, increment the counter
                case "h":
                    homeOfficeDaysMonth++;
                    // Add a red background color to the cell
                    cell.style.backgroundColor = "aquamarine";
                    break;
                // If the content indicates that the day is a holiday, decrement the counter
                case "f":
                    possibleWorkDaysMonth--;
                    break;
                // If the content indicates that the user was on vacation, also don't count it as a workday
                case "u":
                    possibleWorkDaysMonth--;
                    break;
            }

            // Save the day as a workday
            possibleWorkDaysMonth++;
        });

        // Add an additional column to display the number of home office days
        const monthTotalCell = document.createElement("td");
        monthTotalCell.textContent = homeOfficeDaysMonth.toString();

        // Append the additional column to the current row
        calendarRow.appendChild(monthTotalCell);

        // Calculate the remaining allowed home office days for this month (assuming 60% allowance)
        const allowedHomeOfficePercentage = 0.60; // 60% allowance
        const remainingHomeOfficeDays = Math.floor(possibleWorkDaysMonth * allowedHomeOfficePercentage) - homeOfficeDaysMonth;

        // Add a new cell to display the remaining home office days
        const remainingHomeOfficeCell = document.createElement("td");
        remainingHomeOfficeCell.textContent = remainingHomeOfficeDays.toString();

        // Append the additional column for remaining home office days to the current row
        calendarRow.appendChild(remainingHomeOfficeCell);

        // Add an additional column to display the number of home office days
        const monthWorkdaysCell = document.createElement("td");
        monthWorkdaysCell.textContent = possibleWorkDaysMonth.toString();

        // Append the additional column to the current row
        calendarRow.appendChild(monthWorkdaysCell);
    }

    // Get the title row
    const titleRow = calendarRows[1];

    // Get the last cell in row 2 to copy the style from
    const lastCellInRow2 = titleRow.lastElementChild;

    // Add the "HomeOffice Tage / Monat" and "Verbleibende Homeoffice-Tage" titles to the second row
    const homeOfficeTitleCell = document.createElement("th");
    homeOfficeTitleCell.textContent = "HomeOffice Tage laut Liste";
    titleRow.appendChild(homeOfficeTitleCell);

    const remainingHomeOfficeTitleCell = document.createElement("th");
    remainingHomeOfficeTitleCell.textContent = "Verbleibende HomeOffice Tage (bei 60%)";
    titleRow.appendChild(remainingHomeOfficeTitleCell);

    const workDaysTitleCell = document.createElement("th");
    workDaysTitleCell.textContent = "Mögliche Arbeitstage";
    titleRow.appendChild(workDaysTitleCell);

    // Define an array of the cells to apply the style to
    const cellsToStyle = [homeOfficeTitleCell, remainingHomeOfficeTitleCell, workDaysTitleCell];
    // Define an array of specific style properties to copy
    const stylePropertiesToCopy = ["width"];


    // Loop through the cells and apply the style property
    cellsToStyle.forEach(cell => {
        stylePropertiesToCopy.forEach(styleProperty => {
            cell.style[styleProperty] = lastCellInRow2.style[styleProperty];
        });
    });


    // Removal of empty columns
    // Iterate through all columns and check if they are empty for all months
    const emptyColumns = [];

    for (let columnIndex = 0; columnIndex < titleRow.cells.length; columnIndex++) {
        let isEmpty = true;

        for (let rowIndex = 2; rowIndex < calendarRows.length; rowIndex++) {
            const cell = calendarRows[rowIndex].cells[columnIndex];

            if (cell.textContent.trim() !== "" || cell.classList.contains("TAG")) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            emptyColumns.push(columnIndex);
        }
    }

    // Remove empty columns from all rows
    for (let rowIndex = 1; rowIndex < calendarRows.length; rowIndex++) {
        const calendarRow = calendarRows[rowIndex];

        emptyColumns.forEach((columnIndex, indexOffset) => {
            calendarRow.deleteCell(columnIndex - indexOffset);
        });
    }
})();
