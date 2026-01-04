// ==UserScript==
// @name         IMDB Streaming Search (Netflix, Hulu, Amazon)
// @namespace    https://greasyfork.org/en/users/95954
// @version      1.01
// @description  Add streaming platform search function to IMDB page.
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @include			http://*.imdb.com/title/*/
// @include			http://*.imdb.com/title/*/?*
// @include			http://*.imdb.com/title/*/maindetails
// @include			http://*.imdb.com/title/*/combined
// @include			http://imdb.com/title/*/
// @include			http://imdb.com/title/*/maindetails
// @include			http://imdb.com/title/*/combined
// @downloadURL https://update.greasyfork.org/scripts/34363/IMDB%20Streaming%20Search%20%28Netflix%2C%20Hulu%2C%20Amazon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34363/IMDB%20Streaming%20Search%20%28Netflix%2C%20Hulu%2C%20Amazon%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.subtext').prepend('<button id="netflix-search" style="margin: 0 0 20px; font-size: 10px; color: White; font-weight: bold; padding:4px;"></button><button id="hulu-search" style="margin: 0 0 20px; font-size: 10px; color: White; font-weight: bold; padding:4px;"></button><button id="amazon-search" style="margin: 0 0 20px; font-size: 10px; color: White; font-weight: bold; padding:4px;"></button></br>');
    $('#netflix-search').text('Search Netflix');
    $('#netflix-search').css('background-color', 'red');
    $("#netflix-search").click(netflixSearch);
    $('#hulu-search').text('Search Hulu');
    $('#hulu-search').css('background-color', 'green');
    $("#hulu-search").click(huluSearch);
    $('#amazon-search').text('Search Amazon');
    $('#amazon-search').css('background-color', 'orange');
    $("#amazon-search").click(amazonSearch);
    var ab = document.getElementsByClassName('title_wrapper');
    var searchstring = ab[0].children[0].textContent.replace(/ *\([^)]*\) */g, "");
    function netflixSearch()
    {
        window.open('https://www.netflix.com/search?q='+searchstring.replace(/\s+$/, ''));
    }
    function huluSearch()
    {
        window.open('https://www.hulu.com/search?q='+searchstring.replace(/\s+$/, ''));
    }
    function amazonSearch()
    {
        window.open('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dprime-instant-video&field-keywords='+searchstring.replace(/\s+$/, ''));
    }
})();