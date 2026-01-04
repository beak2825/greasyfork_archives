// ==UserScript==
// @name        SSE Warning
// @namespace   SSE Warning
// @match       https://www.nexusmods.com/skyrim
// @match       https://www.nexusmods.com/skyrim/*
// @grant       none
// @version     1.2.2
// @author      Lexiebean <lexie@lexiebean.net>
// @description Adds a warning to Nexusmods' Skyrim page to remind me to download mods for the right fucking game.
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/425771/SSE%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/425771/SSE%20Warning.meta.js
// ==/UserScript==

//var sort_by = "date"                  //Date published
//var sort_by = "OLD_endorsements"      //Endorsements
var sort_by = "OLD_downloads"           //Downloads
//var sort_by = "OLD_u_downloads"       //Unique downloads
//var sort_by = "lastupdate"            //Last updated
//var sort_by = "author"                //Author name
//var sort_by = "name"                  //File name
//var sort_by = "OLD_size"              //File size
//var sort_by = "RAND()"                //Random
//var sort_by = "two_weeks_ratings"     //Trending
//var sort_by = "lastcomment"           //Last comment

var elm = document.createElement("div");
elm.style.fontWeight = "bold";
elm.style.backgroundColor = "#181818";
elm.style.textAlign = "center";

var a = document.createElement("a");
a.href = "https://www.nexusmods.com/skyrimspecialedition/search/?gsearch=" + $("#pagetitle > h1")[0].innerText.replace(/ /g, "+") + "&gsearchtype=mods&tab=mods&sort_by=" + sort_by;
a.style.color = "red";
a.style.textDecoration = "underline"; 
a.style.fontSize = "xx-large"
a.innerHTML = "🚨🚨🚨 Are you looking for a Skyrim Special Edition mod? 🚨🚨🚨";

$('#head')[0].appendChild(elm);
elm.appendChild(a);
