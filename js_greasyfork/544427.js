// ==UserScript==
// @name         TORN: Easy Player Net Worth Display
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Displays a player's net worth on their Torn profile page using API v2, with a user-configurable API key.
// @author       JohnBattlefield
// @match        https://www.torn.com/profiles.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/544427/TORN%3A%20Easy%20Player%20Net%20Worth%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/544427/TORN%3A%20Easy%20Player%20Net%20Worth%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tampermonkey storage key for the API key
    const API_KEY_STORAGE_KEY = 'tornNetWorthApiKey';

    // Function to get a URL parameter by name
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Function to simplify a number and add a suffix (k, M, B, T)
    function formatNumberToSimplified(num) {
        if (num >= 1000000000000) {
            return `$${(num / 1000000000000).toFixed(2)}T`;
        } else if (num >= 1000000000) {
            return `$${(num / 1000000000).toFixed(2)}B`;
        } else if (num >= 1000000) {
            return `$${(num / 1000000).toFixed(0)}M`;
        } else if (num >= 1000) {
            return `$${(num / 1000).toFixed(0)}k`;
        }
        // For numbers less than a thousand, return the formatted number
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }
    
    // Function to get a color based on the net worth value
    function getNetWorthBadgeColor(num) {
        if (num >= 1000000000000) {
            return '#6a1b9a'; // Trillions (Darker Purple)
        } else if (num >= 100000000000) {
            return '#993333'; // 100B - 1T (Maroon)
        } else if (num >= 10000000000) {
            return '#c06015'; // 10B - 100B (Darker Orange)
        } else if (num >= 1000000000) {
            return '#008080'; // 1B - 10B (Teal)
        } else if (num >= 1000000) {
            return '#388e3c'; // Millions (Darker Green)
        } else {
            return '#3a556b'; // Thousands or less
        }
    }

    // Function to create and insert the net worth element
    function displayNetWorth(netWorth) {
        const playerNameElement = document.querySelector('h4#skip-to-content');
        if (!playerNameElement) {
            console.warn("Torn Net Worth Script: Could not find player name element to insert net worth.");
            return;
        }

        if (document.getElementById('torn-net-worth')) {
            console.log("Torn Net Worth Script: Net worth element already exists, skipping insertion.");
            return;
        }

        const netWorthBadgeElement = document.createElement('span');
        netWorthBadgeElement.id = 'torn-net-worth';
        netWorthBadgeElement.style.marginLeft = '20px'; // Increased space
        netWorthBadgeElement.style.fontSize = '14px';
        netWorthBadgeElement.style.cursor = 'pointer';
        netWorthBadgeElement.style.fontWeight = 'bold';
        
        // Add a click event listener to show the API key input form
        netWorthBadgeElement.addEventListener('click', () => {
            showApiKeyInput();
        });

        // Create the combined text for the badge
        const simplifiedNetWorthText = formatNumberToSimplified(netWorth);
        netWorthBadgeElement.textContent = `Net Worth: ${simplifiedNetWorthText}`;

        // Apply badge styling
        netWorthBadgeElement.style.backgroundColor = getNetWorthBadgeColor(netWorth);
        netWorthBadgeElement.style.color = 'white';
        netWorthBadgeElement.style.padding = '4px 8px';
        netWorthBadgeElement.style.borderRadius = '4px'; // Less round edges
        netWorthBadgeElement.style.fontWeight = 'bold';
        netWorthBadgeElement.style.display = 'inline-block';
        
        playerNameElement.appendChild(netWorthBadgeElement);

        console.log("Torn Net Worth Script: Net worth element successfully inserted.");
    }

    // Helper function to display messages in the UI
    function showMessage(message, isError = false) {
        let messageBox = document.getElementById('api-key-message');
        if (!messageBox) {
            const formContainer = document.getElementById('api-key-form');
            if (formContainer) {
                messageBox = document.createElement('p');
                messageBox.id = 'api-key-message';
                messageBox.style.marginTop = '10px';
                formContainer.appendChild(messageBox);
            } else {
                return;
            }
        }
        messageBox.textContent = message;
        messageBox.style.color = isError ? 'red' : '#38a169';
    }

    // Function to show the API key input form
    function showApiKeyInput() {
        const playerNameElement = document.querySelector('h4#skip-to-content');
        if (!playerNameElement) {
            console.warn("Torn Net Worth Script: Could not find player name element to insert API key form.");
            return;
        }
        
        if (document.getElementById('api-key-form')) {
            return;
        }
        
        const existingNetWorthElement = document.getElementById('torn-net-worth');
        if (existingNetWorthElement) {
            existingNetWorthElement.remove();
        }

        const formContainer = document.createElement('div');
        formContainer.id = 'api-key-form';
        formContainer.style.marginTop = '10px';
        formContainer.style.fontSize = '12px';
        formContainer.style.backgroundColor = 'var(--c-background-secondary, #333)';
        formContainer.style.color = 'var(--c-text-primary, #fff)';
        formContainer.style.border = '1px solid var(--c-border-primary, #555)';
        formContainer.style.padding = '10px';
        formContainer.style.borderRadius = '5px';
        formContainer.style.display = 'flex';
        formContainer.style.flexDirection = 'column';
        formContainer.style.gap = '15px'; // Increased gap for better mobile spacing

        formContainer.innerHTML = `
            <div>
                <p style="font-weight: bold; margin-bottom: 10px;">API Key Required</p>
                <p style="margin: 0 0 10px 0;">
                    Please enter your Torn API key.
                </p>
                <p style="margin: 0;">
                    <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" style="color: #38a169; text-decoration: underline;">Get your API key here.</a>
                </p>
            </div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                <input type="text" id="api-key-input" placeholder="Enter API Key" style="flex-grow: 1; padding: 5px; background-color: var(--c-background-primary, #444); color: var(--c-text-primary, #fff); border: 1px solid var(--c-border-primary, #666); border-radius: 3px; min-width: 150px;">
                <button id="save-key-btn" style="padding: 5px 10px; background-color: #38a169; color: white; border: none; border-radius: 3px; cursor: pointer;">Save</button>
                <button id="clear-key-btn" style="padding: 5px 10px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer;">Clear</button>
            </div>
        `;

        playerNameElement.parentNode.insertBefore(formContainer, playerNameElement.nextSibling);

        document.getElementById('save-key-btn').addEventListener('click', () => {
            const key = document.getElementById('api-key-input').value;
            if (key) {
                GM_setValue(API_KEY_STORAGE_KEY, key);
                showMessage('API key saved! Reloading page to apply changes.');
                setTimeout(() => location.reload(), 1000);
            } else {
                showMessage('Please enter a valid API key.', true);
            }
        });

        document.getElementById('clear-key-btn').addEventListener('click', () => {
            GM_deleteValue(API_KEY_STORAGE_KEY);
            showMessage('API key cleared! Reloading page.');
            setTimeout(() => location.reload(), 1000);
        });
    }

    // Main function to fetch the data and display it
    async function fetchAndDisplayNetWorth() {
        const oldNetWorthElement = document.getElementById('torn-net-worth');
        if (oldNetWorthElement) {
            oldNetWorthElement.remove();
        }

        const playerId = getUrlParameter('XID');
        const apiKey = await GM_getValue(API_KEY_STORAGE_KEY);

        if (!apiKey) {
            console.log("Torn Net Worth Script: No API key found. Showing input form.");
            showApiKeyInput();
            return;
        }

        if (playerId && apiKey) {
            console.log(`Torn Net Worth Script: Initiating API request for Player ID: ${playerId} using V2 API`);
            const apiUrl = `https://api.torn.com/v2/user/${playerId}/personalstats?cat=networth&key=${apiKey}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    console.log("Torn Net Worth Script: API response received. Status:", response.status);
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        // Check for API errors first
                        if (data && data.error) {
                            console.error("Torn Net Worth Script: API returned an error:", data.error);
                            // If the API key is invalid, delete it and prompt for a new one.
                            if (data.error.code === 2 || data.error.code === 3 || data.error.code === 10) {
                                GM_deleteValue(API_KEY_STORAGE_KEY);
                                showApiKeyInput();
                            } else {
                                // For other errors, just display 0 net worth to avoid the loop
                                displayNetWorth(0);
                            }
                            return;
                        }

                        if (data && data.personalstats && data.personalstats.networth) {
                            // Check if 'total' property exists. It might be 0 or negative, which is a valid value.
                            const totalNetWorth = data.personalstats.networth.total !== undefined ? data.personalstats.networth.total : 0;
                            console.log(`Torn Net Worth Script: Net worth data found. Total: ${totalNetWorth}`);
                            displayNetWorth(totalNetWorth);
                        } else {
                            // If data structure is unexpected, display 0 net worth to avoid the API key loop.
                            console.error("Torn Net Worth Script: Could not retrieve net worth data. Full response:", data);
                            displayNetWorth(0);
                        }
                    } catch (e) {
                        console.error("Torn Net Worth Script: Failed to parse JSON response. Response text:", response.responseText, "Error:", e);
                        GM_deleteValue(API_KEY_STORAGE_KEY);
                        showApiKeyInput();
                    }
                },
                onerror: function(response) {
                    console.error("Torn Net Worth Script: GM_xmlhttpRequest failed. Status:", response.status, "Status Text:", response.statusText, "Response Text:", response.responseText);
                    GM_deleteValue(API_KEY_STORAGE_KEY);
                    showApiKeyInput();
                }
            });
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.querySelector && node.querySelector('h4#skip-to-content')) {
                        console.log("Torn Net Worth Script: Profile header element detected, running script.");
                        fetchAndDisplayNetWorth();
                        return;
                    }
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Torn Net Worth Script: Initial script run initiated.");
    fetchAndDisplayNetWorth();

})();
