// ==UserScript==
// @name Spiegel.de: Keine Plus-Artikel
// @description Entfernt SpiegelPlus Artikel
// @namespace https://greasyfork.org/de/scripts/377611
// @match https://www.spiegel.de/
// @match https://www.spiegel.de///-a-.html
// @match https://www.spiegel.de/#*
// @match https://www.spiegel.de//
// @match https://www.spiegel.de//#*
// @match https://www.spiegel.de//archiv.html
// @exclude https://www.spiegel.de/international/*
// @exclude https://www.spiegel.de/fotostrecke*
// @exclude https://www.spiegel.de/forum/*
// @noframes
// @version 1.6.5
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377611/Spiegelde%3A%20Keine%20Plus-Artikel.user.js
// @updateURL https://update.greasyfork.org/scripts/377611/Spiegelde%3A%20Keine%20Plus-Artikel.meta.js
// ==/UserScript==

var candidateSelectors = [
'div.z-10',
];

candidateSelectors = candidateSelectors.toString();
var links = document.querySelectorAll('[data-contains-flags^="Spplus-paid"]');

for(var link of links) {
var containerElement = link.closest(candidateSelectors);
if(containerElement && containerElement.parentElement){
containerElement.parentElement.removeChild(containerElement);
}
}