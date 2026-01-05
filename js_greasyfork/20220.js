// ==UserScript==
// @name         Grab All Uploads Info
// @namespace    pxgamer
// @version      0.6
// @description  Grabs a list of all uploads and their data for a certain user.
// @author       pxgamer
// @include      *kat.cr/user/*/uploads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20220/Grab%20All%20Uploads%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/20220/Grab%20All%20Uploads%20Info.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var generateTable = false; // Will choose whether to generate a table at the end.

    // Defines vars
    var defined = {
        first_page: '1',
        last_page:  $('.pages a.turnoverButton.siteButton.bigButton[rel="nofollow"]:last').text(),
        data_list: [],
        user: location.href.split('/')[4],
        data_type: location.href.split('/')[6]
    };
    var eMatch = { titles: [], magnets: [], torrents: [], urls: [] };
    if (defined.last_page === '') { defined.last_page = '1'; }

    $('h2').after('<span class="siteButton bigButton grabUploadsList">Grab uploads list</span>');

    $('.grabUploadsList').on('click', function() {
        console.log('Constructing List. Please wait...');
        console.info(defined);

        for (var i = 1; i <= defined.last_page; i++) {
            var url        = 'https://kat.cr/user/'+defined.user+'/uploads/'+defined.data_type+'?page=' + i;
            var ss_title   = /<a href="\/.*-t[0-9]+.html" class="cellMainLink">(.*)<\/a>/ig;
            var ss_url     = /<a href="(\/.*-t[0-9]+.html)" class="cellMainLink">.*<\/a>/ig;
            var ss_magnet  = /<a data-nop title="Torrent magnet link" href="(magnet:\?xt=urn:btih:.*)" class="/ig;
            var ss_torrent = /<a data-download title="Download torrent file" href="(\/torrents\/.*-t[0-9]+\/)" class="/ig;
            var ss_delhash = /<a href="javascript: undeleteTorrent\('[0-9]+', '([A-Z0-9]+)', true\)/ig;
            var matches;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                success: function (data) {
                    var e = 0;
                    while (matches = ss_title.exec(data.html)) {
                        eMatch.titles.push(matches[1]);
                    }
                    while (matches = ss_url.exec(data.html)) {
                        eMatch.urls.push('https://kat.cr' + matches[1]);
                    }
                    if (defined.data_type == 'deleted') {
                        while (matches = ss_delhash.exec(data.html)) {
                            eMatch.magnets.push('magnet:?xt=urn:btih:'+matches[1]);
                            eMatch.torrents.push('https://torcache.net/torrent/' + matches[1] + '.torrent');
                        }
                    }
                    else {
                        while (matches = ss_magnet.exec(data.html)) {
                            eMatch.magnets.push(matches[1]);
                        }
                        while (matches = ss_torrent.exec(data.html)) {
                            eMatch.torrents.push('https://kat.cr' + matches[1]);
                        }
                    }
                },
                returnData: "json"
            });
        }

        for (var k = 0; k < eMatch.titles.length; k++) {
            defined.data_list.push({
                title: eMatch.titles[k],
                magnet: eMatch.magnets[k],
                torrent: eMatch.torrents[k],
                url: eMatch.urls[k]
            });
        }
        if (generateTable) {
            // Generating HTML table
            $('table.data tbody').html('');
            $('h2').text('All Torrents');
            $('div.pages.botmarg5px.floatright').html('');
            $('table.data tbody').append('<tr class="firstr"><th class="width100perc nopad">torrent name</th><th class="center">magnet</th><th class="center">torrent</th><th class="center">link</th></tr>');
            for (var j = 0; j < defined.data_list.length; j++) {
                $('table.data tbody').append('<tr><td>'+defined.data_list[j].title+'</td><td style="overflow: hidden; max-width: 300px;">'+defined.data_list[j].magnet+'</td><td>'+defined.data_list[j].torrent+'</td><td>'+defined.data_list[j].url+'</td></tr>');
            }
        }
        else {
            console.info(defined.data_list);
        }
    });
})();
