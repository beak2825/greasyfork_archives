// ==UserScript==
// @name        StreamProtocol for LegitTorrents
// @namespace   sp-legittorrents
// @description Stream directly from LegitTorrents with StreamProtocol
// @include     http://www.legittorrents.info/index.php?page=torrent-details*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14080/StreamProtocol%20for%20LegitTorrents.user.js
// @updateURL https://update.greasyfork.org/scripts/14080/StreamProtocol%20for%20LegitTorrents.meta.js
// ==/UserScript==

$(document).ready(function() {
    var infohash = $("td:contains('Info Hash')").next().text();
    var streamUrl = 'stream+torrent' + window.location.origin.slice(4) + '/' + $("a[href^='download.php']").attr('href');
    
    $('#files tr').each(function () {
        var tds = $(this).children('td');
        if (tds.length === 0)
            return;
        
        var td = $(tds[0]);
        if (!td.hasClass('lista'))
            return;
        
        var name = td.text();
        var html = '<a href="' + streamUrl + '#file=' + encodeURIComponent(name) + '&infohash=' + encodeURIComponent(infohash) + '">' + $(this).html() + '</a>';
        td.html(html);
    });
});