// ==UserScript==
// @name         Torn Quick Links
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.0
// @description  Creates quick links to Item Market, Bookie, and Russian Roulette
// @author       Mike Pence
// @match        https://www.torn.com/*
// @match        http://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34553/Torn%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/34553/Torn%20Quick%20Links.meta.js
// ==/UserScript==

$(document).ready(function(){
    $(".areas").prepend("<li class=''><div class='list-link' id='nav-item-market'><a href='/imarket.php'><i class='items-navigation-icons left'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>Item Market</span></a></div></li>");
    $(".areas").append("<li class=''><div class='list-link' id='nav-bookie'><a href='/bookie.php'><i class='casino-navigation-icons left'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>Bookie</span></a></div></li>");
    $(".areas").append("<li class=''><div class='list-link' id='nav-russian-roulette'><a href='/loader.php?sid=russianRoulette'><i class='casino-navigation-icons left'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>Russian Roulette</span></a></div></li>");
});