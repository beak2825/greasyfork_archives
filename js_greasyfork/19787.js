// ==UserScript==
// @name         Download All Torrents or Magnets
// @namespace    pxgamer
// @version      0.1
// @description  Adds buttons to download all torrents or magnets on a page.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19787/Download%20All%20Torrents%20or%20Magnets.user.js
// @updateURL https://update.greasyfork.org/scripts/19787/Download%20All%20Torrents%20or%20Magnets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = "";
    $('#mainSearchTable').before('<button class="siteButton bigButton downloadAll" data-dl-type="torrent">Download All With Torrent</button> <button class="siteButton bigButton downloadAll" data-dl-type="magnet">Download All With Magnet</button>');

    $('.downloadAll').click(function () {
        switch ($(this).attr('data-dl-type')) {
            case 'magnet':
                $('a.icon16.askFeedbackjs[data-nop][href^="magnet:?xt="]').each(function () {
                    url = $(this).attr('href');
                    open(url);
                });
                break;
            case 'torrent':
                $('a.icon16.askFeedbackjs[data-download][href^="/torrents/"]').each(function () {
                    url = $(this).attr('href');
                    open(url);
                });
                break;
            default:
                console.info('No Method Selected');
        }

    });
})();
