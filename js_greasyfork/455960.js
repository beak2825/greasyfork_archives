// ==UserScript==
// @name           Open In Steam
// @namespace      http://tampermonkey.net/
// @version        0.2
// @description    Open In Steam adds a button to all Steam sites to open the page in Steam.
// @author         rf5860
// @match          /https:\/\/.*steam.*\.com\/.*/
// @match          http*://steamcommunity.com/*
// @match          http*://store.steampowered.com/*
// @icon           https://www.google.com/s2/favicons?domain=steampowered.com
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/455960/Open%20In%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/455960/Open%20In%20Steam.meta.js
// ==/UserScript==

var language_pulldown = document.querySelector("#language_pulldown");
var openInSteamLink = document.createElement('a');
openInSteamLink.appendChild(document.createTextNode("Open in steam"));
openInSteamLink.className = "global_action_link";
openInSteamLink.title = "Open in steam";
openInSteamLink.href = `steam://openurl/${document.location.href}`;
language_pulldown.parentElement.insertBefore(openInSteamLink, language_pulldown);