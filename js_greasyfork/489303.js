// ==UserScript==
// @name         Open Ticket Summary Copy Question IDs
// @namespace    http://your.homepage/
// @version      0.5
// @description  Adds buttons to copy question IDs to clipboard in open ticket summary
// @author       Rob Clayton
// @match        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strAction*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489303/Open%20Ticket%20Summary%20Copy%20Question%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/489303/Open%20Ticket%20Summary%20Copy%20Question%20IDs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    function extractQuestionIDs() {
        var questionIDs = [];
        document.querySelectorAll('.column-data:nth-child(2) > a').forEach(function(element) {
            questionIDs.push(element.textContent.trim());
        });
        return questionIDs.join('\n');
    }

    function createButton() {
        var button = document.createElement('button');
        button.innerHTML = 'Copy Question IDs';
        button.style.marginTop = '10px'; // Adjust margin if needed

        button.addEventListener('mousedown', function() {
            button.style.backgroundColor = '#00ff00'; // Change color when clicked
        });

        button.addEventListener('mouseup', function() {
            button.style.backgroundColor = ''; // Revert back to default color when released
        });

        button.onclick = function() {
            var questionIDs = extractQuestionIDs();
            copyToClipboard(questionIDs);
        };

        return button;
    }

    function addButtons() {
        var table = document.querySelector('table');

        if (table) {
            // Create the top button
            var topButton = createButton();
            var topRow = table.insertRow(0); // Insert the button at the first row
            var topCell = topRow.insertCell(0);
            topCell.appendChild(topButton);
            topCell.colSpan = 4; // Adjust the colspan if needed
            topCell.style.textAlign = 'center'; // Center align the button within the cell

            // Create the bottom button
            var bottomButton = createButton();
            var bottomRow = table.insertRow(-1); // Insert the button at the last row
            var bottomCell = bottomRow.insertCell(0);
            bottomCell.appendChild(bottomButton);
            bottomCell.colSpan = 4; // Adjust the colspan if needed
            bottomCell.style.textAlign = 'center'; // Center align the button within the cell
        }
    }

    addButtons();

})();
