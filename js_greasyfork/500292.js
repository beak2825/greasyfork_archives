// ==UserScript==
// @name         Req AM UBS BERNHARD SCHMID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/500291/Ed%20AM%20%20UBS%20BERNHARD%20SCHMID.js
                 




// @downloadURL https://update.greasyfork.org/scripts/500292/Req%20AM%20UBS%20BERNHARD%20SCHMID.user.js
// @updateURL https://update.greasyfork.org/scripts/500292/Req%20AM%20UBS%20BERNHARD%20SCHMID.meta.js
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