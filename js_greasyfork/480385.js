// ==UserScript==
// @name         PowerSchool Missing Assignments
// @namespace    http://your.namespace.com
// @version      0.1
// @description  Display missing assignments on PowerSchool
// @author       Your Name
// @match        https://hssdschools.powerschool.com/guardian/home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480385/PowerSchool%20Missing%20Assignments.user.js
// @updateURL https://update.greasyfork.org/scripts/480385/PowerSchool%20Missing%20Assignments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Check if we are on the correct page
        if (window.location.href.indexOf('grades') > -1) {
            // Call the function to display missing assignments
            displayMissingAssignments();
        }
    });

    // Function to display missing assignments
    function displayMissingAssignments() {
        // You may need to inspect the PowerSchool page structure to adapt the selectors
        var assignmentRows = $('tr[data-type="assignment"]');

        assignmentRows.each(function() {
            var status = $(this).find('td[data-type="status"]').text().trim();

            // Check if the assignment is missing
            if (status.toLowerCase() === 'missing') {
                // Highlight or display the missing assignment
                $(this).css('background-color', 'yellow');
            }
        });
    }
})();