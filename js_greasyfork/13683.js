// ==UserScript==
// @name               YouTube Most Popular Videos By User 
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            3.0
// @description        Adds 2 very useful subtle links under the player to the current user's Uploaded Videos page sorted by popularity and by newest.
// @run-at             document-start
// @include            https://www.youtube.com/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant              GM_getResourceText
// @resource spfremove https://greasyfork.org/scripts/16935-disable-spf-youtube/code/Disable%20SPF%20Youtube.user.js
// @author             drhouse
// @icon               https://s.ytimg.com/yts/img/favicon-vfldLzJxy.ico
// @downloadURL https://update.greasyfork.org/scripts/13683/YouTube%20Most%20Popular%20Videos%20By%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/13683/YouTube%20Most%20Popular%20Videos%20By%20User.meta.js
// ==/UserScript==

$(document).ready(function() {

    //$("a").removeClass("spf-link").not("#watch-appbar-playlist");
    eval(GM_getResourceText("spfremove"));

    var dest = '#watch7-user-header > div > a';
    var channel = $(dest).attr('href');
    var link = 'https://www.youtube.com' + channel + '/videos?view=0&sort=p&flow=grid';
    var link2 = "'" + link + "'";
    var dest2 = $('#action-panel-overflow-button > span');
	var linkdd = 'https://www.youtube.com' + channel + '/videos?view=0&sort=dd&flow=grid';
	var linkdd2 = "'" + linkdd + "'";
    $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-triggerx yt-uix-tooltip addto-button" type="button" onclick="window.open(' + link2 + ')" title="More actions" aria-pressed="false" id="popular" role="button" aria-haspopup="false" data-tooltip-text="Popular videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + link + '">Most popular videos</a></span></button>').insertAfter(dest2).css('color', '#666');
	$('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-triggerx yt-uix-tooltip addto-button" type="button" onclick="window.open(' + linkdd2 + ')" title="More actions" aria-pressed="false" id="popular" role="button" aria-haspopup="false" data-tooltip-text="Newest videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + linkdd + '">Newest videos</a></span></button>').insertAfter(dest2).css('color', '#666');

});