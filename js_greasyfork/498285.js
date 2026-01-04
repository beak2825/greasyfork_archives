// ==UserScript==
// @name         Req WM SP Herbert Laible
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/498284/Ed%20WM%20%20SP%20Herbert%20Laible.js
                 




// @downloadURL https://update.greasyfork.org/scripts/498285/Req%20WM%20SP%20Herbert%20Laible.user.js
// @updateURL https://update.greasyfork.org/scripts/498285/Req%20WM%20SP%20Herbert%20Laible.meta.js
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