// ==UserScript==
// @name         Req Start Sp werner.kigle@gmail.com second for bus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/506395/Ed%20Start%20Sp%20wernerkigle%40gmailcom%20second%20for%20bus.js
// @downloadURL https://update.greasyfork.org/scripts/509774/Req%20Start%20Sp%20wernerkigle%40gmailcom%20second%20for%20bus.user.js
// @updateURL https://update.greasyfork.org/scripts/509774/Req%20Start%20Sp%20wernerkigle%40gmailcom%20second%20for%20bus.meta.js
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
