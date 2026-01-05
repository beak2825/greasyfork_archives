// ==UserScript==
// @name         Sort Uploads Alphabetically
// @namespace    pxgamer
// @version      0.2
// @description  Sort user uploads alphabetically
// @author       pxgamer
// @include      *kat.cr/user/*/uploads/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19572/Sort%20Uploads%20Alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/19572/Sort%20Uploads%20Alphabetically.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rows = [];

    $('tr.firstr th.width100perc.nopad').html(
        '<a class="sortAlpha">torrent name</a>'
    );

    $('.data tr[id^="torrent_"]').each(function() {
        var title = $('.cellMainLink', $(this)).text();
        var html = $(this).html();
        rows.push({"title":title, "html":html});
    });

    $('.sortAlpha').on('click', function() {
        var sortName = 'title';
        var sortType = 'desc';
        sortTable(sortName, sortType);
    });

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if (typeof x == "string") {
                x = x.toLowerCase();
                y = y.toLowerCase();
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function sortTable(sortName, sortType) {
        sortByKey(rows, sortName);
        if (!sortType) {
            rows.reverse();
        }
        $('.data tr[id^="torrent_"]').remove();
        for (var i=0;i<rows.length;i++) {
            $('.data').append('<tr id="torrent_'+i+'">'+rows[i].html+'</tr>');
        }

    }
})();
