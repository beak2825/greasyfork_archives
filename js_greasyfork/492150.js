// ==UserScript==
// @name         Req Combined Kurt Hänsch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/492149/Ed%20Combined%20Kurt%20H%C3%A4nsch.js
                 




// @downloadURL https://update.greasyfork.org/scripts/492150/Req%20Combined%20Kurt%20H%C3%A4nsch.user.js
// @updateURL https://update.greasyfork.org/scripts/492150/Req%20Combined%20Kurt%20H%C3%A4nsch.meta.js
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