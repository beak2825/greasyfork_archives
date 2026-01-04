// ==UserScript==
// @name         Mongarch Replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Replaces monarch banner with a meme banner
// @author       KingOfSmegma
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468210/Mongarch%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/468210/Mongarch%20Replacer.meta.js
// ==/UserScript==

/*globals $*/

var old_url = "https://factionimages.torn.com/02deef4c-d4e1-b582-1643018.png"
var new_url = "https://cdn.discordapp.com/attachments/713002003327877186/1085618084229959710/mongarch.png"
$(document).ready(function(){
        $("img[src='"+old_url+"']").attr("src", new_url);
});