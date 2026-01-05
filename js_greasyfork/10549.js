// ==UserScript==
// @name        Pandora tab search
// @namespace   http://ramrawrdinosaur.zapto.org/pandoratab
// @description adds 2 buttons that search for the current song title and artist on UT or Google
// @include     http://www.pandora.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10549/Pandora%20tab%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/10549/Pandora%20tab%20search.meta.js
// ==/UserScript==
var title = document.getElementsByClassName('songTitle') [0].text; //get the song title
var artist = document.getElementsByClassName('artistSummary')[0].text // get the artist name
var ug = 'http://www.ultimate-guitar.com/search.php?search_type=title&value='; //used for url generator
var g = 'http://google.com/#q='; //used for url generator
var btns = document.getElementsByClassName('buttons') [1]; //insert into the 2nd buttons section, under the album art
var ugtab = document.createElement('div'); //create div button using pandora css
ugtab.setAttribute('class', 'button btn_bg ');
ugtab.setAttribute('name', 'tab_get_btn');
ugtab.setAttribute('onclick', 'tab_refresh()');
ugtab.setAttribute('target', '_blank')
ugtab.innerHTML = '<div class=\'text\'>UG TAB</div>';
btns.appendChild(ugtab);
var googletab = document.createElement('div'); //create div button using pandora css
googletab.setAttribute('class', 'button btn_bg ');
googletab.setAttribute('name', 'tab_get_btn');
googletab.setAttribute('onclick', 'gtab_refresh()');
googletab.setAttribute('target', '_blank')
googletab.innerHTML = '<div class=\'text\'>G TAB</div>';
btns.appendChild(googletab);
window.tab_refresh = function () {
  var title = document.getElementsByClassName('songTitle') [0].text;
  var artist = document.getElementsByClassName('artistSummary')[0].text
  window.open(ug + title + " " + artist);
}
window.gtab_refresh = function () {
  var title = document.getElementsByClassName('songTitle') [0].text;
  var artist = document.getElementsByClassName('artistSummary')[0].text
  window.open(g + title + " " + artist + " tab");
}
//function refreshes title and navs to UG search
