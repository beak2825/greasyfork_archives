// ==UserScript==
// @name        View hidden channels everywhere
// @description  This script allows you to view hidden channels in Discord.
// @version      1.0
// @author       Midnight
// @namespace    https://google.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467190/View%20hidden%20channels%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/467190/View%20hidden%20channels%20everywhere.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Get the Discord window.
    const discordWindow = window.opener || window.parent;

    // Add an event listener for the "channelHidden" event.
    discordWindow.addEventListener("channelHidden", function(event) {
        // Get the channel that was hidden.
        const channel = event.detail.channel;

        // Show the channel in the channel list.
        discordWindow.channels.find(c => c.id === channel.id).show();
    });
})();
