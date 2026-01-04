// ==UserScript==
// @name         Req 4Rec Start CSui, Raif Ch rgyr55@gmail.com auszug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/511171/Ed%204Rec%20Start%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20%20auszug.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/511172/Req%204Rec%20Start%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20auszug.user.js
// @updateURL https://update.greasyfork.org/scripts/511172/Req%204Rec%20Start%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20auszug.meta.js
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