// ==UserScript==
// @name         Bakabt Improver
// @version      0.1.2
// @description  Some simple improvements for easier browsing bakabt
// @author       Cholik
// @match        https://www.bakabt.me/*
// @grant        none
// @namespace https://greasyfork.org/users/201363
// @downloadURL https://update.greasyfork.org/scripts/370934/Bakabt%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/370934/Bakabt%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var userlink = '',
        backgroundColor = '#a7b5db',
        knownTorrents = [],
        updateInterval = 5, //in minutes
        $ = window.$;

    if(document.location.pathname == '/browse.php') {
        updateKnownTorrents();
    }

    function markKnownTorrents() {
        if(knownTorrents.length > 0) {
            var alt = null;
            for(var i = 0; i < knownTorrents.length; i++) {
                alt = null;
                $('tr.torrent[data-torrentid="' + knownTorrents[i] + '"]').attr('style', 'background-color:' + backgroundColor);
                alt = $('tr.torrent_alt[data-torrentid="' + knownTorrents[i] + '"]');
                if($('tr.torrent_alt[data-torrentid="' + knownTorrents[i] + '"]').length) {
                    while(alt.hasClass('torrent_alt')) {
                        alt.attr('style', 'background-color:' + backgroundColor);
                        alt = alt.next();
                    }
                }
            }
        }
    }

    function updateKnownTorrents() {
        if(!needUpdate()) {
            markKnownTorrents();
            return;
        }
        var user = $('.username');
        if(user.length) {
            userlink = 'https://www.bakabt.me/' + user.attr('href');

            $.ajax({
                type: 'GET',
                url: userlink,
                success: function(res, success) {
                    var body = $(res);
                    knownTorrents = [];
                    body.find('tr.torrent').each(function(index, item){
                        knownTorrents.push(item.getAttribute('data-torrentid'));
                    });

                    localStorage.setItem('BI_needUpdate', Date.now());
                    localStorage.setItem('BI_knownTorrents', JSON.stringify(knownTorrents));
                    markKnownTorrents();
                }
            });
        }
    }

    function needUpdate() {
        var update = false;
        var lastUpdate = localStorage.getItem('BI_needUpdate');
        knownTorrents = JSON.parse(localStorage.getItem('BI_knownTorrents'));
        if(!lastUpdate) {
            update = true;
        }
        else {
            if(((Date.now() - lastUpdate) / 1000 / 60) > updateInterval) {
                update = true;
            }
        }

        return update;
    }
})();