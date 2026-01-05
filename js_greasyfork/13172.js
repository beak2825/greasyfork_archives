// ==UserScript==
// @name         MyAnimeList(MAL) - Profile Switch (5 - Shuffle stats)
// @version      1.0.7
// @description  Change order of statistics in your profile
// @author       Cpt_mathix
// @include      *://myanimelist.net/profile*
// @exclude      *://myanimelist.net/profile/*/reviews
// @exclude      *://myanimelist.net/profile/*/recommendations
// @exclude      *://myanimelist.net/profile/*/clubs
// @exclude      *://myanimelist.net/profile/*/friends
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13172/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%285%20-%20Shuffle%20stats%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13172/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%285%20-%20Shuffle%20stats%29.meta.js
// ==/UserScript==

var statistics = document.getElementById('statistics');

// get divs
var statsTop = statistics.getElementsByClassName('user-statistics-stats')[0];
var statsDown = statistics.getElementsByClassName('user-statistics-stats')[1];

var animeUpdate = statsTop.getElementsByClassName('updates anime')[0];
animeUpdate.className += " pl0 pr8";
var mangaUpdate = statsDown.getElementsByClassName('updates manga')[0];
mangaUpdate.className += " pl8 pr0";

var animeStats = statsTop.getElementsByClassName('stats anime')[0];
animeStats.className += " pl0 pr8";
animeStats.className = animeStats.className.replace("pr0","");

var mangaStats = statsDown.getElementsByClassName('stats manga')[0];
mangaStats.className += " pr0 pl8";


// switch divs (result: last updates on top)
statsTop.appendChild(mangaUpdate);
statsDown.appendChild(animeStats);
statsDown.insertBefore(animeStats, mangaStats);

// switch top and bottom (result: statistics on top) (remove // below if you want statistics on top)
// statsDown.parentNode.insertBefore(statsDown, statsTop);