// ==UserScript==
// @name         Revive Notifications
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Displays revive requests inside Torn
// @match        https://www.torn.com/*
// @connect      api.no1irishstig.co.uk
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/497830/Revive%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/497830/Revive%20Notifications.meta.js
// ==/UserScript==

"use strict";

console.log("Revive Notifications script loaded");

(function() {
    fetchRevives();
    setInterval(fetchRevives, 5000); // 5 seconds interval

    document.addEventListener("visibilitychange", () => {
        console.log("Visibility changed, fetching revives...");
        fetchRevives();
    });

    function fetchRevives() {
        console.log("Fetching revives...");
        const apiKey = localStorage.getItem("api_key");
        if (!apiKey) {
            console.log("No API key found");
            promptForApiKey();
            displayMessage("Please provide an API key to link - click the \"Setup API Key\" button.");
            return;
        }
    function promptForApiKey() {
        const apiKey = prompt("Please enter your API key:");
        if (apiKey) {
            localStorage.setItem("api_key", apiKey);
            fetchRevives();
        } else {
            displayMessage("Please provide an API key to link - refresh the page to try again.");
        }
    }
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const url = `https://api.no1irishstig.co.uk/fetch?key=${apiKey}&vendor=The%20Wolverines%20Script%201.0&source=Script&type=revive`;

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => handleApiResponse({ status: 200, responseText: JSON.stringify(data) }))
            .catch(error => {
                console.error("Fetch error:", error);
                displayMessage(`Fetch error: ${error.message}`);
            });
    }

    function handleApiResponse(response) {
        console.log("Handling API response", response);
        if (response.status && response.status !== 200) {
            displayMessage(`Error: ${response.status}`);
            return;
        }

        const data = JSON.parse(response.responseText);
        console.log("API data received", data);
        const randoms = [];
        const contracts = [];

        data.forEach(item => {
            if (item.contract) {
                contracts.push(item);
            } else {
                randoms.push(item);
            }
        });

        displayRevives("revives-randoms", randoms, "Revive Requests", "rev-blue");
        displayRevives("revives-contracts", contracts, "Contract Requests", "rev-red");
    }

    function displayRevives(elementId, revives, title, colorClass) {
        console.log(`Displaying revives in ${elementId}`, revives);
        const container = ensureContainer(elementId, title, colorClass);
        if (!container) return;
        let html = "";

        if (revives.length === 0) {
            container.innerHTML = "None";
        } else {
            revives.forEach(user => {
                html += `
                    <a href="https://www.torn.com/profiles.php?XID=${user.id}">
                        ${user.name}&nbsp;[${user.id}]
                    </a> |
                `;
            });
            container.innerHTML = html.slice(0, -2); // Remove the last ' | '
        }
    }

    function displayMessage(message) {
        console.log("Displaying message:", message);
        const contractsContainer = ensureContainer("revives-contracts", "Contract Requests", "rev-red");
        const randomsContainer = ensureContainer("revives-randoms", "Revive Requests", "rev-blue");
        if (contractsContainer) contractsContainer.innerHTML = message;
        if (randomsContainer) randomsContainer.innerHTML = message;
    }

    function ensureContainer(id, title, colorClass) {
        let container = document.getElementById(id);
        if (!container) {
            const div = document.createElement("div");
            div.className = `info-msg-cont ${colorClass} border-round m-top10`;
            div.innerHTML = `
                <div class="info-msg border-round">
                    <div class="delimiter">
                        <div class="msg right-round" tabindex="0" style="width: unset;">
                            ${title}: <span id="${id}">Loading</span>
                        </div>
                    </div>
                </div>
            `;
            const targetElement = document.querySelector(".content-wrapper.spring[role='main']");
            if (targetElement) {
                targetElement.insertAdjacentElement('afterbegin', div);
                container = document.getElementById(id);
            }
        }
        return container;
    }

    // Add custom styles for colors
    const style = document.createElement("style");
    style.innerHTML = `
        .rev-blue, .rev-red {
            background: linear-gradient(to bottom, #1d9da8 0%, #1da89a 100%) !important;
            margin: 10px 0;
            padding: 1px;
        }
        .rev-red {
            background: linear-gradient(to bottom, #a81d34 0%, #821729 100%) !important;
        }
        .info-msg-cont {
            width: calc(100% - 40px);
            margin-left: 20px;
            margin-right: 20px;
        }
    `;
    document.head.appendChild(style);
})();