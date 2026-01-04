// ==UserScript==
// @name         Roblox Prank
// @namespace    http://tampermonkey.net/
// @version      Alpha-v3
// @description  redirects any game you join to another (first release - 4/30)
// @author       You
// @match        https://www.roblox.com/games/*
// @match        https://web.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/493883/Roblox%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/493883/Roblox%20Prank.meta.js
// ==/UserScript==

/*
 * Personal Use Only License:
 * This script is provided for personal use only. You may modify the script
 * for your own use, but you are not allowed to distribute modified versions
 * of the script publicly or for commercial purposes.
 */

const gameID = 12334109280

// Function to manipulate the button
function manipulateButton(button) {
    // Change what the game button does
    button.setAttribute("onclick", "Roblox.GameLauncher.joinGameInstance(" + gameID + ")");

    // Clone and delete button so it doesn't join original game
    var button2 = button.cloneNode(true);
    button.parentNode.insertBefore(button2, button.nextSibling);
    button.parentNode.removeChild(button);
    console.log("by fishcat2431")
    console.log("message me any errors/bugs or any features you want on discord")
}

// Function to check for button1 and manipulate it if found
function checkAndManipulateButton() {
    var button1 = document.getElementsByClassName("btn-common-play-game-lg btn-primary-md btn-full-width")[0];
    if (button1) {
        manipulateButton(button1);
    }
}

// Check for button1 initially
checkAndManipulateButton();

// Repeat the check every 500 milliseconds (adjust as needed)
setInterval(checkAndManipulateButton, 500);