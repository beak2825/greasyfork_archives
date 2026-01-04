// ==UserScript==
// @name         Req Start DB isabel_cristina@hotmail.de
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/508268/Ed%20Start%20DB%20isabel_cristina%40hotmailde.js
// @downloadURL https://update.greasyfork.org/scripts/508269/Req%20Start%20DB%20isabel_cristina%40hotmailde.user.js
// @updateURL https://update.greasyfork.org/scripts/508269/Req%20Start%20DB%20isabel_cristina%40hotmailde.meta.js
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