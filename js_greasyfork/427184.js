// ==UserScript==
// @name             IMDB Torrent Search 1-Click (to RARBG, Galaxy, 1337x)
// @description      1-Click Search for Torrent on most known websites
// @namespace        ilya
// @author           ilya
// @copyright        2021 ilya
// @license          MIT
// @match            https://www.imdb.com/title/tt*
// @exclude          https://www.imdb.com/title/tt*/*/*
// @version          0.8.a
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/427184/IMDB%20Torrent%20Search%201-Click%20%28to%20RARBG%2C%20Galaxy%2C%201337x%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427184/IMDB%20Torrent%20Search%201-Click%20%28to%20RARBG%2C%20Galaxy%2C%201337x%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var movieId;
  var movieName;
  var movieYear;
  var menuLi = document.createElement('li');
  menuLi.setAttribute("style", "list-style-type: none;");

  function createIcon(name, href) {
    let icon = document.createElement('a');
    icon.innerHTML = '<a>' + name + '</a>';
    icon.style.color = '#f5c518';
    icon.style.marginLeft = '10px';
    icon.style.padding = '5px';
    icon.style.border = 'solid 1px black';
    icon.style.borderRadius = '7px';
    icon.style.textDecoration = 'none';

    icon.href = href;
    icon.target = '_blank';
    menuLi.appendChild(icon)
  }

  function getMovieId() {
    let x = window.location.pathname;
    let arr = x.split('/');

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].substring(0, 2) === 'tt' || arr[i].substring(0, 2) === 'TT') {
        movieId = arr[i];
      }
    }

    movieName = (document.querySelector("[class^=OriginalTitle__OriginalTitleText-]")) ? document.querySelector("[class^=OriginalTitle__OriginalTitleText-]").innerText.split('Original title: ')[1] : document.querySelector("[class^=TitleHeader__TitleText-]").innerText;
    movieName = movieName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    movieYear = document.querySelector("section a").innerText

    if (movieId) {
      let menuUl = document.querySelector("div[class^=SubNav__SubNavContent-sc]");
      menuUl.insertBefore(menuLi, menuUl.firstChild);

      createIcon('RARBG', ('https://rarbgprx.org/torrents.php?imdb=' + movieId))
      createIcon('TorrentGalaxy', ('https://torrentgalaxy.to/torrents.php?search=' + movieId + '&sort=seeders&order=desc'))
      createIcon('1337x', ('https://1337x.to/category-search/' + movieName + '+' + movieYear + '/Movies/1/'))
    }
  }

  getMovieId();
})();