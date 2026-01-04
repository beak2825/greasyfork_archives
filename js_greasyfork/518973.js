// ==UserScript==
// @name        PTP: copy title + links
// @namespace   Violentmonkey Scripts
// @match       https://passthepopcorn.me/torrents.php*
// @grant       none
// @version     0.1.3
// @author      -
// @description click ## beside the page heading
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518973/PTP%3A%20copy%20title%20%2B%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/518973/PTP%3A%20copy%20title%20%2B%20links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const header = document.querySelector('h2.page__title');
  const title  = header.textContent;
  const imdb_link   = document.querySelector('#imdb-title-link');
  var imdb = '';
  if (imdb_link) {
    imdb = imdb_link.href.replace('http:', 'https:');
  }
  const url    = window.location.toString().split('&')[0];

  const output = `${title}  ${url} ${imdb}`;

  header.insertAdjacentHTML('beforeEnd', `<span style="opacity: 50%;"> | <a id="copytitle" href="#">##</span> </span>`);

  function copy_title(evt) {
    evt.preventDefault();
    navigator.clipboard.writeText(output);
  }
  document.querySelector('#copytitle').addEventListener('click', copy_title, false);

})();