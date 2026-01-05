// ==UserScript==
// @name         Filter Uploads by UL Status
// @namespace    pxgamer
// @version      0.2
// @description  Filter uploads by the uploader's status (Uploader, Verified Uploader, Elite Uploader)
// @author       pxgamer
// @include      *kat.cr/new/*
// @include      *kat.cr/usearch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19715/Filter%20Uploads%20by%20UL%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/19715/Filter%20Uploads%20by%20UL%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.data').before('<div class="buttonsline"><select id="ul-status-select" style="letter-spacing: 0px; width: 160px !important;"><option value="all">Show All Uploaders</option><option value="uploader">Show only Normal Uploaders</option><option value="verified">Show only Verified Uploaders</option><option value="elite">Show only Elite Uploaders</option></select> <button class="siteButton bigButton" id="sortUlStatus"><span>Sort</span></button></div>');

    $('#sortUlStatus').on('click', function() {
        var ulSortType = $('#ul-status-select').val();

        switch (ulSortType) {
            case 'all':
                $('table.data tr').show();
                $('.ka.ka-verify').parent().parent().parent().parent().show();
                break;
            case 'uploader':
                $('table.data tr').show();
                $('.ka.ka-verify').parent().parent().parent().parent().hide();
                $('.ka.ka-star').parent().parent().parent().parent().parent().hide();
                break;
            case 'verified':
                $('table.data tr').hide();
                $('.ka.ka-verify').parent().parent().parent().parent().show();
                break;
            case 'elite':
                $('table.data tr').hide();
                $('.ka.ka-star').parent().parent().parent().parent().parent().show();
                break;
            default:
                $('table.data tr').show();
                break;
        }
    });
})();
