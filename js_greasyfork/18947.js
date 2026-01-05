// ==UserScript==
// @name        WoTStatScript - Campaign Famepoints
// @version     2.8
// @description Adds famepoints for clans participating in campaign events
// @author      Orrie
// @namespace   http://forum.worldoftanks.eu/index.php?showtopic=263423
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     http*://eu.wargaming.net/clans/*/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     api.worldoftanks.eu
// @connect     worldoftanks.eu
// @require     https://greasyfork.org/scripts/18946-tablesort/code/Tablesort.js?version=120660
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/18947/WoTStatScript%20-%20Campaign%20Famepoints.user.js
// @updateURL https://update.greasyfork.org/scripts/18947/WoTStatScript%20-%20Campaign%20Famepoints.meta.js
// ==/UserScript==

(function() {
	// global variables
	var c = document.cookie;

	// new page handler making sure it has loaded
	var pageLook = new MutationObserver(function() {
		pageLook.disconnect();
		// get server info and webpage
		var wg = {href: document.location.href, clan:{}};
		wg.m = /players[\/wot#]+/i.test(wg.href);
		wg.e = /famepoints/i.test(wg.href);
		wg.n = document.getElementsByClassName('sidebar-clan_emblem')[0];
		wg.clan.id = wg.href.match(/\/(\d+)/)[1];
		if (wg.e) {
			wg.m = false;
		}
		// script variables
		var sc = {
			ideal: wg.clan.id == 500010805,
			goTime: false,
			cw: {
				data: {
					event: "",
					front: ""
				},
				bonds: true,
				tanks: 10000,
				camo: 0,
				pvfame: 31000,
				pcfame: 0
			},
			role: {
				commander: [0, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Commander"],
				executive_officer: [1, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Executive"],
				personnel_officer: [2, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Personnel"],
				intelligence_officer: [2, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Intelligence"],
				combat_officer: [3, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Combat"],
				quartermaster: [4, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Quartermaster"],
				recruitment_officer: [5, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Recruitment"],
				junior_officer: [6, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Junior"],
				private: [7, "https://orrie.s-ul.eu/clanfame/8ZKbANWm.png", "Private"],
				recruit: [8, "https://orrie.s-ul.eu/clanfame/73bv4Xk7.png", "Recruit"],
				reservist: [9, "https://orrie.s-ul.eu/clanfame/W2M0Chq4.png", "Reservist"]
			},
			api: {
				eu: "a7595640a90bf2d19065f3f2683b171c"
			},
			loc: c.match(/django_language=(\w+)/) ? c.match(/django_language=(\w+)/)[1] : "en",
			locSup: ["en", "ru", "cs", "de", "fr", "pl", "es", "tr"],
			u: {
				arr_u: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVAjXY2BgLPauSqpnYoABxpK4ejcGRoZi79LP5X/qamFSJSWlv8q/tPgzVLuUfyn7X/6rNZmB8T9jWWLpr7L/Vd+O9gHVNAVUfAJK/WjMKE0q/V72v+bLwZ5/wmDtrY4Vn8v+l/0Bqa78caTnvyDcxmaXcqAuoPD3EzDVMLfUhVZ8q/q2b/J/EQZ00OS1dwJCGAAXYkZknpRD4wAAAABJRU5ErkJggg==",
				arr_d: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACUSURBVAjXY2CAgv+M9WFbp32VYkADjHWpZT8rfm6f908SRbzFu/xb2f+y/xW/jk76JwoXbgoq/woU/lkKJCt+7pr6Txws3Bxd/r3sf/n35vCS4FKgvsofe6f+E2Oo8oQIt8eAFJVElX4HSR2cwFBqX/Ku7HdDdj0TxNjSpNLv5e9aHYHMYofKiP+MCIcUhzRbMTAAABQDRpIIcY4aAAAAAElFTkSuQmCC",
				b_you: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY8hya1YBAAOpAVgmdE+yAAAAAElFTkSuQmCC"
			},
			i: {
				host: "https://orrie.s-ul.eu/clanfame/",
				loader: "/clans/static/2.2.8/images/processing/loader.gif"
			},
			bonds: [
				// bonds table
				[7,   1000, 0.010061919504643963, 0.01],
				[6.5,  950, 0.020123839009287926, 0.02],
				[6,    900, 0.030959752321981424, 0.03],
				[5.5,  850, 0.05108359133126935,  0.05],
				[5,    800, 0.10294117647058823,  0.1 ],
				[4,    750, 0.15479876160990713,  0.15],
				[3,    700, 0.206656346749226,    0.2 ],
				[2.5,  600, 0.25541795665634676,  0.25],
				[2,    500, 0.5178018575851393,   0.5 ],
				[1,    250, 1,                    0.75]
			],
			bonds_position: [
				971, // clans   - 1752
				26993 // players - 67479
			],
			fame_boosters: [
				[10,       "0 (0)"],
				[50,       "1 (10)"],
				[250,      "2 (50)"],
				[1000,     "3 (250)"],
				[2500,     "4 (1000)"],
				[5000,     "5 (2500)"],
				[20000,    "6 (5000)"],
				[30000,    "7 (20000)"],
				[40000,    "8 (30000)"],
				[50000,    "9 (40000)"],
				[Infinity, "10 (50000)"]
			],
			debug: true
		},
		sf = {
			fameFetch: function () {
				var fameStatus = document.getElementById('js-fame-fetch'),
				fameLoader = document.getElementById('js-fame-loader');
				if (fameStatus) {
					fameStatus.textContent = "Fapping: ";
					fameStatus.appendChild(sf.elem("span", {innerHTML: "0%"}));
				}
				else {
					fameLoader.textContent = "0%";
				}
				// only fetch if stored stats exists
				if (s && Object.keys(s).length !== 0) {
					sf.request("eventData", `https://api.worldoftanks.eu/wot/globalmap/events/?application_id=${sc.api.eu}`, sf.eventHandler);
				}
				else {
					window.alert("Can't find a stored memberlist, is it properly fapped? (Get the stats on the memberlist first)");
				}
			},
			eventHandler: function ({data}) {
				const event = data ? data[0] : "error";
				if (event.status == "ACTIVE") {
					sc.cw.data.event = event.event_id;
					sc.cw.data.front = event.fronts[0].front_id;
					sf.storage("fameScriptEvent", sc.cw.data, "set", "string");
					// fetch clan overall famepoint status
					sf.request("clanData", `http://api.worldoftanks.eu/wot/globalmap/eventclaninfo/?application_id=${sc.api.eu}&event_id=${sc.cw.data.event}&front_id=${sc.cw.data.front}&clan_id=${wg.clan.id}`, sf.apiClanHandler);
					// find all members in stored memberslist and fetch famepoints for each
					for (var id in s.user) {
						if (s.user.hasOwnProperty(id)) {
							if (id !== "clan") {
								fameCount ++;
								sf.request("userData", `https://worldoftanks.eu/wotup/profile/global_map/stats/?spa_id=${id}`, sf.apiHandler);
							}
						}
					}
				}
				else {
					window.alert("No active events");
				}
			},
			apiHandler: function ({data, status}) { // https://worldoftanks.eu/wotup/profile/global_map/stats/?spa_id=505838943&language=en
				if (status == "ok" && /ACTIVE|FINISHED/.test(data.global_map.event.status)) {
					const stats = data.stats[data.global_map.fronts[0].id];
					s.user[stats.id].f = stats;
					fameCount --;
					loadCount ++;
					var fameStatus = document.getElementById('js-fame-fetch'),
					fameLoader = document.getElementById('js-fame-loader');
					if (fameStatus) {fameStatus.firstElementChild.textContent = `${loadCount <= 100 ? (loadCount/s.clan.mem*100).toFixed(0) : 100}%`;}
					else {fameLoader.textContent = `${loadCount <= 100 ? (loadCount/s.clan.mem*100).toFixed(0) : 100}%`;}
					if (fameCount === 0 && s.clanFame) {
						sf.fameFapped();
					}
				}
				else {
					console.error("Data not OK!", data);
				}
			},
			apiClanHandler: function (data) { // processing information from clan fame API
				data = data.data;
				for (var id in data) {
					if (data.hasOwnProperty(id)) {
						clanData = data[id].events[sc.cw.data.event][0];
					}
				}
				s.clanFame = clanData || true;
				if (fameCount === 0) {
					sf.fameFapped();
				}
			},
			fameFapped: function () { // store data and reload page
				var fameStatus = document.getElementById('js-fame-fetch'),
				fameLoader = document.getElementById('js-fame-loader');
				sf.storage(`fameScriptValues_${wg.clan.id}`, s, "set", "string");
				sf.storage(`fameScriptDate_${wg.clan.id}`, Date.now(), "set");
				if (fameStatus) {fameStatus.textContent = "Fapped!";}
				else {fameLoader.textContent = "Fapped!";}
				location.reload();
			},
			loadPage: function () { // load the page
				// hide animated loading gear
				loadGif.classList.add("js-hidden");

				var countFragment = document.createDocumentFragment(),
				fameFragment = document.createDocumentFragment(),
				clanRank = f.clanFame.rank ? f.clanFame.rank/sc.bonds_position[0] : 1,
				clanMulti = sc.bonds.find(function (el) {
					return el[2] >= clanRank;
				}),
				memCount = 0, goodCount = 0, goodPosCount = 0, goodFameCount = 0, goodCamoCount = 0;
				// memberlist
				for (var _r in f.user) {
					if (f.user.hasOwnProperty(_r)) {
						var mem = f.user[_r];
						if (_r !== "clan" && _r !== "clanFame" && mem.f && mem.f.clan_id == wg.clan.id) {
							//console.log(mem.u.name, mem.f);
							//var bStatus = mem.f.battles_played_for_clan >= 15 ? "good" : mem.f.battles_played_for_clan >= 10 ? "ok" : "bad",
							var bStatus = mem.f.rank && mem.f.rank <= sc.cw.tanks ? "good" : "bad",
							fameTotal = mem.f.fame_points+mem.f.fame_points_since_turn,
							fameReq = sc.cw.pvfame-fameTotal,
							fameBats = fameTotal/mem.f.battles_played_for_clan || 0,
							fameClass = mem.f.fame_points_since_turn > 0 ? "fame-good" : "fame-bad",
							fameSpent = mem.f.fame_points_for_current_clan-mem.f.fame_points,
							fameBooster = sc.fame_boosters.find(function (el) {
								return el[0] >= fameSpent;
							})[1],
							vfImage = fameTotal !== 0 && fameTotal >= sc.cw.pvfame ? `<img class='tank' src='${sc.i.host}Zhc3sM7Q.png'>` : "",
							vpImage = mem.f.rank && mem.f.rank <= sc.cw.tanks ? `<img class='tank' src='${sc.i.host}Zhc3sM7Q.png'>` : "",
							vbImage = bStatus == "good" ? `<img class='tank' src='${sc.i.host}Zhc3sM7Q.png'>` : "",
							cfImage = "", cpImage = "", bondsRank = 1, bondsAmount = 1, bondsImage = "", reward = 0;
							if (sc.cw.camo) {
								cfImage = fameTotal !== 0 && fameTotal >= sc.cw.pcfame ? `<img class='camo' src='${sc.i.host}fSQJ8TvQ.png'>` : "";
								cpImage = !mem.f.rank ? "" : mem.f.rank <= 19000 ? `<img class='camo' src='${sc.i.host}fSQJ8TvQ.png'>` : "";
							}
							if (sc.cw.bonds && mem.f.rank) {
								bondsRank = mem.f.rank ? mem.f.rank/sc.bonds_position[1] : 1;
								bondsAmount = sc.bonds.find(function (el) {
									return el[3] >= bondsRank;
								}) || 0;
								reward = (clanMulti ? clanMulti[0] : 1)*bondsAmount[1];
								if (reward >= 4000) {
									bondsImage = `<img class='tank' src='${sc.i.host}Zhc3sM7Q.png'>`;
								}
							}
							mem.u.role = mem.u.role.replace(/ /g, "_").toLowerCase();
							memCount++;
							countFragment.appendChild(sf.elem("tr", {className: "rating-table_tr rating-table_tr__default", innerHTML: `<td>${memCount}</td>`}));
							fameFragment.appendChild(sf.elem("tr", {className: `rating-table_tr rating-tr_${bStatus} rating-table_tr__default ${mem.u.name}`, innerHTML: `<td><a href='http://worldoftanks.eu/community/accounts/${mem.u.id}-${mem.u.name}/'>${mem.u.name}</a></td><td data-sort='${sc.role[mem.u.role][0]}'>${sc.ideal ? `<img class='role' src='${sc.role[mem.u.role][1]}'>` : sc.role[mem.u.role][2]}</td><td>${fameTotal}<span class='${fameClass}'>${mem.f.fame_points_since_turn && mem.f.fame_points_since_turn !== 0 ? `(${mem.f.fame_points_since_turn})` : ""}</span>${cfImage}${vfImage}</td><td data-sort='${mem.f.rank ? mem.f.rank : Infinity}'>${mem.f.rank ? mem.f.rank : "N/A"}${cpImage}${vpImage}</td><td>${reward || 0}${bondsImage}</td><td>${fameReq > 0 ? fameReq : 0}</td><td>${fameBooster}</td><td>${mem.f.battles_played_for_clan}${vbImage}</td><td>${mem.f.battles_played_for_clan > 0 ? fameBats.toFixed(2) : "0"}</td><td data-sort='${mem.f.rank ? Math.ceil(fameReq/fameBats) : Infinity}'>${mem.f.battles_played_for_clan > 0 ? Math.ceil(fameReq/fameBats) : "N/A"}</td>`}));
							if (bStatus == "good") {goodCount++;}
							if (mem.f.rank && mem.f.rank <= sc.cw.tanks) {goodPosCount++;}
							if (fameTotal >= sc.cw.pvfame) {goodFameCount++;}
							if (fameTotal >= sc.cw.pcfame) {goodCamoCount++;}
						}
						else {
							console.error("error", mem);
						}
					}
				}
				// check fame status
				var fameRankClass = f.clanFame.rank_delta > 0 ? "fame-good" : "fame-bad",
				famePointsClass = f.clanFame.fame_points_since_turn > 0 ? "fame-good" : "fame-bad";

				// add main div
				layoutHolder.appendChild(sf.elem("div", {className: "fame-div"}, [
					sf.elem("div", {className: "fame-head"}, [
						sf.elem("h1", {innerHTML: `FAPs for ${s.clan.name} - ${sc.cw.data.event.replace("_"," ")}`}),
						sf.elem("div", {className: "fame-panel"}, [
							sf.elem("div", {className: "fame-legend", innerHTML: `<table><tr><td colspan='2'>Fame (Prediction)</td></tr><tr><td><img class='tank' src='${sc.i.host}Zhc3sM7Q.png'></td><td>Will recieve event tank</td></tr><tr><td>${sc.cw.camo ? `<img class='camo' src='${sc.i.host}fSQJ8TvQ.png'></td><td>Will recieve event camo` : ""}</td></tr><tr><td colspan='2'>Position (Currently)</td></tr><tr><td><img class='tank' src='${sc.i.host}Zhc3sM7Q.png'></td><td>Will recieve event tank</td></tr><tr><td>${sc.cw.camo ? `<img class='camo' src='${sc.i.host}fSQJ8TvQ.png'></td><td>Will recieve event camo` : ""}</td></tr></table>`}),
							sf.elem("div", {className: "fame-info", innerHTML: `<table class='fame-info-table'><tbody><tr><td>Position:</td><td>${f.clanFame.rank || 0}<span class='${fameRankClass}'>${f.clanFame.rank_delta && f.clanFame.rank_delta !== 0 ? `(${f.clanFame.rank_delta})` : ""}</span></td><td>FAPs:</td><td>${f.clanFame.fame_points || 0}<span class='${famePointsClass}'>${f.clanFame.fame_points_since_turn && f.clanFame.fame_points_since_turn !== 0 ? `(${f.clanFame.fame_points_since_turn})` : ""}</span></td></tr><tr><td>Battles/Wins:</td><td>${f.clanFame.battles || 0}/${f.clanFame.wins || 0}</td><td>Winrate:</td><td>${sf.color(f.clanFame.wins/f.clanFame.battles*100, "wr", 2, "%")}</td></tr><tr><td>15 Battles:</td><td>${goodCount}</td><td>Top ${sc.cw.tanks}:</td><td>${goodPosCount}</td></tr><tr><td>${sc.cw.pvfame}* FAPs:</td><td>${goodFameCount}</td><td>Multiplier:</td><td>${clanMulti ? clanMulti[0] : 1}</td></tr></tbody><tfoot><tr><td colspan='4'>* ${sc.cw.pvfame} is the predicted limit for position ${sc.cw.tanks} at the end of the campaign</td></tr><tr><td colspan='4'>${sc.cw.camo ? `* ${sc.cw.pcfame} is the predicted limit for position ${sc.cw.camo} at the end of the campaign` : ""}</td></tr></tfoot></table>`}),
							sf.elem("div", {className: "fame-time", innerHTML: "<table><tr><td>Start:</td><td>29/05/2018</td></tr><tr><td>End:</td><td>12/06/2018</td></tr><tr><td>Time Left:</td><td id='js-timeLeft'></td></tr><tr><td>Prime Time:</td><td id='js-timePrime'>--</td></tr></table>"}),
						]),
						sf.elem("div", {className: "fame-link", innerHTML: "<a href='http://worldoftanks.eu/clanwars/rating/alley/'>Alley of Fame</a>"}),
						sf.elem("div", {className: "b-button-stats", innerHTML: "<a id='js-fame-fetch'>Start Fapping</a>", onclick() {sf.fameFetch(); this.onclick = function() {return false;};}})
					]),
					sf.elem("div", {className: "fame-tables"}, [
						sf.elem("table", {className: "rating-table nosort", innerHTML: "<thead class='rating-table_head'><tr><th class='rating-table_th no-sort'>#</th></tr></thead>"}, [
							sf.elem("tbody", {className: "rating-table_body"}, countFragment)
						]),
						sf.elem("table", {className: "rating-table sortable", id: "clanFame-table", innerHTML: "<thead class='rating-table_head'><tr><th class='rating-table_th'>Name</th><th class='rating-table_th'  data-sort-order='desc'>Role</th><th class='rating-table_th' data-sort-method='number'>Fame</th><th class='rating-table_th sort-default' data-sort-method='number' data-sort-order='desc'>Position</th><th class='rating-table_th' data-sort-method='number'>Bonds</th><th class='rating-table_th' data-sort-method='number'>Fame to Cutoff</th><th class='rating-table_th' data-sort-method='number'>Booster</th><th class='rating-table_th' data-sort-method='number'>Battles</th><th class='rating-table_th'>Fame/Bats</th><th class='rating-table_th' data-sort-method='number'>Bats Left</th></tr></thead>"}, [
							sf.elem("tbody", {className: "rating-table_body"}, fameFragment)
						])
					])
				]));

				// dates and times
				window.setInterval(sf.eventTime ,1000);


				// activate tablesort function
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
					new Tablesort(document.getElementById("clanFame-table"));
				}
				else {
					window.alert("Error activating tablesort, please refresh - if this shit continues, poke Orrie");
				}
			},
			eventTime: function () {
				var dateNow = new Date(),
				dateEnd = 1528808400000,
				time = {
					d: new Date(new Date(dateEnd) - dateNow).getDate()-1,
					h: new Date(new Date(dateEnd) - dateNow).getHours(),
					m: new Date(new Date(dateEnd) - dateNow).getMinutes(),
					s: new Date(new Date(dateEnd) - dateNow).getSeconds(),
					p: {
						h: 18-dateNow.getHours(),
						m: 60-dateNow.getMinutes()-1,
						s: 60-dateNow.getSeconds()-1
					}
				};
				document.getElementById('js-timeLeft').textContent = `${(time.d ? `${time.d} Days, ` : "")+time.h} Hours, ${time.m} Mins, ${time.s} Secs`;
				if (time.p.h >= 0) {
					document.getElementById('js-timePrime').innerHTML = `${(time.p.h ? `${time.p.h} Hours, ` : "")+time.p.m} Mins, ${time.p.s} Secs`;
				}
				else if (!sc.goTime) {
					document.getElementById('js-timePrime').innerHTML = "<span style='color:#ff0000;'>I</span><span style='color:#ff2000;'>T</span><span style='color:#ff4000;'>'</span><span style='color:#ff5f00;'>S</span><span style='color:#ff7f00;'> </span><span style='color:#ff9900;'>F</span><span style='color:#ffb200;'>U</span><span style='color:#ffcc00;'>C</span><span style='color:#ffe500;'>K</span><span style='color:#ffff00;'>I</span><span style='color:#bfff00;'>N</span><span style='color:#80ff00;'>G</span><span style='color:#40ff00;'> </span><span style='color:#00ff00;'>G</span><span style='color:#00ff33;'>O</span><span style='color:#00ff66;'> </span><span style='color:#00ff99;'>T</span><span style='color:#00ffcc;'>I</span><span style='color:#00ffff;'>M</span><span style='color:#00bfff;'>E</span><span style='color:#0080ff;'>!</span><span style='color:#0040ff;'>!</span><span style='color:#0000ff;'>!</span>";
					sc.goTime = true;

				}
			},
			color: function (input, type, dec, sym) { // colouring
				if (isNaN(input)) {return 0;}
				var color = colArr.dft[0],
				output = input.toFixed(dec);
				if (sym) {
					output += sym;
				}
				if (input >= 1000) {
					output = input.toFixed(dec).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${loc[0]}`);
				}
				for (var c in colArr) {
					if (colArr.hasOwnProperty(c)) {
						if (input >= colArr[c][colArr.id[type]]) {
							color = colArr[c][0]; break;
						}
					}
				}
				return `<span style='color:${color}'>${output}</span>`;
			},
			elem: function (tag, attributes, children) { // quick creation of element
				// element creation
				const element = document.createElement(tag);
				if (attributes) {
					for (let _e_k = Object.keys(attributes), _e=_e_k.length; _e>0; _e--) {
						element[_e_k[_e-1]] = attributes[_e_k[_e-1]];
					}
				}
				if (children) {
					if (children.nodeType) {
						element.appendChild(children);
					}
					else {
						for (let _c=0, _c_len=children.length; _c<_c_len; _c++) {
							element.appendChild(children[_c]);
						}
					}
				}
				return element;
			},
			storage: function (name, data, type, mode) { // localStorage handler
				var storage;
				switch(type) {
					case ("set"):
						if (mode == "string") {
							data = JSON.stringify(data);
						}
						storage = localStorage.setItem(name, data);
						break;
					case ("get"):
						storage = localStorage.getItem(name);
						if (mode == "parse") {
							storage = JSON.parse(storage);
						}
						break;
					default: break;
				}
				return storage;
			},
			request: function (name, url, handler) { // retrieval function
				GM.xmlHttpRequest({
					method: "GET",
					url: url,
					headers: {
						"Accept": "text/xml"
					},
					onload: function(resp) {
						var data = JSON.parse(resp.responseText);
						if (resp.status == 200) {
							if (sc.debug) {console.info(name, data, url, new Date().toLocaleTimeString("en-GB"));}
							handler(data);
						}
						else {
							console.error("Error accessing API", name, url, resp);
						}
					},
					onerror: function(resp) {
						console.error("Error accessing API", name, url, resp);
					}
				});
			}
		};

		// add button to famepoints list
		var menu_class = document.getElementsByClassName('menu-top')[0],
		clanFame_div = sf.elem("div", {className: "menu-top_item", innerHTML: `<a class='menu-top_link' href='http://eu.wargaming.net/clans/wot/${wg.clan.id}/famepoints/'>Famepoints</a>`});
		if(menu_class) {
			menu_class.appendChild(clanFame_div);
		}

		// check if on custom famepoint page
		if (wg.n && wg.e) {
			// fetch stored event data
			sc.cw.data = sf.storage("fameScriptEvent", "", "get", "parse");
			// fetch stored clanlist stats - check if array exists in localStorage, otherwise tag fetching to true
			var s = {},
			ssValues = sf.storage(`statScriptValues_${wg.clan.id}`, "", "get", "parse"),
			ssDate = sf.storage(`statScriptDate_${wg.clan.id}`, "", "get", "parse")+6048e5 >= Date.now(); // true if timestamp is less than 1 weeks old
			if (ssValues) {
				s = ssValues;
			}
			// fetch stored clanlist with famepoints - check if array exists in localStorage, otherwise tag fetching to true
			var f = {},
			sfValues = sf.storage(`fameScriptValues_${wg.clan.id}`, "", "get", "parse"),
			sfDate = sf.storage(`fameScriptDate_${wg.clan.id}`, "", "get", "parse")+36e5 >= Date.now(); // true if timestamp is less than 1 hour, refresh list if false.
			if (sfValues && sfDate) {
				f = sfValues;
			}

			// modify page title
			document.title = `FAPs for ${s.clan ? s.clan.name : "Fetching FAPs"}`;

			// inserting style into head
			document.head.appendChild(sf.elem("style", {className: "wotstatscript", type: "text/css", textContent: `
/* famepoints style fix rules */
.wot .layout {background: none;}
.layout_holder {padding: 0; width: 1280px; max-width: unset;}
.page-service {display: none;}
/* loading text */
.processing.wn8-loader span {margin: 25px 0px 0px -20px; text-align: center; width: 45px; position: absolute; top: 50%; left: 50%;}
/* background rules */
${sc.ideal ? ".layout-back {background-image: url(http://eu.wargaming.net/clans/media/clans/emblems/cl_541/500159541/emblem_195x195.png); background-repeat: repeat; background-color: rgba(0, 0, 0, 0.6); background-position: 0 45px; position: absolute; height: 100%; width: 100%; top: 0px; z-index: -1; opacity: 0.20;}" : ""}
/* fame colors */
.fame-good {margin: 0 0 0 5px; color: rgba(0, 128, 0, 0.75)}
.fame-bad {margin: 0 0 0 5px; color: rgba(255, 0, 0, 0.75)}
/* fame head rules */
.fame-head {margin: 25px 0px 15px;}
.fame-head h1 {margin: 0 0 10px 0; text-align: center; text-transform: capitalize;}
.fame-head .b-button-stats {top: 10px; right: 10px;}
/* fame panel rules */
.fame-panel {display: table; margin: 0px auto;}
.fame-panel > * {display: inline-block; margin: 0 10px; vertical-align: middle;}
/* fame info table rules */
.fame-info {background: rgba(0, 0, 0, 0.50); border-radius: 5px; padding: 10px;}
.fame-info-table {}
.fame-info-table td {padding: 0 5px;}
.fame-info-table td:nth-child(2n+1) {font-weight: bold;}
.fame-info-table tfoot td {font-size: 9px; font-style: oblique; font-weight: unset; text-align: center;}
/* fame legend rules */
.fame-legend {background: rgba(0, 0, 0, 0.50); border-radius: 5px; padding: 10px;}
.fame-legend table tr:nth-child(3n+1) {font-weight: bold;}
.fame-legend table img {display: table; margin: 0px auto;}
/* fame time rules */
.fame-time {background: rgba(0, 0, 0, 0.50); border-radius: 5px; padding: 10px;}
.fame-time table tr td:first-of-type {font-weight: bold;}
.fame-time table tr td:last-of-type {text-align: right;}
/* fame link rules */
.fame-link {text-align: center;}
/* famepoint member table rules */
.rating-table.sortable {margin: 0px 0px 0px 60px; : calc(100% - 60px);}
.rating-table.nosort {position: absolute; width: 60px;}
.rating-table th {background: rgba(0, 0, 0, 0.25); border-bottom: 2px solid #999; cursor: pointer; font-size: 18px; font-weight: bold; line-height: 30px; text-align: center; padding: 0px 25px; white-space: nowrap;}
.rating-table.nosort th {cursor: unset; width: 50px;}
.rating-table_head th.sort-up {background: url(${sc.u.arr_u}) no-repeat right 5px center rgba(0, 0, 0, 0.50);}
.rating-table_head th.sort-down {background: url(${sc.u.arr_d}) no-repeat right 5px center rgba(0, 0, 0, 0.50);}
.rating-table_body .rating-tr_good {background-color: rgba(0, 128, 0, 0.10);}
.rating-table_body .rating-tr_ok {background-color: rgba(255, 255, 0, 0.10);}
.rating-table_body .rating-tr_bad {background-color: rgba(255, 0, 0, 0.10);}
.rating-table td {line-height: 24px; padding: 3px 0; text-align: center; position: relative;}
.rating-table.nosort td {background: rgba(0, 0, 0, 0.25);}
.rating-table.sortable td:nth-of-type(1) {width: 25%;}
.rating-table.sortable td:nth-of-type(2) {width: 12.5%;}
.rating-table.sortable td:nth-of-type(3) {width: 17.5%;}
.rating-table.sortable td:nth-of-type(4) {width: 17.5%;}
.rating-table.sortable td:nth-of-type(5) {width: 12.5%;}
.rating-table.sortable td:nth-of-type(6) {width: 15%;}
.rating-table td img.role {height: 23px; vertical-align: inherit;}
.rating-table td img.tank, .rating-table td img.camo {position: absolute; margin-left: 5px;}
.rating-tr_you td {background: url(${sc.u.b_you});}
				`
			}));
			// end style

			// create new background for transparancy
			var layout = document.getElementsByClassName('layout')[0],
			background_div = sf.elem("div", {className: "layout-back"});
			layout.appendChild(background_div);

			// colour scale array
			var colArr = {
				//      col        wr  bat    sr  hr  dmg  wgr   wn8   wn7   eff   nm
				sUni: [ "#5A3175", 65, 30000, 50, 80, 270, 9900, 2900, 2050, 2050, 2000 ], // 99.99% super unicum
				uni:  [ "#83579D", 60, 25000, 46, 75, 240, 9000, 2450, 1850, 1800, 1950 ], // 99.90% unicum
				gr8:  [ "#3972C6", 56, 21000, 42, 70, 210, 8500, 2000, 1550, 1500, 1750 ], // 99.00% great
				vGud: [ "#4099BF", 54, 17000, 38, 65, 180, 6500, 1600, 1350             ], // 95.00% very good
				good: [ "#4D7326", 52, 13000, 34, 60, 150, 5000, 1200, 1100, 1200, 1450 ], // 82.00% good
				aAvg: [ "#849B24", 50, 10000, 30, 55, 120, 4000,  900                   ], // 63.00% above average
				avg:  [ "#CCB800", 48,  7000, 25, 50,  90, 3000,  650,  900,  900, 1250 ], // 40.00% average
				bAvg: [ "#CC7A00", 47,  3000, 20, 45,  60, 2000,  450,  700,  600, 1150 ], // 20.00% below average
				bas:  [ "#CD3333", 46,  1000, 15, 40,  30, 1500,  300,  500             ], //  6.00% basic
				beg:  [ "#930D0D",  0,     0,  0,  0,   0,    0,    0,    0,    0,    0 ], //  0.00% beginner
				dft:  [ "#6B6B6B" ], // default
				id: { "col": 0, "wr": 1, "bat": 2, "sr": 3, "hr": 4, "dmg": 5, "wgr": 6, "wn8": 7, "wn7": 8, "eff": 9, "nm": 10 }  // type identifier
			};

			// localization
			var loc = [
				// thousands separator
				{ en: ",", ru: " ", cs: " ", de: ".", fr: " ", pl: " ", es:".", tr: "."}
			];
			// process localization
			for (var _l=0, l_len = loc.length; _l<l_len; _l++) {
				loc[_l] = loc[_l][sc.loc];
			}

			// add animated loading icon while everything is processing
			var layoutHolder = document.getElementsByClassName('layout_holder')[0],
			fameCount = 0, loadCount = 0, userData = false, clanData = false,
			loadGif = sf.elem("div", {className: "processing wn8-loader", innerHTML: "<span id='js-fame-loader'></span>"});
			layoutHolder.appendChild(loadGif);

			// load table if stored stats famepoints are found, or load from stored stats
			if (f && Object.keys(f).length !== 0) {
				sf.loadPage();
			}
			else {
				sf.fameFetch();
			}
		}
		else if (!wg.n && wg.e) {
			window.alert("Please login for FAPs");
		}
	});
	pageLook.observe(document.body, {childList: true});
})(window);
