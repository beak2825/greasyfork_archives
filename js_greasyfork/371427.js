// ==UserScript==
// @name        AnkiWeb: Download buttons for addons
// @namespace   flan
// @description Adds download buttons to addon pages on AnkiWeb.
// @include     https://ankiweb.net/shared/info/*
// @version     1
// @grant       none
// @license     https://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/371427/AnkiWeb%3A%20Download%20buttons%20for%20addons.user.js
// @updateURL https://update.greasyfork.org/scripts/371427/AnkiWeb%3A%20Download%20buttons%20for%20addons.meta.js
// ==/UserScript==

function basename(path) {
	let s = path.split("/");
	return s[s.length-1];
}

function add_dl_button(after, version) {
	let a = document.createElement("a");
	a.href = `/shared/download/${basename(window.location.pathname)}?v=${version}`;
	a.className = "btn btn-primary btn-lg";
	a.style.marginRight = "1em";
	a.innerText = `Download (${version}.x)`;
	after.parentElement.insertBefore(a, after.nextSibling);
}

let id_card = document.querySelector(".card-outline-primary");

id_card.style.display = "inline-block";
id_card.style.marginRight = "1em";

if(document.querySelector("a[href='/shared/addons/2.1']"))
	add_dl_button(id_card, "2.1");

if(document.querySelector("a[href='/shared/addons/2.0']"))
	add_dl_button(id_card, "2.0");
