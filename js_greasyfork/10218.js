// ==UserScript==
// @name        Google_last_year
// @namespace   no
// @description View google results of last year on page load. Keep your changes till reload.
// @include     http://google.*/search*
// @include     https://google.*/search*
// @include     http://www.google.*/search*
// @include     https://www.google.*/search*
// @include     http://www.google.*/webhp*
// @include     https://www.google.*/webhp*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10218/Google_last_year.user.js
// @updateURL https://update.greasyfork.org/scripts/10218/Google_last_year.meta.js
// ==/UserScript==

if(!location.search.match(/&tbs=/)) {
  location.href = location.href + '&tbs=qdr:y';
}