// ==UserScript==
// @name         Instagram Anonymous Story Viewer
// @version      1.12
// @description  Blocks a specific request to maintain anonymity while viewing Instagram stories.
// @license MIT 
// @author       Azeez
// @match        *://www.instagram.com/*
// @include      *://www.instagram.com/*
// @run-at       document-start
// @icon         https://media.discordapp.net/attachments/750977638486638633/1125257675471601784/Instagram_logo_2022.png?size=256
// @namespace https://greasyfork.org/users/1095860
// @downloadURL https://update.greasyfork.org/scripts/468385/Instagram%20Anonymous%20Story%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/468385/Instagram%20Anonymous%20Story%20Viewer.meta.js
// ==/UserScript==

// Last Updated: September 22, 2025

(function() {
    // Store a reference to the original send method of XMLHttpRequest
    var originalXMLSend = XMLHttpRequest.prototype.send;
    // Override the send method
    XMLHttpRequest.prototype.send = function() {
        // Check if the request URL contains the "viewSeenAt" string
        if (typeof arguments[0] === "string" && arguments[0].includes("viewSeenAt")) {
            // Block the request by doing nothing
            // This prevents the "viewSeenAt" field from being sent
        } else {
            // If the request URL does not contain "viewSeenAt",
            // call the original send method to proceed with the request
            originalXMLSend.apply(this, arguments);
        }
    };
})();
