// ==UserScript==
// @name         Reformat transfermarkt player
// @namespace    com.seaders
// @version      0.1
// @description  try to make things look a little better / how I want them to look
// @author       seaders
// @include      *.transfermarkt.co.uk/*/leistungsdaten/spieler/*
// @include      *.transfermarkt.us/*/leistungsdaten/spieler/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397962/Reformat%20transfermarkt%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/397962/Reformat%20transfermarkt%20player.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var $ = window.jQuery;

function toDate(tr) {
    var bits = $('td:nth-child(2)', tr).text().split('/');
    return new Date('20' + bits[2], bits[0], bits[1]);
}

function leagueSpan(img) {
    img.addClass('wettbewerblogo');
    return $(
        '<span> ' +
        img
          .attr('title')
          .split(/[ -]/)
          .map(s => s.length < 3 ? s : s[0])
          .join('') +
        '</span>');
}

function maybeAddTo(img, tds, i) {
    var td = $(tds[tds.length - i]);
    var tx = td.text().trim();
    if (tx) {
        td.text(`${tx} `);
        img.clone().appendTo(td);
    }
}

(function() {
    'use strict';
    $('html > head').append($('<style>table { width: inherit; }</style>'));

    var tbody, goal, assist;
    $('.large-8.columns .box').each((i, box) => {
        var start = 2;
        var table = $('table', box);

        if (i >= start) {
            var isFirst = i == start;
            var firstTr = $('tr:first-child', box);

            if (isFirst) {
                tbody = $('tbody', box);

                goal = $('span[title="Goals"]', firstTr);
                assist = $('span[title="Assists"]', firstTr);
            }

            var td = $('<td class="zentriert">');
            var img = $($('img', box)[0]);
            img.appendTo(td);
            leagueSpan(img).appendTo(td);

            var trs = $('tr', box);
            var lastI = trs.length - 1;

            trs.each((j, tr) => {
                if ($('td', tr).length == 1) {
                    $(tr).remove();
                } else if ((j > 0) && (j < lastI)) {
                    $('td:first-child a', tr).remove();
                    td.clone().prependTo(tr);

                    var tds = $('td', tr);
                    $(tds[1]).remove();

                    var doubler = $('td[colspan="2"]', tr);
                    if(doubler.length) {
                        doubler.remove();
                    } else {
                        [4, 5].forEach(k => $(tds[k]).remove());
                    }

                    var injury = $('td[colspan="8"]', tr);
                    if(injury.length) {
                        injury.attr('colspan', 5);
                    } else {
                        [2, 3, 4, 7].forEach(k => $(tds[tds.length - k]).remove());
                        maybeAddTo(goal, tds, 6);
                        maybeAddTo(assist, tds, 5);
                    }

                    $(tr).appendTo(tbody);
                }
            });

            if (isFirst) {
                firstTr.remove();
                $('.table-header', box).remove();
            } else {
                $(box).remove();
            }
        }
    });

    tbody
      .find('tr')
      .sort((a, b) => toDate(a) > toDate(b) ? 1 : -1)
      .appendTo(tbody);
})();
