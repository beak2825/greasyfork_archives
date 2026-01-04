// ==UserScript==
// @name         -PopZ- Weekly Race Monitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Property of -PopZ-
// @description  Monitor for -PopZ- races (by JohnyBTbagn) on Torn City racing page.
// @author       Jimskylark
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/544639/-PopZ-%20Weekly%20Race%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/544639/-PopZ-%20Weekly%20Race%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API Key Management
    let apiKey = GM_getValue("public_api_key", null);
    let info_line = null;

    // Add menu command for API key management
    GM_registerMenuCommand("Enter Torn API Key", () => {
        let userInput = prompt(
            "Enter your Torn City API Key (Public permissions required):",
            GM_getValue("public_api_key", "")
        );
        if (userInput !== null && userInput.trim() !== "") {
            GM_setValue("public_api_key", userInput.trim());
            apiKey = userInput.trim();
            showToast("API Key saved successfully!");
            // Reload page to use new key
            window.location.reload();
        }
    });

    // Check if current time is between 18:00 and 23:59 TCT
    function isWithinActiveHours() {
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0 = Sun … 6 = Sat
    const utcHour = now.getUTCHours(); // 0 – 23

    // Tuesday is 2  ➜  allow 18:00 ≤ time ≤ 23:59
    return utcDay === 2 && utcHour >= 18 && utcHour <= 23;
}

    // Create info line for messages
    function createInfoLine() {
        info_line = document.createElement("div");
        info_line.id = "race-monitor-info";
        info_line.style.cssText = `
            display: block;
            clear: both;
            margin: 5px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
        `;

        // Add click handler for API key prompt
        info_line.addEventListener("click", () => {
            if (!apiKey) {
                let userInput = prompt(
                    "Enter your Torn City API Key (Public permissions required):",
                    GM_getValue("public_api_key", "")
                );
                if (userInput !== null && userInput.trim() !== "") {
                    GM_setValue("public_api_key", userInput.trim());
                    apiKey = userInput.trim();
                    showToast("API Key saved successfully!");
                    window.location.reload();
                }
            }
        });

        // Insert into page
        const targetDiv = document.querySelector('.delimiter-999.m-top10');
        if (targetDiv) {
            targetDiv.parentNode.insertBefore(info_line, targetDiv.nextSibling);
        }

        return info_line;
    }

    // Set message in info line
    function setMessage(message, isError = false) {
        if (!info_line) return;

        while (info_line.firstChild) {
            info_line.removeChild(info_line.firstChild);
        }

        const textNode = document.createTextNode(message);
        if (isError) {
            info_line.style.color = "red";
            info_line.style.backgroundColor = "#ffebee";
        } else {
            info_line.style.color = "";
            info_line.style.backgroundColor = "#f8f9fa";
        }

        info_line.appendChild(textNode);
    }


    function showToast(message, isError = false) {
        const existing = document.getElementById("toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isError ? '#c62828' : '#28a745'};
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            z-index: 2147483647;
            opacity: 1;
            transition: opacity 0.5s;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // Close button
        const closeBtn = document.createElement("span");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = `
            cursor: pointer;
            margin-left: 8px;
            font-weight: bold;
            font-size: 18px;
        `;
        closeBtn.onclick = () => toast.remove();

        const msg = document.createElement("span");
        msg.textContent = `-PopZ- Race Monitor: ${message}`;

        toast.appendChild(msg);
        toast.appendChild(closeBtn);
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = "0";
                setTimeout(() => toast.remove(), 500);
            }
        }, 4000);
    }

    // Create button element
    function createRaceButton(text, raceId, isFinished = false) {
        const button = document.createElement('a');
        button.href = `https://www.torn.com/loader.php?sid=racing&tab=log&raceID=${raceId}`;
        button.className = 'torn-btn';
        button.style.cssText = `
            display: inline-block;
            padding: 8px 16px;
            margin: 5px;
            background-color: ${isFinished ? '#28a745' : '#007bff'};
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            border: none;
            cursor: pointer;
        `;
        button.textContent = text;

        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        button.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });

        return button;
    }

    // Insert buttons into the target div
    function insertButtons(inProgressId, finishedId) {
        const targetDiv = document.querySelector('.delimiter-999.m-top10');
        if (!targetDiv) {
            console.log('Target div not found');
            return;
        }

        // Clear any existing buttons
        const existingContainer = document.getElementById('race-buttons');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'race-buttons';
        buttonContainer.style.cssText = `
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
            text-align: center;
        `;

        const title = document.createElement('h4');
        title.textContent = '🏁 -PopZ- Race Monitor';
        title.style.cssText = 'margin: 0 0 10px 0; color: #333;';
        buttonContainer.appendChild(title);

        buttonContainer.addEventListener("click", () => {
            if (!apiKey) {
                let userInput = prompt(
                    "Enter your Torn City API Key (Public permissions required):",
                    GM_getValue("public_api_key", "")
                );
                if (userInput !== null && userInput.trim() !== "") {
                    GM_setValue("public_api_key", userInput.trim());
                    apiKey = userInput.trim();
                    showToast("API Key saved successfully!");
                    window.location.reload();
                }
            }
        });

        // Add in-progress race button if available
        if (inProgressId) {
            const inProgressButton = createRaceButton('🔴 View Live Race', inProgressId, false);
            buttonContainer.appendChild(inProgressButton);
        }

        // Add finished race button if available
        if (finishedId) {
            const finishedButton = createRaceButton('✅ View Race Results', finishedId, true);
            buttonContainer.appendChild(finishedButton);
        }

        // If no races found, show status
        if (!inProgressId && !finishedId) {
            const statusDiv = document.createElement('div');
            statusDiv.textContent = 'No -PopZ- races found at this time';
            statusDiv.style.cssText = 'color: #666; font-style: italic;';
            buttonContainer.appendChild(statusDiv);
        }

        // Insert the container after the target div
        targetDiv.parentNode.insertBefore(buttonContainer, targetDiv.nextSibling);
    }

    // Make API call and process response
    async function checkJohnyBTbagnRaces() {
        if (!apiKey) {
            setMessage("API key needed - click here to add", true);
            return;
        }

        try {
            const response = await fetch(`https://api.torn.com/v2/racing/races?limit=100&sort=DESC&cat=custom&key=${apiKey}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);

                // Handle specific API errors
                if (data.error.code === 2) {
                    // Invalid API key
                    GM_setValue("public_api_key", "");
                    apiKey = null;
                    setMessage("Invalid API key - click here to enter a new one", true);
                    showToast("Invalid API key. Please enter a new one.", true);
                } else {
                    setMessage(`API Error: ${data.error.error}`, true);
                    showToast(`API Error: ${data.error.error}`, true);
                }
                return;
            }

            let inProgressRaceId = null;
            let finishedRaceId = null;

            // Look for JohnyBTbagn's races
            for (const race of data.races) {
                if (race.title.includes("JohnyBTbagn&#039;s race") || race.title.includes("JohnyBTbagn's race")) {
                    if (race.status === 'in_progress' && !inProgressRaceId) {
                        inProgressRaceId = race.id;
                    } else if (race.status === 'finished' && !finishedRaceId) {
                        finishedRaceId = race.id;
                    }
                }
            }

            // Insert buttons based on found races
            insertButtons(inProgressRaceId, finishedRaceId);

            console.log('-PopZ- Race Monitor: Check completed', {
                inProgress: inProgressRaceId,
                finished: finishedRaceId
            });

        } catch (error) {
            console.error('Error fetching race data:', error);
            setMessage("Error fetching race data. Please try again.", true);
            showToast("Error fetching race data. Please check your connection.", true);
        }
    }

    // Add refresh button for manual checking
    function addRefreshButton() {
        const targetDiv = document.querySelector('.delimiter-999.m-top10');
        if (!targetDiv) return;

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 Refresh JohnyBTbagn Races';
        refreshButton.style.cssText = `
            background-color: #17a2b8;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-weight: bold;
        `;

        refreshButton.addEventListener('click', checkJohnyBTbagnRaces);
        refreshButton.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        refreshButton.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });

        const refreshContainer = document.createElement('div');
        refreshContainer.style.cssText = 'text-align: center; margin: 10px 0;';
        refreshContainer.appendChild(refreshButton);

        targetDiv.parentNode.insertBefore(refreshContainer, targetDiv.nextSibling);
    }

    // Main execution
    function init() {
        // Check if we're within active hours (Tuesdays, 18:00-23:59 TCT)
        if (!isWithinActiveHours()) {
            console.log('-PopZ- Race Monitor: Outside active hours (Tuesdays, 18:00-23:59 TCT)');
            return;
        }

        console.log('-PopZ- Race Monitor: Initializing...');

        // Create info line
        //createInfoLine();

        // Wait for page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    addRefreshButton();
                    checkJohnyBTbagnRaces();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                addRefreshButton();
                checkJohnyBTbagnRaces();
            }, 1000);
        }

        // Set up periodic checking every 1 minutes
        setInterval(checkJohnyBTbagnRaces, 60000);

        // Initial status message
        if (!apiKey) {
            createInfoLine();
            setMessage("API key needed - click here to add", true);
        }
    }

    // Start the script
    init();

})();