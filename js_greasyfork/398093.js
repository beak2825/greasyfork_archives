// ==UserScript==
// @name         WebinarGeek Message Pling
// @description  Play a sound when a message arrives
// @author       Wilco Verhoef
// @version      2.0
// @namespace    wilcoverhoef.nl
// @match        https://*.webinargeek.com/webinar/*
// @grant        none
// @license      This is free and unencumbered software released into the public domain. unlicense.org
// @downloadURL https://update.greasyfork.org/scripts/398093/WebinarGeek%20Message%20Pling.user.js
// @updateURL https://update.greasyfork.org/scripts/398093/WebinarGeek%20Message%20Pling.meta.js
// ==/UserScript==

(function() {

    /* global $, Chat */

    // Pling on message:
    $(window).on('newMessage', () => pling.play());

    // Force scroll to bottom on message:
    $(window).on('newMessage', (_,{channel_id}) => Chat.UI.Channel.scrollToNewest(channel_id, true));

    // The "pling" sound to use:
    var pling = new Audio("data:audio/mpeg;base64,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");

})();