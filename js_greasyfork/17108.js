// ==UserScript==
// @name        Wayback Machine Original Button
// @namespace   DoomTay
// @description Adds a button to the Wayback Machine toolbar to navigate to the original version of a webpage
// @include     http://web.archive.org/web/*
// @include     http://wayback.archive.org/web/*
// @include     https://web.archive.org/web/*
// @include     https://wayback.archive.org/web/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17108/Wayback%20Machine%20Original%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/17108/Wayback%20Machine%20Original%20Button.meta.js
// ==/UserScript==

var sideLinks = document.querySelector("td.r");

if(sideLinks)
{
	var originalLink = document.createElement("a");
	originalLink.title = "View original version"
	originalLink.innerHTML = "Original";
	originalLink.href = window.location.href.replace("/ht","id_/ht");
	originalLink.style = "top:25px;"
	sideLinks.insertBefore(originalLink,sideLinks.childNodes[2]);
}