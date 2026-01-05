// ==UserScript==
// @name           Click to Search
// @author         Cameron Bernhardt (AstroCB)
// @version       3.0.1
// @namespace      http://github.com/AstroCB
// @description Adds a clickable button to SE search
// @include        http://*.stackexchange.com/*
// @include        http://stackoverflow.com/*
// @include        http://meta.stackoverflow.com/*
// @include        http://serverfault.com/*
// @include        http://meta.serverfault.com/*
// @include        http://superuser.com/*
// @include        http://meta.superuser.com/*
// @include        http://askubuntu.com/*
// @include        http://meta.askubuntu.com/*
// @include        http://stackapps.com/*
// @downloadURL https://update.greasyfork.org/scripts/4401/Click%20to%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/4401/Click%20to%20Search.meta.js
// ==/UserScript==
if (localStorage) {
	if (!localStorage.hasAsked) {
		var button = prompt("Would you like the search button to be a link (like the review and help links) or a button (like the 'Post Your Answer' button)? (type \"button\" or \"link\" without the quotes)").toLowerCase();
		localStorage.hasAsked = "true";
		if (button === "button") {
			localStorage.preference = "button";
		} else {
			localStorage.preference = "link";
		}
		window.location.reload();
	} else {
		var either = localStorage.preference;
		var reset = document.createElement("a");
		reset.setAttribute("href", "#");
		reset.setAttribute("onclick", "localStorage.removeItem('hasAsked'); alert('Your search button preferences have been reset. Click OK to reset the page and enter your new preferences.'); window.location.reload();");
		reset.textContent = "reset";
		document.getElementsByClassName("top-footer-links")[0].insertBefore(reset, document.getElementsByClassName("top-footer-links")[0].children[0]);

		document.getElementById("search").children[0].placeholder = "";

		if (either === "button") {
			button();
		} else {
			link();
		}
	}
} else {
	link();
}

function link() {
	var div = document.createElement("div");
	var span = document.createElement("span");
	var link = document.createElement("a");

	div.setAttribute("class", "links-container");
	span.setAttribute("class", "topbar-menu-links");
	link.setAttribute("href", "#");
	link.setAttribute("onclick", "document.getElementById('search').submit();");
	link.textContent = "search";

	div.appendChild(span);
	span.appendChild(link);

	document.getElementById("search").appendChild(div);
}

function button() {
	var button = document.createElement("input");
	button.setAttribute("type", "submit");
	button.setAttribute("value", "search");
	document.getElementById("search").appendChild(button);
}