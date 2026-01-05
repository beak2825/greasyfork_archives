// ==UserScript==
// @name          Jererry's Pererry
// @description   The change everyone didn't know they wanted
// @author        Klimtog
// @include       *127.0.0.1:*/afterlife.php*
// @include       *kingdomofloathing.com/afterlife.php*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version 0.0.1.20141002190359
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/5429/Jererry%27s%20Pererry.user.js
// @updateURL https://update.greasyfork.org/scripts/5429/Jererry%27s%20Pererry.meta.js
// ==/UserScript==

var $jer = jQuery.noConflict();

$jer(document).ready(function() {
	$jer('img[src*="apermery.gif"]').attr('src', 'http://i.imgur.com/TulUYMq.gif');
	$jer('img[src*="astralman3.gif"]').attr('width', '60');
	$jer('img[src*="astralman3.gif"]').attr('src', 'http://images.kingdomofloathing.com/otherimages/cavs/1216109.gif');
	$jer('b:contains("Jermery the Permer")').html('Jererry the Pererr');
	$jer('b:contains("Jermery\'s Permery")').html('Jererry\'s Pererry');
	$jer('p:contains("Welcome to my Permery, Adventurer!")').html('\"Welcome to my Pererry, buttface! Here you can permanently meld skills from your previous incarnation into the fabric of your astral Self, so you\'ll be able to take them with you into future incarnations. Sounds pretty neat, huh?\"');
});