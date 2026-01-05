// ==UserScript==
// @name        XKCD Explained
// @namespace   http://www.explainxkcd.com/
// @description Adds a button to XKCD Explained in the navigation toolbar
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http://xkcd.com/*
// @include     https://xkcd.com/*
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/10404/XKCD%20Explained.user.js
// @updateURL https://update.greasyfork.org/scripts/10404/XKCD%20Explained.meta.js
// ==/UserScript==
var comicNumber = parseInt(window.location.pathname.replace(/\//g,'')),
    comicNavbar = comicNavbar = document.getElementsByClassName('comicNav')[0],
    previousComicURL, comicUrl, explainNavbar;
if(!comicNumber) {
  previousComicURL = comicNavbar.children[1].firstChild.href;
  comicNumber = parseInt(previousComicURL.match('[0-9]+')) + 1;
}
comicUrl = 'http://www.explainxkcd.com/wiki/index.php?title=' + comicNumber;
explainNavbar = document.createElement('ul');

explainNavbar.className = 'comicNav';

explainNavbar.innerHTML = '<li><a target="_blank" href="' + comicUrl + '">Explanation</a></li>';
comicNavbar.parentNode.insertBefore(explainNavbar, comicNavbar);
