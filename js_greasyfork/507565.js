// ==UserScript==
// @name         Website UI Switcher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Switch UI styles (modern/retro/material) for YouTube, Google, Roblox, Yahoo!, and Amazon.
// @author       Your Name
// @match        *://*.youtube.com/*
// @match        *://*.google.com/*
// @match        *://*.roblox.com/*
// @match        *://*.yahoo.com/*
// @match        *://*.amazon.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/507565/Website%20UI%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/507565/Website%20UI%20Switcher.meta.js
// ==/UserScript==

// Default settings
let settings = {
    style: "modern",  // "modern", "retro", or "material"
    roundedCorners: true,  // true or false
};

// Load settings from localStorage
if (localStorage.getItem("uiSwitcherSettings")) {
    settings = JSON.parse(localStorage.getItem("uiSwitcherSettings"));
}

// Apply styles based on settings
function applyStyles() {
    if (settings.style === "modern") {
        GM_addStyle(`
            /* General Modern Rounded Styles */
            * {
                border-radius: ${settings.roundedCorners ? '10px' : '0px'} !important;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            /* Modern Font */
            body, button, input {
                font-family: 'Arial', sans-serif !important;
            }
        `);
    } else if (settings.style === "retro") {
        GM_addStyle(`
            /* Retro Styles */
            * {
                border-radius: ${settings.roundedCorners ? '10px' : '0px'} !important;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                background-color: #282c34 !important;
                color: #61dafb !important;
                transition: all 0.3s ease;
            }
            
            /* Retro Font */
            body, button, input {
                font-family: 'Press Start 2P', cursive !important;
            }
        `);
    } else if (settings.style === "material") {
        GM_addStyle(`
            /* Material Design Lite Styles */
            @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
            @import url('https://code.getmdl.io/1.3.0/material.indigo-pink.min.css');
            
            * {
                border-radius: ${settings.roundedCorners ? '4px' : '0px'} !important;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2) !important;
                transition: all 0.3s ease;
            }

            body {
                font-family: 'Roboto', sans-serif !important;
            }

            .mdl-button {
                border-radius: 4px !important;
            }
        `);
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem("uiSwitcherSettings", JSON.stringify(settings));
    applyStyles();
}

// Settings page UI
function createSettingsPage() {
    const settingsContainer = document.createElement("div");
    settingsContainer.id = "uiSwitcherSettingsContainer";
    settingsContainer.className = "mdl-card mdl-shadow--4dp";
    settingsContainer.style.position = "fixed";
    settingsContainer.style.top = "10%";
    settingsContainer.style.left = "50%";
    settingsContainer.style.transform = "translateX(-50%)";
    settingsContainer.style.zIndex = "9999";
    settingsContainer.style.width = "300px";

    settingsContainer.innerHTML = `
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">UI Switcher Settings</h2>
        </div>
        <div class="mdl-card__supporting-text">
            <label for="uiStyleSelector">
                Style:
                <select id="uiStyleSelector" class="mdl-selectfield__select">
                    <option value="modern" ${settings.style === 'modern' ? 'selected' : ''}>Modern</option>
                    <option value="retro" ${settings.style === 'retro' ? 'selected' : ''}>Retro</option>
                    <option value="material" ${settings.style === 'material' ? 'selected' : ''}>Material</option>
                </select>
            </label><br><br>
            <label for="roundedCornersCheckbox">
                Rounded Corners:
                <input type="checkbox" id="roundedCornersCheckbox" ${settings.roundedCorners ? 'checked' : ''}>
            </label><br><br>
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <button id="saveSettingsButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Save
            </button>
            <button id="resetSettingsButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                Reset to Default
            </button>
            <button id="closeSettingsButton" class="mdl-button mdl-js-button mdl-button--raised">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(settingsContainer);

    // Initialize MDL components
    componentHandler.upgradeDom();

    // Add event listeners for controls
    document.getElementById("saveSettingsButton").addEventListener("click", () => {
        settings.style = document.getElementById("uiStyleSelector").value;
        settings.roundedCorners = document.getElementById("roundedCornersCheckbox").checked;
        saveSettings();
        alert("Settings saved!");
    });

    document.getElementById("resetSettingsButton").addEventListener("click", () => {
        localStorage.removeItem("uiSwitcherSettings");
        settings = {
            style: "modern",
            roundedCorners: true
        };
        document.getElementById("uiStyleSelector").value = 'modern';
        document.getElementById("roundedCornersCheckbox").checked = true;
        saveSettings();
        alert("Settings reset to default!");
    });

    document.getElementById("closeSettingsButton").addEventListener("click", () => {
        settingsContainer.remove();
    });
}

// Register menu command to open settings page
GM_registerMenuCommand("UI Switcher Settings", createSettingsPage);

// Apply styles on page load
applyStyles();
