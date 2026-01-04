// ==UserScript==
// @name         Req WM DB Start Burkhard Körtge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/498512/Ed%20WM%20DB%20Start%20Burkhard%20K%C3%B6rtge.js
// @run-at       document-start
                 




// @downloadURL https://update.greasyfork.org/scripts/498513/Req%20WM%20DB%20Start%20Burkhard%20K%C3%B6rtge.user.js
// @updateURL https://update.greasyfork.org/scripts/498513/Req%20WM%20DB%20Start%20Burkhard%20K%C3%B6rtge.meta.js
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