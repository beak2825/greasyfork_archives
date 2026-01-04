// ==UserScript==
// @name         DiscordCDNFixer
// @namespace    square3ang
// @version      1.0.0
// @description  Automatically Fixes Discord's Broken cdn link with hyonsu's api.
// @author       square3ang
// @match        https://cdn.discordapp.com/attachments/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489302/DiscordCDNFixer.user.js
// @updateURL https://update.greasyfork.org/scripts/489302/DiscordCDNFixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (unsafeWindow.document.body.innerText.includes("This content is no longer available.")) {
        unsafeWindow.document.body.innerText = "cdn Fixed!";
        unsafeWindow.location.href = unsafeWindow.location.href.replace("cdn.discordapp.com", "fixcdn.hyonsu.com")
    }
})();