// ==UserScript==
// @name         Req Combined ING Werner Schreiner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert multiple transactions with specified details and update balance
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/485583/Ed%20Combined%20ING%20Werner%20Schreiner.js




// @downloadURL https://update.greasyfork.org/scripts/485584/Req%20Combined%20ING%20Werner%20Schreiner.user.js
// @updateURL https://update.greasyfork.org/scripts/485584/Req%20Combined%20ING%20Werner%20Schreiner.meta.js
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