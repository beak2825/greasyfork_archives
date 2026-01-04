// ==UserScript==
// @name         Mug protection
// @namespace    Nurv.IronNerd.me
// @version      0.4
// @description  Warns if you are actively selling items in Bazaar or Item Market. Resets saved settings on update/reinstall.
// @author       Nurv [669537]
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/loader.php?sid=attack*
// @exclude      https://www.torn.com/pc.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      Copyright IronNerd.me
// @downloadURL https://update.greasyfork.org/scripts/520123/Mug%20protection.user.js
// @updateURL https://update.greasyfork.org/scripts/520123/Mug%20protection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------
    // CONFIG & STORAGE MANAGEMENT
    // ----------------------------
    const SCRIPT_VERSION = "0.4";
    const STORAGE_KEYS = {
        API_KEY: 'tornApiKey',
        GHOST_ID: 'ghostId',
        HAS_PROMPTED: 'hasPrompted',
        SCRIPT_VERSION: 'mugProtectionScriptVersion'
    };

    // If the stored version isn’t the current one, then clear our saved keys.
    if (localStorage.getItem(STORAGE_KEYS.SCRIPT_VERSION) !== SCRIPT_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.GHOST_ID);
        localStorage.removeItem(STORAGE_KEYS.HAS_PROMPTED);
        localStorage.setItem(STORAGE_KEYS.SCRIPT_VERSION, SCRIPT_VERSION);
        console.log("Mug Protection: New installation or update detected – settings have been reset.");
    }

    // Retrieve saved settings
    let apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || null;
    let ghostId = localStorage.getItem(STORAGE_KEYS.GHOST_ID) || null;
    let hasPrompted = localStorage.getItem(STORAGE_KEYS.HAS_PROMPTED) || null;

    // ------------------------------------
    // PROMPT FOR SETTINGS / INITIALIZATION
    // ------------------------------------
    function promptForInputs() {
        const enteredApiKey = prompt("Enter your Torn API key (leave blank to skip):", apiKey || "");
        if (enteredApiKey) {
            apiKey = enteredApiKey.trim();
            localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
            console.log("Mug Protection: API key saved.");
        } else {
            console.log("Mug Protection: No API key entered. Default features will be active.");
        }

        const enteredGhostId = prompt("Enter Ghost Friend ID (leave blank to skip):", ghostId || "");
        if (enteredGhostId) {
            ghostId = enteredGhostId.trim();
            localStorage.setItem(STORAGE_KEYS.GHOST_ID, ghostId);
            console.log(`Mug Protection: Ghost Friend ID saved as: ${ghostId}`);
        } else {
            console.log("Mug Protection: No Ghost Friend ID entered. Ghost Friend feature will be inactive.");
        }

        localStorage.setItem(STORAGE_KEYS.HAS_PROMPTED, 'true');
    }

    function initialize() {
        if (!hasPrompted) {
            promptForInputs();
        }
    }

    // -------------------------
    // CORE FUNCTIONALITY
    // -------------------------

    // Add the Ghost Friend icon to the status bar if not already added.
    function addGhostIcon() {
        // Prevent duplicate insertion.
        if (document.getElementById("ghostFriendIcon")) {
            return;
        }

        const tradeUrl = ghostId
            ? `https://www.torn.com/trade.php#step=start&userID=${ghostId}`
            : "https://www.torn.com/trade.php";

        const ghostIconHtml = `
            <li id="ghostFriendIcon" class="icon-ghost">
                <a href="${tradeUrl}" aria-label="Ghost Friend" tabindex="0" style="color: white;" data-is-tooltip-opened="false">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                        <path d="M12 2C7.59 2 4 5.59 4 10c0 3.91 2.82 7.19 6.68 7.89l.32.06v3.15l-1.32-1.32-.71-.71-.71.71-1.82 1.83v-5.35c.58.25 1.19.4 1.82.49v4.55l2.53-2.53c.22-.22.51-.34.82-.34h1.03c.31 0 .6.12.82.34l2.53 2.53v-4.55c.63-.09 1.24-.24 1.82-.49v5.35l-1.82-1.83-.71-.71-.71.71-1.32 1.32V18l.32-.06C17.18 17.19 20 13.91 20 10c0-4.41-3.59-8-8-8zm-3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                </a>
            </li>
        `;

        const iconContainerSelector = window.innerWidth <= 784
            ? ".status-icons___gPkXF.mobile___MWm2o"
            : ".status-icons___gPkXF";

        const statusIcons = document.querySelector(iconContainerSelector);
        if (statusIcons) {
            statusIcons.insertAdjacentHTML("beforeend", ghostIconHtml);
            console.log("Mug Protection: Ghost Friend icon added.");
        }
    }

    // Check if the user is in the hospital by looking for the hospital icon.
    function isInHospital() {
        const hospitalSelector = window.innerWidth <= 784
            ? "li.icon15___IohoO > a[aria-label*='Hospital']"
            : "li[class*='icon15'] a[aria-label*='Hospital']";
        return document.querySelector(hospitalSelector) !== null;
    }

    // Display a warning banner with a custom message.
    async function displayBanner(message) {
        console.log("Mug Protection: Displaying banner:", message);
        removeBanner();

        const banner = document.createElement("div");
        banner.id = "selling-warning-banner";
        Object.assign(banner.style, {
            backgroundColor: "red",
            position: "fixed",
            top: "0",
            width: "100%",
            zIndex: "99999",
            padding: "12px",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            wordWrap: "break-word",
            whiteSpace: "normal"
        });

        const bannerLink = document.createElement("a");
        bannerLink.href = "https://www.torn.com/item.php#medical-items";
        bannerLink.target = "_blank";
        bannerLink.style.color = "white";
        bannerLink.style.textDecoration = "none";
        bannerLink.innerHTML = message;

        banner.appendChild(bannerLink);
        document.body.appendChild(banner);

        // Remove the banner after 7 seconds.
        setTimeout(removeBanner, 7000);
    }

    // Remove the warning banner, if present.
    function removeBanner() {
        const banner = document.getElementById("selling-warning-banner");
        if (banner) {
            banner.remove();
            console.log("Mug Protection: Banner removed.");
        }
    }

    // Fetch API data using the Fetch API.
    async function fetchApiData(url) {
        console.log("Mug Protection: Fetching API data from:", url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Mug Protection: Error fetching API data:", error);
            return null;
        }
    }

    // Calculate the total value from an array of items.
    function calculateTotal(items, key = "amount") {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseFloat(item[key]) || 1;
            return sum + (price * quantity);
        }, 0);
    }

    // Check whether items are being actively sold and display a warning banner if so.
    async function checkSellingStatus() {
        console.log("Mug Protection: Checking selling status...");

        if (isInHospital()) {
            console.log("Mug Protection: User is in the hospital.");
            if (ghostId) {
                addGhostIcon();
            }
            return;
        }

        const bazaarSelector = window.innerWidth <= 784
            ? "li.icon35___tya65 > a[aria-label*='Bazaar']"
            : "li[class*='icon35'] a[aria-label*='Bazaar']";
        const itemMarketSelector = window.innerWidth <= 784
            ? "li.icon36___cAwTk > a[aria-label*='Item Market']"
            : "li[class*='icon36'] a[aria-label*='Item Market']";

        const isBazaarActive = document.querySelector(bazaarSelector) !== null;
        const isItemMarketActive = document.querySelector(itemMarketSelector) !== null;

        console.log("Mug Protection: Bazaar Active:", isBazaarActive, "Item Market Active:", isItemMarketActive);

        if (!isBazaarActive && !isItemMarketActive) {
            console.log("Mug Protection: No active selling detected.");
            return;
        }

        if (apiKey) {
            try {
                const bazaarData = isBazaarActive
                    ? await fetchApiData(`https://api.torn.com/user/?selections=bazaar&key=${apiKey}`)
                    : null;
                const bazaarValue = bazaarData && bazaarData.bazaar
                    ? calculateTotal(bazaarData.bazaar, "quantity")
                    : 0;

                const itemMarketData = isItemMarketActive
                    ? await fetchApiData(`https://api.torn.com/v2/user/itemmarket?key=${apiKey}`)
                    : null;
                const itemMarketValue = itemMarketData && itemMarketData.itemmarket
                    ? calculateTotal(itemMarketData.itemmarket, "amount")
                    : 0;

                const totalValue = bazaarValue + itemMarketValue;

                if (totalValue > 0) {
                    await displayBanner(`You have items worth $${totalValue.toLocaleString()} actively listed. Consider Self-Hosping to avoid being mugged!`);
                }
            } catch (error) {
                console.error("Mug Protection: Error processing API data:", error);
            }
        } else {
            // If no API key is provided, fall back to a simpler warning.
            if (isBazaarActive) {
                await displayBanner("You are actively selling items in the Bazaar. <a href='https://www.torn.com/item.php#medical-items' style='color: white;'>Consider Self-Hosping to avoid being mugged!</a>");
            }
            if (isItemMarketActive) {
                await displayBanner("You are actively selling items in the Item Market. <a href='https://www.torn.com/item.php#medical-items' style='color: white;'>Consider Self-Hosping to avoid being mugged!</a>");
            }
        }
    }

    // -------------------------
    // MENU COMMAND & HANDLERS
    // -------------------------

    // Allow the user to manually reset settings via the script manager’s menu.
    function resetSettings() {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.GHOST_ID);
        localStorage.removeItem(STORAGE_KEYS.HAS_PROMPTED);
        console.log("Mug Protection: Settings have been cleared.");
        promptForInputs();
    }

    if (typeof GM_registerMenuCommand === "function") {
        GM_registerMenuCommand("Reset Mug Protection Settings", resetSettings);
    }

    // -------------------------
    // STARTUP
    // -------------------------
    initialize();
    document.addEventListener("DOMContentLoaded", checkSellingStatus);
})();

