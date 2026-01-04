// ==UserScript==
// @name         Panel Dodatków NI
// @namespace	 http://the-crudness.xaa.pl/NIAddons/panel.user.js
// @version      2.6.5.2
// @description  Dodaje do wbudowanego panelu dodatków inne dodatki.
// @author       Priweejt
// @include		 http://*.margonem.com/
// @include		 http://*.margonem.pl/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381031/Panel%20Dodatk%C3%B3w%20NI.user.js
// @updateURL https://update.greasyfork.org/scripts/381031/Panel%20Dodatk%C3%B3w%20NI.meta.js
// ==/UserScript==
// ==Changelog==
// 2.6 - w sumie to samo co 2.5
// 2.5 - znów pełno zmian w API, kolejny nowy dodatek
// 2.4 - pierdyliard zmian w API, nowy dodatek, usunięte na obecną chwile dodatki darrefulla bo mu hosting padł czy coś
// 2.3 - nowy dodatek, naprawione loader.require
// 2.2 - włączenie dodatku pokazywanie kolizji dla angielskiego margonem, bo działają już tam widgety. Trochę wewnętrznych zmian w tym skrypcie
// 2.1 - dodatek lepsza walka, trochę zmian w tym kodzie żeby łatwiej się robiło dodatki (event emmitery anyone?)
// 2.0.1 - pierwsza nietestowa wersja
// ==/Changelog==
new (function() {
	// check if the script was loaded on the new interface
	if (typeof Engine == "undefined" || typeof parseClanBB == "undefined" || typeof linkify == "undefined") return;
	var addons = this;
	window.priwAddons = this;
	window.API.priw = this;
	var Storage = API.Storage;
	var Templates = API.Templates;
	this.cursors = {
		default: "url(http://aldous.margonem.pl/img/gui/cursor/1.png), auto",
		npctalk: "url(http://aldous.margonem.pl/img/gui/cursor/2.png), auto",
		fight: "url(http://aldous.margonem.pl/img/gui/cursor/3.png), auto",
		grab: "url(http://aldous.margonem.pl/img/gui/cursor/4.png), auto",
		pointer: "url(http://aldous.margonem.pl/img/gui/cursor/5.png), auto"
	};
	this.list = {
		priw_bttr: {
			namePL: "Polepszacz interfejsu",
			nameEN: "Interface enhancer",
			descPL: "Zmienia następujące rzeczy:<br>-można potwierdzać alerty spacją<br>-konieczność potwierdzania zamknięcia karty chatu prywatnego<br>-umożliwia napisanie wiadomości prywatnej bez otwierania karty chatu prywatnego przez kliknięcie prawym przyciskiem myszy wiadomości na chacie<br>-automatycznie uzupełnia przedmiot na dolnym pasku jeśli się skończy<br>-w różny sposób poprawia tipy itemów, czyniąc je generalnie ładniejszymi<br>-poprawia wbudowane w interfejs przełączanie między postaciami (brak czekania 5s przy loganiu na inny świat)<br>-napis 'online' w znajomych jest na zielono<br>-zmienia kolory na chacie ogólnym, czyniąc go bardziej czytelnym (przy włączonym pokazywaniu wszystkich wiadomości w zakładce ogólnej)",
			descEN: "Changes following things:<br>alerts can be confirmed by pressing the space key<br>-confirmation of closing private chat tab is no longer required<br>-makes it possible to write a private message to another player without opening a new chat tab (right click a message on chat to do that)<br>-automatically refills items in the bottom bar when they run out of uses<br>-makes various changes to item tips, making them look more pretty in general.<br>-makes built in change character function better (it's no longer necessary to wait 5 seconds when logging onto a char that's on a different world than the current one)<br>'online' status in friend list now has green font<br>-changes colors in general chat, making it actually readable (with 'show all messages in general chat' option toggled)",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/littleThingsNI.js?4",
			// urlPL: "http://127.0.0.1:1337/littleThingsNI.js?foo",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/littleThingsNI.js?4",
			img: "http://aldous.margonem.pl/img/gui/buttony.png?v=4|-468 -12",
			author: "Priweejt|3779166"
		},
		priw_clbl: {
			namePL: "Błoga klanowe",
			nameEN: "Guild blessings",
			descPL: "Dodaje pod torbami panel wyboru błogosławieństwa klanowego, taki skrót. Nie ma sensu instalować na nakładce NI, bo w starym systemie klanów tych błogosławieństw nie ma.",
			descEN: "Adds shortcuts to guild blessings in the area under the bags.",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/NIblesspanel.js?",
			// urlPL: "http://127.0.0.1:1337/NIblesspanel.js?",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/NIblesspanel.js?",
			img: "http://aldous.margonem.pl/img/gui/buttony.png?v=4|-561 -12",
			author: "Priweejt|3779166"
		},
		priw_ntpd: {
			namePL: "Notatnik",
			nameEN: "Notepad",
			descPL: "Dodaje prosty notatnik, dostępny pod torbami.",
			descEN: "Adds a simple notepad in the area under the bags.",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/notepadNI.js?",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/notepadNI.js?",
			img: "http://aldous.margonem.pl/img/gui/buttony.png?v=4|-437 -12",
			author: "Priweejt|3779166"
		},
		priw_extl: {
			namePL: "Instalator zewnętrznych skryptów",
			nameEN: "External script loader",
			descPL: "Pozwala instalować zewnętrzne dodatki przez wpisanie adresu do skryptu. <a href='https://gyazo.com/42856b0a644881f93b17e27ec02674ac' target='_blank'>Wygląda to tak.</a>",
			descEN: "Allows installing external scripts from a given url, as shown <a href='https://gyazo.com/dbdbffca2a65e982293caef243b96981' target='_blank'>here.</a>",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/NIextLoader.js?",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/NIextLoader.js?",
			img: "http://aldous.margonem.pl/img/gui/buttony.png?v=4|-282 -12",
			author: "Priweejt|3779166",
			widget: {
				color: "blue",
			}
		},
		priw_obw: {
			namePL: "Lepsza walka",
			nameEN: "Better battle",
			descPL: "Dodaje następujące rzeczy do walki:<br>-animowanie przesuwania się postaci<br>-bardziej widoczne pokazywanie naszej tury<br>-mniejsze odległości między postaciami w walce<br>-ilość życia, many i energii w tipach (dymkach) nad postaciami<br>-wybór umiejętności jak na starym interfejsie (można wyłączyć w dolnej części konfiguracji gry)",
			descEN: "Adds following features to the battle window:<br>-characters now move smoothly from place to place, instead of teleporting<br>-better indication of player's turn<br>-distance between characters is smaller<br>-health, energy and mana is shown in tooltips above characters<br>-alternative skill selection method, samilar to how it was on the old interface (this feature can be disabled at the bottom of game config)",
			// urlPL: "http://192.168.0.110:1337/NIoldBattle.js",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/NIoldBattle.js?7",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/NIoldBattle.js?7",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-4 -34",
			author: "Priweejt|3779166"
		},
		priw_mmp: {
			namePL: "miniMap+",
			nameEN: "miniMap+",
			descPL: "Dodaje do gry wielofunkcyjną minimapę. Domyślnie otwiera sie klawiszem [R]",
			descEN: "Adds a multifunctional minimap. Default hotkey to open it is set to [R]. Note that it hasn't been translated to English.",
			urlPL: "http://addons2.margonem.pl/get/64/64196public.js?4",
			urlEN: "http://addons2.margonem.pl/get/64/64196public.js?4",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-158 -12",
			author: "Priweejt|3779166"
		},
		priw_tth: {
			namePL: "Titan Helper+",
			nameEN: "Titan Helper+",
			descPL: "Opis by się tu nie zmieścił, dlatego jest <a href='https://pastebin.com/raw/4JE8Cunn' target='_blank'>tutaj</a>.<br><br>W razie problemów z wyświetlaniem informacji w oknie walki wynikających z małego ekranu, można się przełączyć na alternatywny sposób pokazywania w ustawieniach dodatku (są w ustawieniach gry).",
			descEN: "The description is too long to be put here, so it's on <a href='https://pastebin.com/raw/td5nBRBS' target='_blank'>pastebin</a> instead. <br><br>There may be issues with displaying things on small screens. If that's the case, you can switch to an alternative display method in addon settings (located inside of the game settings).<br><br>Do note that while the addon does work in the English version of the game, displayed strings hasn't been translated to English yet.",
			// urlPL: "http://127.0.0.1:1337/titanHelperPlusNI.js",
			urlPL: "http://addons2.margonem.pl/get/71/71328public.js",
			urlEN: "http://addons2.margonem.pl/get/71/71328public.js",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-4 -34",
			author: "Priweejt|3779166"
		},
		priw_sf: {
			namePL: "ShopFilter",
			nameEN: "ShopFilter",
			descPL: "Dodaje do sklepów dodatkowe opcje filtrowania.",
			descEN: "Adds additional filters to shops.",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/shopFilterNI.js",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/shopFilterNI.js",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-128 -3",
			author: "Priweejt|3779166"
		},
		/*priw_sakwa: {
			namePL: "Sakwa",
			nameEN: "Pouch",
			descPL: "Przywraca funkcjonalną sakwę ze starego interfejsu.",
			descEN: "Restores a functional pouch from the old interface.",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/pouch.js",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/pouch.js",
			img: "/obrazki/npc/mas/nic32x32.gif",
			author: "Priweejt|3779166"
		},*/
		priw_h2h: {
			namePL: "https2http",
			nameEN: "https2http",
			descPL: "Linki które mają z przodu https nie działają na chacie. Dodatek zamienia w wysyłanych wiadomościach https na http i wtedy działają.",
			descEN: "Fixes a bizzare bug that causes links that contain https to not work by replacing https with http in sent messages.",
			urlPL: "http://priweejt.ct8.pl/NIAddons/get/https2httpNI.js",
			urlEN: "http://priweejt.ct8.pl/NIAddons/get/https2httpNI.js",
			img: "http://aldous.margonem.pl/img/gui/buttony.png?v=4|-406 -12",
			author: "Priweejt|3779166"
		},
		groov_gll: {
			namePL: "Global lootlog",
			descPL: "Jest to dodatek, który umieszcza nasze looty heroiczne i legendarne na stronie, aby później móc je przeglądać. Podczas lootnięcia itemu zawsze mamy możliwość zdecydowania, czy ma on zostać tam dodany, czy też nie.<br><br>Dodatek zapisuje zdobycze ze światów publicznych i prywatnych.<br><br>Strona główna: <a href='http://grooove.pl/lootlog/' target='_blank'>http://grooove.pl/lootlog/</a>",
			urlPL: "http://addons2.margonem.pl/get/70/70663dev.js",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-158 -12",
			author: "Groove Armada|3088295",
			beforeInstall: function() {
				if ($("#GLobalLootlogLauncher").length) {
					message("Global lootlog jest już zainstalowany z innego źródła.");
					return true;
				};
			},
			noEN: true
		},
		groov_pw: {
			namePL: "Panel walk",
			nameEN: "Battle panel",
			descPL: "Dodatek automatycznie zapisuje walki z graczami na stronie, gdzie później ładnie je wyświetla.<br>Przykład: <a href='http://grooove.pl/battle/id-1' target='_blank'>http://grooove.pl/battle/id-1</a>",
			descEN: "This addon automatically saves battles aganist other players on a website, where they are nicely displayed.<br>Example: <a href='http://grooove.pl/battle/id-1' target='_blank'>http://grooove.pl/battle/id-1</a>",
			urlPL: "http://addons2.margonem.pl/get/70/70674dev.js",
			urlEN: "http://addons2.margonem.pl/get/70/70674dev.js",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-4 -34",
			author: "Groove Armada|3088295",
			beforeInstall: function() {
				if ($("#PWLauncher").length) {
					message("Panel walk jest już zainstalowany z innego źródła.");
					return true;
				};
			},
		},
		groov_count: {
			namePL: "Licznik ubić",
			nameEN: "Kill counter",
			descPL: "Liczy ubicia elit, elit II, herosów, tytanów i eventowych potworów.<br><br>Aby zresetować licznik lub usunąć pojedynczy wpis, należy wejść na stronę <a href='http://grooove.pl/licznik/' target='_blank'>http://grooove.pl/licznik/</a> i się zalogować.",
			descEN: "Counts how many times you've killed monsters with ranks above elite. To reset the counter or delete a single entry, you have to visit <a href='http://grooove.pl/licznik/' target='_blank'>http://grooove.pl/licznik/</a> and log in.",
			urlPL: "http://addons2.margonem.pl/get/70/70632dev.js",
			urlEN: "http://addons2.margonem.pl/get/70/70688dev.js",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-97 -34",
			author: "Groove Armada|3088295",
			beforeInstall: function() {
				if ($("#GACounterLauncher").length) {
					message("Licznik ubić jest już zainstalowany z innego źródła.");
					return true;
				};
			},
		},
		ake_coll: {
			namePL: "Pokazywanie kolizji",
			nameEN: "Show collisions",
			descPL: "Pokazuje kolizje na mapie.",
			descEN: "Shows map collisions.",
			urlPL: "http://addons2.margonem.pl/get/76/76788dev.js?3",
			urlEN: "http://addons2.margonem.pl/get/76/76788dev.js?3",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-702 -710",
			author: "Akechi|229327",
			widget: {
				color: "blue"
			}
		},
		/*ccar_evo: { [*]
			namePL: "Evolution Manager",
			nameEN: "Evolution Manager",
			descPL: "Wielofunkcyjny manager dodatków. <a target='_blank' href='https://www.margonem.pl/?task=forum&show=posts&id=469794'>Temat na forum</a>.<br>Instaluje się jego osobny userscript.",
			descEN: "multifunctional addon manager. <a target='_blank' href='https://www.margonem.pl/?task=forum&show=posts&id=469794'>Polish forum thread</a>.<br>Installs as a separate userscript.",
			urlPL: "http://m.ccrr.pl/evo/client/start.user.js",
			urlEN: "http://m.ccrr.pl/evo/client/start.user.js",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-437 -12",
			author: "Programista CcarderR|2210626",
			beforeInstall: function() {
				if (typeof (evoStart) != "undefined") {
					message("Evolution Manager jest już zainstalowany.");
				} else {
					window.open("http://m.ccrr.pl/evo/client/start.user.js");
				};
				return true;
			},
		},*/
		//eeeeeee darrowi padł hosting to na chwilę obecną wywalam z panelu
		/*darr_mm: {
			namePL: "Margomap",
			nameEN: "Margomap",
			descPL: "Prosta minimapa, otwiera się przyciskiem [E]",
			descEN: "A simple minimap, can be opened with the [E] button.",
			urlPL: "http://addons2.margonem.pl/get/77/77011dev.js?3",
			urlEN: "http://addons2.margonem.pl/get/77/77011dev.js?3",
			data: "http://addons2.darro.eu/js/margomap.js",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-158 -12",
			author: "Darrefull|359424",
			beforeInstall: function() {
				if (typeof window.DMargoMap != "undefined") {
					message("Margomap jest już zainstalowany z innego źródła.");
					return true;
				};
			},
		},
		darr_akh: {
			namePL: "Licznik Akh-Mater",
			descPL: "Liczy nawróconych i zapytanych do questa Słowo Akh-Mater..",
			urlPL: "http://addons2.margonem.pl/get/77/77011dev.js?3",
			data: "http://addons2.darro.eu/js/akh-mater.js",
			img: "http://aldous.margonem.pl/img/gui/buttony.png|-189 -12",
			author: "Darrefull|359424",
			beforeInstall: function() {
				if ($("div[data-tip*='Licznik do questa <br>Słowo Akh-Mate']").length > 0) {
					message("Licznik Akh-Mater jest już zainstalowany z innego źródła.");
					return true;
				};
			},
			noEN: true
		},
		darr_coun: {
			namePL: "Licznik ubić by Darrefull",
			descPL: "Liczy ubicia elit/e2/herosów/tytanów.",
			urlPL: "http://addons2.margonem.pl/get/77/77011dev.js?3",
			data: "http://addons2.darro.eu/js/counter.js",
			img: "http://aldous.margonem.pl/img/gui/addons-icons.png|-97 -34",
			author: "Darrefull|359424",
			beforeInstall: function() {
				if (typeof window.eCounter != "undefined") {
					message("Licznik ubić by Darrefull jest już zainstalowany z innego źródła.");
					return true;
				};
			},
			noEN: true
		}*/
	};
	this.addonIds = Object.keys(this.list);
	this.storageKey = "priwAddons";
	this.getStorage = function() {
		if (!this.storageCache) {
			this.storageCache = localStorage.getItem(this.storageKey) ? JSON.parse(localStorage.getItem(this.storageKey)) : [];
		};
		return this.storageCache;
	};
	this.setStorage = function(storage) {
		this.storageCache = storage;
		localStorage.setItem(this.storageKey, JSON.stringify(storage));
	};
	this.fixStorage = function() {
		var storage = this.getStorage();
		var len = storage.length;
		for (var i=0; i<storage.length; i++) {
			if (this.addonIds.indexOf(storage[i]) == -1) { //gracz ma nieinstniejący dodatek który zaśmieca storage
				//jak dodatek co został wywalony z listy miał widget to go trza wywalić
				if (typeof storage[i] == "number") { //stare wersje dodatku były dziwaczne, tak just in case gdyby ktoś miał stary typ jeszcze. Kiedyś to wywalę
					if (API.Storage.get("hotWidget/addon_"+(storage[i]+1000))) API.Storage.remove("hotWidget/addon_"+(storage[i]+1000));
				} else {
					if (API.Storage.get("hotWidget/addon_"+storage[i])) API.Storage.remove("hotWidget/addon_"+storage[i]);
				};
				storage.splice(i, 1);
				i--;
			};
		};
		if (len != storage.length) this.setStorage(storage);
	};

	this.consoleHax = new (function() {
		var self = this;
		var handler;
		var $input = document.createElement("input");
		var $content;
		this.console = null;

		this.init = function() {
			//force show console
			log(_l() == "pl" ? "Panel dodatków+ załadowany" : "Addon panel+ loaded");
			//teraz jak konsola jest pokazana kradniemy event handler
			try {
				handler = $._data(document.querySelector(".console-input"), "events").keydown[0].handler;
			} catch (e) {
				return console.error("consolehax failed");
			};
			//łapiemy jeszcze console-content
			$content = document.querySelector(".console-content");
			//i chowamy konsolę
			this.evalInConsoleScope("priwAddons.consoleHax.console=self;self.close();");
		}
		this.evalInConsoleScope = function(str) {
			$input.value = str;
			handler.call($input, {
				keyCode: 13
			});
			//jeszcze usuwamy widoczny input z konsoli żeby nie zaśmiecać
			this.removeLastConsoleMsg();
		}
		this.removeLastConsoleMsg = function() {
			$content.lastElementChild.remove();
			var $notif = document.querySelector("#consoleNotif");
			if ($notif) $notif.remove();
			if (this.console.isOpen) this.console.close();
		}
	})();
	this.consoleHax.init();

	this.modules = new (function() {
		var self = this;
		function getFromConsoleHax(path) {
			addons.consoleHax.evalInConsoleScope("try{priwAddons.modules.module = require('"+path+"');}catch(e){console.error('Module "+path+" not found!');priwAddons.modules.module=false;}");
			return self.module;
		};
		this.init = function() {
			this.Interface = getFromConsoleHax("core/Interface");

			this.Console = addons.consoleHax.console;
		};
	})();
	this.modules.init();

	this.console = new (function() {
		var self = this;
		var Console = addons.modules.Console;
		var $content = Console.wnd.$[0].querySelector(".console-content");
		var commandLine = Console.commandLine;
		var customCmds = {
			"!help": {
				handler: () => {
					for (var i in customCmds) {
						if (customCmds[i].help) log("<b>"+i+"</b> - "+customCmds[i].help);
					}
				}
			}
		};

		this.newCustomCmd = function(cmd) {
			/* przykładowe cmd:
				cmd = {
					name: "nazwa komendy",
					handler: n => console.log(n),
					[help: "opis co komanda robi"]
				}

			*/
			customCmds[cmd.name] = cmd;
		};
		this.cmdExists = function(cmd) {
			cmd = cmd.split(" ")[0];
			return customCmds[cmd] ? true : false;
		}
		this.parseCmd = function(cmd) {
			var args = cmd.split(" ");
			cmd = args.splice(0, 1)[0];
			cmd = customCmds[cmd];
			cmd.handler.apply(window, args);
		}
		this.log = function(txt, level) {
			switch (level) {
				case 1:
					txt = "<span style='color: yellow'>Warning: "+txt+"</span>";
				break;
				case 2:
					txt = "<span style='color: #9a6400'>Error: "+txt+"</span>";
				break;
				case 3:
					txt = "<span style='color: red; font-weight: bold;'>Fatal error: "+txt+"</span>";
				break;
			}
			var $log = document.createElement("div");
			$log.classList.add("console-message");
			$log.innerHTML = txt;
			$content.appendChild($log);
			if (level) {
				Console.showConNotif();
			};
			if (level == 3) Console.open();
		}
		this.init = function() {
			var _sendMessage = commandLine.sendMessage;
			commandLine.sendMessage = function(cmd) {
				if (!self.cmdExists(cmd)) {
					_sendMessage.apply(this, arguments);
				} else {
					log("<i style=color:white>> "+cmd+"</i>");
					document.querySelector("#console_input").value = "";
					self.parseCmd(cmd);
				}
			}
		}
		this.init();
	})();

	this.getAddonState = function(id) {
		var storage = this.getStorage();
		return (storage.indexOf(id) > -1);
	};
	this.toggleAddon = function(id) {
		var storage = this.getStorage();
		if (storage.indexOf(id) > -1) {
			storage.splice(storage.indexOf(id), 1);
		} else {
			storage.push(id);
		};
		this.setStorage(storage);
	};
	this.fixStorage();
	this.loader = new (function(_ajax){
		var self = this;
		var lastAddonId;
		this.addonsLoaded = 0;
		this.waitForInterfaceChanger = false; //eliminuje potencjalną możliwość zagryzienia się z dodatkiem SI2NI
		if (typeof __bootNI != "undefined" && __bootNI) {
			var _reCallInitQueue = Engine.reCallInitQueue;
			this.waitForInterfaceChanger = true;
			Engine.reCallInitQueue = function() { //funckja ta zostaje uruchomiona przez SI2NI gdy skończy ładować swoje dodatki
				self.waitForInterfaceChanger = false;
				Engine.reCallInitQueue = _reCallInitQueue;
				self.loadAddon();
			};
		};
		$.ajax = function(options) {
			if (options.url.indexOf("engine?t=") > -1) addons.parseInput = options.success;
			if (self.addonsLoaded < addons.addonIds.length && options.url.indexOf("engine?t=init") > -1) {
				self.loadAddon();
				return;
			} else if (options.url.indexOf("margonem.pl/config.php") > -1) {
				var oldsuccess = options.success;
				options.success = function(data) {
					addons.afterGameBoot();
					var ret = oldsuccess.apply(this, arguments);
					addons.afterInterfaceLoad();
					return ret;
				};
			} else if (options.url.indexOf("engine?t=") > -1) {
				var oldsuccess = options.success;
				var url = options.url;
				options.success = function(data) {
					addons.callbackParser(data, url, true);
					var ret = oldsuccess.apply(this, arguments);
					addons.callbackParser(data, url);
					return ret;
				};
			};
			return _ajax.apply(this, arguments);
		};
		this.loadAddon = function() {
			var id = addons.addonIds[this.addonsLoaded];
			lastAddonId = id;
			if (addons.getAddonState(id)) {
				var addon = addons.list[id];
				if (addon.beforeInstall && addon.beforeInstall()) { //failsafe jakby ktoś coś odwalił
					addons.toggleAddon(id);
					return this.onAddonLoad(true);
				};
				if (!$.cachedScript) jQuery.cachedScript=function(e,c){return c=$.extend(c||{},{dataType:"script",cache:!0,url:e}),jQuery.ajax(c)};
				var url = this.getUrl(addon);
				window.__currentAddon = {
					id: addons.addonIds[this.addonsLoaded],
					data: addon.data
				};
				if (url.indexOf("?") > -1) url += "&v="+((new Date()).toLocaleDateString());
				else url += "?v="+((new Date()).toLocaleDateString());
				$.cachedScript(url).done(this.onAddonLoad).fail((xhr) => this.failedAddonLoad(id, xhr));
				//$.getScript(url).done(this.onAddonLoad).fail((xhr) => this.failedAddonLoad(id, xhr));
			} else {
				this.onAddonLoad(true);
			};
		};
		this.onAddonLoad = function(notLoaded) {
			if (notLoaded !== true) {
				var addon = addons.list[lastAddonId];
				addons.console.log("addon '"+ (_l() == "pl" ? addon.namePL : addon.nameEN) + "' loaded succesfully");
			};
			self.addonsLoaded++;
			if (self.addonsLoaded < addons.addonIds.length) {
				self.loadAddon();
			} else {
				self.loadExtraAddons();
			};
		};
		var extraLoadFinished = false;
		var extraAddonsLoaded = -1;
		this.loadExtraAddons = function(failed) {
			if (extraAddonsLoaded >= 0 && !failed) addons.console.log("script from "+extraAddons[extraAddonsLoaded]+" loaded succesfully");
			extraAddonsLoaded++;
			if (extraAddonsLoaded < extraAddons.length) {
				var url = extraAddons[extraAddonsLoaded];
				$.cachedScript(url).done(self.loadExtraAddons).fail((xhr) => self.failedExtraAddonLoad(url, xhr));
			} else {
				if (!self.waitForInterfaceChanger) {
					extraLoadFinished = true;
					Engine.reCallInitQueue();
				};
			};
		};
		this.require = function(url) {
			if (!extraLoadFinished) extraAddons.push(url);
			else throw "Ładowanie już się zakończyło.";
		};
		var extraAddons = [];
		this.failedAddonLoad = function(id, xhr) {
			var addon = addons.list[id];
			//if (_l() == "pl") console.warn("Nie udało się załadować dodatku "+addon.namePL+" ["+this.getUrl(addon)+"] ("+xhr.status + " - "+xhr.statusText+")");
			//else console.warn("Failed to load addon "+addon.nameEN+" ["+this.getUrl(addon)+"] ("+xhr.status + " - "+xhr.statusText+")");
			addons.console.log("failed to load addon '"+(_l() == "pl" ? addon.namePL : addon.nameEN)+"' ("+xhr.status + " - "+xhr.statusText+")", 1);
			this.onAddonLoad(true);
		};
		this.failedExtraAddonLoad = function(url, xhr) {
			//if (_l() == "pl") console.warn("Nie udało się załadować skryptu z require "+url);
			//else console.warn("Failed to load required script "+url);
			addons.console.log("failed to load script from "+url+" ("+xhr.status + " - "+xhr.statusText+")", 1);
			this.loadExtraAddons(true);
		};
		this.getUrl = function(addon) {
			return _l() == "pl" ? addon.urlPL : addon.urlEN;
		};
	})($.ajax);
	var __g = _g;
	_g = function(url, extra) {
		var ret = addons.requestParser(url, extra);
		arguments[0] = ret[0];
		arguments[1] = ret[1];
		return __g.apply(this, arguments);
	};
	this.requestParser = function(url, extra) {
		for (var i=0; i<this.requestParsers.length; i++) {
			var ret =this.requestParsers[i](url, extra);
			url = ret[0];
			extra = ret[1];
		};
		return [url, extra];
	};
	this.requestParsers = [];
	this.callbackParser = function(data, url, before) {
		if (!before) {
			for (var i=0; i<this.extraServerCallbacks.length; i++) {
				this.extraServerCallbacks[i](data, url);
			};
		};
		for (var i in data) {
			this.emmiter.emit((before ? "before-" : "")+i, data[i]);
		};
		this.emmiter.emit((before ? "before-" : "")+"game-response", data);
	};
	//idk moja implementacja pewnie nie w 100% taka sama
	this.Emmiter = function() {
		var on = [];
		var once = [];
		this.on = function(type, fun) {
			on.push(type, fun);
			return fun;
		};
		this.once = function(type, fun) {
			once.push(type, fun);
			return fun;
		};
		this.off = function(fun) {
			for (var i=1; i<on.length; i+=2) {
				if (on[i] == fun) {
					return on.splice(i-1, 2);
				};
			};
		};
		this.emit = function(type, data) {
			for (var i=0; i<once.length; i+=2) {
				if (once[i] == type) {
					once[i+1](data);
					once.splice(i, 2);
					i -= 2;
				};
			};
			for (var i=0; i<on.length; i+=2) {
				if (on[i] == type) {
					on[i+1](data);
				}
			};
		};
	};
	this.emmiter = new this.Emmiter();
	this.extraServerCallbacks = [];
	this.checkForMismatch = function() { //jakby coś poszło nie tak
		for (var i in this.list) {
			if (this.getAddonState(i) != Engine.addonsPanel.getStorageStateOfAddon(i)) {
				Engine.addonsPanel.toggleStateAddon(i);
			};
		};
	};
	this.addedCustomAddons = false;
	this.doAfterGameBoot = [];
	this.doAfterInterfaceLoad = [];
	this.afterGameBoot = function() {
		for (var i in this.list) {
			var addon = this.list[i];
			if (addon.widget) {
				var store = API.Storage.get("hotWidget/addon_"+i);
				if (store) Engine.addonsPanel.addKeyToWidgets(i, store, _l() == "pl" ? addon.namePL : addon.nameEN);
			};
		};
		var _addonsShow = Engine.addonsPanel.manageVisible;
		Engine.addonsPanel.manageVisible = function() {
			var ret = _addonsShow.apply(this, arguments);
			if (!addons.addedCustomAddons) {
				addons.checkForMismatch();
				addons.addCustomAddonsToList();
				addons.addedCustomAddons = true;
			};
			addons.emmiter.emit("addons-toggle");
			return ret;
		};
		var fun = function(id) {
			if (addons.isCustomAddon(id)) {
				if (addons.addedCustomAddons && !addons.getAddonState(id)) {
					message(addons.reloadMsg);
					addons.toggleAddon(id);
					var addon = addons.list[id];
					if (addon.widget && !window["addon_"+id]) {
						window["addon_"+id] = {
							manageVisible: () => message("Dodatek zacznie działać po odświeżeniu gry")
						};
					};
				};
			} else {
				_startAddonScript.apply(this, arguments);
			};
		};
		//dziwna różnica iędzy polskim a angielskim margonem
		if (Engine.addonsPanel.startAddonScript) {
			var _startAddonScript = Engine.addonsPanel.startAddonScript;
			Engine.addonsPanel.startAddonScript = fun;
		} else {
			var _startAddonScript = Engine.addonsPanel.turnOnAddon;
			Engine.addonsPanel.turnOnAddon = fun;
		};
		var _turnOffAddon = Engine.addonsPanel.turnOffAddon;
		Engine.addonsPanel.turnOffAddon = function(id) {
			if (addons.isCustomAddon(id)) {
				if (addons.addedCustomAddons && addons.getAddonState(id)) {
					message(addons.reloadMsg);
					addons.toggleAddon(id);
					if (addons.list[id].widget) {
						$(".icon.addon_"+id).parent().remove();
						if (API.Storage.get("hotWidget/addon_"+id)) API.Storage.remove("hotWidget/addon_"+id);
					};
				};
			} else {
				_turnOffAddon.apply(this, arguments);
			};
		};
		var _setStateAddon = Engine.addonsPanel.setStateAddon;
		Engine.addonsPanel.setStateAddon = function(state, id) {
			if (addons.isCustomAddon(id) && state && addons.addedCustomAddons) {
				var addon = addons.list[id];
				if (addon.beforeInstall && addon.beforeInstall()) return;
			};
			return _setStateAddon.apply(this, arguments);
		};
		this.initCss();
		for (var i=0; i<this.doAfterGameBoot.lenth; i++) {
			this.doAfterGameBoot[i]();
		};
		this.emmiter.emit("game-load");
	};
	this.afterInterfaceLoad = function() {
		for (var i=0; i<this.doAfterInterfaceLoad.length; i++) {
			this.doAfterInterfaceLoad[i]();
		};
		this.emmiter.emit("interface-load");
	};
	this.isCustomAddon = function(id) {
		return (this.addonIds.indexOf(id) > -1);
	};
	this.addCustomAddonHeader = function() {
		var $wnd = Engine.addonsPanel.wnd.$[0];
		var $list = $wnd.querySelector(".addon-list");
		var $header = document.createElement("div");
		$header.classList.add("custom-addon-header");
		$header.innerHTML = _l() == "pl" ? "Nieoficjalne dodatki" : "Custom addons";
		$list.appendChild($header);
	};
	this.addCustomAddonsToList = function() {
		this.addCustomAddonHeader();
		for (var i in this.list) {
			var addon = this.list[i];
			if (_l() == "en" && addon.noEN) continue;
			if (_l() == "pl" && addon.noPL) continue;
			var author = addon.author.split("|");
			var authorHtml = "<div class='addon-author'>by <a href='http://www.margonem.pl/?task=profile&id="+author[1]+"' target='_blank'>"+author[0]+"</a></div>";
			var addonToAdd = {
				pl: {
					name: addon.namePL,
					description: addon.descPL + authorHtml
				},
				en: {
					name: addon.nameEN,
					description: addon.descEN + authorHtml
				},
				image: addon.img,
				options: addon.widget ? 1 : 0
			};
			Engine.addonsPanel.createOneAddonOnList(addonToAdd, i);
			Engine.addonsPanel.createOneAddonDescription(addonToAdd, i);
		}
	};
	this.reloadMsg =  _l() == "pl" ? "Zmiany będą widoczne po odświeżeniu gry..." : "Changes will come into effect once the page has been reloaded...";
	this.initCss = function() {
		var css = `
			.addon-author {
				font-size: 75%;
				text-align: right;
				color: #333333;
			}
			.custom-addon-header {
				text-align: center;
				border-bottom: 1px solid #4b4949;
				font-size: 125%;
				color: #777777;
				height: 30px;
				line-height: 30px;
			}
		`;
		var widgets = {};
		for (var i in this.list) {
			var addon = this.list[i];
			if (!addon.widget) continue;
			if (addon.widget !== true) {
				widgets[i] = addon.widget;
				widgets[i].id = i;
			};
			css += `
				.icon.addon_`+i+` {
					background: `+Engine.addonsPanel.createBackgroundString(addon.img)+` !important;
				}
			`;
		};
		this.emmiter.once("interface-load", ()=>this.widget.changeWidgetCss(widgets));
		$("<style>"+css+"</style>").appendTo("head");
	};
	//kod z Interface.showPopupMenu
	var $aLayer = $(document.getElementsByClassName("alerts-layer")[0]);
	this.popupMenu = function(menu, e) {
		if (!menu.length) return;
		var $m = $('<div class="custom-popup-menu"></div>');
		var $btn = API.Templates.get('button').addClass('small');
		for (var i in menu) {
			(function (i) {
				var clone = $('<div class="menu-item">' + menu[i][0] + '</div>');
				if (isset(menu[i][2])) {
					clone.addClass(menu[i][2].button.cls);
				}
				$(clone).click(function (e) {
					if (menu[i][1]()) e.stopPropagation();
				});
				$m.append(clone);
			})(i);
		};
		var zIndex = $aLayer.children().size() + 1;
		$aLayer.append($m);
		$m.css({
			top: e.clientY - $m.height() / 2,
			left: e.clientX - $m.width() / 2,
			'z-index': zIndex
		}).addClass('show');

		e.stopPropagation();
	};
	document.addEventListener("click", () => {
		$('.custom-popup-menu').remove();
	})
	var $popupStyle = document.createElement("style");
	//nie, nie mogę użyć normalnej klasy popup-menu bo gra kasuje element zanim mój eveneListener odpali ._.
	//nie rozumiem jakim prawem tak się dzieje, ale niektóre rzeczy trzeba po prostu przyjąć do wiadomości bez rozumienia
	$popupStyle.innerHTML = `
		.custom-popup-menu {
			border: 5px solid;
			max-width: 150px;
			border-image: url(../img/gui/ramka.png) 6 repeat;
			-webkit-transform: scale(0);
			-webkit-transition: 0.2s linear;
			-webkit-transition-timing-function: cubic-bezier(0.68, 0.77, 0.4, 1.89);
			z-index: 1;
			background-color: #3F3B3D;
			background-clip: padding-box;
			pointer-events: auto;
			position: absolute;
		}
		.custom-popup-menu .menu-item {
			cursor: url(../img/gui/cursor/5.png), auto;
			padding: 2px 5px;
			display: block;
			margin-bottom: 1px;
			font-size: 12px;
			text-align: center;
			border-radius: 3px;
			background-color: #244518;
			color: white;
			border: 1px solid #396420;
		}
		.custom-popup-menu .menu-item:last-child {
			margin-bottom: 0px;
		}
		.custom-popup-menu .menu-item.label {
			cursor: url(../img/gui/cursor/1.png), auto;
			border: 0px;
			background-color: transparent;
		}
		.custom-popup-menu .menu-item:hover:not(.label) {
			border: 1px solid #4f7b21;
			background-color: #2e4f18;
		}
		.custom-popup-menu.show {
			-webkit-transform: scale(1);
		}
		.custom-popup-menu .s_cost {
			display: inline-block;
			margin-left: 5px;
			font-weight: bold;
			border: 1px solid rgba(0, 0, 0, 0.3);
			border-radius: 3px;
			background-color: rgba(0, 0, 0, 0.2);
			padding: 0px 3px;
			color: lightblue;
			line-height: 15px;
		}
	`;
	document.head.appendChild($popupStyle);


	this.dictionary = new (function() {
		var list = {};
		this.get = function(id, data) {
			var str = list[id];
			if (!str) return "missing["+id+"]";
			str = str[_l()];
			if (!str) return "nolang["+id+"]";
			for (var i in data) {
				str = str.replace(i, data[i]);
			};
			return str;
		};
		this.add = function(id, txt) {
			list[id] = txt; //txt = {en: "txten", pl: "txtpl"}
		};
		this.addMany = function(data) {
			for (var i=0; i<data.length; i++) {
				this.add(data[i].id, data[i].txt);
			};
		};
	})();
	var _txt = this.dictionary.get;

	//custom settings for addons
	this.settings = new (function() {
		var self = this;
		var extraSettings = [];
		var $extraSettings, $scrollPane;
		addons.dictionary.add("addon_settings", {
			pl: "Ustawienia dodatków",
			en: "Addon settings"
		})
		if (!Storage.get("addonsettings")) {
			Storage.set("addonsettings", {});
		};
		this.init = function() {
			var _old = Engine.settings.toggle;
			self.initSettingTable();
			Engine.settings.toggle = function() {
				var ret = _old.apply(this, arguments);
				self.manageExtraSettings();
				addons.emmiter.emit("settings-toggle");
				return ret;
			};
		};
		this.initSettingTable = function() {
			$extraSettings = document.createElement("div");
			$extraSettings.classList.add("seccond-c");

			var $header = document.createElement("h2");
			$header.classList.add("settings-addons");
			$header.innerHTML = "<span>"+_txt("addon_settings")+"</span>";
			$extraSettings.appendChild($header);

			var $list = document.createElement("ul");
			$list.classList.add("hero-options");
			var html = "", setting, enabled;
			for (var i=0; i<extraSettings.length; i++) {
				setting = extraSettings[i];
				enabled = Storage.get("addonsettings/"+setting.id) ? " active" : "";
				html += "<li data-setting_id='"+setting.id+"'><span class='checkbox"+enabled+"'></span><span class='label'>"+setting.txt+"</span></li>";
			};
			$list.innerHTML = html;
			$list.addEventListener("click", this.toggleSetting);
			$extraSettings.appendChild($list);
		};
		this.toggleSetting = function(e) {
			for (var i=0; i<e.path.length; i++) {
				if (e.path[i].dataset["setting_id"]) {
					var li = e.path[i];
					var children = li.children;
					var enabled = !Storage.get("addonsettings/"+li.dataset["setting_id"]);
					Storage.set("addonsettings/"+li.dataset["setting_id"], enabled);
					for (var i=0; i<children.length; i++) {
						if (children[i].classList.contains("checkbox")) {
							if (enabled) children[i].classList.add("active");
							else children[i].classList.remove("active");
							break;
						};
					};
					addons.emmiter.emit("toggle-addon-"+li.dataset["setting_id"], enabled);
					break;
				};
			};
		};
		this.manageExtraSettings = function() {
			if (!extraSettings.length) return;
			var $settings = document.getElementsByClassName("settings-window")[0];
			if ($settings) {
				//tfw uparłeś się na nieużywanie jquery
				var children = $settings.children;
				for (var i=0; i<children.length; i++) {
					if (children[i].classList.contains("hero-options-config")) {
						children = children[i].children[0].children; //xd
						break;
					};
				};
				for (var i=0; i<children.length; i++) {
					if (children[i].classList.contains("scroll-pane")) {
						$scrollPane = children[i];
						break;
					};
				};
				if (!$scrollPane) return console.warn("coś się zepsuło");
				$scrollPane.appendChild($extraSettings);
			};
		};
		this.add = function(data) {
			extraSettings.push(data);
			if (Storage.get("addonsettings/"+data.id) == null) Storage.set("addonsettings/"+data.id, data.default);
		};
		this.get = function(id) {
			return Storage.get("addonsettings/"+id);
		};
		//this.add({
		//	txt: "test",
		//	id: "test-setting",
		//	default: true
		//});
		addons.emmiter.once("interface-load", this.init);
	})();

	//window constructor
	this.Window = function(options) {
		//zrobiłem to zanim odkryłem że jest API.Window
		//także iksde, ale to się chyba łatwiej używa to eeee zostawie, zwłaszcza że już 1 dodatek z tym zrobiłem xDD
		/* =OPTIONS=
		  WYMAGANE:
		    /Jedno z dwóch:
				-txt: zawartość HTML okna
				-element: element do podpięcia do zawartości okna (przez $(...).append)
			/
			-header: nagłówek okna
		  OPCJONALNE
			-likemAlert: bool, czy okno ma posiadać klasę mAlert (default: false)
			-noClose: bool, czy ma zostać usunięty przycisk zamykania (default: false)
			-callbacks: array, taki sam jak ma mAlert w drugim argumencie (default: [])
			-onClose: f, funkcja jaka wykona się przy zamknięciu okna (default: none)
			-css: style css które będą nadane oknu
		*/
		var txt = "this will be hijacked " + new Date().getTime();
		options.callbacks = options.callbacks ? options.callbacks : [];
		mAlert(txt, options.callbacks);
		this.$ = $(".border-window:contains('"+txt+"')"); //dobra użyję jquery bo robienie tego bez przekracza moją cierpliwość

		var $content = this.$.find(".inner-content");
		if (options.txt) $content[0].innerHTML = options.txt;
		else {
			$content[0].innerHTML = "";
			$content.append(options.element);
		};
		if (options.css) {
			Object.assign(this.$[0].style, options.css);
		}

		var $header = this.$.find(".text");
		$header[0].innerHTML = options.header;

		var $close = this.$.find(".close-button");
		var close = $._data($close[0], "events").click[0].handler; //kradniemy funkcję zamykającą okno
		$close[0].removeEventListener("click", close);
		if (options.noClose) $close.parent().remove();

		if (!options.likemAlert) this.$[0].classList.remove("mAlert");

		this.setContent = function(html) {
			$content[0].innerHTML = html;
		};
		this.setHeader = function(html) {
			$header[0].innerHTML = html;
		};
		this.appendContent = function(element) {
			$content.append(element);
		};
		this.clearContent = function() {
			$content[0].innerHTML = "";
		};
		this.close = function() {
			if (options.onClose) options.onClose();
			close();
		};
		$close[0].addEventListener("click", this.close);
	};

	//widget-related functionality
	this.widget = new (function(addons) {
		/*
			stored widget data (in hotWidget/widgetID/):
				[0] - number of spaces from corner
				[1] - corner (top-left, bottom-right etc, can also be top-left-additional)

			widget instance:
				name: displayed name
				index: stored data[0]
				corner: stored data[1]; if set to FREE empty space for the widget will be found automatically (and index parameter can be ommited)
				id: id to be stored
				icon: bg, in format url|bpos, e.g. http://aldous.margonem.pl/img/gui/buttony.png?v=4|-406 -12
				clb: callback function when widget is clicked
				color (optional): color for the widget. Can be blue, red, violet or green. Defaults to green.
				css (optional): object with css style that will be added to the widget. Set by Object.assign and not $(...).css, so all values must be valid
		*/
		var self = this,
			addedWidgets = {},
			loaded = false,
			addedWidgets2 = {};
		var dict = addons.dictionary;
		this.addWidgetData = function() {
			var widgets = self.getCustomAddonList();
			var realID;
			var style = "";
			for (var id in widgets) {
				realID = id.substring(14, id.length);
				if (addedWidgets[realID]) {
					Engine.addonsPanel.addKeyToWidgets("_custom_"+realID, widgets[id], addedWidgets[realID].name);
					style += self.getAddonStyle(addedWidgets[realID].id, addedWidgets[realID].icon);
				} else API.Storage.remove("hotWidget/"+id);
			};
			var $style = document.createElement("style");
			$style.innerHTML = style;
			document.head.appendChild($style);
			loaded = true;
		}
		this.getCustomAddonList = function() {
			var widgets = API.Storage.get("hotWidget");
			var custom = {};
			for (var id in widgets) {
				if (id.indexOf("_custom_") > -1) {
					custom[id] = widgets[id];
				}
			}
			return custom;
		}
		this.add = function(widget) {
			if (!API.Storage.get("hotWidget/addon__custom_"+widget.id)) {
				var pos = this.generateWidgetPos(widget);
				if (pos) API.Storage.set("hotWidget/addon__custom_"+widget.id, pos);
				else return true;
			};
			addedWidgets[widget.id] = widget;
			window["addon__custom_"+widget.id] = {
				manageVisible: widget.clb
			};
			return false;
		}
		this.generateWidgetPos = function(widget) {
			if (widget.corner != "FREE") return [index, corner];
			else return this.findFreeWidgetPosition();
		}
		this.findFreeWidgetPosition = function() {
			var widgets = API.Storage.get("hotWidget");
			for (var i=0; i<2; i++) {
				var pos1 = !i ? "top" : "bottom";
				for (var j=0; j<2; j++) {
					var pos2 = !j ? "left" : "right";
					for (var k=0; k<2; k++) {
						if (pos1 == "top" && k) continue;
						var additional = !k ? "" : "-additional";
						var fullpos = pos1+"-"+pos2+additional;
						for (var l=0; l<7; l++) {
							if (!this.checkIfWidgetExists(l, fullpos, widgets)) return [l, fullpos];
						};
					}
				}
			}
			return false;
		}
		this.checkIfWidgetExists = function(pos, corner, widgets) {
			if (!widgets) widgets = API.Storage.get("hotWidget");
			for (var i in widgets) {
				if (widgets[i][0] == pos && widgets[i][1] == corner) return true;
			}
			return false;
		}
		this.getAddonStyle = function(id, icon) {
			return `
				.icon.addon__custom_${id} {
					background: ${Engine.addonsPanel.createBackgroundString(icon)} !important;
				}
			`;
		}
		this.changeWidgetCss = function(widgets, custom) {
			//cache stuff
			if (!custom) addedWidgets2 = widgets;
			for (var id in widgets) {
				var widget = widgets[id];
				if (widget.color || widget.css) {
					var $widget = document.getElementsByClassName((custom ? "addon__custom_" : "addon_")+widget.id)[0];
					if (!$widget) continue;
					else $widget = $widget.parentElement;
					if (widget.color) {
						$widget.classList.remove("green");
						$widget.classList.add(widget.color);
					}
					if (widget.css) {
						Object.assign($widget.style, widget.css);
					}
				}
			}
		}
		this.init = function() {
			addons.emmiter.once("game-load", this.addWidgetData);
			addons.emmiter.once("interface-load", ()=>{
				this.changeWidgetCss(addedWidgets, true);
				var observer = new MutationObserver(this.onWidgetUpdate);
				for (var i=0; i<2; i++) {
					var pos1 = i ? "top" : "bottom";
					for (var j=0; j<2; j++) {
						var pos2 = j ? "right" : "left";
						observer.observe(document.querySelector("."+pos1+"-"+pos2+".main-buttons-container"), {
							childList: true
						})
					}
				}
			});
		}
		this.onWidgetUpdate = function(mutations, observer) {
			if (mutations.length > 1) {
				addons.emmiter.emit("widget-update");
				//readd css to widgets as they are all reset if this code runs
				self.changeWidgetCss(addedWidgets, true);
				self.changeWidgetCss(addedWidgets2);
			};
		}
		this.init();
	})(this);

	this.addonDisplay = new (function(addons) {
		//TODO
		//zmienić pokazywanie ikonek i nazwy klas bo założenia się trochę zmieniły w trakcie robienia a nazwy zostały
		var self = this,
			list = [],
			movedToWindow = [],
			hidden = true,
			$wrapper,
			$singleWrapper,
			$scrollWrapper,
			$scrollContent,
			$title,
			$bagHide,
			$bag,
			$CLLTable,
			currentDisplay = false;
		this.add = function(options) {
			if (hidden) {
				$wrapper.style["display"] = "block";
				hidden = false;
			}
			var $element = document.createElement("div");
			$element.classList.add("addonDisplay-single-display")
			if (options.noTitle) {
				$element.classList.add("long");
			}
			if (options.noForcedWndHeight) {
				$element.classList.add("noForcedWndHeight");
			}
			if (options.html) {
				$element.innerHTML += options.html;
			} else if (options.element) {
				$element.appendChild(options.element);
			}
			var $shortcut = document.createElement("div");
			if (!options.icon) {
				$shortcut.innerHTML = options.name.charAt(0);
			} else {
				$shortcut.innerHTML = "<img width='25px' height='25px' src='"+options.icon+"'>";
			}
			$shortcut.addEventListener("click", () => {
				this.loadDisplay(options.id);
			});
			$shortcut.addEventListener("contextmenu", e => {
				e.preventDefault();
				this.moveDisplayToWindow(options.id);
			});
			$shortcut.dataset["tip"] = options.name;
			$scrollContent.appendChild($shortcut);
			list.push({
				$: $element,
				$short: $shortcut,
				id: options.id,
				name: options.name,
				wndStyle: options.wndStyle,
				noTitle: options.noTitle,
				noForcedWndHeight: options.noForcedWndHeight
			})
		}
		this.moveDisplayToWindow = function(id) {
			var display = this.getDisplayById(id);
			display.$short.style["display"] = "none";
			if (currentDisplay == display) {
				//display.$.remove();
				//$title.innerHTML = "";
				//currentDisplay = false;
				for (var i=0; i<list.length; i++) {
					var disp = list[i];
					if (disp.id != display.id && movedToWindow.indexOf(disp.id) == -1) {
						this.loadDisplay(disp.id);
						break;
					}
					if (i+1 == list.length) {
						currentDisplay = false;
					}
				}
			}
			if (movedToWindow.indexOf(id) == -1) {
				movedToWindow.push(id);
				Storage.set("addonDisplay/movedToWindow", movedToWindow);
			}
			if (movedToWindow.length == list.length) {
				hidden = true;
				$wrapper.style["display"] = "none";
			}
			this.createDisplayWindow(display);
		}
		this.createDisplayWindows = function() {
			for (var i=0; i<movedToWindow.length; i++) {
				var display = this.getDisplayById(movedToWindow[i]);
				if (display) {
					this.moveDisplayToWindow(display.id);
				} else {
					movedToWindow.splice(i,1);
					i -= 1;
				}
			}
			Storage.set("addonDisplay/movedToWindow", movedToWindow);
		}
		this.createDisplayWindow = function(display) {
			var hwnd = new API.Window({
				onclose: () => {
					var html = display.$.parentElement.innerHTML;
					display.$.remove();
					hwnd.content(html);
					this.removeDisplayWindow(display);
					hwnd.fadeAndRemove();
				}
			});
			hwnd.$[0].style.width = "241px;";
			if (!display.noForcedWndHeight) hwnd.$[0].style.height = display.noTitle ? "290px" : "260px";
			if (display.wndStyle) {
				Object.assign(hwnd.$[0].style, display.wndStyle);
			}
			hwnd.title(display.noTitle ? "" : display.name);
			hwnd.content(display.$);
			hwnd.setTransparentWindon();
			hwnd.changeDragableContainment('.game-window-positioner');
			hwnd.setSavePosWnd("display_"+display.id, {
				x: '251',
				y: '100'
			});
			$('.alerts-layer').append(hwnd.$);
			hwnd.updatePos();
		}
		this.removeDisplayWindow = function(display) {
			if (movedToWindow.length == list.length) {
				hidden = false;
				$wrapper.style["display"] = "block";
				this.loadDisplay(display.id);
			}
			display.$short.style["display"] = "block";
			movedToWindow.splice(movedToWindow.indexOf(display.id),1);
		}
		this.loadDefaultDisplay = function() {
			var lastId = Storage.get("addonDisplay/active");
			if (lastId == null) lastId = list[0].id;
			self.loadDisplay(lastId);
			self.createDisplayWindows();
		}
		this.getDisplayById = function(id) {
			for (var i=0; i<list.length; i++) {
				if (list[i].id == id) return list[i];
			}
			return false;
		}
		this.loadDisplay = function(id) {
			var display = this.getDisplayById(id);
			if (!display) display = list[0];
			if (currentDisplay) {
				$singleWrapper.removeChild(currentDisplay.$);
				currentDisplay.$short.classList.remove("active");
			}
			display.$short.classList.add("active");
			$singleWrapper.appendChild(display.$);
			if (display.noTitle) {
				$title.style["display"] = "none";
				$singleWrapper.classList.add("long");
			} else {
				$title.style["display"] = "block";
				$title.innerHTML = display.name;
				$singleWrapper.classList.remove("long");
			};
			currentDisplay = display;
			Storage.set("addonDisplay/active", id);
			addons.emmiter.emit("display-load-"+id);
		}
		this.tutorial = function() {
			if (Storage.get("addonDisplay/tutorial") || list.length == 0) return;
			new addons.Window({
				header: "Tutorial",
				txt: _l() == "pl" ?
				"Wygląda na to, że zainstalowałeś dodatek wykorzystujący mechanikę pokazywania rzeczy pod torbami. Kilka informacji:<br>-na dole są ikonki dodatków korzystających z tej machaniki. Klikając je można się między nimi przełączać.<br>-kliknięcie ikonki prawym przyciskiem myszy spowoduje przeniesienie dodatku spod toreb do oddzielnego okienka, które można dowolnie przesuwać.<br>-jeżeli masz mały monitor, to w ustawieniach jest opcja włączenia przycisku do ukrywania toreb, który znajduje się obok zestawów eq." :
				"It appears that you've installed an addon that uses the mechanic of showing stuff under the bags. Some information:<br>-on the bottom, there are icons of addons using said mechanic. You can switch between addons by clicking these.<br>-by right clicking an icon you can move addon display to a separate window, which can be moved around freely.<br>-if your screen is too small, you can toggle a button that hides bags in game settings. Said button will be located next to battlesets upon enabling.",
				css: {
					"max-width": "350px"
				}
			})
			Storage.set("addonDisplay/tutorial", true);
		}
		this.catchCLLTable = function() {
			var timers = document.getElementsByClassName("cll-timers");
			if (timers.length) {
				addons.settings.add({
					txt: _l() == "pl" ? "Umieszczaj minutniki klanowe pod torbami" : "Show guild timers under the bags",
					id: "API_clan_timer_display",
					default: false
				});
				addons.emmiter.on("toggle-addon-API_clan_timer_display", () => message(_l() == "pl" ? "Zmiany będą widoczne po odświeżeniu gry" : "Changes will come into effect once the page has been reloaded"));
				if (!addons.settings.get("API_clan_timer_display")) return;
				while(timers.length) {
					var $timer = timers[0];
					$($timer).trigger("mouseenter");
					$($timer).draggable("disable");
					Object.assign($timer.style, {
						"position": "static",
						"margin-top": "3px",
						"margin-left": "1px"
					});
					var css = $timer.getAttribute("style");
					$timer.setAttribute("style", css.replace("static;", "static !important;"));
					var name = $timer.getAttribute("id").split("cll-timers-")[1].replace(/_/g, " ");
					this.add({
						name: _l() == "pl" ? "Minutniki klanowe "+name : "Clan timers "+name,
						element: $timer,
						id: "cll-timer-"+name,
						icon: "http://grooove.pl/favicon.ico",
						noTitle: true
					})
				}
			}
		}
		this.onGameLoad = function() {
			self.catchCLLTable();
			if (list.length > 0) {
				self.loadDefaultDisplay();
				self.initSettings();
			}
		}
		this.initSettings = function() {
			addons.settings.add({
				txt: _l() == "pl" ? "Przycisk ukrycia toreb" : "Bag hide button",
				id: "API_hide_bag",
				default: false
			});
			var buttonState = addons.settings.get("API_hide_bag");
			this.toggleBagHideBtt(buttonState, true);
			addons.emmiter.on("toggle-addon-API_hide_bag", this.toggleBagHideBtt);

			var show = Storage.get("addonDisplay/showBag");
			if (show == null || !buttonState) show = true;
			this.toggleBag(show);
		}
		this.toggleBagHideBtt = function(show, init) {
			$bagHide.style["display"] = show ? "block" : "none";
			if (!init) self.toggleBag(true);
		}
		this.toggleBag = function(show) {
			show = typeof(show) != "object" ? show : $bag.style["display"] == "none";
			$bag.style["display"] = show ? "block" : "none";
			$bagBG.style["display"] = show ? "block" : "none";

			if (show) $wrapper.style["margin-top"] = 0;
			else $wrapper.style["margin-top"] = "-205px";
			Storage.set("addonDisplay/showBag", show);
		}
		this.init = function() {
			if (Storage.get("addonDisplay") == null) {
				Storage.set("addonDisplay", {});
			}
			var moved = Storage.get("addonDisplay/movedToWindow")
			if (moved) movedToWindow = moved;
			$wrapper = document.querySelector(".b_wrapper");
			$wrapper.innerHTML = "";

			$title = document.createElement("div");
			$title.classList.add("addonDisplay-header");
			$wrapper.appendChild($title);

			$singleWrapper = document.createElement("div");
			$singleWrapper.classList.add("addonDisplay-single-wrapper");
			$wrapper.appendChild($singleWrapper);

			$scrollWrapper = document.createElement("div");
			$scrollWrapper.classList.add("addonDisplay-scroll-wrapper");
			$scrollContent = document.createElement("div");
			$scrollContent.classList.add("addonDisplay-scroll-content");
			$scrollWrapper.appendChild($scrollContent);
			$wrapper.appendChild($scrollWrapper);

			$bagHide = document.createElement("div");
			$bagHide.classList.add("addonDisplay-hide-bag");
			$bagHide.addEventListener("click", this.toggleBag);
			$bagHide.dataset["tip"] = "ukryj/pokaż torbę";
			document.querySelector(".inventory_wrapper").appendChild($bagHide);

			$bag = document.getElementsByClassName("inventory-grid")[0];
			$bagBG = document.getElementsByClassName("inventory-grid-bg")[0];

			var style = `
				.b_wrapper {
					width: 241px;
					display: none;
					background: rgba(0,0,0,0.3);
					color: white;
					margin-left: 10px;
				}
				.addonDisplay-single-wrapper {
					overflow: hidden;
					width: 100%;
					height: 260px;
					padding: 5px;
				}
				.addonDisplay-single-wrapper.long {
					height: 290px;
				}
				.addonDisplay-single-display {
					color: white;
					width: 100%;
					overflow-y: scroll;
					overflow-x: hidden;
					height: 260px;
					padding-right: 17px;
					margin-top: 4px;
				}
				.addonDisplay-single-display.long {
					height: 290px;
				}
				.addonDisplay-single-display.noForcedWndHeight {
					height: initial;
				}
				.addonDisplay-single-wrapper > .addonDisplay-single-display.long {
					height: 302px;
					margin-top: -7px;
				}
				.addonDisplay-header {
					border-bottom: 1px gray dashed;
					font-size: 125%;
					padding: 5px;
					height: 20px;
					line-height: 20px;
				}
				.addonDisplay-scroll-wrapper {
					width: 100%;
					height: 27px;
					margin-top: 5px;
					border-top: 1px gray dashed;
				}
				.addonDisplay-scroll-content > div {
					float: left;
					width: 24.5px;
					height: 25px;
					line-height: 25px;
					font-size: 110%;
					text-align: center;
					border: 1px solid black;
					border-collapse: collapse;
					background: rgba(0,0,0,0.08);
					cursor: url(http://aldous.margonem.pl/img/gui/cursor/5.png), auto;;
					transition: background .1s ease-in-out;
				}
				.addonDisplay-scroll-content > div:hover {
					background: rgba(55,55,55,0.47);
				}
				.addonDisplay-scroll-content > div.active {
					background: rgba(70,70,70,0.47);
				}
				.addonDisplay-hide-bag {
					background: url(https://i.imgur.com/PpUPE6G.png);
					width: 32px;
					height: 32px;
					position: absolute;
					top: -35px;
					left: 73px;
					display: none;
					cursor: ${addons.cursors.pointer};
				}
			`;
			var $style = document.createElement("style");
			$style.innerHTML = style;
			document.head.appendChild($style);

			addons.emmiter.once("game-load", this.onGameLoad);
			addons.emmiter.once("interface-load", this.tutorial);
		}
		this.init();
	})(this);

	//new addon notification
	this.emmiter.once("interface-load", () => {
		var len = Object.values(this.list).length;
		if (Storage.get("lastAddonListLength") == null) return Storage.set("lastAddonListLength", len);
		if (Storage.get("lastAddonListLength") < len) {
			message(_l() == "pl" ? "W panelu dostępny jest nowy dodatek!" : "A new addon is available in the panel!");
			Storage.set("lastAddonListLength", len);
		}
	});
})();
$(".highlight").css({"backgroundImage":"url(http://oi65.tinypic.com/21llwfc.jpg)"});

window.Engine.items.fetch("l", ({_cachedStats, name}) => {
    if (_cachedStats.hasOwnProperty("legendary")) {
        window.message(`<b><span style="color:#990033;">✯ 乇ﾑらㄚ ${name} 乇ﾑらㄚ ✯</b></span>`);
    }
});
window.Engine.items.fetch("l", ({_cachedStats, name}) => {
    if (_cachedStats.hasOwnProperty("heroic")) {
        window.message(`<b><span style="color:#0b04e0;">✯ 乇ﾑらㄚ ${name} 乇ﾑらㄚ ✯</b></span>`);
    }
});

