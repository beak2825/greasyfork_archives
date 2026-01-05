// ==UserScript==
// @name         T411 - Download torrents from search
// @name:fr      T411 - Download torrents from search
// @namespace    https://greasyfork.org/en/scripts/10550-t411-search-downloader
// @version      1.1.3
// @description  Simple script to download torrents directly from the search page on T411
// @description:fr  Ce script vous permet de télécharger des torrents directement depuis la page de recherche / les listes de torrents.
// @author       Mato
// @match        *://*.t411.al/torrents/search/*
// @match        *://*.t411.al/top/week/*
// @match        *://*.t411.al/top/today/*
// @match        *://*.t411.al/top/month/*
// @match        *://*.t411.al/my/bookmarks/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/10550/T411%20-%20Download%20torrents%20from%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/10550/T411%20-%20Download%20torrents%20from%20search.meta.js
// ==/UserScript==

var icon = 'http://img15.hostingpics.net/pics/151761download512000000.png';

$(document).ready(function() {
    $data = $('table.results tbody tr');

    // nfo link differs if on bookmark page
    if (document.URL.match('bookmarks') !== null) {
        $nfoChild = 4;
    } else {
        $nfoChild = 3;
    }

    // add download column
    $('table.results thead tr th:last-child').after('<th>DL</th>');

    $.each($data, function(index, val) {
        $tid = $(val).find('td:nth-child(' + $nfoChild + ') a').attr('href').match(/\?id=(.+)/);

        $(val).find('td:last-child').after('<td><span style="float: right; padding-right: 10px;"><a href="' + window.location.origin + '/torrents/download/?id=' + $tid[1] + '"><img src="'+icon+'" title="Télécharger le torrent" alt="↓ Download" /></a></span></td>');
    });
});
