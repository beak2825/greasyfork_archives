// ==UserScript==
// @name        IMDb Netflix Button
// @namespace   https://tesomayn.com
// @description Adds Netflix Button 
// @include     http://*.imdb.com/title/*/
// @include     http://*.imdb.com/title/*/?*
// @include     http://*.imdb.com/title/*/maindetails
// @include     http://*.imdb.com/title/*/combined
// @include     http://imdb.com/title/*/
// @include     http://imdb.com/title/*/maindetails
// @include     http://imdb.com/title/*/combined
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12219/IMDb%20Netflix%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/12219/IMDb%20Netflix%20Button.meta.js
// ==/UserScript==

$(document).ready( function() {
    $('.launch-share-popover').hide();
    var header     = $('#overview-top h1.header');
    var movieTitle = $('span.itemprop', header).text();
    var movieYear  = $('span.nobr > a', header).text();
    $.ajax({
        url: 'http://netflixroulette.net/api/api.php?title=' + movieTitle + '&year=' + movieYear + '',
        dataType: 'json',
        success: function (data) {
            var nID = data['show_id'];
            $('td#overview-bottom').append('<a href="http://netflix.com/watch/' + nID + '" id="netflix" class="btn2 primary btn2_text_on large title-trailer" itemprop="netflix" target="_new"><span class="btn2_text">Netflix</span></a>');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status==404) {
                $('td#overview-bottom').append('<a href="javascript:void();" id="netflix" class="btn2 primary btn2_text_on large title-trailer disabled" itemprop="netflix" target="_new"><span class="btn2_text">Netflix</span></a>');
            }
        }
    });
})