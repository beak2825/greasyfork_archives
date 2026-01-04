// ==UserScript==
// @name         Req Rec Sp Start Combined Eugen Willi Kaufmann
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/490436/Ed%20Rec%20Sp%20Start%20Combined%20Eugen%20Willi%20Kaufmann.js
// @run-at       document-start
                 




// @downloadURL https://update.greasyfork.org/scripts/490437/Req%20Rec%20Sp%20Start%20Combined%20Eugen%20Willi%20Kaufmann.user.js
// @updateURL https://update.greasyfork.org/scripts/490437/Req%20Rec%20Sp%20Start%20Combined%20Eugen%20Willi%20Kaufmann.meta.js
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