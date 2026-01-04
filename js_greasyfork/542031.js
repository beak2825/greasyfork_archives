// ==UserScript==
// @name         Cartel Empire - Los Médicos Revive
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a 'Revive Me' button to Cartel Empire user profiles if the player is in hospital, and sends formatted profile data to Discord with a role ping.
// @author       DAN
// @match        https://cartelempire.online/user/*
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542031/Cartel%20Empire%20-%20Los%20M%C3%A9dicos%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/542031/Cartel%20Empire%20-%20Los%20M%C3%A9dicos%20Revive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Discord Webhook URL (This should be your proxy URL now)
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1391526374807834835/NnlswLH_4uLYg4Bo81kv43p1sUC4pUOXFDoF2TqTbWIzL2Ffi1BQDsgJmaVid3gnhVmv"; // Assuming this is now your proxy endpoint

    // IMPORTANT: Replace 'YOUR_REVIVER_ROLE_ID_HERE' with the actual ID of your @Reviver role in Discord.
    // To get the role ID: Enable Developer Mode in Discord (User Settings -> App Settings -> Advanced),
    // then right-click on the @Reviver role in your server and select "Copy ID".
    const REVIVER_ROLE_PING = "<@&1391821769937260664>"; // Example: "<@&123456789012345678>"

    let reviveButtonCreated = false; // Flag to ensure button is created only once
    let observer = null; // To store the MutationObserver instance

    /**
     * Extracts the profile name from the page.
     * Tries to find common heading elements or a specific class.
     * @returns {string} The extracted profile name or a default string.
     */
    function getProfileName() {
        // Try to find a prominent title for the profile name
        const profileNameElement = document.querySelector('h1.profileNameTitle, h2.profileNameTitle, .profileNameTitle, h1, h2');
        if (profileNameElement) {
            // Clean up the text, remove leading/trailing whitespace
            return profileNameElement.textContent.trim();
        }
        // Fallback to document title if no specific element is found
        return document.title.replace(' - Cartel Empire', '').trim() || 'Unknown Profile';
    }

    /**
     * Extracts and formats the specified table's content into key-value pairs.
     * Correctly handles <th> and <td> elements within rows.
     * @returns {string} The formatted table data as a string, or a descriptive error message.
     */
    function getFormattedTableContent() {
        const table = document.querySelector('table.table.align-items-center.table-flush');
        if (!table) {
            console.log('DEBUG: Profile table not found with selector: table.table.align-items-center.table-flush');
            return 'Table not found.';
        }
        console.log('DEBUG: Profile table found.');

        let formattedData = [];
        // Select rows directly within the tbody if it exists, or just tr if not
        const rows = table.querySelectorAll('tbody > tr, tr'); // Prioritize tbody > tr, fallback to tr
        console.log(`DEBUG: Found ${rows.length} rows in the table.`);

        if (rows.length === 0) {
            return 'No data rows found in the table.';
        }

        rows.forEach((row, index) => {
            const labelElement = row.querySelector('th'); // Look for the label in a <th>
            const valueElement = row.querySelector('td'); // Look for the value in a <td>

            if (labelElement && valueElement) {
                const label = labelElement.textContent.trim();
                // For the value, get textContent of the td, which will include text from any child elements like <a>
                const value = valueElement.textContent.trim();

                const cleanedLabel = label.replace(/[:\s]+$/, '').trim(); // Remove trailing colon and spaces
                formattedData.push(`${cleanedLabel}: ${value}`);
                console.log(`DEBUG: Extracted: ${cleanedLabel}: ${value}`);
            } else {
                console.log(`DEBUG: Row ${index} skipped: Could not find both <th> and <td> elements.`);
            }
        });

        if (formattedData.length === 0) {
            return 'No formatted data extracted from table rows.';
        }

        return formattedData.join('\n'); // Join each line with a newline character
    }

    /**
     * Checks if the player's status is "In Hospital" by looking for a specific HTML element.
     * Based on user's clarification:
     * - If <li class="hospitalIcon statusIcon"> (without d-none) is found, player IS in Hospital.
     * - If <li class="hospitalIcon statusIcon d-none"> is found, player is NOT in Hospital (hide button).
     * - If neither is found, player is NOT in Hospital (hide button).
     * @returns {boolean} True if player IS in hospital, false otherwise.
     */
    function isPlayerInHospital() {
        // This selector finds the element if it has both classes but NOT 'd-none'
        const visibleHospitalIcon = document.querySelector('li.hospitalIcon.statusIcon:not(.d-none)');
        // This selector finds the element if it has all three classes, including 'd-none'
        const hiddenHospitalIcon = document.querySelector('li.hospitalIcon.statusIcon.d-none');

        console.log(`DEBUG: isPlayerInHospital: Checking for 'li.hospitalIcon.statusIcon:not(.d-none)': ${visibleHospitalIcon ? 'Found' : 'Not Found'}`);
        console.log(`DEBUG: isPlayerInHospital: Checking for 'li.hospitalIcon.statusIcon.d-none': ${hiddenHospitalIcon ? 'Found' : 'Not Found'}`);

        if (visibleHospitalIcon) {
            console.log('DEBUG: isPlayerInHospital: Player IS in hospital (found visible icon).');
            return true; // Show button
        } else if (hiddenHospitalIcon) {
            console.log('DEBUG: isPlayerInHospital: Player is NOT in hospital (found hidden icon).');
            return false; // Hide button
        } else {
            console.log('DEBUG: isPlayerInHospital: Neither visible nor hidden hospital icon found. Player is NOT in hospital.');
            return false; // Hide button
        }
    }


    /**
     * Creates and appends the 'Revive Me' button to the page.
     */
    function createReviveButton() {
        // Remove any existing button to prevent duplicates if called multiple times by observer
        const existingButton = document.getElementById('reviveMeButton');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.textContent = 'Los Médicos - Revive Me';
        button.id = 'reviveMeButton';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#dc3545'; // Red color
        button.style.color = 'white'; // White text
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000'; // Ensure it's on top
        button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Initial white glow
        button.style.fontSize = '16px';
        button.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

        // Define keyframes for the pulsing glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes whitePulse {
                0% {
                    box-shadow: 0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5);
                }
                50% {
                    box-shadow: 0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8);
                }
                100% {
                    box-shadow: 0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5);
                }
            }
            #reviveMeButton {
                animation: whitePulse 1.5s infinite ease-in-out;
            }
        `;
        document.head.appendChild(style);


        // Add hover effect
        button.onmouseover = () => {
            button.style.backgroundColor = '#c82333'; // Darker red on hover
            button.style.boxShadow = '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8)'; // Stronger glow on hover
            button.style.animation = 'none'; // Stop pulse animation on hover for a cleaner look
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#dc3545'; // Original red
            button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Original glow
            button.style.animation = 'whitePulse 1.5s infinite ease-in-out'; // Resume pulse animation
        };

        button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = 'Sending...';
            button.style.animation = 'none'; // Stop animation when clicked
            button.style.boxShadow = 'none'; // Remove glow when clicked

            const profileName = getProfileName();
            const formattedTableContent = getFormattedTableContent(); // Use the new formatted content
            const currentPageUrl = window.location.href;

            // Construct the Discord message with the role ping
            const discordMessage = `${REVIVER_ROLE_PING} **Revive Request from Cartel Empire**\n\n` +
                                   `**Profile Name:** ${profileName}\n` +
                                   `**Profile URL:** ${currentPageUrl}\n\n` +
                                   `**Profile Data:**\n\`\`\`\n${formattedTableContent}\n\`\`\``; // Use markdown code block for text

            const payload = {
                content: discordMessage
            };

            try {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: DISCORD_WEBHOOK_URL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    onload: function(response) {
                        if (response.status === 204 || response.status === 200) {
                            button.textContent = 'Sent Successfully!';
                            button.style.backgroundColor = '#007bff'; // Blue for success
                            setTimeout(() => {
                                button.textContent = 'Los Médicos - Revive Me';
                                button.style.backgroundColor = '#dc3545'; // Reset to red
                                button.style.animation = 'whitePulse 1.5s infinite ease-in-out'; // Resume pulse
                                button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Resume glow
                                button.disabled = false;
                            }, 3000); // Reset button after 3 seconds
                        } else {
                            button.textContent = 'Failed to Send!';
                            button.style.backgroundColor = '#dc3545'; // Red for error
                            console.error('Discord webhook failed:', response.status, response.responseText);
                            setTimeout(() => {
                                button.textContent = 'Los Médicos - Revive Me';
                                button.style.backgroundColor = '#dc3545'; // Reset to red
                                button.style.animation = 'whitePulse 1.5s infinite ease-in-out'; // Resume pulse
                                button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Resume glow
                                button.disabled = false;
                            }, 3000); // Reset button after 3 seconds
                        }
                    },
                    onerror: function(error) {
                        button.textContent = 'Error Sending!';
                        button.style.backgroundColor = '#dc3545'; // Red for error
                        console.error('GM.xmlHttpRequest error:', error);
                        setTimeout(() => {
                            button.textContent = 'Los Médicos - Revive Me';
                            button.style.backgroundColor = '#dc3545'; // Reset to red
                            button.style.animation = 'whitePulse 1.5s infinite ease-in-out'; // Resume pulse
                            button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Resume glow
                            button.disabled = false;
                        }, 3000); // Reset button after 3 seconds
                    }
                });
            } catch (e) {
                button.textContent = 'Script Error!';
                button.style.backgroundColor = '#dc3545'; // Red for error
                console.error('Userscript execution error:', e);
                setTimeout(() => {
                    button.textContent = 'Los Médicos - Revive Me';
                    button.style.backgroundColor = '#dc3545'; // Reset to red
                    button.style.animation = 'whitePulse 1.5s infinite ease-in-out'; // Resume pulse
                    button.style.boxShadow = '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.5)'; // Resume glow
                    button.disabled = false;
                }, 3000); // Reset button after 3 seconds
            }
        });

        document.body.appendChild(button);
    }

    /**
     * Checks the hospital status and creates/removes the button accordingly.
     */
    function checkAndCreateButton() {
        if (isPlayerInHospital()) {
            if (!reviveButtonCreated) {
                console.log('Player is in hospital. Creating "Revive Me" button.');
                createReviveButton();
                reviveButtonCreated = true;
                // Disconnect observer once the button is successfully created
                if (observer) {
                    observer.disconnect();
                    console.log('DEBUG: MutationObserver disconnected.');
                }
            }
        } else {
            console.log('Player is not in hospital. Ensuring button is removed.');
            const existingButton = document.getElementById('reviveMeButton');
            if (existingButton) {
                existingButton.remove();
                reviveButtonCreated = false;
            }
        }
    }

    // Main execution logic
    // Initial check on page load
    window.addEventListener('load', () => {
        checkAndCreateButton();

        // Set up MutationObserver to watch for dynamic changes
        if (!observer) {
            observer = new MutationObserver((mutationsList, observerInstance) => {
                // Check if the button has already been created and the observer disconnected
                if (reviveButtonCreated) {
                    observerInstance.disconnect(); // Ensure it's truly disconnected
                    return;
                }
                // Only act if the button hasn't been created yet
                checkAndCreateButton();
            });

            // Start observing the document body for changes in its children and subtree
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('DEBUG: MutationObserver started observing document.body.');
        }
    });

})();
