// ==UserScript==
// @name        View deleted messages everywhere
// @description  This script allows you to view deleted messages in Discord.
// @version      1.0
// @author       Midnight
// @namespace    https://google.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467189/View%20deleted%20messages%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/467189/View%20deleted%20messages%20everywhere.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Get the Discord window.
    const discordWindow = window.opener || window.parent;

    // Add an event listener for the "messageDeleted" event.
    discordWindow.addEventListener("messageDeleted", function(event) {
        // Get the message that was deleted.
        const message = event.detail.message;

        // Log the message to the console.
        console.log("Deleted message: " + message.content);
    });
})();
