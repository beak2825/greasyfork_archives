// ==UserScript==
// @name        BoardGameGeek Link Tabletop Simulator Steam Workshop
// @match       https://boardgamegeek.com/boardgame/*
// @grant       none
// @version     0.0.2
// @icon        https://icons.duckduckgo.com/ip2/boardgamegeek.com.ico
// @description Adds a link to BoardGameGeek to search for the game on the Steam Tabletop Simulator workshop
// @license     MIT
// @namespace https://greasyfork.org/users/1257939
// @downloadURL https://update.greasyfork.org/scripts/495876/BoardGameGeek%20Link%20Tabletop%20Simulator%20Steam%20Workshop.user.js
// @updateURL https://update.greasyfork.org/scripts/495876/BoardGameGeek%20Link%20Tabletop%20Simulator%20Steam%20Workshop.meta.js
// ==/UserScript==

(async () => {
	'use strict';

	// Select the toolbar actions element
	const toolbarActions = document.querySelector(".toolbar-actions");

	// Get the game title from the header
	const gameTitleElement = document.querySelector('[itemprop="name"]');
	const gameTitle = gameTitleElement.textContent.trim();

	// Create a div element and an anchor element
	const div = document.createElement("div");
	const element = document.createElement("a");

	// Set attributes and classes for the elements
	element.target = "_blank";
	div.classList.add("toolbar-action", "ng-scope");
	element.classList.add("buy-btn", "btn", "btn-sm", "ng-scope");

	// Set the href and text content of the anchor element
	element.href = `https://steamcommunity.com/workshop/browse/?appid=286160&searchtext=${encodeURIComponent(gameTitle).replaceAll('%20', '+', 'g')}`;
	element.textContent = "🎲 Search Tabletop Simulator";

	// Append the anchor element to the div element
	div.append(element);

	// Prepend the div element to the toolbar actions
	toolbarActions.prepend(div);
})();