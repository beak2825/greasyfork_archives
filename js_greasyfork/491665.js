// ==UserScript==
// @name         Find New Accounts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search for new accounts
// @author       kloob
// @match        www.gaiaonline.com/moddog/
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/491665/Find%20New%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/491665/Find%20New%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let startID = 46571445; // Hardcoded starting ID

function addButtonsAndTable() {
    let insertionPoint = document.getElementById('tools_and_resources');
    if (!insertionPoint) {
        console.warn('Insertion point for buttons not found.');
        return; // Exit if the specific fieldset is not found
    }

    // Create a container for the buttons and input field
    const container = document.createElement('div');
    container.style.marginTop = '10px'; // Add some space above the buttons, adjust as needed
    container.style.width = 'calc(100% - 15px)'; // Make the div 10px less wide than its container
    container.style.margin = '0 auto'; // Center the div within its parent element
    container.style.padding = '5px'; // Add padding to prevent content from touching

    // Create and add the Check button
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Load New Accounts';
    container.appendChild(checkButton);

    // Create and add the Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset User ID';
    resetButton.style.marginLeft = '5px'; // Adds a small gap between the buttons
    container.appendChild(resetButton);

    // Create an input field for new start ID
    const startIdInput = document.createElement('input');
    startIdInput.type = 'number';
    startIdInput.placeholder = 'Enter new start ID';
    startIdInput.style.marginLeft = '5px'; // Adds a small gap after the buttons
    container.appendChild(startIdInput);

    // Create and add the Set Start ID button
    const setStartIdButton = document.createElement('button');
    setStartIdButton.textContent = 'Set Start ID';
    setStartIdButton.style.marginLeft = '5px'; // Adds a small gap after the input field
    container.appendChild(setStartIdButton);

    // Event listeners for the buttons
    checkButton.addEventListener('click', function() {
        checkForNewUserIDs();
    });

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('lastReviewedUserID');
        alert('User ID check has been reset to start from ' + startID);
        let existingTable = document.getElementById('userIdInfoTable');
        if (existingTable) existingTable.remove();
        createEmptyTable(); // Re-initialize the empty table after reset
    });

    // Event listener for the Set Start ID button
    setStartIdButton.addEventListener('click', function() {
        const newStartId = parseInt(startIdInput.value, 10);
        if (!isNaN(newStartId) && newStartId > 0) {
            startID = newStartId; // Overwrite the startID with the new value
            console.log(`Start ID updated to: ${startID}`);
            // Optionally, you may want to clear the table or give some feedback here
        } else {
            alert('Please enter a valid ID.');
        }
    });

    // Correctly insert the container after the fieldset
    insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);

    // Inside your addButtonsAndTable function
    const checkLatestIdButton = document.createElement('button');
    checkLatestIdButton.textContent = 'Check for Latest ID';
    checkLatestIdButton.style.marginLeft = '5px';
    container.appendChild(checkLatestIdButton);

    checkLatestIdButton.addEventListener('click', findLatestAccountId);


    // Event listener for the Fetch Latest ID button
    checkLatestIdButton.addEventListener('click', function() {
        findLatestAccountId(); // This function needs to be defined to fetch the latest account ID
    });

    // Insert the container after the fieldset
    insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);

    // Call createEmptyTable at the end
    createEmptyTable();

    // Create a disclaimer div
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.textContent = "Disclaimer! This tool is not intended to be a one-stop-shop for your modding activities. Just because an account is flagged does NOT mean it is truly a BoS User or an Exclusive Advertiser. Do your due diligence and investigate an account fully before taking any actions.";
    disclaimerDiv.style.marginTop = '10px'; // Add some space above the disclaimer text
    disclaimerDiv.style.width = 'calc(100% - 15px)'; // Make the div 10px less wide than its container
    disclaimerDiv.style.margin = '0 auto'; // Center the div within its parent element
    disclaimerDiv.style.padding = '5px'; // Add padding to prevent content from touching

    // Insert the disclaimer div below the buttons container
    insertionPoint.parentNode.insertBefore(disclaimerDiv, container.nextSibling);
}


function findLatestAccountId() {
    let currentID = startID; // Starting from the last known startID
    let attempts = 0;
    const maxAttempts = 20; // Limiting the number of attempts to prevent excessive requests
    let highestSuccessfulID = startID; // Keep track of the highest ID found

    const checkExistence = (id) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.gaiaonline.com/admin/user/mod/${id}`,
            onload: function(response) {
                if (response.responseText.includes("User cannot be found")) {
                    console.log(`Latest existing ID found: ${id - 3}`); // The last existing ID before the non-existing one
                    highestSuccessfulID = id - 3; // Update highestSuccessfulID to the last known existing ID
                    updateInputWithValue(highestSuccessfulID); // Update the input field with the highest ID found
                } else {
                    highestSuccessfulID = id; // Update highestSuccessfulID since this ID exists
                    if (attempts < maxAttempts) {
                        // Increment and check the next ID
                        attempts++;
                        checkExistence(id + 3);
                    } else {
                        console.log('Max attempts reached without finding a non-existing ID.');
                        updateInputWithValue(highestSuccessfulID); // Update the input field if max attempts reached
                    }
                }
            },
            onerror: function() {
                console.error(`Error checking ID: ${id}`);
                // Handle the error as needed
            }
        });
    };

    checkExistence(currentID);
}


function updateInputWithValue(id) {
    const startIdInput = document.querySelector('input[type="number"][placeholder="Enter new start ID"]');
    if (startIdInput) {
        startIdInput.value = id;
        console.log(`Input updated with latest ID: ${id}`);
    }
}






function checkForNewUserIDs() {
    let table = document.getElementById('userIdInfoTable');
    if (table.rows.length > 1) { // Clear existing data except for the header
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }

    // Show initial loading message
    let loadingRow = table.insertRow(-1);
    let loadingCell = loadingRow.insertCell(0);
    loadingCell.textContent = 'Loading New Users.';
    loadingCell.colSpan = 4; // Assuming 3 columns: ID, Username, Last Login IP

    let dots = 1;
    let loadingInterval = setInterval(() => {
        dots = (dots % 3) + 1; // Cycle through 1 to 3 dots
        loadingCell.textContent = `Loading New Users${'.'.repeat(dots)}`;
    }, 500); // Update message every 500ms

    let userID = Math.max(getNextUserID(), startID);
    let foundIDsUsernamesIPs = [];

    for (let i = 0; i < 10; i++) {
        setTimeout(() => { // Spread out checks to visually simulate loading
            checkUserID(userID, foundIDsUsernamesIPs);
            userID += 3;
            if (i === 9) { // After the last check, clear the interval and display results
                clearInterval(loadingInterval);
                displayResultsInTable(foundIDsUsernamesIPs);
            }
        }, i * 500); // Adjust timing as needed
    }
}


function checkUserID(userID, foundIDsUsernamesIPs) {
    const url = `https://www.gaiaonline.com/admin/user/mod/${userID}`;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            const usernameRegex = /Username:\s*(\w+)/;
            const lastLoginIPRegex = /Last Login IP:.*?(\d+\.\d+\.\d+\.\d+)/;
            const usernameMatch = usernameRegex.exec(response.responseText);
            const lastLoginIPMatch = lastLoginIPRegex.exec(response.responseText);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const avatarImg = doc.querySelector('img[alt*="avatar"]');
            const bannedElement = doc.querySelector('p.error');

            if (usernameMatch && lastLoginIPMatch && avatarImg) {
                const lastLoginIP = lastLoginIPMatch[1];
                const lastLoginIPDecimal = ipToDecimal(lastLoginIP); // Convert IP to decimal
                const lastLoginIPLink = `https://www.gaiaonline.com/forum/mod/ip/?i=${lastLoginIPDecimal}&u=${userID}`;

                foundIDsUsernamesIPs.push({
                    id: userID,
                    username: usernameMatch[1],
                    lastLoginIP: lastLoginIP, // Keep the original IP for display
                    lastLoginIPLink: lastLoginIPLink,
                    avatarURL: avatarImg ? avatarImg.src : '',
                    isBanned: !!bannedElement
                });
            } else {
                console.log(`Incomplete data for User ID ${userID}.`);
            }

            saveLastReviewedID(userID);
        },
        onerror: function(err) {
            console.error(`Error fetching data for User ID ${userID}:`, err);
        }
    });
}



    function getNextUserID() {
        return parseInt(localStorage.getItem('lastReviewedUserID') || '0') + 3;
    }

    function saveLastReviewedID(id) {
        localStorage.setItem('lastReviewedUserID', id.toString());
    }

function createEmptyTable() {
    let insertionPoint = document.getElementById('tools_and_resources');
    if (!insertionPoint) {
        console.warn('Insertion point for table not found.');
        return; // If the specific fieldset is not found
    }

    let table = document.createElement('table');
    table.id = 'userIdInfoTable';
    table.style.width = 'calc(100% - 15px)'; // Make the table 10px less wide than its container
    table.border = '1';
    table.style.margin = '0 auto'; // Center the table if desired

    // Create and set up table headers
    let headerRow = table.createTHead().insertRow(0);
    let headers = ['ID', 'Avatar', 'Username', 'Last Login IP']; // Updated headers
    headers.forEach((text, index) => {
        let headerCell = headerRow.insertCell(index);
        headerCell.textContent = text;
    });

    // Optionally, specify where exactly you want to insert the table within the document
    insertionPoint.parentNode.insertBefore(table, insertionPoint.nextSibling); // Adjust as needed
}





function displayResultsInTable(foundIDsUsernamesIPs) {
    let table = document.getElementById('userIdInfoTable');
    // Clear existing data rows, keeping the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Define flagged IP addresses
    const flaggedIPs = ["71.87.48.110"]; // Extend this array to include more IPs as needed

    // Populate the table with data
    if (foundIDsUsernamesIPs.length === 0) {
        // If there are no new accounts, display a message in a single cell spanning all columns
        let noNewAccountsRow = table.insertRow(-1);
        let noNewAccountsCell = noNewAccountsRow.insertCell(0);
        noNewAccountsCell.textContent = "No more new accounts. Check back later.";
        noNewAccountsCell.colSpan = 4; // Assuming 3 columns: ID, Avatar, Username, Last Login IP
        noNewAccountsCell.style.textAlign = 'center'; // Optionally center the text
    } else {
        // Populate the table with data when new accounts are found
        foundIDsUsernamesIPs.forEach(data => {
            let row = table.insertRow(-1);

            // Check if the current IP is flagged and set the row color if it is
            if (flaggedIPs.includes(data.lastLoginIP)) {
                row.style.backgroundColor = "#ffcccc"; // Light red color for flagged rows
            }

            // Populate row cells (ID, Avatar, Username, and Last Login IP)
            // ID Column as clickable URL
            let idCell = row.insertCell(-1);
            let idLink = document.createElement('a');
            idLink.href = `https://www.gaiaonline.com/admin/user/mod/${data.id}`;
            idLink.textContent = data.id;
            idLink.target = "_blank";
            idCell.appendChild(idLink);

            // Avatar Column
            let avatarCell = row.insertCell(-1);
            if (data.avatarURL) {
                let avatarImg = document.createElement('img');
                avatarImg.src = data.avatarURL;
                avatarImg.alt = "User's Avatar";
                avatarImg.style.maxWidth = '50px';
                avatarImg.style.height = 'auto';
                avatarCell.appendChild(avatarImg);
            } else {
                avatarCell.textContent = 'No Avatar';
            }

            // Username Column
            let usernameCell = row.insertCell(-1);
            usernameCell.textContent = data.username;

            // Last Login IP Column
            let ipCell = row.insertCell(-1);
            // Use a function to generate the link with the IP decimal
            ipCell.innerHTML = createIpLink(data.lastLoginIP, data.id);
        });
    }
}

function createIpLink(ipAddress, userId) {
    // Create a link with the formatted URL
    return `<a href="https://www.gaiaonline.com/forum/mod/ip/?i=${ipToDecimal(ipAddress)}&u=${userId}" target="_blank">${ipAddress}</a>`;
}

// Function to convert IP address to decimal
function ipToDecimal(ip) {
    return ip.split('.').reduce((acc, octet) => acc * 256 + parseInt(octet, 10), 0);
}


    addButtonsAndTable(); // Initialize the UI components
})();
