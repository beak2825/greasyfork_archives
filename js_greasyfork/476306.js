// ==UserScript==
// @name         Extract Project Awarded Info
// @namespace    http://amazon.com/
// @version      0.2
// @description  Extract "Project awarded to Lantro" from the webpage
// @author       chengng@
// @match        https://t.corp.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476306/Extract%20Project%20Awarded%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/476306/Extract%20Project%20Awarded%20Info.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup for the helper
0.2 - 2023-10-26 - chengng@ - Change the search to 'awarded to' instead of 'project awarded to' for better results
*/

(function() {
    'use strict';

    // Wait for the document to be fully loaded
    window.addEventListener('load', function() {
        console.log("Document fully loaded. Waiting for 5 seconds before processing...");

        // Introduce a 5-second delay
        setTimeout(function() {
            console.log("5 seconds passed. Starting processing...");

 // Find all the timestamp elements
const timestampElements = document.querySelectorAll('.sim-timestampFormatSwitcher--presentation');
console.log(`Found ${timestampElements.length} timestamp elements.`);

let extractedResults = [];

let regex = new RegExp('awarded to', 'i'); // Case-insensitive regex for "awarded to"

timestampElements.forEach(timestampElement => {
    console.log(`Processing timestamp: ${timestampElement.textContent}`);

    // Get the parent <li> element for the timestamp
    let parentLi = timestampElement.closest('li.sim-infiniteScrollDOMList--item');

    if (parentLi) {
        console.log("Found parent <li> element.");

        // Check if "awarded to" exists within this <li>
        let projectAwardedElement = parentLi.querySelector('div.plain-text-display');
        if (projectAwardedElement && regex.test(projectAwardedElement.textContent)) {
            let extractedText = projectAwardedElement.textContent.split(regex)[1].trim();
            console.log(`Extracted Text for timestamp ${timestampElement.textContent}: ${extractedText}`);
            extractedResults.push(extractedText);
        } else {
            console.log("Did not find 'awarded to' text within this <li>.");
        }
    } else {
        console.log("Did not find parent <li> element for this timestamp.");
    }
});


            // Append results to clipboard
            if (extractedResults.length > 0) {
                navigator.clipboard.readText().then(clipboardText => {
                    let newText = clipboardText + '\n' + extractedResults.join('\n');
                    navigator.clipboard.writeText(newText).then(() => {
                        console.log("Appended extracted results to clipboard.");

                        // Wait for 3 seconds and then redirect
                        setTimeout(function() {
                            console.log("Redirecting to the specified URL...");
                            window.location.href = "https://mcm.amazon.com/cms/new?from_template=d3a442df-63cb-49b6-8501-60a202a1fa59";
                        }, 3000); // 3 seconds delay

                    }).catch(err => {
                        console.error("Failed to write to clipboard.", err);
                    });
                }).catch(err => {
                    console.error("Failed to read from clipboard.", err);
                });
            } else {
                console.log("No results to append to clipboard.");
            }

        }, 7000); // 5 seconds delay
    });

})();

