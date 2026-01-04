// ==UserScript==
// @name         Torn Cooldown and Refill Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Baccy
// @description  Displays a message  when booster or drug cooldowns are over, and energy refill not yet used.
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514096/Torn%20Cooldown%20and%20Refill%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/514096/Torn%20Cooldown%20and%20Refill%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE_URL = 'https://api.torn.com/user/';
    let apiKey = localStorage.getItem('APIKey');
    const LAST_FETCH_KEY = 'lastFetchTimestamp';
    const REFILL_KEY = 'energyRefillUsed';
    const DRUG_COOLDOWN_KEY = 'drugCooldown';
    const BOOSTER_COOLDOWN_KEY = 'boosterCooldown';

    // Prompt for API key if not already saved
    if (!apiKey) {
        console.log("API key not found. Prompting user for input.");
        apiKey = prompt("Please enter your minimal access API key:");
        if (apiKey) {
            localStorage.setItem('APIKey', apiKey);
            console.log("API key saved to local storage.");
        } else {
            console.warn("No API key entered. Script will not function without an API key.");
        }
    }

    // Function to fetch data from the Torn API
    async function fetchAPIData(endpoint) {
        console.log(`Fetching data from Torn API for endpoint: ${endpoint}`);
        try {
            const response = await fetch(`${API_BASE_URL}?selections=${endpoint}&key=${apiKey}&comment=CDRefill`);
            if (response.ok) {
                console.log(`Successfully fetched data from endpoint: ${endpoint}`);
                return await response.json();
            } else {
                console.error("API request failed:", response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Error fetching API data:", error);
            return null;
        }
    }

    // Function to check conditions and display a notification message
    async function checkConditionsAndDisplayNotification() {
        const currentTime = Date.now();
        const lastFetchTimestamp = localStorage.getItem(LAST_FETCH_KEY);

        // Check if at least 60 seconds have passed since the last fetch
        if (!lastFetchTimestamp || currentTime - lastFetchTimestamp >= 60000) {
            console.log("60 seconds have passed since last fetch. Proceeding with data fetch.");
            localStorage.setItem(LAST_FETCH_KEY, currentTime); // Update the timestamp

            const refillsData = await fetchAPIData('refills');
            const cooldownsData = await fetchAPIData('cooldowns');

            if (refillsData && cooldownsData) {
                const energyRefillUsed = refillsData.refills.energy_refill_used;
                const drugCooldown = cooldownsData.cooldowns.drug;
                const boosterCooldown = cooldownsData.cooldowns.booster;

                // Cache the fetched data in localStorage
                localStorage.setItem(REFILL_KEY, energyRefillUsed);
                localStorage.setItem(DRUG_COOLDOWN_KEY, drugCooldown);
                localStorage.setItem(BOOSTER_COOLDOWN_KEY, boosterCooldown);

                // Build notification message based on conditions
                buildAndDisplayNotification(energyRefillUsed, drugCooldown, boosterCooldown);
            } else {
                console.warn("Failed to retrieve necessary data for checking conditions.");
            }
        } else {
            console.log("Less than 60 seconds since last fetch. Skipping this fetch.");
        }

        // Load cached data if it exists
        loadCachedDataAndDisplayNotification();
    }

    // Function to load cached data and display notification
    function loadCachedDataAndDisplayNotification() {
        console.log("Loading cached data from local storage.");
        const energyRefillUsed = JSON.parse(localStorage.getItem(REFILL_KEY));
        const drugCooldown = parseInt(localStorage.getItem(DRUG_COOLDOWN_KEY));
        const boosterCooldown = parseInt(localStorage.getItem(BOOSTER_COOLDOWN_KEY));

        if (energyRefillUsed !== null && !isNaN(drugCooldown) && !isNaN(boosterCooldown)) {
            buildAndDisplayNotification(energyRefillUsed, drugCooldown, boosterCooldown);
        } else {
            console.warn("No valid cached data found.");
        }
    }

    // Function to build and display the notification message
    function buildAndDisplayNotification(energyRefillUsed, drugCooldown, boosterCooldown) {
        let notificationMessage = '';

        // Construct the message based on conditions
        if (!energyRefillUsed) {
            notificationMessage += "Energy refill is available. ";
            console.log("Condition met: Energy refill is available.");
        }
        if (drugCooldown === 0) {
            notificationMessage += "Drug cooldown is over. ";
            console.log("Condition met: Drug cooldown is over.");
        }
        if (boosterCooldown === 0) {
            notificationMessage += "Booster cooldown is over. ";
            console.log("Condition met: Booster cooldown is over.");
        }

        // Display notification if any conditions are met
        if (notificationMessage) {
            displayNotificationMessage(notificationMessage.trim());
        } else {
            console.log("No conditions met for notification.");
        }
    }

    // Function to display the notification message
    function displayNotificationMessage(message) {
        const container = document.querySelector('#topHeaderBanner');

        if (container) {
            console.log("Displaying notification message on page.");
            let existingMessage = document.getElementById('cooldown-refill-notification');
            if (existingMessage) {
                existingMessage.remove();
                console.log("Removed existing notification message.");
            }

            const messageDiv = document.createElement('div');
            messageDiv.id = 'cooldown-refill-notification';
            messageDiv.innerHTML = message;
            messageDiv.style.fontSize = '16px';
            messageDiv.style.marginTop = '10px';
            messageDiv.style.color = '#ffffff';
            messageDiv.style.padding = '10px';
            messageDiv.style.backgroundColor = '#1c1b22';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.lineHeight = '1.5';
            messageDiv.style.textAlign = 'center';

            container.appendChild(messageDiv);
        } else {
            console.warn("Container for notification message not found on the page.");
        }
    }

    // Initial check on page load
    checkConditionsAndDisplayNotification();

    // Run the check every minute
    setInterval(checkConditionsAndDisplayNotification, 60000);

})();
