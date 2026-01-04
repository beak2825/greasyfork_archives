// ==UserScript==
// @name         Magnet2Torrent
// @license      MIT
// @namespace    m2t
// @version      0.1
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @description  Converts magnet link to .torrent file
// @author       deadYokai
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443685/Magnet2Torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/443685/Magnet2Torrent.meta.js
// ==/UserScript==

var $ = window.jQuery

$('a[href^="magnet:"]').each(function() {
    var href = $(this).attr('href');
    var hash = href.match(/btih:(.*?)&/)[1].toUpperCase();
    $(this).parent().append('<a style="display: block" href="https://itorrents.org/torrent/'+hash+'.torrent">Download .torrent</a>');
});