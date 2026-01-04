// ==UserScript==
// @name        WoTStatScript - Campaign Clanstats
// @version     1.31
// @description Comparable list of top 100 clans
// @author      Orrie
// @namespace   http://forum.worldoftanks.eu/index.php?/topic/263423-
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     http*://eu.wargaming.net/clans/*/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @require     https://greasyfork.org/scripts/18946-tablesort/code/Tablesort.js?version=120660
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/369323/WoTStatScript%20-%20Campaign%20Clanstats.user.js
// @updateURL https://update.greasyfork.org/scripts/369323/WoTStatScript%20-%20Campaign%20Clanstats.meta.js
// ==/UserScript==

(function() {
	// new page handler making sure it has loaded
	var pageLook = new MutationObserver(function() {
		pageLook.disconnect();
		// get server info and webpage
		const wg = {href:document.location.href, clan:{}};
		wg.e = /clanstats/i.test(wg.href);
		wg.n = document.getElementsByClassName('sidebar-clan_emblem')[0] || true;
		wg.own = document.getElementsByClassName('cm-user-menu-link_cutted-text')[0];

		// script variables
		let f = {}, loadCount = 0, clanCount = 0, clanData = false, clanTotal, layoutHolder;
		const sc = {
			cw: {
				event: "",
				front: "",
				limit: 100
			},
			api: {
				eu: "a7595640a90bf2d19065f3f2683b171c"
			},
			u: {
				arr_u: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVAjXY2BgLPauSqpnYoABxpK4ejcGRoZi79LP5X/qamFSJSWlv8q/tPgzVLuUfyn7X/6rNZmB8T9jWWLpr7L/Vd+O9gHVNAVUfAJK/WjMKE0q/V72v+bLwZ5/wmDtrY4Vn8v+l/0Bqa78caTnvyDcxmaXcqAuoPD3EzDVMLfUhVZ8q/q2b/J/EQZ00OS1dwJCGAAXYkZknpRD4wAAAABJRU5ErkJggg==",
				arr_d: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACUSURBVAjXY2CAgv+M9WFbp32VYkADjHWpZT8rfm6f908SRbzFu/xb2f+y/xW/jk76JwoXbgoq/woU/lkKJCt+7pr6Txws3Bxd/r3sf/n35vCS4FKgvsofe6f+E2Oo8oQIt8eAFJVElX4HSR2cwFBqX/Ku7HdDdj0TxNjSpNLv5e9aHYHMYofKiP+MCIcUhzRbMTAAABQDRpIIcY4aAAAAAElFTkSuQmCC",
				ptsd: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY8hya1YBAAOpAVgmdE+yAAAAAElFTkSuQmCC"
			},
			i: {
				loader: "/clans/static/2.2.8/images/processing/loader.gif"
			}
		},
		// colour scale array
		colArr = {
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
		},
		// localization
		loc = [
			// thousands separator
			","
		];

		// add button to famepoints list
		var menu_class = document.getElementsByClassName('menu-top')[0],
		clanFame_div = elem("div", {className: "menu-top_item", innerHTML: `<a class='menu-top_link' href='https://eu.wargaming.net/clans/clanstats/'>Event Stats</a>`});
		if(menu_class) {
			menu_class.appendChild(clanFame_div);
		}

		// check if on custom famepoint page
		if (wg.n && wg.e) {
			// modify page title
			document.title = "Campaign Clan Stats";

			// fetch stored clanlist with famepoints - check if array exists in localStorage, otherwise tag fetching to true
			const cfValues = locStorage("clanFameScriptValues", "", "get", "parse"),
			cfDate = locStorage("clanFameScriptDate", "", "get", "parse")+36e5 >= Date.now(); // true if timestamp is less than 1 hour, refresh list if false.
			if (cfValues && cfDate) {
				f = cfValues;
			}

			// inserting style into head
			const style = elem("style", {clasName: "wotstatscript", type: "text/css", textContent: `
	/* famepoints style fix rules */
	.layout {background: none;}
	.layout_holder {padding: 0; width: 100vh; margin: 0 1%;}
	.page-service {display: none;}
	/* loading text */
	.processing_loader span {display: table; margin: 0 auto;}
	/* background rules */
	.layout-back {background-image: url(https://eu.wargaming.net/clans/media/clans/emblems/cl_340/500069340/emblem_195x195.png); background-repeat: repeat; background-color: rgba(0, 0, 0, 0.6); background-position: 0 45px; position: absolute; height: 100%; width: 100%; top: 0px; z-index: -1; opacity: 0.20;}
	/* fame head rules */
	.fame-head {margin: 25px 0px 15px;}
	.fame-head h1 {margin: 0 0 10px 0; text-align: center; text-transform: capitalize;}
	.fame-head .b-button-stats {top: 10px; right: 10px;}
	/* fame info table rules */
	.fame-info {background: rgba(0, 0, 0, 0.50); border-radius: 5px; display: table; margin: 0 auto 10px; padding: 10px;}
	.fame-info-table {}
	.fame-info-table td {padding: 0 5px;}
	.fame-info-table td:nth-child(2n+1) {font-weight: bold;}
	.fame-info-table tfoot td {font-size: 9px; font-style: oblique; font-weight: unset; text-align: center;}
	/* fame legend rules */
	.fame-legend {background: rgba(0, 0, 0, 0.50); border-radius: 5px; padding: 10px; position: absolute; top: 9px; left: 10px;}
	.fame-legend table tr:nth-child(3n+1) {font-weight: bold;}
	.fame-legend table img {display: table; margin: 0px auto;}
	/* fame button rules */
	.b-button-stats {border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2px; position: absolute; right: 10px; top: 10px;}
	.b-button-stats a {background: rgba(255, 255, 255, 0.1); color: #FFFFFF; cursor: pointer; font-size: 17px; line-height: 45px; display: block; padding: 0px 15px; transition: all 0.2s ease 0s;}
	/* fame link rules */
	.fame-link {text-align: center;}
	/* famepoint member table rules */
	.rating-table.sortable {margin: 0px 0px 0px 50px; width: 90vw;}
	.rating-table.nosort {position: absolute; width: 50px;}
	.rating-table th {background: rgba(0, 0, 0, 0.25); border-bottom: 2px solid #999; cursor: pointer; font-size: 18px; font-weight: bold; text-align: center;}
	.rating-table.nosort th {cursor: unset; width: 50px;}
	.rating-table_head th.sort-up {background: url(${sc.u.arr_u}) no-repeat right 5px center rgba(0, 0, 0, 0.50);}
	.rating-table_head th.sort-down {background: url(${sc.u.arr_d}) no-repeat right 5px center rgba(0, 0, 0, 0.50);}
	.rating-table_body .rating-tr_good {background-color: rgba(0, 128, 0, 0.10);}
	.rating-table_body .rating-tr_ok {background-color: rgba(255, 255, 0, 0.10);}
	.rating-table_body .rating-tr_bad {background-color: rgba(255, 0, 0, 0.10);}
	.rating-table td {padding: 3px 0; text-align: center;}
	.rating-table.nosort td {background: rgba(0, 0, 0, 0.25);}
	.rating-table.sortable td {width: 5%; background: url(https://worldoftanks.eu/static/3.33.2/common/css/scss/tables/default/img/td-profile-bg.png) repeat 0 0; background: rgba(0,0,0,0.15);}
	.rating-table.sortable td:nth-of-type(1) {width: 18%;}
	.rating-table.sortable .fame-good {margin: 0 0 0 5px; color: rgba(0, 128, 0, 0.75)}
	.rating-table.sortable .fame-bad {margin: 0 0 0 5px; color: rgba(255, 0, 0, 0.75)}
	.rating-table td img.tank {float: right; margin: 0 35px 0 -70px;}
	.rating-table td img.camo {float: right; margin: 0 10px 0 -32px;}
	.rating-table.sortable .rating-PTS-D td {background: url(${sc.u.ptsd});}
				`
			});
			document.head.appendChild(style);
			// end style

			// load table if stored stats famepoints are found, or load from stored stats
			layoutHolder = document.getElementsByClassName("layout_holder")[0];
			if (f && Object.keys(f).length) {
				if (layoutHolder) {
					loadPage();
				}
				else {
					const observer = new MutationObserver(function(m) {
						layoutHolder = document.getElementsByClassName("layout_holder")[0];
						if (layoutHolder) {
							loadPage();
							observer.disconnect();
						}
					});
					observer.observe(document.body, {childList: true});
				}
			}
			else {
				if (layoutHolder) {
					layoutHolder.appendChild(elem("div", {className: "b-button-stats", innerHTML: "<a id='js-fame-fetch'></a>"}));
				}
				else {
					const observer = new MutationObserver(function(m) {
						layoutHolder = document.getElementsByClassName("layout_holder")[0];
						if (layoutHolder) {
							layoutHolder.appendChild(elem("div", {className: "b-button-stats", innerHTML: "<a id='js-fame-fetch'></a>"}));
							observer.disconnect();
						}
					});
					observer.observe(document.body, {childList: true});
				}
				const eApi = `https://api.worldoftanks.eu/wot/globalmap/events/?application_id=${sc.api.eu}`;
				reqHnd(eApi, apiEventHnd);
			}
		}
		else if (!wg.n && wg.e) {
			window.alert("Please login for FAPs");
        }

		// check if event is running and fetch top 50 in alley of fame from campaign event
        function apiEventHnd(data) {
			const event = data ? data[0] : "error";
			if (event.status == "ACTIVE") {
				sc.cw.event = event.event_id;
				sc.cw.front = event.fronts[0].front_id;
				const tApi = `https://api.worldoftanks.eu/wot/globalmap/eventrating/?application_id=${sc.api.eu}&limit=${sc.cw.limit}&event_id=${sc.cw.event}&front_id=${sc.cw.front}`;
				console.log(tApi);
				reqHnd(tApi, apiClanTopHnd);
			}
			else {
				window.alert("No active events");
			}
        }

		// processing information from clan alley API
		function apiClanTopHnd(data) {
			const clanTotal = data.length;
			if (clanTotal) {
				for (let _c=0; _c<clanTotal; _c++) {
					const clanData = data[_c], id = clanData.clan_id;
					if (id) {
						const cApi = `https://api.worldoftanks.eu/wot/globalmap/eventclaninfo/?application_id=${sc.api.eu}&event_id=${sc.cw.event}&front_id=${sc.cw.front}&clan_id=${id}`;
						f[id] = {
							tag: clanData.tag,
							name: clanData.name,
							rank: clanData.rank,
							color: clanData.color,
							battleFame: clanData.battle_fame_points || 0,
							taskFame: clanData.task_fame_points || 0,
							totalFame: clanData.total_fame_points || 0
						};
						reqHnd(cApi, apiClanHnd);
						loadCount ++;
					}
				}
			}
		}

		// processing information from clan fame API
		function apiClanHnd(data) {
			const fameStatus = document.getElementById('js-fame-fetch');
			let id;
			for (id in data) {
				if (data.hasOwnProperty(id)) {
					clanData = data[id].events[sc.cw.event][0];
				}
			}
			Object.assign(f[id], {
				battles: clanData.battles,
				wins: clanData.wins,
				rankDelta: clanData.rank_delta,
				fameDelta: clanData.fame_points_since_turn
			});
			clanCount ++;
			loadCount --;
			if (fameStatus) {
				fameStatus.textContent = `${(clanCount <= 100) ? (clanCount/100*100).toFixed(0) : 100}%`;
			}
			if (loadCount === 0) {
				fameFapped();
			}
		}

		// store data and reload page
		function fameFapped() {
			locStorage("clanFameScriptValues", f, "set", "string");
			locStorage("clanFameScriptDate", Date.now(), "set");
			location.reload();
		}

		// load the page
		function loadPage() {
			let clanCount = 0;
			const countFragment = document.createDocumentFragment(),
			fameFragment = document.createDocumentFragment();

			// create table contents
			for (const _r in f) {
				if (f.hasOwnProperty(_r)) {
					const clan = f[_r],
					fameRankClass = (clan.rankDelta > 0) ? "fame-good" : "fame-bad",
					famePointsClass = (clan.fameDelta > 0) ? "fame-good" : "fame-bad";
					// check fame status
					clanCount++;
					countFragment.appendChild(elem("tr", {className: "rating-table_tr rating-table_tr__default", innerHTML: `<td>${clanCount}</td>`}));
					fameFragment.appendChild(elem("tr", {className: `rating-table_tr rating-table_tr__default rating-${clan.tag}`, innerHTML: `<td><a href='https://eu.wargaming.net/clans/${_r}/'><span style='color:${clan.color}'>[${clan.tag}]</span> ${clan.name}</a></td><td>${clan.rank}<span class='${fameRankClass}'>${clan.rankDelta ? `(${clan.rankDelta})` : ""}</span></td><td>${clan.totalFame}<span class='${famePointsClass}'>${clan.fameDelta ? `(${clan.fameDelta})` : ""}</span></td><td>${clan.fameDelta ? clan.totalFame+clan.fameDelta : clan.totalFame}</td><td>${clan.battleFame}</td><td>${clan.taskFame}</td><td>${(clan.battleFame+clan.taskFame)}</td><td>${clan.battles}</td><td>${clan.wins}</td><td>${colStat(clan.wins/clan.battles*100, "wr", 2, "%")}</td>`}));
				}
			}

			// add main div
			const fameDiv = elem("div", {className: "fame-div"}, [
				elem("div", {className: "fame-head"}, [
					elem("h1", {innerHTML: `Clan Statistics - ${sc.cw.event.replace("_"," ")}`}),
					elem("div", {className: "fame-link", innerHTML: "<a href='https://worldoftanks.eu/clanwars/rating/alley/'>Alley of Fame</a>"}),
					elem("div", {className: "b-button-stats", innerHTML: "<a>Start Fapping</a>", onclick() {
						localStorage.removeItem("clanFameScriptValues");
						location.reload();
					}})
				]),
				elem("div", {className: "fame-tables"}, [
					elem("table", {className: "rating-table nosort", innerHTML: "<thead class='rating-table_head'><tr><th class='rating-table_th no-sort'>#</th></tr></thead>"}, [
						elem("tbody", {className: "rating-table_body"}, countFragment)
					]),
					elem("table", {className: "rating-table sortable", id: "fame_table", innerHTML: "<thead class='rating-table_head'><tr><th class='rating-table_th'>Name</th><th class='rating-table_th sort-default' data-sort-method='number'>Position</th><th class='rating-table_th' data-sort-method='number'>Total Fame</th><th class='rating-table_th' data-sort-method='number'>Fame Next Turn</th><th class='rating-table_th' data-sort-method='number'>Battle Fame</th><th class='rating-table_th' data-sort-method='number'>Task Fame</th><th class='rating-table_th' data-sort-method='number'>Overall Fame</th><th class='rating-table_th' data-sort-method='number'>Battles</th><th class='rating-table_th' data-sort-method='number'>Victories</th><th class='rating-table_th' data-sort-method='number'>Winrate</th></tr></thead>"}, [
						elem("tbody", {className: "rating-table_body"}, fameFragment)
					])
				])
			]);
			layoutHolder.appendChild(fameDiv);

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
					return b - a;
				});
				new Tablesort(fameDiv.lastElementChild.lastElementChild);
			}
			else {
				window.alert("Error activating tablesort, please refresh - if this shit continues, poke Orrie");
			}
		}

		// helper functions
		// colouring
		function colStat(input, type, dec, sym) {
			let color = colArr.dft[0],
			output = input.toFixed(dec);
			if (sym) {
				output += sym;
			}
			if (input >= 1000) {
				output = input.toFixed(dec).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${loc[0]}`);
			}
			for (const c in colArr) {
				if (colArr.hasOwnProperty(c)) {
					if (input >= colArr[c][colArr.id[type]]) {
						color = colArr[c][0]; break;
					}
				}
			}
			return `<span style='color:${color}'>${output}</span>`;
		}

		// quick creation of element
		function elem(tag, attributes, children) {
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
		}

		// localStorage handler
		function locStorage(name, data, type, mode) {
			let storage;
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
		}
		// end helper functions

		// retrieval function
		function reqHnd(url, handler) {
			GM.xmlHttpRequest({
				method: "GET",
				url,
				headers: {
					"Accept": "application/json",
				},
				responseType: "json",
				onload({statusText, response}) {
					if (statusText == "OK") {
						handler(response.data);
						console.log(url, response);
					}
					else {
						console.error(response);
					}
				},
				onerror({response}) {
					console.error(response);
				}
			});
		}
	});
	pageLook.observe(document.body, {childList: true});
})(window);
