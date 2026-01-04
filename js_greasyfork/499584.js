// ==UserScript==
// @name         Req 4Rec DB ed.belle@t-online.de
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/499583/Ed%204Rec%20DB%20edbelle%40t-onlinede.js
                 




// @downloadURL https://update.greasyfork.org/scripts/499584/Req%204Rec%20DB%20edbelle%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/499584/Req%204Rec%20DB%20edbelle%40t-onlinede.meta.js
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