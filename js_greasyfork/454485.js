// ==UserScript==
// @name         Toggle Reddit Sidebar
// @namespace    toggle-reddit-sidebar
// @version      1.0
// @description  Adds a button to toggle the sidebar on Reddit, with the option to have it hidden or shown by default.
// @author       GemedetAdept
// @match        *://*.reddit.com/*
// @credits      Adapted, with permission, from "Hide Reddit Side Bar" script by u/pm_all_ahri_art @ https://greasyfork.org/en/scripts/375201-hide-reddit-side-bar
// @license      GNU v3.0
// @downloadURL https://update.greasyfork.org/scripts/454485/Toggle%20Reddit%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/454485/Toggle%20Reddit%20Sidebar.meta.js
// ==/UserScript==

var IsHidden = true;

var sidebar = document.querySelector(".side");
sidebar.style.overflow = "hidden";

function toggleSidebar () {

	if (IsHidden == true) {

		sidebar.style.height = "";
		sidebar.style.width = "";
		IsHidden = false;
	}

	else if (IsHidden == false) {

		sidebar.style.height = "0px";
		sidebar.style.width = "0px";
		IsHidden = true;
	}
}

var togglebutton = document.createElement("button");
var toggletext = document.createTextNode("toggleBar");
togglebutton.appendChild(toggletext);

togglebutton.style.fontSize = "10px";
togglebutton.style.fontWeight = "bold";
togglebutton.style.left = "4px";
togglebutton.style.color = "#81b3d9";

togglebutton.addEventListener("click", toggleSidebar);

var navBar = document.querySelector("#header");
var buttonSection = navBar.querySelector("#header-bottom-right");
var itemBarDivider = buttonSection.querySelector(".logout.hover");

buttonSection.appendChild(togglebutton);
itemBarDivider.append(" | ");
itemBarDivider.style.color = "#808080";

if (IsHidden == true) {

	sidebar.style.height = "0px";
	sidebar.style.width = "0px";
}

else if (IsHidden == false) {

	sidebar.style.height = "";
	sidebar.style.width = "";
}