// ==UserScript==
// @name        KAT [katcr.co] - Subtitle download links to TV and Movie torrents
// @description  Adds download links for subtitles to every TV and movie torrent on KAT (addic7ed & subscene)
// @namespace   NotNeo
// @author      NotNeo
// @include     http*://katcr.co/torrent/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29474/KAT%20%5Bkatcrco%5D%20-%20Subtitle%20download%20links%20to%20TV%20and%20Movie%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/29474/KAT%20%5Bkatcrco%5D%20-%20Subtitle%20download%20links%20to%20TV%20and%20Movie%20torrents.meta.js
// ==/UserScript==

var torrentTitle;
var baseURL;

$(function() {
    var section = $("div.my-2 > small").find("a[href*='/category/']:first").text();

    if ( section == "TV" ) {
        torrentTitle = $("h1").text();
        baseURL = "http://www.addic7ed.com/search.php?search=";
        torrentTitle = torrentTitle.replace(/\s/g, '+').replace(/\+{2,}/g, '+').replace(/^\+|\+$/g, '');
        $(".col-sm a[title*='torrent Magnet link']").after(' <a rel="nofollow" class="button button--big button--icon-button button--special_icon" title="Download Subtitles" href="' + baseURL + torrentTitle + '"><img class="button--dark" src="http://www.addic7ed.com/favicon.ico" style="padding: 7px;" alt="Download subtitles for this torrent" width="30" height="30"> <span> Download Subtitles</span></a> ');
    }
    else if ( section == "Movies" ) {
        baseURL = "https://subscene.com/subtitles/title?q=";
        torrentTitle = $("h1").text();
        torrentTitle = torrentTitle.replace(/\s/g, '+').replace(/\+{2,}/g, '+').replace(/^\+|\+$/g, '');
        $(".col-sm a[title*='torrent Magnet link']").after(' <a rel="nofollow" class="button button--big button--icon-button button--special_icon" title="Download Subtitles" href="' + baseURL + torrentTitle + '"><img class="button--dark" src="http://www.subscene.com/favicon.ico" style="padding: 7px;" alt="Download subtitles for this torrent" width="30" height="30"> <span> Download Subtitles</span></a> ');
    }
});