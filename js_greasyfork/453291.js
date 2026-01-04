// ==UserScript==
// @name         Piracy (+GOG) links on Steam
// @namespace    framerunner
// @author       framerunner
// @license      CC BY-NC-SA 4.0
// @version      0.7.0
// @description  Add links at the bottom of the review area for piracy
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://store.steampowered.com/app/*
// @credit       XavierCui
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453291/Piracy%20%28%2BGOG%29%20links%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/453291/Piracy%20%28%2BGOG%29%20links%20on%20Steam.meta.js
// ==/UserScript==

// Get name and add spacer
var appName = document.getElementsByClassName("apphub_AppName")[0].textContent;
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column"><br></div></div>');

// IGG
var iggSearchUrl = "http://igg-games.com/?s=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">IGG:</div> <div class="summary column"><a href="'+iggSearchUrl+appName+'" target="_blank">Download '+appName+'</a></div></div>');
// Skidrow & Reloaded
var skrSearchUrl = "https://www.skidrowreloaded.com/?s=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">Skid & Rel:</div> <div class="summary column"><a href="'+skrSearchUrl+appName+'" target="_blank">Download '+appName+'</a></div></div>');
// The Piratebay
var tpbSearchUrl = "https://thepiratebay.org/search.php?q=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">Pirate Bay:</div> <div class="summary column"><a href="'+tpbSearchUrl+appName+'&cat=401" target="_blank">Torrent '+appName+'</a></div></div>');

// Legal bonus search:
// GOG
var gogSearchUrl = "https://www.gog.com/en/games?query=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">GOG:</div> <div class="summary column"><a href="'+gogSearchUrl+appName+'" target="_blank">Search GOG for '+appName+'!</a></div></div>');
// Games Like Finder
var glfSearchUrl = "https://gameslikefinder.com/?s=";
$(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column">Games Like:</div> <div class="summary column"><a href="'+glfSearchUrl+appName+'" target="_blank">'+appName+'</a></div></div>');



// CC BY-NC-SA 4.0 License in short:
// You can copy and adapt this code to your liking, as long as you credit me, keep it non-commercial and share it under these exact conditions.
// More details: https://creativecommons.org/licenses/by-nc-sa/4.0/