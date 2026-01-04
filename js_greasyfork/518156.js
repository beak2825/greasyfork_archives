// ==UserScript==
// @name        imdb-auto-click
// @description opens imdb link if found
// @namespace   ziffusion.com
// @include     https://www.1337x.to/torrent/*
// @version     1.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/518156/imdb-auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/518156/imdb-auto-click.meta.js
// ==/UserScript==
var url = document.body.innerHTML.match(/http[^\s<>"]+?imdb[^\s<>"]+/i);
if (url)
{
  console.log('imdb-auto-click', url);
  window.open(url);
}