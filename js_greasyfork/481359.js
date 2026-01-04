// ==UserScript==
// @name         HoldBoost Tweaks
// @namespace    http://tampermonkey.net/
// @version      2025-12-01
// @description  fix holdboost styles and add feature tweaks
// @author       Californ1a
// @match        http://holdboost.com/*
// @match        https://holdboost.com/*
// @match        http://*.holdboost.com/*
// @match        https://*.holdboost.com/*
// @downloadURL https://update.greasyfork.org/scripts/481359/HoldBoost%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/481359/HoldBoost%20Tweaks.meta.js
// ==/UserScript==

(async function() {
	const css = `
/* Levels */
#pills-tab {
  flex-wrap: nowrap;
  align-items: center;
}
.level-medal-times {
  flex: 1 1 5vw;
  max-width: 100%;
  min-width: 150px;
  margin: 0 max(0.5vw,18px) 1vw max(0.5vw,16px) !important;
  padding: 0.25vw !important;
}
#pills-sightings > div,
#pills-improvements > div,
#pills-info > div {
  max-height: calc(100vh - 27.7rem);
  overflow-y: auto;
}
.sticky-headers thead th {
  z-index: 1;
}
table tbody tr td.entry-img {
  vertical-align: middle;
}
body {
  background-position: center;
}

th.text-left {
  text-align: center !important;
}

#pills-tab .nav-item {
  flex: 1;
  align-self: stretch;
}
.nav-pills .nav-link {
  background-color: #00000033;
  margin: 0 0.2vw 0 0.2vw;
  height: 100%;
}
.nav-pills .nav-link:not(.active):hover {
  background-color: #00000044;
}
.nav-pills:first-child .nav-link {
  margin-left: 0;
}
.nav-pills:last-child .nav-link {
  margin-right: 0;
}
.col-3.offset-1 .nav-pills .nav-item:first-child a:not(#pills-recent-activity-tab) {
  /*line-height: 3.06rem;*/
  padding: 1.25rem;
}
thead th  {
  position: sticky;
  top: -2px;
  background-color: #212529;
}
#levelsPlaceholder + #levels > .text-left {
  position: sticky;
  top: -20px;
  z-index: 10;
  background-color: #222222;
}

@keyframes custom-fade {
  0% {color: yellow;}
  50% {color: yellow;}
  100% {color: white;}
}
.fade-in-custom {
  animation: custom-fade 1s ease-out;
}

h5 a {
  color: white;
}

h5 a:hover {
  color: #eee;
}

#customAvatar {
  max-height: 40px;
  margin-right: 5px;
}

#customRank {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.col-4 table:nth-child(5) {
  table-layout: fixed;
}

.col-4 table:nth-child(5) td.no-wrap:not(.entry-img) {
  padding-left: 4px;
  padding-right: 4px;
}

.col-4 table:nth-child(5) td:nth-child(2) div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

div.col-4.col-xl-12 > h2 > a:nth-child(2) {
  padding-left: 10px;
  color: inherit;
  text-decoration: none;
}

.rivals-div {
  padding: 0.5em;
}

.rival-header {
  margin-bottom: 0;
  cursor: help;
}

.rival-category {
  font-size: 0.9em;
  color: grey;
  cursor: help;
}

.rival-category a {
  color: #007bffc7;
}
`.split("\n").filter((e) => e !== "").join("\n");
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			// no head yet, stick it whereever
			document.documentElement.appendChild(node);
		}
	}

	/* Add delimiter to numbers on homepage */

	const homepageRows = [
		document.querySelector(".container .row div form+div"),
		document.querySelector(".container .row div form+div+div"),
		document.querySelector(".container .row div form+div+div+div"),
		document.querySelector(".container .row div form+div+div+div+div")
	];
	if (homepageRows[3]) {
		const nums = homepageRows.map(r => r.children[0]);
		if (nums[3]) {
			nums.forEach(n => {
				n.innerText = parseInt(n.innerText, 10).toLocaleString();
			});
		}
	}

	/* Auto-refresh activity pages */

	let pause = false;
	let interval;

	function createRow(activity, pageType, fade = true) {
		let row = "";
		if (pageType === "player") {
			if (activity.sighting != null) {
				row = `
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img class="card-img-top" src="${activity.sighting.leaderboard.imageURL}">
								</div></td>
								<td class="text-left"><div class="${(fade)?"fade-in":""}">
									<a class="link" href="/Leaderboard/Level?leaderboardID=${activity.sighting.leaderboard.id}">
										${activity.sighting.leaderboard.levelName}
									</a>
								</div></td>
								<td><div class="${(fade)?"fade-in":""}">${/*TODO*/''}</div></td>
								<td><div class="${(fade)?"fade-in":""}">${activity.sighting.millisecondsString} <span class="text-success">New!</span></div></td>
								<td><div class="${(fade)?"fade-in":"fade-in-custom"}">${activity.timeAgoString}</div></td>
							`;
			} else {
				row = `
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img class="card-img-top" src="${activity.improvement.leaderboard.imageURL}">
								</div></td>
								<td class="text-left"><div class="${(fade)?"fade-in":""}">
									<a class="link" href="/Leaderboard/Level?leaderboardID=${activity.improvement.leaderboard.id}">
										${activity.improvement.leaderboard.levelName}
									</a>
								</div></td>
								<td><div class="${(fade)?"fade-in":""}">
									${activity.improvement.newRank}
									( <i class="fas fa-arrow-up fa-sm text-success"></i> ${activity.improvement.oldRank - activity.improvement.newRank} )</div></td>
								<td><div class="${(fade)?"fade-in":""}">
									${activity.improvement.millisecondsString}
									( <i class="fas fa-arrow-up fa-sm text-success"></i> ${activity.improvement.timeImprovement} )</div></td>
								<td><div class="${(fade)?"fade-in":"fade-in-custom"}">${activity.timeAgoString}</div></td>
							`;
			}
		} else {
			if (activity.sighting != null) {
				row = `
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img src="${activity.sighting.player.steamAvatar}" />
									<a class="link" href="/Player?steamID=${activity.sighting.player.steamID}">
										${activity.sighting.player.name}
									</a>
								</div></td>
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img src="${activity.sighting.leaderboard.imageURL}" />
									<a class="link" href="/Leaderboard/Level?leaderboardID=${activity.sighting.leaderboard.id}">
										${activity.sighting.leaderboard.levelName}
									</a>
								</div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":""}">${/*TODO*/''}</div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":""}">${activity.sighting.millisecondsString} <span class="text-success">New!</span></div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":"fade-in-custom"}">${activity.timeAgoString}</div></td>
						`;
			} else {
				row = `
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img src="${activity.improvement.player.steamAvatar}" />
									<a class="link" href="/Player?steamID=${activity.improvement.player.steamID}">
										${activity.improvement.player.name}
									</a>
								</div></td>
								<td class="text-left entry-img no-wrap"><div class="${(fade)?"fade-in":""}">
									<img src="${activity.improvement.leaderboard.imageURL}" />
									<a class="link" href="/Leaderboard/Level?leaderboardID=${activity.improvement.leaderboard.id}">
										${activity.improvement.leaderboard.levelName}
									</a>
								</div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":""}">
									${activity.improvement.newRank}
									( <i class="fas fa-arrow-up fa-sm text-success"></i> ${activity.improvement.oldRank - activity.improvement.newRank} )</div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":""}">
									${activity.improvement.millisecondsString}
									( <i class="fas fa-arrow-up fa-sm text-success"></i> ${activity.improvement.timeImprovement} )</div></td>
								<td class="no-wrap"><div class="${(fade)?"fade-in":"fade-in-custom"}">${activity.timeAgoString}</div></td>
						`;
			}
		}
		return row;
	}

	function compare(a, b, x, y) {
		if (x === y) return a[x].isEqualNode(b[x]);
		else return a[x].isEqualNode(b[x]) && compare(a, b, x + 1, y);
	}

	async function getNewActivity() {
		if (document.visibilityState !== 'visible') return;
		const h = document.location.href;
		const pageType = (h.match(/Player\?steamID=\d+$/)) ? "player" : (h.match(/\/Home\/(WR|Top100)Activity$/)) ? "activity" : null;
		if (!pageType) return;
		if (pause || (pageType === "player" && !($('.nav').children()[0].children[0].isSameNode($('.nav-link.active').get(0))))) {
			console.log("[CAL] paused");
			return;
		}
		try {
			let json;
			if (pageType === "player") {
				const player = document.location.search.split("=")[1];
				const res = await fetch(`/Player/GetRecentActivity?steamID=${player}`);
				json = await res.json();
			} else {
				let res;
				if (h.match(/GlobalActivity$/)) {
					res = await fetch("/Home/GetGlobalRecentActivity");
				} else if (h.match(/WRActivity$/)) {
					res = await fetch("/Home/GetWRActivity");
				} else if (h.match(/Top100Activity$/)) {
					res = await fetch("/Home/GetTop100RecentActivity");
				}
				json = await res.json();
			}
			const recentActivity = $('#recentActivity');
			console.log("[CAL] got data");
			const mostRecentVisible = recentActivity.children()[0];
			const rowsToInsert = [];
			let found = false;
			let i = 0;
			for (const activity of json) {
				const row = $("<tr>" + createRow(activity, pageType) + "</tr>");
				const c = document.querySelector("#recentActivity").children[0].children;
				const d = row.children();
				//const recentStr = c[0].innerHTML+c[1].innerHTML+c[2].innerHTML+c[3].innerHTML;
				//const rowStr = d[0].innerHTML+d[1].innerHTML+d[2].innerHTML+d[3].innerHTML;
				//console.log("recentStr", recentStr);
				//console.log("rowStr", rowStr);
				//console.log("compare", rowStr !== recentStr);
				//console.log("c", c);
				//console.log("d", d);
				if (!found && !compare(c, d, 0, 3)) {
					console.log("[CAL] insert row");
					rowsToInsert.push(row);
				} else {
					found = true;
					const rc = row.children()[4];
					const ra = document.querySelector("#recentActivity").children[i];
					//console.log("i", i);
					//console.log("document.querySelector(\"#recentActivity\").children", document.querySelector("#recentActivity").children);
					//console.log("ra", ra);

					if (rc.innerText !== ra.children[4].innerText) {
						$(ra.children[4]).replaceWith($("<tr>" + createRow(activity, pageType, false) + "</tr>").children()[4]);
					}
					i++;
				}
			}
			if (!rowsToInsert[0]) {
				return;
			}
			if (pageType === "player" && getGlobalStats) {
				console.log("[CAL] getting new global stats");
				getGlobalStats();
				displayRivals();
			}
			rowsToInsert.reverse();
			for (const row of rowsToInsert) {
				recentActivity.prepend(row);
				const maxCount = (pageType === "activity") ? 100 : 30;
				if (recentActivity.children().length > maxCount) {
					recentActivity.get(0).deleteRow(recentActivity.children().length - 1);
				}
			}
		} catch (e) {
			console.error(e);
			toastr.error('[HBT] Failed to load recent activity for this player');
			clearInterval(interval);
		}
	}

	if (document.location.href.match(/Player\?steamID=\d+$/) || document.location.href.match(/\/Home\/(WR|Top100)Activity$/)) {
		interval = setInterval(getNewActivity, 1000 * 10);
	}
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === 'visible') {
			pause = false;
			getNewActivity();
			interval = setInterval(getNewActivity, 1000 * 10);
		} else {
			pause = true;
			clearInterval(interval);
		}
	});
	const navLinks = document.querySelectorAll(".nav-pills .nav-link");
	navLinks.forEach(l => {
		l.addEventListener("click", (e) => {
			const customFades = document.querySelectorAll(".fade-in-custom");
			customFades.forEach(f => {
				f.classList.remove("fade-in-custom");
				f.style.animation = "none";
				setTimeout(() => {
					const parent = f.parentElement;
					$(f).detach().addClass("fade-in").appendTo(parent);
					f.style.animation = "";
				}, 200);
			});
		});
	});

	/* Find rivals for player pages */

	function getRivals(steamId, data) {
		if (!data.success) {
			return 0;
		}
		// Find the index of the player with the given steam ID
		let playerIndex = -1;
		for (let i = 0; i < data.success.rows.length; i++) {
			if (data.success.rows[i][0] === steamId) {
				playerIndex = i;
				break;
			}
		}

		// Return null if the player with the given steam ID is not found
		if (playerIndex === -1) {
			return null;
		}

		// Initialize the list of rivals
		let rivals = [data.success.rows[playerIndex]]; // Add the player to the list of rivals

		// Add the 5 players ranked above the player to the list of rivals
		for (let i = playerIndex - 1; i >= Math.max(0, playerIndex - 5); i--) {
			if (i < 0) {
				break;
			}
			rivals.push(data.success.rows[i]);
		}

		// Add the 5 players ranked below the player to the list of rivals
		for (let i = playerIndex + 1; i <= Math.min(data.success.rows.length - 1, playerIndex + 5); i++) {
			if (i > data.success.rows.length - 1) {
				break;
			}
			rivals.push(data.success.rows[i]);
		}

		rivals.forEach((player, index) => {
			player.index = index;
		});

		// Sort the list of rivals by global rank
		rivals.sort((a, b) => {
			if (parseInt(a[1]) === parseInt(b[1])) { // If the ranks are the same
				return a.index - b.index; // Compare the indices of the players in the original list
			}
			return parseInt(a[1]) - parseInt(b[1]); // Compare the global ranks (column 1) of the players
		});

		return rivals;
	}

	async function displayRivals() {
		if (document.location.href.match(/Player\?steamID=\d+$/)) {
			try {
				const limit = 10000;
				const res = await fetch(`https://distance-db-sql-api.seekr.pw/?query=SELECT%0A%20%20steam_id,%0A%20%20RANK()%20OVER%20(%0A%20%20%20%20ORDER%20BY%20SUM(noodle_points)%20DESC%0A%20%20)%20as%20global_rank,%0A%20%20name,%0A%20%20SUM(noodle_points)%20as%20noodle_points,%0A%20%20ROUND((SUM(noodle_points)%20/%201200)::numeric,%202)%20as%20player_rating%0AFROM%20(%0A%20%20SELECT%0A%20%20%20%20user_info.steam_id,%0A%20%20%20%20user_info.name,%0A%20%20%20%20official_sprint.id,%0A%20%20%20%20CASE%20WHEN%20sle.rank%20is%20NULL%20OR%20sle.rank%20%3E%201000%20THEN%200%20ELSE%20ROUND(1000.0%20*%20(1.0%20-%20%7C/(1.0%20-%20(((sle.rank%20-%201.0)/1000.0)%20-%201.0)%5E2)))%20END%20AS%20noodle_points%0A%20%20FROM%20(%0A%20%20%20%20SELECT%20steam_id,%20name%20FROM%20Users%0A%20%20)%20user_info%0A%20%20CROSS%20JOIN%20(%0A%20%20%20%20SELECT%20id%20FROM%20official_levels%20WHERE%20is_sprint%0A%20%20)%20official_sprint%0A%20%20INNER%20JOIN%20sprint_leaderboard_entries%20sle%20ON%20sle.level_id%20=%20official_sprint.id%20AND%20sle.steam_id%20=%20user_info.steam_id%0A)%20official_ranks%0AGROUP%20BY%20steam_id,%20name%0AORDER%20BY%20SUM(noodle_points)%20DESC%0ALIMIT%20${limit}`, {
					"method": "GET",
					"mode": "cors",
					"credentials": "omit",
					"cache": "no-cache"
				});
				const json = await res.json();
				const currentPlayerId = document.location.href.match(/Player\?steamID=(\d+)$/)[1];
				const rivals = getRivals(currentPlayerId, json);
				console.log("[CAL] rivals:", rivals);
				const column = document.querySelector("body > div > main > div > div > div.col-xl-3.col-12");
				if (column.children.length >= 7) {
					column.children[6].remove();
				}
				if (column.children.length >= 6) {
					column.children[5].remove();
				}
				const hr = document.createElement("hr");
				const rivalDiv = document.createElement("div");
				rivalDiv.classList.add("rivals-div", "fade-in", "info-card", "box-shadow", "rounded-corners");
				const rivalTitle = "Based on the Official Sprint leaderboard rankings.";
				const rivalHead = document.createElement("h4");
				rivalHead.classList.add("rival-header");
				rivalHead.innerText = "Rivals";
				rivalHead.title = rivalTitle;
				const rivalCat = document.createElement("span");
				rivalCat.classList.add("rival-category");
				rivalCat.innerHTML = '(<a href="/Leaderboard/OfficialSprint">Official Sprint</a>)';
				rivalCat.title = rivalTitle;
				rivalDiv.appendChild(rivalHead);
				rivalDiv.appendChild(rivalCat);
				column.appendChild(hr);
				column.appendChild(rivalDiv);
				if (rivals === 0) {
					const p = document.createElement("p");
					p.innerHTML = "Rivals list could not be fetched. Try refreshing the page.";
					console.log("[CAL] failed fetching json", json);
					rivalDiv.appendChild(p);
				} else if (!rivals || rivals.find(r => r[0] === currentPlayerId)[3] === "0") {
					const p = document.createElement("p");
					p.innerHTML = "This player has 0 points.<br />They must be ranked within the top 1000 on any level to get points before a rivals list can be made.";
					rivalDiv.appendChild(p);
				} else {
					const ul = document.createElement("ul");
					ul.style.listStyleType = "none";
					ul.style.textAlign = "left";
					ul.style.paddingLeft = "0";
					rivalDiv.appendChild(ul);
					let oddEven = false;
					for (const rival of rivals) {
						const [id, rank, name, points, rating] = rival;
						const res2 = await fetch(`/Search/Players?q=${name}`);
						const players = await res2.json();
						const li = document.createElement("li");
						li.style.margin = "3px";
						li.style.padding = "3px";
						li.style.borderRadius = "5px";
						li.style.background = (oddEven) ? "#ffffff11" : "#ffffff1f";
						oddEven = !oddEven;
						const player = players.find(p => p.steamID === id);
						if (id === currentPlayerId) {
							li.style.background = "#00ffff2f";
						}
						let txt;
						if (!player) {
							txt = `${rank} &#9;&#9; <a class="link" style="margin-left:39px;" href="/Player?steamID=${id}">${name}</a>`
						} else {
							txt = `${rank} &#9;&#9; <a class="link" href="/Player?steamID=${id}"><img src="${player.steamAvatar}" class="mr-2" \>${name}</a>`;
						}
						ul.appendChild(li);

						li.innerHTML = txt;
					}
				}
				/*column.appendChild(rivalDiv);*/
			} catch (e) {
				console.error(e);
			}
		}
	}
	displayRivals();

	/* Add your own player ranks */

	const lssteamIDs = localStorage.getItem("mySteamID");
	const lsIds = lssteamIDs.split(",");

	async function getRankings(playerId) {
		if (!playerId) return;
		const match = document.location.href.match(/Leaderboard\/Level\?leaderboard(id|ID)=\d+$/);
		if (!match) return;
		const matches = document.location.href.match(/Leaderboard\/Level\?leaderboard(id|ID)=(\d+)$/);
		console.log(matches);
		if (!matches || !matches[2]) return;
		const [,, mapId] = matches;
		try {
			const res = await fetch(`/Player/GetLeaderboardRankings?steamID=${playerId}`);
			const json = await res.json();
			if (!json?.[0]) {
				return toastr.error('[HBT] No user found with the given SteamID64');
			}
			let thisMap = json.find(entry => entry.leaderboard.id == mapId);
			let unranked = false;
			if (!thisMap) {
				unranked = true;
				thisMap = json[0];
			}
			const topInfo = document.querySelector("body > div > main > div > div:nth-child(1)");
			while (topInfo.children.length >= 5 + lsIds.length) {
				topInfo.removeChild(topInfo.lastChild);
			}
			topInfo.style.marginBottom = "10px";
			const yourRank = `<div class="col-12"><h5 class="stroke" id="customRank"><img id="customAvatar" src="${thisMap.player.steamAvatar}" /><span><a href="/Player?steamID=${thisMap.player.steamID}">${thisMap.player.name}</a> Rank: ${(unranked) ? "None" : thisMap.rank}</span></h5></div>`
			topInfo.innerHTML += yourRank;
		} catch (e) {
			console.error(e);
		}
	}

	if (lsIds[0]) {
		for (const id of lsIds) {
			getRankings(id);
		}
	}

	async function getRankingsAll(playerId) {
		if (!playerId) return;
		if (!document.location.href.match(/Leaderboard\/Levels$/)) return;
		try {
			const res = await fetch(`/Player/GetLeaderboardRankings?steamID=${playerId}`);
			const json = await res.json();

			if (!json?.[0]) {
				return toastr.error('[HBT] No user found with the given SteamID64');
			}

			while (document.querySelectorAll(".level-card").length < 194) {
				await new Promise((resolve) => {
					setTimeout(resolve, 100);
				});
			}
			const cards = Array.from(document.querySelectorAll(".level-card"));

			for (const card of cards) {
				const matches = card.children[0]?.href?.match(/Leaderboard\/Level\?leaderboard(id|ID)=(\d+)$/);
				if (!matches || !matches[2]) continue;
				const [,, mapId] = matches;
				if (!mapId) continue;
				const thisMap = json.find(entry => entry.leaderboard.id == mapId);
				if (!thisMap) continue;
				const cardInfo = card.children[0].children[0].children[1];
				while (cardInfo.children.length >= 3 + lsIds.length) {
					cardInfo.removeChild(cardInfo.lastChild);
				}
				const yourRank = `<h6 class="card-subtitle mb-2">${thisMap.player.name} Rank: ${thisMap.rank}</h6>`;
				cardInfo.innerHTML += yourRank;
			}
		} catch (e) {
			console.error(e);
		}
	}

	if (lsIds[0]) {
		for (const id of lsIds) {
			getRankingsAll(id);
		}
	}

	function insertSteamIDForm() {
		const form = `<form class="form-inline" id="steamID"><input class="form-control mr-sm-2" placeholder="Enter your SteamID64"><button class="btn btn-success">Profile</button></form>`;
		const div = document.createElement("div");
		div.innerHTML = form;
		const navbar = document.querySelector("body > header > nav");
		const search = navbar.querySelector("form input[placeholder=\"Enter player name\"]");
		if (search) {
			navbar.insertBefore(div.firstChild, navbar.querySelector("form"));
			document.querySelector("form#steamID button").style.marginRight = "15px";
		} else {
			navbar.appendChild(div.firstChild);
		}
		const steamIDs = localStorage.getItem("mySteamID");
		const ids = steamIDs.split(",");
		if (steamIDs && ids[0]) {
			document.querySelector("form#steamID input").value = steamIDs;
			document.querySelector("form#steamID button").addEventListener("click", (event) => {
				event.preventDefault();
				window.location.href = `http://holdboost.com/Player?steamID=${ids[0]}`;
			});
		}
		document.querySelector("form#steamID input").addEventListener("input", (event) => {
			const val = event.target.value;
			localStorage.setItem("mySteamID", val);
			console.log(`[CAL] Set SteamID: ${val}`);
			processChange(val);
		});
	}

	async function removeCustomProfile() {
		if (document.location.href.match(/Leaderboard\/Level\?leaderboard(id|ID)=\d+$/)) {
			const topInfo = document.querySelector("body > div > main > div > div:nth-child(1)");
			while (topInfo.children.length >= 6) {
				topInfo.removeChild(topInfo.lastChild);
			}
			topInfo.style.marginBottom = "50px";
		} else if (document.location.href.match(/Leaderboard\/Levels$/)) {
			while (document.querySelectorAll(".level-card").length < 120) {
				await new Promise((resolve) => {
					setTimeout(resolve, 1000);
				});
			}
			const cards = Array.from(document.querySelectorAll(".level-card"));
			for (const card of cards) {
				const cardInfo = card.children[0].children[0].children[1];
				while (cardInfo.children.length >= 3) {
					cardInfo.removeChild(cardInfo.lastChild);
				}
			}
		}
	}


	async function testValidID() {
		const idItem = localStorage.getItem("mySteamID");
		const ids = idItem.split(",");
		if (ids.length === 1 && ids[0] === "") {
			toastr.info('[HBT] Removed SteamID64');
			removeCustomProfile();
		}
		for (const id of ids) {
			const res = await fetch(`/Player/GetLeaderboardRankings?steamID=${id}`);
			const json = await res.json();
			if (!json?.[0]) {
				toastr.error(`[HBT] No user found with the given SteamID64: `);
				removeCustomProfile();
			} else {
				toastr.success(`[HBT] Found user with matching SteamID64: `);
				getRankings(id);
				getRankingsAll(id);
			}
		}
	}
	insertSteamIDForm();

	function debounce(func, timeout = 300) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
		};
	}
	const processChange = debounce(() => testValidID());

	function autofillCompare() {
		if (!document.location.href.match(/Player\/Compare$/)) return;
		const compareInput = document.querySelector("input[name=\"steamIDs\"]");
		if (!compareInput) return;
		const idItem = localStorage.getItem("mySteamID");
		if (!idItem) return;

		compareInput.value = `${idItem},`;
	}
	autofillCompare();

	function profileCompareButton() {
		if (!document.location.href.match(/Player\?steamID=\d+$/)) return;
		const nameElem = document.querySelector("body > div > main > div > div > div.col-xl-3.col-12 > div:nth-child(1) > div > div.col-4.col-xl-12 > h2");
		if (!nameElem) return;
		const idItem = localStorage.getItem("mySteamID");
		if (!idItem) return;
		const compareID = new URL(location.href).searchParams.get('steamID');
		if (!compareID || compareID === idItem) return;
		const compareBtn = document.createElement("a");
		const compareIcon = document.createElement("i");
		compareBtn.appendChild(compareIcon);
		compareIcon.title = "Compare with your SteamID";
		compareIcon.classList.add("fas", "fa-user-friends", "fa-xxs", "pointer");
		compareBtn.href = `/Player/Compare?steamIDs=${idItem},${compareID}`;
		nameElem.appendChild(compareBtn);
	}
	profileCompareButton();

	function imgError(img, src) {
		img.src = `${src.origin}${src.pathname}?${Date.now()}`;
	}

	function challengeThumbnailFixer() {
		const images = {
			detached: 'https://i.imgur.com/tlkiNbm.png',
			secondTheory: 'https://i.imgur.com/tSuPbHY.png',
			transfer: 'https://i.imgur.com/sDP8KEU.png',
			divide: 'https://i.imgur.com/xhYXbk8.png',
			thunderStruck: 'https://i.imgur.com/FEu5aUy.png',
			electric: 'https://i.imgur.com/5R2LbgX.png',
			descent: 'https://i.imgur.com/kRqjD5v.png',
			disassemblyLine: 'https://i.imgur.com/v0LRhej.png',
			redHeat: 'https://i.imgur.com/QvK7BIi.png',
			grinder: 'https://i.imgur.com/JcsEZ5b.png',
			dodge: 'https://i.imgur.com/123tJfC.png',
			elevation: 'https://i.imgur.com/OjA5vOw.png',
			obsidian: 'https://i.imgur.com/BuOIbjU.png',
			hexahorrific: 'https://i.imgur.com/DyjdmL1.png',
			variantBlue: 'https://i.imgur.com/HOexe45.png',
			biotec: 'https://i.imgur.com/w6WaBq2.png',
			thousand: 'https://steamuserimages-a.akamaihd.net/ugc/2279448391641141756/9078E26CD4E84EF5508A1122A35C088C965742DA/',
			depthCharge: 'https://steamuserimages-a.akamaihd.net/ugc/2316602371579824460/11F8A76C398E817FE79FB0025BCD86B5F8D96535/',
			graphicsRendered: 'https://steamuserimages-a.akamaihd.net/ugc/2283952543886534476/E9B8E703835A8FF3EFDB1952485B3BC2325815A0/',
			cosmicCemetary: 'https://steamuserimages-a.akamaihd.net/ugc/2316603175893844974/2E447ADC6B7D2597B290E699C0D996C16EB0D169/',
			deception: 'https://steamuserimages-a.akamaihd.net/ugc/2282826178706727719/B6509FBCD70CDE88494F30AB01B23EE08FE34B86/',
			theMidnightExpress: 'https://steamuserimages-a.akamaihd.net/ugc/2303092377005933618/6CBCF61096A20F72F65AE2C31D738597499DA622/',
			identityCrisis: 'https://steamuserimages-a.akamaihd.net/ugc/2526026386756221466/A3D7C589FDD88E50805D1CF9E173D51746C57EE4/',
			facility80: 'https://steamuserimages-a.akamaihd.net/ugc/2437082801613562853/66473D0D5DA345FD31CF01ABC8F1E6EFB7F4CD80/',
			flightburner: 'https://steamuserimages-a.akamaihd.net/ugc/2273820125785641489/18397011F214E4C7C2BD74238C23ED32B5B50257/',
			sn0wf1ake: 'https://steamuserimages-a.akamaihd.net/ugc/2315477741232261160/787630C9D1FC40ECA9D94CFC7B942A31304F1A69/'
		};

		function runSwitch(name, defaultVal) {
			switch (name) {
				case 'Detached':
					return images.detached;
				case '44 Second Theory':
					return images.secondTheory;
				case 'Transfer':
					return images.transfer;
				case 'Divide':
					return images.divide;
				case 'Thunder Struck':
					return images.thunderStruck;
				case 'Electric':
					return images.electric;
				case 'Descent':
					return images.descent;
				case 'Disassembly Line':
					return images.disassemblyLine;
				case 'Red Heat':
					return images.redHeat;
				case 'Grinder':
					return images.grinder;
				case 'Dodge':
					return images.dodge;
				case 'Elevation':
					return images.elevation;
				case 'Obsidian':
					return images.obsidian;
				case 'Hexahorrific':
					return images.hexahorrific;
				case 'Variant Blue':
					return images.variantBlue;
				case 'Biotec 4':
					return images.biotec;
				case 'DAC #3: Thousand':
					return images.thousand;
				case 'DAC #6: Depth Charge':
					return images.depthCharge;
				case 'DAC #8: Graphics Rendered':
					return images.graphicsRendered;
				case 'DAC #9: Cosmic Cemetary':
					return images.cosmicCemetary;
				case 'DAC #12: Deception':
					return images.deception;
				case 'DAC #14: The Midnight Express':
					return images.theMidnightExpress;
				case 'DAC #17: Identity Crisis':
					return images.identityCrisis;
				case 'DAC #20: Facility #80':
					return images.facility80;
				case 'DAC #20: Flightburner':
					return images.flightburner;
				case 'DAC #21: sn0wf1ake':
					return images.sn0wf1ake;
				default:
					return defaultVal || '';
			}
		}

		if (document.location.href.match(/Leaderboard\/Level\?leaderboard(id|ID)=\d+$/)) {
			const bgImg = window.getComputedStyle(document.body).backgroundImage;
			// console.log('[CAL]', bgImg);
			if (bgImg.includes('placekitten.com')) {
				const nameElem = document.querySelector(".col-12 > h1");
				const name = nameElem.innerText;
				const newBgImg = runSwitch(name);
				if (!newBgImg) return;
				document.body.style.backgroundImage = `url(${newBgImg})`;
			}
		} else if (document.location.href.match(/Player\?steamID=\d+$/)) {
			// potential change to disconnect observer after initial entries are loaded:
			// https://chatgpt.com/share/26f76f89-e0f4-4c81-b84b-1db0353860e2
			const recentActivity = document.querySelector('#recentActivity');
			const rankingsTable = document.querySelector('#leaderboardRankingsTable');
			if (!recentActivity) return;
			const config = { childList: true, subtree: true };

			const callback = (mutationList, observer) => {
				for (const mutation of mutationList) {
					if (mutation.type !== 'childList') continue;
					// console.log('[CAL]', 'child node added', mutation.addedNodes);
					const rows = Array.from(mutation.addedNodes);
					for (const row of rows) {
						if (!row?.children?.[0] || !row?.children?.[1]) continue;
						if (!row?.children?.[0]?.children?.[0]?.children?.[0]?.src) continue;
						const src = new URL(row.children[0].children[0].children[0].src);
						if (src.hostname !== 'placekitten.com' && src.hostname !== 'steamuserimages-a.akamaihd.net') continue;
						const mapName = row.children[1].innerText;
						const newSrc = runSwitch(mapName, row.children[0].children[0].children[0].src);
						row.children[0].children[0].children[0].src = newSrc;
					}
				}
			}
			const observer = new MutationObserver(callback);
			observer.observe(recentActivity, config);
			observer.observe(rankingsTable, config);
		} else if (document.location.href.match(/Leaderboard\/Levels$/)) {
			const levels = document.querySelector('#levels');
			if (!levels) return;
			const config = { childList: true, subtree: true }

			const callback = (mutationList, observer) => {
				for (const mutation of mutationList) {
					if (mutation.type !== 'childList') continue;
					// console.log('[CAL]', 'added nodes', mutation.addedNodes);
					const lvlCards = Array.from(mutation.addedNodes);
					for (const card of lvlCards) {
						if (!card.classList?.contains('level-card')) continue;
						const img = card.querySelector('img');
						if (!img.src.includes('placekitten.com') && !img.src.includes('steamuserimages-a.akamaihd.net')) continue;
						const name = card.querySelector('h5').innerText;
						const newSrc = runSwitch(name);
						if (!newSrc) continue;
						img.src = newSrc;
					}
				}
			}
			const observer = new MutationObserver(callback);
			observer.observe(levels, config);
		}
	}
	challengeThumbnailFixer();

})();
