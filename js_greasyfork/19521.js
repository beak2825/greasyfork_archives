// ==UserScript==
// @name         Download History Search
// @namespace    pxgamer
// @version      0.3
// @description  Search your account downloads.
// @author       pxgamer
// @include      *kat.cr/account/history/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19521/Download%20History%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/19521/Download%20History%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('div.buttonsline').append(' <input type="text" id="historySearch" style="border-radius: 2px; padding: 3px 13px 3px; margin-top: 1px;"> <button class="siteButton bigButton searchFor ka ka-search"></button>');
    $('.searchFor').on('click', function() {
        $('#wrapperInner div.mainpart table tbody tr td:nth-child(1) table tbody tr td:nth-child(2) div.markeredBlock.torType a.cellMainLink').each(function() {
            $(this).parent().parent().parent().show();
        });
        var searchParam = $('input#historySearch').val().toLowerCase();
        $('#wrapperInner div.mainpart table tbody tr td:nth-child(1) table tbody tr td:nth-child(2) div.markeredBlock.torType a.cellMainLink').each(function() {
            var list = searchParam.split(' ');
            for (var i=0; i<list.length; ++i) {
                if ($(this).html().toLowerCase().indexOf(list[i]) === -1) {
                    $(this).parent().parent().parent().hide();
                }
            }
        });
    });
})();
