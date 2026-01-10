// ==UserScript==
// @name         Auto Reload on Stake.com - CodeStats edition
// @description  Automatically claims 10 minute reloads on Stake.com by sequentially clicking VIP Reward → Claim Reload → Return to Rewards. The script starts after a short page-load delay, mimics human behavior with user customizable random delays, occasional skipped cycles, and subtle mouse/scroll movements. WANT MORE STAKE BONUS CODE AUTO-CLAIM TOOLS? GO TO https://codestats.gg
// @author       CHUBB
// @namespace    https://codestats.gg
// @version      1.1.3
// @match        https://stake.com/*
// @match        https://stake.us/*
// @match        https://stake.ac/*
// @match        https://stake.games/*
// @match        https://stake.bet/*
// @match        https://stake.pet/*
// @match        https://stake.mba/*
// @match        https://stake.jp/*
// @match        https://stake.bz/*
// @match        https://stake.ceo/*
// @match        https://stake.krd/*
// @match        https://staketr.com/*
// @match        https://stake1001.com/*
// @match        https://stake1002.com/*
// @match        https://stake1003.com/*
// @match        https://stake1004.com/*
// @match        https://stake1005.com/*
// @match        https://stake1021.com/*
// @match        https://stake1022.com/*
// @match        https://stake.br/*
// @exclude      https://stake.com/settings/offers*
// @exclude      https://stake.us/settings/offers*
// @exclude      https://stake.ac/settings/offers*
// @exclude      https://stake.games/settings/offers*
// @exclude      https://stake.bet/settings/offers*
// @exclude      https://stake.pet/settings/offers*
// @exclude      https://stake.mba/settings/offers*
// @exclude      https://stake.jp/settings/offers*
// @exclude      https://stake.bz/settings/offers*
// @exclude      https://stake.ceo/settings/offers*
// @exclude      https://stake.krd/settings/offers*
// @exclude      https://staketr.com/settings/offers*
// @exclude      https://stake1001.com/settings/offers*
// @exclude      https://stake1002.com/settings/offers*
// @exclude      https://stake1003.com/settings/offers*
// @exclude      https://stake1004.com/settings/offers*
// @exclude      https://stake1005.com/settings/offers*
// @exclude      https://stake1021.com/settings/offers*
// @exclude      https://stake1022.com/settings/offers*
// @exclude      https://stake.br/settings/offers*
// @run-at       document-idle
// @license      MIT
// @connect      stake.com
// @connect      stake.us
// @connect      stake.ac
// @connect      stake.games
// @connect      stake.bet
// @connect      stake.pet
// @connect      stake.mba
// @connect      stake.jp
// @connect      stake.bz
// @connect      stake.ceo
// @connect      stake.krd
// @connect      staketr.com
// @connect      stake1001.com
// @connect      stake1002.com
// @connect      stake1003.com
// @connect      stake1004.com
// @connect      stake1005.com
// @connect      stake1021.com
// @connect      stake1022.com
// @connect      stake.br
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546623/Auto%20Reload%20on%20Stakecom%20-%20CodeStats%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/546623/Auto%20Reload%20on%20Stakecom%20-%20CodeStats%20edition.meta.js
// ==/UserScript==

// ===== CONFIGURATION SYSTEM =====
const defaultConfig = {
    minMinutes: 10,
    maxMinutes: 12,
    enabled: true,
};

let config = { ...defaultConfig };
let currentTimeout = null;
let currentTimer = null;

function loadConfig() {
    try {
        const saved = GM_getValue("autoReloadConfig", null);
        if (saved) {
            config = { ...defaultConfig, ...saved };
        }
    } catch (e) {
        console.log("Could not load config, using defaults");
    }
}

// Update input fields when config is loaded
function updateInputFieldsFromConfig() {
    const minHours = Math.floor(config.minMinutes / 60);
    const minMins = config.minMinutes % 60;
    const maxHours = Math.floor(config.maxMinutes / 60);
    const maxMins = config.maxMinutes % 60;

    const minHoursInput = document.getElementById("minHours");
    const minMinutesInput = document.getElementById("minMinutes");
    const maxHoursInput = document.getElementById("maxHours");
    const maxMinutesInput = document.getElementById("maxMinutes");

    if (minHoursInput) minHoursInput.value = minHours;
    if (minMinutesInput) minMinutesInput.value = minMins;
    if (maxHoursInput) maxHoursInput.value = maxHours;
    if (maxMinutesInput) maxMinutesInput.value = maxMins;
}

function saveConfig() {
    try {
        GM_setValue("autoReloadConfig", config);
    } catch (e) {
        console.log("Could not save config");
    }
}

// ===== HUD SETUP =====

function setupHUD() {
    let hud = document.createElement("div");
    hud.id = "autoReloadHUD";
    hud.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 600px;
        max-height: 300px;
        overflow-y: auto;
        font-size: 12px;
        background: rgba(0,0,0,0.8);
        color: #0f0;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        z-index: 999999;
        border: 1px solid #0f0;
    `;

    hud.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <b><a href="https://codestats.gg" target="_blank" rel="noopener noreferrer" style="color: #0f0; text-decoration: underline;">CodeStats.gg</a> Stake Reload Bot v1.1.3</b>
            <button id="minimizeBtn" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">−</button>
        </div>
        <div id="mainContent">
            <div style="margin: 8px 0; padding: 8px; background: rgba(0,255,0,0.1); border-radius: 4px;">
                <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 8px;">
                    <button id="goToVip" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🏆 VIP</button>
                    <button id="toggleBtn" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">${config.enabled ? "PAUSE" : "START"}</button>
                    <span>Status: <span id="statusText">${config.enabled ? "RUNNING" : "PAUSED"}</span></span>
                </div>
                <div style="margin-bottom: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display: block; margin-bottom: 2px;">Min Time:</label>
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <input type="number" id="minHours" value="${Math.floor(config.minMinutes / 60)}" min="0" max="23" style="width: 50px; padding: 2px; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 2px;">
                                <span style="color: #0f0;">h</span>
                                <input type="number" id="minMinutes" value="${config.minMinutes % 60}" min="0" max="59" style="width: 50px; padding: 2px; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 2px;">
                                <span style="color: #0f0;">m</span>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 2px;">Max Time:</label>
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <input type="number" id="maxHours" value="${Math.floor(config.maxMinutes / 60)}" min="0" max="23" style="width: 50px; padding: 2px; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 2px;">
                                <span style="color: #0f0;">h</span>
                                <input type="number" id="maxMinutes" value="${config.maxMinutes % 60}" min="0" max="59" style="width: 50px; padding: 2px; background: #000; color: #0f0; border: 1px solid #0f0; border-radius: 2px;">
                                <span style="color: #0f0;">m</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="applySettings" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Apply Settings</button>
            </div>
            <div id="hudLog" style="max-height: 80px; overflow-y: auto;"></div>
            <div id="hudTimer" style="font-weight: bold; color: #ff0;"></div>
        </div>
    `;

    document.body.appendChild(hud);

    // Setup event listeners
    document.getElementById("toggleBtn").addEventListener("click", toggleBot);
    document
        .getElementById("minimizeBtn")
        .addEventListener("click", toggleMinimize);
    document
        .getElementById("applySettings")
        .addEventListener("click", applySettings);

    document.getElementById("goToVip").addEventListener("click", function () {
        window.location.href = `${window.location.origin}/?tab=rewards&modal=vip`;
    });

    // Update input fields with loaded config values
    updateInputFieldsFromConfig();
}

function toggleBot() {
    config.enabled = !config.enabled;
    const btn = document.getElementById("toggleBtn");
    const status = document.getElementById("statusText");

    btn.textContent = config.enabled ? "PAUSE" : "START";
    status.textContent = config.enabled ? "RUNNING" : "PAUSED";

    saveConfig();

    if (config.enabled) {
        logHUD("Bot resumed");
        startCycle();
    } else {
        logHUD("Bot paused");
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        if (currentTimer) {
            clearInterval(currentTimer);
            currentTimer = null;
        }
        document.getElementById("hudTimer").textContent = "Bot paused";
    }
}

function toggleMinimize() {
    const mainContent = document.getElementById("mainContent");
    const minimizeBtn = document.getElementById("minimizeBtn");
    const hud = document.getElementById("autoReloadHUD");

    if (mainContent.style.display === "none") {
        // Restore to original size
        mainContent.style.display = "block";
        hud.style.width = "600px";
        hud.style.maxHeight = "300px";
        minimizeBtn.textContent = "−";
    } else {
        // Minimize
        mainContent.style.display = "none";
        hud.style.width = "350px";
        hud.style.maxHeight = "50px";
        minimizeBtn.textContent = "+";
    }
}

function applySettings() {
    const minHours = parseInt(document.getElementById("minHours").value);
    const minMins = parseInt(document.getElementById("minMinutes").value);
    const maxHours = parseInt(document.getElementById("maxHours").value);
    const maxMins = parseInt(document.getElementById("maxMinutes").value);

    const newMin = minHours * 60 + minMins;
    const newMax = maxHours * 60 + maxMins;

    // Always save the current input values to make them persistent
    config.minMinutes = newMin;
    config.maxMinutes = newMax;
    saveConfig();

    // Update input fields with saved values
    updateInputFieldsFromConfig();

    if (
        newMin >= 1 &&
        newMax >= 1 &&
        newMin <= 1440 &&
        newMax <= 1440 &&
        newMin <= newMax
    ) {
        const minText =
            minHours > 0 ? `${minHours}h ${minMins}m` : `${minMins}m`;
        const maxText =
            maxHours > 0 ? `${maxHours}h ${maxMins}m` : `${maxMins}m`;
        logHUD(`Settings updated: ${minText}-${maxText}`);

        // Restart cycle if enabled to apply new settings immediately
        if (config.enabled) {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
                currentTimeout = null;
            }
            if (currentTimer) {
                clearInterval(currentTimer);
                currentTimer = null;
            }
            startCycle();
        }
    } else {
        logHUD(
            "Invalid settings: min must be ≤ max, both between 1 minute and 24 hours",
        );
    }
}
setupHUD();

function logHUD(msg) {
    let log = document.getElementById("hudLog");
    if (log) {
        let line = document.createElement("div");
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        log.appendChild(line); // add new line at the bottom
        while (log.childNodes.length > 3) log.removeChild(log.firstChild); // trim from top
        log.scrollTop = log.scrollHeight; // auto-scroll to bottom
    }
    console.log(msg);
}

function updateTimer(ms) {
    let el = document.getElementById("hudTimer");
    if (!el) return;
    let sec = Math.floor(ms / 1000);
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    el.textContent = `Next attempt in ${m}m ${s}s`;
}

// ===== CLICK FUNCTION =====
async function orderedClick(selector, retries = 5, interval = 3000) {
    for (let i = 0; i < retries; i++) {
        const el = document.querySelector(selector);
        if (el) {
            const delay = Math.floor(Math.random() * 2000) + 1000;
            await wait(delay);
            el.click();
            logHUD(`Clicked: ${selector} (after ${delay}ms)`);
            return true;
        }
        await wait(interval);
    }
    logHUD(`FAILED: ${selector}`);
    return false;
}

// Update input fields when config changes
updateInputFieldsFromConfig();

// ===== CLAIM FUNCTION =====
async function claimReload() {
    try {
        simulateMouseMove();

        // Less clicks with latest Stake update.
        // await orderedClick('button[data-testid="progress-tab"]');
        // await orderedClick('button[data-testid="rewards-tab"]');
        await orderedClick('button[data-testid="vip-reward-claim-reload"]');

        // The MONEY button
        const claimSuccess = await orderedClick(
            'button[data-testid="claim-reload"]',
        );

        if (claimSuccess) {
            // If we successfully clicked claim, we *must* try to wrap up
            const finalStep = await orderedClick(
                'button[data-testid="return-to-rewards"]',
            );
            if (!finalStep) {
                logHUD(
                    "Claimed reload but couldn't return → reloading page...",
                );
                window.location.href = `${window.location.origin}/?tab=progress&modal=vip`;
                return false; // Signal that page is reloading
            }
        }

        simulateMouseMove();
        logHUD("Finished reload attempt.");
        return true; // Signal success
    } catch (error) {
        logHUD(`Error during claim: ${error.message}`);
        console.error("claimReload error:", error);
        return true; // Still return true to continue the cycle
    }
}

// ===== CYCLE FUNCTION =====
function startCycle() {
    if (!config.enabled) {
        logHUD("Bot is paused - timer not started");
        return;
    }

    // Clear any existing timers to prevent duplicates
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
    }
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }

    const min = config.minMinutes * 60 * 1000;
    const max = config.maxMinutes * 60 * 1000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;

    let endTime = Date.now() + delay;

    // Update timer display immediately
    updateTimer(delay);

    currentTimer = setInterval(() => {
        let remaining = endTime - Date.now();
        if (remaining <= 0) {
            clearInterval(currentTimer);
            currentTimer = null;
            return;
        }
        updateTimer(remaining);
    }, 1000);

    const minHours = Math.floor(config.minMinutes / 60);
    const minMins = config.minMinutes % 60;
    const maxHours = Math.floor(config.maxMinutes / 60);
    const maxMins = config.maxMinutes % 60;

    const minText = minHours > 0 ? `${minHours}h ${minMins}m` : `${minMins}m`;
    const maxText = maxHours > 0 ? `${maxHours}h ${maxMins}m` : `${maxMins}m`;

    logHUD(
        `Next attempt scheduled in ${(delay / 60000).toFixed(2)} minutes (${minText}-${maxText})`,
    );

    currentTimeout = setTimeout(async () => {
        currentTimeout = null;
        try {
            const shouldContinue = await claimReload();
            // Only start next cycle if we didn't trigger a page reload
            if (shouldContinue !== false) {
                startCycle();
            }
        } catch (error) {
            logHUD(`Cycle error: ${error.message} - restarting cycle...`);
            console.error("startCycle error:", error);
            // Always restart the cycle even on error
            startCycle();
        }
    }, delay);
}

// ===== UTILITIES =====
function simulateMouseMove() {
    const simElm = document.documentElement;
    const simMouseMove = new Event("mousemove", { bubbles: true });
    simElm.dispatchEvent(simMouseMove);
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== INITIAL RUN =====
(function firstRun() {
    loadConfig();

    // Small delay to ensure DOM is ready before updating input fields
    setTimeout(() => {
        updateInputFieldsFromConfig();
    }, 100);

    const firstDelay = Math.floor(Math.random() * 5000) + 5000;
    const minHours = Math.floor(config.minMinutes / 60);
    const minMins = config.minMinutes % 60;
    const maxHours = Math.floor(config.maxMinutes / 60);
    const maxMins = config.maxMinutes % 60;

    const minText = minHours > 0 ? `${minHours}h ${minMins}m` : `${minMins}m`;
    const maxText = maxHours > 0 ? `${maxHours}h ${maxMins}m` : `${maxMins}m`;

    logHUD(`Bot loaded - Settings: ${minText}-${maxText}`);
    logHUD(`First attempt in ${(firstDelay / 1000).toFixed(1)}s`);

    setTimeout(async () => {
        try {
            const shouldContinue = await claimReload();
            // Only start cycle if we didn't trigger a page reload
            if (shouldContinue !== false) {
                startCycle();
            }
        } catch (error) {
            logHUD(
                `First run error: ${error.message} - starting cycle anyway...`,
            );
            console.error("firstRun error:", error);
            // Start cycle even if first claim failed
            startCycle();
        }
    }, firstDelay);
})();
