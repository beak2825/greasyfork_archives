// ==UserScript==
// @name         Links on Netflix - IMDB, Rotten Tomatoes, Metacritic, YouTube Trailers
// @description  Adds links for searching titles from netflix.com
// @version      1.0
// @author       mica
// @namespace    greasyfork.org/users/12559
// @include      https://www.netflix.com/browse*
// @include      https://www.netflix.com/title/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443695/Links%20on%20Netflix%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/443695/Links%20on%20Netflix%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.meta.js
// ==/UserScript==

$('head').append(`
    <style>
        #sbox {margin: 4px 0 0 4px}
        #sbox a {margin: 0 8px}
        #sbox img {width: 24px; height: 24px;}
    </style>
`);
var url;
setInterval(function() {
    if (url != location.href) {
        url = location.href;
        $('#sbox').remove();
        setTimeout(function() {
            var title = $('.about-header > h3 > strong').text();
            var year = $('.year:first').text();
            var rt = 'https://www.rottentomatoes.com/tv/' + encodeURIComponent(title.replaceAll(' ','_'))
            var rtm = 'https://www.rottentomatoes.com/m/' + encodeURIComponent(title.replaceAll(' ','_'))
            $('[data-uia|="videoMetadata--container"]:first').append([
                $('<div>').attr('id', 'sbox').append([
                    $('<a>').attr('href', rt).attr('target', '_blank').html('<img src="https://www.rottentomatoes.com/favicon.ico">'),
                    $('<a>').attr('href', rtm).attr('target', '_blank').html('<img src="https://img.icons8.com/external-flat-juicy-fish/2x/external-popcorn-film-making-flat-flat-juicy-fish.png">'),
                ])
            ]);
        }, 1000);
    }
}, 100);
