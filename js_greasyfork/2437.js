// ==UserScript==
// @name        Wakfu link
// @namespace   eight04.blogspot.com
// @description Add useful link to wakfu elements, wakfu wiki, and encyclopedia
// @include     http://wakfu-elements.com/items/view/*
// @include     http://www.wakfu.com/en/mmorpg/game-guide/*
// @include		http://www.wakfu.asia/en/mmorpg/game/*
// @include     http://wakfu.wikia.com/wiki/*
// @version     1.1.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/2437/Wakfu%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/2437/Wakfu%20link.meta.js
// ==/UserScript==

"use strict";

GM_addStyle(".wakfu-links { font-size: 0.7em; margin: 3px; }" +
	"#infos_detail .wakfu-links { font-size: 14px!important; }");

init();
document.addEventListener("DOMNodeInserted", init, false);

function init(){
	if(document.querySelector(".wakfu-links-container")){
		return;
	}
	var title = getTitle();
	var links = makeLinks(title);
	var header = getHeader();

	header.insertBefore(links, header.childNodes[0].nextSibling)
}
	
function getTitle(){
	var t = getHeader().childNodes[0].textContent;
	return t;
}

function getHeader(){
	var h = document.querySelector("#WikiaPageHeader > h1") ||
			document.querySelector("#infos_detail > .title_item > h2") ||
			document.querySelector("#l-mainBody > .itemWrapper > h3");
	return h;
}

function makeLinks(t){
	var sites = [
		{
			name: "Encyclopedia",
			url: "http://www.wakfu.asia/en/mmorpg/game/search?text="
		},
		{
			name: "Wiki",
			url: "http://wakfu.wikia.com/wiki/"
		},
		{
			name: "Elements",
			url: "http://wakfu-elements.com/search?search="
		}
	]
	
	var d = document.createElement("span");
	d.className = "wakfu-links-container";
	var i;
	
	for(i = 0; i < sites.length; i++){
		var a = document.createElement("a");
		a.textContent = sites[i].name;
		a.setAttribute("href", sites[i].url + t);
		a.className = "wakfu-links";
		a.onclick = function(){
			location.href = this.href;
			return false;
		}
		d.appendChild(a);
	}
	
	return d;
}