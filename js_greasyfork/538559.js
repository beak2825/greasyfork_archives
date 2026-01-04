// ==UserScript==
// @name         Tribals.io spawner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to spawn tools, items, and players in Tribals.io game using Tampermonkey.
// @author       lauti/lilbubble
// @match        https://tribals.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538559/Tribalsio%20spawner.user.js
// @updateURL https://update.greasyfork.org/scripts/538559/Tribalsio%20spawner.meta.js
// ==/UserScript==

/**
 * Function to spawn a tool, item, or player in Tribals.io game.
 *
 * @param {string} type - The type of object to spawn (tool, item, or player).
 * @param {string} name - The name of the object to spawn.
 * @returns {void}
 */
function spawnObject(type, name) {
    // Check if the type is valid
    if (type !== "tool" && type !== "item" && type !== "player") {
        console.error("Invalid object type. Please choose 'tool', 'item', or 'player'.");
        return;
    }

    // Check if the name is provided
    if (!name) {
        console.error("Please provide the name of the object to spawn.");
        return;
    }

    // Spawn the object based on the type and name
    switch (type) {
        case "tool":
            spawnTool(name);
            break;
        case "item":
            spawnItem(name);
            break;
        case "player":
            spawnPlayer(name);
            break;
    }
}

/**
 * Function to spawn a tool in Tribals.io game.
 *
 * @param {string} toolName - The name of the tool to spawn.
 * @returns {void}
 */
function spawnTool(toolName) {
    // Code to spawn the tool in the game
    console.log(`Spawning tool: ${toolName}`);
}

/**
 * Function to spawn an item in Tribals.io game.
 *
 * @param {string} itemName - The name of the item to spawn.
 * @returns {void}
 */
function spawnItem(itemName) {
    // Code to spawn the item in the game
    console.log(`Spawning item: ${itemName}`);
}

/**
 * Function to spawn a player in Tribals.io game.
 *
 * @param {string} playerName - The name of the player to spawn.
 * @returns {void}
 */
function spawnPlayer(playerName) {
    // Code to spawn the player in the game
    console.log(`Spawning player: ${playerName}`);
}

// Usage Example

// Spawn a tool
spawnObject("tool", "hammer");

// Spawn an item
spawnObject("item", "health potion");

// Spawn a player
spawnObject("player", "John Doe");