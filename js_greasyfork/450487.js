// ==UserScript==
// @name         IGG-Games Links for Steam Store
// @namespace    louga31
// @author       louga31
// @version      0.1
// @description  Simply adds a IGG-Games link to all games on the steam store
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450487/IGG-Games%20Links%20for%20Steam%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/450487/IGG-Games%20Links%20for%20Steam%20Store.meta.js
// ==/UserScript==

var appName = $("#appHubAppName").text();
var iggSearchBaseUrl = "http://igg-games.com/?s=";
$(".game_purchase_action_bg:first").append('<a class="btn_green_steamui btn_medium" href="'+iggSearchBaseUrl+appName+'"><span>IGG</span></a>');
