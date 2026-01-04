// ==UserScript==
// @name         Discord: View deleted messages
// @description  View deleted message in all servers, and dm’s.
// @version      1.0
// @author       Ghost
// @namespace    https://discord.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467321/Discord%3A%20View%20deleted%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/467321/Discord%3A%20View%20deleted%20messages.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const log = console.log;

    // Get the Discord chat container.
    const chatContainer = document.querySelector(".chat-container");

    // Listen for the `messageDeleted` event.
    chatContainer.addEventListener("messageDeleted", function(event) {
        // Get the deleted message.
        const deletedMessage = event.detail.message;

        // Log the deleted message to the console.
        log(deletedMessage);
    });
})();