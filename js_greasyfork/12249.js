// ==UserScript==
// @name         vvFilter
// @namespace    https://ru.wikipedia.org/wiki/User:Neolexx
// @version      0.1
// @description  Filtering...
// @author       Neolexx
// @match        https://ru.wikipedia.org/*
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/12249/vvFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/12249/vvFilter.meta.js
// ==/UserScript==

var CategorySection = $('catlinks');

if (!!CategorySection) {
  var CategoryLinks = CategorySection.getElementsByTagName('a');
  var found = false;
  for (var i = 0; i < CategoryLinks.length; i++) {
    if ( /Художники СССР/.test(CategoryLinks[i].title) ) {
      found = true;
      break;
    }
  }
  if (found) {
    var thumbs = $('bodyContent').getElementsByTagName('img');
    for (var i = 0; i < thumbs.length; i++) {
      if (thumbs[i].width >= 150) {
        thumbs[i].style.WebkitFilter = 'blur(10px)';
        thumbs[i].addEventListener('click', new Function('evt','this.style.WebkitFilter = "none";'), false);
      }
    }
  }
}

function $(id) {
  return document.getElementById(id);
}