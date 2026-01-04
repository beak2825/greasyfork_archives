// ==UserScript==
// @name         Links on Amazon Prime Video - IMDB, Rotten Tomatoes, Metacritic, YouTube Trailers
// @description  Adds links for searching titles from amazon.com/video
// @version      0.2
// @author       mica
// @namespace    greasyfork.org/users/12559
// @include      https://www.amazon.com/gp/video/detail/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461396/Links%20on%20Amazon%20Prime%20Video%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/461396/Links%20on%20Amazon%20Prime%20Video%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.meta.js
// ==/UserScript==

$('head').append(`
<style>
    #sbox {margin: 0 0 -15px -10px}
    #sbox a {margin: 0 8px}
    #sbox img {width: 24px; height: 24px;}
</style>
`);
setTimeout(function() {
    var title = $('[data-automation-id|="title"]').text();
    if (title == '') {
        title = $('[data-testid|="title-art"]').find('img:first').attr('alt');
    }
    var mc = 'https://www.metacritic.com/search/all/' + encodeURIComponent(title.replace(/\*|\//g,' ')) + '/results';
    var imdb = 'https://www.imdb.com/find?s=tt&ref_=fn_tt&q=' + encodeURIComponent(title);
    var rt = 'https://www.rottentomatoes.com/search/?search=' + encodeURIComponent(title);
    var yt = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(title) + ' trailer'
     $('.dv-node-dp-badges:eq(1)').append([
        $('<div>').attr('id', 'sbox').append([
            $('<a>').attr('href', mc).attr('target', '_blank').html('<img src="https://www.metacritic.com/favicon.ico">'),
            $('<a>').attr('href', imdb).attr('target', '_blank').html('<img src="https://www.imdb.com/favicon.ico">'),
            $('<a>').attr('href', rt).attr('target', '_blank').html('<img src="https://www.rottentomatoes.com/assets/pizza-pie/images/favicon.ico">'),
            $('<a>').attr('href', yt).attr('target', '_blank').html('<img src="https://www.youtube.com/s/desktop/f4861452/img/favicon_32x32.png">')
        ])
    ]);
}, 2000);
