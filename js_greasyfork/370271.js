// ==UserScript==
// @name     RobloxDev to Roblox Wiki API Reference
// @description Adds a button to view the API reference on the Roblox Wiki instead of RobloxDev
// @version  1.3
// @grant    none
// @match  *://www.robloxdev.com/api-reference/*
// @namespace Blupo
// @downloadURL https://update.greasyfork.org/scripts/370271/RobloxDev%20to%20Roblox%20Wiki%20API%20Reference.user.js
// @updateURL https://update.greasyfork.org/scripts/370271/RobloxDev%20to%20Roblox%20Wiki%20API%20Reference.meta.js
// ==/UserScript==

(function () {
	"use strict";
	
	var buttonAlreadyExists = document.getElementById("robloxwiki-btn");
	if (buttonAlreadyExists) { return true };
	
	var text = "View on the Roblox Wiki";
	
	var button = document.createElement("a");
	button.setAttribute("class", "btn secondary-btn");
	button.setAttribute("id", "robloxwiki-btn");
	button.setAttribute("style", "border-radius: 2px; color: #00a2ff;");
	button.setAttribute("href", "https://wiki.roblox.com/index.php?title=API:Class/" + window.location.href.match('api\-reference\/(property|class|event|function|callback)\/(.+)')[2] + "&studiomode=true");
	
	var buttonText = document.createTextNode(text);
	button.appendChild(buttonText);
	
	var apiContent = document.getElementsByClassName("api-content")[0];
	if (!apiContent) { return true };
	
	apiContent.insertAdjacentElement("beforebegin", button);
}());