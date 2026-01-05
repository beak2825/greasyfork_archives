// ==UserScript==
// @name       		IvanerrParser
// @namespace  		http://ivanerr.ru/lt/showclansrating
// @version    		0.1
// @description  	Parse clan stats
// @include     	*://ivanerr.ru/lt/showclansrating/*
// @grant               none
// @copyright  		2015+, Aleksandr Titov
// @downloadURL https://update.greasyfork.org/scripts/11334/IvanerrParser.user.js
// @updateURL https://update.greasyfork.org/scripts/11334/IvanerrParser.meta.js
// ==/UserScript==
for (i=0;i<document.links.length;i++){
	console.writeln("<dt><b>",document.links[i],"</b>");
}