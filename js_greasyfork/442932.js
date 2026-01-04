// ==UserScript==
// @name             IMDB to RARBG Torrent Search
// @description      Click the RARBG-logo in the top left when on IMDB to search for the movie/series on RARBG
// @icon             https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @namespace        https://greasyfork.org/en/scripts/442932-imdb-to-rarbg-torrent-search
// @author           NotJ3st3r
// @copyright        2022, NotJ3st3r (https://github.com/NotJ3st3r)
// @license          MIT
// @include          https://www.imdb.com/*
// @version          1.2
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/442932/IMDB%20to%20RARBG%20Torrent%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/442932/IMDB%20to%20RARBG%20Torrent%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    getMovieId();

    if (movieId) {

        let div = document.createElement('div');
        div.innerHTML = '<a id="rarbgSearchButton"><img id="rarbg-logo" src="https://dyncdn.me/static/20/img/logo_dark_nodomain2_optimized.png"></a>';
      
        div.style.display = "grid";
        div.style.position = "fixed";
        div.style.left = "1rem";
        div.style.top = "calc(48px + 1rem)";
        div.style.zIndex = '9999';
        //div.innerHTML.style.width = "4rem";

        document.body.append(div);

        let logo = document.getElementById('rarbg-logo');
      
        logo.style.width = "4rem";
        
        let icon = document.getElementById('rarbgSearchButton');

        icon.style.background = 'transparent';
        icon.style.color = '#3860BB';     
        icon.style.fontWeight = '800';
        icon.style.padding = '0.2rem';
        icon.style.border = 'solid 0.2rem black';
        icon.style.borderRadius = '0.5rem';
        icon.style.textDecoration = 'none';
        icon.style.fontSize = '1rem';

        icon.href = 'https://rarbg.to/torrents.php?imdb=' + movieId;
        icon.target = '_blank';
    }

    var movieId;

    function getMovieId() {
        let x = window.location.pathname;
        let arr = x.split('/');

        for (let i = 0; i < arr.length; i++){
            if (arr[i].substring(0,2) === 'tt' || arr[i].substring(0,2) === 'TT') {
                movieId = arr[i];
            }
        }
    }

})();
