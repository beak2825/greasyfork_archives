// ==UserScript==
// @name        [ARCHIWUM]Blokator obrazów od różowych pasków
// @description	Nazwa mówi sama za siebie. Na głównej, tagach, mikroblogu, mój wykop, stronie użytkownika - blokuje każdy wpis różowego paska, który ma obrazek.
// @version     0.2.4
// @author      look997
// @include     https://www.wykop.pl/*
// @homepageURL https://www.wykop.pl/ludzie/addons/look997/
// @namespace	  https://www.wykop.pl/ludzie/addons/look997/
// @grant       none
// @require 		https://greasyfork.org/scripts/437595-wykopobserve/code/WykopObserve.js?version=1002287
// @run-at      document-end
// @resource    metadata https://greasyfork.org/scripts/437596-blokator-obraz%C3%B3w-od-r%C3%B3%C5%BCowych-pask%C3%B3w/code/Blokator%20obraz%C3%B3w%20od%20r%C3%B3%C5%BCowych%20pask%C3%B3w.user.js
// @icon        https://www.google.com/s2/favicons?domain=wykop.pl
// @icon64      https://www.google.com/s2/favicons?domain=wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/437596/%5BARCHIWUM%5DBlokator%20obraz%C3%B3w%20od%20r%C3%B3%C5%BCowych%20pask%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/437596/%5BARCHIWUM%5DBlokator%20obraz%C3%B3w%20od%20r%C3%B3%C5%BCowych%20pask%C3%B3w.meta.js
// ==/UserScript==
(async function() {
	"use strict";
	
	
	if (document.cookie.includes("us-female-block=nieChcęFemaleBlock")) { return false; }
	// document.cookie = `us-female-block=nieChcęFemaleBlock; maxAge=${100*365*24*60*60}; path=/`;
	// document.cookie = "us-female-block=nieChcęFemaleBlock; expires=02-02-2222; path=/";
	
	
	// module start
	(async function() {
	
// INIT START

const filter = [
	"mikroblog-page-comment",
	"tag-page-comment",
	"moj-page-comment",
	"glowna-page-comment",
	
];

// @ts-ignore
wykopObserve(filter, async function ({profileEl, liEl, contentEl}, {place, isFirstTime, nick, authorSex}) {
	
	// @ts-ignore
	if (loginUser.login === nick) { return; }
	if (!( authorSex === "female" && liEl.querySelector("div[data-type=entry] .media-content a img.block") )) { return; }
	
	const url = liEl.querySelectorAll(".author > a")[1]?.href;
	
	const tempEl = document.createElement("template");
	tempEl.innerHTML =
	`<p class="w-fbid" style="color: #cdd9e2; text-align: center; opacity: .45;"><a href="${url}">Obrazek ${nick}</a> został zablokowany :-)</p>`;
	
	liEl.append(tempEl.content.cloneNode(true));
	liEl.querySelector("div").hidden = true;
	liEl.querySelector(".sub").hidden = true;
	
	liEl.querySelector(".w-fbid").onclick = e=>{
		if (e.target.href) { return true; }
		liEl.querySelector("div").hidden = false;
		liEl.querySelector(".sub").hidden = false;
		liEl.querySelector(".w-fbid").hidden = true;
	}
	
}, {once:true});

// INIT END

})()
// module end


/**
 * getWykopElementsFrom(placesArr, callback);
 * callback object:
 * el: [EntryHTMLElement?, commentEl, liEl, contentEl]
 * place: Array,
 * nick: string,
 * authorSex: ["male","female",null],
 * color: ["red", "yellow", "green"],
 * post-date: Date,
 * log-user-nick: string // nick zalogowanego użytkownika, (nie chodzi o  autora wpisu/komentarze)
 * WykopAPI?: funkcja odnosząca się do API wpisu/autora(wpisu bo we wpisie jest też autor)
 * 						fetchAPI w atrybucie callback-a, API key w parametrze wykopObserve
 */
 
 
 
 
 
 
 
})();
