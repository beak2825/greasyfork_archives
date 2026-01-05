// ==UserScript==
// @name        IPTorrents thumbs
// @namespace   com.iptorrents.omdb
// @description Adds thumbs on list pages for movies & tv-shows via omdbapi
// @include     https://iptorrents.com/t*
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19763/IPTorrents%20thumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/19763/IPTorrents%20thumbs.meta.js
// ==/UserScript==

$(document).ready( function() {
    $('.torrents tr a[href*="details"].b').each(
    function () {
        var el = $(this).parent().prev().find('img');
        var url = $(this).prop('href');
        $.ajax({ url: url })
            .done(function (data) {
            var i = data.substring(data.indexOf('imdb.com') + 15, data.indexOf('imdb.com') + 24);
            $.getJSON('//www.omdbapi.com/?i=' + i)
                .done(function (api) {
                    if(typeof api !== 'undefined' && typeof api.Poster !== 'undefined' && api.Poster.length > 3)
                    {
                        $(el).prop('src', api.Poster); 
                        $(el).prop('height', 135);
                    }
                });
        });
    });
});