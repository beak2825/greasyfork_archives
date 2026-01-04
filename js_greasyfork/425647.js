// ==UserScript==
// @name        RSWiki Dark Mode
// @namespace   Dark Mode
// @match *runescape.wiki/*
// @description Makes RS Wiki Less...White.
// @version     0.4

// @downloadURL https://update.greasyfork.org/scripts/425647/RSWiki%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/425647/RSWiki%20Dark%20Mode.meta.js
// ==/UserScript==
var questdetails = document.getElementsByClassName("questdetails-info");
for (var i = 0; i < questdetails.length; i++) {
    console.log(questdetails[i]);
    questdetails[i].bgColor = "black";
} 