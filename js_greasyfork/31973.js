// ==UserScript==
// @name         CustomsForge min songs filter
// @license      WTFPL; http://www.wtfpl.net/
// @namespace    http://ttmyller.azurewebsites.net/
// @version      0.1
// @description  Add minimum songs filter to CustomsForge artist search
// @author       Teemu Myller
// @match        http://ignition.customsforge.com/search/artists
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31973/CustomsForge%20min%20songs%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/31973/CustomsForge%20min%20songs%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var minSongs = $('<span>Min songs: &nbsp; <select id="minSongs" /> &nbsp; </span>');
    var select = $('#minSongs', minSongs);
    for (var i=1; i<=50; i++) {
        $('<option value="' + i + '">' + i + '</option>').appendTo(select);
    }
    select.change(function() { hideArtistsWithSongsLessThan(this.value); });
    $('nav', '#content-header-artists').prepend(minSongs);
})();

function hideArtistsWithSongsLessThan(count) {
    if (count < 1) {
        $('a', '#artists-column').show();
    } else {
        var regex = /\((\d+)\)/;
        $('a', '#artists-column').each(function() {
            var item = $(this);
            var songs = parseInt(item.text().match(regex)[1]);
            if (songs < count) {
                item.hide();
            } else {
                item.show();
            }
        });
    }
}