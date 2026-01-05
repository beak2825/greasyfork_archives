// ==UserScript==
// @name        MangaUpdates - Dump Titles
// @description Scrapes search results on the MangaUpdates site
// @namespace   hapCodeJS
// @include     http://www.mangaupdates.com/*
// @include     https://www.mangaupdates.com/*
// @version     1
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/26120/MangaUpdates%20-%20Dump%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/26120/MangaUpdates%20-%20Dump%20Titles.meta.js
// ==/UserScript==
function main(){
	processPage();
	travelCheck();
}
function start(){
	GM_setValue('dumpSignal',true);
	GM_setValue('titles','');
	main();
}
function stateCheck(){
	if(GM_getValue('dumpSignal')){
		main();
	}
}
function processPage(){
	var titles=[];
	for(var i=0;i<document.links.length;i++){
		if(/https?:\/\/www\.mangaupdates\.com\/series\.html\?id=/i.test(document.links[i].href)){
			titles.push(document.links[i].text);
		}
	}
	GM_setValue('titles',GM_getValue('titles')+titles.join('\n')+'\n');
}
function travelCheck(){
	var nodes=document.getElementsByClassName('specialtext');
	if(nodes.length!==0&&nodes[nodes.length-1].childNodes[0].text=='Next Page'){
		document.location.assign(nodes[nodes.length-1].childNodes[0].href);
	}else{
		GM_setClipboard(GM_getValue('titles'));
		GM_deleteValue('titles');
		GM_deleteValue('dumpSignal');
	}
}
GM_registerMenuCommand('Dump Titles',start,'d');
stateCheck();
