// ==UserScript==
// @name          TV-Muse quicklinks in list view
// @description   Adds links to coke&popcorn to tv-muse.
// @include       http://www.tvmuse.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version       1
// @grant         GM_addStyle
// @namespace https://greasyfork.org/users/2209
// @downloadURL https://update.greasyfork.org/scripts/3605/TV-Muse%20quicklinks%20in%20list%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/3605/TV-Muse%20quicklinks%20in%20list%20view.meta.js
// ==/UserScript==

$("span.c2","ul.episodes").each(function( index ) {
    var daten = $("a", this).attr("href").match(/tv-shows\/([^_]+).*season_(\d+).*episode_(\d+)/);
    var show = '';
    if(daten[1]==='NCIS') // special case for NCIS
       show = 'NCIS';
    else
       show = daten[1].toLowerCase();
    var neuerLink = '<a target="_blank" href="http:\/\/www.cokeandpopcorn.ch\/watch-'+show+'-season-'+daten[2]+'-episode-'+daten[3]+'-online.php">C & P</a>&nbsp;&nbsp;&nbsp;&nbsp;';
    
    $(this).prepend(neuerLink);
    
});
