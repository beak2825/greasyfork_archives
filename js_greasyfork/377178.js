// ==UserScript==
// @name        Spiegel.de: Kein Dschungelcamp schrott
// @description Entfernt Elemente von Spiegel Online, die auf Dschungelcamp verweisen
// @namespace   https://greasyfork.org/scripts/377178
// @match       http://www.spiegel.de/
// @match       http://www.spiegel.de/*/*/*-a-*.html
// @match       http://www.spiegel.de/#*
// @match       http://www.spiegel.de/*/
// @match       http://www.spiegel.de/*/#*
// @match       http://www.spiegel.de/*/archiv*.html
// @exclude     http://www.spiegel.de/international/*
// @exclude     http://www.spiegel.de/fotostrecke*
// @exclude     http://www.spiegel.de/forum/*
// @noframes
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377178/Spiegelde%3A%20Kein%20Dschungelcamp%20schrott.user.js
// @updateURL https://update.greasyfork.org/scripts/377178/Spiegelde%3A%20Kein%20Dschungelcamp%20schrott.meta.js
// ==/UserScript==

var candidateSelectors = [
	'div.column-wide > div.asset-box.asset-link-box > ul > li',
	'ul.article-list > li',
	'div.teaser',
	'div.asset-box',
	'div.ressort-teaser-box-top',
	'div.clearfix.module-box.bento'
];


candidateSelectors = candidateSelectors.toString();
var links = document.querySelectorAll('a[href*=\'kultur\/tv\/dschungelcamp\']');
for(var link of links) {
  var containerElement = link.closest(candidateSelectors);
  if(containerElement && containerElement.parentElement){
    containerElement.parentElement.removeChild(containerElement);
  }
}