// ==UserScript==
// @name         Opacity
// @version      2.3.0
// @description  A mod to toggle visibility settings in Bonk.io using BonkHUD
// @author       FeiFei + Blu
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1366475
// @downloadURL https://update.greasyfork.org/scripts/510088/Opacity.user.js
// @updateURL https://update.greasyfork.org/scripts/510088/Opacity.meta.js
// ==/UserScript==

"use strict";

window.opacity = {};

opacity.windowConfigs = {
    windowName: "Opacity",
    windowId: "opacity_window",
    modVersion: "2.3.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
};

// Initialize default settings
opacity.defaultSettings = {
    players: {
        skins: true,
        visible: true,
        alpha: 1,
        usernames: {
            visible: true,
            alpha: 1,
        },
        teamOutline: {
            visible: true,
            alpha: 1,
        },
    },
    chat: {
        visible: true,
        alpha: 1,
    },
};

// Initialize settings
opacity.settings = JSON.parse(JSON.stringify(opacity.defaultSettings));

// Function to save settings to localStorage
opacity.saveSettings = function () {
    localStorage.setItem('opacitySettings', JSON.stringify(this.settings));
};

// Function to load settings from localStorage
opacity.loadSettings = function () {
    const savedSettings = localStorage.getItem('opacitySettings');
    if (savedSettings) {
        try {
            this.settings = JSON.parse(savedSettings);
        } catch (e) {
            console.error('Failed to parse saved settings:', e);
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        }
    }
};

// Create the mod window using BonkHUD
opacity.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);

    let opacityWindow = bonkHUD.getElementByIndex(modIndex);

    opacityWindow.style.padding = "0"; // Example: set padding
    opacityWindow.style.width = "100%"; // Example: set width to match padding
    opacityWindow.style.height = "calc(100% - 32px)"; // Example: set height to match padding and header

    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
};

opacity.setWindowContent = function () {
    // Get current settings values
    const playersSkinsChecked = this.settings.players.skins ? "checked" : "";
    const playersVisibleChecked = this.settings.players.visible ? "checked" : "";
    const playersAlphaValue = this.settings.players.alpha * 100;
    const usernamesVisibleChecked = this.settings.players.usernames.visible ? "checked" : "";
    const usernamesAlphaValue = this.settings.players.usernames.alpha * 100;
    const teamOutlineVisibleChecked = this.settings.players.teamOutline.visible ? "checked" : "";
    const teamOutlineAlphaValue = this.settings.players.teamOutline.alpha * 100;
    const chatVisibleChecked = this.settings.chat.visible ? "checked" : "";
    const chatAlphaValue = this.settings.chat.alpha * 100;

    let windowHTML = document.createElement("div");

    let playersButtonDiv = document.createElement("div");
    playersButtonDiv.classList.add("bonkhud-header-color");
    playersButtonDiv.classList.add("bonkhud-title-color");
    playersButtonDiv.style.borderBottomLeftRadius = "8px";
    playersButtonDiv.style.borderBottomRightRadius = "8px";
    playersButtonDiv.style.padding = "5px";

    let playersLabel = document.createElement("span");
    playersLabel.textContent = "Players";

    playersButtonDiv.appendChild(playersLabel);

    let playersDropDiv = bonkHUD.generateSection();
    playersDropDiv.style.paddingTop = "2px";

    //----------------------------------------------

    let playersSkinsDiv = document.createElement("div");
    playersSkinsDiv.style.marginTop = "5px";

    let playersSkinsLabel = document.createElement("label");
    playersSkinsLabel.classList.add("bonkhud-text-color");
    playersSkinsLabel.classList.add("bonkhud-settings-label");
    playersSkinsLabel.style.marginRight = "5px";
    playersSkinsLabel.textContent = "Skins";

    let playersSkinsCheckbox = document.createElement("input");
    playersSkinsCheckbox.type = "checkbox";
    playersSkinsCheckbox.checked = playersSkinsChecked;
    playersSkinsCheckbox.onchange = (e) => {
        window.opacity.settings.players.skins = e.target.checked;
        window.opacity.saveSettings();
    };

    playersSkinsDiv.appendChild(playersSkinsLabel);
    playersSkinsDiv.appendChild(playersSkinsCheckbox);

    //---------------------------------------------

    let playersVisibleDiv = document.createElement("div");
    playersVisibleDiv.style.marginTop = "5px";

    let playersVisibleLabel = document.createElement("label");
    playersVisibleLabel.classList.add("bonkhud-text-color");
    playersVisibleLabel.classList.add("bonkhud-settings-label");
    playersVisibleLabel.style.marginRight = "5px";
    playersVisibleLabel.textContent = "Visible";

    let playersVisibleCheckbox = document.createElement("input");
    playersVisibleCheckbox.type = "checkbox";
    playersVisibleCheckbox.checked = playersVisibleChecked;
    playersVisibleCheckbox.onchange = (e) => {
        window.opacity.settings.players.visible = e.target.checked;
        window.opacity.saveSettings();
    };

    playersVisibleDiv.appendChild(playersVisibleLabel);
    playersVisibleDiv.appendChild(playersVisibleCheckbox);

    //-------------------------------------------------
    
    let playersAlphaDiv = document.createElement("div");
    playersAlphaDiv.style.marginTop = "5px";
    playersAlphaDiv.style.display = "flex";
    playersAlphaDiv.style.alignContent = "center";

    let playersAlphaLabel = document.createElement("label");
    playersAlphaLabel.classList.add("bonkhud-settings-label");
    playersAlphaLabel.textContent = "Opacity";

    let playersAlphaSlider = document.createElement("input");
    playersAlphaSlider.type = "range"; // Slider type for range selection
    playersAlphaSlider.min = "0"; // Minimum opacity value
    playersAlphaSlider.max = "100"; // Maximum opacity value (fully opaque)
    playersAlphaSlider.value = playersAlphaValue; // Default value set to fully opaque
    playersAlphaSlider.style.minWidth = "0";
    playersAlphaSlider.style.flexGrow = "1";
    playersAlphaSlider.style.marginLeft = "0.5rem";
    playersAlphaSlider.oninput = (e) => {
        window.opacity.settings.players.alpha = e.target.value/100;
        window.opacity.saveSettings();
    };

    playersAlphaDiv.appendChild(playersAlphaLabel);
    playersAlphaDiv.appendChild(playersAlphaSlider);

    playersDropDiv.appendChild(playersSkinsDiv);
    playersDropDiv.appendChild(playersVisibleDiv);
    playersDropDiv.appendChild(playersAlphaDiv);

    let usernamesButtonDiv = document.createElement("div");
    usernamesButtonDiv.classList.add("bonkhud-header-color");
    usernamesButtonDiv.classList.add("bonkhud-title-color");
    usernamesButtonDiv.style.borderBottomLeftRadius = "8px";
    usernamesButtonDiv.style.borderBottomRightRadius = "8px";
    usernamesButtonDiv.style.padding = "5px";

    let usernamesLabel = document.createElement("span");
    usernamesLabel.textContent = "Usernames";

    usernamesButtonDiv.appendChild(usernamesLabel);

    let usernamesDropDiv = bonkHUD.generateSection();
    usernamesDropDiv.style.paddingTop = "2px";

    //----------------------------------------------

    let usernamesVisDiv = document.createElement("div");
    usernamesVisDiv.style.marginTop = "5px";

    let usernamesVisLabel = document.createElement("label");
    usernamesVisLabel.classList.add("bonkhud-text-color");
    usernamesVisLabel.classList.add("bonkhud-settings-label");
    usernamesVisLabel.style.marginRight = "5px";
    usernamesVisLabel.textContent = "Visible";

    let usernamesVisCheckbox = document.createElement("input");
    usernamesVisCheckbox.type = "checkbox";
    usernamesVisCheckbox.checked = usernamesVisibleChecked;
    usernamesVisCheckbox.onchange = (e) => {
        window.opacity.settings.players.usernames.visible = e.target.checked;
        window.opacity.saveSettings();
    };

    usernamesVisDiv.appendChild(usernamesVisLabel);
    usernamesVisDiv.appendChild(usernamesVisCheckbox);

    //-------------------------------------------------
    
    let usernamesAlphaDiv = document.createElement("div");
    usernamesAlphaDiv.style.marginTop = "5px";
    usernamesAlphaDiv.style.display = "flex";
    usernamesAlphaDiv.style.alignContent = "center";

    let usernamesAlphaLabel = document.createElement("label");
    usernamesAlphaLabel.classList.add("bonkhud-settings-label");
    usernamesAlphaLabel.textContent = "Opacity";

    let usernamesAlphaSlider = document.createElement("input");
    usernamesAlphaSlider.type = "range"; // Slider type for range selection
    usernamesAlphaSlider.min = "0"; // Minimum opacity value
    usernamesAlphaSlider.max = "100"; // Maximum opacity value (fully opaque)
    usernamesAlphaSlider.value = usernamesAlphaValue; // Default value set to fully opaque
    usernamesAlphaSlider.style.minWidth = "0";
    usernamesAlphaSlider.style.flexGrow = "1";
    usernamesAlphaSlider.style.marginLeft = "0.5rem";
    usernamesAlphaSlider.oninput = (e) => {
        window.opacity.settings.players.usernames.alpha = e.target.value/100;
        window.opacity.saveSettings();
    };

    usernamesAlphaDiv.appendChild(usernamesAlphaLabel);
    usernamesAlphaDiv.appendChild(usernamesAlphaSlider);

    usernamesDropDiv.appendChild(usernamesVisDiv);
    usernamesDropDiv.appendChild(usernamesAlphaDiv);

    //:::::::::::::::::::::::::::::::::::::::::::::::::

    let teamButtonDiv = document.createElement("div");
    teamButtonDiv.classList.add("bonkhud-header-color");
    teamButtonDiv.classList.add("bonkhud-title-color");
    teamButtonDiv.style.borderBottomLeftRadius = "8px";
    teamButtonDiv.style.borderBottomRightRadius = "8px";
    teamButtonDiv.style.padding = "5px";

    let teamLabel = document.createElement("span");
    teamLabel.textContent = "Team Outline";

    teamButtonDiv.appendChild(teamLabel);

    let teamDropDiv = bonkHUD.generateSection();
    teamDropDiv.style.paddingTop = "2px";

    //----------------------------------------------

    let teamVisDiv = document.createElement("div");
    teamVisDiv.style.marginTop = "5px";

    let teamVisLabel = document.createElement("label");
    teamVisLabel.classList.add("bonkhud-text-color");
    teamVisLabel.classList.add("bonkhud-settings-label");
    teamVisLabel.style.marginRight = "5px";
    teamVisLabel.textContent = "Visible";

    let teamVisCheckbox = document.createElement("input");
    teamVisCheckbox.type = "checkbox";
    teamVisCheckbox.checked = teamOutlineVisibleChecked;
    teamVisCheckbox.onchange = (e) => {
        window.opacity.settings.players.teamOutline.visible = e.target.checked;
        window.opacity.saveSettings();
    };

    teamVisDiv.appendChild(teamVisLabel);
    teamVisDiv.appendChild(teamVisCheckbox);

    //-------------------------------------------------
    
    let teamAlphaDiv = document.createElement("div");
    teamAlphaDiv.style.marginTop = "5px";
    teamAlphaDiv.style.display = "flex";
    teamAlphaDiv.style.alignContent = "center";

    let teamAlphaLabel = document.createElement("label");
    teamAlphaLabel.classList.add("bonkhud-settings-label");
    teamAlphaLabel.textContent = "Opacity";

    let teamAlphaSlider = document.createElement("input");
    teamAlphaSlider.type = "range"; // Slider type for range selection
    teamAlphaSlider.min = "0"; // Minimum opacity value
    teamAlphaSlider.max = "100"; // Maximum opacity value (fully opaque)
    teamAlphaSlider.value = teamOutlineAlphaValue; // Default value set to fully opaque
    teamAlphaSlider.style.minWidth = "0";
    teamAlphaSlider.style.flexGrow = "1";
    teamAlphaSlider.style.marginLeft = "0.5rem";
    teamAlphaSlider.oninput = (e) => {
        window.opacity.settings.players.teamOutline.alpha = e.target.value/100;
        window.opacity.saveSettings();
    };

    teamAlphaDiv.appendChild(teamAlphaLabel);
    teamAlphaDiv.appendChild(teamAlphaSlider);

    teamDropDiv.appendChild(teamVisDiv);
    teamDropDiv.appendChild(teamAlphaDiv);

    //:::::::::::::::::::::::::::::::::::::::::::::::::

    let chatButtonDiv = document.createElement("div");
    chatButtonDiv.classList.add("bonkhud-header-color");
    chatButtonDiv.classList.add("bonkhud-title-color");
    chatButtonDiv.style.borderBottomLeftRadius = "8px";
    chatButtonDiv.style.borderBottomRightRadius = "8px";
    chatButtonDiv.style.padding = "5px";

    let chatLabel = document.createElement("span");
    chatLabel.textContent = "Chat";

    chatButtonDiv.appendChild(chatLabel);

    let chatDropDiv = bonkHUD.generateSection();
    chatDropDiv.style.paddingTop = "2px";

    //----------------------------------------------

    let chatVisDiv = document.createElement("div");
    chatVisDiv.style.marginTop = "5px";

    let chatVisLabel = document.createElement("label");
    chatVisLabel.classList.add("bonkhud-text-color");
    chatVisLabel.classList.add("bonkhud-settings-label");
    chatVisLabel.style.marginRight = "5px";
    chatVisLabel.textContent = "Visible";

    let chatVisCheckbox = document.createElement("input");
    chatVisCheckbox.type = "checkbox";
    chatVisCheckbox.checked = chatVisibleChecked;
    chatVisCheckbox.onchange = (e) => {
        window.opacity.settings.chat.visible = e.target.checked;
        if (window.opacity.chatWindow) { 
            window.opacity.chatWindow.style.opacity = window.opacity.settings.chat.visible ? 1 : 0;
        } 
        window.opacity.saveSettings();
    };

    chatVisDiv.appendChild(chatVisLabel);
    chatVisDiv.appendChild(chatVisCheckbox);

    //-------------------------------------------------
    
    let chatAlphaDiv = document.createElement("div");
    chatAlphaDiv.style.marginTop = "5px";
    chatAlphaDiv.style.display = "flex";
    chatAlphaDiv.style.alignContent = "center";

    let chatAlphaLabel = document.createElement("label");
    chatAlphaLabel.classList.add("bonkhud-settings-label");
    chatAlphaLabel.textContent = "Opacity";

    let chatAlphaSlider = document.createElement("input");
    chatAlphaSlider.type = "range"; // Slider type for range selection
    chatAlphaSlider.min = "0"; // Minimum opacity value
    chatAlphaSlider.max = "100"; // Maximum opacity value (fully opaque)
    chatAlphaSlider.value = chatAlphaValue; // Default value set to fully opaque
    chatAlphaSlider.style.minWidth = "0";
    chatAlphaSlider.style.flexGrow = "1";
    chatAlphaSlider.style.marginLeft = "0.5rem";
    chatAlphaSlider.oninput = (e) => {
        window.opacity.settings.chat.alpha = e.target.value/100;
        if (window.opacity.chatWindow) {
            window.opacity.chatWindow.style.opacity = window.opacity.settings.chat.alpha;
        }
        window.opacity.saveSettings();
    };

    chatAlphaDiv.appendChild(chatAlphaLabel);
    chatAlphaDiv.appendChild(chatAlphaSlider);

    chatDropDiv.appendChild(chatVisDiv);
    chatDropDiv.appendChild(chatAlphaDiv);

    windowHTML.appendChild(playersButtonDiv);
    windowHTML.appendChild(playersDropDiv);
    windowHTML.appendChild(usernamesButtonDiv);
    windowHTML.appendChild(usernamesDropDiv);
    windowHTML.appendChild(teamButtonDiv);
    windowHTML.appendChild(teamDropDiv);
    windowHTML.appendChild(chatButtonDiv);
    windowHTML.appendChild(chatDropDiv);

    // Set the windowContent to the container
    this.windowConfigs.windowContent = windowHTML;
};

// Injector function to inject code into the game code
opacity.injector = function (src) {
    let newSrc = src;

    // Control player and username visibility
    let discID = newSrc.match(/this\.discGraphics\[([\w$]{2,4})\]=null;\}/)[1];
    newSrc = newSrc.replace(
        `this.discGraphics[${discID}]=null;}`,
        `this.discGraphics[${discID}]=null;
        } else {
            if(this.discGraphics[${discID}]){
                if(this.discGraphics[${discID}].sfwSkin){
                    // control skin visibility
                    this.discGraphics[${discID}].playerGraphic.alpha = window.opacity.settings.players.skins ? 1 : 0;
                    this.discGraphics[${discID}].sfwSkin.visible = !window.opacity.settings.players.skins;
                // gotta wait for avatar to be created
                } else if(this.discGraphics[${discID}].avatar?.bc != undefined){
                    // create sfwSkin
                    this.discGraphics[${discID}].sfwSkin = new PIXI.Graphics;
                    this.discGraphics[${discID}].sfwSkin.beginFill(this.discGraphics[${discID}].teamify(this.discGraphics[${discID}].avatar.bc, this.discGraphics[${discID}].team));
                    this.discGraphics[${discID}].sfwSkin.drawCircle(0,0,this.discGraphics[${discID}].radius);
                    this.discGraphics[${discID}].sfwSkin.endFill();
                    this.discGraphics[${discID}].container.addChildAt(this.discGraphics[${discID}].sfwSkin, 3);
                }

                // everything else
                this.discGraphics[${discID}].nameText.alpha = window.opacity.settings.players.usernames.visible ? window.opacity.settings.players.usernames.alpha : 0;
                
                // Team outline
                if (this.discGraphics[${discID}].teamOutline != null) {
                    this.discGraphics[${discID}].teamOutline.visible = window.opacity.settings.players.teamOutline.visible;
                    this.discGraphics[${discID}].teamOutline.alpha = window.opacity.settings.players.teamOutline.alpha;
                }
                
                if(this.discGraphics[${discID}].playerID != this.localPlayerID){
                    this.discGraphics[${discID}].container.visible = window.opacity.settings.players.visible;
                    this.discGraphics[${discID}].container.alpha = window.opacity.settings.players.alpha;
                }
            }
        }`
    );

    // Get chat window when building renderer
    let buildRendererFunction = newSrc.match(
        /(build\([\w$]{2,4},[\w$]{2,4}\)) \{.{30,150}=new [\w$]{2,4}\[[0-9]+\]\(/
    )[1];

    newSrc = newSrc.replace(
        `${buildRendererFunction} {`,
        `${buildRendererFunction} {
        window.opacity.chatWindow = document.querySelector('#ingamechatbox');`
    );

    if (src === newSrc) throw "Injection failed!";
    return newSrc;
};

// Initialize the mod (run when document is ready)
opacity.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }

    // Load settings from localStorage
    this.loadSettings();
    
    this.setWindowContent();
    this.createWindow();

    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to handle document readiness and initialize the mod
opacity.onDocumentReady = function () {
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
        return opacity.injector(bonkCode);
    } catch (error) {
        throw error;
    }
});

console.log("Opacity injector loaded");

// Call the function to check document readiness and initialize the mod
opacity.onDocumentReady();