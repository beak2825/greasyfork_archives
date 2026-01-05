// ==UserScript==
// @name        IDEAL Scripts
// @version     1.29
// @description All IDEAL Scripts for idealclan.eu merged into one
// @author      Orrie
// @namespace   http://idealclan.eu/viewtopic.php?f=7&t=1791#p57645
// @icon        https://i.imgur.com/9GeRjIp.png
// @include     http*://*idealclan.eu/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     eu.wargaming.net
// @connect     api.worldoftanks.eu
// @connect     worldoftanks.eu
// @connect     api.twitch.tv
// @require     https://greasyfork.org/scripts/18946-tablesort/code/Tablesort.js?version=120660
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license     Mr Sexii License
// @downloadURL https://update.greasyfork.org/scripts/20094/IDEAL%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/20094/IDEAL%20Scripts.meta.js
// ==/UserScript==
(function() {
	// global variables
	let battleTable, updateInterval, style, sortTable = false, time, styleDynBattles, styleDynFinales, inputSpan, timeJump = false, timeInterval, styleDynTimezone;
	// script variables
	const script = {
		vers: GM.info ? GM.info.script.version : "",
		cw: {
			status: JSON.parse(localStorage.getItem("battles_force")) || false,
			event: false,
			gold: true,
			tier: "Ɵ",
			battles: "Ɵ",
			elo: "Ɵ",
			current: 0,
			globalmap: false
		},
		dyn: {
			conc: {},
			prov: [],
			plan: 0,
			check: 0,
			gold: 0
		},
		clan: {
			ideal: 500010805,
			id: JSON.parse(localStorage.getItem("battles_clanid")) || 500010805,
			tag: "Ɵ",
			emblem: "Ɵ",
			color: "Ɵ"
		},
		table: {
			static: 10,
			eu: [17, 18, 19, 20, 21, 22, 23, 24],
			html: "",
			classes: []
		},
		front_loc: {
			"league1": " (BF)",
			"league2": " (AF)",
			"league3": " (EF)"
		},
		app_id: "a7595640a90bf2d19065f3f2683b171c",
		time: (function () {
			const date = new Date(),
			hour = date.getHours(),
			min = date.getMinutes(),
			offset = (date.getTimezoneOffset() > 0 ? -Math.abs(date.getTimezoneOffset()) : Math.abs(date.getTimezoneOffset())) / 60,
			roundTime = min >= 15 && min <= 45 ? [hour, "30"] : min <= 15 ? [hour, "00"] : [hour + 1, "00"],
			classes = `${roundTime[0]}_${roundTime[1]}`;
			return { hour, min, offset, roundTime, classes };
		})(),
		api: {
			event: "https://api.worldoftanks.eu/wot/globalmap/events/?application_id=",
			clan: "https://eu.wargaming.net/globalmap/game_api/clan/",
			bats: "https://eu.wargaming.net/globalmap/game_api/map_fill_info?aliases=",
			tourney: "https://eu.wargaming.net/globalmap/game_api/tournament_info?alias=",
			prov: "https://eu.wargaming.net/globalmap/game_api/province_info?alias=",
			provs: "https://api.worldoftanks.eu/wot/globalmap/clanprovinces/?application_id=",
			divs: "https://eu.wargaming.net/globalmap/game_api/wot/clan_tactical_data", // need authentication from global map
			raids: "https://eu.wargaming.net/globalmap/game_api/wot/raids", // need authentication from global map
			stats: "https://worldoftanks.eu/en/clanwars/rating/alley/users/stats/myclan/" // need authentication from worldoftanks.eu
		},
		img: {
			// image data uri
			main: "data:image/png;base64,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",
			bonds: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAARCAYAAADZsVyDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPDSURBVDhPrZNLUFtVGMdjISEkDdRih6IOSlOHlEpHq+VRQ9F2Cp3EhAB5kZibBwlJCCSBJDeBkEAehPIIAWQwQnEGKu20DNbWRRcu0AUru3DXceXKhS4cx3FZ5+8XJi4cXdTqb+Y3c8899/zP950zl/MfOMvjczuLz/8Lbzc2n9l0j+ifzMwMorbuhK/4/pngVoj4subWhl23V4Pl6z6sBKzIeU3wT9lRVV0xUPzuqRBXVgq0EkntwtWOC985nCosrLJIjVowI2/HHYsc911K5H1GOFgT+EKesbjub/DLhbzOWkntzHuq9kc2R88vLGvG0LARXm8//H4nulUy+Px9yK2PwfuBEls2Bfb9vfhkzIb+kAHPlXCUxaxDys401GUNhs7H7Lgdi9Ne3Ex6kJsaQjThgUIux+ioB8lUBF1KJXR9GlyfH8LqnTR85m58HdTinlmG5DCDQZ/uyVGR4Eoxl3OSscqwf7CN+X4dvqSKHthVyIRt+PSLLC63t0GrVVPFLtrAhWgsBIVCjsV1FpkJJ26oryIbtCARc2P7dhrvSF//qZBZCK56ra7i19kPfdjdWcKesxcHcTtSpi4s3Ihh5/4iTIwOanU3nE4rzGYTHA4j8jQXHrEgGnchMjeE5Lybuuqnjt4Fl1eS4IiOCq1tjc+j/hQX65+vYGdzDg+9ejxKu/CxU4OtfAxr+TiiE8N0vgNwux2Ixz2IxVxIpN2ITw/A61PTpnLY7Z0waqUQCcqWOeUCXv/7l8W4drYcLW+dxN7BLdxeS2B7QI2Hkx7sjg9iORPB3b01bGymEQpZEWJtGAn0gWUNYANq+Ia6YNRfQtjRAUbRBG7pkXThKDiCyvK8teccOuv50OrbsP/NZ7i1lcXsRynkNlLIb0xiYc5LoQaEQzpMTdkQDBvg96gQJbNjesyxvZgd16BdWv87RcoOgwnRy7XHvg0yzZBJhBj1a7F9bwWZjBuRiAnhgA7RqBnsGIPxqAXjNE6HNJiNaJAI9MCiu4TWVsljYZXoJmUx5OHl/Ul9a0vdzxHtOVx5s4ZaZbA07UR6woox+gFSUSuWZ5zITTKID8vB9LaiTdrw/fHqYzu01kE2ksdJPllG/gWTskMCV/d5BF1qpMIMckk7lhI2ZKgyc08zLjaJf6iurrxL33rJC+QJshDGI4+Q/0ypkLto1TVhNWlFJki3TW22nH/1xxeqK/ZoepS8SL5IlpOFykrIp6Lk9Omar1TX3vhNLK55QOMg2Ua+RArIQmAp+UwUDl9KvkIWwgqt/oswDucPikrI9kzhn3EAAAAASUVORK5CYII="
		},
		symbols: {
			owner:"🏰", // ♖
			attack: "⚔️", // ⚔ - &#9876;
			defence: "🛡️",
			tournament: "📋",
            time: "⌛"
		},
		clans: [
			"<option value='500010805'>IDEAL</option>",
			"<option value='500152606'>EDITS</option>",
			"<option value='500025989'>FAME</option>",
			"<option value='500138915'>W31RD</option>",
			"<option value='500073739'>GX</option>"
		],
		debug: document.getElementsByClassName("headerbnl")[0].innerHTML.match(/Orrie/) ? true : false,
		debugColors: {
			"handlerEvent":   "#BD00FF",
			"handlerMain":    "#BD00FF",
			"handlerClan":    "#BD00FF",
			"handlerBats":    "#BD00FF",
			"handlerTourney": "#00FF9F",
			"handlerProvs":   "#00B8FF",
			"handlerDivs":    "#00B8FF",
			"handlerFame":    "#6678FF",
			"handlerRaids":   "#6678FF"
		}
	};
	if (script.debug) {
		console.info("script", script, new Date().toLocaleTimeString("en-GB"));
	}
	// script functions
	const handlerEvent = function({data}) {
		// event checker
		// check if active event exists
		const event = data ? data[0] : "error";
		if (event.status == "ACTIVE" || !script.cw.status) {
			if (event.status == "ACTIVE") {
				script.cw.event = true;
				script.cw.tier = 10;
				document.getElementById('js-eventName').innerHTML = `${event.event_name.replace(/_/g," ")} • `;
				if (script.clan.id == script.clan.ideal) {
					request({name: "handlerClan", api: `${script.api.stats}?event_id=${event.event_id}&front_id=${event.event_id}_bg`, handler: handlerClan});
				}
			}
			request({name: "handlerMain", api: `${script.api.clan}${script.clan.id}/battles`, handler: handlerMain});
			document.getElementById('js-tableStats').classList.remove("b-display-none");
		}
		else {
			// empty table
			battleTable.children[1].innerHTML = "";
			battleTable.children[1].appendChild(_createElement("tr", {
				className: "t-cwText",
				innerHTML: "<td colspan='23'>See you next time.</td>"
			}));
			clearInterval(updateInterval);
		}
		// insert update timestamp
		document.getElementById('js-batttleUpdate').textContent = new Date().toLocaleTimeString("en-GB");
	},
	handlerClan = function(resp) {
		if (resp.clan_stats) {
			document.getElementById('js-tableEvent').classList.remove("b-display-none");
			document.getElementById('js-famepoints').textContent = resp.clan_stats.fame_points.toLocaleString("no-NO");
			document.getElementById('js-eventPosition').textContent = resp.clan_stats.rank;
			if (resp.clan_stats.rewards) {
				const [bond, gold] = resp.clan_stats.rewards;
				document.getElementById('js-rewards').innerHTML = `Rewards: <span class='t-reward'><span class='icon icon_bonds'></span> x <span class='t-bonds t-bold'>${bond.value}</span></span><span class='t-reward'><span class='t-gold t-bold'>${gold.value}</span><span class='icon icon_main icon_gold'></span></span>`;
			}
			else {
				document.getElementById('js-rewards').innerHTML = "No reward data available"
			}
		}
		else {
			console.error("Error with API", "handlerClan", "User not logged in");
		}
	},
	handlerMain = function({clan, battles, planned_battles}) {
		// main handler
		const battleProvinces = [],
		battleFragment = document.createDocumentFragment();
		let battle, battleTime;
		// store data
		script.clan.tag = clan.tag;
		script.clan.emblem = clan.emblem_url;
		script.clan.color = clan.color;
		script.cw.battles = clan.appointed_battles_count;
		script.cw.current = battles.length;
		script.cw.elo = {
			6: clan.elo_rating_6,
			8: clan.elo_rating_8,
			10: clan.elo_rating_10
		};
		style.textContent += `.t-clantag {color: ${script.clan.color};}`;
		// go through battles and planned battles
		for (let _b = 0, _b_len = battles.length; _b < _b_len; _b++) {
			battle = battles[_b];
			if (!battleProvinces.includes(battle.province_id)) {
				battleProvinces.push(battle.province_id);
				battleTime = [timeParser(parseFloat(battle.battle_time.match(/\d+/g)[3])), battle.battle_time.match(/\d+/g)[4], battle.battle_time.match(/\d+/g)[5]];
				battleFragment.appendChild(_createElement("tr", {
					className: `battle ${battle.province_id} attack`,
					innerHTML: `
					<td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${battle.province_id}'>${battle.province_name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${battle.province_id}'>${script.symbols.tournament}</a>]</td>
					<td>${mapFix(battle.arena_name)}</td>
					<td></td>
					<td class='t-gold'><span></span><span class='icon icon_main icon_gold'></span></td>
					<td class='t-fame'>Ɵ</td>
					<td></td>
					<td><span></span><span></span></td>
					<td id='${battle.enemy.id}'><a target='_blank' href='https://eu.wargaming.net/clans/${battle.enemy.id}/'>[${battle.enemy.tag}] <img src='${battle.enemy.emblem_url}'></a><span class='t-elo'>(${battle.enemy[`elo_rating_${script.cw.event ? script.cw.tier : "10"}`]})</span></td>
					<td class='t-nextBattle' data-sort='${battleTime[0] === 0 ? battleTime[0] + 25 : battleTime[0]}${battleTime[1]}.${battleTime[2]}'>${battleTime[0]}:${battleTime[1]}:${battleTime[2]}</td>
					<td class='t-battle'>Ɵ</td>
					<td class='t-battle t-border'>Ɵ</td>
					${script.table.html}
					`
				}));
				if (battle.round_number) {
					request({name: "freepassData", api:`${script.api.tourney+battle.province_id}&round=${battle.round_number}`, handler: handlerFreepass, province: battle.province_id});
				}
			}
		}
		for (let _bp = 0, _bp_len = planned_battles.length; _bp < _bp_len; _bp++) {
			battle = planned_battles[_bp];
			if (!battleProvinces.includes(battle.province_id)) {
				battleProvinces.push(battle.province_id);
				battleTime = [timeParser(parseFloat(battle.battle_time.match(/\d+/g)[3])), battle.battle_time.match(/\d+/g)[4], battle.battle_time.match(/\d+/g)[5]];
				battleFragment.appendChild(_createElement("tr", {
					className: `battle ${battle.province_id} attack`,
					innerHTML: `
					<td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${battle.province_id}'>${battle.province_name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${battle.province_id}'>${script.symbols.tournament}</a>]</td>
					<td>${mapFix(battle.arena_name)}</td>
					<td></td>
					<td class='t-gold'><span>${battle.province_revenue}</span><span class='icon icon_main icon_gold'></span></td>
					<td class='t-fame'>Ɵ</td>
					<td></td>
					<td><span></span><span></span></td>
					<td>Not Started</td>
					<td class='t-nextBattle' data-sort='${battleTime[0] === 0 ? battleTime[0]+25 : battleTime[0]}${battleTime[1]}.${battleTime[2]}'>${battleTime[0] === 0 ? "00" : battleTime[0]}:${battleTime[1]}:${battleTime[2]}</td>
					<td class='t-battle'>Ɵ</td>
					<td class='t-battle t-border'>Ɵ</td>
					${script.table.html}
					`
				}));
				if (battle.is_attacker) {
					request({name: "freepassData", api: `${script.api.tourney+battle.province_id}&round=1`, handler: handlerFreepass, province: battle.province_id});
				}
			}
		}
		// show foes and battle count if clan has any battles and remove loading indicator
		if (script.cw.battles > 0) {
			// style.textContent += ".t-battle {display: table-cell !important;}";
			battleTable.children[1].innerHTML = ""; // empty table
		}
		battleTable.children[1].appendChild(battleFragment);
		// insert clan name
		document.getElementById('js-clan').innerHTML = `<span class='t-clantag'>[${script.clan.tag}]</span> ${clan.name} <img src='${script.clan.emblem}'> • `;
		// insert battle count
		document.getElementById('js-battles').textContent = script.cw.current;
		// insert battle count
		document.getElementById('js-battlesPlan').textContent = script.cw.battles;
		// send request for detailed battle information
		if (script.cw.battles > 0) {
			request({name: "handlerBats", api: script.api.bats + battleProvinces.join("&aliases="), handler: handlerBats});
		}
		// send request for clan provinces
		request({name: "handlerProvs", api: `${script.api.provs}${script.app_id}&clan_id=${script.clan.id}`, handler: handlerProvs});
	},
	handlerBats = function({data}, isPlanned) {
		// battles handler
		for (let _bd = 0, _bd_len = data.length; _bd < _bd_len; _bd++) {
			const battle = data[_bd],
			battleRow = document.getElementsByClassName(battle.alias)[0],
			enemyID = battleRow.children[7].id,
			battleType = battle.owner_clan_id == script.clan.id ? "Defence" : battle.owner_clan_id == enemyID ? "Owner" : "Attack",
			primeTime = [timeParser(parseFloat(battle.primetime.match(/\d+/g)[0])), battle.primetime.match(/\d+/g)[1], parseFloat(battle.primetime.match(/\d+/g)[0])];
			battleRow.dataset.primeTime = JSON.stringify(primeTime);
			if (battleType == "Defence") {
				battleRow.classList.remove("attack");
				battleRow.classList.add("defense");
			}
			// modify cells
			battleRow.children[2].textContent = `${primeTime[0]}:${primeTime[1]}`;
			battleRow.children[2].dataset.sort = `${primeTime[0]}${primeTime[1]}`;
			battleRow.children[3].firstElementChild.textContent = battle.revenue;
			battleRow.children[6].firstElementChild.textContent = battleType;
			if (battleRow.children[8].textContent == "") {
				battleRow.children[8].textContent = `${primeTime[0]}:${primeTime[1]}:00`;
				battleRow.children[8].dataset.sort = `${primeTime[0]}${primeTime[1]}`;
			}
			// get correct battle count and schedule
			request({name: "handlerTourney", api: `${script.api.tourney+battle.alias}&round=1`, handler: handlerTourney, extra: isPlanned, province: battle.alias});
		}
		// refresh table
		sortTable.refresh();
	},
	handlerTourney = function(data, isPlanned) {
		// tournament handler
		const battleRow = document.getElementsByClassName(data.province_id)[0],
		battleFront = data.front_id.match(/league\d/)[0],
		ownerClan = data.owner ? (data.owner.id == script.clan.id) || false : false,
		isAuction = data.auction_type == "auction" || battleRow.classList.contains("auction");
		let primeTime,
		cellOwnerTime = false,
		attackers = data.is_superfinal ? 1 : data.pretenders.length;
		script.dyn.check++;
		primeTime = [timeParser(parseFloat(data.start_time.match(/\d+/g)[0])), data.start_time.match(/\d+/g)[1], parseFloat(data.start_time.match(/\d+/g)[0])];
		battleRow.dataset.primeTime = JSON.stringify(primeTime);
		// check attackers
		if (attackers === 0) {
			for (let _bc = 0, _bc_len = data.battles.length; _bc < _bc_len; _bc++) {
				attackers += data.battles[_bc].is_fake ? 1 : 2;
			}
		}
		if (isAuction && battleRow.children[7].innerHTML == "Not Started") {
			attackers = data.size;
		}
		if (isPlanned && !ownerClan) {
			attackers++;
		}
		// find how many battles
		const battles = attackers !== 0 ? Math.ceil(Math.log2(attackers)) + 1 : 0;
		// modify cells
		battleRow.children[1].textContent = mapFix(data.arena_name);
		battleRow.children[2].textContent = `${primeTime[0]}:${primeTime[1]}`;
		battleRow.children[2].dataset.sort = `${primeTime[0]}${primeTime[1]}`;
		battleRow.children[3].firstElementChild.textContent = data.province_revenue;
		battleRow.children[5].innerHTML = data.owner ? `<a target='_blank' href='https://eu.wargaming.net/clans/${data.owner.id}/'><span class='t-clantag' style='color: ${data.owner.color};'>[${data.owner.tag}]</span> <img src='${data.owner.emblem_url}'></a>` : "No Owner";
		if (data.owner && script.cw.tier !== "Ɵ") {
			battleRow.children[5].appendChild(_createElement("span", {
				className: "t-elo",
				innerHTML: `(${data.owner.elo_rating ? data.owner.elo_rating : data.owner[`elo_rating_${script.cw.event ? script.cw.tier : "10"}`]})`
			}));
		}
		if (script.front_loc[battleFront]) {
			battleRow.children[6].lastElementChild.innerHTML = script.front_loc[battleFront];
		}
		if (isAuction && !ownerClan) {
			battleRow.classList.add("auction");
			battleRow.children[6].classList.add("t-auction");
			battleRow.children[6].firstElementChild.textContent = "Auction";
		}
		if (isPlanned) {
			battleRow.children[8].textContent = `${primeTime[0]}:${primeTime[1]}:00`;
			battleRow.children[8].dataset.sort = `${primeTime[0]}${primeTime[1]}.${battles}`;
		}
		// only continue if there are any attackers
		if (attackers) {
			const emptyCells = (primeTime[2] - script.table.eu[0]) * 2 + script.table.static,
			lastBattle = battles + emptyCells;
			battleRow.children[9].textContent = attackers;
			battleRow.children[10].textContent = battles;
			for (let _conc = 0, _cell = script.table.static + 1; _cell < battleRow.childElementCount; _cell++) {
				const cell = battleRow.children[_cell];
				if (_cell > emptyCells && _cell <= lastBattle) {
					const timeClass = `.${cell.classList.item(1)}`,
					timePrevClass = `.${cell.previousElementSibling.classList.item(1)}`,
					primeTimeConc = `${Number(primeTime[0] + primeTime[1]) + [0, 30, 100, 130, 200, 230, 300, 330][_conc]}`;
					if (!script.table.classes.includes(timeClass) || !script.table.classes.includes(timePrevClass)) {
						script.table.classes.push(timePrevClass, timeClass);
						if (_cell == lastBattle) {
							script.table.classes.push(`${timePrevClass} + th`, `${timePrevClass} + td`, `${timeClass} + th`, `${timeClass} + td`);
						}
					}
					if (ownerClan && _cell !== lastBattle) {
						cell.classList.add("t-noFight");
					}
					else {
						cell.classList.add("t-fight");
						if (isAuction) {
							cell.classList.add("t-auction");
						}
						if (!script.dyn.prov.includes(data.province_id)) {
							if (script.dyn.conc[primeTimeConc]) {
								script.dyn.conc[primeTimeConc]++;
							}
							else {
								script.dyn.conc[primeTimeConc] = 1;
							}
						}
					}
					if (_cell == lastBattle) {
						if (ownerClan) {
							cell.classList.add("js-last");
							let nextBattle = cell.dataset.time;
							if (primeTime[1] == 15) {
								time = nextBattle.match(/(\d+)/g);
								nextBattle = `${time[0]}:${parseFloat(time[1])+15}`;
							}
							battleRow.children[8].textContent = `${nextBattle}:00`;
							battleRow.children[8].dataset.sort = `${nextBattle.replace(":","")}`;
						}
						if (script.cw.globalmap && battleRow.children[6].firstElementChild.innerHTML == "No Division" || (!data.owner || data.owner && data.owner.division_id == false)) {
							cell.classList.add("t-noOwner");
							if (script.dyn.conc[primeTimeConc]) {
								script.dyn.conc[primeTimeConc]--;
							}
						}
						cell.innerHTML = ownerClan ? script.symbols.defence : script.symbols.owner;
						cellOwnerTime = [parseFloat(cell.classList.item(1).match(/\d+/g)[0]), parseFloat(cell.classList.item(1).match(/\d+/g)[1])];
						if (cellOwnerTime[0] < 5) {
							cellOwnerTime[0] += 24;
						}
					}
					else {
						cell.innerHTML = script.symbols.attack;
					}
					if (primeTime[1] == "15") {
						battleRow.classList.add("timeShift");
						cell.innerHTML += `<span class='t-timeShift'>${script.symbols.time}</span>`;
					}
					_conc++;
				}
			}
			if (!script.dyn.prov.includes(data.province_id)) {
				script.dyn.prov.push(data.province_id);
			}
			if (script.dyn.check >= script.cw.battles + script.dyn.plan) {
				// send request for divisions
				request({name: "handlerDivs", api: script.api.divs, handler: handlerDivs});
				handlerFooter("tourney", data.province_id);
			}
			// check if battle is planned or not started and change state to ongoing
			if (battleRow.children[7].textContent == "Free Round" && new Date().getHours() >= primeTime[0] - 1 && new Date().getHours() < cellOwnerTime[0]) {
				switch (battleRow.children[6].firstElementChild.innerHTML) {
					case "Attack":
						battleRow.children[7].textContent = "Ongoing";
						break;
					case "Planned":
						battleRow.children[6].firstElementChild.textContent = "Defence";
						battleRow.children[7].textContent = "Ongoing";
						break;
					case "Defence":
						battleRow.children[7].textContent = "Ongoing";
						request({name: "handlerFame", comment: "ongoing", api: script.api.prov + data.province_id, handler: handlerFame, province: data.province_id});
						break;
					default:
						break;
				}
			}
			else if (battleRow.children[7].innerHTML == "Planned" && script.time.roundTime[0] > cellOwnerTime[0]) {
				battleRow.children[7].textContent = "Completed";
			}
		}
		else {
			const lastBattle = battleRow.getElementsByClassName(`t-${primeTime[0]}_00`)[0];
			if (primeTime[1] == "15") {
				battleRow.classList.add("timeShift");
				lastBattle.innerHTML = `${script.symbols.owner}<span class='t-timeShift'>${script.symbols.time}</span>`;
			}
			else {
				lastBattle.innerHTML = script.symbols.owner;
			}
			lastBattle.classList.add("t-noFight");
		}
		if (ownerClan) {
			script.dyn.gold += data.province_revenue;
			document.getElementById('js-gold').textContent = script.dyn.gold; // insert gold count
		}
		if (script.cw.gold && data.province_revenue === 0) {
			document.getElementById('js-goldInfo').textContent = "(No Gold Revenue in Event!)";
			script.cw.gold = false;
			style.textContent += "th.t-gold, td.t-gold {display: none;}";
		}
		// get province famepoints if event
		if (script.cw.event) {
			request({name: "handlerFame", api: script.api.prov + data.province_id, handler: handlerFame, province: data.province_id});
		}
		// refresh table
		sortTable.refresh();
	},
	handlerProvs = function({data}) {
		// clan provinces handler
		const provs = data[script.clan.id],
		ownedProvinces = [],
		provTimes = [],
		provFragment = document.createDocumentFragment();
		if (battleTable.rows[1] && battleTable.rows[1].classList.contains("t-cwText")) {
			battleTable.children[1].innerHTML = ""; // empty table
		}
		if (provs) {
			for (let _p = 0, _p_len = provs.length; _p < _p_len; _p++) {
				const prov = provs[_p],
				battleRow = document.getElementsByClassName(prov.province_id)[0];
				if (!battleRow) {
					const primeTime = [timeParser(parseFloat(prov.prime_time.match(/\d+/g)[0])), prov.prime_time.match(/\d+/g)[1], parseFloat(prov.prime_time.match(/\d+/g)[0]) + script.table.eu.length],
					battleFront = prov.front_id.match(/league\d/)[0],
					provRow = _createElement("tr", {
						className: `province ${prov.province_id} defense`,
						innerHTML: `
							<td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${prov.province_id}'>${prov.province_name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${prov.province_id}'>${script.symbols.tournament}</a>]</td>
							<td>${mapFix(prov.arena_name)}</td>
							<td data-sort='${primeTime[2]}${primeTime[1]}'>${primeTime[0]}:${primeTime[1]}</td>
							<td class='t-gold'><span>${prov.daily_revenue}</span><span class='icon icon_main icon_gold'></span></td>
							<td class='t-fame'>Ɵ</td>
							<td><a target='_blank' href='https://eu.wargaming.net/clans/${script.clan.id}/'><span class='t-clantag'>[${script.clan.tag}]</span> <img src='${script.clan.emblem}'></a><span class='t-elo'>(${script.cw.elo[prov.max_vehicle_level]})</span></td>
							<td><span>Defence</span><span>${script.front_loc[battleFront] ? script.front_loc[battleFront] : "(??)"}</span></td>
							<td>No Attacks</td>
							<td class='t-nextBattle' data-sort='9999'></td>
							<td class='t-battle' data-sort='99'>Ɵ</td>
							<td class='t-battle t-border' data-sort='99'>Ɵ</td>
							${script.table.html}
						`
					}),
					provTime = `t-${primeTime[0]}_00`,
					provTimeClass = `.${provTime}, .${provTime} + td, .${provTime} + th`,
					lastBattle = provRow.getElementsByClassName(provTime)[0];
					provRow.dataset.primeTime = JSON.stringify(primeTime);
					ownedProvinces.push(prov.province_id);
					script.dyn.gold += prov.daily_revenue;
					script.cw.tier = prov.max_vehicle_level;
					if (primeTime[1] == "15") {
						provRow.classList.add("timeShift");
						lastBattle.innerHTML = `${script.symbols.defence}<span class='t-timeShift'>${script.symbols.time}</span>`;
					}
					else {
						lastBattle.innerHTML = script.symbols.defence;
					}
					lastBattle.classList.add("t-noFight");
					if (!provTimes.includes(provTimeClass)) {
						provTimes.push(provTimeClass);
					}
					if (script.cw.gold && prov.daily_revenue === 0) {
						document.getElementById('js-goldInfo').textContent = "(No Gold Revenue in Event!)";
						script.cw.gold = false;
						style.textContent += "th.t-gold, td.t-gold {display: none;}";
					}
					// get province famepoints if event
					if (script.cw.event) {
						request({name: "handlerFame", api: script.api.prov + prov.province_id, handler: handlerFame, province: prov.province_id});
					}
					provFragment.appendChild(provRow);
				}
			}
			// display finals column
			styleDynFinales.textContent += `${provTimes.join(", ")} {display: table-cell !important;}`;
			// insert province count
			document.getElementById('js-provs').textContent = provs.length;
			// insert gold count
			document.getElementById('js-gold').textContent = script.dyn.gold;
			// send request for raids if event
			//if (script.cw.event) {
			//  request({name: "handlerRaids", api: script.api.raids, handler: handlerRaids});
			//}
		}
		else if (script.cw.battles === 0) {
			battleTable.children[1].innerHTML = ""; // empty table
			provFragment.appendChild(_createElement("tr", {
				className: "t-cwText",
				innerHTML: "<td colspan='23'>No Battles</td>"
			}));
		}
		battleTable.children[1].appendChild(provFragment);
		// refresh table
		sortTable.refresh();
	},
	handlerFame = function({province, owner}, coef) {
		// fame handler for global map events
		const battleRow = document.getElementsByClassName(province.alias)[0];
		let fame_style = "t-green",
		fame = "Ɵ",
		sort = 0;
		if (script.cw.event) {
			if (province.fame_points) {
				fame = province.fame_points;
				sort = fame;
			}
			else if (province.money_box) {
				if (owner.id == script.clan.id) {
					fame_style = "t-red";
					fame = -Math.abs(province.money_box.risky_fame_points);
				}
				else {
					fame = `+${province.money_box.capture_fame_points}`;
				}
				sort = fame;
			}
			else if (province.is_enclave) {
				fame = province.single_province_fp;
				coef = province.fame_points_coefficient;
				sort = fame;
			}
			else if (province.enclave_neighbours_number) {
				fame = `${province.enclave_neighbours_number}/${province.number_of_enclave_provinces}`;
				sort = province.enclave_neighbours_number / province.number_of_enclave_provinces;
				// change fame column title
				document.getElementById('js-fame').textContent = "Fame & Enclaves";
			}
			else if (province.raids) {
				if (province.raids.secondary_mission_reward) {
					fame = province.raids.secondary_mission_reward;
				}
				else {
					fame_style = "";
				}
			}
			if (province.type !== "landing" || (owner && owner.id == script.clan.id)) {
				coef = "x5";
			}
		}
		if (battleRow) {
			const fameHTML = `<span class='${fame_style}'>${fame}</span>${coef ? ` ${coef}` : ""}`;
			battleRow.children[4].innerHTML = fameHTML;
			battleRow.children[4].dataset.sort = sort;
			//if (province.type == "auction") {
			//  if (battleRow.children[7].innerHTML == "Not Started") {
			//      battleTable.children[1].appendChild(_createElement("tr", {
			//          className: `battle ${province.alias} attack auction`,
			//          innerHTML: `
			//              <td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${province.alias}'>${province.name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${province.alias}'>${script.symbols.tournament}</a>]</td>
			//              <td></td>
			//              <td></td>
			//              <td class='t-gold'><span></span><span class='icon icon_main icon_gold'></span></td>
			//              <td class='t-fame'>${fameHTML}</td>
			//              <td></td>
			//              <td class='t-auction'><span>Auction</span><span>${script.front_loc[battleFront] ? script.front_loc[battleFront] : ""}</span></td>
			//              <td>Not Started</td>
			//              <td class='t-nextBattle' data-sort='9999'></td>
			//              <td class='t-battle'>Ɵ</td>
			//              <td class='t-battle t-border'>Ɵ</td>
			//              ${script.table.html}
			//          `
			//      }));
			//      battleRow.remove();
			//      // request tourneyData to be sure of proper visuals
			//      request({name: "handlerTourney (auction)", api: `${script.api.tourney+province.alias}&round=1`, handler: handlerTourney, province: province.alias});
			//  }
			//  else {
			//      battleRow.classList.add("auction");
			//      battleRow.children[6].classList.add("t-auction");
			//      battleRow.children[6].firstElementChild.textContent = "Auction";
			//  }
			//}
		}
	},
	handlerDivs = function({data}) {
		// divisions handler
		if (data && data.length) {
			const divsId = JSON.stringify(data).match(/\d{9}/g);
			if (divsId.includes(script.clan.id.toString())) {
				script.cw.globalmap = true;
				for (let _p = 0, _p_len = data.length; _p < _p_len; _p++) {
					const div = data[_p],
					battleRow = document.getElementsByClassName(div.alias)[0];
					if (!div.division) {
						if (battleRow && battleRow.classList.contains('defense')) {
							const defBattle = battleRow.getElementsByClassName("js-last")[0],
							primeTime = JSON.parse(battleRow.dataset.primeTime),
							primeTimeConc = `${Number(primeTime[0] + primeTime[1]) + [0, 30, 100, 130, 200, 230, 300, 330][Number(battleRow.children[10].innerHTML) || 0]}`;
							battleRow.children[2].dataset.sort = 5000;
							battleRow.children[8].dataset.sort = 5000;
							battleRow.children[6].firstElementChild.textContent = "No Division";
							battleRow.children[6].classList.add("t-bold");
							if (defBattle) {
								defBattle.classList.remove("t-fight");
								defBattle.classList.add("t-noFight");
								if (script.dyn.conc[primeTimeConc]) {
									script.dyn.conc[primeTimeConc]--;
								}
							}
						}
						else if (!battleRow) {
							script.dyn.plan++;
							battleTable.children[1].appendChild(_createElement("tr", {
								className: `planned ${div.alias}`,
								innerHTML: `
									<td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${div.alias}'>${div.name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${div.alias}'>${script.symbols.tournament}</a>]</td>
									<td></td>
									<td></td>
									<td class='t-gold'><span></span><span class='icon icon_main icon_gold'></span></td>
									<td class='t-fame'>Ɵ</td>
									<td></td>
									<td><span>Planned</span><span></span></td>
									<td>Planned</td>
									<td class='t-nextBattle' data-sort='9999'></td>
									<td class='t-battle'>Ɵ</td>
									<td class='t-battle t-border'>Ɵ</td>
									${script.table.html}
								`
							}));
							request({name: "handlerBats", comment: "planned", api: script.api.bats + div.alias, handler: handlerBats, extra: true, province: div.alias});
						}
					}
					else {
						// sometimes future defenses wont show up in planned battles
						if (div.attackers.length > 0 && battleRow && battleRow.classList.contains('province')) {
							script.dyn.plan++;
							battleTable.children[1].appendChild(_createElement("tr", {
								className: `planned ${div.alias}`,
								innerHTML: `
									<td><a target='_blank' href='https://eu.wargaming.net/globalmap/#province/${div.alias}'>${div.name}</a> [<a target='_blank' href='https://eu.wargaming.net/globalmap/#tournament/${div.alias}'>${script.symbols.tournament}</a>]</td>
									<td></td>
									<td></td>
									<td class='t-gold'><span></span><span class='icon icon_main icon_gold'></span></td>
									<td class='t-fame'>Ɵ</td>
									<td></td>
									<td><span>Defence</span><span></span></td>
									<td>Planned</td>
									<td class='t-nextBattle' data-sort='9999'></td>
									<td class='t-battle'>Ɵ</td>
									<td class='t-battle t-border'>Ɵ</td>
									${script.table.html}
								`
							}));
							battleRow.remove();
							request({name: "handlerTourney", comment: "planned def", api: `${script.api.tourney+div.alias}&round=1`, handler: handlerTourney, extra: true, province: div.alias});
						}
					}
					// update footer
					if (script.dyn.check >= script.cw.battles + script.dyn.plan) {
						handlerFooter("divisions", div.alias);
					}
				}
				if (script.dyn.plan > 0) {
					// style.textContent += ".t-battle {display: table-cell !important;}";
				}
				// refresh table
				sortTable.refresh();
			}
			else {
				document.getElementById('js-error').textContent = "Division data not available, as you're not a member of this clan.";
			}
		}
	},
	handlerFreepass = function(data) {
		// freepass handler
		const battleRow = document.getElementsByClassName(data.province_id)[0],
		lastGroup = data.battles[data.battles.length - 1],
		freeRound = battleRow.children[7].innerHTML == "Not Started" && lastGroup && lastGroup.is_fake && lastGroup.first_competitor.id == script.clan.id;
		//console.log(data.province_id, lastGroup);
		// check if no opponent - free round
		if (freeRound) {
			battleRow.children[7].textContent = "Free Round";
			battleRow.children[7].classList.add("t-bold");
			battleRow.classList.add("freePass");
		}
	},
	handlerFooter = function(mode, province) {
		const footer = document.getElementById('js-footer'),
		conc = Object.entries(script.dyn.conc).reduce(function(max, arr) {
			return max[1] >= arr[1] ? max : arr;
		}),
		conc_table = {};
		document.getElementById('js-battlesConc').textContent = `${conc[1]} [${conc[0].replace(/^(\d{2})/,"$1:")}]`;
		styleDynBattles.textContent = `${script.table.classes.join(", ")} {display: table-cell !important;}`;
		for (let _c_k = Object.keys(script.dyn.conc), _c = _c_k.length; _c > 0; _c--) {
			const key = _c_k[_c - 1],
			hour = key.slice(0, 2),
			min = key.slice(2),
			newKey = `t-${hour >= 24 ? hour - 24 : hour}_${min == 15 ? "00" : min == 45 ? "30" : min}`,
			time = script.dyn.conc[key],
			timeShift = /15|45/.test(min) ? true : false;
			if (conc_table[newKey]) {
				conc_table[newKey][timeShift ? 1 : 0] += time;
			}
			else {
				conc_table[newKey] = timeShift ? [0, time] : [time, 0];
			}
		}
		for (let _ct_k = Object.keys(conc_table), _ct = _ct_k.length; _ct > 0; _ct--) {
			const key = _ct_k[_ct - 1],
			times = conc_table[key],
			foot = footer.getElementsByClassName(key)[0];
			if (foot) {
				foot.textContent = `${times[0] ? `${script.symbols.attack}${times[0]}` : ""}${times[1] ? ` ${script.symbols.time}${times[1]}` : ""}`;
			}
			else {
				console.error("Foot doesn't exist", key, times);
			}
		}
	},
	handlerRaids = function(data) {
		// raids handler for campaign events
		for (let _r = 0, _r_len = data.length; _r < _r_len; _r++) {
			const raid = data[_r],
			battleRow = document.getElementsByClassName(raid.province.id)[0],
			fame = raid.fame_points,
			bonus = raid.bonus_fame_points,
			sort = fame + bonus,
			coef = raid.battle_coef;
			let denyFame = 0;
			if (battleRow) {
				denyFame = parseFloat(battleRow.children[4].innerHTML.match(/\d+/));
				battleRow.children[4].innerHTML = `<span>${fame} + ${bonus}${denyFame ? ` + ${denyFame}` : ""}</span> ${coef}`;
				battleRow.children[4].dataset.sort = sort + denyFame;
			}
		}
	},
	handlerError = function(name, data) {
		// error handler
		switch (name) {
			case "handlerMain":
				battleTable.children[1].appendChild(_createElement("tr", {
					className: "t-cwText",
					innerHTML: "<td colspan='23'>Clan ID Error</td>"
				}));
				inputSpan.lastElementChild.textContent = "Clan ID invalid!";
				localStorage.removeItem("battles_clanid");
				break;
			case "handlerDivs":
				document.getElementById('js-error').innerHTML = `Division data not available, because you need to be logged in on the <a target='_blank' href='https://eu.wargaming.net/globalmap/'>Global Map</a>.`;
				break;
			default:
				break;
		}
	},
	timeParser = function(hour, min, type) {
		// time converter
		let time = hour + script.time.offset;
		if (time >= 24) {
			time -= 24;
		}
		else if (time <= 0) {
			time += 24;
		}
		if (type == "s") {
			time = `t-${time}_${min}${time === 0 && min == "00" ? " t-24_00" : ""}`;
		}
		return time;
	},
	timer = function() {
		// timestamp handler
		const dateNow = new Date(),
		time = {
			hour: timeParser(16) - dateNow.getHours(),
			min: 60 - dateNow.getMinutes() - 1,
			sec: 60 - dateNow.getSeconds() - 1
		},
		timeSpan = document.getElementById('js-timePrime');
		if (timeJump && !script.cw.event && script.cw.status) {
			timeSpan.textContent = "No Event Running";
			timeSpan.classList.add("t-bold");
			clearInterval(timeInterval);
		}
		else if (time.hour >= 0 && (time.sec > 0 || time.min < 15)) {
			timeSpan.textContent = `${(time.hour > 0 ? `${time.hour} Hours, ` : "") + (time.min > 0 ? `${time.min} Mins, ` : "") + time.sec} Secs`;
		}
		else if (time.hour < 0 && script.cw.battles !== "Ɵ") {
			if (script.cw.battles === 0) {
				timeSpan.textContent = "No Planned Battles";
				timeSpan.classList.add("t-bold");
				clearInterval(timeInterval);
			}
			else {
				timeSpan.classList.add("h-shadow");
				timeSpan.innerHTML = "<span style='color:#ff0000;'>X</span><span style='color:#ff2a00;'></span><span style='color:#ff5500;'>e</span><span style='color:#ff7f00;'></span><span style='color:#ffaa00;'>n</span> <span style='color:#ffff00;'>i</span><span style='color:#aaff00;'></span><span style='color:#55ff00;'>s</span> <span style='color:#00ff80;'>a</span> <span style='color:#00aaff;'>f</span><span style='color:#0055ff;'></span><span style='color:#0000ff;'>g</span><span style='color:#2e00ff;'></span><span style='color:#5d00ff;'>t</span><span style='color:#8b00ff;'>.</span>";
				if (script.cw.current > 0) {
					document.getElementById('js-provStatus').textContent = "Next Opponent (ELO)";
				}
				clearInterval(timeInterval);
			}
		}
		else {
			timeSpan.textContent = "Hold on a sec...";
		}
		timeJump = true;
	},
	mapFix = function(name) {
		// map name fixer
		const fixedNames = {
			"112_eiffel_tower_ctf/name": "Paris",
			"114_czech/name": "Pilsen",
			"99_poland/name": "Studzianki"
		};
		return fixedNames[name] ? fixedNames[name] : name;
	},
	updater = function(force) {
		// updater handler
		const dateNow = new Date(),
		newDate = {
			hour: dateNow.getHours(),
			min: dateNow.getMinutes(),
			offset: (dateNow.getTimezoneOffset() > 0 ? -Math.abs(dateNow.getTimezoneOffset()) : Math.abs(dateNow.getTimezoneOffset())) / 60
		},
		newTime = script.time.min >= 15 && script.time.min <= 45 ? [script.time.hour, "30"] : script.time.min <= 15 ? [script.time.hour, "00"] : [script.time.hour + 1, "00"];
		if (force || script.time.roundTime[0] !== newTime[0] || script.time.roundTime[1] !== newTime[1]) {
			script.time = newDate;
			script.time.roundTime = newTime;
			script.time.classes = `${script.time.roundTime[0]}_${script.time.roundTime[1]}`;
			battleTable.lastElementChild.firstElementChild.innerHTML = `<td></td><td></td><td></td><td class='t-gold'></td><td></td><td></td><td></td><td></td><td></td><td></td><td class='t-border'></td>${script.table.html}`;
			styleDynTimezone.textContent = `
				.b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} {background-color: rgba(254,252,223, 0.5); border-left: 1px solid #808080; border-right: 1px solid #808080;}
				.b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} + th, .b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} + td {background-color: rgba(224,223,218, 0.5); border-right: 1px solid #808080;}
			`;
			script.dyn = {
				conc: {},
				prov: [],
				plan: 0,
				check: 0,
				gold: 0
			};
			request({name: "handlerMain", comment: "update", api: `${script.api.clan}${script.clan.id}/battles`, handler: handlerMain});
			// insert update timestamp
			document.getElementById('js-batttleUpdate').textContent = new Date().toLocaleTimeString("en-GB");
		}
	},
	request = function({name, api, handler, extra, province, comment}) {
		// request handler
		GM.xmlHttpRequest({
			method: "GET",
			url: api,
			headers: {
				"Accept": "application/json",
				"X-Requested-With": "XMLHttpRequest"
			},
			onload(resp) {
				const data = JSON.parse(resp.responseText);
				if (resp.status == 200) {
					if (script.debug) {
						console.info(`%c${name}${comment ? `: (${comment})` : ""}${province ? `: ${province}` : ""}`, `color: ${script.debugColors[name]}`, {data, api, "time": new Date().toLocaleTimeString("en-GB")});
					}
					handler(data, extra);
				}
				else {
					console.error("Error with API", name, api, resp);
					handlerError(name);
				}
			},
			onerror(resp) {
				console.error("Error accessing API", name, api, resp);
			}
		});
	},
	_createElement = function(tag, attributes, children) {
		// element creation
		const element = Object.assign(document.createElement(tag), attributes);
		if (children) {
			if (children.nodeType) {
				element.appendChild(children);
			}
			else {
				for (let _c=0, _c_len=children.length; _c<_c_len; _c++) {
					const child = children[_c];
					if (child && child.nodeType) {
						element.appendChild(child);
					}
				}
			}
		}
		return element;
	};
	// inserting style into head
	style = _createElement("style", {
		className: "battleScheduler",
		type: "text/css",
		textContent: `
/* scipt buttons */
.b-scriptButton {height: 25.2px}
.b-scriptButton a {vertical-align: middle;}
.t-fakeButton {cursor: pointer; border-radius: 5px; padding: 2px 5px; transition: 0.3s;}
.t-fakeButton:hover {background-color: rgba(57, 51, 49, 0.15);}
/* icon rules */
.b-battleScheduler .icon {display: inline-block; height: 16px; width: 16px; vertical-align: text-top;}
.b-battleScheduler.b-scriptButton .icon {display: inline-block; height: 16px; width: 16px; margin-right: 3px; vertical-align: sub;}
.icon_main {background: url(${script.img.main}) no-repeat 0 0;}
.b-battleScheduler .icon_chat {}
.b-battleScheduler .icon_twitch {background-position: -16px 0;}
.b-battleScheduler .icon_fork {background-position: -32px 0;}
.b-battleScheduler .icon_wg {background-position: -48px 0;}
.b-battleScheduler .icon_cw {background-position: -64px 0;}
.b-battleScheduler .icon_gold {background-position: -82px 0; margin-left: 2px;}
.b-battleScheduler .icon_wot {background-position: -98px 0;}
.b-battleScheduler .icon_bonds {background: url(${script.img.bonds}) no-repeat 0 0; background-size: contain; margin-left: 2px;}
/* battle scheduler */
.b-battles {background-color: #D1E8FE; border: 1px solid; border-radius: 10px; display: table; font-size: 11px; width: 90vw; min-width: 1280px; margin: 25px auto 50px;}
.b-battles .h-battles {}
.b-battles .h-battles .h-battles-info {border-bottom: 1px solid #F5F5F5; margin: 0 auto; padding: 4px 0px; width: 98%; display: flex; align-items: center; justify-content: space-between;}
.b-battles .h-battles .h-battles-info .h-left {width: 380px;}
.b-battles .h-battles .h-battles-info .h-left a {font-size: 13px;}
.b-battles .h-battles .h-battles-info .h-mid {text-align: center;}
.b-battles .h-battles .h-battles-info .h-mid #js-eventName {text-transform: capitalize;}
.b-battles .h-battles .h-battles-info .h-right {text-align: right; width: 380px;}
.b-battles .h-battles .h-battles-info .h-right .h-expand {cursor: pointer; font-size: 2em; line-height: 10px; vertical-align: sub;}
.b-battles .h-battles .h-battles-info .h-right .h-force label {cursor: pointer;}
.b-battles .h-battles .h-battles-info .h-right .h-force input {height: 13px; vertical-align: bottom;}
.b-battles .h-battles .h-battles-info .h-right #js-update {margin-right: 17px;}
.b-battles .h-battles .h-battles-info img {max-height: 16px; vertical-align: bottom;}
.b-battles .h-battles .h-battles-info .h-shadow {font-weight: bold; text-shadow: 0px 0px 1px rgba(27,27,28, 1), 0px 0px 2px rgba(27,27,28, 1);}
.b-battles .b-battles-holder {max-height: 90vh; overflow-y: auto;}
.b-battles .b-battles-holder .t-battles {border-spacing: 0; text-align: center; width: 100%;}
.b-battles .b-battles-holder .t-battles .t-time {display: none; position: relative;}
.b-battles .b-battles-holder .t-battles .sort-up, .b-battles .b-battles-holder .t-battles .sort-down {color: #C600C6;}
.b-battles .b-battles-holder .t-battles thead th {border-bottom: 1px solid #808080; line-height: 20px;}
.b-battles .b-battles-holder .t-battles tbody tr:nth-child(even) {background-color: #FBFBFB;}
.b-battles .b-battles-holder .t-battles tbody tr:nth-child(odd) {background-color: #EFEFEF;}
.b-battles .b-battles-holder .t-battles tbody tr:hover {background-color: #FEFAC0;}
.b-battles .b-battles-holder .t-battles tbody td {border-bottom: 1px dotted #B1B1B1; line-height: 21px;}
.b-battles .b-battles-holder .t-battles tbody td:first-of-type {max-width: 100px; overflow: hidden; padding: 0 5px; text-overflow: ellipsis; white-space: nowrap;}
.b-battles .b-battles-holder .t-battles tbody .t-good {color: #4D7326;}
.b-battles .b-battles-holder .t-battles tbody .t-bad {color: #930D0D;}
.b-battles .b-battles-holder .t-battles tbody .t-time {font-weight: bold;}
.b-battles .b-battles-holder .t-battles tbody .t-plan {color: #FFE400;}
.b-battles .b-battles-holder .t-battles tbody .t-fight {color: #4D7326;}
.b-battles .b-battles-holder .t-battles tbody .t-auction {color: #2F396A;}
.b-battles .b-battles-holder .t-battles tbody .t-noFight {color: transparent; text-shadow: rgba(64, 58, 58, 0.35) 0 0 0;}
.b-battles .b-battles-holder .t-battles tbody .t-fight.t-noOwner {color: transparent; text-shadow: rgba(64, 58, 58, 0.35) 0 0 0;}
.b-battles .b-battles-holder .t-battles tbody .t-error {color: #C42811;}
.b-battles .b-battles-holder .t-battles tbody .t-cwText td {font-size: 26px; line-height: 54px;}
.b-battles .b-battles-holder .t-battles tbody .timeShift td:nth-child(3), .b-battles .b-battles-holder .t-battles tr.timeShift td:nth-child(9) {color: #25931A;}
.b-battles .b-battles-holder .t-battles tbody .timeShift td:nth-child(3)::after, .b-battles .b-battles-holder .t-battles tr.timeShift td:nth-child(9)::after {content: " ⌛";}
.b-battles .b-battles-holder .t-battles tbody .timeShift td .t-timeShift {font-size: 8px; position: absolute;}
.b-battles .b-battles-holder .t-battles tbody img {height: 16px; margin-bottom: 2px; vertical-align: bottom;}
.b-battles .b-battles-holder .t-battles tfoot td {border-top: 1px solid #808080; font-weight: bold; line-height: 20px; height: 20px;}
.b-battles .b-battles-holder .t-battles tr .t-border {border-right: 2px solid rgba(194, 173, 173, 0.5);}
.b-battles .f-battles {}
.b-battles .f-battles .f-battles-info {border-top: 1px solid #F5F5F5; margin: 0 auto; padding: 3px 0px; width: 98%; display: flex; align-items: center; justify-content: space-between;}
.b-battles .f-battles .f-battles-info .f-left {width: 380px;}
.b-battles .f-battles .f-battles-info .f-left .f-input > span {margin-left: 5px;}
.b-battles .f-battles .f-battles-info .f-left .f-inputText {color: #C42811;}
.b-battles .f-battles .f-battles-info .f-left .f-inputText.t-green {color: #4D7326;}
.b-battles .f-battles .f-battles-info .f-left #js-goldInfo {margin-left: 3px;}
.b-battles .f-battles .f-battles-info .f-mid {text-align: center; flex-grow: 1;}
.b-battles .f-battles .f-battles-info .f-mid-tables {display: flex; justify-content: center;}
.b-battles .f-battles .f-battles-info .f-mid table {margin: 0px 20px;}
.b-battles .f-battles .f-battles-info .f-mid table td {padding: 0 10px;}
.b-battles .f-battles .f-battles-info .f-mid table td {padding: 0 10px;}
.b-battles .f-battles .f-battles-info .f-mid .t-reward {margin: 0 5px;}
.b-battles .f-battles .f-battles-info .f-mid #js-error {display: block; color: #C42811;}
.b-battles .f-battles .f-battles-info .f-right {text-align: right; width: 380px;}
.b-battles .f-battles .f-battles-info img {max-height: 16px; vertical-align: bottom;}
/* toggle overrides */
.t-elo {margin-left: 3px;}
.t-gold {color: #AC813C;}
.b-display-none {display: none;}
.b-display-block {display: block;}
/* .t-battle {display: none;} */
.t-bold {font-weight: bold;}
.t-green {color: #4D7326;}
.t-red {color: #930D0D;}
	`
	});
	document.head.appendChild(style);
	// link to battle scheduler
	const rightSide = document.getElementsByClassName("linklist rightside")[0];
	rightSide.prepend(_createElement("li", {
		className: "b-battleScheduler b-scriptButton",
		innerHTML: `<a target='_blank' href='./games.php'><span class='icon icon_main icon_cw'></span>Battle Schedule</a>`
	}));
	rightSide.prepend(_createElement("li", {
		className: "b-battleScheduler b-scriptButton",
		innerHTML: `<a target='_blank' href='https://eu.wargaming.net/clans/wot/500010805/'><span class='icon icon_main icon_wg'></span>Clan Page</a>`
	}));
	if (/games.php/.test(window.location.href)) {
		styleDynTimezone = _createElement("style", {
			className: "styleDynTimezone",
			type: "text/css",
			textContent: `
				.b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} {background-color: rgba(254,252,223, 0.5); border-left: 1px solid #808080; border-right: 1px solid #808080;}
				.b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} + th, .b-battles .b-battles-holder .t-battles tr .t-${script.time.classes} + td {background-color: rgba(224,223,218, 0.5); border-right: 1px solid #808080;}
			`
		});
		styleDynBattles = _createElement("style", {
			className: "styleDynBattles",
			type: "text/css"
		});
		styleDynFinales = _createElement("style", {
			className: "styleDynFinales",
			type: "text/css"
		});
		document.head.appendChild(styleDynTimezone);
		document.head.appendChild(styleDynBattles);
		document.head.appendChild(styleDynFinales);
		// prepare static html
		const page_body = document.getElementById("page-body"),
		chat = page_body.getElementsByClassName("tablebg")[0],
		battlePanel = _createElement("div", {
			className: "b-battleScheduler b-battles",
			innerHTML: `
<div class='h-battles'>
	<div class='h-battles-info'>
		<div class='h-left'>
			<a class='t-fakeButton' target='_blank' href='https://greasyfork.org/en/scripts/20094-ideal-scripts' title='Script Page'><span class='icon icon_main icon_fork'></span></a>
			<a class='t-fakeButton' target='_blank' href='https://eu.wargaming.net/clans/wot/${script.clan.id}/globalmap' title='Clan Page'><span class='icon icon_main icon_wg'></span></a>
			<a class='t-fakeButton' target='_blank' href='https://eu.wargaming.net/globalmap/' title='Global Map'><span class='icon icon_main icon_cw'></span></a>
		</div>
		<div class='h-mid'>
			<span id='js-eventName'></span>
			<span id='js-clan'></span>
			<span id='js-timePrime'>Ɵ</span>
		</div>
		<div class='h-right'>
			<span class='t-fakeButton' id='js-update'>Update</span>
			<span class='h-force t-fakeButton' id='js-force'><label>Campaign Only: <input type='checkbox' name='force'></label></span>
		</div>
	</div>
</div>
<div class='b-battles-holder'>
	<table class='t-battles sortable'>
		<thead>
			<tr>
				<th>Province</th>
				<th>Map</th>
				<th data-sort-method='number' data-sort-order='desc'>Timezone</th>
				<th class='t-gold'>Gold</th>
				<th class='t-fame' id='js-fame'>Fame</th>
				<th>Owner (ELO)</th>
				<th>Type</th>
				<th id='js-provStatus'>Status</th>
				<th class='t-battle sort-default' data-sort-method='number' data-sort-order='desc'>Next Battle</th>
				<th class='t-battle'>Attackers</th>
				<th class='t-battle t-border'>Turns</th>
			</tr>
		</thead>
		<tbody></tbody>
		<tfoot id='js-footer'>
			<tr><td></td><td></td><td></td><td class='t-gold'></td><td></td><td></td><td></td><td></td><td></td><td></td><td class='t-border'></td></tr>
		</tfoot>
	</table>
</div>
<div class='f-battles'>
	<div class='f-battles-info'>
		<div class='f-left'>
			<div class='f-input' id='js-input'>
				<input type='text' name='id' placeholder='Clan ID' value='${script.clan.id}' list='clanid' maxlength='9' size='9'>
				<datalist id='clanid'>${script.clans.join("")}</datalist>
				<span class='f-inputImage'><img src='https://wot-life.com/img/clanicon/${script.clan.id}.png'></span>
				<span class='f-inputText'>${script.clan.id !== script.clan.ideal ? "<span class='f-inputBack'>Back to <a href='' onclick='localStorage.removeItem(\"battles_clanid\"); location.reload();'>[IDEAL]</a></span>" : ""}</span>
			</div>
			<table>
				<tr><td colspan='3'>Gold Income: <span class='t-gold' id='js-gold'>0</span><span class='icon icon_main icon_gold'></span><span id='js-goldInfo'></span></td></tr>
			</table>
		</div>
		<div class='f-mid'>
			<div id='js-tableStats' class='f-mid-tables b-display-none'>
				<table id='js-tableEvent' class='b-display-none'>
					<tr class='t-bold'><td>Famepoints: <span id='js-famepoints'>0</span></td><td>Position: <span id='js-eventPosition'>0</span></td></tr>
					<tr><td colspan='2' id='js-rewards'></td></tr>
				</table>
				<table>
					<tr class='t-bold'><td>Current Battles: <span id='js-battles'>0</span></td><td>Simultaneously: <span id='js-battlesConc'>0</span></td></tr>
					<tr><td>Planned: <span id='js-battlesPlan'>0</span></td><td>Owned Provinces: <span id='js-provs'>0</span></td></tr>
				</table>
			</div>
			<span id='js-error'></span>
		</div>
		<div class='f-right'>
			<div>${script.symbols.attack} Battle • ${script.symbols.defence} Defence • ${script.symbols.owner} Battle with Owner • ${script.symbols.attack}<span class='t-bold t-green'>${script.symbols.time}</span> Timeshift</div>
			<div>Last Updated: <span id='js-batttleUpdate'>Ɵ</span> [UTC${script.time.offset >= 0 ? "+" : ""}${script.time.offset}] • v${script.vers}</span></div>
		</div>
	</div>
</div>
`
		});
		page_body.parentNode.appendChild(chat);
		page_body.innerHTML = "";
		page_body.appendChild(battlePanel);
		page_body.appendChild(chat);
		// table references
		battleTable = battlePanel.children[1].firstElementChild;
		// time cells for header and body rows
		const timeFragment = document.createDocumentFragment();
		for (let _tc = 0, _tc_len = script.table.eu.length; _tc < _tc_len; _tc++) {
			const t = script.table.eu[_tc],
			times = [timeParser(t, "00", "s"), `${timeParser(t)}:00`, timeParser(t, "30", "s"), `${timeParser(t)}:30`];
			timeFragment.appendChild(_createElement("th", {
				className: `t-time ${times[0]}`,
				innerHTML: times[1]
			}));
			script.table.html += `<td class='t-time ${times[0]}' data-time='${times[1]}'></td>`;
			if (_tc !== _tc_len - 1) {
				timeFragment.appendChild(_createElement("th", {
					className: `t-time ${times[2]}`,
					innerHTML: times[3]
				}));
				script.table.html += `<td class='t-time ${times[2]}' data-time='${times[3]}'></td>`;
			}
		}
		battleTable.firstElementChild.firstElementChild.appendChild(timeFragment);
		battleTable.lastElementChild.firstElementChild.innerHTML += script.table.html;
		// button to update
		const updateSpan = document.getElementById('js-update');
		updateSpan.addEventListener('click', function() {
			updater(true);
		}, false);
		// button to force load cw battles
		const forceSpan = document.getElementById('js-force');
		forceSpan.firstElementChild.lastElementChild.checked = script.cw.status ? true : false;
		forceSpan.addEventListener('click', function() {
			localStorage.setItem("battles_force", this.firstElementChild.lastElementChild.checked);
			location.reload();
		}, false);
		// add custom input for checking other clans
		inputSpan = document.getElementById('js-input');
		inputSpan.firstElementChild.addEventListener('input', function() {
			const value = this.value;
			if (value.length == 9 && value[0] == "5") {
				inputSpan.children[2].firstElementChild.src = `https://wot-life.com/img/clanicon/${value}.png`;
				inputSpan.children[3].innerHTML = "Stored! <a href='' onclick='location.reload();'>Refresh?</a>";
				inputSpan.children[3].classList.add("t-green");
				if (inputSpan.children.length == 5) {
					inputSpan.children[4].textContent = "";
				}
				localStorage.setItem("battles_clanid", value);
			}
			else if (value.length > 0 && value[0] !== "5") {
				inputSpan.children[3].textContent = "Not Valid!";
			}
			else {
				inputSpan.children[3].textContent = "Missing";
			}
		}, false);
		// add intervals for time and round updater
		timeInterval = setInterval(timer, 1000); // 1 second
		updateInterval = setInterval(updater, 120000); // 2 minutes
		// activate tablesort function for battle scheduler
		if (Tablesort) {
			// Numeric sort
			Tablesort.extend('number', function(item) {
				return item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
			}, function(a, b) {
				a = parseFloat(a);
				b = parseFloat(b);
				a = isNaN(a) ? 0 : a;
				b = isNaN(b) ? 0 : b;
				return a - b;
			});
			sortTable = new Tablesort(battleTable);
		}
		else {
			window.alert("Error activating tablesort, please refresh - if this shit continues, poke Orrie");
		}
		// insert update status - will crash the tablesorter if inserted earlier
		battleTable.children[1].appendChild(_createElement("tr", {
			className: "t-cwText",
			innerHTML: "<td colspan='23'>Updating...</td>"
		}));
		// send request to wargaming api to see if an event is running
		request({name: "handlerEvent", api: `${script.api.event}${script.app_id}&limit=1`, handler: handlerEvent});
	}
}());