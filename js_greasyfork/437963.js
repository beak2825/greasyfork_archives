// ==UserScript==
// @name         Links on Disney+ - IMDB, Rotten Tomatoes, Metacritic, YouTube Trailers
// @description  Adds links for searching titles from disneyplus.com
// @version      0.7
// @author       mica
// @namespace    greasyfork.org/users/12559
// @include      https://www.disneyplus.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437963/Links%20on%20Disney%2B%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/437963/Links%20on%20Disney%2B%20-%20IMDB%2C%20Rotten%20Tomatoes%2C%20Metacritic%2C%20YouTube%20Trailers.meta.js
// ==/UserScript==

$('head').append(`
<style>
    #sbox {margin-left: 10px}
    #sbox a {margin-left: 15px}
    #sbox img {width: 24px; height: 24px;}
</style>
`);
var url
function checkReady() {
    if (document.getElementsByTagName('body')[0].getAttribute('style') == null) {
        setTimeout(checkReady, 1000);
    } else {
        setInterval(function() {
            if (url != location.href) {
                url = location.href;
                $('#sbox').remove();
                setTimeout(function() {
                    var title = $('h1').text();
                    var mc = 'https://www.metacritic.com/search/all/' + encodeURIComponent(title.replace(/\*|\//g,' ')) + '/results';
                    var imdb = 'https://www.imdb.com/find?s=tt&ref_=fn_tt&q=' + encodeURIComponent(title);
                    var rt = 'https://www.rottentomatoes.com/search/?search=' + encodeURIComponent(title);
                    var yt = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(title) + ' trailer'
                    $('div.metadata.text-color--primary').children('div').eq(0).append([
                        $('<div>').attr('id', 'sbox').append([
                            $('<a>').attr('href', mc).attr('target', '_blank').html('<img src="https://www.metacritic.com/favicon.ico">'),
                            $('<a>').attr('href', imdb).attr('target', '_blank').html('<img src="https://www.imdb.com/favicon.ico">'),
                            $('<a>').attr('href', rt).attr('target', '_blank').html('<img src="https://www.rottentomatoes.com/assets/pizza-pie/images/favicon.ico">'),
                            $('<a>').attr('href', yt).attr('target', '_blank').html('<img src="https://www.youtube.com/s/desktop/f4861452/img/favicon_32x32.png">')
                        ])
                    ]);
                }, 2000);
            }
        }, 100);
    }
}
checkReady();
