// ==UserScript==
// @name         LibGen Search Auto Sort by Year
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically sort by year to LibGen search forms
// @author       Bui Quoc Dung
// @match        https://libgen.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525392/LibGen%20Search%20Auto%20Sort%20by%20Year.user.js
// @updateURL https://update.greasyfork.org/scripts/525392/LibGen%20Search%20Auto%20Sort%20by%20Year.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add hidden input fields to a form if they do not already exist
    function modifyForm(form, inputs) {
        inputs.forEach(input => {
            // Check if the input field already exists in the form
            if (!form.querySelector(`input[name="${input.name}"]`)) {
                // Create a hidden input element
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = input.name;
                hiddenInput.value = input.value;

                // Append the hidden input to the form
                form.appendChild(hiddenInput);
            }
        });
    }

    function init() {
        // Select the first form with ID 'formlibgen' in libgen.li
        const form1 = document.getElementById('formlibgen');

        // Select the form with the name 'libgen' in libgen.is
        const form2 = document.querySelector('form[name="libgen"]');

        // Modify form1 by adding hidden input fields for sorting by year in descending order
        if (form1) {
            modifyForm(form1, [
                { name: 'order', value: 'year' },
                { name: 'ordermode', value: 'desc' }
            ]);
        }

        // Modify form2 by adding hidden input fields for sorting by year in descending order
        if (form2) {
            modifyForm(form2, [
                { name: 'sort', value: 'year' },
                { name: 'sortmode', value: 'DESC' }
            ]);

            // Add event listener to prevent default form submission and redirect with query parameters
            form2.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission behavior

                // Create a FormData object from the form
                const formData = new FormData(form2);

                // Convert form data into URL query parameters
                const params = new URLSearchParams(formData).toString();

                // Redirect to libgen search page with modified query parameters
                window.location.href = `https://libgen.is/search.php?${params}`;
            });
        }
    }

    // Ensure the script runs after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
