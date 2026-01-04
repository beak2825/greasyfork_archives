// ==UserScript==
// @name         KeyTable
// @version      1.4.2
// @description  Add a customizable key table overlay to the bonk.io game
// @author       BZD + Clarifi
// @namespace    http://tampermonkey.net/
// @license      MIT
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510087/KeyTable.user.js
// @updateURL https://update.greasyfork.org/scripts/510087/KeyTable.meta.js
// ==/UserScript==

// ! Compitable with Bonk Version 49
window.KeyTable = {}; // Namespace for encapsulating the UI functions and variables

// Use 'strict' mode for safer code by managing silent errors
'use strict';

KeyTable.windowConfigs = {
    windowName: "KeyTable",
    windowId: "keytable_window",
    modVersion: "1.4.2",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
};

// Variable to track the most recent key input by the user
KeyTable.latestInput = 0;
KeyTable.currentPlayerID = 0;
KeyTable.frameCount = [0, 0, 0, 0, 0, 0];
// !could make these arrays but better visibly (specific naming)
KeyTable.keys = {};
KeyTable.keyFilter = {
    'left': 1, 'right': 2, 'up': 4, 'down': 8, 'heavy': 16, 'special': 32
};

// Refresh the styles for all keys on the UI
KeyTable.updateKeyStyles = () => {
    Object.entries(KeyTable.keys).forEach(([dir, element]) => {
        // Change the key's background color if it's currently pressed
        element.style.backgroundColor = KeyTable.latestInput & KeyTable.keyFilter[dir] ? bonkHUD.styleHold.buttonColorHover.color : bonkHUD.styleHold.buttonColor.color;
    });
};

// Reset the background color of all keys to the default state
KeyTable.keyTableReset = () => {
    Object.entries(KeyTable.keys).forEach(([dir, element]) => {
        element.style.backgroundColor = bonkHUD.styleHold.buttonColor.color;
    });
};
 
// Event listener function to change the player selected in the player selector
KeyTable.select_player = () => {
    let player_selector = document.getElementById("player_selector");
    let player_id = player_selector.options[player_selector.selectedIndex].value;
    KeyTable.currentPlayerID = player_id;
    KeyTable.updateKeyStyles();
    //console.log("current Player ID: " + player_id);
};

// Create a new option in the player selector
KeyTable.create_option = (userID) => {
    //console.log("userID:" + userID);
    let playerName = bonkAPI.getPlayerNameByID(userID);
    let player_selector = document.getElementById("player_selector");
    let newOption = document.createElement("option");
    newOption.textContent = playerName;
    newOption.value = userID;
    newOption.id = "selector_option_" + userID;
    player_selector.appendChild(newOption);
    KeyTable.updateKeyStyles();
    //console.log("selector_option_" + userID + " added to player_selector");
};

// Remove an option from the player selector
KeyTable.remove_option = (userID) => {
    let player_selector = document.getElementById("player_selector");
    let option = document.getElementById("selector_option_" + userID);
    player_selector.removeChild(option);
};

// Reset the player selector to the default state
KeyTable.reset_selector = () => {
    // Remove all options except the default one
    let player_selector = document.getElementById("player_selector");
    Array.from(player_selector.options).forEach((option) => {
        if (option.id !== "selector_option_user") {
            player_selector.removeChild(option);
        }
        // Reset the current player ID
        KeyTable.currentPlayerID = bonkAPI.getMyID();
        // Set the selector to the first option as default
        player_selector.selectedIndex = bonkAPI.getMyID();
    });
};

// Update the player list in the player selector
KeyTable.update_players = () => {
    // Get the list of players and the current player ID
    let playerList = bonkAPI.getPlayerList();
    let myID = bonkAPI.getMyID();
    // Reset the player selector
    KeyTable.reset_selector();
    // Add all player to the player selector
    playerList.forEach((player, id) => {
        if (player && id !== myID) {
            KeyTable.create_option(id);
        }
    });
};

// Process input data and invoke style updates
bonkAPI.addEventListener("gameInputs", (e) => {
    // console.log("gameInputs event received", e);
    if (e.userID == KeyTable.currentPlayerID) {
        // console.log("Updating latestInput for player", readingPlayerID, "with input", e.rawInput);
        KeyTable.latestInput = e.rawInput;
        KeyTable.updateKeyStyles();
    }
});

/*bonkAPI.addEventListener("stepEvent", (e) => {
    for(int i = 0; i < KeyTable.keys) {

    }
});*/

// Event listener for when a user joins the game
bonkAPI.addEventListener("userJoin", (e) => {
    //console.log("User join event received", e);
    //console.log("User ID", e.userID);
    // Add the player to the player selector
    KeyTable.create_option(e.userID);
});

// Event listener for when a user leaves the game
bonkAPI.addEventListener("userLeave", (e) => {
    //console.log("User Leave event received", e);
    //console.log("User ID", e.userID);
    // Remove the player from the player selector
    let playerName = bonkAPI.getPlayerNameByID(e.userID);
    let player_selector = document.getElementById("player_selector");
    // If the player is the current player, set the current player to 0 and reset the selector
    if (player_selector.options[player_selector.selectedIndex].value === playerName) {
        KeyTable.currentPlayerID = bonkAPI.getMyID();
        // Set the selector to the first option as default
        player_selector.selectedIndex = 0;
    }

    KeyTable.remove_option(e.userID);
});

// Event listener for when user(mod user) creates a room
bonkAPI.addEventListener("createRoom", (e) => {
    //console.log("create Room event received", e);
    //console.log("User ID", e);
    // Set the player name in the player selector to the current user
    let option = document.getElementById("selector_option_user");
    let playerName = bonkAPI.getPlayerNameByID(e.userID);
    option.textContent = playerName;
    option.value = e.userID;
    KeyTable.currentPlayerID = e.userID;
    // Reset the player selector to the default state
    KeyTable.reset_selector();
});

// Event listener for when user(mod user) joins a room
bonkAPI.addEventListener("joinRoom", (e) => {
    //console.log("on Join event received", e);
    //console.log("User ID", e.userID);
    // Set the player name in the player selector to the current user
    let option = document.getElementById("selector_option_user");
    let playerName = bonkAPI.getPlayerNameByID(bonkAPI.getMyID());
    option.textContent = playerName;
    option.value = bonkAPI.getMyID();
    KeyTable.currentPlayerID = bonkAPI.getMyID();
    // Update the player list in the player selector
    KeyTable.update_players();
});

// Main function to construct and add the key table UI to the DOM
const addKeyTable = () => {
    // Create the key table
    let keyTable = document.createElement("div");

    let keyHold = document.createElement("table");
    keyHold.style.flex = "1 1 auto";

    let tableBody = document.createElement("tbody");
    let topRow = document.createElement("tr");
    KeyTable.keys["special"] = document.createElement("td");
    KeyTable.keys["special"].classList.add("bonkhud-button-color");
    KeyTable.keys["special"].classList.add("bonkhud-text-color");
    KeyTable.keys["special"].style.width = "34%";
    KeyTable.keys["special"].style.textAlign = "center";
    KeyTable.keys["special"].textContent = "Special";

    KeyTable.keys["up"] = document.createElement("td");
    KeyTable.keys["up"].classList.add("bonkhud-button-color");
    KeyTable.keys["up"].classList.add("bonkhud-text-color");
    KeyTable.keys["up"].style.width = "34%";
    KeyTable.keys["up"].style.textAlign = "center";
    KeyTable.keys["up"].textContent = "↑";

    KeyTable.keys["heavy"] = document.createElement("td");
    KeyTable.keys["heavy"].classList.add("bonkhud-button-color");
    KeyTable.keys["heavy"].classList.add("bonkhud-text-color");
    KeyTable.keys["heavy"].style.width = "34%";
    KeyTable.keys["heavy"].style.textAlign = "center";
    KeyTable.keys["heavy"].textContent = "Heavy";

    let botRow = document.createElement("tr");
    KeyTable.keys["left"] = document.createElement("td");
    KeyTable.keys["left"].classList.add("bonkhud-button-color");
    KeyTable.keys["left"].classList.add("bonkhud-text-color");
    KeyTable.keys["left"].style.width = "34%";
    KeyTable.keys["left"].style.textAlign = "center";
    KeyTable.keys["left"].textContent = "←";

    KeyTable.keys["down"] = document.createElement("td");
    KeyTable.keys["down"].classList.add("bonkhud-button-color");
    KeyTable.keys["down"].classList.add("bonkhud-text-color");
    KeyTable.keys["down"].style.width = "34%";
    KeyTable.keys["down"].style.textAlign = "center";
    KeyTable.keys["down"].textContent = "↓";

    KeyTable.keys["right"] = document.createElement("td");
    KeyTable.keys["right"].classList.add("bonkhud-button-color");
    KeyTable.keys["right"].classList.add("bonkhud-text-color");
    KeyTable.keys["right"].style.width = "34%";
    KeyTable.keys["right"].style.textAlign = "center";
    KeyTable.keys["right"].textContent = "→";

    let pSelectorHold = document.createElement("div");
    pSelectorHold.style.flex = "0 1 auto";
    pSelectorHold.style.padding = "10px";

    let pSelector = document.createElement("select");
    pSelector.id = "player_selector";

    let pOption = document.createElement("option");
    pOption.id = "selector_option_user";
    pOption.textContent = "......";

    topRow.appendChild(KeyTable.keys["special"]);
    topRow.appendChild(KeyTable.keys["up"]);
    topRow.appendChild(KeyTable.keys["heavy"]);

    botRow.appendChild(KeyTable.keys["left"]);
    botRow.appendChild(KeyTable.keys["down"]);
    botRow.appendChild(KeyTable.keys["right"]);

    tableBody.appendChild(topRow);
    tableBody.appendChild(botRow);

    pSelector.appendChild(pOption);

    pSelectorHold.appendChild(pSelector);

    keyHold.appendChild(tableBody);

    keyTable.appendChild(keyHold);
    keyTable.appendChild(pSelectorHold);

    let keyTableSettings = document.createElement('div');
    keyTableSettings.style.margin = "10px";

    let inputTopRow = document.createElement('div');
    inputTopRow.style.display = "flex";

    let heavyInput = document.createElement('input');
    heavyInput.setAttribute("type", "text");
    heavyInput.value = "Heavy";
    heavyInput.style.minWidth = "0";

    let upInput = document.createElement('input');
    upInput.setAttribute("type", "text");
    upInput.value = "↑";
    upInput.style.minWidth = "0";

    let specialInput = document.createElement('input');
    specialInput.setAttribute("type", "text");
    specialInput.value = "Special";
    specialInput.style.minWidth = "0";

    let inputBottomRow = document.createElement('div');
    inputBottomRow.style.display = "flex";

    let leftInput = document.createElement('input');
    leftInput.setAttribute("type", "text");
    leftInput.value = "←";
    leftInput.style.minWidth = "0";

    let downInput = document.createElement('input');
    downInput.setAttribute("type", "text");
    downInput.value = "↓";
    downInput.style.minWidth = "0";

    let rightInput = document.createElement('input');
    rightInput.setAttribute("type", "text");
    rightInput.value = "→";
    rightInput.style.minWidth = "0";

    inputTopRow.appendChild(specialInput);
    inputTopRow.appendChild(upInput);
    inputTopRow.appendChild(heavyInput);

    inputBottomRow.appendChild(leftInput);
    inputBottomRow.appendChild(downInput);
    inputBottomRow.appendChild(rightInput);

    keyTableSettings.appendChild(inputTopRow);
    keyTableSettings.appendChild(inputBottomRow);

    KeyTable.windowConfigs.settingsContent = keyTableSettings;

    let keytable_index = bonkHUD.createWindow(
        KeyTable.windowConfigs.windowName,
        keyTable,
        KeyTable.windowConfigs
    );
    let keytable_window = bonkHUD.getElementByIndex(keytable_index);
    keytable_window.style.width = "100%";
    keytable_window.style.height = "calc(100% - 32px)";
    keytable_window.style.padding = "0";
    keytable_window.style.display = "flex";
    keytable_window.style.flexFlow = "column";

    bonkHUD.loadUISetting(keytable_index);

    let recoveredSetting = bonkHUD.getModSetting(keytable_index);
    if(recoveredSetting) {
        KeyTable.keys["heavy"].textContent = recoveredSetting["heavy"];
        KeyTable.keys["up"].textContent = recoveredSetting["up"];
        KeyTable.keys["special"].textContent = recoveredSetting["special"];
        KeyTable.keys["left"].textContent = recoveredSetting["left"];
        KeyTable.keys["down"].textContent = recoveredSetting["down"];
        KeyTable.keys["right"].textContent = recoveredSetting["right"];

        heavyInput.value = recoveredSetting["heavy"];
        upInput.value = recoveredSetting["up"];
        specialInput.value = recoveredSetting["special"];
        leftInput.value = recoveredSetting["left"];
        downInput.value = recoveredSetting["down"];
        rightInput.value = recoveredSetting["right"];
    }

    let saveFunction = function() {
        let setting = {
            "heavy": heavyInput.value,
            "up": upInput.value,
            "special": specialInput.value,
            "left": leftInput.value,
            "down": downInput.value,
            "right": rightInput.value,
        };
        bonkHUD.saveModSetting(keytable_index, setting);

        KeyTable.keys["heavy"].textContent = heavyInput.value;
        KeyTable.keys["up"].textContent = upInput.value;
        KeyTable.keys["special"].textContent = specialInput.value;
        KeyTable.keys["left"].textContent = leftInput.value;
        KeyTable.keys["down"].textContent = downInput.value;
        KeyTable.keys["right"].textContent = rightInput.value;
        KeyTable.updateKeyStyles();
    }

    heavyInput.onchange = saveFunction;
    upInput.onchange = saveFunction;
    specialInput.onchange = saveFunction;
    leftInput.onchange = saveFunction;
    downInput.onchange = saveFunction;
    rightInput.onchange = saveFunction;

    // Initialize the key styles
    KeyTable.updateKeyStyles();
};

// Initialization logic to set up the UI once the document is ready
const init = () => {
    addKeyTable();
    let playerSelector = document.getElementById("player_selector");
    if (playerSelector) {
        playerSelector.addEventListener("change", KeyTable.select_player);
    } else {
        console.error("player_selector element not found!");
    }
};

if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}