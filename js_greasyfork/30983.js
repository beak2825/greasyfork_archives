// ==UserScript==
// @name         TPB Torrent Downloads Fork
// @version      0.6
// @description  Piratebay download via torrents
// @include      *thepiratebay.se/*
// @include      *thepiratebay.org/*
// @require        https://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/59385
// @downloadURL https://update.greasyfork.org/scripts/30983/TPB%20Torrent%20Downloads%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/30983/TPB%20Torrent%20Downloads%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a[href^="magnet:"]').each(function() {
        var hash = $(this).attr('href').split(":")[3];
        hash = hash.split("&")[0];
        $(this).after('<br/><a href="https://thetorrent.org/'+hash+'.torrent" title="Download using torrent file">Download torrent file</a>');
    });
})();