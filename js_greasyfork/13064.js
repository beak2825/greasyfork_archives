// ==UserScript==
// @name        WoTStatScript - Tournament Teams
// @version     0.9.20.0.1
// @description More info for World of Tanks tournament teams
// @author      Orrie
// @namespace   http://forum.worldoftanks.eu/index.php?/topic/263423-
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     http*://worldoftanks.eu/*/tournaments/*/team/*
// @include     http*://worldoftanks.com/*/tournaments/*/team/*
// @include     http*://worldoftanks.ru/*/tournaments/*/team/*
// @include     http*://worldoftanks.asia/*/tournaments/*/team/*
// @include     http*://worldoftanks.kr/*/tournaments/*/team/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     api.worldoftanks.eu
// @connect     api.worldoftanks.ru
// @connect     api.worldoftanks.com
// @connect     api.worldoftanks.asia
// @connect     api.worldoftanks.kr
// @connect     www.wnefficiency.net
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/13064/WoTStatScript%20-%20Tournament%20Teams.user.js
// @updateURL https://update.greasyfork.org/scripts/13064/WoTStatScript%20-%20Tournament%20Teams.meta.js
// ==/UserScript==
(function () {
	// global vars
	var d = document, c = d.cookie;

	// get server info and webpage
	var wg = {
		srv: d.location.host.match(/\.(eu|ru|com|asia|kr)/)[1]
	};

	// server, API and cluster settings
	var sc = {
		vers: ((GM_info) ? GM_info.script.version : ""),
		host: "https://greasyfork.org/en/scripts/13064-wotstatscript-tournament-teams",
		user: {
			wl: "https://forum.wotlabs.net/index.php?/user/1618-orrie/",
			wot: "https://worldoftanks.eu/community/accounts/505838943-Orrie/"
		},
		top: {
			eu: "https://forum.worldoftanks.eu/index.php?showtopic=263423",
			na: "https://forum.worldoftanks.com/index.php?showtopic=404652"
		},
		cred: { // translators
			cs: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500744969/'>Crabtr33</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/508323506/'>Ragnarocek</a></td></tr><tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/508904714/'>jViks</a></td></tr>" ,
			de: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/504873051/'>ArtiOpa</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501118529/'>Crakker</a></td></tr><tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501072645/'>multimill</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500373105/'>coolathlon</a></td></tr>",
			fr: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/506641783/'>SuperPommeDeTerre</a></td></tr>",
			pl: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501801562/'>KeluMocy</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/504412736/'>pokapokami</a></td></tr>",
			es: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/512759883/'>Frodo45127</a></td></tr>",
			tr: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500400806/'>Ufuko</a></td></tr>",
			ru: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.ru/community/accounts/291063/'>Bananium</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.ru/community/accounts/147060/'>Minamoto</a></td></tr>"
		},
		api: {
			wg_key: "a7595640a90bf2d19065f3f2683b171c"
		},
		wn: "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json",
		col: {
			//      col        wr  wgr   wn8
			sUni: [ "#5A3175", 65, 9900, 2900 ], // 99.99% super unicum
			uni:  [ "#83579D", 60, 9000, 2450 ], // 99.90% unicum
			gr8:  [ "#3972C6", 56, 8500, 2000 ], // 99.00% great
			vGud: [ "#4099BF", 54, 6500, 1600 ], // 95.00% very good
			good: [ "#4D7326", 52, 5000, 1200 ], // 82.00% good
			aAvg: [ "#849B24", 50, 4000,  900 ], // 63.00% above average
			avg:  [ "#CCB800", 48, 3000,  650 ], // 40.00% average
			bAvg: [ "#CC7A00", 47, 2000,  450 ], // 20.00% below average
			bas:  [ "#CD3333", 46, 1500,  300 ], //  6.00% basic
			beg:  [ "#930D0D",  0,    0,    0 ], //  0.00% beginner
			dft:  [ "#6B6B6B" ], // default
			id: { col: 0, wr: 1,  wgr: 2, wn8: 3 }  // type identifier
		},
		loc: c.match(/hllang=(\w+)/)[1],
		locSup: ["en", "ru", "cs", "de", "fr", "pl", "es", "tr"],
		date: Date.now(),
		debug: false
	};

	// script functions
	var sf = {
		tableFetch: function () {
			teamObj.cls = d.getElementsByClassName("tournament-table_team");
			for (var _t=0, _t_len = teamObj.cls.length; _t<_t_len; _t++) {
				if (teamObj.cls[_t]) {
					var id = teamObj.cls[_t].getAttribute('href').match(/\/(\d+)\-/)[1];
					if (!isNaN(id)) {
						teamObj.cls[_t].parentNode.parentNode.id = id;
						teamObj.ids.push(id);
						s.user[id] = {u:{},v:{frag:0,dmg:0,spot:0,def:0,win:0},wn8:""};
					}
				}
			}
			s.team = {wn8:0, win:0, tbBat:0, tbWin:0, mem: teamObj.ids.length};
			// request and retrieve statistics from API
			if (teamObj.ids.length > 0) {
				sc.api.i = "https://api.worldoftanks."+wg.srv+"/wot/account/info/?application_id="+sc.api.wg_key+"&account_id="+teamObj.ids.join(',');
				sc.api.v = "https://api.worldoftanks."+wg.srv+"/wot/account/tanks/?application_id="+sc.api.wg_key+"&account_id="+teamObj.ids.join(',');
				sf.request("infoData", sc.api.i, sf.apiInfoHnd);
			}
			else {
				console.error("No post IDs found or not logged in");
			}
		},
		apiInfoHnd: function (resp) { // processing information from player API
			var data = resp.data;
			for (var a in data) {
				if (data.hasOwnProperty(a)) {
					var pData = data[a];
					if (pData !== null) {
						// store stats
						var pDataStats = pData.statistics.all,
						pDataStatsTB = pData.statistics.team,
						userID = pData.account_id;
						s.user[userID].u = {
							name: pData.nickname,
							id: userID,
							cid: pData.clan_id,
							bat: pDataStats.battles,
							win: (pDataStats.wins/pDataStats.battles)*100,
							dmg: pDataStats.damage_dealt/pDataStats.battles,
							frag: pDataStats.frags/pDataStats.battles,
							spot: pDataStats.spotted/pDataStats.battles,
							def: pDataStats.dropped_capture_points/pDataStats.battles,
							tbBat: pDataStatsTB.battles,
							tbWin: (pDataStatsTB.wins/pDataStatsTB.battles)*100,
							wgr: pData.global_rating,
							lng: pData.client_language
						};
						s.team.win += (!isNaN(s.user[userID].u.win)) ? s.user[userID].u.win : 0;
						s.team.tbBat += (!isNaN(s.user[userID].u.tbBat)) ? s.user[userID].u.tbBat : 0;
						s.team.tbWin += (!isNaN(s.user[userID].u.tbWin)) ? s.user[userID].u.tbWin : 0;
					}
				}
			}
			sf.request("vehData", sc.api.v, sf.apiVehHnd);
		},
		apiVehHnd: function (resp) { // processing information from vehicle API and calculate WN8
			var data = resp.data;
			for (var p in data) {
				if (data.hasOwnProperty(p)) {
					var vData = data[p];
					if (vData !== null) {
						var rWin, rDmg, rFrag, rSpot, rDef, wn8 = 0, battles = 0;
						if (s.user[p].u.bat > 0) {
							for (var v in vData) {
								if (vData.hasOwnProperty(v)) {
									for (var _so=0, _so_len = wn.stat.length; _so<_so_len; _so++) {
										if (wn.stat[_so].IDNum == vData[v].tank_id) {
											var vehStat = wn.stat[_so],
											dataBattles = vData[v].statistics.battles;
											s.user[p].v.frag += vehStat.expFrag    * dataBattles;
											s.user[p].v.dmg  += vehStat.expDamage  * dataBattles;
											s.user[p].v.spot += vehStat.expSpot    * dataBattles;
											s.user[p].v.def  += vehStat.expDef     * dataBattles;
											s.user[p].v.win  += vehStat.expWinRate * dataBattles;
											battles += dataBattles;
											break;
										}
									}
								}
							}
							rWin  = Math.max(((s.user[p].u.win /(s.user[p].v.win /battles)-0.71)/(1-0.71)),0);
							rDmg  = Math.max(((s.user[p].u.dmg /(s.user[p].v.dmg /battles)-0.22)/(1-0.22)),0);
							rFrag = Math.max(Math.min(rDmg+0.2,((s.user[p].u.frag/(s.user[p].v.frag/battles)-0.12)/(1-0.12))),0);
							rSpot = Math.max(Math.min(rDmg+0.1,((s.user[p].u.spot/(s.user[p].v.spot/battles)-0.38)/(1-0.38))),0);
							rDef  = Math.max(Math.min(rDmg+0.1,((s.user[p].u.def /(s.user[p].v.def /battles)-0.10)/(1-0.10))),0);
							wn8 = 980*rDmg + 210*rDmg*rFrag + 155*rFrag*rSpot + 75*rDef*rFrag + 145*Math.min(1.8,rWin);
						}
						// store wn8 and add to clan total
						s.user[p].wn8 = sf.color(wn8,"wn8",0);
						s.team.wn8 += wn8;
					}
				}
			}
			// calculate average wn8 / winrate
			s.team.wn8 = s.team.wn8/s.team.mem;
			s.team.win = s.team.win/s.team.mem;
			s.team.tbBat = s.team.tbBat/s.team.mem;
			s.team.tbWin = s.team.tbWin/s.team.mem;
			sf.statInsert();
		},
		statInsert: function () { // insert stats and links to every post
			var teamWrpr = d.getElementById("team_management"),
			teamHead = d.getElementsByClassName("tournament-table_tr")[0];
			teamWrpr.insertBefore(sf.elem("div", "b-stat-total", "<span><span>WN8:</span>"+sf.color(s.team.wn8,"wn8",0)+"</span><span><span>WR:</span>"+sf.color(s.team.win,"wr",2,"%")+"</span><span><span>TB-WR:</span>"+sf.color(s.team.tbWin,"wr",2,"%")+"</span><span><span>TB-"+loc[5]+":</span>"+sf.color(s.team.tbBat,"bats",0)+"</span>"), teamWrpr.firstElementChild.nextSibling);
			teamHead.cells[0].parentNode.insertBefore(sf.elem("th", "tournament-table_th th-stats", "WN8"), teamHead.cells[0].nextSibling);
			teamHead.cells[1].parentNode.insertBefore(sf.elem("th", "tournament-table_th th-stats", "WR"), teamHead.cells[1].nextSibling);
			teamHead.cells[2].parentNode.insertBefore(sf.elem("th", "tournament-table_th th-stats", "TB-WR"), teamHead.cells[2].nextSibling);
			teamHead.cells[3].parentNode.insertBefore(sf.elem("th", "tournament-table_th th-stats", "TB-Battles"), teamHead.cells[3].nextSibling);
			for (var y in s.user) {
				if (s.user.hasOwnProperty(y)) {
					var userCheck = teamObj.ids.indexOf(y);
					if (userCheck >- 1) {
						var row = d.getElementById(y),
						infoFlag = sf.elem("img", "i-xvm-lang", "", "", "https://bytebucket.org/seriych/worldoftanksforumextendedstat.user.js/raw/tip/data/img/lang/"+s.user[y].u.lng+".png");
						infoFlag.title = s.user[y].u.lng.toUpperCase()+" Client";
						row.cells[0].appendChild(infoFlag);
						row.cells[0].parentNode.insertBefore(sf.elem("td", "tournament-table_td td-stats", "<span class='b-player-stat'>"+s.user[y].wn8+"</span>"), row.cells[0].nextSibling);
						row.cells[1].parentNode.insertBefore(sf.elem("td", "tournament-table_td td-stats", "<span class='b-player-stat'>"+sf.color((s.user[y].u.bat > 0) ? s.user[y].u.win : 0,"wr",2,"%")+"</span>"), row.cells[1].nextSibling);
						row.cells[2].parentNode.insertBefore(sf.elem("td", "tournament-table_td td-stats", "<span class='b-player-stat'>"+sf.color((s.user[y].u.tbBat > 0) ? s.user[y].u.tbWin : 0,"wr",2,"%")+"</span>"), row.cells[2].nextSibling);
						row.cells[3].parentNode.insertBefore(sf.elem("td", "tournament-table_td td-stats", "<span class='b-player-stat'>"+sf.color(s.user[y].u.tbBat,"bats",0)+"</span>"), row.cells[3].nextSibling);
						row.cells[5].innerHTML = "<span class='b-player-stat'>"+sf.color(s.user[y].u.wgr,"wgr",0)+"</span>";
					}
				}
			}
			// hide animated loading gear
			loadGif.classList.add("js-hidden");
			// remove dynamic table width
			var teamTable = d.getElementsByClassName("tournament-table")[0];
			teamTable.appendChild(teamTable.firstElementChild.cloneNode(true));
			teamTable.removeChild(teamTable.firstElementChild);
		},
		color: function (input, type, dec, sym) { // color formatting
			var color = sc.col.dft[0],
			output = input.toFixed(dec);
			if (sym) {
				output += sym;
			}
			if (input >= 1000) {
				output = input.toFixed(dec).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+loc[0]);
			}
			for (var c in sc.col) {
				if (sc.col.hasOwnProperty(c)) {
					if (input >= sc.col[c][sc.col.id[type]]) {
						color = sc.col[c][0]; break;
					}
				}
			}
			return "<font color='"+color+"'>"+output+"</font>";
		},
		elem: function (tag, name, html, type, src) { // element creation
			var element = d.createElement(tag);
			if (name) {element.className = name;}
			if (html) {
				if (/</.test(html)) {
					element.innerHTML = html;
				}
				else {
					element.textContent = html;
				}
			}
			if (type) {element.type = type;}
			if (src) {element.src = src;}
			return element;
		},
		settings: function (name, text) { // script menu handler
			var setItem = sf.elem("li", "b-settingItem"),
			setDiv = sf.elem("div", "b-settingParent b-"+name, "<a>"+text+"</a>");
			switch(name) {
				case ("wnRefresh"):
					setDiv.addEventListener('click', function() {localStorage.removeItem("wnExpValues"); location.reload();}, false);
				break;
				default: break;
			}
			setItem.appendChild(setDiv);
			return setItem;
		},
		links: function (parent, links, type) { // statistic links handler
			var linksFragment = d.createDocumentFragment();
			for (var _l=0, _l_len = links.length; _l<_l_len; ++_l) {
				switch(type) {
					case ("table"):
						var link = sf.elem("tr");
						for (var _lr=0, _lr_len = links[_l].length; _lr<_lr_len; ++_lr) {
							link.appendChild((links[_l][_lr][0] && links[_l][_lr][1]) ? sf.elem("td", "", links[_l][_lr][1]) : sf.elem("td", "", links[_l][_lr][0]));
						}
						linksFragment.appendChild(link);
					break;
					case ("list"):
						if (links[_l] instanceof HTMLElement) {
							linksFragment.appendChild(links[_l]);
						}
						else {
							linksFragment.appendChild((links[_l][0] && links[_l][1]) ? sf.elem("li", "", links[_l][1]) : sf.elem("li", "statname", links[_l][0]));
						}
					break;
					default: break;
				}
			}
			parent.appendChild(linksFragment);
		},
		storage: function (name, data, type, mode) { // localstorage handler
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
		wn: function (resp) { // wnefficiency handler
			sf.storage("wnExpValues", resp, "set", "string");
			sf.storage("wnExpDate", sc.date, "set");
			sf.storage("wnExpVers", sc.vers, "set");
			location.reload();
		},
		request: function (name, url, handler) { // request handler
			GM.xmlHttpRequest({
				method: "GET",
				url: url,
				headers: {
					"Accept": "application/json"
				},
				onload: function(resp) {
					var data = JSON.parse(resp.responseText);
					if (resp.status == 200) {
						if (sc.debug) {console.info(name, data);}
						handler(data);
					}
					else {
						console.error("Error accessing", url, resp);
					}
				},
				onerror: function(resp) {
					console.error("Error accessing", url, resp);
				}
			});
		}
	};

	// style contents
	var style = sf.elem("style", "wotstatscript", "", "text/css"),
	styleText = [
		// settings menu rules
		"#common_menu .menu-settings {color: #7C7E80; display: inline-block;}",
		"#common_menu .menu-settings .cm-user-menu-link {margin: 0 10px 0 0;}",
		"#common_menu .menu-settings .cm-user-menu-link_cutted-text {max-width: unset;}",
		"#common_menu .menu-settings .cm-user-menu {min-width: 200px; padding: 15px;}",
		"#common_menu .menu-settings .cm-parent-link:hover {cursor: pointer;}",
		"#common_menu .menu-settings .b-settingItem {margin: 6px 0px; text-align: center;}",
		"#common_menu .menu-settings label {display: table; line-height: normal; cursor: pointer; margin: 0 auto;}",
		"#common_menu .menu-settings .l-box {display: none;}",
		"#common_menu .menu-settings .b-checkbox {height: 16px; width: 16px; float: left; margin-right: 5px;}",
		"#common_menu .menu-settings .b-checkbox span {height: 16px; width: 16px;}",
		"#common_menu .menu-settings .b-combobox-label__checked {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox {background-position: 0px -34px; box-shadow: 0px 0px 10px 1px rgba(191, 166, 35, 0.15), 0px 0px 3px 1px rgba(191, 166, 35, 0.25);}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox.b-checkbox__checked {background-position: 0px -68px;}",
		"#common_menu .menu-settings textarea.l-textarea {background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2px; color: #FFFFFF; line-height: normal; padding: 5px; min-height: 50px; margin: 5px 0 5px 0; min-width: 175px;}",
		"#common_menu .menu-settings textarea::-webkit-input-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings textarea::-moz-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings .b-settingParent {line-height: 26px;}",
		"#common_menu .menu-settings .b-settingParent a {cursor: pointer; color: #B1B2B3; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);}",
		"#common_menu .menu-settings .b-settingParent a:hover {color: #FFFFFF; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.75); text-decoration: underline;}",
		"#common_menu .menu-settings .settingCredits {margin: 2px 0px;}",
		"#common_menu .menu-settings .settingCredits h1 {color: #B1B2B3;}",
		"#common_menu .menu-settings .settingCredits table {font-size: 12px; margin: 0 auto; width: unset;}",
		"#common_menu .menu-settings .settingCredits table td {padding: 0 5px;}",
		"#common_menu .menu-settings .settingCredits p {font-size: 12px; padding: 2px 0;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow {color: #F25322; line-height: 14px; padding-right: 9px;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow:hover {color: #FF7432;}",
		"#common_menu .menu-settings .settingCredits.settingSeperator {border-top: 1px dashed #212123; margin-top: 6px; padding-top: 12px;}",
		"#common_menu .menu-settings .settingCredits.settingLinks a {margin: 0 5px;}",
		// processing loader rules
		".processing {width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 500; background: url(https://eu.wargaming.net/clans/static/2.2.9/images/processing/processing_overlay-pattern.png);}",
		".processing_loader {width: 56px; height: 54px; position: absolute; top: 50%; left: 50%; margin-top: -27px; margin-left: -28px;}",
		// team main rules
		".tournament-heading {display: inline-block;}",
		".b-stat-total {display: inline-block; position: absolute; left: 35%;}",
		".b-stat-total span {font-size: 20px; margin: 0 10px;}",
		".b-stat-total span span {color: #E9E2Bf; font-weight: 400; margin: 0 5px;}",
		// member table rules
		".tournament-table th:first-child .tournament-table_ico-holder, .tournament-table th:first-child .tournament-table_heading-text {float: left;}",
		".b-stat-head {float: right;}",
		".b-stat-head span {font-size: 12px;}",
		".b-stat-head span:first-of-type {margin: 0 20px;}",
		".b-stat-head span:last-of-type {margin: 0 34px;}",
		".tournament-table_th.th-stats {width: 100px; text-align: center;}",
		".tournament-table_td {padding: 8px 2%;}",
		".tournament-table_td.td-stats {text-align: right;}",
		".tournament-table_td .i-xvm-lang {margin-left: 10px; vertical-align: middle;}",
		".tournament-table_td .b-player-stat {font-size: 18px; }",
		// hide elements
		"#team_management > div:last-of-type {display: none;}"
	];
	style.textContent = styleText.join("");
	d.head.appendChild(style);
	// end style

	// add animated loading icon for progress indication
	var pageWrpr = d.getElementsByClassName('page-wrapper')[0],
	loadGif = sf.elem("div", "processing", "<div class='processing_loader'><img src='https://eu.wargaming.net/clans/static/2.2.8/images/processing/loader.gif' alt='Processing...'></div>");
	pageWrpr.appendChild(loadGif);

	// fetch wnefficiency values - check if array exists in localStorage, otherwise fetch and reload page
	var wn = {
		stat: sf.storage("wnExpValues", "", "get", "parse"),
		date: sf.storage("wnExpDate", "", "get", "parse")+12096e5 >= sc.date, // true if timestamp is less than 2 weeks old, refresh list if false.
		vers: [sf.storage("wnExpVers", "", "get")]
	};
	if (wn.vers[0]==sc.vers && wn.stat && wn.date) {
		wn.vers.push(wn.stat.header.version);
		wn.stat = wn.stat.data;
	}
	else {
		sf.request("wnData", sc.wn, sf.wn);
	}

	// localization
	var loc = [
		// thousands separator
		{en: ",", ru: " ", cs: " ", de: ".", fr: " ", pl: " ", es:".", tr: "."},
		{en: "Script Menu", ru: "Меню скрипта", cs: "Nastavení scriptu", de: "Script-Menü", fr: "Menu du script", pl: "Script Menu", es:"Script Menu", tr: "Script Menu"},
		{en: "Refresh WN8 Table", ru: "Обновить таблицу WN8", cs: "Obnov WN8 Tabulku", de: "WN8-Tabelle neu laden", fr: "Rafraîchir la table WN8", pl: "Refresh WN8 Table", es: "Refresh WN8 Table", tr: "Refresh WN8 Table"},
		{en: "Script Author:", ru: "Автор скрипта:", cs: "Autor skriptu:", de: "Script-Autor:", fr: "Auteur du script :", pl: "Script Author:", es:"Script Author:", tr: "Script Author:"},
		{en: "Contributors", ru: "Contributors", cs: "Kontributoři", de: "Contributors", fr: "Contributeurs", pl: "Contributors", es:"Contributors", tr: "Contributors"},
		{en: "Battles", ru: "Бои", cs: "Bitvy", de: "Gefechte", fr: "Batailles", pl: "Bitwy", es: "Batallas", tr: "Savaşlar"},
	];
	// process localization
	if (sc.locSup.indexOf(sc.loc) == -1) {
		sc.loc = "en";
	}
	for (var _l=0, l_len = loc.length; _l<l_len; _l++) {
			loc[_l] = loc[_l][sc.loc];
	}

	// add script info  if user menu exists, else wait
	var userSet_div = sf.elem("div", "menu-settings menu-top_item", "<a class='cm-user-menu-link' href='#' onClick='return false;'><span class='cm-user-menu-link_cutted-text'>"+loc[1]+"</span><span class='cm-arrow'></span></span>"),
	userSet_list = sf.elem("ul", "cm-user-menu"),
	userSet_list_items = [
		sf.settings("wnRefresh", loc[2]+" [v"+wn.vers[1]+"]"),
		sf.elem("li", "b-settingItem settingCredits settingSeperator", "<p>Version: "+sc.vers+"</p>"),
		sf.elem("li", "b-settingItem settingCredits", "<p>"+loc[3]+" <a class='b-orange-arrow' href='"+sc.user.wot+"'>Orrie</a></p>"+((sc.cred[sc.loc]) ? "<p>"+loc[4]+" ("+sc.loc.toUpperCase()+"):</p><table>"+sc.cred[sc.loc]+"</table>" : "")),
		sf.elem("li", "b-settingItem settingCredits settingLinks", "<p><a class='b-orange-arrow' href='"+sc.host+"'>Greasy Fork</a><a class='b-orange-arrow' href='"+((wg.srv == "na") ? sc.top.na : sc.top.eu)+"'>Support Thread</a></p>")
	],
	navMenu = d.getElementById('common_menu'),
	navUser = navMenu.getElementsByClassName('cm-menu__user')[0],
	navLook = new MutationObserver(function() {
		navUser = navMenu.getElementsByClassName('cm-menu__user')[0];
		navUser.appendChild(userSet_div);
		navLook.disconnect();
	});
	sf.links(userSet_list, userSet_list_items, "list");
	userSet_div.firstElementChild.addEventListener('click', function() {this.classList.toggle('cm-user-menu-link__opened'); this.nextSibling.classList.toggle('cm-user-menu__opened');}, false);
	userSet_div.appendChild(userSet_list);
	if (navUser) {
		navUser.appendChild(userSet_div);
	}
	navLook.observe(navMenu, {childList: true});

	// create global post variable
	var teamObj = {
		cls: d.getElementsByClassName("tournament-table_team"),
		ids: []
	},
	s = {clan:{},user:{}};

	// fetch userids and store all posts into one obj for later use
	var teamTable = d.getElementsByClassName("tournament-table")[0].firstElementChild,
	teamCheck = d.getElementsByClassName("tournament-table_team")[0],
	teamLook = new MutationObserver(function(m) {
		teamCheck = d.getElementsByClassName("tournament-table_team")[0];
		if (teamCheck && teamCheck.getAttribute('href') !== "#") {
			sf.tableFetch();
			teamLook.disconnect();
		}
	});
	if (teamCheck && teamCheck.getAttribute('href') !== "#") {
		sf.tableFetch();
	}
	else {
		teamLook.observe(teamTable, {childList: true});
	}
}(window));
