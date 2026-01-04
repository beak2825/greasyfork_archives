// ==UserScript==
// @name     Anti-Ayuséame
// @namespace  meneame.net
// @version  0.1
// @description  Elimina los meneos sobre Isabel Díaz Ayuso de la portada y la cola de envíos
// @match       *://*.meneame.net/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/490081/Anti-Ayus%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/490081/Anti-Ayus%C3%A9ame.meta.js
// ==/UserScript==

let divs = document.getElementsByClassName('news-summary');

for (let x = 0; x < divs.length; x++) {
	let div = divs[x];
	let content = div.innerHTML;
  
	if (content.indexOf('Ayuso') !== -1) {
  	div.style.display = 'none';
  }
}