// ==UserScript==
// @name        bgmcard
// @namespace   bgm/uli
// @description not a card game
// @include     http://bgm.tv/*/topic/*
// @include     http://bangumi.tv/*/topic/*
// @include     http://chii.in/*/topic/*
// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4961/bgmcard.user.js
// @updateURL https://update.greasyfork.org/scripts/4961/bgmcard.meta.js
// ==/UserScript==


// card css
"use strict"

var card_css = document.createElement("style");
card_css.textContent = [
	".card_container {position: absolute; transition: left 0.5s, right 0.5s, opacity 0.5s; width: 30em; margin: 1em 0 0 1em; padding: 0 1em; border-radius: 8px; z-index: 50; box-shadow: 2px 2px 5px #999; background-color: rgba(255,255,255,0.9); font-size: 13px; color: #444; border-left: 1em solid #F09199;}",
	".card_container_inner {overflow: hidden; margin: 0 -1em; padding: 1em; border-radius: 8px; border-right: 1em solid rgba(255,255,255,0.9);}",
	".card_content {white-space: pre-wrap; transition: all 0.5s ease; margin-left: 0; width: 30em; max-height: 20em; -moz-columns: auto 30em; -webkit-columns: auto 30em;}",
	".card_cover {float: right; border-color: #C7C7C9 #A9A9AB #858486; border-width: 0 1px 1px 0; border-style: solid; max-width: 10em; max-height: 20em; margin: 0 0 0.5em 0.5em;}",
	".card_link {color: #0084B4 !important;}",
	".card_page {padding-right: 1em; border-top: 1px solid #AAA; display: block; transition: width 0.5s; color: transparent; line-height: 0;}",
	".card_charging {color: #369CF8; font-size: 15px; font-style: italic; font-family: Georgia; padding: 1em 0;}"
].join("\n");

document.body.appendChild(card_css);




var topmost_card = function(ele) {
	var containers =  document.querySelectorAll(".card_container");


	for(var x=0;x<containers.length;x++){
		containers[x].style.zIndex = "49";
		containers[x].style.opacity = "0.8";
	}

	ele.style.zIndex = "50";
	ele.style.opacity = "1";
};

var set_coordinate = function(ele, rect) {
	ele.style.left = window.scrollX + rect.right + "px";
	ele.style.top = window.scrollY + rect.top + "px";
};


// set card --have no card--> refine card -> charge card -> shooting
//          --already had--> release card -> shooting

var refine_card = function(doc, uri) {

	var get_element = function(selectors) {
		var ele = doc.querySelector(selectors);
		if (ele) return ele;
		else {
			var blank_ele = document.createElement("div");
			blank_ele.href = ""; //some have no cover image, will return null
			return blank_ele;
		}
	};

	var title = get_element(".nameSingle").textContent;
	var cover_src = get_element(".cover.thickbox").href;
	var info = get_element("#infobox").textContent;
	var sum_txt = get_element("#subject_summary, .detail").textContent;

	var text_trim_join = function (str) {
//		return str.split('\n').filter(String.trim).map(String.trim).join('\n');
		return str.split('\n').filter(function (s) {
			return s.trim()
		}).map(function (s) {
			return s.trim();
		}).join('\n');
	};

	var card_txt = ['', text_trim_join(info), sum_txt].join('\n\n');

	var title_link = document.createElement("a");
	title_link.className = "card_link";
	title_link.textContent = text_trim_join(title);
	title_link.href = uri;

	var cover = document.createElement("img");
	cover.className = "card_cover";
	cover.src = cover_src;

	var card = document.createElement("p");
	card.className = "card_content";
	card.textContent = card_txt;

	var card_page = document.createElement("span");
	card_page.className = "card_page";

	var container_inner = document.createElement("div");
	container_inner.className = "card_container_inner";

	card.insertBefore(title_link, card.firstChild);
	card.insertBefore(cover, card.firstChild);
	container_inner.appendChild(card);
	container_inner.appendChild(card_page);

	return [container_inner, card, card_page];
};

var charge_card = function(uri, type, id_number) {
	var card_number = type.slice(0, 3) + "#" + id_number;

	var card_charging = document.createElement("div");
	card_charging.className = "card_charging";
	card_charging.innerHTML = "Card <u>" + card_number + "</u> Charging...";

	var container = document.createElement("div");
	container.className = "card_container";
	container.id = uri;

	container.appendChild(card_charging);

	return [container, card_charging];
};

var release_card = function(evt, uri, page_total) {
	evt.preventDefault();

	var container = document.getElementById(uri);
	var tg_c = container.querySelector(".card_content");
	var tg_p = container.querySelector(".card_page");

	tg_c.style.marginLeft = "0";
	tg_p.textContent = "1/" + page_total;
	tg_p.style.width = 1/page_total*100 + "%";

	container.style.display = "block";
	var rect = evt.target.getBoundingClientRect();
	set_coordinate(container, rect);
	topmost_card(container);
};


var set_card = function(e, uri) {

	var ar = uri.split('/');
	var type = ar[ar.length-2];
	var id_number = ar[ar.length-1];

	var set_card_exec = function(evt) {
		evt.preventDefault();

//		var [container, card_charging] = charge_card(uri, type, id_number);

		var chargedCard =  charge_card(uri, type, id_number);

		var container =chargedCard[0];
		var card_charging = chargedCard[1];




		var rect = evt.target.getBoundingClientRect();
		set_coordinate(container, rect);

		document.body.firstElementChild.appendChild(container);
		// use body.appendChild will cover up some parts
		topmost_card(container);

		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var doc = this.responseXML;


			var refinedCard =  refine_card(doc, uri, type);
			var container_inner = refinedCard[0];
			var card = refinedCard[1];
			var card_page = refinedCard[2];

//			var [container_inner, card, card_page] = refine_card(doc, uri, type);
			container.replaceChild(container_inner, container.firstChild);


			if(container_inner.scrollHeight > container_inner.clientHeight) {
				card.style.height = '20em';
			}

			//XXX if cover image is not loaded as soon as the card is appended
			//card.scrollWidth will be smaller than when the image is showed
			//need some placeholder or other fix
			var page_total = Math.floor(card.scrollWidth / (30*13)); //30em font-size 13px
			card_page.counter = 0;
			card_page.textContent = "1/" + page_total;
			card_page.style.width = 1/page_total*100 + "%";

			container.addEventListener("click", function(ev) {
				var tg = ev.target;
				if (tg.className == "card_link") return;

				if (tg.className != "card_container") {
					if (ev.currentTarget.style.zIndex == "49") {
						topmost_card(ev.currentTarget);
						return;
					}

					var tg_c = ev.currentTarget.querySelector(".card_content");
					page_total = Math.floor(tg_c.scrollWidth / (30*13));

					if (page_total == 1) return;

					if (tg_c.style.marginLeft == '') tg_c.style.marginLeft = "0";

					//XXX select text is also "click"
					var current_margin = parseInt(tg_c.style.marginLeft);
					var counter = card_page.counter;
					// below is for page turning calc
					if (Math.floor(counter/(page_total-1)) % 2 == 0) {
						tg_c.style.marginLeft = current_margin - 31 + "em";
					} else {
						tg_c.style.marginLeft = current_margin + 31 + "em";
					}
					card_page.counter = card_page.counter + 1;
					if (Math.floor(card_page.counter/(page_total-1)) % 2 == 0)
						var pg_2 = card_page.counter%(page_total-1) + 1;
					else
						var pg_2 = page_total - card_page.counter%(page_total-1);
					card_page.style.width = pg_2/page_total*100 + "%";
					card_page.textContent = pg_2 + "/" + page_total;
				} else {
					// hide card
					ev.currentTarget.style.display = "none";
				}
			});

			// when click link second time, release card directly
			e.removeEventListener("click", set_card_exec);
			var release_card_c = function(evt) {
				return release_card(evt, uri, page_total);
			};
			e.addEventListener("click", release_card_c);
		};

		xhr.timeout = 5000;
		xhr.ontimeout = function() {
			card_charging.textContent = "Shooting failed. Card charging too slow. Try again.";
			e.addEventListener("click", set_card_exec);
		};

		xhr.open("GET", uri);
		xhr.responseType = "document";
		xhr.send();
	};


	e.addEventListener("click", set_card_exec);
};


// XXX can not handle ajax loaded contents, like timeline page
var links = document.getElementsByTagName("a");
for (var t=0;t<links.length; t++) {
	if (/\/(subject|character|person)\/\d+$/.test(links[t].href)) {
		if (links[t].href != document.location.href) set_card(links[t], links[t].href);
	}
}
