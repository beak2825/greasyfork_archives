// ==UserScript==
// @name         SoundBoard
// @version      1.4.0
// @description  Play sounds when specific chat messages are received
// @author       FeiFei
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1366475
// @downloadURL https://update.greasyfork.org/scripts/510085/SoundBoard.user.js
// @updateURL https://update.greasyfork.org/scripts/510085/SoundBoard.meta.js
// ==/UserScript==

"use strict";

let soundBoard = {};

soundBoard.windowConfigs = {
    windowName: "SoundBoard",
    windowId: "soundBoard_window",
    modVersion: "1.4.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
    settingsContent: null,
};

// Initialize global mute state
soundBoard.globalMute = false;
soundBoard.modIndex = null;
soundBoard.windowContentElement = null;
soundBoard.settingsContentElement = null;

// Define the sounds and their corresponding messages and audio URLs
soundBoard.sounds = [
    {
        name: "a",
        triggerMessage: "a",
        audioUrl: "https://www.myinstants.com/media/sounds/gawr-gura-a.mp3",
        enabled: true, // default enabled
    },
    // *Add more sounds here if needed
];

soundBoard.setWindowContent = function () {
    let windowHTML = document.createElement("div");
    // !Maybe dont need this
    windowHTML.id = soundBoard.windowConfigs.windowId; // Unique ID for scoping
    windowHTML.classList.add("bonkhud-background-color");
    
    // Create the global mute toggle button
    let muteButton = document.createElement("button");
    muteButton.id = "muteButton";
    muteButton.textContent = this.globalMute ? "🔇" : "🔊";
    muteButton.title = this.globalMute ? "Unmute" : "Mute";
    muteButton.classList.add("bonkhud-text-color"); // Apply text color
    muteButton.addEventListener("click", () => {
        this.globalMute = !this.globalMute;
        muteButton.textContent = this.globalMute ? "🔇" : "🔊";
        muteButton.title = this.globalMute ? "Unmute" : "Mute";
        // Save the global mute setting
        this.saveSettings();
    });
    windowHTML.appendChild(muteButton);

    // Create the list of sounds
    let soundList = document.createElement("div");
    soundList.id = "soundList";

    this.sounds.forEach((sound, index) => {
        let soundDiv = document.createElement("div");
        soundDiv.className = "sound-item bonkhud-border-color"; // Apply border color

        let soundName = document.createElement("span");
        soundName.className = "sound-name bonkhud-text-color"; // Apply text color
        soundName.textContent = sound.name;
        soundName.title = sound.triggerMessage;

        // Create the checkbox input
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox_${index}`;
        checkbox.checked = sound.enabled;

        // Create the label for the checkbox
        let label = document.createElement("label");
        label.htmlFor = `checkbox_${index}`;
        label.className = "soundBoardToggle bonkhud-button-color"; // Apply button color

        // Event listener to update the sound enabled state
        checkbox.addEventListener("change", () => {
            sound.enabled = checkbox.checked;
            // Save the settings
            this.saveSettings();
        });

        // Create a container for the toggle switch
        let toggleContainer = document.createElement("div");
        toggleContainer.style.display = "flex";
        toggleContainer.style.alignItems = "center";

        toggleContainer.appendChild(checkbox);
        toggleContainer.appendChild(label);

        soundDiv.appendChild(soundName);
        soundDiv.appendChild(toggleContainer);

        soundList.appendChild(soundDiv);
    });

    windowHTML.appendChild(soundList);

    // Add to windowContent
    this.windowConfigs.windowContent = windowHTML;

    // Store a reference to the window content element
    this.windowContentElement = windowHTML;
};

soundBoard.setSettingsContent = function () {
    let settingsHTML = document.createElement("div");
    settingsHTML.className = "settings-container bonkhud-background-color"; // Apply background color
    
    // Create the list of sounds with delete buttons
    let soundList = document.createElement("div");
    soundList.id = "settingsSoundList";

    this.sounds.forEach((sound, index) => {
        let soundDiv = document.createElement("div");
        soundDiv.className = "settings-sound-item bonkhud-border-color"; // Apply border color

        let soundInfo = document.createElement("span");
        soundInfo.className = "settings-sound-info bonkhud-text-color"; // Apply text color
        soundInfo.textContent = `${sound.name} | Trigger: "${sound.triggerMessage}" | URL: ${sound.audioUrl}`;

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-button bonkhud-button-color"; // Apply button color
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("mouseover", () => {
            deleteButton.classList.add("bonkhud-button-color-hover");
        });
        deleteButton.addEventListener("mouseout", () => {
            deleteButton.classList.remove("bonkhud-button-color-hover");
        });
        deleteButton.addEventListener("click", () => {
            // Remove the sound from the list
            this.sounds.splice(index, 1);
            // Save settings
            this.saveSettings();
            // Update the settings content
            this.updateSettingsContent();
            // Update the window content
            this.updateWindowContent();
        });

        soundDiv.appendChild(soundInfo);
        soundDiv.appendChild(deleteButton);

        soundList.appendChild(soundDiv);
    });

    settingsHTML.appendChild(soundList);

    // Create GUI for importing new sounds
    let importDiv = document.createElement("div");
    importDiv.className = "import-div";
    importDiv.style.marginTop = "10px";

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Sound Name";
    nameInput.classList.add("bonkhud-text-color", "bonkhud-background-color"); // Apply text and background color

    let triggerInput = document.createElement("input");
    triggerInput.type = "text";
    triggerInput.placeholder = "Trigger Message";
    triggerInput.classList.add("bonkhud-text-color", "bonkhud-background-color");

    let urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.placeholder = "Audio URL";
    urlInput.classList.add("bonkhud-text-color", "bonkhud-background-color");

    let addButton = document.createElement("button");
    addButton.className = "add-button bonkhud-button-color"; // Apply button color
    addButton.textContent = "Add Sound";
    addButton.addEventListener("click", () => {
        let name = nameInput.value.trim();
        let triggerMessage = triggerInput.value.trim();
        let audioUrl = urlInput.value.trim();

        if (name && triggerMessage && audioUrl) {
            this.sounds.push({
                name: name,
                triggerMessage: triggerMessage,
                audioUrl: audioUrl,
                enabled: true
            });
            // Save settings
            this.saveSettings();
            // Update the settings content
            this.updateSettingsContent();
            // Update the window content
            this.updateWindowContent();
            // Clear inputs
            nameInput.value = '';
            triggerInput.value = '';
            urlInput.value = '';
        } else {
            alert("Please fill in all fields.");
        }
    });

    importDiv.appendChild(nameInput);
    importDiv.appendChild(triggerInput);
    importDiv.appendChild(urlInput);
    importDiv.appendChild(addButton);

    settingsHTML.appendChild(importDiv);

    // Add to settingsContent
    this.windowConfigs.settingsContent = settingsHTML;

    // Store a reference to the settings content element
    this.settingsContentElement = settingsHTML;
};

// Create the mod window using BonkHUD
soundBoard.createWindow = function () {
    // Create the window using BonkHUD
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);
    this.modIndex = modIndex; // Store the mod index just in case
    
    // Load UI settings if available
    bonkHUD.loadUISetting(modIndex);
};

// Function to add custom styles
soundBoard.addStyles = function() {
    const css = `
    /* Scoped Styles for SoundBoard Mod */
    #soundBoard_window {
        font-family: Poppins;
        padding: 10px;
    }
    #soundBoard_window #muteButton {
        background-color: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        margin-bottom: 10px;
    }
    
    #soundBoard_window .sound-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid;
    }
    #soundBoard_window .sound-item:last-child {
        border-bottom: none;
    }
    #soundBoard_window .sound-name {
        flex-grow: 1;
        font-size: 16px;
    }
    
    #soundBoard_window .soundBoardToggle {
        position: relative;
        width: 40px;
        height: 20px;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    #soundBoard_window .soundBoardToggle::before {
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
    #soundBoard_window input[type="checkbox"]:checked + .soundBoardToggle::before {
        transform: translateX(20px);
    }
    #soundBoard_window input[type="checkbox"] {
        display: none;
    }
    
    /* Style the Settings Content */
    #soundBoardModContainer .settings-container {
        margin-top: 15px;
    }
    #soundBoardModContainer .settings-sound-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid;
    }
    #soundBoardModContainer .settings-sound-item:last-child {
        border-bottom: none;
    }
    #soundBoardModContainer .settings-sound-info {
        flex-grow: 1;
        font-size: 14px;
    }
        
    /* Style the Input Fields and Add Button */
    #soundBoardModContainer .import-div {
        margin-top: 15px;
    }
    #soundBoardModContainer .import-div input[type="text"] {
        width: calc(33% - 10px);
        padding: 5px;
        margin-right: 5px;
        border-radius: 4px;
    }
    #soundBoardModContainer .import-div input[type="text"]:last-of-type {
        margin-right: 0;
    }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
};

soundBoard.updateWindowContent = function () {
    let soundList = this.windowContentElement.querySelector('#soundList');
    if (soundList) {
        // Clear existing content
        soundList.innerHTML = '';

        // Re-create the list of sounds
        this.sounds.forEach((sound, index) => {
            let soundDiv = document.createElement("div");
            soundDiv.className = "sound-item bonkhud-border-color"; // Apply border color

            let soundName = document.createElement("span");
            soundName.className = "sound-name bonkhud-text-color"; // Apply text color
            soundName.textContent = sound.name;
            soundName.title = sound.triggerMessage;

            // Create the checkbox input
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox_${index}`;
            checkbox.checked = sound.enabled;

            // Create the label for the checkbox
            let label = document.createElement("label");
            label.htmlFor = `checkbox_${index}`;
            label.className = "soundBoardToggle bonkhud-button-color"; // Apply button color

            // Event listener to update the sound enabled state
            checkbox.addEventListener("change", () => {
                sound.enabled = checkbox.checked;
                // Save the settings
                this.saveSettings();
            });

            // Create a container for the toggle switch
            let toggleContainer = document.createElement("div");
            toggleContainer.style.display = "flex";
            toggleContainer.style.alignItems = "center";

            toggleContainer.appendChild(checkbox);
            toggleContainer.appendChild(label);

            soundDiv.appendChild(soundName);
            soundDiv.appendChild(toggleContainer);

            soundList.appendChild(soundDiv);
        });
        
        bonkHUD.updateStyleSettings();
    }
};

soundBoard.updateSettingsContent = function () {
    let soundList = this.settingsContentElement.querySelector('#settingsSoundList');
    if (soundList) {
        // Clear existing content
        soundList.innerHTML = '';

        // Re-create the list of sounds with delete buttons
        this.sounds.forEach((sound, index) => {
            let soundDiv = document.createElement("div");
            soundDiv.className = "settings-sound-item bonkhud-border-color"; // Apply border color

            let soundInfo = document.createElement("span");
            soundInfo.className = "settings-sound-info bonkhud-text-color"; // Apply text color
            soundInfo.textContent = `${sound.name} | Trigger: "${sound.triggerMessage}" | URL: ${sound.audioUrl}`;

            let deleteButton = document.createElement("button");
            deleteButton.className = "delete-button bonkhud-button-color"; // Apply button color
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("mouseover", () => {
                deleteButton.classList.add("bonkhud-button-color-hover");
            });
            deleteButton.addEventListener("mouseout", () => {
                deleteButton.classList.remove("bonkhud-button-color-hover");
            });
            deleteButton.addEventListener("click", () => {
                // Remove the sound from the list
                this.sounds.splice(index, 1);
                // Save settings
                this.saveSettings();
                // Update the settings content
                this.updateSettingsContent();
                // Update the window content
                this.updateWindowContent();
            });

            soundDiv.appendChild(soundInfo);
            soundDiv.appendChild(deleteButton);

            soundList.appendChild(soundDiv);
        });
        
        bonkHUD.updateStyleSettings();
    }
};

// Function to save settings to localStorage
soundBoard.saveSettings = function () {
    let settings = {
        globalMute: this.globalMute,
        sounds: this.sounds,
    };
    localStorage.setItem('bonkHUD_Mod_Setting_SoundBoard', JSON.stringify(settings));
};

// Function to load settings from localStorage
soundBoard.loadSettings = function () {
    let savedSettings = JSON.parse(localStorage.getItem('bonkHUD_Mod_Setting_SoundBoard') || '{}');
    if (typeof savedSettings.globalMute !== "undefined") {
        this.globalMute = savedSettings.globalMute;
    }
    if (Array.isArray(savedSettings.sounds)) {
        this.sounds = savedSettings.sounds;
    }
};

// Initialize the mod (run when document is ready)
soundBoard.initMod = function () {
    // Ensure BonkHUD is available
    if (!window.bonkHUD) {
        console.error("BonkHUD is not loaded. Please make sure BonkHUD is installed.");
        return;
    }
    
    this.loadSettings();
    this.setWindowContent();
    this.setSettingsContent();
    this.createWindow();
    this.addStyles();

    // Add event listener for chat messages
    bonkAPI.addEventListener("chatIn", (e) => {
        if (this.globalMute) return;
        
        this.sounds.forEach((sound) => {
            if (sound.enabled && e.message === sound.triggerMessage) {
                this.playSound(sound.audioUrl);
            }
        });
    });

    console.log(this.windowConfigs.windowName + " initialized");
};

// Function to play audio
soundBoard.playSound = function (url) {
    let audio = new Audio(url);
    audio.play();
};

// Function to handle document readiness and initialize the mod
soundBoard.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMod();
        });
    }
};

// Call the function to check document readiness and initialize the mod
soundBoard.onDocumentReady();
