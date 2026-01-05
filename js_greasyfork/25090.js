// ==UserScript==
// @name         derpi_favorite_everything
// @version      0.1
// @description  Fave All on page, and the next page, and the next one, and then some more after that.
// @include      https://derpiboo.ru/*
// @include      https://derpibooru.org/*
// @include      https://trixiebooru.org/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @namespace https://greasyfork.org/users/82471
// @downloadURL https://update.greasyfork.org/scripts/25090/derpi_favorite_everything.user.js
// @updateURL https://update.greasyfork.org/scripts/25090/derpi_favorite_everything.meta.js
// ==/UserScript==

var only_unfaved = true;
var loop = false;
var terms;

var tid = setInterval(function () {
		if (document.readyState !== 'complete')
			return;
		clearInterval(tid);
		onloaded();
	}, 100);

function onloaded() {
	console.log("Running FavAll");
	var css = ".FTMenu{ width:24px; height:24px; position:fixed; right:10px; bottom:10px; border-radius:9px } .FTB1{ background:#6EAEDE; } #FTSHButton{width:20px; height:20px; position:absolute; right:2px; bottom:2px; border-radius:7px} .FTBtn{ background:#A8CEEB;} .FTBtn:hover{background:#D4E7F5;}";
	var style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	head = document.head || document.getElementsByTagName('head')[0];
	head.appendChild(style);
	var menudiv = document.createElement("div");
	menudiv.setAttribute("class", "FTMenu FTB1");
	menudiv.name = "FTMenu";
	var menubutton = document.createElement("div");
	menubutton.id = "FTSHButton";
	menubutton.setAttribute("class", "FTBtn");
	menudiv.appendChild(menubutton);
	document.body.appendChild(menudiv);

	loadVars();
	if (loop) {
		console.log('loopity loop');
		menubutton.onclick = stop_loop;
		fav_all_on_page();
	} else {
		menubutton.onclick = start_loop;
	}

}
function start_loop() {
	var entry = prompt("Enter a semicolon separated list of search terms.", "artist:zaponator, -applejack; artist:zaponator, applejack");
	if (!entry) {
		GM_setValue('g_loop', false);
		return;
	} else {
		terms = entry.split(';');
	}

	//console.log(terms.join(';'));
	if (!confirm("You are about to favorite _ALL_ the images for " + terms.length + " different search results.  Do not load the site in any new tabs/windows while running this script.  If you need to abort, frantically hit the button and pray it responds.  Do you want to continue?"))
		return;

	loop = true;
	GM_setValue('g_loop', true);

	next_search_term();
	//fav_all_on_page();
}

function next_search_term() {
	if (terms.length > 0) {
		if (terms[0] === "") {
			clearStorage();
			alert("Furious favoriting finished");
		} else {
			var searchbox = document.getElementsByClassName("header__input--search")[0];
			searchbox.value = terms.shift(); //get the next search term from array
			GM_setValue("g_terms", terms.join(';')); // put new array back into storage
			var searchbuttons = document.getElementsByClassName("header__search__button");
			for (i = 0; i < searchbuttons.length; i++) {
				if (searchbuttons[i].title === 'Search')
					searchbuttons[i].click();
			}
		}
	}
}

function fav_all_on_page() {
	//console.log("Favoriting this page");

	var imagestocheck = document.getElementsByClassName("interaction--fave");
	for (i = 0; i < imagestocheck.length; i++) {
		if ((!hasClass(imagestocheck[i], "active"))) {
			imagestocheck[i].click();
		}
	}

	if (loop) {
		nextPage();
		setTimeout(nextPage, 100);
	}
}

function nextPage() {
	var nextButtons = document.getElementsByClassName("js-next");
	if (nextButtons.length > 0) {
		nextButtons[0].click();
	} else {
		//GM_setValue('g_loop', false);
		next_search_term();
	}
}

function stop_loop() {
	if (confirm("Abort loop?")) {
		GM_setValue('g_loop', false);
		alert("Remaining search terms: " + terms.join(';'));
	}
}

function loadVars() {
	loop = GM_getValue("g_loop", false);
	terms = GM_getValue("g_terms", null).split(';');
}

function clearStorage() {
	// cleaning up
	GM_deleteValue("g_loop");
	GM_deleteValue("g_terms");
}

function hasClass(elem, klass) {
	return (" " + elem.className + " ").indexOf(" " + klass + " ") > -1;
}
