// ==UserScript==
// @name         T411 - Download torrents from search/ Update .CH 
// @name:fr      T411 - Télécharger des Torrent depuis la recherche mise à Jour CH
// @namespace    https://greasyfork.org/en/scripts/10550-t411-search-downloader
// @version      1.0.5.9
// @description  Simple script to download torrents directly from the search page on T411
// @description:fr  Ce script vous permet de télécharger des torrents directement depuis la page de recherche / les listes de torrents.
// @author          76mickaelmyer83
// @include        *.t411.ch/torrents/*
// @include        *.t411.ch/top/*
// @grant        None
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/18270/T411%20-%20Download%20torrents%20from%20search%20Update%20CH.user.js
// @updateURL https://update.greasyfork.org/scripts/18270/T411%20-%20Download%20torrents%20from%20search%20Update%20CH.meta.js
// ==/UserScript==

var icon = 'http://www.den4b.com/images/download.png';

$(document).ready(function() {
    $data = $('table.results tbody tr');
    
    // tweak css
    $('table.results tbody tr td:nth-child(2) a:nth-child(1)').css({
        'width': '87%',
        'display': 'inline-block',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis'
    });
    
    $.each($data, function(index, val) {
        $tid = $(val).find('td:nth-child(3) a').attr('href').match(/\?id=(.+)/);

        $(val).find('td:nth-child(2) a:nth-child(2)').after('<span style="float: right; padding-right: 10px;"><a href="' + window.location.origin + '/torrents/download/?id=' + $tid[1] + '"><img src="'+icon+'" title="Télécharger le torrent" alt="↓ Download" /></a></span>');
    });
});