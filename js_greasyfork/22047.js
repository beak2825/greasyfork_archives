// ==UserScript==
// @name         [TorrentProject.se] Quick Download
// @namespace    pxgamer
// @version      0.3.0
// @description  Adds quick download buttons to TorrentProject.se
// @author       pxgamer
// @include      *torrentproject.se/*
// @exclude      *torrentproject.se/torrent/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22047/%5BTorrentProjectse%5D%20Quick%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/22047/%5BTorrentProjectse%5D%20Quick%20Download.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    const iTorrentsUsage = true;

    const iTurl = '';
    if (iTorrentsUsage) {
        iTurl = 'https://itorrents.org';
    }

    $('#res').prepend('<span id="dl_all" class="torrent" style="cursor: pointer;"><span class="download_torrent" title="Download all torrents">&nbsp;&nbsp;</span> Download All</span>');
    $('.torrent h3.r a[href^="https://torrentproject.se/"][href$="-torrent.html"]').each( function() {
        let torrentHash = $(this).attr('href').split('/')[3].toUpperCase();
        $(this).before('<a class="dl_link_new" style="text-decoration: none;" href="'+iTurl+'/torrent/'+torrentHash+'.torrent"><span class="download_torrent" title="'+torrentHash+'">&nbsp;&nbsp;</span></a><a class="mag_link_new" style="text-decoration: none;" href="magnet:?xt=urn:btih:'+torrentHash+'&tr=http://109.121.134.121:1337/announce&tr=http://5.79.83.193:2710/announce&tr=http://bt.artvid.ru:6969/announce&tr=http://explodie.org:6969/announce&tr=http://retracker.krs-ix.ru/announce&tr=http://tracker.internetwarriors.net:1337/announce&tr=http://tracker.mgtracker.org:2710/announce&tr=http://tracker.opentrackr.org:1337/announce&tr=http://tracker.skyts.net:6969/announce&tr=http://www.opentrackr.org/announce&tr=udp://178.33.73.26:2710/announce&tr=udp://explodie.org:6969/announce&tr=udp://mgtracker.org:6969/announce&tr=udp://open.acgtracker.com:1096/announce&tr=udp://p4p.arenabg.ch:1337/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://retracker.krs-ix.ru:80/announce&tr=udp://tracker.aletorrenty.pl:2710/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.dler.org:6969/announce&tr=udp://tracker.leechers-paradise.org:6969/announce&tr=udp://tracker.mg64.net:2710/announce&tr=udp://tracker.mg64.net:6881/announce&tr=udp://tracker.mg64.net:6969/announce&tr=udp://tracker1.wasabii.com.tw:6969/announce&tr=udp://zer0day.ch:1337/announce"><span class="download_magnet" title="'+torrentHash+' magnet link">&nbsp;</span></a> ');
    });

    $('#dl_all').on('click', function(){
        $('.dl_link_new').each(function(){
            let newWindow = window.open($(this).attr('href'), '_blank');
        });
    });
})();
