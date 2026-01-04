// ==UserScript==
// @name         Faction Donation Tracker
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a "Deposits" tab to track faction donations
// @author       LyterSide
// @match        *://*.zed.city/faction/activity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527396/Faction%20Donation%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/527396/Faction%20Donation%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastProcessedTime = Number(localStorage.getItem("script_last_processed_time")) || 0;

    /** ========================
     * 🛠️ Track Faction Donations
     * ======================== */
    function trackFactionDonations() {
        const logContainer = document.querySelector(".q-infinite-scroll");
        if (!logContainer) return;

        logContainer.querySelectorAll("div").forEach(entry => {
            const text = entry.innerText.trim();
            const entryTimestamp = getEntryTimestamp(entry);

            // Ignore already processed entries
            if (entryTimestamp <= lastProcessedTime) return;

            // Match donation logs
            const donationMatch = text.match(/(.+?) deposited (\d+)x (.+)/);
            if (donationMatch) {
                const [, username, quantity, item] = donationMatch;
                recordDonation(username, item, Number(quantity));
            }

            // Update last processed timestamp
            lastProcessedTime = entryTimestamp;
            localStorage.setItem("script_last_processed_time", lastProcessedTime);
        });
    }

    /** ========================
     * 📌 Record Donations Locally
     * ======================== */
    function recordDonation(username, item, quantity) {
        let donationData = JSON.parse(localStorage.getItem("script_faction_donations")) || {};

        if (!donationData[username]) {
            donationData[username] = {};
        }

        donationData[username][item] = (donationData[username][item] || 0) + quantity;

        localStorage.setItem("script_faction_donations", JSON.stringify(donationData));
    }

    /** ========================
     * 🏷️ Create Deposits Button (Your Code)
     * ======================== */
    function createDepositsButton() {
        const tabContainer = document.querySelector(".q-tabs__content");
        if (!tabContainer) {
            console.error("❌ Tab container not found.");
            return;
        }
        console.log("✅ Tab container found, adding Deposits button...");

        // Create the Deposits Button
        const depositsButton = document.createElement("a");
        depositsButton.id = "script_deposits_button";
        depositsButton.className = "q-tab relative-position self-stretch flex flex-center text-center q-focusable q-hoverable cursor-pointer";
        depositsButton.innerHTML = `
            <div class="q-focus-helper" tabindex="-1"></div>
            <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                <div class="row q-col-gutter-xs items-center">
                    <div class="col q-tab__label">Deposits</div>
                </div>
            </div>
            <div class="q-tab__indicator absolute-bottom text-transparent"></div>
        `;

        // Find the "Activity" tab dynamically
        let activityTab = [...document.querySelectorAll("a.q-tab")].find(tab => tab.textContent.trim() === "Activity");

        if (activityTab) {
            tabContainer.insertBefore(depositsButton, activityTab.nextSibling);
            console.log("✅ Deposits tab added!");
        } else {
            console.error("❌ Activity tab not found! Deposits button could not be inserted.");
            return;
        }

        // Create the collapsible donation log panel
        const trackerContainer = document.createElement("div");
        trackerContainer.id = "script_donation_tracker";
        trackerContainer.style.cssText = `
            display: none;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            margin-top: 10px;
            border-radius: 5px;
            font-size: 14px;
        `;

        document.querySelector(".q-page.q-layout-padding")?.prepend(trackerContainer);

        // Toggle visibility when clicked
        depositsButton.addEventListener("click", () => {
            trackerContainer.style.display = trackerContainer.style.display === "none" ? "block" : "none";
            displayFactionDonations();
        });
    }

    /** ========================
     * 📊 Display Faction Donations
     * ======================== */
    function displayFactionDonations() {
        const trackerContainer = document.getElementById("script_donation_tracker");
        if (!trackerContainer) return;

        const donationData = JSON.parse(localStorage.getItem("script_faction_donations")) || {};
        let content = "<strong>Faction Donations:</strong><br>";

        for (const user in donationData) {
            content += `<div><strong>${user}:</strong> `;
            content += Object.entries(donationData[user])
                .map(([item, qty]) => `${item}: ${qty}`)
                .join(", ");
            content += "</div>";
        }

        content += `<button id="clear_donations" style="margin-top: 5px;">Clear</button>`;
        trackerContainer.innerHTML = content;

        document.getElementById("clear_donations").addEventListener("click", () => {
            localStorage.setItem("script_faction_donations", "{}");
            localStorage.setItem("script_last_processed_time", "0");
            displayFactionDonations();
        });
    }

    /** ========================
     * 🕒 Get Timestamp from Entry
     * ======================== */
    function getEntryTimestamp(entry) {
        const timeText = entry.querySelector(".time-class")?.innerText; // Adjust selector if needed
        if (!timeText) return Date.now();

        const parsedTime = Date.parse(timeText);
        return isNaN(parsedTime) ? Date.now() : parsedTime;
    }

    /** ========================
     * 🔄 Observe Page for Changes (Auto-Update)
     * ======================== */
    function observeFactionActivity() {
        const activityContainer = document.querySelector(".q-infinite-scroll");
        if (!activityContainer) return;

        const observer = new MutationObserver(() => {
            trackFactionDonations();
        });

        observer.observe(activityContainer, { childList: true, subtree: true });
    }

    /** ========================
     * 🚀 Initialize Script
     * ======================== */
    function init() {
        waitForTabBar();
        observeFactionActivity();
        trackFactionDonations(); // Run once on load
    }

    function waitForTabBar() {
        const observer = new MutationObserver(() => {
            if (document.querySelector(".q-tabs__content")) {
                createDepositsButton();
                observer.disconnect(); // Stop checking once found
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("load", init);

    function addMyCustomTab() {
  // Only run if on one of these three pages
  const currentPath = window.location.pathname;
  if (!['/faction', '/raids', '/faction/activity'].includes(currentPath)) {
    return;
  }

  // Select the tab bar container
  const tabBarContainer = document.querySelector('.submenu.q-mb-md .q-tabs__content.scroll--mobile.row.no-wrap.items-center');

  if (!tabBarContainer) return;

  // Avoid duplicates
  if (document.querySelector('#myCustomTab')) return;

  // Create a new tab-like <a> element
  const newTab = document.createElement('a');
  newTab.id = 'myCustomTab';
  newTab.className = 'q-tab relative-position self-stretch flex flex-center text-center'
    + ' q-tab--inactive q-focusable q-hoverable cursor-pointer';
  newTab.setAttribute('role', 'tab');
  newTab.setAttribute('aria-selected', 'false');
  newTab.tabIndex = -1; // same as the other inactive tabs

  newTab.innerHTML = `
    <div class="q-focus-helper" tabindex="-1"></div>
    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
      <div class="q-tab__label">My Button</div>
    </div>
    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
  `;

  tabBarContainer.appendChild(newTab);

  // Example click handler
  newTab.addEventListener('click', (e) => {
    e.preventDefault();
    alert('You clicked My Button!');
  });
}

// Run on page load
window.addEventListener('load', addMyCustomTab);

// Since it’s an SPA that doesn’t reload, re-check every 500ms
setInterval(addMyCustomTab, 500);

})();
