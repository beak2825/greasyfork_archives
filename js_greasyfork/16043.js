// ==UserScript==
// @name        Minuteman Links
// @namespace   https://greasyfork.org
// @description Adds links to search for books at the Minuteman Library Network in Massachusetts
// @include     https://www.goodreads.com/*
// @include     http://www.goodreads.com/*
// @version     1.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16043/Minuteman%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/16043/Minuteman%20Links.meta.js
// ==/UserScript==
var zBooks=jQuery('tr.bookalike td.title .value a');
for (var i = 0, len = zBooks.length; i < len; i++) {
  var book=zBooks[i];
  jQuery("<p><a target='_blank' href='http://find.minlib.net/iii/encore/search/C__S"+encodeURIComponent(book.title)+"__Orightresult__U'>Find at Library</a></p>").appendTo(book.parentNode);
}

http://find.minlib.net/iii/encore/search/C__Sfoo?lang=eng&suite=cobalt
var zAuth=jQuery('tr.bookalike td.author .value a');
for (var i = 0, len = zAuth.length; i < len; i++) {
  var author=zAuth[i];
  jQuery("<p><a target='_blank' href='http://find.minlib.net/iii/encore/search/C__S"+encodeURIComponent(author.textContent)+"__Orightresult__U'>Find at Library</a></p>").appendTo(author.parentNode);
}
var zID=jQuery('#bookTitle');
if(zID[0]){ jQuery("<p><a target='_blank' href='http://find.minlib.net/iii/encore/search/C__S"+encodeURIComponent(zID[0].textContent.strip())+"__Orightresult__U'>Find at Library</a></p>").appendTo(zID[0].parentNode.children[1]) }