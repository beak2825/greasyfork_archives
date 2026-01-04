// ==UserScript==
// @name        Better TorrentGalaxyX TGX search - search by size, descending
// @namespace   Violentmonkey Scripts
// @match       *://torrentgalaxy.to/*
// @grant       none
// @version     1.2
// @author      -
// @description Improve pornolab.net quick search form so it always defaults to searching by size in descending order; fix captcha bug - 2024-02-14, 18:17:39
// @downloadURL https://update.greasyfork.org/scripts/473860/Better%20TorrentGalaxyX%20TGX%20search%20-%20search%20by%20size%2C%20descending.user.js
// @updateURL https://update.greasyfork.org/scripts/473860/Better%20TorrentGalaxyX%20TGX%20search%20-%20search%20by%20size%2C%20descending.meta.js
// ==/UserScript==

loc = document.location.toLocaleString();
if(loc.includes("&amp;")) {
  // TGX have a bug that makes you go to a URL that's htmlencoded after you enter the captcha.
  newLoc = loc.replaceAll("&amp;", "&");
  window.location.replace(newLoc);

} else {

$("form#searchbar").ready(function () {
  // improvements to quick search form
  $("form#searchbar").append("<input type='hidden' name='sort' value='size' />"); // sort by size
  $("form#searchbar").append("<input type='hidden' name='order' value='desc' />"); // sort descending
})

$("div#intblockslide form").ready(function () {
  // improvements to quick search form
  $("div#intblockslide form").append("<input type='hidden' name='sort' value='size' />"); // sort by size
  $("div#intblockslide form").append("<input type='hidden' name='order' value='desc' />"); // sort descending
})



} // else from the &amp; bug fix branch