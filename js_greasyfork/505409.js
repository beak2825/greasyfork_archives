// ==UserScript==
// @name         Req Start Sp wolfgang_sittig@gmx.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/505408/Ed%20Start%20Sp%20wolfgang_sittig%40gmxcom.js
// @downloadURL https://update.greasyfork.org/scripts/505409/Req%20Start%20Sp%20wolfgang_sittig%40gmxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/505409/Req%20Start%20Sp%20wolfgang_sittig%40gmxcom.meta.js
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