// ==UserScript==
// @name         MyAnimeList(MAL) - List Links
// @version      1.0.4
// @description  Add list links inside your statistics
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile*
// @exclude      *://myanimelist.net/profile/*/*
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13307/MyAnimeList%28MAL%29%20-%20List%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/13307/MyAnimeList%28MAL%29%20-%20List%20Links.meta.js
// ==/UserScript==

// preparations
var user = document.getElementsByTagName('title')[0].textContent.replace("\'s Profile - MyAnimeList.net", "");
var animestats = document.getElementsByClassName('stats anime')[0];
var mangastats = document.getElementsByClassName('stats manga')[0];

// create link container
var animeLink = document.createElement('div');
var mangaLink = document.createElement('div');
animestats.insertBefore(animeLink, animestats.firstChild);
mangastats.insertBefore(mangaLink, mangastats.firstChild);

// define container
animeLink.outerHTML = '<a class="floatRightHeader ff-Verdana" href="/animelist/' + user + '">Anime List</a>';
mangaLink.outerHTML = '<a class="floatRightHeader ff-Verdana" href="/mangalist/' + user + '">Manga List</a>';


