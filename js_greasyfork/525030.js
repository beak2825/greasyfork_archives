// ==UserScript==
// @name         Faction Revive Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Checks all factions users in the hospital, and determines if they are revivable.
// @author       Marzen [3385879]
// @match        https://www.torn.com/factions.php?step=profile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/525030/Faction%20Revive%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/525030/Faction%20Revive%20Assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // **CONFIGURABLE OPTIONS**
    const API_DELAY = 750;              // Set rate limit delay for API (in ms)
    const CONTINOUS_DELAY = 5000        // Set  delay for continous check button (in ms)

    // Variables for script
    let isRunning = false;
    let isContinuous = false;
    let isCanceled = false;

    function createApiKeyDiv() {
        let existingContainer = document.getElementById('revive-api-container');
        if (existingContainer) return;

        waitForMembersList((membersList) => {
            let container = document.createElement('div');
            container.id = 'revive-api-container';
            container.classList.add('revive-api-container');

            container.innerHTML = `
                <div class="revive-header">
                    Faction Revive Assistant
                </div>
                <div class="revive-input-group">
                    <label class="revive-label">API Key:</label>
                    <div class="revive-input-wrapper">
                        <input type="password" id="apiKeyInput" class="revive-input" value="${localStorage.reviveApiKey || ''}" />
                        <button id="toggleApiKeyVisibility" class="toggle-visibility-btn">👁</button>
                    </div>
                    <button id="updateKey" class="revive-asst-btn">Save</button>
                    <button id="clearKey" class="revive-asst-btn">Clear</button>
                </div>
                <div class="revive-buttons">
                    <button id="toggleScan" class="revive-asst-btn">Start Continuous Scan</button>
                    <button id="initiateReviveCheck" class="revive-asst-btn">Start Revive Check</button>
                </div>
            `;

            // Insert container before members list
            membersList.insertAdjacentElement('beforebegin', container);

            // Create styles
            const style = document.createElement('style');
            style.innerHTML = `
                .revive-api-container {
                    background: #222;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    font-size: 14px;
                    margin-top: 10px;
                }

                .revive-header {
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid gray;
                    width: 100%;
                }

                .revive-input-group {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                    flex-wrap: nowrap;
                }

                .revive-label {
                    font-weight: bold;
                    white-space: nowrap;
                }

                .revive-input-wrapper {
                    position: relative;
                    flex-grow: 1;
                    min-width: 150px;
                    display: flex;
                    align-items: center;
                }

                .revive-input {
                    flex-grow: 1;
                    flex-shrink: 1;
                    min-width: 100px;
                    padding: 4px 30px 4px 8px;
                    text-align: left;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    background: #333;
                    color: white;
                }

                .toggle-visibility-btn {
                    position: absolute;
                    right: 4px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: white;
                    font-size: 16px;
                }

                .toggle-visibility-btn:hover {
                    color: #aaa;
                }

                .revive-asst-btn {
                    background: #444;
                    color: white;
                    border: 1px solid #555;
                    padding: 6px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.2s;
                    white-space: nowrap;
                    text-align: center;
                }

                .revive-asst-btn:hover {
                    background: #555;
                    border-color: #777;
                }
                .revive-asst-btn:disabled {
                    background: #333 !important;
                    border-color: #222 !important;
                    color: gray !important;
                    cursor: not-allowed !important;
                }

                .revive-buttons .revive-asst-btn {
                    flex: 1;
                }

                .revive-input-group .revive-asst-btn {
                    flex: 0 0 auto;
                }

                .revive-buttons {
                    margin-top: 8px;
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    width: 100%;
                }

                @media (max-width: 600px) {
                    .revive-asst-btn, .revive-input {
                        width: 100%;
                    }

                    .revive-input-group .revive-asst-btn {
                        width: auto;
                    }
                }
            `;
            document.head.appendChild(style);

            // Button event handlers
            document.getElementById("updateKey").addEventListener("click", async () => {
                let apiKey = document.getElementById("apiKeyInput").value.trim();
                let isValid = await validateApiKey(apiKey);
                if (isValid) {
                    localStorage.reviveApiKey = apiKey;
                    alert('API key has been saved!')
                } else {
                    alert('API key validation failed. Please check the API key to ensure it is still active.')
                }
            });

            document.getElementById("clearKey").addEventListener("click", () => {
                localStorage.reviveApiKey = "";
                document.getElementById("apiKeyInput").value = "";
                alert('API key has been cleared!')
            });

            document.getElementById("toggleScan").addEventListener("click", function () {
                isContinuous = !isContinuous;
                if (isContinuous) {
                    isCanceled = false;
                } else {
                    isCanceled = true;
                }
                this.textContent = isContinuous ? "Stop Continuous Scan" : "Start Continuous Scan";
                document.getElementById("initiateReviveCheck").disabled = isContinuous;
                console.log(`[FRA] Continuous scan: ${isContinuous}`);
                if (isContinuous) updateFactionMembers();
            });

            document.getElementById("initiateReviveCheck").addEventListener("click", function () {
                if (!isRunning) {
                    isCanceled = false;
                    console.log("[FRA] Starting one-time revive check...");
                    this.textContent = "Cancel Revive Check";
                    document.getElementById("toggleScan").disabled = true;
                    updateFactionMembers().finally(() => {
                        this.textContent = "Start Revive Check";
                        document.getElementById("toggleScan").disabled = false;
                        console.log("[FRA] One-time revive check complete.");
                    });
                } else {
                    isCanceled = true;
                    this.textContent = "Start Revive Check";
                }
            });

            document.getElementById("toggleApiKeyVisibility").addEventListener("click", function () {
                let input = document.getElementById("apiKeyInput");
                input.type = input.type === "password" ? "text" : "password";
            });
        });
    }

    // Get user data
    async function queryUserData(userId, key) {
        try {
            const response = await fetch(`https://api.torn.com/v2/user/${userId}/`, {
                headers: {
                    "Authorization": `ApiKey ${key}`
                }
            });
            if (!response.ok) throw new Error("Unable to query user");
            return await response.json();
        } catch (error) {
            console.error("Failed to validate API key:", error);

            // Update progress indicator
            updateProgressIndicator("Invalid API key. Please check key and try again.")

            // Prevent script from running
            isRunning = false;
            isContinuous = false;

            // Re-enable buttons
            document.getElementById("toggleScan").disabled = false;
            document.getElementById("initiateReviveCheck").disabled = false;

            // Return false
            return false;
        }
    }

    // Scrape faction page for users in hospital
    async function updateFactionMembers(key) {
        if (isRunning) return;

        // Variables to ensure function isn't trigger by observer while already running
        isRunning = true;
        isCanceled = false;

        // Parse all rows to get faction members available
        let rows = document.querySelectorAll(".members-list .table-body .table-row");
        if (!rows.length) return (isRunning = false);

        // Get total faction members reported
        let totalMembers = getTotalFactionMembers();

        // Check if all faction members have loaded. If not, then exit script
        if (rows.length < totalMembers) return (isRunning = false);

        // Filter rows to exclude those hidden by TornTools
        rows = Array.from(rows).filter(row => !row.classList.contains('tt-hidden'));
        if (!rows.length) return (isRunning = false);

        // Verify API key after table has fully loaded
        const apiKey = localStorage.reviveApiKey;
        if (!apiKey) {
            console.warn("[FRA] No API Key found!");
            isRunning = false;
            updateProgressIndicator(`Revive check canceled.`);
            alert('API key is missing. Please enter the key and try again.');
            return;
        }

        // Variables for progress box
        let processed = 0, revivable = 0;
        let apiRequestCount = 0;
        const total = rows.length;

        // Update progress indicator
        updateProgressIndicator(`Processing faction members...`);

        // Track script run time for rate-limiting
        let runTime = Date.now();

        for (const row of rows) {
            if (isCanceled) {
                updateProgressIndicator("Revive check canceled.");
                isRunning = false;
                return;
            }

            const profileLink = row.querySelector('a[href*="/profiles.php?XID="]');
            const status = row.querySelector(".status span").textContent.trim();
            if (profileLink && status === "Hospital") {

                // Query user information and add indicator if they are in the hospital
                const match = profileLink.href.match(/XID=(\d+)/);
                if (match) {
                    let userId = match[1];

                    // Calculate expected elapsed time
                    const expectedElapsedTime = API_DELAY * apiRequestCount;
                    const actualElapsedTime = Date.now() - runTime;

                    // Delay if necessary
                    if (actualElapsedTime < expectedElapsedTime) {
                        await new Promise(resolve => setTimeout(resolve, expectedElapsedTime - actualElapsedTime));
                    }

                    let userData = await queryUserData(userId, apiKey);
                    if (userData) {
                        let isRevivable = userData?.profile?.revivable; // Check if user is revivable

                        // Get current user div
                        let userDiv = row.querySelector('[class^="userInfoBox"]');
                        if (userDiv) {
                            let reviveIcon = userDiv.querySelector(".revivable-indicator");

                            // Symbol to denote revive icon
                            let newText = isRevivable ? "✅" : "❌";

                            if (!reviveIcon) {
                                // If the indicator doesn't exist, create it
                                reviveIcon = document.createElement("span");
                                reviveIcon.className = "revivable-indicator";
                                reviveIcon.textContent = newText;
                                userDiv.insertBefore(reviveIcon, userDiv.firstChild);
                                console.log(`[FRA] Marked User ${userId} as ${isRevivable ? "revivable ✅" : "not revivable ❌"}.`);
                            } else {
                                // If the indicator exists, update it if needed
                                if (reviveIcon.textContent !== newText) {
                                    reviveIcon.textContent = newText;
                                    console.log(`[FRA] Updated User ${userId} to ${isRevivable ? "revivable ✅" : "not revivable ❌"}.`);
                                }
                            }
                        }

                        // Update revivable counter
                        if (isRevivable) revivable++;

                    } else {
                        console.log(`[FRA] Unable to query data for user: ${userId}`);

                    }

                    // Increment API request count
                    apiRequestCount++
                }
            }

            // Update progress indicator
            processed++;
            updateProgressIndicator(`Progress: ${total > 0 ? (processed / total * 100).toFixed(0) : 0}% | Revivable: ${revivable}`);
        }

        updateProgressIndicator(`Revivable: ${revivable}`);
        isRunning = false;

        // If continous scan is enabled, then reinitate after delay
        if (isContinuous) {
            console.log(`[FRA] Continuous scan enabled. Starting in ${CONTINOUS_DELAY} ms.`);
            setTimeout(updateFactionMembers, CONTINOUS_DELAY);
        } else {
            // Update buttons since run has finished
            document.getElementById("toggleScan").disabled = false;
            document.getElementById("initiateReviveCheck").disabled = false;
            console.log("[FRA] Revive check has been completed.");
        }
    }

    // Get the faction member count from faction info section
    function getTotalFactionMembers() {
        const memberText = document.querySelector(".f-info li:nth-child(3)")?.textContent.trim();
        if (!memberText) return 0;

        const memberCount = memberText.match(/(\d+)\s*\/\s*\d+/);
        return memberCount ? parseInt(memberCount[1], 10) : 0;
    }

    // Get number of members currently loaded in the table
    function getLoadedFactionMembers() {
        return document.querySelectorAll(".members-list .table-body .table-row").length;
    }

    // Function to wait for members list (using setInterval for ease of use)
    function waitForMembersList(callback) {
        console.log("[FRA] Waiting for members list...");
        const checkInterval = setInterval(() => {
            const membersList = document.querySelector('.members-list');
            if (membersList) {
                console.log("[FRA] Members list found!");
                clearInterval(checkInterval);
                callback(membersList);
            }
        }, 500);
    }

    // Progress indicator function
    function updateProgressIndicator(text) {
        let progressDiv = document.getElementById("revive-progress");

        if (!progressDiv) {
            // Create a new progress box if it doesn’t exist
            progressDiv = document.createElement("div");
            progressDiv.id = "revive-progress";
            progressDiv.style.position = "fixed";
            progressDiv.style.bottom = "10px";
            progressDiv.style.left = "10px";
            progressDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            progressDiv.style.color = "white";
            progressDiv.style.padding = "10px";
            progressDiv.style.borderRadius = "5px";
            progressDiv.style.zIndex = "1000";
            progressDiv.style.cursor = "pointer";
            progressDiv.onclick = () => progressDiv.remove();
            document.body.appendChild(progressDiv);
        }

        // Update text content
        progressDiv.textContent = text;
    }

    // Validate an API key
    async function validateApiKey(key) {
        try {
            const response = await fetch(`https://api.torn.com/v2/user/`, {
                headers: {
                    "Authorization": `ApiKey ${key}`
                }
            });

            // Get JSON from response
            const data = await response.json();
            if (data.error) {
                console.warn(`API Key validation failed: ${data.error.error}`);
                localStorage.reviveApiKey = "";
                return false;
            }
            return true;
        } catch (error) {
            console.error("Failed to validate API key:", error);
            return false;
        }
    }

    // Create div to allow for functionality
    createApiKeyDiv();

})();