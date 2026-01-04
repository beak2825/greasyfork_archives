// ==UserScript==
// @name        Add a link to GG.deals for each game in barter.vg
// @namespace   Violentmonkey Scripts
// @match       https://barter.vg/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      -
// @description 29/08/2023, 08.08.04
// @downloadURL https://update.greasyfork.org/scripts/474126/Add%20a%20link%20to%20GGdeals%20for%20each%20game%20in%20bartervg.user.js
// @updateURL https://update.greasyfork.org/scripts/474126/Add%20a%20link%20to%20GGdeals%20for%20each%20game%20in%20bartervg.meta.js
// ==/UserScript==

var offerForm = document.getElementById('offer');
var baseUri = 'https://gg.deals/games/?title=';

function addLink(sourceEl) {
  var title = sourceEl.textContent.trim()
  if(title) {
    var uri = baseUri + encodeURIComponent(title);

    var link = document.createElement('a');
    link.innerHTML = 'GG';
    link.href = uri;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'inline-block';
    link.style.padding = '0 2px';
    link.style.margin = '0 2px';
    link.style.border = 'solid 1px pink';
    sourceEl.parentNode.insertBefore(link, sourceEl.nextSibling);
  }
}

// For different listings of games
var gameLinks = document.querySelectorAll('a[href^="https://barter.vg/i/"]');
gameLinks = Array.from(gameLinks).filter(function(linkEl) {
  return linkEl.href.indexOf('#') === -1;
});

for(var linkEl of gameLinks) {
  // Special case for creating an offer
  try {
    var sourceEl = linkEl.previousSibling.previousSibling;
    if(sourceEl.nodeName.toLocaleLowerCase() == 'label') {
      addLink(sourceEl);
    } else {
      throw new Error('fail');
    }
  } catch(e) {
    addLink(linkEl);
  }
}

// For the game page itself
var gamePageTitleEl = document.querySelector('html[itemtype="http://schema.org/Product"] h1[itemprop="name"]');
if(gamePageTitleEl) {
  addLink(gamePageTitleEl);
}