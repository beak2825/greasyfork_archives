// ==UserScript==
// @name         AttackScript2.0
// @namespace    cartelempire.online
// @version      2024-12-21.4
// @description  simple script to add an attack button to the enemies page in a game
// @author       GELIN - 3779
// @match        https://cartelempire.online/Connections?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @license      Mozilla Public License 2.0 
// @downloadURL https://update.greasyfork.org/scripts/521608/AttackScript20.user.js
// @updateURL https://update.greasyfork.org/scripts/521608/AttackScript20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize the MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Only act when nodes are added (not removed or changed)
            if (mutation.addedNodes.length) {
                // Check if rows are added
                addButtonsToRows();
            }
        });
    });

    // Start observing the body for changes in the document (child additions)
    observer.observe(document.body, {
        childList: true, // Look for added nodes
        subtree: true    // Look within all descendants
    });

    // Function to add buttons to all rows with class `row py-3 py-xl-2 g-2`
    function addButtonsToRows() {
        // Select all rows that have the class 'row py-3 py-xl-2 g-2'
        const rows = document.querySelectorAll('.row.py-3.py-xl-2.g-2');

        rows.forEach((row, i) => {
            if (!row.querySelector('.header-button')) {
                const newCol = document.createElement('div');
                newCol.classList.add('col-1'); // You can adjust the column width here (col-1 is a small column)

                const button = document.createElement('button');
                button.classList.add('header-button'); // Optional: add a class for styling
                button.textContent = 'Attack';

                // Add inline styles
                button.style.marginLeft = '10px';
                button.style.padding = '5px 10px';
                button.style.backgroundColor = '#007bff';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.cursor = 'pointer';

                const userLink = row.querySelector('a.fw-bold');
                if (userLink) {
                    // Extract user ID from the href attribute (e.g., /user/3144)
                    const userIdMatch = userLink.getAttribute('href').match(/\/user\/(\d+)/);
                    if (userIdMatch) {
                        const userId = userIdMatch[1]; // Extracted user ID

                        // Button click event
                        button.addEventListener('click', function() {
                            // Create the form dynamically
                            const form = document.createElement('form');
                            form.classList.add('modalDismissBtn', 'w-100');
                            form.action = `/User/AttackPlayer/${userId}`; // Use the dynamic user ID in the action URL
                            form.method = 'POST';

                            // Create the submit button inside the form
                            const submitButton = document.createElement('button');
                            submitButton.classList.add('btn', 'btn-success', 'w-100');
                            submitButton.id = 'actionBtn';
                            submitButton.type = 'submit';
                            submitButton.textContent = 'Attack';
                            form.appendChild(submitButton);

                            // Append the form to the document body and submit
                            document.body.appendChild(form);
                            form.submit();
                        });
                    }
                }

                // Append the button to the new column and then to the row
                newCol.appendChild(button);
                row.appendChild(newCol);
            }
        });
    }
})();
