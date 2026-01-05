// ==UserScript==
// @name       Texas Hold'em Zynga - Hands Reference
// @namespace  http://privatesniper.me.uk
// @version    0.1
// @description  Adds a reference to poker hands on the side
// @match      https://apps.facebook.com/texas_holdem/?fb_source=bookmark&ref=bookmarks&count=1&fb_bmpos=7_1
// @match      https://apps.facebook.com/texas_holdem/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2730/Texas%20Hold%27em%20Zynga%20-%20Hands%20Reference.user.js
// @updateURL https://update.greasyfork.org/scripts/2730/Texas%20Hold%27em%20Zynga%20-%20Hands%20Reference.meta.js
// ==/UserScript==

var img = 'http://i259.photobucket.com/albums/hh309/PrivateSniper/Web%20ReSkins/UserScripts/poker-hands-small.jpg';
// var img_html = "<img src='"+img+"' alt='poker hands' title='Poker Hands' />";

var width = $( window ).width();

if (width >= 2543) { // 2560 x 1080
    $("<div id='ps-poker' style='position: absolute; right: 620px; top: 250px; width: 400px; height: 500px; background-image: url("+img+"); z-index: 9000;'>&nbsp;</div>").appendTo("body");
}
else
{
    $("<div id='ps-poker' style='position: absolute; right: 0px; top: 250px; width: 400px; height: 500px; background-image: url("+img+"); z-index: 9000;'>&nbsp;</div>").appendTo("body");
}