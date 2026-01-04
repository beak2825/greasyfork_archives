// ==UserScript==
// @name         HDBits: Paste Invitee Information & Check IP
// @namespace    https://passthepopcorn.me/user.php?id=125754
// @match        https://hdbits.org/invite.php
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @version      0.7
// @description  Adds buttons to paste user information and check IP details on HDBits.org
// @icon         https://hdbits.org/favicon.ico
// @author       Faiyaz93
// @license      HDB
// @downloadURL https://update.greasyfork.org/scripts/503032/HDBits%3A%20Paste%20Invitee%20Information%20%20Check%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/503032/HDBits%3A%20Paste%20Invitee%20Information%20%20Check%20IP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the new buttons
    function addButtonsRow() {
        // Get the table where the form is located
        const table = document.querySelector('table[border="1"]');

        if (!table) {
            console.error("Table not found on the page.");
            return; // Exit if the table isn't found
        }

        // Create a new row for the buttons
        const newRow = document.createElement('tr');
        const newCell = document.createElement('td');
        newCell.setAttribute('colspan', '2');
        newCell.setAttribute('align', 'center');

        // Create the "Paste Information" button
        const pasteButton = document.createElement('button');
        pasteButton.innerText = 'Paste Information';
        pasteButton.style.marginBottom = '10px';
        pasteButton.type = 'button';

        // Create the "Check IP" button
        const checkIpButton = document.createElement('button');
        checkIpButton.innerText = 'Check IP';
        checkIpButton.style.marginBottom = '10px';
        checkIpButton.style.marginLeft = '10px'; // Add some space between the buttons
        checkIpButton.type = 'button';

        newCell.appendChild(pasteButton);
        newCell.appendChild(checkIpButton);
        newRow.appendChild(newCell);

        // Insert the new row as the topmost row in the table
        table.insertBefore(newRow, table.firstChild);

        // Paste Information button event listener
        pasteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const clipboardText = await navigator.clipboard.readText();

                if (!clipboardText) {
                    alert("Clipboard is empty or access to clipboard is not allowed.");
                    return;
                }

                // Extract IP address from the clipboard data
                const ipMatch = clipboardText.match(/(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/);
                const ip = ipMatch ? ipMatch[0] : '';

                if (!ip) {
                    alert("No IP address found in the clipboard content.");
                    return;
                }

                // Fetch IP details using GM_xmlhttpRequest
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://ipinfo.io/${ip}?token=9c0cbe1717929f`,
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            const country = data.country || 'Unknown Country';
                            const region = data.region || 'Unknown Region';
                            const org = data.org || 'Unknown Organization';

                            // Handle VPN detection based on the organization field
                            if (org.toLowerCase().includes('vpn')) {
                                alert('VPN IP Detected! Please Double Check!');
                            }

                            // Replace the IP in the clipboard text with IP, country, and region
                            const updatedClipboardText = clipboardText.replace(ip, `${ip} (${country}/${region})`);

                            // Fill in the Email address field (if applicable)
                            const emailMatch = clipboardText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
                            const email = emailMatch ? emailMatch[0] : '';

                            if (email) {
                                const emailField = document.querySelector('input[name="email"]');
                                if (emailField) {
                                    emailField.value = email;
                                } else {
                                    console.error("Email input field not found.");
                                }
                            }

                            // Fill in the Recruitment notes field with the updated text
                            const notesField = document.querySelector('textarea[name="notes"]');
                            if (notesField) {
                                notesField.value = updatedClipboardText;
                            } else {
                                console.error("Recruitment notes textarea not found.");
                            }
                        } else {
                            console.error('Failed to fetch IP details:', response.statusText);
                            alert('Failed to fetch IP details. Please check your browser permissions.');
                        }
                    },
                    onerror: function(err) {
                        console.error('Failed to fetch IP details:', err);
                        alert('Failed to fetch IP details. Please check your browser permissions.');
                    }
                });
            } catch (err) {
                console.error('Failed to fetch IP details: ', err);
                alert('Failed to fetch IP details. Please check your browser permissions.');
            }
        });

        // Check IP button event listener
        checkIpButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const clipboardText = await navigator.clipboard.readText();

                if (!clipboardText) {
                    alert("Clipboard is empty or access to clipboard is not allowed.");
                    return;
                }

                // Extract IP address from the clipboard data
                const ipMatch = clipboardText.match(/(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/);
                const ip = ipMatch ? ipMatch[0] : '';

                if (!ip) {
                    alert("No IP address found in the clipboard content.");
                    return;
                }

                // Open the IP lookup website with the corresponding IP in a new tab
                GM_openInTab(`https://whatismyipaddress.com/ip/${ip}`, { active: true });
            } catch (err) {
                console.error('Failed to open IP lookup page: ', err);
                alert('Failed to open IP lookup page. Please check your browser settings.');
            }
        });
    }

    window.addEventListener('load', addButtonsRow);
})();
