// ==UserScript==
// @name        IMDb to TBD
// @description Adds a link to IMDB page to search TBD for the movie.
// @namespace   IMDBtoTBDLink
// @include     *imdb.com/title/*
// @grant       none
// @version 0.0.1.20191123112054
// @downloadURL https://update.greasyfork.org/scripts/392819/IMDb%20to%20TBD.user.js
// @updateURL https://update.greasyfork.org/scripts/392819/IMDb%20to%20TBD.meta.js
// ==/UserScript==

document.onreadystatechange = (function () {
  if (document.readyState == 'complete' || document.readyState == 'interactive') {
    const url = location.href;
    const imdbId = url.split('tt')[2].substring(0, 8).replace(/\/$/, "");

    const parentElement = document.getElementById('titleYear');
    const childElement = document.createElement('span');
    childElement.id = 'tbdlink';
    childElement.innerHTML = '<a href="https://www.torrentbd.net/torrent/movies.php?module=torrents&id=' + imdbId + '"target="_blank"><img src="https://s.put.re/yPUWzpXs.png" alt="ptpLink" width="25" height="25"></a>';
    parentElement.parentNode.appendChild(childElement);
  }
})();
