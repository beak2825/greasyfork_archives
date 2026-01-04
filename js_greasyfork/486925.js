// ==UserScript==
// @name         Torn Faction Withdraw Funds Button
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add a button to request withdrawal of funds on Torn City faction pages
// @author       Illusive_man
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486925/Torn%20Faction%20Withdraw%20Funds%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/486925/Torn%20Faction%20Withdraw%20Funds%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Hardcoded Discord Webhook URL and API Key
    var hardcodedWebhookURL = "https://discord.com/api/webhooks/1204806815343185992/F06SFCgKhJi1YD1e5KgvyNmzubLPSvOyKMogtri_u4mm0Vdhm40Z26NwO__txlFQWpYj";
    var hardcodedAPIKey = "oeSjiUgEPkQzSPAg";

    // Function to format number with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to handle withdrawal
    function withdrawFunds() {
        var storedWebhookURL = hardcodedWebhookURL;
        var storedApiKey = hardcodedAPIKey;

        if (!storedWebhookURL || !storedApiKey) {
            var missingInfo = [];
            if (!storedWebhookURL) missingInfo.push("Discord Webhook URL");
            if (!storedApiKey) missingInfo.push("API Key");

            alert("Before you can use this, please provide:\n" + missingInfo.join("\n"));
            return;
        }

        // Get the content of the <div> element
        var websocketConnectionData = document.getElementById('websocketConnectionData').textContent;

        // Parse the JSON data
        var connectionData = JSON.parse(websocketConnectionData);

        // Extract the playername
        var userName = connectionData.playername || 'Unknown User';

        var userIdElement = document.querySelector('.settings-menu a[href^="/profiles.php?XID="]');
        var userId = userIdElement ? getUserIdFromHref(userIdElement.href) : null;

        if (!userId) {
            alert("Unable to retrieve Torn user ID. Withdrawal cancelled.");
            return;
        }

        var withdrawalAmount = prompt("Enter the amount you want to withdraw (e.g., 10,000):");
        if (withdrawalAmount !== null && withdrawalAmount.trim() !== "") {
            withdrawalAmount = numberWithCommas(withdrawalAmount.replace(/\D/g, ''));
            var formattedAmount = parseFloat(withdrawalAmount.replace(/,/g, ''));

            // Retrieve faction vault balance using Torn API
            var apiKey = hardcodedAPIKey;
            var factionID = '42872'; // Replace with your faction ID
            const url = `https://api.torn.com/faction/${factionID}?selections=donations&key=${apiKey}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        console.error('Error:', data.error);
                        return;
                    }
                    var userDonation = data.donations[userId];
                    if (!userDonation) {
                        alert("User donation not found. Withdrawal cancelled.");
                        return;
                    }
                    var moneyBalance = userDonation.money_balance;
                    if (formattedAmount > moneyBalance) {
                        alert(`You only have $${moneyBalance} available. Please select a lower amount.`);
                        return;
                    }
                    // Perform the withdrawal action here
                    sendMessageToDiscord(userName, userId, formattedAmount);
                    alert("You have requested to withdraw $" + formattedAmount.toLocaleString());
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            alert("No amount entered. Withdrawal cancelled.");
        }
    }

    // Function to extract user ID from href
    function getUserIdFromHref(href) {
        var match = href.match(/XID=(\d+)/);
        return match ? match[1] : null;
    }

    // Function to send message to Discord webhook
    function sendMessageToDiscord(userName, userId, withdrawalAmount) {
        var webhookURL = hardcodedWebhookURL;
        var apiKey = hardcodedAPIKey;

        var withdrawalAmountFormatted = `$${withdrawalAmount}`;

        var message = `<@&1151158675168297000> Hey Torn City pals, Michael here! Can you spare a dime to spread some joy to ${userName} [${userId}]? Click the [link](https://www.torn.com/factions.php?step=your#/tab=controls&giveMoneyTo=${userId}&money=${withdrawalAmount}&option=give-to-user) to give them the $${withdrawalAmount} they asked for and earn some cosmic brownie points! Cheers!`;

        GM_xmlhttpRequest({
            method: "POST",
            url: webhookURL,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ "content": message }),
            onload: function (response) {
                if (response.status !== 204) {
                    console.error('Failed to send message to Discord:', response.status, response.statusText);
                }
            }
        });
    }

    // Create the button element
    var withdrawButton = document.createElement('a');
    withdrawButton.textContent = 'Request Withdraw of Funds';
    withdrawButton.href = '#'; // Set a default href
    withdrawButton.classList.add('view-wars'); // Adding a class for styling
    withdrawButton.classList.add('t-clear');
    withdrawButton.classList.add('h');
    withdrawButton.classList.add('c-pointer');
    withdrawButton.classList.add('m-icon');
    withdrawButton.classList.add('line-h24');
    withdrawButton.classList.add('right');
    withdrawButton.style.marginRight = '10px'; // Adjust margin if necessary

    // Create an icon for the button
    var withdrawIcon = document.createElement('img');
    withdrawIcon.src = 'https://i.ibb.co/pxM2QHx/save-money.png';
    withdrawIcon.alt = 'Withdraw Icon';
    withdrawIcon.style.width = '20px'; // Adjust width if necessary
    withdrawIcon.style.height = '20px'; // Adjust height if necessary
    withdrawIcon.style.marginRight = '5px'; // Adjust margin if necessary
    withdrawButton.insertBefore(withdrawIcon, withdrawButton.firstChild);

    // Add event listener to the button
    withdrawButton.addEventListener('click', withdrawFunds);

    // Find the parent element to append the button to
    var parentElement = document.querySelector('.content-title-links');

    // Insert the button before the last child element (Faction Warfare)
    parentElement.insertBefore(withdrawButton, parentElement.lastChild.previousSibling);
})();
