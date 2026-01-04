// ==UserScript==
// @name         Steam Replay total hours
// @version      0.7
// @license      MIT
// @description  Displays total playing hours in Steam Replay
// @author       Wilzzu
// @include      https://store.steampowered.com/replay/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @namespace    https://greasyfork.org/users/1003364
// @downloadURL https://update.greasyfork.org/scripts/457192/Steam%20Replay%20total%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/457192/Steam%20Replay%20total%20hours.meta.js
// ==/UserScript==
// Thanks u/Stardatara for helping with showing hours for all games in the replay!

javascript: (function () {
	const year = window.location.href.split("/").pop().slice(0, 4);
	let data = JSON.parse(
		application_config.dataset[
			`yearinreview_${JSON.parse(application_config.dataset.userinfo).accountid}_${year}`
		]
	).playtime_stats;

	const processedTitle = new WeakSet();
	const processedMostPlayed = new WeakSet();
	const processedOtherGames = new WeakSet();
	const processedButtons = new WeakSet();

	function updateTitle() {
		const element = document.querySelector(".AmQ9dRhZqhOyU0Vgt3nWR");
		if (element && !processedTitle.has(element)) {
			processedTitle.add(element);
			element.innerHTML =
				"You spent " +
				Math.round(data.total_stats.total_playtime_seconds / 3600) +
				" hours playing games this year!<br/><br/>" +
				element.innerHTML;
		}
	}

	function updateMostPlayed() {
		document.querySelectorAll("._2AXFQ4F1EgcZAVJgYC6_KQ").forEach((e) => {
			if (processedMostPlayed.has(e)) return;
			processedMostPlayed.add(e);

			let appID = getAppID(e, "._2UVYU3krJstwNrAYNcRAtq");
			addHoursPlayed(e, "._1fY-Tu9TH4Rv4r_U5vPalT", appID);
		});
	}

	function updateOtherGames() {
		document.querySelectorAll("._1o-OaJLHoJcCZBa1I48gl1").forEach((e) => {
			if (processedOtherGames.has(e)) return;
			processedOtherGames.add(e);

			let appID = getAppID(e, "._1OZ4wvkQU53fcikZxtoS3u", true);
			addHoursPlayed(e, "._3nXdDUZyLDuZxhkbe3WpO8", appID);
		});
	}

	function addHoursPlayed(el, classname, id) {
		if (id.includes("url")) return;
		let mainDiv = el.querySelector(classname);
		let statDiv = mainDiv.childNodes[0].cloneNode(true);
		if (mainDiv.querySelector(".SRTHstats")) mainDiv.querySelector(".SRTHstats").remove();

		let hours = "?";
		if (data.games.find((game) => game.appid == id)) {
			hours = Math.round(
				data.games.find((game) => game.appid == id).stats.total_playtime_seconds / 3600
			);
		} else if (data.game_summary.find((game) => game.appid == id)) {
			hours = Math.round(
				(data.total_stats.total_playtime_seconds *
					(data.game_summary.find((game) => game.appid == id).total_playtime_percentagex100 /
						100 /
						100)) /
					60 /
					60
			);

			if (hours < 1) hours = "<1";
		}

		statDiv.childNodes[0].innerHTML = hours;
		statDiv.childNodes[1].innerHTML = "Hours Played";
		statDiv.classList.add("SRTHstats");
		mainDiv.append(statDiv);
	}

	function getAppID(el, classname, link = false) {
		if (link) return el.querySelector(classname).childNodes[1].href.split("/").pop();
		return el.querySelector(classname).style.backgroundImage.split("apps/").pop().split("/")[0];
	}

	function observeElements(callback) {
		callback();

		const observer = new MutationObserver((mutations) => {
			let shouldRun = false;
			for (const mutation of mutations) {
				if (mutation.addedNodes.length > 0) {
					shouldRun = true;
					break;
				}
			}
			if (shouldRun) callback();
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	function updateOnButtonClick() {
		document.querySelectorAll("._1tCO1rmBfntUI0TlpTly1F").forEach((button) => {
			if (processedButtons.has(button)) return;
			processedButtons.add(button);

			button.addEventListener("click", (event) => {
				requestAnimationFrame(() => {
					let appID = getAppID(
						button.closest("._3C4RVE-PZ18y1tGp7HLpP9"),
						"._1OZ4wvkQU53fcikZxtoS3u",
						true
					);
					addHoursPlayed(
						button.closest("._3C4RVE-PZ18y1tGp7HLpP9"),
						"._3nXdDUZyLDuZxhkbe3WpO8",
						appID
					);
				});
			});
		});
	}

	observeElements(updateTitle);
	observeElements(updateMostPlayed);
	observeElements(updateOtherGames);
	observeElements(updateOnButtonClick);
})();
