// ==UserScript==
// @name         LBUtil
// @version      1.2.1
// @description  Made for LB
// @author       FeiFei
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1366475
// @downloadURL https://update.greasyfork.org/scripts/518264/LBUtil.user.js
// @updateURL https://update.greasyfork.org/scripts/518264/LBUtil.meta.js
// ==/UserScript==

"use strict";

window.lbUtil = {};

lbUtil.windowConfigs = {
    windowName: "LBUtil",
    windowId: "lbUtil_window",
    modVersion: "1.2.1",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
};

// Initialize default settings
lbUtil.defaultSettings = {
    smartCapZone: true,
    keepOutline: false,
    resetVTOLAngleOnDeath: false,
};

// Dynamic Vars
lbUtil.inGamePlayers = {};
lbUtil.bonkRenderer = null;

// Initialize settings
lbUtil.settings = JSON.parse(JSON.stringify(lbUtil.defaultSettings));

// Function to save settings to localStorage
lbUtil.saveSettings = function () {
    localStorage.setItem('lbUtilSettings', JSON.stringify(this.settings));
};

// Function to load settings from localStorage
lbUtil.loadSettings = function () {
    const savedSettings = localStorage.getItem('lbUtilSettings');
    if (savedSettings) {
        try {
            this.settings = JSON.parse(savedSettings);
        } catch (e) {
            console.error('Failed to parse saved settings:', e);
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        }
    }
};

lbUtil.capWontEnd = function () {
    let inGamePlayersArr = Object.values(lbUtil.inGamePlayers);
    // Only 1 player in game, game never ends
    if (inGamePlayersArr.length == 1) {
        return true;
    }
    
    // All player on same team
    let team = inGamePlayersArr[0];
    for (let i = 1; i < inGamePlayersArr.length; i++) {
        // If player not on same team or in FFA
        if (inGamePlayersArr[i] != team || inGamePlayersArr[i] == 1) {
            return false;
        }
    }
    
    return true;
};

lbUtil.resetCapzoneOutlines = function () {
    for(let body of lbUtil.bonkRenderer.roundGraphics.bodyGraphics) {
        if(!body) continue;
        for(let shape of body.shapes) {
            if(!shape || !shape.capZone) continue;
            if(shape.graphicTexture) {
                shape.graphicTexture.tint = 0xffffff;
            }
            else if(shape.graphic) {
                shape.graphic.tint = 0xffffff;
            }
        }
    }
}

// Create the mod window using BonkHUD
lbUtil.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);

    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
};

lbUtil.setWindowContent = function () {
    let windowHTML = document.createElement("div");
    windowHTML.id = lbUtil.windowConfigs.windowId; // Unique ID for scoping
    windowHTML.classList.add("bonkhud-background-color");
    
    // Helper function to create a setting toggle
    function createSettingToggle(settingKey, settingLabel) {
        let settingDiv = document.createElement("div");
        settingDiv.className = "setting-item bonkhud-border-color"; // Apply border color

        let settingName = document.createElement("span");
        settingName.className = "setting-name bonkhud-text-color"; // Apply text color
        settingName.textContent = settingLabel;

        // Create the checkbox input
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${settingKey}Checkbox`;
        checkbox.checked = this.settings[settingKey];

        // Create the label for the checkbox (toggle switch)
        let label = document.createElement("label");
        label.htmlFor = `${settingKey}Checkbox`;
        label.className = "lbUtilToggle bonkhud-button-color"; // Apply button color

        // Event listener to update the setting
        checkbox.addEventListener("change", () => {
            this.settings[settingKey] = checkbox.checked;
            // Save settings
            this.saveSettings();
        });

        // Create a container for the toggle switch
        let toggleContainer = document.createElement("div");
        toggleContainer.style.display = "flex";
        toggleContainer.style.alignItems = "center";

        toggleContainer.appendChild(checkbox);
        toggleContainer.appendChild(label);

        settingDiv.appendChild(settingName);
        settingDiv.appendChild(toggleContainer);

        windowHTML.appendChild(settingDiv);
    }
    
    // Create the toggles for all settings
    createSettingToggle.call(this, "smartCapZone", "Smart Cap Zone");
    createSettingToggle.call(this, "keepOutline", "Keep Cap Zone Outline");
    createSettingToggle.call(this, "resetVTOLAngleOnDeath", "Reset VTOL Angle On Death(Desync warning)");

    // Set the windowContent to the container
    this.windowConfigs.windowContent = windowHTML;

    // Store a reference to the window content element if needed
    this.windowContentElement = windowHTML;
};

// Add styles for the toggle switch
lbUtil.addStyles = function() {
    const css = `
    /* Scoped Styles for LBUtil Mod */
    #lbUtil_window {
        font-family: Poppins;
        padding: 10px;
    }
    #lbUtil_window .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid;
    }
    #lbUtil_window .setting-item:last-child {
        border-bottom: none;
    }
    #lbUtil_window .setting-name {
        flex-grow: 1;
        font-size: 16px;
    }
    #lbUtil_window .lbUtilToggle {
        position: relative;
        width: 40px;
        height: 20px;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.2s;
        background-color: #ccc; /* Default background color */
    }
    #lbUtil_window .lbUtilToggle::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        left: 1px;
        top: 1px;
        background-color: #fff;
        border-radius: 18px;
        transition: transform 0.2s;
    }
    #lbUtil_window input[type="checkbox"]:checked + .lbUtilToggle::before {
        transform: translateX(20px);
    }
    #lbUtil_window input[type="checkbox"]:checked + .lbUtilToggle {
        background-color: #4cd137; /* Background when checked */
    }
    #lbUtil_window input[type="checkbox"] {
        display: none;
    }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
};

// Injector function to inject code into the game code
lbUtil.injector = function (src) {
    let newSrc = src;
    
    //! Inject capZoneEvent fire
    let orgCode = `K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];`;
    let newCode = `
        K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];
        
        try {
            // Initialize
            let inputState = z0M[0][0];
            let currentFrame = inputState.rl;
            let playerID = K$h[0][0].m_userData.arrayID;
            let capID = K$h[1];
            
            if (window.lbUtil.settings.smartCapZone && window.lbUtil.capWontEnd()) {
                if (playerID != window.bonkAPI.getMyID()) {
                    console.debug("Supress capZoneEvent");
                    return;
                }
            }
            
        } catch(err) {
            console.error(err);
        }
    `;

    newSrc = newSrc.replace(orgCode, newCode);
    
    //! Inject stepEvent fire
    orgCode = `return z0M[720];`;
    newCode = `
    
        let outputState = z0M[720];
        // console.info("outputState", outputState);
        
        try {
            if (window.lbUtil.settings.smartCapZone) {
                // For each death, check who dead this frame
                outputState.discDeaths.forEach((death) => {
                    if (death.f == 0 && death.i == window.bonkAPI.getMyID()) { // Dead this frame and me
                        console.debug("I dead this frame");
                        
                        // Unfill all cap zones
                        outputState.capZones.forEach((capZone) => {
                            capZone.p = 0;
                            capZone.f = -1;
                            capZone.o = -1;
                            capZone.ot = -1;
                        });
                        
                        // Reset capzone outlines
                        if (!window.lbUtil.settings.keepOutline) {
                            window.lbUtil.resetCapzoneOutlines();
                        }
                    }
                });
            }
                
            if (window.lbUtil.settings.resetVTOLAngleOnDeath) {
                if (outputState.discDeaths) {
                    outputState.discDeaths.forEach((death) => {
                        if (death.f == 0) { // Dead this frame
                            let disc = outputState.discs[death.i];
                            
                            if (disc) {
                                // Reset VTOL angle
                                disc.a = 0;
                                disc.av = 0;
                            }
                        }
                    });
                }
            }
        } catch(err) {
            console.error(err);
        }
        
        return z0M[720];`;

    newSrc = newSrc.replace(orgCode, newCode);
    
    //! Inject Renderer reference
    orgCode = `if(S6e.dontInterpolate == true){`;
    newCode = `
        window.lbUtil.bonkRenderer = this;
        
        if(S6e.dontInterpolate == true){`;

    newSrc = newSrc.replace(orgCode, newCode);
    
    return newSrc;
};

// Initialize the mod (run when document is ready)
lbUtil.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    // Load settings from localStorage
    this.loadSettings();
    
    this.setWindowContent();
    this.createWindow();
    
    // Add custom styles
    this.addStyles();
    
    bonkAPI.addEventListener("gameStart", (e) => {
        try {
            let players = e.mapData.discs;
            lbUtil.inGamePlayers = {};
            
            if (players != null) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i] != null) {
                        // id : team
                        lbUtil.inGamePlayers[i] = players[i].team;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
    
    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to handle document readiness and initialize the mod
lbUtil.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMod();
        });
    }
};

// Compatibility with Excigma's code injector userscript
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        return lbUtil.injector(bonkCode);
    } catch (error) {
        throw error;
    }
});

console.log("lbUtil injector loaded");

// Call the function to check document readiness and initialize the mod
lbUtil.onDocumentReady();
