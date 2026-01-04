// ==UserScript==
// @name         Req 2 Start Sp harfmann-heinz@web.de
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/510270/Ed%202%20Start%20Sp%20harfmann-heinz%40webde.js
// @downloadURL https://update.greasyfork.org/scripts/510272/Req%202%20Start%20Sp%20harfmann-heinz%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/510272/Req%202%20Start%20Sp%20harfmann-heinz%40webde.meta.js
// ==/UserScript==

// Define a global variable to check if the required script is loaded
var externalScriptLoaded = false;

// Delay the execution of the internal script
setTimeout(function() {
    if (!externalScriptLoaded) {
        // Log to console
        console.log("The required external script did not load or did not set 'externalScriptLoaded' to true.");

        // Your original script code...
        // [Rest of your script here...]
    } else {
        // If external script loaded, you can also add a console log here if needed
        console.log("External script loaded successfully.");
    }
}, 300); // Delay by 500 milliseconds or adjust as needed