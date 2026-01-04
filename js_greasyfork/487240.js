// ==UserScript==
// @name         Req Combined Michael Mederer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aus
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/487239/Ed%20Combined%20Michael%20Mederer.js




// @downloadURL https://update.greasyfork.org/scripts/487240/Req%20Combined%20Michael%20Mederer.user.js
// @updateURL https://update.greasyfork.org/scripts/487240/Req%20Combined%20Michael%20Mederer.meta.js
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