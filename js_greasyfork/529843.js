// ==UserScript==
// @name         Torn Faction Flyers Checker
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Checks faction members who are traveling or abroad and displays inbound, outbound, and abroad flyers separately with profile links.
// @author       HuzGPT
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529843/Torn%20Faction%20Flyers%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/529843/Torn%20Faction%20Flyers%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set your API key here:
    const apiKey = "API_KEY";

    // Extract the faction ID from the URL (e.g., ...ID=14365)
    function getFactionId() {
        const match = window.location.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    }

    // Fetch the faction members via the Torn API
    function fetchFlyers() {
        const factionId = getFactionId();
        if (!factionId) {
            console.error("Could not find faction ID in URL.");
            displayError("Could not find faction ID.");
            return;
        }

        displayLoadingMenu();

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`,
            headers: {
                'accept': 'application/json',
                'Authorization': `ApiKey ${apiKey}`
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("API Error:", data.error);
                        displayError(`API Error: ${data.error.error}`);
                        return;
                    }
                    processFlyers(data);
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    displayError("Failed to parse API response.");
                }
            },
            onerror: function(error) {
                console.error("Request Error:", error);
                displayError("Failed to connect to Torn API.");
            }
        });
    }

    // Process the API response by grouping flyers into three categories.
    function processFlyers(data) {
        if (!data.members) {
            displayError("No member data found.");
            return;
        }

        const members = Object.values(data.members);

        // Filter traveling flyers (state === "Traveling") and classify by description
        let inboundFlyers = [];
        let outboundFlyers = [];
        members.forEach(member => {
            if (member.status && member.status.state === "Traveling") {
                let desc = member.status.description || "";
                if (desc.indexOf("Returning to Torn") === 0) {
                    inboundFlyers.push(member);
                } else if (desc.indexOf("Traveling to") === 0) {
                    outboundFlyers.push(member);
                }
            }
        });

        // Filter members who are abroad (state === "Abroad")
        let abroadFlyers = members.filter(member =>
            member.status && member.status.state === "Abroad"
        );

        displayFlyersList(inboundFlyers, outboundFlyers, abroadFlyers);
    }

    // Create the base menu container for the popup display
    function createBaseMenu() {
        let menu = document.createElement("div");
        menu.id = "flyersCheckerMenu";
        menu.style.position = "fixed";
        menu.style.top = "100px";
        menu.style.right = "20px";
        menu.style.backgroundColor = "rgba(20,20,20,0.95)";
        menu.style.color = "#fff";
        menu.style.padding = "15px";
        menu.style.borderRadius = "8px";
        menu.style.border = "1px solid rgba(255,255,255,0.2)";
        menu.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        menu.style.zIndex = "1000";
        menu.style.fontSize = "14px";
        menu.style.minWidth = "220px";
        menu.style.maxHeight = "500px";
        menu.style.overflowY = "auto";

        // Close button
        let closeButton = document.createElement("span");
        closeButton.textContent = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "8px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "#ff6666";
        closeButton.style.fontWeight = "bold";
        closeButton.style.fontSize = "16px";
        closeButton.title = "Close";
        closeButton.onclick = function() {
            menu.remove();
        };
        menu.appendChild(closeButton);
        return menu;
    }

    // Display a loading message while the API call is in progress
    function displayLoadingMenu() {
        let existingMenu = document.getElementById("flyersCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();
        let title = document.createElement("div");
        title.textContent = "Faction Flyers";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        let loadingMsg = document.createElement("div");
        loadingMsg.textContent = "Loading...";
        loadingMsg.style.color = "#888";
        loadingMsg.style.fontStyle = "italic";
        menu.appendChild(loadingMsg);

        document.body.appendChild(menu);
    }

    // Display an error message in the menu
    function displayError(message) {
        let existingMenu = document.getElementById("flyersCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();
        let title = document.createElement("div");
        title.textContent = "Faction Flyers";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        let errorMsg = document.createElement("div");
        errorMsg.textContent = message;
        errorMsg.style.color = "#ff6666";
        errorMsg.style.fontStyle = "italic";
        menu.appendChild(errorMsg);

        document.body.appendChild(menu);
    }

    // Display the flyers list with three sections: Inbound, Outbound, and Abroad.
    function displayFlyersList(inbound, outbound, abroad) {
        let existingMenu = document.getElementById("flyersCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();

        let title = document.createElement("div");
        title.textContent = "Faction Flyers";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        // Inbound Flyers Section
        let inboundTitle = document.createElement("div");
        inboundTitle.textContent = "Inbound Flyers (Returning to Torn):";
        inboundTitle.style.fontWeight = "bold";
        inboundTitle.style.marginTop = "5px";
        menu.appendChild(inboundTitle);

        if (inbound.length === 0) {
            let noInbound = document.createElement("div");
            noInbound.textContent = "No inbound flyers found";
            noInbound.style.color = "#888";
            noInbound.style.fontStyle = "italic";
            menu.appendChild(noInbound);
        } else {
            inbound.forEach(member => {
                let entry = document.createElement("div");
                entry.style.marginBottom = "5px";
                // Render as clickable link
                entry.innerHTML = `<a href="/profiles.php?XID=${member.id}" style="color: white; text-decoration: none; font-weight: bold; transition: color 0.2s ease;"
                                    onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                                    ${member.name}</a>`;
                menu.appendChild(entry);
            });
        }

        // Outbound Flyers Section
        let outboundTitle = document.createElement("div");
        outboundTitle.textContent = "Outbound Flyers:";
        outboundTitle.style.fontWeight = "bold";
        outboundTitle.style.marginTop = "10px";
        menu.appendChild(outboundTitle);

        if (outbound.length === 0) {
            let noOutbound = document.createElement("div");
            noOutbound.textContent = "No outbound flyers found";
            noOutbound.style.color = "#888";
            noOutbound.style.fontStyle = "italic";
            menu.appendChild(noOutbound);
        } else {
            outbound.forEach(member => {
                let entry = document.createElement("div");
                entry.style.marginBottom = "5px";
                // Extract destination by removing "Traveling to " from the description
                let destination = member.status.description.replace("Traveling to ", "");
                entry.innerHTML = `<a href="/profiles.php?XID=${member.id}" style="color: white; text-decoration: none; font-weight: bold; transition: color 0.2s ease;"
                                    onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                                    ${member.name}</a> - Flying to ${destination}`;
                menu.appendChild(entry);
            });
        }

        // Abroad Flyers Section
        let abroadTitle = document.createElement("div");
        abroadTitle.textContent = "Abroad Flyers:";
        abroadTitle.style.fontWeight = "bold";
        abroadTitle.style.marginTop = "10px";
        menu.appendChild(abroadTitle);

        if (abroad.length === 0) {
            let noAbroad = document.createElement("div");
            noAbroad.textContent = "No abroad flyers found";
            noAbroad.style.color = "#888";
            noAbroad.style.fontStyle = "italic";
            menu.appendChild(noAbroad);
        } else {
            abroad.forEach(member => {
                let entry = document.createElement("div");
                entry.style.marginBottom = "5px";
                // Assume description is in format "In CountryName"
                let country = member.status.description.replace("In ", "");
                entry.innerHTML = `<a href="/profiles.php?XID=${member.id}" style="color: white; text-decoration: none; font-weight: bold; transition: color 0.2s ease;"
                                    onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                                    ${member.name}</a> - In ${country}`;
                menu.appendChild(entry);
            });
        }

        document.body.appendChild(menu);
    }

    // Insert a new "FLYERS" button into the Torn UI (under the top-links bar)
    function addFlyersButton() {
        let linksTopWrap = document.querySelector(".links-top-wrap");
        if (!linksTopWrap) return;

        let button = document.createElement("a");
        // Use similar classes as other buttons in the top links
        button.className = "t-clear h c-pointer line-h24 right last";
        button.href = "#";
        button.setAttribute('aria-labelledby', 'flyers');

        button.innerHTML = `
            <span class="icon-wrap svg-icon-wrap">
                <span class="link-icon-svg flyers">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                        <title>flyers</title>
                        <!-- Simple paper airplane icon -->
                        <path d="M1 8 L16 1 L9 10 L16 17 L1 10 Z" fill="#777"/>
                    </svg>
                </span>
            </span>
            <span id="flyers">Flyers</span>`;

        button.onclick = function(e) {
            e.preventDefault();
            fetchFlyers();
        };

        linksTopWrap.appendChild(button);
    }

    // Wait for the DOM to be ready before inserting the button
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addFlyersButton);
    } else {
        addFlyersButton();
    }
})();
