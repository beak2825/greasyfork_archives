// ==UserScript==
// @name         Reformat transfermarkt fixtures
// @namespace    com.seaders
// @version      0.1
// @description  try to make things look a little better / how I want them to look
// @author       seaders
// @include      *.transfermarkt.co.uk/*/spielplandatum/*
// @include      *.transfermarkt.us/*/spielplandatum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397964/Reformat%20transfermarkt%20fixtures.user.js
// @updateURL https://update.greasyfork.org/scripts/397964/Reformat%20transfermarkt%20fixtures.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var $ = window.jQuery;

function leagueSpan(img) {
    img.addClass('wettbewerblogo');
    return $('<span>&nbsp;' + img.attr('title').split(/[ -]/).map(s => s.length < 3 ? s : s[0]).join('') + '</span>');
}

(function() {
    'use strict';

    $('html > head').append($('<style>table { width: inherit; }</style>'));
    $('.tabellenplatz').hide();

    var img;
    var league;

    var table = $($('.responsive-table')[0]).find('tr').each((i, _tr) => {
        var tr = $(_tr);

        if(i == 0) {
            tr.hide();
        } else {
            var tds = tr.find('td');

            if(1 == tds.length) {
                img = tr.find('img');
                league = leagueSpan(img);
                tr.hide();
            } else {
                var td = $(tds[0]);

                td.empty();

                img.clone().appendTo(td);
                league.clone().appendTo(td);

                [2, 4, 7, 8].forEach(j => $(tds[j]).hide());
            }
        }
    });
})();