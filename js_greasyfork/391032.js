// ==UserScript==
// @name     PTP artist links
// @namespace   conquerist2@gmail.com
// @include  https://passthepopcorn.me/*
// @description Add links to seen and most popular movies of actors to movie page
// @version  2
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/391032/PTP%20artist%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/391032/PTP%20artist%20links.meta.js
// ==/UserScript==
// 2020 04 17 v2.0 -- Added links to artist page headings
// 2018 12 29 v1.0 -- Initial Version

//var artist_link_tds = document.querySelectorAll('td.movie-page__actor-column');
var artist_link_tds = document.querySelectorAll('a.artist-info-link');


if(artist_link_tds) {
  for(var i = 0; i < artist_link_tds.length; i++){
    //url = artist_link_tds[i].querySelector('a').href;
    url = artist_link_tds[i].href;
    console.log(i + ': ' + url);
    artist_link_tds[i].innerHTML += ' <small>[<a href="' + url + '&seen=seen">seen</a>]</small>'
                                  + ' <small>[<a href="' + url + '&order_by=imdbvotes&order_way=&seen=">popular</a>]</small>';
  }
}

var heading_artist = document.querySelector('#artist h2.page__title');
url = window.location.href;

if(heading_artist) {
  heading_artist.innerHTML += ' <small>[<a href="' + url + '&seen=seen">seen</a>]</small>'
                            + ' <small>[<a href="' + url + '&order_by=imdbvotes&order_way=&seen=">popular</a>]</small>';
}