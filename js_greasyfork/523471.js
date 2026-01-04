// ==UserScript==
// @name         Flowyer All Tasks Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add button to show all tasks from 2020 to 2027
// @author       Your name
// @match        https://www.flowyer.hu/tasks*
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/523471/Flowyer%20All%20Tasks%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/523471/Flowyer%20All%20Tasks%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the new button
    function addAllTasksButton() {
        const buttonContainer = document.querySelector('.col-6.float-start');
        if (!buttonContainer) return;

        // Find the last button container and update its classes
        //const lastButtonContainer = buttonContainer.querySelector('.col-sm-2.col-md-auto.float-start');
        const buttonContainers = buttonContainer.querySelectorAll('.col-sm-2.col-md-auto');
        const lastButtonContainer = buttonContainers[buttonContainers.length - 1];
        console.log(lastButtonContainer);
        if (lastButtonContainer) {
            lastButtonContainer.className = 'col-sm-2 col-md-auto float-start pe-3 mb-1';
        }

        // Create new button
        const newButton = document.createElement('div');
        newButton.className = 'col-sm-2 col-md-auto float-start pe-3 mb-1';
        newButton.innerHTML = `
            <button data-timerange="all" type="button" class="btn btn-secondary btn-filter-custom">
                Összes teendő
            </button>
        `;

        buttonContainer.appendChild(newButton);

        // Add event handler for the new button
        const allTasksButton = newButton.querySelector('button');
        allTasksButton.addEventListener('click', function() {
            // Set date range from 2020 to 2027
            const startDate = '2020.01.01';
            const endDate = '2027.12.31';

            // Update the date inputs
            document.querySelector('input[name="start"]').value = startDate;
            document.querySelector('input[name="end"]').value = endDate;

            // Trigger change event to update the listing
            document.querySelector('input[name="start"]').dispatchEvent(new Event('change'));

            // Set pagination to "Összes"
            const paginationButton = document.querySelector('.page-size');
            if (paginationButton) {
                paginationButton.textContent = 'Összes';
            }

            // Find and click the "Összes" option in the dropdown
            const allRecordsOption = Array.from(document.querySelectorAll('.dropdown-menu .dropdown-item'))
                .find(item => item.textContent === 'Összes');
            if (allRecordsOption) {
                allRecordsOption.click();
            }

            // Call the existing listing function
            if (typeof listing === 'function') {
                listing();
            }
        });
    }

    // Wait for the page to load before adding the button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAllTasksButton);
    } else {
        addAllTasksButton();
    }
})();