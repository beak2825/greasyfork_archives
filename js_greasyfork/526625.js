// ==UserScript==
// @name         Zed City Better Bars
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  Uses API to fetch full recharge times & track XP progress manually, accounting for membership bonuses.
// @author       You
// @license      MIT
// @match        https://www.zed.city/*
// @icon         https://www.s2.favicons?sz=64&domain=zed.city
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526625/Zed%20City%20Better%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/526625/Zed%20City%20Better%20Bars.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("📢 Zed City Userscript Loaded!");

    let userData = null;
    let towerData = null;
    let raidCooldownElement = null;
    let boosterCooldownElement = null; // Fix: Define boosterCooldownElement
    let radioTowerElement = null;
    async function fetchUserData() {
        try {
            let response = await fetch("https://api.zed.city/getStats", {
                method: "GET",
                credentials: "include",
            });
            let data = await response.json();

            if (data.error) {
                console.warn(`⚠️ API Error: ${data.error}`);
                return;
            }

            userData = data;
            console.log("📡 User Data Fetched:", userData);
            updateLevelElement();
            updateRaidCooldown();
            updateBoosterCooldown();
        } catch (error) {
            console.error("❌ Error fetching user data:", error);
        }
    }

    function fetchRadioTowerData() {
        console.log("🔄 Fetching Radio Tower timer on page load...");
        fetch("https://api.zed.city/getRadioTower", {
            method: "GET",
            credentials: "include", // Ensures authentication cookies are sent
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.warn(`⚠️ API Error: ${data.error}`);
                    return;
                }

                if (data.expire !== undefined) {
                    towerData = data.expire;
                    logRadioTowerTimer();
                } else {
                    console.warn("⚠️ No Radio Tower timer found in response.");
                }
            })
            .catch(error => console.error("❌ Error fetching Radio Tower data:", error));
    }

    function calculateFullRechargeTime(currentValue, maxValue, regenRate, regenInterval, nextTick) {
        let statRemaining = maxValue - currentValue;
        if (statRemaining <= 0) return { fullTime: "Full", timeUntilFull: "00:00" };

        let firstTickTime = nextTick * 1000; // Convert seconds to milliseconds
        let fullTicksNeeded = Math.ceil(statRemaining / regenRate);
        let additionalTime = (fullTicksNeeded - 1) * regenInterval * 60 * 1000;
        let totalTimeNeeded = firstTickTime + additionalTime;
        let fullRechargeDate = new Date(Date.now() + totalTimeNeeded);

        let totalMinutesRemaining = Math.floor(totalTimeNeeded / 60000);
        let hoursRemaining = Math.floor(totalMinutesRemaining / 60);
        let minutesRemaining = totalMinutesRemaining % 60;
        let timeUntilFull = `${String(hoursRemaining).padStart(2, "0")}:${String(minutesRemaining).padStart(2, "0")}`;

        return {
            fullTime: fullRechargeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
            timeUntilFull,
        };
    }

    async function addStatDisplay(statKey, label, baseRegenRate, regenInterval, barClass) {
        try {
            let statBar = await waitForElement(`.q-linear-progress.${barClass}`);
            if (!statBar) return;

            console.log(`✅ Found ${label} progress bar`);

            let infoElement = document.createElement("div");
            Object.assign(infoElement.style, {
                padding: "5px",
                marginTop: "5px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                borderRadius: "5px",
                fontSize: "12px",
                textAlign: "center",
                cursor: "pointer"
            });

            statBar.parentNode.insertBefore(infoElement, statBar.nextSibling);

            let lastDisplayedText = "";

            setInterval(() => {
                if (userData) {
                    let isMember = userData?.membership ? true : false;
                    let adjustedRegenRate = baseRegenRate;
                    let adjustedMaxValue = userData.skills[`max_${statKey}`] || 0;
                    let currentValue = userData[statKey] || 0;
                    let nextTick = userData[`${statKey}_regen`] || 0;

                    if (statKey === "energy" && isMember) {
                        adjustedRegenRate = 5;
                        adjustedMaxValue = 150;
                    }

                    let { fullTime, timeUntilFull } = calculateFullRechargeTime(
                        currentValue, adjustedMaxValue, adjustedRegenRate, regenInterval, nextTick
                    );

                    let newDisplayText = `${label} ${fullTime} (${timeUntilFull})`;

                    if (newDisplayText !== lastDisplayedText) {
                        infoElement.textContent = newDisplayText;
                        lastDisplayedText = newDisplayText;
                    }
                }
            }, 1000);
        } catch (error) {
            console.error(`❌ Error modifying ${label} bar:`, error);
        }
    }

async function addCooldownDisplays() {
    try {
        let numberRow = await waitForElement(".currency-stats");
        if (!numberRow) return;

        // Raid Cooldown Element
        raidCooldownElement = document.createElement("div");
        Object.assign(raidCooldownElement.style, {
            color: "white",
            borderRadius: "5px",
            fontSize: "12px",
            textAlign: "center",
            cursor: "pointer"
        });
        raidCooldownElement.innerText = "⚔️ Raid: Loading...";
        numberRow.prepend(raidCooldownElement);

        // Booster Cooldown Element
        boosterCooldownElement = document.createElement("div");
        Object.assign(boosterCooldownElement.style, {
            color: "white",
            borderRadius: "5px",
            fontSize: "12px",
            textAlign: "center",
            cursor: "pointer"
        });
        boosterCooldownElement.innerText = "Booster: Loading...";
        numberRow.appendChild(boosterCooldownElement);

        // Radio Tower Display Element (Appended at the end)
        radioTowerElement = document.createElement("div");
        Object.assign(radioTowerElement.style, {
            color: "white",
            borderRadius: "5px",
            fontSize: "12px",
            textAlign: "center",
            cursor: "pointer"
        });
        radioTowerElement.innerText = "📡 Radio Tower: Coming Soon";
        numberRow.appendChild(radioTowerElement);

    } catch (error) {
        console.error("❌ Error adding cooldown displays:", error);
    }
}

    function updateRaidCooldown() {
        if (userData && userData.raid_cooldown !== undefined && raidCooldownElement) {
            let remainingSeconds = userData.raid_cooldown;
            let minutes = Math.floor(remainingSeconds / 60);
            let seconds = remainingSeconds % 60;
            raidCooldownElement.innerText = `⚔️ Raid: ${minutes}m ${seconds}s`;
        }
    }

    function updateBoosterCooldown() {
        if (userData && userData.booster_cooldown !== undefined && boosterCooldownElement) {
            let remainingSeconds = userData.booster_cooldown;
            let minutes = Math.floor(remainingSeconds / 60);
            let seconds = remainingSeconds % 60;
            boosterCooldownElement.innerText = `Booster: ${minutes}m ${seconds}s`;
        }
        else{
            boosterCooldownElement.innerText = `Booster: None`;
        }
    }

    /**
     * Logs the Radio Tower timer
     */
    function logRadioTowerTimer() {
        if(towerData != undefined & radioTowerElement){
        let timeLeft = towerData;
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        console.log(`📡 Radio Tower Timer: ${timeLeft} seconds`);
        console.log(`📡 Radio Tower Timer (formatted): ${hours}h ${minutes}m ${seconds}s`);
        radioTowerElement.innerText = `📡${hours}h ${minutes}m ${seconds}s`;
        }
    }


    async function updateLevelElement() {
        await waitForElement(".stat-level");

        let elem = document.querySelector(".stat-level");
        if (!elem || !userData) return;

        let levelText = elem.querySelector(".row.items-center.no-wrap div:last-child");
        if (!levelText) return;

        let currentXP = Math.round(userData.experience - userData.xp_start);
        let xpToNextLevel = Math.round(userData.xp_end - userData.xp_start);

        levelText.innerText = `${userData.rank} (${currentXP}/${xpToNextLevel})`;
    }

    async function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const observer = new MutationObserver(() => {
                let element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(`❌ Timeout: Element '${selector}' not found`);
            }, timeout);
        });
    }


    // Run the script
    addStatDisplay("energy", "Energy", 5, 10, "energy");
    addStatDisplay("rad", "Radiation", 1, 5, "rad");
    addStatDisplay("morale", "Morale", 5, 5, "morale");
    addStatDisplay("life", "Life", 10, 15, "life");
    addCooldownDisplays();
    fetchRadioTowerData();
    setInterval(fetchUserData, 5000);
    setInterval(fetchRadioTowerData, 5000);
})();
