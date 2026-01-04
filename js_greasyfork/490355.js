// ==UserScript==
// @name         Req combined Detlef von Seggern
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Aus
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/490354/Ed%20combined%20Detlef%20von%20Seggern.js




// @downloadURL https://update.greasyfork.org/scripts/490355/Req%20combined%20Detlef%20von%20Seggern.user.js
// @updateURL https://update.greasyfork.org/scripts/490355/Req%20combined%20Detlef%20von%20Seggern.meta.js
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