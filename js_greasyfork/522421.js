// ==UserScript==
// @name         Semaphore Logic
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  For running one script after the other
// @author       zahjar2
// @match        http*://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522421/Semaphore%20Logic.user.js
// @updateURL https://update.greasyfork.org/scripts/522421/Semaphore%20Logic.meta.js
// ==/UserScript==

function getScriptName() {
    const scriptMetadata = GM_info.script;
    const name = scriptMetadata.name || 'Unknown Script';
    console.log(`[DEBUG] Script Name: ${name}`);
    return name;
}

// Function to set the script as finished in localStorage
function setScriptFinished(scriptName) {
    console.log(`[DEBUG] Setting "${scriptName}" as finished.`);
    localStorage.setItem(scriptName + '_finished', 'true');
}

// Function to set the script as not finished in localStorage
function setScriptNotFinished(scriptName) {
    console.log(`[DEBUG] Setting "${scriptName}" as not finished.`);
    localStorage.setItem(scriptName + '_finished', 'false');
}

// Function to check if all specified scripts have finished
function checkScriptsFinished(scriptNames, callback) {
    const allFinished = scriptNames.every(scriptName => localStorage.getItem(scriptName + '_finished') === 'true') || scriptNames.length == 0;

    if (allFinished) {
        console.log(`[DEBUG] All scripts have finished.`);
        clearInterval(pollingInterval); // Stop polling once all scripts are finished
        callback(); // Execute the main logic
    } else {
        scriptNames.forEach(scriptName => {
            const status = localStorage.getItem(scriptName + '_finished') || 'false';
        });
    }
}

// Array of script names that need to be finished before executing the main logic
let scriptNames = []; // Add your script names here

// Start polling to check if all scripts have finished
const pollingInterval = setInterval(() => checkScriptsFinished(scriptNames, runScriptLogic), 100);