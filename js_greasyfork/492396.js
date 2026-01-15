// ==UserScript==
// @name         RARGB Search - YIFY Movies
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      10
// @description  Adds a button on YTS movie pages to search the movie title on RARGB.
// @author       hacker09
// @include      https://yts.*/movies/*
// @icon         https://yts.*/assets/images/website/apple-touch-icon-180x180.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492396/RARGB%20Search%20-%20YIFY%20Movies.user.js
// @updateURL https://update.greasyfork.org/scripts/492396/RARGB%20Search%20-%20YIFY%20Movies.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".button-green-download2-big.hidden-xs.hidden-sm").insertAdjacentHTML('afterend', `<a onclick="document.querySelector('.modal-download').style.display = 'none'; location.href='https://rargb.to/search/?search=${document.querySelector('.hidden-xs > h1').innerText.replaceAll(/[^a-zA-Z0-9\s]/g, '').toLowerCase()}&category[]=movies';" class="torrent-modal-download button-green-download2-big hidden-xs hidden-sm" href="javascript:void(0);"><span class="icon-in"></span>Search on RARGB</a>`);  //Adds a button on YTS movie pages to search the movie title RARGB and hides the download modal
})();