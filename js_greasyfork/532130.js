// ==UserScript==
// @name         Monthly Stats Viewer Script
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  A Torn-inspired stats viewer styled and aligned to integrate seamlessly with Torn's design!
// @author       qez, Caio & Copilot
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532130/Monthly%20Stats%20Viewer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/532130/Monthly%20Stats%20Viewer%20Script.meta.js
// ==/UserScript==

// ----------------------------------------------------------------------------------------------------------
// start of Part 1: Setup and API Functions
// This section sets up the script metadata and functions for fetching data from the Torn API.

var api_key = "insert-your-api-key"; // Replace with your Torn API Key!

async function fetchPersonalStats(id, time) {
    // Build API URL to fetch personal stats
    var stats = [
        "xantaken",
        "energydrinkused",
        "useractivity",
        "refills",
        "attackswon",
        "respectforfaction",
        "retals",
        "statenhancersused",
        "networth",
        "overdosed"
    ].join(",");
    var url = time
        ? `https://api.torn.com/user/${id}?selections=personalstats&stat=${stats}&timestamp=${time}&key=${api_key}`
        : `https://api.torn.com/user/${id}?selections=personalstats&key=${api_key}`;
    try {
        let resp = await fetch(url);
        let data = await resp.json();
        if (data.error) {
            console.error("Error fetching stats data:", data.error);
            return null;
        }
        return data;
    } catch (err) {
        console.error("Error connecting to API:", err);
        return null;
    }
}

// Function to wait for a specific element before rendering the box
function waitForElement(selector, callback) {
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            observer.disconnect(); // Stop observing once the element is found
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Multi-selector logic to enhance compatibility:
waitForElement(".profile-left-wrapper, .personal-information.profile-right-wrapper.right, .profile-container.personal-info", (targetElement) => {
    console.log("Appending to element:", targetElement); // Debugging message
    targetElement.appendChild(output);
});

// end of Part 1
// ----------------------------------------------------------------------------------------------------------
// start of Part 2: Data Processing and Highlights
// This section calculates the stats differences, applies thresholds, and adds conditional highlights.

(function() {
    'use strict';

    console.log("Caio Script feat Copilot Activated");
    const style = document.createElement("style");
    style.innerHTML = `
    #stats-viewer-box .user-info-value,
    #stats-viewer-box .user-information-section {
        color: #fff !important; /* Force white text only within the stats viewer box */
    }
`;
    document.head.appendChild(style);

    // Prepare timestamps for API calls
    var d = new Date();
    d.setMonth(d.getMonth() - 1); // One month ago
    var monthAgo = ~~(d / 1000);
    var id = window.location.href.split("=")[1]; // Extract Torn profile ID
    var days = 30; // Assume a fixed 30-day month for simplicity

    // Fetch stats for this user
    Promise.all([
        fetchPersonalStats(id, monthAgo),
        fetchPersonalStats(id)
    ]).then(([pastStats, currentStats]) => {
        var p0 = pastStats.personalstats || {};
        var p1 = currentStats.personalstats || {};

        var xanaxTaken = (p1.xantaken || 0) - (p0.xantaken || 0);
        var edrinkTaken = (p1.energydrinkused || 0) - (p0.energydrinkused || 0);
        var userActivity = ((p1.useractivity || 0) - (p0.useractivity || 0)) / 86400; // Activity in hours/day
        userActivity = userActivity.toFixed(2); // Strictly round Activity to 2 decimal places
        var refills = (p1.refills || 0) - (p0.refills || 0);
        var attacks = (p1.attackswon || 0) - (p0.attackswon || 0);
        var totalRespect = (p1.respectforfaction || 0) - (p0.respectforfaction || 0);
        var retals = (p1.retals || 0) - (p0.retals || 0);
        var travel = (p1.traveltimes || 0) - (p0.traveltimes || 0);
        var se = (p1.statenhancersused || 0) - (p0.statenhancersused || 0);
        var networth = (p1.networth || 0) - (p0.networth || 0);
        var overdoses = (p1.overdosed || 0) - (p0.overdosed || 0); // Calculate overdoses for the last month

        // Improved Networth formatting with trillions, billions, and millions
        function formatNetworth(value) {
            const trillions = Math.floor(value / 1e12);
            const billions = Math.floor((value % 1e12) / 1e9);
            const millions = Math.floor((value % 1e9) / 1e6);

            let formatted = "";
            if (trillions > 0) formatted += `${trillions}t `;
            if (billions > 0) formatted += `${billions}b `;
            if (millions > 0) formatted += `${millions}m`;
            return formatted.trim();
        }

        function formatNetworthWithChange(value, change) {
            if (change === 0) return `<span style="color:#fff; font-weight:bold;">${formatNetworth(value)} (+0)</span>`;
            const formattedChange = change > 0 ? `+${formatNetworth(change)}` : `-${formatNetworth(-change)}`;
            const changeColor = change > 0 ? (change >= 1e9 ? "hotpink" : "green") : "#D84315";
            return `<span style="color:#fff; font-weight:bold;">${formatNetworth(value)}</span> (<span style="color:${changeColor}; font-weight:bold;">${formattedChange}</span>)`;
        }

        // Highlights for stats based on updated criteria
        function highlightValue(value, criteria, colors) {
            for (let i = 0; i < criteria.length; i++) {
                if (value <= criteria[i]) return `<span style="color:${colors[i]}; font-weight:bold;">${value}</span>`;
            }
            return `<span style="color:${colors[criteria.length]}; font-weight:bold;">${value}</span>`;
        }

        // Compute Activity in both hours and minutes per day
        function formatActivity(hoursPerDay) {
            const minutesPerDay = (hoursPerDay * 60).toFixed(0); // Convert hours to minutes
            const highlight = highlightValue(
                hoursPerDay,
                [0.5, 1, 3, 6], // Thresholds in hours
                ["#D84315", "yellow", "green", "hotpink", "#00FFFF"] // Hex code for neon blue above 6 hours/day
            );
            return `${highlight} hrs/day || ${highlightValue(minutesPerDay, [30, 60, 180, 360], ["#D84315", "yellow", "green", "hotpink", "#00FFFF"])} minutes/day`;
        }

        // Apply updated criteria and limit decimals for daily averages
        let xanaxLine = highlightValue(xanaxTaken, [60, 74, 90], ["#D84315", "yellow", "green", "hotpink"]) + ` (${(xanaxTaken / days).toFixed(2)}/day)`;
        let edrinkLine = highlightValue(edrinkTaken, [1, 150, 299, 359], ["#fff", "yellow", "green", "hotpink", "#00FFFF"]) + ` (${(edrinkTaken / days).toFixed(2)}/day)`;
        let refillsLine = highlightValue(refills, [15, 20, 25], ["#D84315", "yellow", "green", "hotpink"]) + ` (${(refills / days).toFixed(2)}/day)`;
        let networthLine = formatNetworthWithChange(p1.networth || 0, networth);
        let activityLine = formatActivity(userActivity); // Hours and minutes display with highlight for Activity
        let attacksLine = `<span style="color:#fff;">${attacks}</span>`; // Default
        let respectLine = `<span style="color:#fff;">${totalRespect}</span>`; // Default
        let retalsLine = highlightValue(retals, [0, 10], ["#fff", "green", "hotpink"]);
        let travelLine = highlightValue(travel, [13], ["#fff", "green"]);
        let seLine = highlightValue(se, [1], ["#fff", "hotpink"]);
        let overdosesLine = highlightValue(overdoses, [0.99], ["hotpink", "#D84315"]);

// end of Part 2
// ----------------------------------------------------------------------------------------------------------
// start of Part 3: HTML Generation and Rendering
// This section creates the Torn-styled stats viewer box with updated dimensions and visuals.

        // Create and render stats viewer box
        var output = document.createElement("div");
        output.className = "basic-information profile-left-wrapper left"; // Torn profile box style
        output.id = "stats-viewer-box"; // Add this unique ID here
        output.style.marginTop = "10px"; // Add spacing above the box
        output.style.width = "95%"; // Relative width for responsive design
        output.style.maxWidth = "386px"; // Maximum width for larger screens
        output.style.background = "#333333"; // Inner box background color
        output.style.borderRadius = "5px"; // Rounded corners for aesthetics
        output.style.boxShadow = "0 1px 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1)"; // Torn-like shadow effect
        output.innerHTML = `
            <div>
                <div class="title-black top-round" style="background: linear-gradient(180deg, #555555 0%, #333333 100%); color: #fff; text-shadow: 0 0 2px #00000080; font-size: 12px; font-weight: bold; line-height: 30px; height: 30px; padding-left: 10px; margin: 0; border-bottom: 1px solid #444;">
                    Monthly Stats Viewer (last 30 days)
                </div>
            </div>
            <div class="cont bottom-round" style="padding: 0; max-height: 290px; overflow-y: auto;">
                <ul class="info-table" style="list-style-type: none; padding: 0; margin: 0; width: 100%; max-width: 386px;">
                    ${[
                        { label: "Activity", value: activityLine },
                        { label: "Xanax", value: xanaxLine },
                        { label: "Energy Drinks", value: edrinkLine },
                        { label: "Refills", value: refillsLine },
                        { label: "Attacks", value: attacksLine },
                        { label: "Respect", value: respectLine },
                        { label: "Retals", value: retalsLine },
                        { label: "Networth", value: networthLine },
                        { label: "SEs", value: seLine },
                        { label: "Overdoses", value: overdosesLine }
                    ].map(({ label, value }) => `
                    <li style="border-bottom: 1px solid #222222; padding: 0; height: 24px; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div class="user-information-section" style="width: 35%; font-weight: bold; color: #ddd;">${label}</div>
                        <div class="user-info-value" style="width: 65%; text-align: left;">${value}</div>
                    </li>
                    `).join("")}
                </ul>
            </div>
        </div>
        `;

        // Append to multiple possible locations
        waitForElement(".profile-left-wrapper, .personal-information.profile-right-wrapper.right, .profile-container.personal-info", (targetElement) => {
            console.log("Stats viewer appended to:", targetElement); // Debugging message
            targetElement.appendChild(output);

            // Apply inline styling to force white text for stats viewer
            document.querySelectorAll('#stats-viewer-box .user-info-value, #stats-viewer-box .user-information-section').forEach(element => {
                element.style.color = "#fff"; // Force inline white text only inside stats viewer
            });
        });

    }).catch((err) => {
        console.error("Error fetching stats or processing data:", err);
    });
})();
// end of Part 3