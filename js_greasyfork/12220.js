// ==UserScript==
// @name        IMDB Watchlist on Netflix?
// @namespace   http://rasmuswriedtlarsen.com
// @description Add Netflix availablity to IMDB watchlist
// @include     http://*.imdb.com/user/*/watchlist*
// @version     0.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12220/IMDB%20Watchlist%20on%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/12220/IMDB%20Watchlist%20on%20Netflix.meta.js
// ==/UserScript==

// Not always accurate :(

// Based on https://greasyfork.org/en/scripts/10290-imdb-title-y-n-on-netflix/code
// and button from https://greasyfork.org/en/scripts/12219-imdb-netflix-button/code

(function(){
    $('.lister-item-header').each( function(){
        //used for span id, as it cannot contain spaces
        var title_ref_re = /\/title\/(.*?)\//;

        var header = $(this);
        var title = $('a',this).text();
        var title_ref = title_ref_re.exec( $('a',this).attr('href') )[1];
        var year = /\d+/.exec($('.lister-item-year', this).text())[0];

        var spanTitle = "netflix-checker-"+title_ref;
        $(header).append('<span id=\''+spanTitle+'\' style=\'font-size: 10px; color: White; font-weight: bold; padding:4px;\'></span>');
        $.ajax({ url: 'http://netflixroulette.net/api/api.php?title=' + title + '&year=' + year
        }).done(function(data) {
            var nID = data['show_id'];

            $('#'+spanTitle).html('<a href="http://netflix.com/watch/' + nID + '" target="_new" style="color: #fff;text-decoration: underline;">On Netflix</a>');
            $('#'+spanTitle).css('background-color', 'green');
        }).error(function(err) {
            $('#'+spanTitle).text('Not on Netflix');
            $('#'+spanTitle).css('background-color', 'red');});
        console.log(title+"|"+year);
    }
);
})();
