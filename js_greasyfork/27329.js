// ==UserScript==
// @name         Add The Navigation Links To The Header [WWT]
// @namespace    Bond
// @author       Jaqen H'Ghar AKA ElBrado AKA Bond
// @description  Adds The Navigation Links To The Header without having to scroll for the links
// @include      *worldwidetorrents.eu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27329/Add%20The%20Navigation%20Links%20To%20The%20Header%20%5BWWT%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/27329/Add%20The%20Navigation%20Links%20To%20The%20Header%20%5BWWT%5D.meta.js
// ==/UserScript==


$(document).ready(function(){
$('.w3-navbar').append('<li class="w3-hide-small w3-dropdown-hover jaqensscript"><a href="#" class="w3-padding-large w3-hover-white class1" title="Navigation">Navigation</a><div class="w3-dropdown-content w3-white w3-card-4 w3-small"><a href="/request.php"> Request Torrent</a><a href="/teams-view.php"> Teams</a><a href="/memberlist.php"> Member List</a><a href="/rules.php"> Site Rules</a><a href="/faq.php"> FAQ</a><a href="/staff.php"> Staff</a></div></li>');
$('#main > center > table > tbody > tr > td:nth-child(3) > div > div.myBlock-content > div > h4:nth-child(33) > center').remove();
$('#navigate').remove();
});