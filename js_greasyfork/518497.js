// ==UserScript==
// @name           Easy Hold with Calendar
// @namespace      http://www.plus.net/
// @description    Adds a calendar to automatically choose the on-hold date
// @include        https://workplace.plus.net/tickets/ticket_on_hold.html*
// @exclude        https://*.btwholesale.com/*
// @author         Rob Clayton
// @license        Anyone can use, feedback appreciated!
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/518497/Easy%20Hold%20with%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/518497/Easy%20Hold%20with%20Calendar.meta.js
// ==/UserScript==

(function () {
    // Helper function to set dropdown values based on a selected date
    function setDateDropdowns(selectedDate) {
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth() + 1; // Months are 0-indexed
        const year = selectedDate.getFullYear();

        const form = document.forms.theform;
        if (form) {
            try {
                form.day[day - 1].selected = true; // Days are 1-indexed
                form.month[month - 1].selected = true; // Months are 1-indexed
                const yearOptions = Array.from(form.year.options);
                const yearOption = yearOptions.find(option => option.value == year);
                if (yearOption) yearOption.selected = true;
            } catch (error) {
                console.error("Error setting dropdown values:", error);
            }
        } else {
            console.error("Form not found on the page.");
        }
    }

    // Add the calendar input field
    function addCalendar() {
        const calendarContainer = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = "Choose On-Hold Date: ";
        label.style.marginRight = "10px";

        const calendarInput = document.createElement("input");
        calendarInput.type = "date";
        calendarInput.style.marginRight = "10px";

        // Set the minimum date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const dd = String(today.getDate()).padStart(2, "0");
        calendarInput.min = `${yyyy}-${mm}-${dd}`;

        // Automatically set the date when a date is chosen
        calendarInput.onchange = () => {
            const selectedDate = new Date(calendarInput.value);
            if (!isNaN(selectedDate)) {
                setDateDropdowns(selectedDate);
            } else {
                alert("Please select a valid date.");
            }
        };

        calendarContainer.appendChild(label);
        calendarContainer.appendChild(calendarInput);

        // Insert the calendar before the dropdown
        const dayDropdown = document.getElementsByName("day")[0];
        if (dayDropdown) {
            dayDropdown.parentNode.insertBefore(calendarContainer, dayDropdown);
        } else {
            console.error("Day dropdown not found on the page.");
        }
    }

    // Initialize the script
    addCalendar();
})();
