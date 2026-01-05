// ==UserScript==
// @name        WoTStatScript - Clanpage
// @version     0.9.20.0.2
// @description More info for World of Tanks clan page.
// @author      Orrie
// @namespace   http://forum.worldoftanks.eu/index.php?/topic/263423-
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     http*://*.wargaming.net/clans/*/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     api.worldoftanks.eu
// @connect     api.worldoftanks.ru
// @connect     api.worldoftanks.com
// @connect     api.worldoftanks.asia
// @connect     api.worldoftanks.kr
// @connect     eu.wargaming.net
// @connect     ru.wargaming.net
// @connect     na.wargaming.net
// @connect     asia.wargaming.net
// @connect     kr.wargaming.net
// @connect     www.wnefficiency.net
// @connect     puu.sh
// @require     https://greasyfork.org/scripts/18946-tablesort/code/Tablesort.js?version=120660
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/12137/WoTStatScript%20-%20Clanpage.user.js
// @updateURL https://update.greasyfork.org/scripts/12137/WoTStatScript%20-%20Clanpage.meta.js
// ==/UserScript==
(function() {
	// global vars
	var d = document, c = d.cookie;

	// new page handler making sure it has loaded
	var pageLook = new MutationObserver(function() {
		pageLook.disconnect();
		// get server info and webpage
		var wg = {host:d.location.host, href:d.location.href, clan:{}};
		wg.srv = wg.host.match(/(eu|ru|na|asia|kr)/)[0];
		wg.m = (/players/i.test(wg.href) || /players\/wot/i.test(wg.href)) && !/wowp/i.test(wg.href);
		wg.sb = /clan_battles/i.test(wg.href);

		// getting claninfo
		wg.clan.id = wg.href.match(/\/(\d+)/)[1];
		wg.p = /clan \|/i.test(d.title) && !/wowp/i.test(wg.href);

		// script variables
		var sc = {
			vers: ((GM_info) ? GM_info.script.version : ""),
			host: "http://greasyfork.org/en/scripts/12137-wotstatscript-clans",
			debug: true,
			user: {
				wl: "http://forum.wotlabs.net/index.php?/user/1618-orrie/",
				wot: "http://worldoftanks.eu/community/accounts/505838943-Orrie/"
			},
			top: {
				eu: "http://forum.worldoftanks.eu/index.php?showtopic=263423",
				na: "http://forum.worldoftanks.com/index.php?showtopic=404652"
			},
			cred: { // translators
				cs: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500744969/'>Crabtr33</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/508323506/'>Ragnarocek</a></td></tr><tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/508904714/'>jViks</a></td></tr>" ,
				de: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/504873051/'>ArtiOpa</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501118529/'>Crakker</a></td></tr><tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501072645/'>multimill</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500373105/'>coolathlon</a></td></tr>",
				fr: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/506641783/'>SuperPommeDeTerre</a></td></tr>",
				pl: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/501801562/'>KeluMocy</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/504412736/'>pokapokami</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500414963/'>zdzich</a></td></tr>",
				es: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/512759883/'>Frodo45127</a></td></tr>",
				tr: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.eu/community/accounts/500400806/'>Ufuko</a></td></tr>",
				ru: "<tr><td><a class='b-orange-arrow' href='http://worldoftanks.ru/community/accounts/291063/'>Bananium</a></td><td><a class='b-orange-arrow' href='http://worldoftanks.ru/community/accounts/14179676/'>Minamoto_ru</a></td></tr>"
			},
			api: {
				wg_key: "a7595640a90bf2d19065f3f2683b171c"
			},
			srv: {
				wl: false,   // wotlabs
				nm: false,   // noobmeter
				vb: false,   // vbaddict
				ws: false,   // wotstats
				cs: false,   // wotcs
				wlf: false,  // wot-life
				ct: false,   // clan tools
				kttc: false, // kttc
				wots: false, // wots
				ch: false,   // clan history
				wr: false,   // wotreplays
				we: false    // wot event stats
			},
			wn: "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json",
			locSet: {
				cur: (c.match(/django_language=(\w+)/)) ? c.match(/django_language=(\w+)/)[1] : "en",
				sup: ["en", "ru", "cs", "de", "fr", "pl", "es", "tr"],
				miss: 0
			},
			loc: [
				{ i:0, en: ",", ru: " ", cs: " ", de: ".", fr: " ", pl: " ", es:" ", tr: "."}, // thousands separator
				{ i:1, en: "Clan Stats", ru: "Статистика клана", cs: "Stat. klanu", de: "Clanstatistiken", fr: "Statistiques du clan", pl: "Statystyki klanu", es: "Estadísticas del clan", tr: "Klan İstatistikleri"},
				{ i:2, en: "Replays:", ru: "Реплеи:", cs: "Záznamy:", de: "Replays", fr: "Replays:", pl: "Powtórki:", es: "Repeticiones:", tr: "Replayler"},
				{ i:3, en: "Script Menu", ru: "Меню скрипта", cs: "Nastavení scriptu", de: "Script-Menü", fr: "Menu du script", pl: "Opcje skryptu", es:"Script Menu", tr: "Script Menu"},
				{ i:4, en: "Load Stats Automatically", ru: "Load Stats Automatically", cs: "Nahrát stat. automaticky", de: "Load Stats Automatically", fr: "Charger les statistiques automatiquement", pl: "Pobierz statystyki automatycznie", es:"Load Stats Automatically", tr: "Load Stats Automatically"},
				{ i:5, en: "Use Whitelist", ru: "Use Whitelist", cs: "Použi whitelist", de: "Use Whitelist", fr: "Utiliser la liste blanche", pl: "Użyj białej listy", es:"Use Whitelist", tr: "Use Whitelist"},
				{ i:6, en: "Refresh WN8 Table", ru: "Обновить таблицу WN8", cs: "Obnov WN8 Tabulku", de: "WN8-Tabelle neu laden", fr: "Rafraîchir la table WN8", pl: "Odświerz tablicę WN8", es: "Refresh WN8 Table", tr: "Refresh WN8 Table"},
				{ i:7, en: "Clean Script Database", ru: "Clean Script Database", cs: "Vyčisti db scriptu", de: "Clean Script Database", fr: "Nettoyer la base de données du script", pl: "Wyczyść bazę skryptu", es: "Clean Script Database", tr: "Clean Script Database"},
				{ i:8, en: "Average Winrate", ru: "Average Winrate", cs: "Průměrný winrate", de: "Average Winrate", fr: "Ratio de victoire moyen", pl: "Średni procent zwycięstw", es:"Average Winrate", tr: "Average Winrate"},
				{ i:9, en: "Average WN8", ru: "Average WN8", cs: "Průměrné WN8", de: "Average WN8", fr: "Average WN8", pl: "WN8 moyen", es:"Average WN8", tr: "Average WN8"},
				{ i:10, en: "Overall Average Winrate", ru: "Overall Average Winrate", cs: "Průměrný winrate", de: "Overall Average Winrate", fr: "Overall Average Winrate", pl: "Całkowity średni procent zwycięstw", es:"Overall Average Winrate", tr: "Overall Average Winrate"},
				{ i:11, en: "Overall Average WN8", ru: "Overall Average WN8", cs: "Overall Average WN8", de: "Overall Average WN8", fr: "Overall Average WN8", pl: "Średnia wartość WN8", es:"Overall Average WN8", tr: "Overall Average WN8"},
				{ i:12, en: "Fetch WN8 for Clan", ru: "Fetch WN8 for Clan", cs: "Obnov WN8 pre klan", de: "Fetch WN8 for Clan", fr: "Calculer le WN8 pour le clan", pl: "Pobierz wartości WN8 dla klanu", es:"Fetch WN8 for Clan", tr: "Fetch WN8 for Clan"},
				{ i:13, en: "Fetching WN8 for Clan!", ru: "Fetching WN8 for Clan!", cs: "Obnovuju WN8 pro klan!", de: "Fetching WN8 for Clan!", fr: "Walcul du WN8 pour le clan !", pl: "Pobieranie wartości WN8 dla klanu", es:"Fetching WN8 for Clan!", tr: "Fetching WN8 for Clan!"},
				{ i:14, en: "WN8 Fetched for Clan!", ru: "WN8 Fetched for Clan!", cs: "WN8 obnoveno pro klan!", de: "WN8 Fetched for Clan!", fr: "WN8 calculé pour le clan !", pl: "Pobrano wartości WN8 dla klanu", es:"WN8 Fetched for Clan!", tr: "WN8 Fetched for Clan!"},
				{ i:15, en: "Not Found", ru: "Not Found", cs: "Nenalezeno", de: "Not Found", fr: "Non trouvé", pl: "Nie znaleziono", es:"Not Found", tr: "Not Found"},
				{ i:16, en: "New Members:", ru: "New Members:", cs: "Noví členové:", de: "New Members:", fr: "Nouveaux membres :", pl: "Nowi członkowie:", es:"New Members:", tr: "New Members:"},
				{ i:17, en: "Banned Members:", ru: "Banned Members:", cs: "Noví členové:", de: "Banned Members:", fr: "Membres bannis:", pl: "Zbanowani członkowie:", es:"Banned Members:", tr: "Banned Members:"},
				{ i:18, en: "Currently Unavailable", ru: "Currently Unavailable", cs: "Currently Unavailable", de: "Currently Unavailable", fr: "Indisponible actuellement", pl: "Obecnie niedostępne", es:"Currently Unavailable", tr: "Currently Unavailable"},
				{ i:19, en: "Ban ended, but no login", ru: "Ban ended, but no login", cs: "Ban ended, but no login", de: "Ban ended, but no login", fr: "Ban terminé, mais aucune connexion", pl: "Ban się skończył, ale brak zalogowania", es:"Ban ended, but no login", tr: "Ban ended, but no login"},
				{ i:20, en: "Script Author:", ru: "Автор скрипта:", cs: "Autor skriptu:", de: "Script-Autor:", fr: "Auteur du script:", pl: "Autor skryptu:", es:"Script Author:", tr: "Script Author:"},
				{ i:21, en: "Contributors", ru: "Contributors", cs: "Kontributoři", de: "Contributors", fr: "Contributeurs", pl: "Współtwórcy", es:"Contributors", tr: "Contributors"},
				{ i:22, en: "Battle Schedule", ru: "Battle Schedule", cs: "Plánované bitvy", de: "Battle Schedule", fr: "Battle Schedule", pl: "Zaplanowane bitwy", es:"Battle Schedule", tr: "Battle Schedule"},
				{ i:23, en: "Clan Wars Countdown:", ru: "Clan Wars Countdown:", cs: "Odpočet CW:", de: "Clan Wars Countdown:", fr: "Clan Wars Countdown:", pl: "Bitwy klanów odliczanie:", es:"Clan Wars Countdown:", tr: "Clan Wars Countdown:"},
				{ i:24, en: "Total Battles:", ru: "Total Battles:", cs: "Bitev celkem:", de: "Total Battles:", fr: "Total Battles:", pl: "Wszystkich bitew:", es:"Total Battles:", tr: "Total Battles:"},
				{ i:25, en: "Potential Gold Income:", ru: "Potential Gold Income:", cs: "Předpokl. příjem zlata:", de: "Potential Gold Income:", fr: "Potential Gold Income:", pl: "Potencjalny dochód złota:", es:"Potential Gold Income:", tr: "Potential Gold Income:"},
				{ i:26, en: "Province", ru: "Провинция", cs: "Province", de: "Province", fr: "Province", pl: "Prowincja", es:"Province", tr: "Province"},
				{ i:27, en: "Map", ru: "Игровая карта", cs: "Mapa", de: "Map", fr: "Map", pl: "Mapa", es:"Map", tr: "Map"},
				{ i:28, en: "Timezone", ru: "Timezone", cs: "Časová zóna", de: "Timezone", fr: "Timezone", pl: "Strefa czasowa", es:"Timezone", tr: "Timezone"},
				{ i:29, en: "Fame", ru: "Fame", cs: "Sláva", de: "Fame", fr: "Fame", pl: "Punkty sławy", es:"Fame", tr: "Fame"},
				{ i:30, en: "Gold", ru: "Gold", cs: "Zlato", de: "Gold", fr: "Gold", pl: "Złoto", es:"Gold", tr: "Gold"},
				{ i:31, en: "Owner", ru: "Owner", cs: "Vlastník", de: "Owner", fr: "Owner", pl: "Właściciel", es:"Owner", tr: "Owner"},
				{ i:32, en: "ELO", ru: "ELO", cs: "ELO", de: "ELO", fr: "ELO", pl: "Puntky ELO", es:"ELO", tr: "ELO"},
				{ i:33, en: "Type", ru: "Type", cs: "Typ", de: "Type", fr: "Type", pl: "Typ", es:"Type", tr: "Type"},
				{ i:34, en: "Status", ru: "Status", cs: "Stav", de: "Status", fr: "Status", pl: "Status", es:"Status", tr: "Status", f:1},
				{ i:35, en: "Attackers", ru: "Attackers", cs: "Útočnící", de: "Attackers", fr: "Attackers", pl: "Atakujący", es:"Attackers", tr: "Attackers"},
				{ i:36, en: "Turns", ru: "Turns", cs: "Tahy", de: "Turns", fr: "Turns", pl: "Tury", es:"Turns", tr: "Turns"},
				{ i:37, en: "Last Updated:", ru: "Last Updated:", cs: "Posl. Aktualizace:", de: "Last Updated:", fr: "Last Updated:", pl: "Ostatnia aktualizacja:", es:"Last Updated:", tr: "Last Updated:"},
				{ i:38, en: "Updating...", ru: "Updating...", cs: "Aktualizuji...", de: "Updating...", fr: "Updating...", pl: "Aktualizuję...", es:"Updating...", tr: "Updating..."},
				{ i:39, en: "See you next time.", ru: "See you next time.", cs: "Vidíme se příště.", de: "See you next time.", fr: "See you next time.", pl: "Do zobaczenia następnym razem.", es:"See you next time.", tr: "See you next time."},
				{ i:40, en: "Not Started", ru: "Not Started", cs: "Neodstartováno", de: "Not Started", fr: "Not Started", pl: "Nie zaczeło się", es:"Not Started", tr: "Not Started"},
				{ i:41, en: "Ongoing", ru: "Ongoing", cs: "Nadcházející", de: "Ongoing", fr: "Ongoing", pl: "Nadchodzące", es:"Ongoing", tr: "Ongoing"},
				{ i:42, en: "Planned", ru: "Planned", cs: "Plánované", de: "Planned", fr: "Planned", pl: "Planowane", es:"Planned", tr: "Planned"},
				{ i:43, en: "Defense", ru: "Defense", cs: "Obrana", de: "Defense", fr: "Defense", pl: "Obrona", es:"Defense", tr: "Defense"},
				{ i:44, en: "Owner", ru: "Owner", cs: "Vlastník", de: "Owner", fr: "Owner", pl: "Właściciel", es:"Owner", tr: "Owner"},
				{ i:45, en: "Attack", ru: "Attack", cs: "Útok", de: "Attack", fr: "Attack", pl: "Atak", es:"Attack", tr: "Attack"},
				{ i:46, en: "Free Round", ru: "Free Round", cs: "Volný los", de: "Free Round", fr: "Free Round", pl: "Wolna runda", es:"Free Round", tr: "Free Round"},
				{ i:47, en: "No Owner", ru: "No Owner", cs: "Bez vlastníka", de: "No Owner", fr: "No Owner", pl: "Brak właściciela", es:"No Owner", tr: "No Owner"},
				{ i:48, en: "No Attacks", ru: "No Attacks", cs: "Žádný útok", de: "No Attacks", fr: "No Attacks", pl: "Brak ataków", es:"No Attacks", tr: "No Attacks"},
				{ i:49, en: "No Battles", ru: "No Battles", cs: "Žádné bitvy", de: "No Battles", fr: "No Battles", pl: "Brak bitew", es:"No Battles", tr: "No Battles"},
				{ i:50, en: "No Division", ru: "No Division", cs: "Žádné divize", de: "No Division", fr: "No Division", pl: "Brak dywizji", es:"No Division", tr: "No Division"},
				{ i:51, en: "Division Data not Available!", ru: "Division Data not Available!", cs: "Data o divizích jsou nedostupná!", de: "Division Data not Available!", fr: "Division Data not Available!", pl: "Brak danych dywizji!", es:"Division Data not Available!", tr: "Division Data not Available!"},
				{ i:52, en: "Clan ID Error", ru: "Clan ID Error", cs: "Chyba Clan ID", de: "Clan ID Error", fr: "Clan ID Error", pl: "Błąd klanowego ID", es:"Clan ID Error", tr: "Clan ID Error"},
				{ i:53, en: "No Event Campaign", ru: "No Event Campaign", cs: "Žádná kampaň", de: "No Event Campaign", fr: "No Event Campaign", pl: "Brak wydarzenia kampanii", es:"No Event Campaign", tr: "No Event Campaign"},
				{ i:54, en: "No Planned Battles", ru: "No Planned Battles", cs: "Žádné plánovaní bitvy", de: "No Planned Battles", fr: "No Planned Battles", pl: "Brak zaplanowanych bitew", es:"No Planned Battles", tr: "No Planned Battles"},
				{ i:55, en: "Hours", ru: "Hours", cs: "Hodiny", de: "Hours", fr: "Hours", pl: "Godziny", es:"Hours", tr: "Hours"},
				{ i:56, en: "Mins", ru: "Mins", cs: "Minunty", de: "Mins", fr: "Mins", pl: "Minuty", es:"Mins", tr: "Mins"},
				{ i:57, en: "Secs", ru: "Secs", cs: "Sekundy", de: "Secs", fr: "Secs", pl: "Sekundy", es:"Secs", tr: "Secs"},
				{ i:58, en: "Event Only Schedule", ru: "Event Only Schedule", cs: "Jen plánované události", de: "Event Only Schedule", fr: "Event Only Schedule", pl: "Bitwy tylko z wydarzenia", es:"Event Only Schedule", tr: "Event Only Schedule"},
				{ i:59, en: "Currently Running", ru: "Currently Running", cs: "Právě běží", de: "Currently Running", fr: "Currently Running", pl: "Obecnie odbywające się", es:"Currently Running", tr: "Currently Running"},
				{ i:60, en: "Concurrent Battles:", ru: "Concurrent Battles:", cs: "Kryjící se bitvy:", de: "Concurrent Battles:", fr: "Concurrent Battles:", pl: "Równoległe bitwy:", es:"Concurrent Battles:", tr: "Concurrent Battles:"},
				{ i:61, en: "Next Opponent", ru: "Next Opponent", cs: "Další soupeř", de: "Next Opponent", fr: "Next Opponent", pl: "Następny przeciwnik", es:"Next Opponent", tr: "Next Opponent"},
				{ i:62, en: "No Gold Revenue in Event!", ru: "No Gold Revenue in Event!", cs: "Žádná odměna ve zlatě!", de: "No Gold Revenue in Event!", fr: "No Gold Revenue in Event!", pl: "Brak dochodu w złocie w czasie wydarzenia", es:"No Gold Revenue in Event!", tr: "No Gold Revenue in Event!"},
				{ i:63, en: "Fame & Adj. Enclaves", ru: "Fame & Adj. Enclaves", cs: "Sláva & Enklávy", de: "Fame & Adj. Enclaves", fr: "Fame & Adj. Enclaves", pl: "Punkty sławy i enklawy", es:"Fame & Adj. Enclaves", tr: "Fame & Adj. Enclaves"},
				{ i:64, en: "Tournament Battle", ru: "Tournament Battle", cs: "Turnajová bitva", de: "Tournament Battle", fr: "Tournament Battle", pl: "Tournament Battle", es:"Tournament Battle", tr: "Tournament Battle"},
				{ i:65, en: "No Tournament Battle", ru: "No Tournament Battle", cs: "Žádná turnajová bitva", de: "No Tournament Battle", fr: "No Tournament Battle", pl: "No Tournament Battle", es:"No Tournament Battle", tr: "No Tournament Battle"},
				{ i:66, en: "Battle with Owner", ru: "Battle with Owner", cs: "Bitva s vlastníkem", de: "Battle with Owner", fr: "Battle with Owner", pl: "Battle with Owner", es:"Battle with Owner", tr: "Battle with Owner"},
				{ i:67, en: "No Battle with Owner", ru: "No Battle with Owner", cs: "Žádná bitva s vlastníkem", de: "No Battle with Owner", fr: "No Battle with Owner", pl: "No Battle with Owner", es:"No Battle with Owner", tr: "No Battle with Owner"},
				{ i:68, en: "15 Min After Normal Times", ru: "15 Min After Normal Times", cs: "15 po normálním čase", de: "15 Min After Normal Times", fr: "15 Min After Normal Times", pl: "15 Min After Normal Times", es:"15 Min After Normal Times", tr: "15 Min After Normal Times"},
				{ i:69, en: "Division Underway", ru: "Division Underway", cs: "Obsazená divize", de: "Division Underway", fr: "Division Underway", pl: "Division Underway", es:"Division Underway", tr: "Division Underway"},
				{ i:70, en: "Recon Module", ru: "Recon Module", cs: "Modul průzkumu", de: "Recon Module", fr: "Recon Module", pl: "Recon Module", es:"Recon Module", tr: "Recon Module"}
				// {en: "", ru: "", cs: "", de: "", fr: "", pl: "", es:"", tr: ""}
			],
			date: {
				raw: new Date(),
				now: Date.now(),
				format: {ru: "ru-RU", eu: "en-GB", na: "en-US", asia: "en-AU", kr: "ko-KR"}
			},
			col: { // colour scale array
				//      col        wr  bat    sr  hr  dmg  wgr   wn8   wn7   eff   nm
				sUni: [ "#5A3175", 65, 30000, 50, 80, 300, 9900, 2900, 2050, 2050, 2000 ], // 99.99% super unicum
				uni:  [ "#83579D", 60, 25000, 46, 75, 270, 9000, 2450, 1850, 1800, 1950 ], // 99.90% unicum
				gr8:  [ "#3972C6", 56, 21000, 42, 70, 240, 8500, 2000, 1550, 1500, 1750 ], // 99.00% great
				vGud: [ "#4099BF", 54, 17000, 38, 65, 210, 6500, 1600, 1350             ], // 95.00% very good
				good: [ "#4D7326", 52, 13000, 34, 60, 180, 5000, 1200, 1100, 1200, 1450 ], // 82.00% good
				aAvg: [ "#849B24", 50, 10000, 30, 55, 150, 4000,  900                   ], // 63.00% above average
				avg:  [ "#CCB800", 48,  7000, 25, 50, 120, 3000,  650,  900,  900, 1250 ], // 40.00% average
				bAvg: [ "#CC7A00", 47,  3000, 20, 45,  90, 2000,  450,  700,  600, 1150 ], // 20.00% below average
				bas:  [ "#CD3333", 46,  1000, 15, 40,  60, 1500,  300,  500             ], //  6.00% basic
				beg:  [ "#930D0D",  0,     0,  0,  0,   0,    0,    0,    0,    0,    0 ], //  0.00% beginner
				dft:  [ "#6B6B6B" ], // default
				id: { "col": 0, "wr": 1, "bat": 2, "sr": 3, "hr": 4, "dmg": 5, "wgr": 6, "wn8": 7, "wn7": 8, "eff": 9, "nm": 10 }  // type identifier
			},
			web: {
				gecko: typeof InstallTrigger !== 'undefined',
				opera: !!window.opera || /opera|opr/i.test(navigator.userAgent),
				chrome: !!window.chrome && !!window.chrome.webstore,
				safari: /constructor/i.test(window.HTMLElement)
			}
		},
		// battle scheduler variables
		bs = {
			cw: {
				status: false,
				event: false,
				gold: true,
				fame: 400,
				tier: "Ɵ",
				bats: "Ɵ",
				elo: "Ɵ",
				current: 0
			},
			dyn: {
				conc: [],
				plan: 0,
				check: 0,
				gold: 0
			},
			clan: {
				id: wg.clan.id,
				tag: "Ɵ",
				emblem: "Ɵ",
				color: "Ɵ"
			},
			table: {
				static: 9,
				eu: [17, 18, 19, 20, 21, 22, 23, 24],
				na: [23, 0, 1, 2, 3, 4, 5, 6],
				ru: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
				asia: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
				c: "",
				s: []
			},
			time: {
				c: "",
				h: sc.date.raw.getHours(),
				m: sc.date.raw.getMinutes(),
				o: ((sc.date.raw.getTimezoneOffset() > 0) ? -Math.abs(sc.date.raw.getTimezoneOffset()) : Math.abs(sc.date.raw.getTimezoneOffset()))/60
			},
		};
		bs.api = {
			event: "https://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/globalmap/events/?application_id="+sc.api.wg_key+"&limit=1",
			clan: "https://"+wg.srv+".wargaming.net/globalmap/game_api/clan/"+bs.clan.id+"/battles",
			bats: "https://"+wg.srv+".wargaming.net/globalmap/game_api/map_fill_info?aliases=",
			tourney: "https://"+wg.srv+".wargaming.net/globalmap/game_api/tournament_info?alias=",
			prov: "https://"+wg.srv+".wargaming.net/globalmap/game_api/province_info?alias=",
			provs: "https://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/globalmap/clanprovinces/?application_id="+sc.api.wg_key+"&clan_id="+bs.clan.id,
			divs: "https://"+wg.srv+".wargaming.net/globalmap/game_api/wot/clan_tactical_data", // need authentication from global map
			raids: "https://"+wg.srv+".wargaming.net/globalmap/game_api/wot/raids" // need authentication from global map
		};
		bs.time.r = ((bs.time.m >= 15 && bs.time.m <= 45) ? [bs.time.h,"30"] : ((bs.time.m <= 15) ? [bs.time.h,"00"] : [(bs.time.h+1),"00"]));
		bs.time.t = bs.time.r[0]+"_"+bs.time.r[1];

		// fame calculation history
		// provFame = bs.cw.fame*((data.owner) ? (Math.floor(data.owner.occupy/24)+1) : 1),


		// script functions
		var sf = {
			tableFetch: function () {
				// show animated loading gear
				loadGif.classList.remove("js-hidden");
				// find required info from table player rows
				for (var _rt=0, _rt_len = memObj.cls.children.length; _rt<_rt_len; _rt++) {
					var row = memObj.cls.children[_rt];
					if (!row.classList.contains("card")) {
						var id = row.getAttribute('data-account_id'),
						name = row.getElementsByClassName('player_name')[0].innerHTML,
						role = row.getElementsByClassName('player_rank')[0].innerHTML;
						if (!isNaN(id)) {
							memObj.ids.push(id);
							ss.user[id] = {u:{name:name,id:id,role:role}, v:{frag:0,dmg:0,spot:0,def:0,win:0}, wn8:""};
						}
					}
				}
				ss.clan = {name:(wg.clan.name) ? (wg.clan.name) : "???", wn8:0, win:0, mem: _rt_len};
				// request and retrieve statistics from API
				if (ss.clan.mem > 0) {
					sf.request("infoData", sc.api.i+memObj.ids.join(','), sf.apiInfoHnd);
				}
			},
			apiInfoHnd: function (resp) { // processing information from player API
				var data = resp.data;
				for (var a in data) {
					if (data.hasOwnProperty(a)) {
						var pData = data[a];
						if (pData !== null) {
							// store stats
							var pDataStats = pData.statistics.all;
							ss.user[pData.account_id].u = {
								name: pData.nickname,
								id: pData.account_id,
								role: ss.user[pData.account_id].u.role,
								cid: pData.clan_id,
								bat: pDataStats.battles,
								win: (pDataStats.wins/pDataStats.battles)*100,
								dmg: pDataStats.damage_dealt/pDataStats.battles,
								frag: pDataStats.frags/pDataStats.battles,
								spot: pDataStats.spotted/pDataStats.battles,
								def: pDataStats.dropped_capture_points/pDataStats.battles,
								wgr: pData.global_rating,
								lng: pData.client_language
							};
							ss.clan.win += (!isNaN(ss.user[pData.account_id].u.win)) ? ss.user[pData.account_id].u.win : 0;
						}
					}
				}
				d.getElementById('js-wn8-status').textContent = "50%";
				sf.request("vehData", sc.api.v+memObj.ids.join(','), sf.apiVehHnd);
			},
			apiVehHnd: function (resp) { // processing information from vehicle API and calculate WN8
				var data = resp.data;
				for (var p in data) {
					if (data.hasOwnProperty(p)) {
						var vData = data[p];
						if (vData !== null) {
							var rWin, rDmg, rFrag, rSpot, rDef, wn8 = 0, battles = 0,
							userStat = ss.user[p];
							if (userStat.u.bat > 0) {
								for (var v in vData) {
									if (vData.hasOwnProperty(v)) {
										// go through each vehicle to get expected stats
										for (var _so=0, _so_len = wn.stat.length; _so<_so_len; _so++) {
											if (wn.stat[_so].IDNum == vData[v].tank_id) {
												var vehStat = wn.stat[_so],
												dataBattles = vData[v].statistics.battles;
												userStat.v.frag += vehStat.expFrag    * dataBattles;
												userStat.v.dmg  += vehStat.expDamage  * dataBattles;
												userStat.v.spot += vehStat.expSpot    * dataBattles;
												userStat.v.def  += vehStat.expDef     * dataBattles;
												userStat.v.win  += vehStat.expWinRate * dataBattles;
												battles += dataBattles;
												break;
											}
										}
									}
								}
								// start calculating wn8
								rWin  = Math.max(((userStat.u.win /(userStat.v.win /battles)-0.71)/(1-0.71)),0);
								rDmg  = Math.max(((userStat.u.dmg /(userStat.v.dmg /battles)-0.22)/(1-0.22)),0);
								rFrag = Math.max(Math.min(rDmg+0.2,((userStat.u.frag/(userStat.v.frag/battles)-0.12)/(1-0.12))),0);
								rSpot = Math.max(Math.min(rDmg+0.1,((userStat.u.spot/(userStat.v.spot/battles)-0.38)/(1-0.38))),0);
								rDef  = Math.max(Math.min(rDmg+0.1,((userStat.u.def /(userStat.v.def /battles)-0.10)/(1-0.10))),0);
								wn8 = 980*rDmg + 210*rDmg*rFrag + 155*rFrag*rSpot + 75*rDef*rFrag + 145*Math.min(1.8,rWin);
							}
							// store wn8 and add to clan total
							userStat.wn8 = wn8;
							ss.clan.wn8 += (wn8) ? wn8 : 0;
						}
					}
				}
				// calculate average wn8 / winrate and store everything in localStorage, then reload page
				ss.clan.wn8 = ss.clan.wn8/ss.clan.mem;
				ss.clan.win = ss.clan.win/ss.clan.mem;
				sf.storage("statScriptValues_"+wg.clan.id, {clan: ss.clan, user: ss.user}, "set", "string");
				sf.storage("statScriptDate_"+wg.clan.id, sc.date.now, "set");
				d.getElementById('js-wn8-status').textContent = "100%";
				location.reload();
			},
			apiBanHnd: function (resp) { // processing information from banned API
				var data;
				if (!memObj.bans.api) {
					data = resp.data;
					memObj.bans.api = data;
					memObj.bans.f = true;
				}
				else {
					data = memObj.bans.api;
				}
				for (var a in data) {
					if (data.hasOwnProperty(a)) {
						var bData = data[a];
						var memClass = "js-tooltip-id_js-playerslist-account-name-tooltip-"+a,
						memCell = d.getElementsByClassName(memClass)[0].parentNode;
						if (bData.ban_time !== null) {
							var banTime = (bData.ban_time > 0) ? new Date(bData.ban_time*1000).toLocaleString(sc.date.format[wg.srv]) : sc.loc[18];
							memCell.appendChild(sf.elem("p", "player_time", banTime));
						}
						else {
							memCell.appendChild(sf.elem("p", "player_time", sc.loc[19]));
						}
					}
				}
			},
			clan: function () { // clan links
				// look for potential elements with clan name
				var emblems = [
					d.getElementsByClassName('page-header_emblem')[0], // first method
					d.getElementsByClassName('clan_name')[0], // second method
					d.getElementsByClassName('js-clan-name')[0] // third method - your own clan
				];
				wg.clan.name = (emblems[0] || emblems[1]) ? ((emblems[1]) ? emblems[1].firstElementChild.innerHTML.replace(/[\[\]]/g,"") : emblems[0].alt) : (emblems[2]) ? emblems[2].innerHTML : false;
				// create the stat site menu
				var menu_class = d.getElementsByClassName('menu-top')[0],
				clanMenu_div = sf.elem("div", "menu-clan_links menu-top_item", "<span class='menu-top_link'>"+sc.loc[1]+"<span class='cm-arrow'></span></span>"),
				clanMenu_list = sf.elem("ul", "clan-links cm-sublist"),
				clanMenu_list_items = [
					[sc.srv.wl, "<a target='_blank' href='http://wotlabs.net/"+sc.srv.wl+"/clan/"+wg.clan.name+"'><span class='sl-icon sl-wl'></span>WoTLabs</a>"],
					[sc.srv.nm, "<a target='_blank' href='http://noobmeter.com/clan/"+sc.srv.nm+"/"+wg.clan.name+"/"+wg.clan.id+"'><span class='sl-icon sl-nm'></span>Noobmeter</a>"],
					[sc.srv.vb, "<a target='_blank' href='http://vbaddict.net/clan/worldoftanks."+sc.srv.vb+"/"+wg.clan.id+"/clan-"+wg.clan.name.toLowerCase()+"'><span class='sl-icon sl-vb'></span>vBAddict</a>"],
					[sc.srv.ct, "<a target='_blank' href='http://clantools.us/servers/"+sc.srv.ct+"/clans?id="+wg.clan.id+"'><span class='sl-icon sl-ct'></span>Clan Tools</a>"],
					[sc.srv.cs, "<a target='_blank' href='http://wotcs.com/clan.php?wid="+wg.clan.id+"'><span class='sl-icon sl-cs'></span>WoT-CS</a>"],
					[sc.srv.kttc, "<a target='_blank' href='http://"+((wg.srv=="ru") ? "" : sc.srv.kttc+".")+"kttc.ru/clan/"+wg.clan.id+"/'><span class='sl-icon sl-kttc'></span>KTTC</a>"],
					[sc.srv.wlf, "<a target='_blank' href='http://wot-life.com/"+sc.srv.wlf+"/clan/"+wg.clan.name+"-"+wg.clan.id+"/'><span class='sl-icon sl-wlife'></span>WoT-Life</a>"],
					[sc.srv.we, "<a target='_blank' href='http://wotevent.guildity.com/clans/"+wg.clan.name+"/'><span class='sl-icon sl-we'></span>WoT Event Stats</a>"],
					[sc.srv.wr, "<a target='_blank' href='http://wotreplays."+sc.srv.wr+"/clan/"+wg.clan.name+"'><span class='sl-icon sl-wr'></span>WoTReplays</a>"]
				];
				sf.links(clanMenu_list, clanMenu_list_items);
				clanMenu_div.firstElementChild.addEventListener('click', function() {this.classList.toggle('cm-parent-link__opened'); this.nextSibling.classList.toggle('cm-sublist__opened');}, false);
				clanMenu_div.appendChild(clanMenu_list);
				menu_class.appendChild(clanMenu_div);
			},
			clanInsert: function (mode) { // overall clan stat insertion
				switch(mode) {
					case ("main"):
						var clanProfileValue = d.getElementsByClassName('rating-profile_item');
						if (ss.clan.win) {
							clanProfileValue[1].innerHTML = "<i class='rating-profile_icon i i__rating-common i__wot-victories'></i><span class='rating-profile_value rating-players_stats js-format-number'>"+sf.color(ss.clan.win,"wr",2,"%")+"</span><span class='rating-profile_key'>"+sc.loc[8]+"</span>";
						}
						if (ss.clan.wn8) {
							clanProfileValue[3].innerHTML = "<i class='rating-profile_icon i i__rating-common i__wot-experience'></i><span class='rating-profile_value rating-players_stats js-format-number'>"+sf.color(ss.clan.wn8,"wn8",0)+"</span><span class='rating-profile_key'>"+sc.loc[9]+"</span>";
						}
						break;
					case ("list"):
						var clanPlayersValue = d.getElementsByClassName('rating-players')[0].rows[0];
						clanPlayersValue.cells[1].getElementsByClassName('rating-players_key')[0].textContent = sc.loc[8];
						if (statsInsertionStatus === false && ss.clan) {
							if (ss.clan.win) {
								var clanWinCell = clanPlayersValue.insertCell(2);
								clanWinCell.className = "rating-players_item rating-players_item__data";
								clanWinCell.innerHTML = "<i class='rating-players_icon i i__rating-common i__wot-victories'></i><span class='rating-players_value rating-players_stats'>"+sf.color(ss.clan.win,"wr",2,"%")+"</span><span class='rating-players_key'>"+sc.loc[10]+"</span>";
							}
							if (ss.clan.wn8) {
								var clanWn8Cell = clanPlayersValue.insertCell(4);
								clanWn8Cell.className = "rating-players_item rating-players_item__data";
								clanWn8Cell.innerHTML = "<i class='rating-players_icon i i__rating-common i__wot-experience'></i><span class='rating-players_value rating-players_stats'>"+sf.color(ss.clan.wn8,"wn8",0)+"</span><span class='rating-players_key'>"+sc.loc[11]+"</span>";
							}
						}
						break;
					case ("bslink"):
						var profileFooter = d.getElementsByClassName('profile-data_footer')[1];
						profileFooter.appendChild(sf.elem("a", "link link__arrow link__script", sc.loc[22], {href:"/clans/wot/"+wg.clan.id+"/clan_battles/"}));
						break;
					default:
						break;
				}
			},
			ratInsert: function () { //memberlist stat insertion
				// add container for member counters
				var pageHeader = d.getElementsByClassName('page-header')[0],
				memInfo_div = sf.elem("div", "page-header_meminfo");
				pageHeader.appendChild(memInfo_div);
				var newMem = 0, banMem = d.getElementsByClassName('tbl-rating_tr__state-banned').length;
				// add a counter for amount of banned people in clan
				if (banMem > 0) {
					var banMem_span = d.getElementsByClassName('page-header_ban')[0];
					if (!banMem_span) {
						banMem_span = sf.elem("span", "page-header_ban", sc.loc[17]+" "+banMem);
						memInfo_div.appendChild(banMem_span);
					}
					else {
						banMem_span.textContent = sc.loc[17]+" "+banMem;
					}
				}
				// table header for wn8
				if (headerInsertionStatus === false && Object.keys(ss.clan).length !== 0) {
					var headName = d.getElementsByClassName('tbl-rating_th__basis')[0],
					wnHead = sf.elem("div", "tbl-rating_th tbl-rating_th__wn tbl-rating_th__right", "<a href='#' data-tooltip-content='WN8' class='sorter js-table-sorter js-simple-tooltip js-sort-field_wn8 js-tooltip'><i class='sorter_icon sorter_icon__mq-hidden i i__table-params i__wot-aeb'></i><span class='sorter_caption'>WN8</span></a>");
					headName.parentNode.insertBefore(wnHead, headName.nextSibling);
					headerInsertionStatus = true;
				}
				// add wn8 for each member and colorize stats
				var userCheck = Object.keys(ss.user).length !== 0;
				for (var _rt=0, _rt_len = memObj.cls.children.length; _rt<_rt_len; _rt++) {
					var row = memObj.cls.children[_rt];
					if (!row.classList.contains("card")) {
						var id = row.getAttribute('data-account_id'),
						memName = row.getElementsByClassName('tbl-rating_td__basis')[0],
						memWGR = row.getElementsByClassName('tbl-rating_value')[0],
						memWins = row.getElementsByClassName('tbl-rating_value')[2];
						if (userCheck) {
							var wnRow = sf.elem("div", "tbl-rating_td tbl-rating_td__right");
							memName.parentNode.insertBefore(wnRow, memName.nextSibling);
							if (ss.user[id] && ss.user[id].wn8) {
								wnRow.innerHTML = "<span class='tbl-rating_value'>"+sf.color(ss.user[id].wn8,"wn8",0)+"</span>";
							}
							else {
								wnRow.innerHTML = "<span class='tbl-rating_value'>"+sc.loc[15]+"</span>";
								newMem ++;
							}
						}
						if (memWGR.innerHTML !== "0" && memWGR.innerHTML !== "—") {
							memWGR.innerHTML = sf.color(sf.format(memWGR.innerHTML,1),"wgr",0);
						}
						if (memWins.innerHTML !== "0.00%" && memWins.innerHTML !== "—") {
							memWins.innerHTML = sf.color(sf.format(memWins.innerHTML.replace(/[,]/g,"."),3),"wr",2,"%");
						}
					}
				}
				// add a counter for new people in the clan, compared to store stats
				if (newMem > 0) {
					var newMem_span = d.getElementsByClassName('page-header_mem')[0];
					if (!newMem_span) {
						newMem_span = sf.elem("span", "page-header_mem", sc.loc[16]+" "+newMem);
						memInfo_div.appendChild(newMem_span);
					}
					else {
						newMem_span.textContent = sc.loc[16]+" "+newMem;
					}
				}
				// check for length on bans
				//if (memObj.bans.f) {
				//	sf.apiBanHnd();
				//}
				//else {
				//	memObj.bans.cls = d.getElementsByClassName('js-banned');
				//	for (var _bm=0, _bm_len = memObj.bans.cls.length; _bm<_bm_len; _bm++) {
				//		var bannedId = memObj.bans.cls[_bm].dataset.account_id;
				//		memObj.bans.ids.push(bannedId);
				//	}
				//	if (memObj.bans.ids.length > 0) {
				//		sc.api.b = sc.api.i+memObj.bans.ids.join(',')+"&fields=ban_time";
				//		sf.request("banData", sc.api.b , sf.apiBanHnd);
				//	}
				//}
			},
			format: function (input, type) { // input and output formatting
				var inputStr = input.toString();
				switch(type) {
					case (1): // input string into number
						return parseFloat(inputStr.replace(/[^\d]/g,""));
					case (2): // output number with locale symbol
						return inputStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+sc.loc[0]);
					case (3): // input string into number - exclude dots
						return parseFloat(inputStr.replace(/[^\d\.]/g,""));
					default:
						console.error("Error filtering: ", input);
						return input;
				}
			},
			color: function (input, type, dec, sym) { // color formatting
				var color = sc.col.dft[0],
				output = input.toFixed(dec);
				if (input >= 1000) {
					output = sf.format(input.toFixed(dec),2);
				}
				for (var c in sc.col) {
					if (sc.col.hasOwnProperty(c)) {
						if (input >= sc.col[c][sc.col.id[type]]) {
							color = sc.col[c][0]; break;
						}
					}
				}
				if (sc.loc[0] !== "," && dec !== 0) {
					output = output.replace(/\.(\d+)*$/g,",$1");
				}
				if (sym) {
					output += sym;
				}
				return "<font color='"+color+"'>"+output+"</font>";
			},
			elem: function (tag, name, html, extra) { // element creation
				var element = d.createElement(tag);
				if (name) {
					element.className = name;
				}
				if (html) {
					if (/</.test(html)) {
						element.innerHTML = html;
					}
					else {
						element.textContent = html;
					}
				}
				if (extra) {
					for (var _e in extra) {
						if (extra.hasOwnProperty(_e)) {
							element[_e] = extra[_e];
						}
					}
				}
				return element;
			},
			settings: function (name, text, state, dftState, wlist) { // script menu handler
				var listItem = sf.elem("li", "b-settingItem "+name),
				listItems = d.createDocumentFragment();
				if (name == "wnRefresh") {
					var refreshBtn = sf.elem("div", "b-settingParent", "<a>"+text+"</a>");
					listItem.classList.add("settingSeperator");
					refreshBtn.addEventListener('click', function() {localStorage.removeItem("wnExpValues"); location.reload();}, false);
					listItems.appendChild(refreshBtn);
				}
				else if (name == "cleanStorage") {
					var cleanBtn = sf.elem("div", "b-settingParent", "<a>"+text+"</a>");
					cleanBtn.addEventListener('click', function() {localStorage.clear(); location.reload();}, false);
					listItems.appendChild(cleanBtn);
				}
				else {
					var optCheckDiv = sf.elem("div", "b-checkbox", "<span class='b-checkbox_checker'></span>"),
					optLabel = sf.elem("label", "b-combobox-label", text),
					optCheck = sf.elem("input", "l-box", "", {type:"checkbox"});
					optLabel.htmlFor = name;
					optCheck.name = name;
					optCheck.id = name;
					if (state) {
						optCheckDiv.classList.add("b-checkbox__checked");
						optLabel.classList.add("b-combobox-label__checked");
					}
					optCheck.checked = (state !== undefined) ? state : dftState;
					optCheck.addEventListener('click', function() {
						sf.storage('statScript_' + this.name, this.checked, "set");
						d[this.name] = this.checked;
						this.parentNode.classList.toggle('b-checkbox__checked');
						this.parentNode.parentNode.classList.toggle('b-combobox-label__checked');
						return this.checked;
					}, false);
					d[optCheck.name] = optCheck.checked;
					optCheckDiv.insertBefore(optCheck, optCheckDiv.firstChild);
					optLabel.appendChild(optCheckDiv);
					listItems.appendChild(optLabel);
					if (name == "whitelist") {
						var optText = sf.elem("textarea", "l-textarea");
						optText.placeholder = "Add clanID seperated by comma without spaces: 500004502,500010805";
						if (wlist) {
							optText.value = wlist;
						}
						optText.addEventListener('input', function() {
							sf.storage('statScript_whitelist_list', optText.value.split(","), "set");
						}, false);
						listItems.appendChild(optText);
					}
				}
				listItem.appendChild(listItems);
				return listItem;
			},
			links: function (parent, links) { // links handler
				var uRows = d.createDocumentFragment();
				for (var _l=0, _l_len = links.length; _l<_l_len; ++_l) {
					if (links[_l] instanceof HTMLElement) {
						uRows.appendChild(links[_l]);
					}
					else {
						uRows.appendChild((links[_l][0] && links[_l][1]) ? sf.elem("li", "", links[_l][1]) : sf.elem("li", "statname", links[_l][0]));
					}
				}
				parent.appendChild(uRows);
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
			wn: function (resp) { // wnefficiency handler
				sf.storage("wnExpValues", resp, "set", "string");
				sf.storage("wnExpDate", sc.date.now, "set");
				sf.storage("wnExpVers", [sc.vers, resp.header.version], "set", "string");
				location.reload();
			},
			// battle scheduler functions
			handlerEvent: function(data) { // event checker
				// check if active event exists
				var event = (data.data) ? data.data[0] : "error";
				if (event.status == "ACTIVE" || !bs.cw.status) {
					if (event.status == "ACTIVE") {
						bs.cw.event = true;
						bs.cw.tier = 10;
						// var tierCheck = [
						// 	event.fronts[0].front_id.match(/tier_(\d)+/),
						// 	event.event_id.match(/(first|second|third)/)[0],
						// 	{first: 6, second: 8, third: 10}
						// ];
						// bs.cw.tier = (tierCheck[0]) ? tierCheck[0][0] : tierCheck[2][tierCheck[1]];
					}
					sf.request("mainData", bs.api.clan, sf.handlerMain, "cw");
				}
				else {
					// empty table
					battleTable.lastElementChild.innerHTML = "";
					battleTable.lastElementChild.appendChild(sf.elem("tr", "t-cwText", "<td colspan='8'>"+sc.loc[39]+"</td>"));
					clearInterval(updateInterval);
				}
				// insert update timestamp
				d.getElementById('js-batttleUpdate').textContent = new Date().toLocaleTimeString("en-GB");
			},
			handlerMain: function(data) { // data handler
				var battleProvinces = [], battle,
				battleFragment = d.createDocumentFragment();
				// store data
				bs.clan.tag = data.clan.tag;
				bs.clan.emblem = data.clan.emblem_url;
				bs.clan.color = data.clan.color;
				bs.cw.bats = data.clan.appointed_battles_count;
				bs.cw.current = data.battles.length;
				bs.cw.elo = {
					6: data.clan.elo_rating_6,
					8: data.clan.elo_rating_8,
					10: data.clan.elo_rating_10
				};
				style.textContent += ".t-clantag {color: "+bs.clan.color+";}";
				// go through battles and planned battles
				for (var _b=0, _b_len = data.battles.length; _b<_b_len; _b++) {
					battle = data.battles[_b];
					if (battleProvinces.indexOf(battle.province_id) == -1) {
						battleProvinces.push(battle.province_id);
						battleFragment.appendChild(sf.elem("tr", "battle "+battle.province_id+" attack", "<td><a class='link link__external' target='_blank' href='https://"+wg.srv+".wargaming.net/globalmap/#province/"+battle.province_id+"'>"+battle.province_name+"<i class='link_icon i i__external-links i__regular'></i></a></td><td>"+sf.mapFix(battle.arena_name)+"</td><td></td><td class='t-gold'><span></span><i class='i-gold'></i></td><td class='t-fame'>Ɵ</td><td></td><td></td><td id='"+battle.enemy.id+"'><a class='link link__external' target='_blank' href='https://eu.wargaming.net/clans/"+battle.enemy.id+"/'>["+battle.enemy.tag+"] <img src='"+battle.enemy.emblem_url+"'><i class='link_icon i i__external-links i__regular'></i></a><span class='t-elo'>("+battle.enemy["elo_rating_"+((bs.cw.event) ? bs.cw.tier : "10")]+")</span></td><td class='t-battle'>Ɵ</td><td class='t-battle t-border'>Ɵ</td>"+bs.table.c));
					}
				}
				for (var _bp=0, _bp_len = data.planned_battles.length; _bp<_bp_len; _bp++) {
					battle = data.planned_battles[_bp];
					if (battleProvinces.indexOf(battle.province_id) == -1) {
						battleProvinces.push(battle.province_id);
						battleFragment.appendChild(sf.elem("tr", "battle "+battle.province_id+" attack", "<td><a class='link link__external' target='_blank' href='https://"+wg.srv+".wargaming.net/globalmap/#province/"+battle.province_id+"'>"+battle.province_name+"<i class='link_icon i i__external-links i__regular'></i></a></td><td>"+sf.mapFix(battle.arena_name)+"</td><td></td><td class='t-gold'><span>"+battle.province_revenue+"</span><i class='i-gold'></i></td><td class='t-fame'>Ɵ</td><td></td><td></td><td>"+sc.loc[40]+"</td><td class='t-battle'>Ɵ</td><td class='t-battle t-border'>Ɵ</td>"+bs.table.c));
					}
				}
				// show foes and battle count if clan has any battles and remove loading indicator
				if (bs.cw.bats > 0) {
					style.textContent += ".t-battle {display: table-cell !important;}";
					battleTable.lastElementChild.innerHTML = ""; // empty table
				}
				battleTable.lastElementChild.appendChild(battleFragment);
				// insert battle count
				d.getElementById('js-battles').textContent = bs.cw.bats;
					// send request for detailed battle information
					if (bs.cw.bats > 0) {
						sf.request("batsData", bs.api.bats+battleProvinces.join("&aliases="), sf.handlerBats, "cw");
					}
					// send request for clan provinces
					sf.request("provsData", bs.api.provs, sf.handlerProvs, "cw");
			},
			handlerBats: function(data, mode) { // battles handler
				for (var _bd=0, _bd_len = data.data.length; _bd<_bd_len; _bd++) {
					var battle = data.data[_bd],
					battleRow = d.getElementsByClassName(battle.alias)[0],
					enemyID = battleRow.children[7].id,
					battleType = ((battle.owner_clan_id == bs.clan.id) ? sc.loc[43] : ((battle.owner_clan_id == enemyID) ? sc.loc[44] : sc.loc[45])),
					primeTime = [sf.time(parseFloat(battle.primetime.match(/\d+/g)[0])), battle.primetime.match(/\d+/g)[1], parseFloat(battle.primetime.match(/\d+/g)[0])];
					if (battleType == sc.loc[43]) {
						battleRow.classList.remove("attack");
						battleRow.classList.add("defense");
					}
					// modify cells cells
					battleRow.children[2].textContent = primeTime[0]+":"+primeTime[1];
					battleRow.children[2].dataset.sort = primeTime[2]+""+primeTime[1];
					battleRow.children[3].innerHTML = "<span class='gold'>"+battle.revenue+"<i class='i i__currencies i__gold'></i></span>";
					battleRow.children[6].textContent = battleType;
					battleRow.children[9].textContent = battle.attackers_count;
					// get correct battle count and schedule
					sf.request("tourneyData", bs.api.tourney+battle.alias+"&round=1", sf.handlerTourney);
					// get province famepoints if event
					if (bs.cw.event) {
						sf.request("provData", bs.api.prov+battle.alias, sf.handlerProv, "cw", (battle.is_wagon_train) ? "×20" : (battle.is_enclave_ring) ? "×5" : (battle.is_enclave_center) ? "×3" : "");
					}
				}
				// refresh table
				sortTable.refresh();
			},
			handlerTourney: function(data) { // tournament handler
				var battleRow = d.getElementsByClassName(data.province_id)[0],
				primeTime = [sf.time(parseFloat(data.start_time.match(/\d+/g)[0])), data.start_time.match(/\d+/g)[1], parseFloat(data.start_time.match(/\d+/g)[0])],
				ownerClan = (data.owner) ? (data.owner.id == bs.clan.id) || false : false,
				cellOwnerTime = false,
				attackers = [data.pretenders, 0];
				bs.dyn.check ++;
				// check attackers
				if (attackers[0]) {
					var _pre_len = attackers[0].length,
					attacker_ids = [];
					for (var _pre=0; _pre<_pre_len; _pre++) {
						attacker_ids.push(attackers[0][_pre].id);
					}
					//if (!ownerClan && attacker_ids.indexOf(bs.clan.id) == -1) {
					//	battleRow.parentElement.removeChild(battleRow);
					//}
				}
				if (!isNaN(battleRow.children[9].innerHTML)) {
					attackers = parseFloat(battleRow.children[9].innerHTML);
				}
				else if (data.is_superfinal) {
					attackers = 1;
				}
				else if (attackers[0]) {
					attackers = attackers[0].length;
				}
				else {
					attackers = attackers[1];
					for (var _bc=0, _bc_len = data.battles.length; _bc<_bc_len; _bc++) {
						attackers += ((data.battles[_bc].is_fake) ? 1 : 2);
					}
				}
				// find how many battles
				var battles = (attackers !== 0) ? Math.ceil(Math.log2(attackers))+1 : 0;
				// modify cells
				battleRow.children[1].textContent = sf.mapFix(data.arena_name);
				battleRow.children[2].textContent = primeTime[0]+":"+primeTime[1];
				battleRow.children[2].dataset.sort = primeTime[2]+""+primeTime[1]+"."+battles;
				battleRow.children[3].innerHTML = "<span class='gold'>"+data.province_revenue+"<i class='i i__currencies i__gold'></i></span>";
				battleRow.children[5].innerHTML = (data.owner) ? "<a class='link link__external' target='_blank' href='http://"+wg.srv+".wargaming.net/clans/"+data.owner.id+"/globalmap'><span style='color: "+data.owner.color+";'>["+data.owner.tag+"]</span> <img src='"+data.owner.emblem_url+"'><i class='link_icon i i__external-links i__regular'></i></a>" : sc.loc[47];
				if (data.owner && bs.cw.tier !== "Ɵ") {
					battleRow.children[5].appendChild(sf.elem("span", "t-elo", "("+data.owner["elo_rating_"+((bs.cw.event) ? bs.cw.tier : "10")]+")"));
				}
				// only continue if there are any attackers
				if (attackers) {
					var emptyCells = ((primeTime[2]-bs.table[wg.srv][0])*2)+bs.table.static,
					lastBattle = battles+emptyCells,
					lastGroup = data.battles[data.battles.length-1],
					freeRound = (primeTime[1] == "15") ? false : battleRow.children[7].innerHTML == sc.loc[40] && lastGroup && lastGroup.is_fake && lastGroup.first_competitor.id == bs.clan.id;
					battleRow.children[8].textContent = attackers;
					battleRow.children[9].textContent = battles;
					for (var _e=bs.table.static+1; _e<battleRow.childElementCount; _e++) {
						var cell = battleRow.children[_e];
						if (_e > emptyCells && _e <= lastBattle) {
							var timeClass = "."+cell.classList.item(1),
							timePrevClass = "."+cell.previousElementSibling.classList.item(1);
							if (bs.table.s.indexOf(timeClass) == -1 || bs.table.s.indexOf(timePrevClass) == -1) {
								bs.table.s.push(timePrevClass, timeClass);
								if (_e == lastBattle) {
									bs.table.s.push(timePrevClass+" + th", timePrevClass+" + td", timeClass+" + th", timeClass+" + td");
								}
							}
							if (ownerClan && _e !== lastBattle) {
								cell.className += " t-noFight";
							}
							else {
								cell.className += " t-fight";
								if (bs.dyn.conc[_e]) {
									bs.dyn.conc[_e] ++;
								}
								else {
									bs.dyn.conc[_e] = 1;
								}
							}
							if (_e == lastBattle) {
								if (ownerClan) {
									cell.className += " js-last";
								}
								if (!data.owner || (battleRow.children[6] == sc.loc[42] && !data.owner.division_id)) {
									cell.className += " t-noOwner";
								}
								cell.innerHTML = "♖";
								cellOwnerTime = [parseFloat(cell.classList.item(1).match(/\d+/g)[0]), parseFloat(cell.classList.item(1).match(/\d+/g)[1])];
							}
							else {
								cell.innerHTML = "&#9876;";
							}
							if (primeTime[1] == "15") {
								battleRow.classList.add("timeShift");
								cell.innerHTML += "<span class='t-timeShift'>+</span>";
							}
						}
					}
					if (bs.dyn.check == bs.cw.bats || bs.dyn.plan > 0) {
						d.getElementById('js-battlesConc').textContent = bs.dyn.conc.sort(function(a,b){return b-a;})[0];
						style.textContent += bs.table.s.join(", ")+" {display: table-cell !important;}";
					}
					// check if battle is planned or not started and change state to ongoing
					if (battleRow.children[6].innerHTML !== sc.loc[45] && !/\[/i.test(battleRow.children[7].textContent) && new Date().getHours() >= primeTime[0]-1 && new Date().getHours() < cellOwnerTime[0]) {
						switch(battleRow.children[6].innerHTML) {
							case (sc.loc[42]):
								battleRow.children[6].textContent = sc.loc[43];
								battleRow.children[7].textContent = sc.loc[41];
								break;
							case (sc.loc[43]):
								battleRow.children[7].textContent = sc.loc[41];
								break;
							default:
								break;
						}
					}
					else if (battleRow.children[6].innerHTML == sc.loc[42]) {
						battleRow.children[6] = "Finished"; // needs testing
					}
					// check if no opponent - free round
					if (freeRound) {
						battleRow.children[7].textContent = sc.loc[46];
						battleRow.children[7].classList.add("t-bold");
					}
				}
				else {
					var lastBattle = battleRow.getElementsByClassName("t-"+primeTime[0]+"_00")[0];
					battleRow.children[7].innerHTML = "&#10132; / &#9992;";
					battleRow.children[7].classList.add("t-bold");
					if (primeTime[1] == "15") {
						battleRow.classList.add("timeShift");
						lastBattle.innerHTML = "♖<span class='t-timeShift'>+</span>";
					}
					else {
						lastBattle.innerHTML = "♖";
					}
					lastBattle.classList.add("t-noFight");
				}
				if (ownerClan) {
					bs.dyn.gold += data.province_revenue;
					d.getElementById('js-gold').textContent = bs.dyn.gold; // insert gold count
				}
				if (bs.cw.gold && data.province_revenue === 0) {
					d.getElementById('js-goldInfo').textContent = sc.loc[62];
					bs.cw.gold = false;
					style.textContent += "th.t-gold, td.t-gold {display: none;}";
				}
				// refresh table
				battleRow.children[2].dataset.sort = (battleRow.children[6].innerHTML == sc.loc[50] || attackers === 0) ? 50+primeTime[2]+""+primeTime[1] : primeTime[2]+""+primeTime[1]+"."+battles+""+((battleRow.children[6].innerHTML == sc.loc[45]) ? 1 : 0)+""+cellOwnerTime[0]+""+cellOwnerTime[1];
				sortTable.refresh();
			},
			handlerProvs: function(data) { // clan provinces handler
				var provs = data.data[bs.clan.id],
				ownedProvinces = [], provTimes = [],
				provFragment = d.createDocumentFragment();
				if (battleTable.rows[1] && battleTable.rows[1].classList.contains("t-cwText")) {
					battleTable.lastElementChild.innerHTML = ""; // empty table
				}
				if (provs) {
					for (var _p=0, _p_len = provs.length; _p<_p_len; _p++) {
						var prov = provs[_p],
						battleRow = d.getElementsByClassName(prov.province_id)[0],
						primeTime = [sf.time(parseFloat(prov.prime_time.match(/\d+/g)[0])), prov.prime_time.match(/\d+/g)[1], parseFloat(prov.prime_time.match(/\d+/g)[0])+bs.table[wg.srv].length];
						if (!battleRow) {
							var provRow = sf.elem("tr", "province "+prov.province_id+" defense", "<td><a class='link link__external' target='_blank' href='https://"+wg.srv+".wargaming.net/globalmap/#province/"+prov.province_id+"'>"+prov.province_name+"<i class='link_icon i i__external-links i__regular'></i></a></td><td>"+sf.mapFix(prov.arena_name)+"</td><td data-sort='"+primeTime[2]+""+primeTime[1]+"'>"+primeTime[0]+":"+primeTime[1]+"</td><td class='t-gold'><span>"+prov.daily_revenue+"</span><i class='i-gold'></i></td><td class='t-fame'>Ɵ</td><td><a class='link link__external' target='_blank' href='https://eu.wargaming.net/clans/"+bs.clan.id+"/'><span class='t-clantag'>["+bs.clan.tag+"]</span> <img src='"+bs.clan.emblem+"'><i class='link_icon i i__external-links i__regular'></i></a><span class='t-elo'>("+bs.cw.elo[prov.max_vehicle_level]+")</span></td><td>"+sc.loc[43]+"</td><td>"+sc.loc[48]+"</td><td class='t-battle' data-sort='99'>Ɵ</td><td class='t-battle t-border' data-sort='99'>Ɵ</td>"+bs.table.c),
							provTime = "t-"+primeTime[0]+"_00",
							provTimeClass = "."+provTime+", ."+provTime+" + td, ."+provTime+" + th",
							lastBattle = provRow.getElementsByClassName(provTime)[0];
							ownedProvinces.push(prov.province_id);
							bs.dyn.gold += prov.daily_revenue;
							bs.cw.tier = prov.max_vehicle_level;
							if (primeTime[1] == "15") {
								provRow.classList.add("timeShift");
								lastBattle.innerHTML = "♖<span class='t-timeShift'>+</span>";
							}
							else {
								lastBattle.innerHTML = "♖";
							}
							lastBattle.classList.add("t-noFight");
							if (provTimes.indexOf(provTimeClass) == -1) {
								provTimes.push(provTimeClass);
							}
							if (bs.cw.gold && prov.daily_revenue === 0) {
								d.getElementById('js-goldInfo').textContent = sc.loc[62];
								bs.cw.gold = false;
								style.textContent += "th.t-gold, td.t-gold {display: none;}";
							}
							// get province famepoints if event
							if (bs.cw.event) {
								sf.request("provData", bs.api.prov+prov.province_id, sf.handlerProv, "cw");
							}
							provFragment.appendChild(provRow);
						}
					}
					// display finals column
					style.textContent += provTimes.join(", ")+" {display: table-cell !important;}";
					// insert gold count
					d.getElementById('js-gold').textContent = sf.format(bs.dyn.gold,2);
					// send request for divisions
					sf.request("divsData", bs.api.divs, sf.handlerDivs);
					// send request for raids if event
					if (bs.cw.event) {
						sf.request("raidsData", bs.api.raids, sf.handlerRaids, "cw");
					}
				}
				else if (bs.cw.bats === 0) {
					provFragment.appendChild(sf.elem("tr", "t-cwText", "<td colspan='8'>"+sc.loc[49]+"</td>"));
				}
				battleTable.lastElementChild.appendChild(provFragment);
				// refresh table
				sortTable.refresh();
			},
			handlerProv: function(data, coef) { // province handler
					var prov = data.province,
					battleRow = d.getElementsByClassName(data.province.alias)[0],
					style = "t-green", fame = "Ɵ", sort = 0;
					if (prov.fame_points) {
						fame = prov.fame_points;
					}
					else if (prov.money_box) {
						if (data.owner.id == bs.clan.id) {
							style = "t-red";
							fame = -Math.abs(data.province.money_box.risky_fame_points)
						}
						else {
							fame = "+"+data.province.money_box.capture_fame_points;
						}
						sort = fame;
					}
					else if (prov.is_enclave) {
						fame = prov.single_province_fp;
						coef = prov.fame_points_coefficient;
						sort = fame;
					}
					else if (prov.enclave_neighbours_number) {
						fame = prov.enclave_neighbours_number+"/"+prov.number_of_enclave_provinces;
						sort = prov.enclave_neighbours_number/prov.number_of_enclave_provinces;
						// change fame column title
						d.getElementById('js-fame').textContent = sc.loc[63];
					}
					else if (prov.raids) {
						if (prov.raids.secondary_mission_reward) {
							fame = prov.raids.secondary_mission_reward;
						}
						else {
							style = "";
						}
					}
					else {
						style = "";
					}
					if (battleRow) {
						battleRow.children[4].innerHTML = "<span class='"+style+"'>"+fame+"</span>"+((coef) ? " "+coef : "");
						battleRow.children[4].dataset.sort = sort;
					}
			},
			handlerDivs: function(data) { // divisions handler
				var divsId = JSON.stringify(data).match(/\d{9}/g);
				if (divsId.indexOf(bs.clan.id.toString()) !== -1) {
					for (var _p=0, _p_len = data.data.length; _p<_p_len; _p++) {
						var div = data.data[_p],
						battleRow = d.getElementsByClassName(div.alias)[0];
						if (!div.division) {
							if (battleRow && battleRow.classList.contains('defense')) {
								var defBattle = battleRow.getElementsByClassName("js-last")[0];
								battleRow.children[2].dataset.sort = 5000;
								battleRow.children[6].textContent = sc.loc[50];
								battleRow.children[6].classList.add("t-bold");
								if (defBattle) {
									defBattle.classList.remove("t-fight");
									defBattle.classList.add("t-noFight");
								}
							}
							else if (!battleRow) {
								bs.dyn.plan ++;
								battleTable.lastElementChild.appendChild(sf.elem("tr", "planned "+div.alias, "<td><a class='link link__external' target='_blank' href='https://"+wg.srv+".wargaming.net/globalmap/#province/"+div.alias+"'>"+div.name+"<i class='link_icon i i__external-links i__regular'></i></a></td><td></td><td></td><td class='t-gold'><span></span><i class='i-gold'></i></td><td class='t-fame'>Ɵ</td><td></td><td>"+sc.loc[42]+"</td><td>"+sc.loc[42]+"</td><td class='t-battle'>Ɵ</td><td class='t-battle t-border'>Ɵ</td>"+bs.table.c));
								sf.request("batsData", bs.api.bats+div.alias, sf.handlerBats, "cw");
							}
						}
						else {
							// sometimes future defenses wont show up in planned battles
							if (div.attackers.length !== 0 && battleRow && battleRow.classList.contains('province')) {
								bs.dyn.plan ++;
								battleTable.lastElementChild.appendChild(sf.elem("tr", "planned "+div.alias, "<td><a class='link link__external' target='_blank' href='https://"+wg.srv+".wargaming.net/globalmap/#province/"+div.alias+"'>"+div.name+"<i class='link_icon i i__external-links i__regular'></i></a></td><td></td><td></td><td class='t-gold'><span></span><i class='i-gold'></i></td><td class='t-fame'>Ɵ</td><td></td><td>"+sc.loc[43]+"</td><td>"+sc.loc[42]+"</td><td class='t-battle'>Ɵ</td><td class='t-battle t-border'>Ɵ</td>"+bs.table.c));
								battleRow.parentNode.removeChild(battleRow);
								sf.request("tourneyData", bs.api.tourney+div.alias+"&round=1", sf.handlerTourney, "cw");
							}
						}
					}
					if (bs.dyn.plan > 0) {
						style.textContent += ".t-battle {display: table-cell !important;}";
					}
					// refresh table
					sortTable.refresh();
				}
				else {
					d.getElementById('js-error').textContent = " • "+sc.loc[51];
				}
			},
			handlerRaids: function(data) { // raids handler for campaign events
				for (var _r=0, _r_len = data.length; _r<_r_len; _r++) {
					var raid = data[_r],
					battleRow = d.getElementsByClassName(raid.province.id)[0],
					fame = raid.fame_points, bonus = raid.bonus_fame_points, denyFame = 0, sort = fame+bonus, coef = raid.battle_coef;
					if (battleRow) {
						denyFame = parseFloat(battleRow.children[4].innerHTML.match(/\d+/));
						battleRow.children[4].innerHTML = "<span>"+fame+" + "+bonus+((denyFame) ? " + "+denyFame : "")+"</span> "+coef;
						battleRow.children[4].dataset.sort = sort+denyFame;
					}
				}
			},
			handlerError: function(name, data) { // error handler
				console.error("errorData", name, data);
				switch(name) {
					case ("mainData"):
						battleTable.lastElementChild.appendChild(sf.elem("tr", "t-cwText", "<td colspan='8'>"+sc.loc[52]+"</td>"));
						break;
					case ("divsData"):
						d.getElementById('js-error').textContent = " • "+sc.loc[51];
						break;
					default: break;
				}
			},
			time: function (hour, min, type) { // time converter
				var time = hour+bs.time.o;
				if (time >= 24) {
					time -= 24;
				}
				else if (time <= 0) {
					time += 24;
				}
				if (type == "s") {
					time = "t-"+time+"_"+min+((time === 0 && min == "00") ? " t-24_00" : "");
				}
				return time;
			},
			timer: function () { // timestamp handler
				var dateNow = new Date(),
				time = {
					h: sf.time(bs.table[wg.srv][0]-1)-dateNow.getHours(),
					m: 60-dateNow.getMinutes()-1,
					s: 60-dateNow.getSeconds()-1
				};
				var timeSpan = d.getElementById('js-timePrime');
				if (timeJump && !bs.cw.event && bs.cw.status) {
					timeSpan.textContent = sc.loc[53];
					timeSpan.classList.add("t-bold");
					clearInterval(timeInterval);
				}
				else if (time.h >= 0 && (time.s > 0 || time.m < 15)) {
					timeSpan.textContent = ((time.h > 0) ? time.h+" "+sc.loc[55]+", " : "")+((time.m > 0) ? time.m+" "+sc.loc[56]+", " : "")+time.s+" "+sc.loc[57];
				}
				else if (time.h < 0 && bs.cw.bats !== "Ɵ") {
					if (bs.cw.bats === 0) {
						timeSpan.textContent = sc.loc[54];
						timeSpan.classList.add("t-bold");
						clearInterval(timeInterval);
					}
					else {
						timeSpan.classList.add("h-shadow");
						timeSpan.textContent = sc.loc[59];
						if (bs.cw.current > 0) {
							d.getElementById('js-provStatus').textContent = sc.loc[61]+" ("+sc.loc[32]+")";
						}
						clearInterval(timeInterval);
					}
				}
				else {
					timeSpan.textContent = sc.loc[38];
				}
				timeJump = true;
			},
			mapFix: function(name) { // map name fixer
				var fixedNames = {
					"114_czech/name": "Pilsen"
				};
				return (fixedNames[name]) ? fixedNames[name] : name;
			},
			updater: function () { // updater handler
				var dateNow = new Date(),
				newDate = [dateNow.getHours(), dateNow.getMinutes()],
				newTime = ((newDate[1] >= 15 && newDate[1] <= 45) ? [newDate[0],"30"] : ((newDate[1] <= 15) ? [newDate[0],"00"] : [(newDate[0]+1),"00"]));
				if (bs.time.r[0] !== newTime[0] || bs.time.r[1] !== newTime[1]) {
					bs.time.r = newTime;
					bs.dyn = {conc:[],plan:0,check:0,gold:0};
					bs.table.s = [];
					sf.request("mainData", bs.api.clan, sf.handlerMain);
					// insert update timestamp
					d.getElementById('js-batttleUpdate').textContent = new Date().toLocaleTimeString("en-GB");
				}
			},
			request: function (name, api, handler, mode, extra) { // request handler
				GM.xmlHttpRequest({
					method: "GET",
					url: api,
					headers: {
						"Accept": "application/json"
					},
					onload: function(resp) {
						var data = JSON.parse(resp.responseText);
						if (resp.status == 200) {
							if (sc.debug) {console.info(name, data, new Date().toLocaleTimeString("en-GB"));}
							handler(data, extra);
						}
						else {
							sf.handlerError(name, resp);
						}
					},
					onerror: function(resp) {
						console.error("Error:", name, api, resp);
					}
				});
			}
		};

		// api links without account id
		sc.api.i = "http://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/account/info/?application_id="+sc.api.wg_key+"&account_id=";
		sc.api.v = "http://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/account/tanks/?application_id="+sc.api.wg_key+"&account_id=";

		// fetch wnefficiency values - check if array exists in localStorage, otherwise fetch and reload page
		var wn = {
			stat: [],
			values: sf.storage("wnExpValues", "", "get", "parse"),
			date: sf.storage("wnExpDate", "", "get", "parse")+12096e5 >= sc.date.now, // true if timestamp is less than 2 weeks old, refresh list if false.
			vers: sf.storage("wnExpVers", "", "get", "parse") || ""
		};
		if (wn.vers[0]==sc.vers && wn.values && wn.date) {
			wn.stat = wn.values.data;
		}
		else {
			sf.request("wnData", sc.wn, sf.wn);
		}

		// fetch stored clanlist stats - check if array exists in localStorage, otherwise tag fetching to true
		var ss = {
			val: sf.storage("statScriptValues_"+wg.clan.id, "", "get", "parse"),
			date: sf.storage("statScriptDate_"+wg.clan.id, "", "get", "parse")+6048e5 >= sc.date.now, // true if timestamp is less than 1 weeks old, refresh list if false.
			clan: {},
			user: {},
			statFetch: false
		};
		if (ss.val && ss.date) {
			ss.clan = ss.val.clan;
			ss.user = ss.val.user;
		}
		else {
			ss.statFetch = true;
		}

		// inserting style into head
		var style = sf.elem("style", "wotstatscript", "", {type:"text/css"});
		d.head.appendChild(style);

		// region settings for external sites
		switch(wg.srv) {
			case ("eu"): // eu server
				sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.wlf = sc.srv.ct = sc.srv.kttc = sc.srv.ch = sc.srv.wr = sc.srv.we = wg.srv;
				break;
			case ("ru"): // ru server
				sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.ct = sc.srv.kttc = sc.srv.wots = sc.srv.ch = sc.srv.wr = wg.srv;
				break;
			case ("na"): // na server - american english
				sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.wlf = sc.srv.ct = sc.srv.kttc = sc.srv.ch = wg.srv; sc.srv.wr = "com";
				break;
			case ("asia"): // asia server
				sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = "sea"; sc.srv.ct = sc.srv.kttc = sc.srv.ch = wg.srv; sc.srv.wr = "com";
				break;
			case ("kr"): // korean server
				sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.cs = sc.srv.ct = sc.srv.ch = wg.srv; sc.srv.wr = "com";
				break;
			default: break;
		}

		// set script language to english if an unsupported language is detected
		if (sc.locSet.sup.indexOf(sc.locSet.cur) == -1) {
			sc.locSet.cur = "en";
		}

		// process localization
		for (var _l=0, l_len = sc.loc.length; _l<l_len; _l++) {
			var langLoc = sc.loc[_l][sc.locSet.cur];
			if (sc.locSet.cur !== "en" && langLoc == sc.loc[_l].en && !sc.loc[_l].f) {
				sc.locSet.miss ++;
				console.info("Missing translation at line "+(_l+825)+" - en:\""+sc.loc[_l].en+"\"", sc.locSet.cur+":\""+sc.loc[_l][sc.locSet.cur]+"\"");
			}
			sc.loc[_l] = langLoc;
		}

		// add language to body classname for language based styling
		d.body.classList.add("lang-"+sc.locSet.cur);

		// variables for css and data uri
		var css = {
			u: {
				cIcons: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAACgCAMAAAAy5xwmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK7UExURUxpcWV+bG+/jnacsI2z0I+z0JCzzqDAsqXAt6mwjrG/0rPAwr7BzL/D0sDBzdGli9Kyn////3qsYKWJZ1VTZS2Szlm3c1y7cmC5cWRoZWVrZ86LTdGOR9OKSS2RzS2Szi2Tzy+SzVm2c1m3c2C5cWVrZ4J/hc6LTc+NRtCNR9GbbCiU1F29eIGChdCOR9yGOh6R11e8c+KIOB6S2BSR3iGT2Uu+cVi8dPehhVBOlUqkxTyqwTYmS+rBihgYGEeyyUVUtciUVurTn5pNG/R0WTyqwdrhhaTM2Xcnqz+wyPT5+xkXFDFly/+BhRgXFUOxydurZv/0xykpKaBYHb7BzMXDy38axfvxhRsaGvhrBXAxlv+ChTNly77BzL7BzL/BzUCvyMXDy77BzMDF08PC0cXB0sXDy8jEy77BzMPB0M/i4L3D0cHBzrzG177BzL/Czb/CzS4oKP9rAEGvx/+Ghe3nzzCT0zJUoYfG5e7Eih8dHH8axf/nhUGxybzl9jFlyykpKXI1lMuXaWFoIv+Ahdj9hWKn1Nfp9PLs4RsZGv9sAaNdev+phT6txDJlzCopKaDqhf9/hb7BzGJgYWJiYduIPhyR1x+T2iGT2CKT2FS8cFa9dVe9dVi+dGZlZmZmZn8axduKQduKQ9yKQTyqwXAxltU5LiIgH+fIn77BzPVhCvrv1R+T2h+T2yGT2iKS1yKS2CKT2Fa9dVi+dGZkZmZmZtqJQ9qKQ9uJQ9uKQ9yKQdyLQeicAGJUZdfs+f9qACYmJh+T2iKT2Fa9dVi9dFi+dGZkZmZmZtuKQ9yLQb7BzH8axTJn0TyqwSEXFiQjIykoKDAiITgrKUUyMFBBN2tGQnAxlnen13h0a3lMR6LT66WZlbqRrr7BzL7Bzb/CzcDDrcTQ3OPSvuX2/Pb7/P758P9qAP/z2v///9BBknIAAADOdFJOUwAAAAAAAAAAAAAAAAAAAAAAAAEBBQoKCgoKCgoKCgsLCwsLCwsLCwsLCwsMDAwMDA0NDQ4PDw8PEBETFxgiLzE1OTk+QUROT1JVVVZXX2pvcXF2eHh5fX2AgIGBhoiJiYqMjY2NjY2Njo6Oj4+Tk5OUnJ+goaWqqqqqq6yztLS3ub29vsPExsbGysrQ0NHT1tfb4+Tk5OXl5eXl5eXl5eXl5eXl6Ojq6+3w8PH09PT09PT09PT09PT09PT09fb29vf4+Pj4+Pj4+Pj7/f7+oQ6AsQAABQ9JREFUSMe9lYlXG1UUh6/7vlTHfWnVKuK+m04niwKBNBC0qKQh1RG3WrUaAlVj0xgWZRAIdd9X0qlt3XcLJNZdCDNMJhGKUVuSlD/D+95MJkmPPfZ4PN4Db+793u/ed9/M4wHw72wpP5BIWIuxdWA4kXCAxWfEicRwDSyJ+GAJBcFEgl8KzOOyBW4hcQ3GDIkjDIzXIfAnhlHpk+XlUDf+GILhhB9guSzHMWP8TQR0gbgsRwDBOAU1RIAZOiDGReQIV9YrwzHwP5pXG0Mhr9dW7yVGwQQ1b0EVCg1SEAqxmh59CA3avCEU1QPQWW/9BFtPPU0wOFg/GCKKiZCeUjC9rq1g/912PNF0wehr9Rhh2kMFxfmo9p413xAwFHhshiCMIIodhnWBJw3pMKldpy2BD9CUTDRMvijWApqBWnJUMDFNihKffFvaEl2lTjsCUQOkaVY4XQRRXMKm9au3HmZ0QbSwOU+dsUF9+3SMevZ4N2Z72cli7END5lKA8ZAd7EVmMvfYe6Cnp5hm7zHZwdRTlDQ34ySzzm4U1dzmZmPRdVRs7kednczZ19Fypn4z/vabANq1ZKa9ARraW1rA1K2Xb2g3dVebNpiru/UGzN0N7Qy0EJHeYPeG6sKoWUs70TZsMBl7oB5j3vuR4VwBCzBun8X4k5QkJwJJdNF1uYAsBSwcZwlIopPUwhm3KyBGfK6AJFg4YAQp4BRHZ2fVuChLYgAsohSPy9Pq9LQsipLghoCEJivqrEqcAAdu8pSU6VGZAgYsApWoCp3AhRknZgrCaEQQ0CG9cW4s5XK7cGm9M5IUV+K4plu7QxiLG9XYgpMzbhOLS3A7LXu5U3xivMREH4hSicmyCPHSeHQ0UgYi4aeqNCDTjYjOFbE+CmRVJQ939eZ8jIJIV5dTkISqvrwO3Cs2r6jqamrL64BMxfpGRmI6wFro5UdG8hQIkg9rGRaDKh/NLYK+jRtjZSC2uSSBgny+HLTFyqxtn64Ydk+XLwLiWlne+Fdj9bNWYHl2QE9iB6w46eD9jiAlbNDh5x3A843+xiD5Swqiw/NgRYk1yDIMJqAAazT6g44g8H7Ah7+RJDt43sEGgyx5at+a5R28A394q/G5mQGGGWBLu7eSDvf1OuWESTzz2khNmJyclPSR2iQxfaQmUlcsAvQlY/xbmyoaRu4pmFIUZTapaCCAg5JMJrOzKuIpEAlNqqqaRZJUFJoOaiqVyiJJJhVAmQKpmZkZjFNqMglJQmcImE2lVDUJEQ2kUhgjUIHz6YoZQhFgH8o/vJva68rB+rEOzaldRmz1XK73Bg3smEfLzec69WvINkfA/CajwMMaeFQP12bnDdtSheCR+RLrJGuVArLs2pJ40/WkibHdTetzncuym6rmcjeSGnO5jrH53iezWzqyu+kyv84VMnK9TbTxJ3bt/HPnb7t2dKyu3afzseDIot307tMLykBr5pcysCpz+80FsGYNie856EAdtGYyK2/N3H3wZVdqYFXmtpWZ3+84/MLnX6RgVebeo4964L5jD7hq+3YCWjN3Hbr/YcdccMXxV7//EYIH/7jzkMuvOe7S594646z3CHjo/iMuevnVky756eeKRVsJuPi8/a797tvFlV9tq1hEFc8+c8rZn3y8uPKLbRULt36I4Mcfzj0HwfmfE/ABgs8+paDyy68rzqQ1iOJ7rIFFF35D+njj9VNPfO2Vk09/+53TTnjhpQV/AasrpIaeUd4CAAAAAElFTkSuQmCC",
				arrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAMAAAB1GNVPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAPUExURf///////////0xpcf///17pIXYAAAAEdFJOU393iAAiK7rGAAAAH0lEQVQI1w3GwQEAMBBEQBf6rzn7YeipxA0bXoU4LB8EgABGoTqNxwAAAABJRU5ErkJggg=="
			},
			i: {
				arrow: "http://static-ptl-eu.gcdn.co/static/wot/common/css/scss/content/links/img/orange_arrow.png"
			}
		};

		// style contents
		var styleClan = [
			// loading text
			".processing.wn8-loader span {margin: 25px 0px 0px -20px; text-align: center; width: 45px; position: absolute; top: 50%; left: 50%;}",
			// links menu rules
			".menu-clan_links {padding: 0;}",
			".menu-clan_links.cm-parent-link__opened {border: 1px solid #313335;}",
			".menu-clan_links .menu-top_link {cursor: pointer; padding: 0 8px 0 9px;}",
			".menu-clan_links .menu-top_link.cm-parent-link__opened {background: #0E0E0E; border-left: 1px solid #313335; border-right: 1px solid #313335; margin-left: -1px;}",
			".menu-clan_links .cm-arrow {background-image: url('"+css.u.arrow+"'); display: inline-block; margin-left: 5px; opacity: 0.5; vertical-align: middle; transition: opacity 0.2s ease 0s; height: 4px; width: 7px;}",
			".menu-clan_links .cm-parent-link__opened .cm-arrow {opacity: 1; transform: rotate(180deg);}",
			".menu-clan_links .clan-links {background: rgba(14, 14, 14, 0.99); border: 1px solid #313335; display: none; box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4); margin-left: -1px; padding: 14px 16px; position: absolute;}",
			".menu-clan_links .cm-sublist__opened {display: block;}",
			".menu-clan_links .clan-links td {padding: 0 10px;}",
			".menu-clan_links .clan-links a {color: #E5E5E5; font-family: Arial,'Helvetica CY',Helvetica,sans-serif; font-size: 14px;}",
			".sl-icon {background: url('"+css.u.cIcons+"') no-repeat; display: inline-block; margin: -2px 8px 0px 0px; vertical-align: middle; height: 16px; width: 16px;}",
			".sl-wl {background-position: 0px 0px;}",
			".sl-nm {background-position: 0px -16px;}",
			".sl-ct {background-position: 0px -32px;}",
			".sl-cs {background-position: 0px -48px;}",
			".sl-kttc {background-position: 0px -64px;}",
			".sl-wlife {background-position: 0px -80px;}",
			".sl-as {background-position: 0px -96px;}",
			".sl-wr {background-position: 0px -112px;}",
			".sl-vb {background-position: 0px -128px;}",
			".sl-we {background-position: 0px -144px;}",
			// rating profile rules
			".rating-profile {width: 70%; margin: 0px auto;}",
			".profile__main .link__script {position: absolute; right: 11px; top: 10px;}",
			// settings menu rules
			"#common_menu .menu-settings {color: #7C7E80; display: inline-block;}",
			"#common_menu .menu-settings .cm-user-menu-link {margin: 0 10px 0 0;}",
			"#common_menu .menu-settings .cm-user-menu-link_cutted-text {max-width: unset;}",
			"#common_menu .menu-settings .cm-user-menu {min-width: 200px; padding: 15px;}",
			"#common_menu .menu-settings .cm-parent-link:hover {cursor: pointer;}",
			"#common_menu .menu-settings .b-settingItem {margin: 6px 0px; text-align: center;}",
			"#common_menu .menu-settings label {display: table; line-height: normal; cursor: pointer; margin: 0 auto;}",
			"#common_menu .menu-settings .l-box {display: none;}",
			"#common_menu .menu-settings .b-checkbox {background-position: -4px -4px; height: 16px; width: 16px; float: left; margin-right: 5px;}",
			"#common_menu .menu-settings .b-checkbox.b-checkbox__checked {background-position: -28px -4px;}",
			"#common_menu .menu-settings .b-checkbox .b-checkbox_checker {background-position: -76px -4px; height: 16px; width: 16px;}",
			"#common_menu .menu-settings .b-combobox-label__checked {color: #DCDCDC;}",
			"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover {color: #DCDCDC;}",
			"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox {box-shadow: 0px 0px 10px 1px rgba(191, 166, 35, 0.15), 0px 0px 3px 1px rgba(191, 166, 35, 0.25);}",
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
			"#common_menu .menu-settings .settingCredits .b-orange-arrow {background: url('"+css.i.arrow+"') 100% 0 no-repeat; color: #F25322; line-height: 14px; padding-right: 9px;}",
			"#common_menu .menu-settings .settingCredits .b-orange-arrow:hover {color: #FF7432;}",
			"#common_menu .menu-settings .settingCredits.settingSeperator {border-top: 1px dashed #212123; margin-top: 6px; padding-top: 12px;}",
			"#common_menu .menu-settings .settingCredits.settingSeperator.b-wnRefresh {margin-top: 11px; padding-top: 6px;}",
			"#common_menu .menu-settings .settingCredits.settingLinks a {margin: 0 5px;}",
			// memberpage rules
			".page-header_meminfo {display: inline-block; margin: 0px auto; position: absolute; top: 3px; right: 0px; left: 0px; text-align: center;}",
			".page-header_meminfo span {margin: 0 5px;}",
			".page-header_ban {color: #E5B12E;}",
			".page-header_mem {color: #E5B12E;}",
			".js-page-header-view .page-header_mem {margin-left: 25px;}",
			// button fetch rules
			".b-button-stats {border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2px; position: absolute; right: 0; top: 9px;}",
			".b-button-stats a {background: rgba(255, 255, 255, 0.1); color: #FFFFFF; cursor: pointer; font-size: 17px; line-height: 45px; display: block; padding: 0px 15px; transition: all 0.2s ease 0s;}",
			".b-button-stats a:hover {background: rgba(229, 177, 46, 0.25);}",
			// rating players rules
			".rating-players {height: 200px;}",
			".rating-players tbody {width: 95%; display: table; margin: 0px auto;}",
			".rating-players_item__data {padding-top: 25px; width: 14%;}",
			".rating-players_item__average {padding-top: 10px; width: 16%;}",
			".rating-players_stats {font-size: 40px;}",
			// membertable rules
			".js-expander-link-view {display: table; position: absolute; top: 333px;}",
			"#js-playerslist-table {margin-top: 7px;}",
			".tbl-rating_th.tbl-rating_th__right a.js-sort-field_days {display: table; margin: 0 auto;}",
			".tbl-rating_th.tbl-rating_th__right a.js-sort-field_days span {line-height: 44px;}",
			".tbl-rating_td.tbl-rating_td__right span {display: table; margin: 0 auto;}",
			".player_time {position: absolute; right: 0; top: 18px;}"
		];
		style.textContent = styleClan.join("");
		// end style

		// add animated loading icon for progress indication
		var loadGif = sf.elem("div", "processing wn8-loader js-hidden", "<span id='js-wn8-status'></span>");
		d.body.appendChild(loadGif);

		// load and store settings
		sc.set = {
			onPageload: sf.storage("statScript_onPageload", "", "get", "parse"),
			useWhitelist: sf.storage("statScript_whitelist", "", "get", "parse"),
			listWhitelist: sf.storage("statScript_whitelist_list", "", "get"),
			eventOnly: sf.storage("statScript_eventOnly", "", "get", "parse")
		};
		bs.cw.status = sc.set.eventOnly;

		// script link and settings
		var clanSet_div = sf.elem("div", "menu-settings menu-top_item", "<a class='cm-user-menu-link' href='#' onClick='return false;'><span class='cm-user-menu-link_cutted-text'>"+sc.loc[3]+"</span><span class='cm-arrow'></span></span>"),
		clanSet_list = sf.elem("ul", "cm-user-menu", ""),
		clanSet_list_locItem = sf.elem("li", "b-settingItem settingCredits settingSeperator", ""),
		whitelistArray = (sc.set.listWhitelist) ? sc.set.listWhitelist.split(",") : "",
		clanSet_list_items = [
			sf.settings("onPageload", sc.loc[4], sc.set.onPageload, false),
			sf.settings("whitelist", sc.loc[5], sc.set.useWhitelist, false, sc.set.listWhitelist),
			sf.settings("eventOnly", sc.loc[58], sc.set.eventOnly, false),
			sf.settings("wnRefresh", sc.loc[6]+" [v"+wn.vers[1]+"]"),
			sf.settings("cleanStorage", sc.loc[7]),
			sf.elem("li", "b-settingItem settingCredits settingSeperator", "<p>Version: "+sc.vers+"</p>"),
			sf.elem("li", "b-settingItem settingCredits", "<p>"+sc.loc[20]+" <a class='b-orange-arrow' href='"+sc.user.wot+"'>Orrie</a></p>"+((sc.cred[sc.locSet.cur]) ? "<p>"+sc.loc[21]+" ("+sc.locSet.cur.toUpperCase()+"):</p><table>"+sc.cred[sc.locSet.cur]+"</table>" : "")),
			sf.elem("li", "b-settingItem settingCredits settingLinks", "<p><a class='b-orange-arrow' href='"+sc.host+"'>Greasy Fork</a><a class='b-orange-arrow' href='"+((wg.srv == "na") ? sc.top.na : sc.top.eu)+"'>Support Thread</a></p>")
		];
		if (sc.locSet.sup.indexOf(sc.locSet.cur) == -1) {
			clanSet_list_locItem.innerHTML = "<h1>Script Translation</h1><p>Unsupported language detected!</p><p>If you want to contribute with translation, please contact <a class='b-orange-arrow' href='"+sc.user.wl+"'>Orrie</a></p>";
			clanSet_list_items.push(clanSet_list_locItem);
		}
		else if (sc.locSet.miss > 0) {
			clanSet_list_locItem.innerHTML = "<h1>Script Translation</h1><p>Currently "+sc.locSet.miss+" out of "+_l+" strings not translated in your language!</p><p>If you want to contribute, open the browser console, translate the strings and send them to <a class='b-orange-arrow' href='"+sc.user.wl+"'>Orrie</a></p>";
			clanSet_list_items.push(clanSet_list_locItem);
		}
		sf.links(clanSet_list, clanSet_list_items);
		clanSet_div.firstElementChild.addEventListener('click', function() {this.classList.toggle('cm-user-menu-link__opened'); this.nextSibling.classList.toggle('cm-user-menu__opened');}, false);
		clanSet_div.appendChild(clanSet_list);
		// add script info and settings if user menu exists, else wait
		var navMenu = d.getElementById('common_menu'),
		navUser = (navMenu) ? d.getElementsByClassName('cm-menu__user')[0] : false;
		if (navUser) {
			navUser.appendChild(clanSet_div);
		}
		else {
			var setLook = new MutationObserver(function() {
				navUser = d.getElementsByClassName('cm-menu__user')[0];
				navUser.appendChild(clanSet_div);
				setLook.disconnect();
			});
			setLook.observe(d.body, {childList: true});
		}

		// clan statistic links - observe html change for clan name
		var emblems = [
			d.getElementsByClassName('page-header_emblem')[0], // first method
			d.getElementsByClassName('clan_name')[0], // second method
			d.getElementsByClassName('js-clan-name')[0] // third method - your own clan
		];
		if (emblems[0] || emblems[1]) {
			sf.clan();
		}
		else {
			var clanInfo = d.getElementById('js-general-info-block'),
			nameLook = new MutationObserver(function() {
				sf.clan();
				nameLook.disconnect();
			});
			if (clanInfo) {
				nameLook.observe(clanInfo, {childList: true});
			}
			else if (emblems[2]) {
				sf.clan();
			}
		}

		// check if on clan profile page
		if (wg.p) {
			var clanRating = d.getElementById('js-rating-block'),
			clanProfileValue = d.getElementsByClassName('rating-profile_item');
			if (clanProfileValue.length === 0) {
				var ratingLook = new MutationObserver(function() {
					if (ss.clan) {
						sf.clanInsert("main");
					}
					sf.clanInsert("bslink");
					ratingLook.disconnect();
				});
				ratingLook.observe(clanRating, {childList: true});
			}
			else {
				if (ss.clan) {
					sf.clanInsert("main");
				}
				sf.clanInsert("bslink");
			}
		}

		// check if on memberlist page
		if (wg.m) {
			// formula calculations and variables
			var memObj = {
				cls: d.getElementsByClassName('tbl-rating_body')[0],
				ids: [],
				bans: {ids:[],f:false}
			};

			// add manual stat fetching button
			var filter_class = d.getElementsByClassName('filter')[0],
			refreshBtn_div = sf.elem("div", "b-button-stats", "<a>"+sc.loc[12]+"</a>");
			refreshBtn_div.addEventListener('click', function() {sf.tableFetch();}, false);
			filter_class.appendChild(refreshBtn_div);

			// prepare stat fetcher, store stats in localStorage and reload page
			var ratLook = new MutationObserver(function() {
				sf.tableFetch();
				ratLook.disconnect();
			});

			// fetch stats automatically if enabled or check whitelist for whitelisted clan
			if (ss.statFetch && (sc.set.onPageload || (sc.set.useWhitelist && whitelistArray.indexOf(wg.clan.id) > -1))) {
				ratLook.observe(memObj.cls, {childList: true});
			}
			else {
				// no stats fetching, check if stats already exist and add if they do
				var statsInsertionStatus = false,
				headerInsertionStatus = false;
				// add clan total stats if they exist
				var clanStatsPanel = d.getElementsByClassName('js-clan-statistics-container')[0],
				statsLook = new MutationObserver(function() {
					sf.clanInsert("list");
				});
				if (sc.web.chrome) {
					sf.clanInsert("list");
				}
				else {
					statsLook.observe(clanStatsPanel, {childList: true});
				}
				// wait for table to be filled before adding wn8
				if (memObj.cls.childElementCount === 0) {
					var ratInsert = new MutationObserver(function(muto) {
						if (muto[0].previousSibling === null) {
							sf.ratInsert();
						}
					});
					ratInsert.observe(memObj.cls, {childList: true});
				}
				else {
					sf.ratInsert();
				}
			}
		}
		else if (wg.sb) { // check if on globalmap page for battle scheduler
			// inserting style into head
			var styleSch = [
				"h3 {text-align: center;}",
				".page-header {padding: 60px 0 25px;}",
				".layout_holder__normal {max-width: unset;}",
				".b-battles {font-size: 14px; margin: 0px 0 60px; width: 100%;}",
				".b-battles .h-battles {border-bottom: 1px solid #000; box-shadow: inset 0 -1px rgba(255,255,255,.05); font-size: 15px; position: relative;}",
				".b-battles .h-battles .h-battles-info {text-align: center;}",
				".b-battles .h-battles .h-battles-info img {max-height: 16px; vertical-align: bottom;}",
				".b-battles .h-battles .h-battles-info .h-shadow {font-weight: bold; text-shadow: 0px 0px 1px rgba(27,27,28, 1), 0px 0px 2px rgba(27,27,28, 1);}",
				".b-battles .h-battles .h-battles-infotable {margin: 10px auto; min-width: 150px;}",
				".b-battles .h-battles .h-battles-infotable td {padding: 0 2px;}",
				".b-battles .h-battles .h-battles-infotable td.gold {padding-right: 16px;}",
				".b-battles .b-battles-holder {background-color: rgba(0, 0, 0, 0.75);}",
				".b-battles .b-battles-holder .t-battles {border-spacing: 0; box-shadow: inset -1px 0 rgba(255,255,255,.05); text-align: center; width: 100%;}",
				".b-battles .b-battles-holder .t-battles thead tr {}",
				".b-battles .b-battles-holder .t-battles tbody tr:nth-child(even) td {background-color: rgba(80, 60, 60, 0.1);}",
				".b-battles .b-battles-holder .t-battles tbody tr:nth-child(odd) td {background-color: rgba(123, 123, 123, 0.1);}",
				".b-battles .b-battles-holder .t-battles tbody tr:hover {background-color: rgba(100, 100, 100, 0.20);}",
				".b-battles .b-battles-holder .t-battles thead tr th.t-"+bs.time.t+", .b-battles .b-battles-holder .t-battles tbody tr td.t-"+bs.time.t+" {background-color: rgba(254,252,223, 0.15); border-left: 1px solid #808080; border-right: 1px solid #808080;}",
				".b-battles .b-battles-holder .t-battles thead tr th.t-"+bs.time.t+" + th, .b-battles .b-battles-holder .t-battles tbody tr td.t-"+bs.time.t+" + td {background-color: rgba(224,223,218, 0.1); border-right: 1px solid #808080;}",
				".b-battles .b-battles-holder .t-battles tr .t-border {border-right: 2px solid rgba(194, 173, 173, 0.1);}",
				".b-battles .b-battles-holder .t-battles tr th {line-height: 35px; border-top: 1px solid rgba(255,255,255,.1); box-shadow: inset 1px -1px rgba(255,255,255,.05); position: relative;}",
				".b-battles .b-battles-holder .t-battles tr th .sorter_caption {margin: 0; line-height: unset;}",
				".b-battles .b-battles-holder .t-battles tr th .sorter::after {margin-top: "+((sc.web.chrome) ? "-1" : "-2")+"px;}",
				".b-battles .b-battles-holder .t-battles tr th:hover {color: #FFFFFF;}",
				".b-battles .b-battles-holder .t-battles tr th:hover .sorter::after {opacity: 1;}",
				".b-battles .b-battles-holder .t-battles tr th.sort-up, .b-battles .b-battles-holder .t-battles tr th.sort-down {color: #DADADB;}",
				".b-battles .b-battles-holder .t-battles tr th.sort-up .sorter::after {background-position-y: -10px; margin-top: "+((sc.web.chrome) ? "-3" : "-4")+"px; opacity: 1;}",
				".b-battles .b-battles-holder .t-battles tr th.sort-down .sorter::after {background-position-y: -5px; opacity: 1;}",
				".b-battles .b-battles-holder .t-battles tr td {line-height: 27px; border-top: 1px solid rgba(255,255,255,.1); border-bottom: 1px solid #000; box-shadow: inset 1px -1px rgba(255,255,255,.05); padding: 0 2px;}",
				".b-battles .b-battles-holder .t-battles tr td:first-of-type {max-width: 125px; width: 125px; overflow: hidden; padding: 0 5px; text-overflow: ellipsis; white-space: nowrap;}",
				".b-battles .b-battles-holder .t-battles tr td.t-title {font-weight: bold;}",
				".b-battles .b-battles-holder .t-battles tr td.t-good {color: #4D7326;}",
				".b-battles .b-battles-holder .t-battles tr td.t-bad {color: #930D0D;}",
				".b-battles .b-battles-holder .t-battles tr td.t-plan {color: #FFE400;}",
				".b-battles .b-battles-holder .t-battles tr td.t-fight {color: #4D7326; font-size: 15px; font-weight: bold;}",
				".b-battles .b-battles-holder .t-battles tr td.t-noFight {color: #808080; font-size: 14px;}",
				".b-battles .b-battles-holder .t-battles tr td.t-fight.t-noOwner {color: #808080;}",
				".b-battles .b-battles-holder .t-battles tr td.t-error {color: #CD2911;}",
				".b-battles .b-battles-holder .t-battles tr.t-cwText td {font-size: 26px; line-height: 54px;}",
				".b-battles .b-battles-holder .t-battles tr.timeShift td:nth-child(3) {color: #56E000;}",
				".b-battles .b-battles-holder .t-battles tr.timeShift td .t-timeShift {font-size: 12px; position: absolute;}",
				".b-battles .b-battles-holder .t-battles img {height: 16px; margin-bottom: 5px; vertical-align: bottom;}",
				".b-battles .f-battles {border-top: 1px solid #000; box-shadow: inset 0 1px rgba(255,255,255,.05); font-size: 15px; padding: 10px 0; text-align: center;}",
				".b-battles .f-battles img {max-height: 16px; vertical-align: bottom;}",
				".b-battles .l-battles table {margin: 0 auto;}",
				".b-battles .l-battles table tr td.t-fight, .b-battles .l-battles table tr td.t-noFight {text-align: center; padding: 0 5px 0 15px;}",
				".b-battles .t-bold {font-weight: bold;}",
				".b-battles .t-title {font-weight: bold;}",
				".b-battles .t-good {color: #4D7326;}",
				".b-battles .t-bad {color: #930D0D;}",
				".b-battles .t-plan {color: #FFE400;}",
				".b-battles .t-fight {color: #4D7326; font-size: 15px; font-weight: bold;}",
				".b-battles .t-noFight {color: #808080; font-size: 14px;}",
				".b-battles .t-fight.t-noOwner {color: #808080;}",
				".b-battles .t-error {color: #CD2911;}",
				".b-battles .t-elo {margin-left: 3px;}",
				".b-battles .t-gold {color: #FFC364;}",
				".b-battles .t-green {color: #4D7326;}",
				".b-battles .t-red {color: #930D0D;}",
				".b-battles .t-battle {display: none;}",
				".b-battles .t-time {display: none; position: relative;}",
				".b-battles .b-display-none {display: none;}",
				".b-battles .b-display-block {display: block}"
			];
			style.textContent += styleSch.join("");

			// prepare static html and table reference for further use
			var layout_holder = d.getElementsByClassName("layout_holder")[0],
			battlesPanel = sf.elem("div", "b-battles", "<div class='h-battles'><div class='h-battles-info'>"+sc.loc[23]+" <span id='js-timePrime'>Ɵ</span></div><table class='h-battles-infotable'><tr><td>"+sc.loc[24]+"</td><td id='js-battles'>0</td><td>"+sc.loc[60]+"</td><td id='js-battlesConc'>0</td></tr><tr><td>"+sc.loc[25]+"</td><td class='gold'><span id='js-gold'>0</span><i class='i i__currencies i__gold'></i></td><td id='js-goldInfo'></td></tr></table></div><div class='b-battles-holder'><table class='t-battles sortable'><thead><tr><th><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[26]+"</span></a></th><th><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[27]+"</span></a></th><th id='js-sort' class='sort-default' data-sort-method='number' data-sort-order='desc'><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[28]+"</span></a></th><th class='t-gold'><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[30]+"</span></a></th><th class='t-fame'><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption' id='js-fame'>"+sc.loc[29]+"</span></a></th><th><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[31]+" ("+sc.loc[32]+")</span></a></th><th><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[33]+"</span></a></th><th><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span id='js-provStatus' class='sorter_caption'>"+sc.loc[34]+"</span></a></th><th class='t-battle'><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[35]+"</span></a></th><th class='t-battle t-border'><a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+sc.loc[36]+"</span></a></th></tr></thead><tbody></tbody></table></div><div class='f-battles'>"+sc.loc[37]+" <span id='js-batttleUpdate'>Ɵ</span> [UTC"+((bs.time.o >= 0) ? "+" : "")+bs.time.o+"]<span id='js-error'></span></div><div class='l-battles'><table><tr><td class='t-fight'>&#9876;</td><td>"+sc.loc[64]+"</td><td class='t-noFight'>&#9876;</td><td>"+sc.loc[65]+"</td><td class='t-fight'>♖</td><td>"+sc.loc[66]+"</td><td class='t-fight t-noOwner'>♖</td><td>"+sc.loc[67]+"</td><td class='t-fight'>+</td><td>"+sc.loc[68]+"</td></tr><tr><td colspan='2'></td><td class='t-noFight t-bold'>&#10132;</td><td>"+sc.loc[69]+"</td><td colspan='2'></td><td class='t-noFight t-bold'>&#9992;</td><td>"+sc.loc[70]+"</td><td colspan='2'></td></tr></table></div>"),
			battleTable = battlesPanel.children[1].firstElementChild,
			layoutLook = new MutationObserver(function() {
				layout_holder.insertBefore(battlesPanel, layout_holder.children[1]);
				layoutLook.disconnect();
			});
			if (layout_holder.childElementCount > 0) {
				layout_holder.insertBefore(battlesPanel, layout_holder.children[1]);
			}
			else {
				layoutLook.observe(layout_holder, {childList: true});
			}

			// time cells for header and body rows
			var timeCells = bs.table[wg.srv],
			timeFragment = d.createDocumentFragment();
			for (var _tc=0, _tc_len = timeCells.length; _tc<_tc_len; _tc++) {
				var t = timeCells[_tc],
				times = [sf.time(t,"00","s"), sf.time(t)+":00", sf.time(t,"30","s"), sf.time(t)+":30"];
				timeFragment.appendChild(sf.elem("th", "t-time "+times[0], "<a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+times[1]+"</span></a>"));
				bs.table.c += "<td class='t-time "+times[0]+"'></td>";
				if (_tc !== _tc_len-1) {
					timeFragment.appendChild(sf.elem("th", "t-time "+times[2], "<a href='#' class='sorter js-table-sorter js-sort-field_localized_front_name'><span class='sorter_caption'>"+times[3]+"</span></a>"));
					bs.table.c += "<td class='t-time "+times[2]+"'></td>";
				}
			}
			battleTable.firstElementChild.firstElementChild.appendChild(timeFragment);

			// add intervals for time and round updater
			var timeJump = false,
			timeInterval = setInterval(sf.timer,1000), // 1 second
			updateInterval = setInterval(sf.updater,120000); // 2 minutes

			// activate tablesort function
			var sortTable = false;
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

			// insert update status
			battleTable.lastElementChild.appendChild(sf.elem("tr", "t-cwText", "<td colspan='8'>"+sc.loc[38]+"</td>"));

			// send request to wargaming api to see if an event is running
			sf.request("eventData", bs.api.event, sf.handlerEvent);
		}
	});
	pageLook.observe(d.body, {childList: true});
}(window));
