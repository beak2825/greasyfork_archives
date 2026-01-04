// ==UserScript==
// @name         Background Colour of Discord
// @namespace    Background Colour of Discord
// @version      0.1
// @description  Change colour of background in Discord.
// @author       pxgamer
// @include      https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368162/Background%20Colour%20of%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/368162/Background%20Colour%20of%20Discord.meta.js
// ==/UserScript==

setInterval(function() {
    [].forEach.call(document.getElementsByTagName("*"), e => e.style.backgroundColor = "#e56c02");
}, 1);
