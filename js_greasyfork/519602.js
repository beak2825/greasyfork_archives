// ==UserScript==
// @name         Snow Toggle
// @version      1.0.0
// @description  A mod to toggle snow in Bonk.io
// @author       FeiFei
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @match        https://multiplayer.gg/physics/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1366475
// @downloadURL https://update.greasyfork.org/scripts/519602/Snow%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/519602/Snow%20Toggle.meta.js
// ==/UserScript==

"use strict";

// Define a namespace for your mod to avoid conflicts
window.snowToggle = {};

// Initialize settings or variables your mod might need
snowToggle.windowConfigs = {
    windowName: "Snow Toggle", // The title of the window
    windowId: "snowToggle_window",
    modVersion: "1.0.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
    settingsContent: null,
    noWindow: true,
};

// !Settings:
// Initialize default settings
snowToggle.defaultSettings = {
    enable: false,
};

// Initialize settings
snowToggle.settings = structuredClone(snowToggle.defaultSettings);

// Save settings to localStorage
snowToggle.saveSettings = function () {
    localStorage.setItem("snowToggleSettings", JSON.stringify(this.settings));
};

// Load settings from localStorage
snowToggle.loadSettings = function () {
    const savedSettings = localStorage.getItem("snowToggleSettings");
    if (savedSettings) {
        try {
            this.settings = JSON.parse(savedSettings);
        } catch (e) {
            console.error("Failed to parse saved settings:", e);
            this.settings = structuredClone(this.defaultSettings);
        }
    }
};

// !UI:
// Create the mod window using BonkHUD
snowToggle.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);

    // Load UI settings if available
    // bonkHUD.loadUISetting(modIndex);
};

// Set settings content with a toggle button
snowToggle.setSettingsContent = function () {
    let settingsHTML = document.createElement("div");
    settingsHTML.id = "snowToggleModContainer";
    settingsHTML.className = "settings-container bonkhud-background-color"; // Apply background color

    // Create the toggle switch container
    let toggleContainer = document.createElement("div");
    toggleContainer.style.display = "flex";
    toggleContainer.style.alignItems = "center";
    toggleContainer.style.marginBottom = "10px";

    // Create the checkbox input
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "snowToggleCheckbox";
    checkbox.checked = this.settings.enable;

    // Create the label for the checkbox (styled as a toggle switch)
    let label = document.createElement("label");
    label.htmlFor = "snowToggleCheckbox";
    label.className = "snowToggleSwitch bonkhud-button-color"; // Apply button color

    // Create the text label
    let textLabel = document.createElement("span");
    textLabel.className = "bonkhud-text-color";
    textLabel.textContent = "Enable Snow";
    textLabel.style.marginLeft = "10px";

    // Event listener to update the setting
    checkbox.addEventListener("change", () => {
        this.settings.enable = checkbox.checked;
        // Save the settings
        this.saveSettings();
    });

    toggleContainer.appendChild(checkbox);
    toggleContainer.appendChild(label);
    toggleContainer.appendChild(textLabel);

    settingsHTML.appendChild(toggleContainer);

    // Add to settingsContent
    this.windowConfigs.settingsContent = settingsHTML;
};

// !Styles:
snowToggle.addStyles = function () {
    const css = `
    /* Scoped Styles for SnowToggle Mod */
    #snowToggleModContainer .snowToggleSwitch {
        position: relative;
        width: 40px;
        height: 20px;
        background-color: #ccc;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    #snowToggleModContainer .snowToggleSwitch::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        left: 1px;
        top: 1px;
        background-color: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
    }
    #snowToggleModContainer input[type="checkbox"]:checked + .snowToggleSwitch::before {
        transform: translateX(20px);
    }
    #snowToggleModContainer input[type="checkbox"]:checked + .snowToggleSwitch {
        background-color: #2196F3;
    }
    #snowToggleModContainer input[type="checkbox"] {
        display: none;
    }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
};

// !Injector:
// Injector function to inject code into the game code
snowToggle.injector = function (src) {
    let newSrc = src;
    
    let orgCode = newSrc.match(/return\s+([a-zA-Z0-9_$]{2,10}\[[0-9]+\])\s*>=\s*335\s*\|\|\s*\1\s*<=\s*3;/)[0];
    let newCode = `return window.snowToggle.settings.enable;`;
    newSrc = newSrc.replace(orgCode, newCode);
        
    return newSrc;
};

// Initialize the mod (run when document is ready)
snowToggle.initMod = function () {
    // Load settings from localStorage
    this.loadSettings();
    
    // Create window using BonkHUD
    this.setSettingsContent();
    this.createWindow();
    this.addStyles();
    
    console.log(this.windowConfigs.windowName + " initialized");
};

// !Loaders:
// Function to ensure bonkAPI is loaded or timeout after a set duration
const ensureBonkAPI = async (timeout = 5000, retryInterval = 100) => {
    const maxRetries = Math.ceil(timeout / retryInterval);
    let retries = 0;

    while (!window.bonkAPI && retries < maxRetries) {
        console.warn(`bonkAPI not found. Retrying (${retries + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        retries++;
    }

    if (!window.bonkAPI) {
        alert("BonkAPI is not loaded or installed. Please ensure BonkAPI is installed and try again.");
        console.error("Failed to load bonkAPI after multiple retries.");
        return false;
    }

    return true;
};

// Function to handle document readiness and initialize the mod
snowToggle.onDocumentReady = async () => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        if (await ensureBonkAPI()) {
            snowToggle.initMod();
        }
    } else {
        document.addEventListener("DOMContentLoaded", async () => {
            if (await ensureBonkAPI()) {
                snowToggle.initMod();
            }
        });
    }
};

// Injecting using Excigma's code injector userscript
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        return snowToggle.injector(bonkCode);
    } catch (error) {
        throw error;
    }
});

console.log("Snow Toggle injector loaded");

// Call the function to check document readiness and initialize the mod
snowToggle.onDocumentReady();
