// ==UserScript==
// @name         When2Meet CSV Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to export When2Meet availability data as CSV
// @author       Tyler Bletsch
// @match        https://www.when2meet.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523476/When2Meet%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/523476/When2Meet%20CSV%20Exporter.meta.js
// ==/UserScript==

/* reverse engineering notes:

Here are the important global variables kept by when2meet:

The strings of people names:
  PeopleNames (Array): [ "Abdul", … ]

An array of slots, where each entry is an array of people IDs:
  AvailableAtSlot (Array): [ [ 115436591, 115438675, 115448517, … ], … ]

The actual time of each timeslot reffered to in AvailableAtSlot, as unix timestamps:
  TimeOfSlot (Array):  [ 1736780400, 1736781300, … ]

An array of the people ID numbers used in AvailableAtSlot, ordered in a manner correlated to PeopleNames:
  PeopleIDs (Array): [ 115660081, 115436591, … ]

The currently selected timezone:
  timezone (string): "America/New_York"

These are consumed by make_csv() below.
*/

(function () {
    'use strict';

    // Wait until the page is fully loaded
    window.addEventListener('load', () => {
        // Check if the make_csv function exists
        console.log("Export CSV button is being added...");
        function make_csv() {
            let csv = "time ("+timezone+")," + PeopleNames.join(",") + "\n";

            // Iterate through each time slot
            for (let i = 0; i < TimeOfSlot.length; i++) {
                //const time = new Date(TimeOfSlot[i] * 1000).toISOString(); // Convert UNIX timestamp to ISO string
                //const time = new Date(TimeOfSlot[i] * 1000).toISOString().replace("T", " ").split(".")[0];
                const time = new Date(TimeOfSlot[i] * 1000).toLocaleString("en-US", {
                    timeZone: timezone, // timezone is a global from when2meet
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }).replace(",", "");
                const availablePeople = new Set(AvailableAtSlot[i]); // Set of people IDs available at this time slot

                // Create a row with "o" for available people
                const row = [time];
                for (let personID of PeopleIDs) {
                    row.push(availablePeople.has(personID) ? "o" : "");
                }

                csv += row.join(",") + "\n";
            }
            return csv;
        }

        // Create the "Export CSV" button floating in the lower right of the screen
        const button = document.createElement('button');
        button.innerText = 'Tampermonkey: Export CSV';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '12px 24px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = '2px solid #0056b3';
        button.style.borderRadius = '8px';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.5)';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s ease';
        button.style.zIndex = '1000';

        // Add a click event to generate and download the CSV
        button.addEventListener('click', () => {
            try {
                const csv = make_csv(); // Call the make_csv() function
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);

                // Create a temporary <a> element to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = 'when2meet_export.csv';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Revoke the blob URL
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error generating CSV:", error);
                alert("Failed to generate CSV. Check the console for details.");
            }
        });

        // Add the button to the page
        document.body.appendChild(button);
    });
})();