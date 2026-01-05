// ==UserScript==
// @name         Dynasty Preloader
// @namespace    http://tampermonkey.net/
// @version      0.3.5.1
// @description  Preloads Dynasty Reader pages.
// @author       mcpower
// @match        http://dynasty-scans.com/chapters/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/26395/Dynasty%20Preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/26395/Dynasty%20Preloader.meta.js
// ==/UserScript==

// Dynasty Preloader - a UserScript to preload pages in Dynasty Reader
// Copyright (C) 2017  mcpower
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// This preloads Dynasty Reader pages and indicates it with colours.
// Red means it's in the queue, but it hasn't preloaded it yet.
// Yellow means it's currently preloading.
// Green means it's preloaded.
//
// If you wish, you can also preload all pages by clicking on the "Load All" button
// to the right of the "Fullscreen" button.


// Change these variables if you wish.
// lookahead is the number of pages to load ahead of you.
// lookbehind
// max_concurrent is the maximum number of image requests at any one time.
// Turn this down if you get loading screens, even though the page has been preloaded.
const lookahead = 4;
const lookbehind = 2;
const max_concurrent = 5;

(function () {
	"use strict";
	let queue = []; // page objects
	let images = []; // stack/queue of Image objects to be used after they've been loaded


	const states = {
		default: -1,
		queued: 0,
		loading: 1,
		loaded: 2
	};
	const state_classes = {
		[states.default]: "",
		[states.queued]:  "queued",
		[states.loading]: "loading",
		[states.loaded]:  "loaded"
	};
	const state_list = Object.keys(states);

	const css_text = ".queued{background:#ebccd1} .loading{background:#fcf8e3} .loaded{background:#dff0d8}";



	// initialise images with the image elements
	// define the onload event so we don't have to define it later
	// just set any Image.page then Image.src and then it'll be all good
	function img_onload(event) {
		const img = event.path[0];
		const page = img.page;
		page.state = states.loaded;
		images.push(img);
		update_style(page);
		check_queue();
	}

	for (let i = 0; i < max_concurrent; i++) {
		const cur_img = new Image();
		cur_img.onload = img_onload;
		images.push(cur_img);
	}



	function update_style(page) {
		if (page.state === page.styled_state) return;
		const cl = page.element.classList;
		if (page.styled_state !== states.default) {
			cl.remove(state_classes[page.styled_state]);
		}
		cl.add(state_classes[page.state]);
		page.styled_state = page.state;
	}

	// To load stuff, chuck it onto the queue and call this function
	function check_queue() {
		while (images.length > 0 && queue.length > 0) {
			load(queue.shift());
		}
	}

	// Actually, to check stuff on the queue you should probably use this function
	// You still need to call check_queue though.
	function chuck_on_queue(page) {
		if (page.state === states.loading || page.state === states.loaded) return;

		page.state = states.queued;
		queue.push(page);
		update_style(page);
	}

	function load(page) {
		if (page.state === states.loading || page.state === states.loaded) return;

		const img = images.pop();
		page.state = states.loading;
		update_style(page);

		img.page = page;
		img.src = page.image;
	}

	// loads `lookahead` pages after the current page and `lookbehind` before.
	function load_lookahead() {
		let cur_page;
		switch (window.location.hash) {
			case "#last":
				cur_page = window.pages.length;
				break;
			case "":
				cur_page = 1;
				break;
			default:
				cur_page = parseInt(window.location.hash.substr(1));
		}
		// clamp juust in case
		cur_page = Math.min(window.pages.length, Math.max(1, cur_page));

		const cur_index = cur_page - 1;

		// Always load lookahead before lookbehind
		for (let i = cur_index; i <= cur_index + lookahead && i < window.pages.length; i++) {
			chuck_on_queue(window.pages[i]);
		}
		for (let i = cur_index - 1; i >= cur_index - lookbehind && i >= 0; i--) {
			chuck_on_queue(window.pages[i]);
		}
		check_queue();
	}

	// loads all pages
	function load_all() {
		window.pages.forEach(chuck_on_queue);
		check_queue();
		return false;
	}


	// inject the CSS we want
	const css = document.createElement("style");
	css.innerHTML = css_text;
	document.body.appendChild(css);

	// precalculate all the DOM elements
	const pages_list = document.getElementById("prev_link").parentElement;
	for (let i = 0; i < window.pages.length; i++) {
		window.pages[i].element = pages_list.children[i+1];
		window.pages[i].state = states.default;
		window.pages[i].styled_state = states.default;
	}

	// create the "Load All" button
	const load_button = document.createElement("a");
	load_button.className = "btn btn-mini";
	load_button.innerHTML = "Load All";
	load_button.href = "#";
	load_button.onclick = load_all;
	document.getElementById("fullscreen").insertAdjacentElement("afterend", load_button);

	// lookahead stuff
	window.addEventListener("hashchange", load_lookahead);
	load_lookahead();
}());
