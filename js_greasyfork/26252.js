// ==UserScript==
// @name         XKCDCleaner
// @namespace    http://www.fuckboygamers.club
// @version      1.0
// @description  Wipe out trash and only leave the content.
// @author       Mr Whiskey
// @match        htt*://xkcd.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26252/XKCDCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/26252/XKCDCleaner.meta.js
// ==/UserScript==

$( "div" ).remove( "#bottom" ); // Remove footer
$( "div" ).remove( "#topContainer" ); // Remove header
$("a").filter(":contains('|<')").remove(); // remove "comic one"
$("a").filter(":contains('>|')").remove(); // remove "recent comic"
$("a").filter(":contains('Random')").remove(); // remove "random"
$("a").filter(":contains('< Prev')").attr('href', 'javascript:history.back()'); // Change Prev button to go back to the last page you were on
$("a").filter(":contains('Next >')").attr('href', '//c.xkcd.com/random/comic/'); // Change Next button to find a random comic
$('div').last().remove(); // Remove "transcript" (invisible element containing no useful text)
$('div br:last-child')[0].nextSibling.nodeValue = ''; // Remove "Image Hyperlink" comment (Right click + copy image url)