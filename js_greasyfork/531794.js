// ==UserScript==
// @name         SuperGogu's Company type filter
// @namespace    https://www.torn.com/
// @version      1.4
// @description  Adds multiple checkboxes to filter users based on selected company types dynamically, arranged in 3 columns.
// @author       Ovidiu
// @match        https://www.torn.com/page.php?sid=UserList*
// @run-at       document-end
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/531794/SuperGogu%27s%20Company%20type%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/531794/SuperGogu%27s%20Company%20type%20filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Define the company types you want to filter
    const companyTypes = [
        'Oil Rig',
        'Mining Corporation',
        'Lingerie Store',
        'Law Firm',
        'Adult Novelties',
        'Amusement Park',
        'Candle Shop',
        'Car Dealership',
        'Clothing Store',
        'Cruise Line',
        'Cyber Cafe',
        'Detective Agency',
        'Farm',
        'Firework Stand',
        'Fitness Center',
        'Flower Shop',
        'Furniture Store',
        'Game Shop',
        'Gas Station',
        'Gents Strip Club',
        'Grocery Store',
        'Gun Shop',
        'Hair Salon',
        'Ladies Strip Club',
        'Logistics Management',
        'Meat Warehouse',
        'Mechanic Shop',
        'Music Store',
        'Nightclub',
        'Private Security Firm',
        'Property Broker',
        'Pub',
        'Restaurant',
        'Software Corporation',
        'Sweet Shop',
        'Television Network',
        'Theater',
        'Toy Shop',
        'Zoo'
    ];

    // Function to add the filter UI with checkboxes
    function addFilterCheckboxes() {
        // Check if the filter container already exists
        if (document.querySelector('#company-filter-container')) return;

        // Create the filter container
        const container = document.createElement('div');
        container.id = 'company-filter-container';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns
        container.style.gap = '10px'; // Spacing between items
        container.style.marginBottom = '10px';

        // Add a title for the filter section
        const title = document.createElement('div');
        title.textContent = 'Filter users by company type:';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.gridColumn = 'span 3'; // Ensure title spans across all columns
        container.appendChild(title);

        // Create a checkbox for each company type
        companyTypes.forEach(company => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-${company}`;
            checkbox.value = company;

            const label = document.createElement('label');
            label.htmlFor = `filter-${company}`;
            label.textContent = company;
            label.style.fontSize = '14px';
            label.style.marginLeft = '5px';

            const wrapper = document.createElement('div'); // Wrapper for checkbox and label
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            container.appendChild(wrapper);

            // Add an event listener for each checkbox
            checkbox.addEventListener('change', () => {
                filterUsers();
            });
        });

        // Add the container to the page above the user list
        const userListWrap = document.querySelector('.user-info-list-wrap');
        if (userListWrap) {
            userListWrap.parentNode.insertBefore(container, userListWrap);
        }
    }

    // Function to filter users based on selected checkboxes
    function filterUsers() {
        // Get the list of selected company types
        const selectedCompanies = new Set(
            [...document.querySelectorAll('#company-filter-container input[type="checkbox"]:checked')].map(cb => cb.value)
        );

        // Select all user elements
        const userElements = document.querySelectorAll('.user-info-list-wrap > li');

        userElements.forEach(user => {
            // Find the company info in the user's details
            const companyInfo = user.querySelector('.level-icons-wrap .iconShow[title*="Company"]');
            if (companyInfo) {
                const companyTypeMatch = companyInfo.title.match(/\(([^)]+)\)/);
                const companyType = companyTypeMatch ? companyTypeMatch[1] : null;

                // Show or hide the user based on the filter
                if (selectedCompanies.size > 0 && (!companyType || !selectedCompanies.has(companyType))) {
                    user.style.display = 'none';
                } else {
                    user.style.display = '';
                }
            }
        });
    }

    // Ensure the filter UI is added when the page is fully loaded
    document.addEventListener('DOMContentLoaded', addFilterCheckboxes);

    // Observe DOM changes to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        addFilterCheckboxes();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();