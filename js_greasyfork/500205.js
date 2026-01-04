// ==UserScript==
// @name        [Flightradar24] Combo FlightRadar24 Script
// @namespace   HKR
// @match       https://www.flightradar24.com/*
// @grant       none
// @version     1.4.1
// @license     MIT
// @author      Bruna
// @description Changes: Removes ad container on the bottom right, Refreshes every 30 minutes to bypass 30 minute timeout, Adds the aircraft count on the title (you need the statistic widget enabled!)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/500205/%5BFlightradar24%5D%20Combo%20FlightRadar24%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/500205/%5BFlightradar24%5D%20Combo%20FlightRadar24%20Script.meta.js
// ==/UserScript==

// Function to remove the ad once it appears
function removeAdWhenReady() {
    const ad = document.getElementById("primisAdContainer");
    if (ad) {
        ad.remove();  // Remove the ad if found
        observer.disconnect();  // Disconnect the observer once done
    }
}

// Callback function for the observer
function observeDOM() {
    const targetNode = document.body;  // Assuming the ad container might be within the body

    // Options for the observer (we want to observe child additions)
    const config = { childList: true };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(removeAdWhenReady);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Immediately check for the ad in case it's already there
    removeAdWhenReady();
}

// Start observing the DOM
observeDOM();

// Define a function to update the document title
function updateDocumentTitle() {
    // Assuming your HTML snippet is directly available within the document
    var statisticsWidget = document.querySelector('[data-widget-type="statistics"]');
    if (statisticsWidget) {
        // Find the element within the statistics widget that contains the text
        var textElement = statisticsWidget.querySelector('.font-normal');
        if (textElement) {
            // Get the trimmed text content of the element
            var textContent = textElement.textContent.trim();

            // Split the text content by '/'
            var parts = textContent.split('/');

            // Check if there are at least two parts (before and after '/')
            if (parts.length > 0) {
                // Extract the first part and remove any commas
                var firstNumber = parts[0].replace(',', '');

                // Set the document title with the extracted number
                document.title = `[${firstNumber}] Flightradar24`;
            } else {
                document.title = '[Error! Check console] Flightradar24';
                console.error('Could not find a valid format for the text');
            }
        } else {
            document.title = '[Error! Check console] Flightradar24';
            console.error('Could not find element with class .font-normal');
        }
    } else {
        document.title = '[Error! Check console] Flightradar24';
        console.error('Could not find statistics widget. Select Widgets on the menu and enable the "Statistics" one. Upon that, go back to the app. Everything should work.');
    }
}

// Call the function immediately to update the title initially
updateDocumentTitle();


const tillThirty = setTimeout(thirty, 1798000);

function thirty() {
  console.log("30 Minute time reached. Refreshing...")
  location.reload();
}


// Set interval to update the title every 20ms
setInterval(updateDocumentTitle, 20);