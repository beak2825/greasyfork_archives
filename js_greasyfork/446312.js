// ==UserScript==
// @name        itch.io Automated add bundle to library
// @description This adds a handy button to an itch.io bundle to add all games in the bundle to your library quickly (including automatically moving to the next page once started).
// @namespace   https://greasyfork.org/en/users/924198-saizai
// @match       https://itch.io/bundle/download/*
// @grant       GM.setValue
// @grant       GM.getValue
// @license MIT
// @version     2.0
// @author      Ceremony, Wertible, saizai
// @downloadURL https://update.greasyfork.org/scripts/446312/itchio%20Automated%20add%20bundle%20to%20library.user.js
// @updateURL https://update.greasyfork.org/scripts/446312/itchio%20Automated%20add%20bundle%20to%20library.meta.js
// ==/UserScript==

/*jshint esversion: 8 */
async function postData(game) {
	const response = await fetch(window.location.href, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'manual',
		body: game
	});

	await next();
}

async function next() {
	let game = null;
	if (await GM.getValue("itch.io autorun")) {
		if (game = games.pop()) {
			button.textContent = "Adding " + (games.length + 1) + " game(s) to your library! Please wait; click here to stop auto-adding.";
			postData(game);
		} else if (document.querySelector(".next_page.button")) {
			document.querySelector(".next_page.button").click();
		} else {
			await GM.setValue("itch.io autorun", false);
			button.textContent = "Found " + games.length + " game(s) on this page not yet added to your library. Click to auto-add!";
			button.addEventListener("click", async () => {
				button.style.cursor = "";
				await GM.setValue("itch.io autorun", true);
				await next();
			}, { once: true });
		}
	} else {
		button.textContent = "Added all games on this page!";
	}
}

var games = [];
var button = document.createElement("a");
button.style.cursor = "pointer";
button.className = "button";

async function getGames() {
	document.querySelectorAll(".game_row form.form").forEach((form) => {
		let data = [];
		form.querySelectorAll("*[name]").forEach((el) => {
			data.push(encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value));
		})
		games.push(data.join("&"));
	});
}

async function setup() {
	if (! (await GM.getValue("itch.io autorun"))) {
		await GM.setValue("itch.io autorun", false);
	}

	if (await GM.getValue("itch.io autorun")) {
		button.addEventListener("click", async () => {
			button.textContent = "Auto-add stopped.";
			await GM.setValue("itch.io autorun", false);
		}, { once: true });
		button.textContent = "Click here to stop auto-adding.";
		document.querySelector(".game_outer").insertBefore(button, document.querySelector(".game_outer p:not([class])"));
		await getGames();
		if (games.length) {
			button.textContent = "Adding " + (games.length + 1) + " game(s) to your library! Please wait; click here to stop auto-adding.";
			await next();
		} else if (document.querySelector(".next_page.button")) {
			button.textContent = "No new games found on this page; continuing auto-adding to next page. Click here to stop auto-adding.";
			document.querySelector(".next_page.button").click();
		} else {
			await GM.setValue("itch.io autorun", false);
			button.textContent = "Added all games in this bundle! Auto-adding turned off.";
		}
	} else {
		button.addEventListener("click", async () => {
			button.style.cursor = "";
			await GM.setValue("itch.io autorun", true);
			await next();
		}, { once: true });
		button.textContent = "Click here to auto-add everything in the bundle!";
		document.querySelector(".game_outer").insertBefore(button, document.querySelector(".game_outer p:not([class])"));
		await getGames();
		if (games.length) {
			button.textContent = "Found " + games.length + " game(s) on this page not yet added to your library. Click here to auto-add everything in the bundle!";
		} else if (document.querySelector(".next_page.button")) {
			button.textContent = "No new games found on this page. Click here to start auto-adding from next page.";
		} else {
			await GM.setValue("itch.io autorun", false);
			button.textContent = "No more games to add in this bundle!";
		}
	}
}

setup();