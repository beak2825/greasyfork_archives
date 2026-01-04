// ==UserScript==
// @name         Copy Lead Button
// @namespace    https://yournamespace.example.com/
// @version      1.6
// @description  Add Copy Lead button to pages starting with "https://enabledplus.com/Lead"
// @author       Nathan Resinger
// @match        https://*enabledplus.com/Lead*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483796/Copy%20Lead%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/483796/Copy%20Lead%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract URL from the onclick attribute
    function extractURLFromOnclick(onclick) {
        const match = onclick.match(/ShowPopupWindow\('([^']+)'\)/);
        if (match && match[1]) {
            return match[1];
        }
        return '';
    }

    // Function to extract the most recent entry type (e.g., "No Answer") and its timestamp, excluding entries with "Note"
    function extractMostRecentEntry(historyTable) {
        const rows = historyTable.querySelectorAll('tr');
        let mostRecentEntryType = '';
        let mostRecentTimestamp = '';

        // Iterate through the rows from top to bottom
        for (let i = 0; i < rows.length; i++) {
            const dateColumn = rows[i].querySelector('td.datecolumn.firstcell');
            const historyColumn = rows[i].querySelector('.historycolumn');
            if (dateColumn && historyColumn && !historyColumn.textContent.includes('Note') &&
                (historyColumn.textContent.includes('Answering Machine') || historyColumn.textContent.includes('Busy') || historyColumn.textContent.includes('Left Message') || historyColumn.textContent.includes('No Answer') || historyColumn.textContent.includes('Not interested'))) {
                const dateText = dateColumn.textContent.trim();
                const dateMatch = dateText.match(/(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} [APap][Mm])/);
                if (dateMatch && dateMatch[0]) {
                    mostRecentEntryType = historyColumn.textContent.trim();
                    mostRecentTimestamp = dateMatch[0];
                    // Break once the first matching entry is found (most recent)
                    break;
                }
            }
        }

        return { type: mostRecentEntryType, timestamp: mostRecentTimestamp };
    }

    // Function to create the complete URL in the desired format
    function createCompleteURL(leadURL, leadText, mostRecentCallBack, mostRecentEntry, territory) {
        const basePart = 'https://enabledplus.com/Lead/';
        const dynamicPart = leadURL.replace('/EditLead', '');
        const formattedDate = mostRecentEntry.timestamp !== '' ? mostRecentEntry.timestamp : '';

        // Find phone numbers and source elements
        const phoneNumberElements = document.querySelectorAll('span.attribute-value.homephonelabel, span.attribute-value.cellphonelabel, span.attribute-value.workphonelabel');
        let phoneNumber = '';
        for (const element of phoneNumberElements) {
            if (element.textContent.trim() !== '') {
                phoneNumber = element.textContent.trim();
                break; // Use the first populated phone number found
            }
        }

        const sourceElements = document.querySelectorAll('span.attribute-value.sourcelabel, span.attribute-value.sourcebreakdownlabel');
        let source = '';
        for (const element of sourceElements) {
            if (element.textContent.trim() !== '') {
                if (source !== '') {
                    source += ' : '; // Add separator if source already found
                }
                source += element.textContent.trim();
            }
        }

        // Construct the complete string
        const completeURL = `${basePart}${dynamicPart}`;
        const infoString = `URL: ${completeURL} | Name: ${leadText} | Date/Time: ${mostRecentCallBack} | Phone Number: ${phoneNumber} | Source: ${source} | Territory: ${territory} | Last Called: ${mostRecentEntry.type} ${formattedDate}`;
        return infoString;
    }

    // Function to extract the most recent "CallBack" entry's date and time
    function extractMostRecentCallBack(historyTable) {
        const rows = historyTable.querySelectorAll('tr');
        let mostRecentCallBack = '';

        // Iterate through the rows from top to bottom
        for (let i = 0; i < rows.length; i++) {
            const historyColumn = rows[i].querySelector('.historycolumn');
            if (historyColumn && historyColumn.textContent.includes('CallBack')) {
                const dateMatch = historyColumn.textContent.match(/(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} [APap][Mm])/);
                if (dateMatch && dateMatch[0]) {
                    mostRecentCallBack = dateMatch[0];
                    // Stop iterating once the first "Callback" entry is found
                    break;
                }
            }
        }

        return mostRecentCallBack;
    }

    // Function to extract the Territory data from the page
    function extractTerritory() {
        const territoryElement = document.querySelector('#selectedstorename');
        if (territoryElement) {
            const territoryText = territoryElement.textContent.trim();
            const territoryMatch = territoryText.match(/-\s+(.+)/);
            if (territoryMatch && territoryMatch[1]) {
                return territoryMatch[1];
            }
        }
        return '';
    }

    // Create a button element
    const copyLeadButton = document.createElement('button');
    copyLeadButton.textContent = 'Copy Lead';
    copyLeadButton.style.position = 'fixed';
    copyLeadButton.style.top = '5px'; // Added 5px space on the top side
    copyLeadButton.style.left = '0';
    copyLeadButton.style.zIndex = '9999';
    copyLeadButton.style.marginLeft = '10px'; // 10px spacing on the left side

    // Add a click event listener to the button
    copyLeadButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default button click behavior

        // Select the element with the specified selector
        const leadElement = document.querySelector('#leadinformation > a');

        // Select the element for the history table
        const historyTable = document.querySelector('table.historydata');

        // Extract the most recent "CallBack" entry's date and time
        const mostRecentCallBack = extractMostRecentCallBack(historyTable);

        // Extract the most recent entry type and timestamp
        const mostRecentEntry = extractMostRecentEntry(historyTable);

        // Extract the Territory data from the page
        const territory = extractTerritory();

        // Check if the elements exist
        if (leadElement && historyTable) {
            // Get the text content and onclick attribute of the selected element
            const leadText = leadElement.textContent;
            const onclick = leadElement.getAttribute('onclick');

            // Extract the URL from the onclick attribute
            const leadURL = extractURLFromOnclick(onclick);

            // Create the string in the desired format, including the type of entry
            const copiedString = createCompleteURL(leadURL, leadText, mostRecentCallBack, mostRecentEntry, territory);

            // Copy the string to the clipboard as plain text
            try {
                await navigator.clipboard.writeText(copiedString);

                // Show "Lead Copied" tooltip
                const tooltip = document.createElement('div');
                tooltip.textContent = 'Lead Copied';
                tooltip.style.position = 'fixed';
                tooltip.style.top = '30px';
                tooltip.style.left = '10px';
                tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '5px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.opacity = '1';
                tooltip.style.transition = 'opacity 0.666s ease-in-out'; // 0.666 seconds

                document.body.appendChild(tooltip);

                // Fade out the tooltip
                setTimeout(function() {
                    tooltip.style.opacity = '0';
                }, 666); // 0.666 seconds
            } catch (error) {
                alert('Error copying lead information to the clipboard.');
            }
        } else {
            alert('Lead information or history table element not found.');
        }
    });

    // Append the button to the body of the webpage
    document.body.appendChild(copyLeadButton);
})();
