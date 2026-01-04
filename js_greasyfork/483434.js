// ==UserScript==
// @name         Anthumbs rule of Thumb stat checker
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Display Gym energy, estimated total stats, and indication for high stat enhancers usage for Torn City player on player page only
// @author       Anthumb
// @match        https://www.torn.com/profiles.php?XID=*
// @license MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/483434/Anthumbs%20rule%20of%20Thumb%20stat%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/483434/Anthumbs%20rule%20of%20Thumb%20stat%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace 'your_api_key_here' with your actual Torn API key
    const apiKey = 'Enter Your own PUBLIC level API KEY here';

    // Function to calculate Gym energy estimate
    function calculateGymEnergyEstimate(personalStats) {
        // Extract relevant personal stats
        const daysBeendonator = personalStats.daysbeendonator || 0;
        const xanTaken = personalStats.xantaken || 0;
        const overdose = personalStats.overdosed || 0;
        const lsdTaken = personalStats.lsdtaken || 0;
        const refills = personalStats.refills || 0;
        const soutravel = personalStats.soutravel || 0;
        const overdosed = personalStats.overdosed || 0;
        const canTaken = personalStats.cantaken || 0;
        const dumpFinds = personalStats.dumpfinds || 0;
        const attacksWon = personalStats.attackswon || 0;
        const attacksLost = personalStats.attackslost || 0;
        const activestreak = personalStats.activestreak || 0;
        const bestactivestreak = personalStats.bestactivestreak || 0;

        // Calculate 'daysonline'
        const daysonline = (activestreak !== bestactivestreak) ? (activestreak + bestactivestreak) : activestreak;

        // Subtract 'daysonline' from 'daysbeendonator' and multiply by 100
        const daysonlineFactor = (daysonline - daysBeendonator) * 100;

        // Calculate Gym energy estimate
        const gymEnergyEstimate = Math.round(((daysBeendonator * 650) + ((xanTaken - overdose) * 250) + (lsdTaken * 50) +
            (refills * 150) + (canTaken * 30) + (daysBeendonator / 90 * 250)) - ((dumpFinds * 5) + (attacksWon + attacksLost) * 25) + daysonlineFactor + (overdosed * 300) + (soutravel * 100));

        return gymEnergyEstimate;
    }

    // Function to determine the constant based on gymEnergyEstimate range
    function getConstant(gymEnergyEstimate) {
        if (gymEnergyEstimate <= 50000) {
            return 150;
        } else if (gymEnergyEstimate <= 100000) {
            return 200;
        } else if (gymEnergyEstimate <= 200000) {
            return 300;
        } else if (gymEnergyEstimate <= 250000) {
            return 400;
        } else if (gymEnergyEstimate <= 350000) {
            return 500;
        } else if (gymEnergyEstimate <= 700000) {
            return 700;
        } else if (gymEnergyEstimate <= 900000) {
            return 900;
        } else if (gymEnergyEstimate <= 1100000) {
            return 1100;
        } else if (gymEnergyEstimate <= 1300000) {
            return 1600;
        } else if (gymEnergyEstimate <= 1600000) {
            return 2200;
        } else if (gymEnergyEstimate <= 1800000) {
            return 2400;
        } else if (gymEnergyEstimate <= 2000000) {
            return 2600;
        } else if (gymEnergyEstimate <= 2500000) {
            return 2800;
        } else if (gymEnergyEstimate <= 3500000) {
            return 3000;
        } else if (gymEnergyEstimate <= 4500000) {
            return 3200;
        } else {
            return 3400;
        }
    }

    // Function to format a number with thousand comma separation
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to round down the value to the nearest million and display with 'M'
    function roundToMillionAndDisplay(value) {
        const roundedValue = Math.floor(value / 1000000);
        return `${roundedValue}M`;
    }

    // Function to display Gym energy, estimated total stats, and SE-user indication
    function displayEstimates(gymEnergyEstimate, statEnhancersUsed) {
        // Calculate constant based on gymEnergyEstimate range
        const constant = getConstant(gymEnergyEstimate);

        // Calculate estimated total stats
        const estimatedTotalStats = roundToMillionAndDisplay((gymEnergyEstimate) * Math.pow(1.01, statEnhancersUsed) * constant);

        // Determine if statEnhancersUsed is over 5 for SE-user indication
        const seUserIndication = (statEnhancersUsed > 5) ? '<span style="color: red;">SE-user</span>' : '';

        // Format gymEnergyEstimate with thousand comma separation
        const formattedGymEstimate = formatNumberWithCommas(gymEnergyEstimate);

        const formattedestimatedTotalStats = formatNumberWithCommas(estimatedTotalStats);

        // Create a container for the estimates
        const estimatesContainer = document.createElement('div');
        estimatesContainer.innerHTML = `FilteredEnergy: ${formattedGymEstimate} | ~EstBS: ${formattedestimatedTotalStats} | ${seUserIndication}`;

        // Add the estimates container to the top center of the page
        estimatesContainer.style.position = 'absolute';
        estimatesContainer.style.top = '100px'; // Adjust the top offset as needed
        estimatesContainer.style.left = '55%';
        estimatesContainer.style.transform = 'translateX(-50%)';
        document.body.appendChild(estimatesContainer);

    }

    // Function to fetch player data from Torn API
    function fetchPlayerData(userId, callback) {
        const apiUrl = `https://api.torn.com/user/${userId}?selections=personalstats&key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const playerData = JSON.parse(response.responseText);
                callback(playerData);
            },
            onerror: function(error) {
                console.error('Error fetching player data:', error);
            }
        });
    }

    // Get user ID from the URL
    const userIdMatch = location.href.match(/profiles\.php\?XID=(\d+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    // Check if user ID is present in the URL
    if (userId) {
        // Fetch player data from Torn API
        fetchPlayerData(userId, function(playerData) {
            // Get personal stats from player data
            const personalStats = playerData.personalstats || {};

            // Calculate Gym energy estimate
            const gymEnergyEstimate = calculateGymEnergyEstimate(personalStats);

            // Get 'statenhancersused' value from personal stats
            const statEnhancersUsed = personalStats.statenhancersused || 0;

            // Display Gym energy, estimated total stats, and SE-user indication
            displayEstimates(gymEnergyEstimate, statEnhancersUsed);
        });
    } else {
        console.error('User ID not found in the URL');
    }
})();
