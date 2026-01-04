// ==UserScript==
// @name         My Review - MAL
// @namespace    MyReview
// @version      6
// @description  Open your own review on any entry with a single click!
// @author       hacker09
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465901/My%20Review%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/465901/My%20Review%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".breadcrumb").innerHTML += `  >  <a style="cursor: pointer;" onclick="fetch('https://myanimelist.net/myreviews.php?${location.href.split(/\//)[3] === 'anime' ? 'seriesid' : 'mid'}=${ location.href.match(/\d+/)[0]}&go=write').then(response => response.url.match('write') !== null ? alert('You haven\\'t reviewed this entry yet!') : window.open('https://myanimelist.net/reviews.php?id=' + response.url.match(/\\d+/)[0]))">Open my Review</a>`; //Add a btn to open the user own review
})();