// ==UserScript==
// @name         online-fix.me & IGG button for steam
// @namespace    NefilimPL
// @version      0.0.4
// @description  This script add's button to find game in igg or online-fix.me
// @author       NefilimPL
// @match        https://store.steampowered.com/app/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489181/online-fixme%20%20IGG%20button%20for%20steam.user.js
// @updateURL https://update.greasyfork.org/scripts/489181/online-fixme%20%20IGG%20button%20for%20steam.meta.js
// ==/UserScript==


var appName = document.getElementsByClassName("apphub_AppName")[0].textContent
var iggSearchBaseUrl = "http://igg-games.com/?s=";
$(".game_purchase_action_bg:first").append(' <a href="'+iggSearchBaseUrl+appName+'" style="margin-left: 10px; padding-right: 10px;">IGG</a> ');

var appName = document.getElementsByClassName("apphub_AppName")[0].textContent
var onlinefixSearchBaseUrl = "https://online-fix.me/index.php?do=search&subaction=search&story=";
$(".game_purchase_action_bg:first").append(' <a href="'+onlinefixSearchBaseUrl+appName+'" style="margin-left: 10px; padding-right: 10px;">ONLINE-FIX</a> ');