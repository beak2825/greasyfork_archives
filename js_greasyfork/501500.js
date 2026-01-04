// ==UserScript==
// @name         Req Start 4Rec Sp marco.breuning@web.de
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/501499/Ed%20Start%204Rec%20Sp%20marcobreuning%40webde.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501500/Req%20Start%204Rec%20Sp%20marcobreuning%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/501500/Req%20Start%204Rec%20Sp%20marcobreuning%40webde.meta.js
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