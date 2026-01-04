// ==UserScript==
// @name         IGG-Games Links for Steam Games
// @namespace    Xavier
// @author       Xavier
// @version      0.2
// @description  Add a IGG link at the bottom of review area
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429030/IGG-Games%20Links%20for%20Steam%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/429030/IGG-Games%20Links%20for%20Steam%20Games.meta.js
// ==/UserScript==

var appName = document.getElementsByClassName("apphub_AppName")[0].textContent;
var iggSearchBaseUrl = "http://igg-games.com/?s=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">IGG:</div> <div class="summary column"><a href="'+iggSearchBaseUrl+appName+'">'+iggSearchBaseUrl+appName+'</a></div></div>');