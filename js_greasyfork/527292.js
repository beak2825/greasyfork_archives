// ==UserScript==
// @name         ZedCity - Level Up Warning
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license      MIT
// @description  Warn when close to leveling up! (Runs on Click + Detects XP Changes)
// @author       YoYo
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527292/ZedCity%20-%20Level%20Up%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/527292/ZedCity%20-%20Level%20Up%20Warning.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🚀 Level Up Warning script loaded.");

    let lastFetchedTime = 0;   // Prevents excessive API calls
    let dismissed = false;     // Tracks if the user dismissed the warning
    let lastXP = null;         // Stores last XP to detect changes

    // Function to fetch XP data (only if enough time has passed)
    async function fetchXPData() {
        let now = Date.now();
        if (now - lastFetchedTime < 5000) {
            console.log("⏳ Skipping API call (too soon)");
            return null;
        }

        console.log("📡 Fetching XP data...");
        try {
            let response = await fetch("https://api.zed.city/getStats", { method: "GET", credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch XP data.");

            let data = await response.json();
            lastFetchedTime = now;
            console.log("✅ XP data fetched successfully:", data);
            return data;
        } catch (error) {
            console.error("❌ Error fetching XP data:", error);
            return null;
        }
    }

    // Function to check XP and display a warning if necessary
    async function checkAndDisplayWarning() {
        let data = await fetchXPData();
        if (!data) {
            console.log("⚠️ No XP data available. Skipping warning check.");
            return;
        }

        let { experience, xp_end } = data;
        let xpNeeded = xp_end - experience;
        console.log(`ℹ️ Current XP: ${experience}, XP needed for level-up: ${xp_end}, XP remaining: ${xpNeeded}`);

        // If XP changed after dismissal, allow warning to show again
        if (dismissed && experience !== lastXP) {
            console.log("🔄 XP has changed since last dismissal. Resetting dismissed state.");
            dismissed = false;
        }

        // Store the latest XP for future checks
        lastXP = experience;

        if (xpNeeded <= 25 && !dismissed) {
            console.log("🚨 Player is close to leveling up! Showing warning...");
            showLevelUpWarning(xpNeeded);
        } else {
            console.log("✅ XP is not close to level-up threshold. No warning needed.");
        }
    }

    // Function to display the warning (With Dismiss Feature)
    function showLevelUpWarning(xpNeeded) {
        console.log(`⚠️ Displaying level-up warning: ${xpNeeded} XP away!`);

        // Prevent duplicate warnings
        if (document.getElementById("levelUpWarning")) return;

        let warning = document.createElement("div");
        warning.id = "levelUpWarning";
        Object.assign(warning.style, {
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "red",
            color: "white",
            padding: "15px",
            fontSize: "18px",
            fontWeight: "bold",
            border: "2px solid black",
            borderRadius: "5px",
            zIndex: "9999",
            textAlign: "center",
            cursor: "pointer"
        });

        warning.innerText = `⚠️ WARNING: You are ${xpNeeded} XP away from leveling up! (Click to Dismiss)`;

        document.body.appendChild(warning);
        console.log("✅ Warning displayed on page.");

        // Click event to dismiss the warning
        warning.addEventListener("click", function () {
            warning.remove();
            dismissed = true; // Prevents it from showing again until XP changes
            console.log("🛑 Warning dismissed manually by user.");
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(warning)) {
                warning.remove();
                console.log("ℹ️ Warning removed after 10 seconds.");
            }
        }, 10000);
    }

    // Event listener to trigger XP check on click
    document.addEventListener("click", () => {
        console.log("🖱️ Click detected! Checking XP...");
        checkAndDisplayWarning();
    });

})();
