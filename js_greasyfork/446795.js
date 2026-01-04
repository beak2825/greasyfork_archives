// ==UserScript==
// @name SortChapters
// @namespace https://arantius.com/misc/greasemonkey
// @description reverse the possitions of the list of chapters
// @include https*
// @version 0.31
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446795/SortChapters.user.js
// @updateURL https://update.greasyfork.org/scripts/446795/SortChapters.meta.js
// ==/UserScript==
  
var lis = document.querySelectorAll('ul#episode_related > li')

var mientras = []

var lista = document.getElementById('episode_related')

lista.innerHTML = null

mientras.forEach((li) => {lista.appendChild(li)})