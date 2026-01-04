// ==UserScript==
// @name         Req WM Sp Start Christian Morgenstern
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Insert 
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/495266/Ed%20WM%20Sp%20Start%20Christian%20Morgenstern.js
// @run-at       document-start
                 




// @downloadURL https://update.greasyfork.org/scripts/495267/Req%20WM%20Sp%20Start%20Christian%20Morgenstern.user.js
// @updateURL https://update.greasyfork.org/scripts/495267/Req%20WM%20Sp%20Start%20Christian%20Morgenstern.meta.js
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