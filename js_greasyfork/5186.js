// ==UserScript==
// @name           Allianz-Tool 
// @namespace      GD
// @description    Transfers gamers data to Google drive
// @include        http://*.grepolis.*/game*
// @version        1.0.1
// @grant          GM_listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5186/Allianz-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/5186/Allianz-Tool.meta.js
// ==/UserScript==

var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("https://apis.google.com/js/client.js", function() {
    $("#answer-6834930").css("border", ".5em solid black");
});


/************************************************************************
 * Main Script
 ***********************************************************************/
function main_script(DATA) {
	/************************************************************************
	 * Global variables
	 ***********************************************************************/
	var QT = {};
	var wID = Game.world_id;
	var mID = Game.market_id;
	var aID = Game.alliance_id;
	var sID = Game.player_id;
	var pName = Game.player_name;

	/************************************************************************
	 * Languages
	 ***********************************************************************/
	QT.Lang = {
		get : function (a, b) {
			if (QT.Lang[mID] != undefined && QT.Lang[mID][a] != undefined && QT.Lang[mID][a][b] != undefined) {
				return QT.Lang[mID][a][b]
			} else {
				return QT.Lang.de[a][b]
			}
		},
		de : {
			meta : {
				flag : 'http://s14.directupload.net/images/140408/xpd69nmj.png',
				changelog : 'http://adf.ly/cph8j',
				changelog_addfree : 'https://docs.google.com/document/d/10AyoYbgB1ml30EhSyXF7lDgEw_VqgHIQoJrJPCT0Z3w/edit?usp=sharing',
				forumlink : 'http://adf.ly/cbQaZ',
				forumlink_addfree : 'http://forum.de.grepolis.com/showthread.php?20742',
				donation_btn : '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2HJ88ATTBYXSQ&lc=DE&item_name=Quack%20Toolsammlung&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted" target="_blank"><img src="https://www.paypal.com/de_DE/i/btn/btn_donate_LG.gif" alt="Spenden"></a>'
			},
			reports : {
				choose_folder : 'Ordner wählen',
				enacted : 'gewirkt',
				conquered : 'erobert',
				spying : 'spioniert',
				spy : 'Spion',
				support : 'stationierte',
				supporting : 'unterstützt',
				attacking : 'greift',
				farming_village : 'Bauerndorf'
			},
			forum : {
				delete : 'Löschen',
				delete_sure : 'Ausgewählte Beiträge wirklich löschen?',
				no_selection : 'Es sind keine Beiträge markiert'
			},
			town_info : {
				no_overload : 'Kein überladen',
				delete : 'Löschen',
				polissuche : 'Polissuche',
				inactivity : 'Inaktivität',
				days : 'Tage',
				no_data : 'Der Spieler befindet sich noch nicht in der Datenbank'
			},
			grepo_mainmenu : {
				city_view : 'Stadtansicht',
				island_view : 'Inselansicht'
			},
			messages : {
				ghosttown : 'Geisterstadt',
				no_cities : 'Keine Städte auf dieser Insel',
				all : 'Alle',
				export : 'Nachricht als BB-Code für das Forum'
			},
      		hotkeys : {
				hotkeys : 'Hotkeys',
				city_select : 'Stadtauswahl',
				last_city : 'Letzte Stadt',
				next_city : 'Nächste Stadt',
				jump_city : 'Sprung zur aktuellen Stadt',
				administrator : 'Verwalter',
				captain : 'Kapitän',
				trade_ov : 'Handelsübersicht',
				command_ov : 'Befehlsübersicht',
				recruitment_ov : 'Rekrutierungsübersicht',
				troop_ov : 'Truppenübersicht',
				troops_outside : 'Truppen außerhalb',
				building_ov : 'Gebäudeübersicht',
				culture_ov : 'Kulturübersicht',
				gods_ov : 'Götterübersicht',
				cave_ov : 'Höhlenübersicht',
				city_groups_ov : 'Stadtgruppenübersicht',
				city_list : 'Städteliste',
				attack_planner : 'Angriffsplaner',
				farming_villages : 'Bauerndörfer',
				menu : 'Menü',
				city_view : 'Stadtansicht',
				messages : 'Nachrichten',
				reports : 'Berichte',
				alliance : 'Allianz',
				alliance_forum : 'Allianz-Forum',
				settings : 'Einstellungen',
				profile : 'Profil',
				ranking : 'Rangliste',
				notes : 'Notizen',
				chat : 'Chat',
				council : 'Konzil der Helden'
			},
			qtoolbox : 
            {
                update_stats : 'Stadt-Daten uploaden',
                settings : 'Einstellungen'
            },            
            settings: 
            { 
                settings : 'Setup',
                settingHeader : 'Google Drive Setup',
                setting1 : 'Google Client Id:',
                setting2 : 'Google Drive Folder Id:',
                save: 'Speichern'
			}
		},
	};

	/************************************************************************
	 * Images
	 ***********************************************************************/
	QT.Images = {
		archer : "http://s1.directupload.net/images/140121/l2xgz8zg.jpg",
		attack_ship : "http://s1.directupload.net/images/140121/mvlqonug.jpg",
		big_transporter : "http://s1.directupload.net/images/140121/shdrwvx4.jpg",
		bireme : "http://s1.directupload.net/images/140121/op3pm7ig.jpg",
		calydonian_boar : "http://s14.directupload.net/images/140121/5qr5nmxo.jpg",
		catapult : "http://s1.directupload.net/images/140121/gv9r6p24.jpg",
		centaur : "http://s7.directupload.net/images/140121/7lytp7ku.jpg",
		cerberus : "http://s14.directupload.net/images/140121/58gsjmi9.jpg",
		chariot : "http://s14.directupload.net/images/140121/vlfs3fmp.jpg",
		colonize_ship : "http://s14.directupload.net/images/140121/zgcvw7q2.jpg",
		demolition_ship : "http://s7.directupload.net/images/140121/h3isd3id.jpg",
		fury : "http://s7.directupload.net/images/140121/97qhkxxu.jpg",
		godsent : "http://s1.directupload.net/images/140121/oc3euuhk.jpg",
		griffin : "http://s7.directupload.net/images/140121/lukxwqlc.jpg",
		harpy : "http://s1.directupload.net/images/140121/7hl9sx8x.jpg",
		hoplite : "http://s1.directupload.net/images/140121/lllk8ef5.jpg",
		manticore : "http://s1.directupload.net/images/140121/dz3wluob.jpg",
		medusa : "http://s14.directupload.net/images/140121/6qgf9chs.jpg",
		militia : "http://s1.directupload.net/images/140121/exvjtpb6.jpg",
		minotaur : "http://s7.directupload.net/images/140121/o8a34o3n.jpg",
		pegasus : "http://s1.directupload.net/images/140121/e8ovbacv.jpg",
		rider : "http://s14.directupload.net/images/140121/39pvt7u6.jpg",
		sea_monster : "http://s14.directupload.net/images/140121/hflh35u5.jpg",
		slinger : "http://s1.directupload.net/images/140121/jtfdfuk9.jpg",
		small_transporter : "http://s14.directupload.net/images/140121/oxgq69a8.jpg",
		sword : "http://s14.directupload.net/images/140121/vpaij5z9.jpg",
		trireme : "http://s14.directupload.net/images/140121/mdzzpxye.jpg",
		zyklop : "http://s1.directupload.net/images/140121/oihz5sop.jpg",
		andromeda : "http://s7.directupload.net/images/140121/4jdz5tso.jpg",
		atalanta : "http://s1.directupload.net/images/140121/yo6vp8l2.jpg",
		cheiron : "http://s1.directupload.net/images/140121/tkpytdq8.jpg",
		ferkyon : "http://s1.directupload.net/images/140121/glncylst.jpg",
		helen : "http://s1.directupload.net/images/140121/m75fi7pf.jpg",
		hercules : "http://s1.directupload.net/images/140121/hnaqid9l.jpg",
		leonidas : "http://s1.directupload.net/images/140121/tskyuwpt.jpg",
		orpheus : "http://s7.directupload.net/images/140121/hfjeztt4.jpg",
		terylea : "http://s7.directupload.net/images/140121/vev4s7z7.jpg",
		urephon : "http://s14.directupload.net/images/140121/jfqewwux.jpg",
		zuretha : "http://s7.directupload.net/images/140121/o6cf8cya.jpg",
	};

	/************************************************************************
	 * Links
	 ***********************************************************************/
	QT.Links = {
		GS_Spieler : "http://www." + mID + ".grepostats.com/world/" + wID + "/player/" + sID,
		GS_Allianz : "http://www." + mID + ".grepostats.com/world/" + wID + "/alliance/" + aID,
		GS_Bash : "http://www." + mID + ".grepostats.com/world/" + wID + "/alliance/" + aID + "/members",
		GrepoBash : "http://grepobash.de/show.php?server=" + wID + "&ally=" + aID + "&order=all",
		GrepoMaps : "http://" + wID + ".grepolismaps.org",
		Polissuche_faark : "http://grepo.faark.de/tondasPolisSuche/townSearch.php/" + wID,
		Unitvergleich : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dHU0VUZ4SDRnNXh4bWZhUnRESEdJaUE#gid=0",
		ForumMax : "http://" + wID + ".grepolis.com/forum",
		Grepofinder : "http://www.drolez.com/grepofinder/" + wID,
		Polissuche : "http://polissuche.marco93.de/" + wID + ".html",
		GrepoIntelMap : "http://grepointel.com/map.php?server=" + wID,
		GrepoIntelPlayer : "http://grepointel.com/track.php?server=" + wID,
		GrepoIntelAlliance : "http://grepointel.com/alliance.php?server=" + wID,
		GrepoIntelKillers : "http://grepointel.com/topkillers.php?server=" + wID,
		gretimes : "http://gretimes.community.grepolis.pl",
		grepostats : "http://www." + mID + ".grepostats.com",
		grepointel : "http://www.grepointel.com",
		grepomaps_main : "http://www.grepolismaps.org",
		grepobash_main : "http://www.grepobash.de",
		grepofinder_main : "http://www.drolez.com/grepofinder/",
		polisssuche_main : "http://polissuche.marco93.de",
		einheitenvergleich : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dHU0VUZ4SDRnNXh4bWZhUnRESEdJaUE",
		grepoutils : "http://www.grepoutils.webxxs.com",
		abakus : "http://forum.de.grepolis.com/showthread.php?691-Abakus-Der-Grepolis-Rechner",
		grepotool : "http://forum.de.grepolis.com/showthread.php?28359",
		youscreen : "http://www.youscreen.de",
		quacktools : "https://openuserjs.org/scripts/quackmaster/Quack/Quack_Toolsammlung",
		grc : "http://grepolis.potusek.eu/module/installgrc",
		playerprofilescript : "https://openuserjs.org/scripts/Menidan/Grepolis_Spielerprofil_mit_Zur%C3%BCck-Button",
		attackwarner : "http://forum.de.grepolis.com/showthread.php?25986",
		grepotownslist : "http://userscripts-mirror.org/scripts/show/84608.html",
		grepolisrevobericht : "http://forum.de.grepolis.com/showthread.php?29259",
		grepoforen : "http://www.grepoforen.de",
		transportrechner_menidan : "https://openuserjs.org/scripts/Menidan/Grepolis_Transportrechner",
		zeitrechner : "https://openuserjs.org/scripts/Menidan/Grepolis_Zeitrechner",
		diotools : "http://forum.de.grepolis.com/showthread.php?28838",
		bauerndorfalarm : "http://forum.de.grepolis.com/showthread.php?28919",
		quo : "http://www.quo.marekblomkvist.com/" + wID,
		quo_main : "http://www.quo.marekblomkvist.com",
		grepolisqt_main : "http://www.grepolisqt.de",
		grepolisqt : "http://adf.ly/pcChx",
		grepolisqt_facebook : "https://www.facebook.com/grepolisqt",
		revoformatierer : "http://tms-partner.de/Grepolis/revoeingabe.php",
		gs_eroberungsstatistiken : "https://openuserjs.org/scripts/Menidan/Grepolis_Stats_Eroberungsstatistiken"
	};
    
	/************************************************************************
	 * Settings
	 ***********************************************************************/
	QT.Settings = {
		values : {
            "googledrive_client_id" : "",
            "googledrive_folder_id" : "",
            
				/*            
			"onlinetotal" : 0,
			"qmenu_online_version" : 0,
			"qmenu_update_next" : 0,
			"script_version" : 0,
			"googledocsurl" : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dEF3bWs3SW5iWjdyUEE0M0c3Znpmc3c",
			"qmenu_settings_akademieplaner" : true,
			"qmenu_settings_berichte_farben" : true,
			"qmenu_settings_berichte_filter" : true,
			"qmenu_settings_berichte_losses" : true,
			"qmenu_settings_berichte_move" : true,
			"qmenu_settings_berichte_sortfolders" : true,
			"qmenu_settings_buttonbar" : true,
			"qmenu_settings_cityview_BTN" : true,
			"qmenu_settings_cityview_window" : true,
			"qmenu_settings_counter" : true,
			"qmenu_settings_counter_aktiv" : true,
			"qmenu_settings_farmhelper" : true,
			"qmenu_settings_farmhelper_hidecities" : true,
			"qmenu_settings_forumdelete" : true,
			"qmenu_settings_grepopoints" : true,
			"qmenu_settings_hidesilver" : true,
			"qmenu_settings_hidessilver" : true,
			"qmenu_settings_hidessort" : true,
			"qmenu_settings_hotkey_anzeige" : true,
			"qmenu_settings_hotkey_jump" : true,
			"qmenu_settings_hotkey_active" : true,
			"qmenu_settings_island_villages" : true,
			"qmenu_21_links" : true,
			"qmenu_settings_maximize_forum" : true,
			"qmenu_settings_plusmenu" : true,
			"qmenu_settings_questliste" : true,
			"qmenu_settings_questpfeil" : true,
			"qmenu_settings_stadtliste" : true,
			"qmenu_settings_tradeimprovement" : true,
			"qmenu_settings_transport_rechner" : true,
			"qmenu_settings_townbb" : true*/
		},
		save : function (name, value) {
			QT_saveValue(name, value);
		},
		save_all : function (valuesToSave) {
			QT_saveAllValues(valuesToSave);
		},
		delete : function (name) {
			QT_deleteValue(name);
		},
		delete_all : function () {
			QT_deleteAllValues();
		},
		setValues : function () {
			for (var opt in DATA) {
				QT.Settings.values[opt] = DATA[opt];
			}
		}
	};

	/************************************************************************
	 * Ajax Call functions
	 ***********************************************************************/
	QT.CallAjaxFunction = {
		index : {
			switch_town : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
				if (QT.Settings.values.qmenu_settings_hidesilver)
					QT.Functions.hidesIndexIron();
				if (QT.Settings.values.qmenu_settings_cityview_window)
					QT.Functions.city_view_windowTitle();
			}
		},
		report : {
			index : function () {
				if (QT.Settings.values.qmenu_settings_berichte_sortfolders)
					QT.Functions.reportFoldersort();
				if (QT.Settings.values.qmenu_settings_berichte_farben)
					QT.Functions.reportsColor();
				if (QT.Settings.values.qmenu_settings_berichte_move)
					QT.Functions.reportsMove();
				if (QT.Settings.values.qmenu_settings_berichte_filter)
					QT.Functions.reportsFilter();
			},
			move : function () {
				if (QT.Settings.values.qmenu_settings_berichte_sortfolders)
					QT.Functions.reportFoldersort();
				if (QT.Settings.values.qmenu_settings_berichte_farben)
					QT.Functions.reportsColor();
				if (QT.Settings.values.qmenu_settings_berichte_move)
					QT.Functions.reportsMove();
				if (QT.Settings.values.qmenu_settings_berichte_filter)
					QT.Functions.reportsFilter();
			},
			delete_many : function () {
				if (QT.Settings.values.qmenu_settings_berichte_sortfolders)
					QT.Functions.reportFoldersort();
				if (QT.Settings.values.qmenu_settings_berichte_farben)
					QT.Functions.reportsColor();
				if (QT.Settings.values.qmenu_settings_berichte_move)
					QT.Functions.reportsMove();
				if (QT.Settings.values.qmenu_settings_berichte_filter)
					QT.Functions.reportsFilter();
			},
			view : function () {
				if (QT.Settings.values.qmenu_settings_berichte_losses)
					QT.Functions.reportsLosses();
			}
		},
		alliance_forum : {
			forum : function () {
				if (QT.Settings.values.qmenu_settings_maximize_forum)
					QT.Functions.forumMaximize();
				if (QT.Settings.values.qmenu_settings_forumdelete)
					QT.Functions.forumDeleteMultiple();
			}
		},
		town_overviews : {
			hides_overview : function () {
				if (QT.Settings.values.qmenu_settings_hidessilver)
					QT.Functions.hidesoverviewiron();
				if (QT.Settings.values.qmenu_settings_hidessort)
					QT.Functions.hidesSort();
			},
			command_overview : function (event, xhr, settings) {
				QT.Functions.commandOverview(event, xhr, settings);
			},
			culture_overview : function () {
				QT.Functions.cultureOverview();
			},
			start_celebration : function () {
				QT.Functions.cultureOverview();
			},
			start_all_celebrations : function () {
				QT.Functions.cultureOverview();
			}
		},
		building_main : {
			index : function (event, xhr, settings) {
				if (QT.Settings.values.qmenu_settings_grepopoints)
					QT.Functions.grepopoints(event, xhr, settings);
			},
			build : function (event, xhr, settings) {
				if (QT.Settings.values.qmenu_settings_grepopoints)
					QT.Functions.grepopoints(event, xhr, settings);
			},
			cancel : function (event, xhr, settings) {
				if (QT.Settings.values.qmenu_settings_grepopoints)
					QT.Functions.grepopoints(event, xhr, settings);
			},
			tear_down : function (event, xhr, settings) {
				if (QT.Settings.values.qmenu_settings_grepopoints)
					QT.Functions.grepopoints(event, xhr, settings);
			}
		},
		building_barracks : {
			build : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
			},
			cancel : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
			}
		},
		building_docks : {
			build : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
			},
			cancel : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
			}
		},
		building_place : {
			units_beyond : function () {
				QT.Functions.unitsBeyondView();
			}
		},
		units_beyond_info : {
			send_back_part : function () {
				QT.Functions.unitsBeyondView();
			}
		},
		frontend_bridge : {
			fetch : function () {
				if (QT.Settings.values.qmenu_settings_hidesilver)
					QT.Functions.hidesIndexIron();
				//if (QT.Settings.values.qmenu_settings_hideaddpoints)
				//QT.Functions.hidesIndexAddPoints();
			},
			execute : function () {
				if ($("#tr_wrapper").css('display') != 'none')
					QT.Functions.transportcalculator.refresh();
				if (QT.Settings.values.qmenu_settings_stadtliste && $('#town_groups_list').is(':visible'))
					QT.Functions.townslist();
				if (QT.Settings.values.qmenu_settings_hidesilver)
					QT.Functions.hidesIndexIron();
				//if (QT.Settings.values.qmenu_settings_hideaddpoints)
				//QT.Functions.hidesIndexAddPoints();
			}
		},
		building_academy : {
			index : function () {
				if (QT.Settings.values.qmenu_settings_akademieplaner)
					QT.Functions.academyMarker();
			},
			research : function () {
				if (QT.Settings.values.qmenu_settings_akademieplaner)
					QT.Functions.academyMarker();
			},
			cancel : function () {
				if (QT.Settings.values.qmenu_settings_akademieplaner)
					QT.Functions.academyMarker();
			},
			revert_research : function () {
				if (QT.Settings.values.qmenu_settings_akademieplaner)
					QT.Functions.academyMarker();
			}
		},
		town_info : {
			info : function () {
				QT.Functions.townInactivity();
				QT.Functions.townGSButton();
			},
			trading : function () {
				if (QT.Settings.values.qmenu_settings_tradeimprovement)
					QT.Functions.townTradeImprovement();
			}
		},
		player : {
			get_profile_html : function (event, xhr, settings) {
				QT.Functions.playerGSButton(event, xhr, settings);
			},
			index : function () {
				QT.Functions.addsettingsbutton();
			}
		},
		island_info : {
			index : function (event, xhr, settings) {
				QT.Functions.islandMessage();
				QT.Functions.islandInactivity(event, xhr, settings);
				QT.Functions.islandAddPlayerlinks(event, xhr, settings);
				if (QT.Settings.values.qmenu_settings_island_villages)
					QT.Functions.islandFarmingVillages();
			}
		},
		alliance : {
			profile : function (event, xhr, settings) {
				QT.Functions.allianceGSButton(event, xhr, settings);
				QT.Functions.allianceInactivity(event, xhr, settings);
			}
		},
		farm_town_overviews : {
			claim_loads : function () {
				if (QT.Settings.values.qmenu_settings_farmhelper)
					QT.Functions.farmingvillageshelper.rememberloot();
					QT.Functions.farmingvillageshelper.indicateLoot();
			},
			get_farm_towns_for_town : function () {
				if (QT.Settings.values.qmenu_settings_farmhelper && typeof activeFarm != 'undefined')
					QT.Functions.farmingvillageshelper.setloot();
			},
			index : function () {
				QT.Functions.farmingvillageshelper.islandHeader();
			}
		},
		message : {
			view : function (event, xhr, settings) {
				QT.Functions.messageViewAll();
				QT.Functions.messageExport();
			},
			new : function () {
				QT.Functions.messageInputwidth();
			}
		}
	};

	/************************************************************************
	 * Functions
	 ***********************************************************************/
	QT.Functions = {
		Buttons : function () {
			$('#ui_box').append('<div id="qt_buttons" style="position: relative;top: 54px;z-index: 100"><button id="qt_save">Save</button><button id="qt_saveall">Save all</button><button id="qt_delete">Delete</button><button id="qt_deleteall">Delete all</button></div>');
			$("#qt_save").click(function () {
				QT.Settings.save("messageOpenAlert", false);
			});
			$("#qt_saveall").click(function () {
				var values = {};
				values.messageOpenAlert = false;
				values.reportOpenAlert = false;
				QT.Settings.save_all(values);
			});
			$("#qt_delete").click(function () {
				QT.Settings.delete("messageOpenAlert");
			});
			$("#qt_deleteall").click(function () {
				QT.Settings.delete_all();
			});
		},
		test : function () {
			alert("Test funktioniert");
		},
		helper : {
			grepo_btn : function (ID, Text) {
				return $('<a id="' + ID + '" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>' + Text + '</small></span></span></span></a>');
			},
			grepo_dropdown : function (ID, Options) {
				var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
				$.each(Options, function (a, b) {
					if (QT.Lang[b]) {
						var option_image = QT.Lang[b].meta.flag;
					} else {
						var option_image = "";
					}
					var option_name = (QT.Lang[b]) ? b.toUpperCase() : b;
					str += '<option style="background: url(' + option_image + ') no-repeat scroll left center #EEDDBB; padding-left: 22px" value="' + b + '">' + option_name + '</option>'
				});
				str += '</select></span></span></span>';
				return $(str);
			},
			grepo_input : function (Style, ID, Text) {
				return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
			},
			grepo_submenu : function (ID, Title) {
				return $('<li><a id="' + ID + '" class="submenu_link" href="#"><span class="left"><span class="right"><span class="middle" title="' + Title + '">' + Title + '</span></span></span></a></li>');
			},
			grepo_playerlink : function (name, id) {
				return '<a class="gp_player_link" href="#' + btoa('{"name":"' + name + '","id":' + id + '}') + '">' + name + '</a>';
			},
			windowbuilder : function (name, width, height, content) {
				var winqm = Layout.wnd.Create(Layout.wnd.TYPE_QT_STANDARD, name);
				winqm.setWidth(width);
				winqm.setHeight(height);
				winqm.setContent(content);
				return winqm.getID();
			}
		},
		academyMarker : function () {
			var wndID = BuildingWindowFactory.getWnd().getID();
			var qacmarkDIV = '<div class="qacamark green" style="width: 100%; height: 100%; position: absolute; background: none repeat scroll 0% 0% green; top: -3px; left: -3px; border: 3px solid green; opacity: 0.4"></div>';
			$("DIV#gpwnd_" + wndID).append('<div id="qacacountWrapper"><div id="qacacountGreen" class="qacacountBox" style="margin-left:25px">0</div><div id="qacacountRed" class="qacacountBox" style="margin-left:70px">0</div><a id="qacamarkResearched" class="qacaBTN green" style="left:104px; background-image: url(http://s1.directupload.net/images/130904/2tny5dlh.png)" href="#"></a><a id="qacamarkNotResearched" class="qacaBTN green" style="left:124px; background-image: url(http://s7.directupload.net/images/130904/pkeasgik.png)" href="#"></a><a id="qacamarkNone" class="qacaBTN" style="left:144px; background-image: url(http://s1.directupload.net/images/130904/yothfag9.png)" href="#"></a></div>');
			$("#qacacountWrapper").css({
				"margin" : " 0px auto",
				"display" : "block",
				"position" : "relative",
				"height" : "35px",
				"width" : "172px",
				"background-image" : "url(http://s7.directupload.net/images/130924/wvvkhpvh.png)"
			});
			$(".qacacountBox").css({
				"margin-top" : "12px",
				"font" : "bold 11px Verdana",
				"position" : "absolute",
				"display" : "block"
			});
			$(".qacaBTN").css({
				"width" : "20px",
				"height" : "20px",
				"margin-top" : "8px",
				"position" : "absolute",
				"display" : "block"
			});
			$(".academy_info").css({
				"z-index" : "1"
			});
			$(".qacaBTN").hover(
				function () {
				$(this).css({
					"background-position" : "0px -21px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			});
			$('#qacamarkResearched').mousePopup(new MousePopup(QT.Lang.get("academy", "researched")));
			$('#qacamarkNotResearched').mousePopup(new MousePopup(QT.Lang.get("academy", "notresearched")));
			$('#qacamarkNone').mousePopup(new MousePopup(QT.Lang.get("academy", "undo")));
			function resetSelected() {
				$(".qacamark").each(function () {
					$(this).remove();
				});
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
				researchSelected = {};
				UpdateResearchPointsText();
				$("#qacamarkResearched").removeClass().addClass("qacaBTN green").css({
					"background-image" : "url(" + qacaBTNpics.qacamarkResearched[0] + ")"
				});
				$("#qacamarkNotResearched").removeClass().addClass("qacaBTN green").css({
					"background-image" : "url(" + qacaBTNpics.qacamarkNotResearched[0] + ")"
				});
			};
			function GetResearchColorPoints() {
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
				$(".qacamark").each(function () {
					var thisColor = $(this).attr('class').split(' ').pop();
					researchPoints[thisColor] += GameData.researches[$(this).parent().attr('id').substr(17)].research_points;
				});
			};
			function UpdateResearchPointsText() {
				$("#qacacountRed").text(researchPoints.red);
				$("#qacacountGreen").text(researchPoints.green);
				$("#qacacountBlue").text(researchPoints.blue + "/120");
			};
			function SafeResearchColor() {
				$(".qacamark").each(function () {
					var thisColor = $(this).attr('class').split(' ').pop();
					researchSelected[$(this).parent().attr('id')] = thisColor;
				});
			};
			function ChangeAllResearchColors(researchselector, color) {
				$("DIV#gpwnd_" + wndID + researchselector).each(function () {
					var thisParent = $(this).parent();
					if (!$(".qacamark", thisParent).length > 0 && color != "nocolor") {
						$(".academy_info", thisParent).after(qacmarkDIV);
					} else if (color === "nocolor") {
						$(".qacamark", thisParent).remove();
					}
					$(".qacamark", thisParent).removeClass().addClass("qacamark " + color).css({
						"background-color" : color,
						"border-color" : color
					});
				});
			};
			$(".qacaBTN").click(function () {
				var thisColor = $(this).attr('class').split(' ').pop();
				if (this.id != "qacamarkNone") {
					if (thisColor === "green") {
						$(this).removeClass("green").addClass("red").css({
							"background-image" : "url(" + qacaBTNpics[this.id][1] + ")"
						});
					} else if (thisColor === "red") {
						$(this).removeClass("red").addClass("nocolor").css({
							"background-image" : "url(" + qacaBTNpics[this.id][2] + ")"
						});
					} else if (thisColor === "nocolor") {
						$(this).removeClass("nocolor").addClass("green").css({
							"background-image" : "url(" + qacaBTNpics[this.id][0] + ")"
						});
					}
					if (this.id === "qacamarkResearched") {
						ChangeAllResearchColors(" .is_researched,.in_progress", thisColor);
					} else if (this.id === "qacamarkNotResearched") {
						ChangeAllResearchColors(" .can_be_researched,.can_not_be_researched_yet", thisColor);
					}
				} else {
					resetSelected();
				}
				GetResearchColorPoints();
				UpdateResearchPointsText();
				SafeResearchColor();
			});
			$("DIV#gpwnd_" + wndID + " .academy_info").click(function () {
				var thisParent = $(this).parent();
				if ($(".qacamark", thisParent).length > 0) {
					var $this = $(".qacamark", thisParent);
					if ($this.hasClass("green")) {
						$this.removeClass("green").addClass("red").css({
							"background-color" : "red",
							"border-color" : "red"
						});
					} else if ($this.hasClass("red")) {
						$this.remove();
					}
				} else {
					$(".academy_info", thisParent).after(qacmarkDIV);
				}
				GetResearchColorPoints();
				UpdateResearchPointsText();
				SafeResearchColor();
			});
			//init
			if (typeof researchSelected == "undefined") {
				researchSelected = {};
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
				qacaBTNpics = {
					"qacamarkResearched" : ["http://s1.directupload.net/images/130904/2tny5dlh.png", "http://s14.directupload.net/images/130904/q3kd5re4.png", "http://s1.directupload.net/images/130904/w4juy8xf.png"],
					"qacamarkNotResearched" : ["http://s7.directupload.net/images/130904/pkeasgik.png", "http://s1.directupload.net/images/130904/qmzufy5p.png", "http://s1.directupload.net/images/130904/bt42389p.png"]
				}
			} else {
				$.each(researchSelected, function (key, value) {
					$("#" + key + " .academy_info").after(qacmarkDIV);
					$("#" + key + " .qacamark").removeClass("green").addClass(value).css({
						"background-color" : value,
						"border-color" : value
					});
				});
				UpdateResearchPointsText();
			}
		},
		addsettingsbutton : function () {
			var b = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_SETTINGS);
			if (!b)
				return;
			var c = $("DIV#gpwnd_" + b.getID() + " .settings-menu ul:last");
			if ($(c).find('#quack-toolsammlung').length == 0) {
				$(c[0]).append('<li><img id="quackicon" style="width:20px;height:15px;vertical-align:bottom;" src="http://s1.directupload.net/images/130206/r2q9fzri.png"></img> <a id="quack-toolsammlung" href="#">Quack Toolsammlung</a></li>');
				$("#quack-toolsammlung").click(function () {
					QT.Functions.scriptmanager();
				})
			}
		},
		allianceGSButton : function (event, xhr, settings) {
			var b = settings.url.match(/alliance_id%22%3A(\d*)%2C/);
			var c = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_ALLIANCE_PROFILE);
			if (!c)
				return;
			var d = $("DIV#gpwnd_" + c.getID() + " DIV#player_buttons ");
			$(d[0]).find(".ally_msg_leader, .ally_msg_founder").css({
				"float" : "left"
			});
			$(d[0]).append("<a target=_blank href=http://" + mID + ".grepostats.com/world/" + wID + "/alliance/" + b[1] + '><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>')
		},
        /*
		allianceInactivity : function () {
			var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_ALLIANCE_PROFILE);
			if (!wnd)
				return;
			var wndID = wnd.getID();
			//$("DIV#gpwnd_" + wndID + " DIV#ally_towns UL.members_list > LI > UL > LI:not(.error_message):not(.sub_header):not(.header):not(:has(ul))")
			//$("DIV#gpwnd_" + wndID + " DIV#ally_towns UL.members_list UL LI:not(.error_message):not(.sub_header):not(.header):not(:has(ul))")
			$("DIV#gpwnd_" + wndID + " DIV#ally_towns UL.members_list > LI > UL > LI:not(.error_message):not(.sub_header):not(.header):not(:has(ul))").prepend(QT.Functions.Inactivity.addDisplay("margin:3px 4px 0 0;"));
			var currentTownXY = QT.Functions.Inactivity.Filter.coordinates();

			var JQelement_qt_activity = $("DIV#gpwnd_" + wndID + " DIV#ally_towns UL.members_list UL LI A.qt_activity");
			var players = [];
			JQelement_qt_activity.parent().each(function (index, element) {
				var gpElement = $(this).find(".gp_player_link");
				var qt_activityElement = $(this).find(".qt_activity");
				var href = gpElement.attr("href").split(/#/);
				var id = $.parseJSON(atob(href[1] || href[0])).id;
				if (QT.Functions.Inactivity.isCached(id)) {
					var inactive_days_cached = QT.Functions.Inactivity.cache[id];
					QT.Functions.Inactivity.changeDisplay(qt_activityElement, inactive_days_cached);
				} else {
					players.push(id);
				}
				qt_activityElement.data("id", id).prop('href', 'http://polissuche.marco93.de/' + wID + '.html?filter=player_id:' + id + currentTownXY + '');
			});

			if (!players.length > 0)
				return;

			QT.Functions.Inactivity.getData(players).done(function (data) {
				JQelement_qt_activity.each(function (index, element) {
					var dataID = $(this).data('id');
					QT.Functions.Inactivity.changeDisplay(this, QT.Functions.Inactivity.cache[dataID]);
				});
			});
		},
        */
		bbcodeBtnTown : function () {
			$('<a id="BTN_TownBB" href="#"></a><input id="INPUT_TownBB" type="text" onfocus="this.select();" onclick="this.select();">').appendTo('.town_name_area');
			$("#BTN_TownBB").css({
				"z-index" : "5",
				"top" : "56px",
				"left" : "95px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "18px",
				"background-image" : "url(http://s14.directupload.net/images/131121/eif6bq74.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px 0px"
			});
			$("#INPUT_TownBB").css({
				"z-index" : "5",
				"top" : "29px",
				"left" : "21px",
				"position" : "absolute",
				"width" : "160px",
				"display" : "none",
				"text-align" : "center"
			});
			$("#BTN_TownBB").click(function () {
				$("#INPUT_TownBB").toggle();
				$("#INPUT_TownBB").val("[town]" + Game.townId + "[/town]");
			});
			$("#BTN_TownBB").hover(
				function () {
				$(this).css({
					"background-position" : "0px -16px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			});
		},
        
		bbcodes : function (mode) {
			var GD_units = GameData.units;
			var units_own = ITowns.getTown(parseInt(Game.townId)).units();
			var units_support = ITowns.getTown(parseInt(Game.townId)).unitsSupport();
			var units_outer = ITowns.getTown(parseInt(Game.townId)).unitsOuter();
			var cities_own = ITowns.towns_collection.models;
			var active_towngroup = MM.collections.TownGroup[0].getActiveGroupId();
			var cities_towngroup = ITowns.town_group_towns.getTowns(active_towngroup);
			var bbcodeArray = [];
			var bbcodeBild = "[*]";
			var bbcodeAnzahlEigeneTruppen = "";
			var bbcodeAnzahlUnterstüzung = "";
			var bb_content = "";
			var bb_windowtitle = "";
			if (mode === "bbcode_intown") {
				$.each(units_own, function (unit, number) {
					if (units_own[unit] != 0) {
						if (units_support[unit]) {
							number += units_support[unit];
						}
						bbcodeAnzahlEigeneTruppen += unit + ";" + number + ";";
						bbcodeArray.push("" + unit + "");
					}
				});
				$.each(units_support, function (unit, number) {
					if (units_support[unit] != 0 && bbcodeArray.indexOf(unit) == -1) {
						bbcodeAnzahlUnterstüzung += unit + ";" + number + ";";
					}
				});
				bb_content += Game.townName + ";" ;
				bb_content += bbcodeAnzahlEigeneTruppen + "\r\n";
				bb_content += Game.townName + ";" ;
				bb_content += bbcodeAnzahlUnterstüzung;
				return bb_content;
			} 
            
            else if (mode === "bbcode_fromtown") {
				$.each(units_own, function (unit, number) {
					if (units_own[unit] != 0) {
						bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
						bbcodeAnzahl += "[center]" + number + "[/center][|]";
					}
				});
				bb_content = "[b]" + QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "from") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[table]" + bbcodeBild.slice(0, -3) + bbcodeAnzahl.slice(0, -3) + "[/table]";
				bb_windowtitle = QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "from") + " " + Game.townName;
			} else if (mode === "bbcode_outer") {
				gpAjax.ajaxPost('units_beyond_info', 'get_supporting_units_for_foreigners', {}, false, function (data) {
					$.each(data.collections[0].data, function (index, object) {
						bb_content += "[town]" + object.current_town_id + "[town]";
						$.each(object, function (unit, number) {
							if (GD_units[unit] && number != 0) {
								bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
								bbcodeAnzahl += "[center]" + number + "[/center][|]";
							}
						});
					});
					bb_content = "[b]" + QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "outside") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[table]" + bbcodeBild.slice(0, -3) + bbcodeAnzahl.slice(0, -3) + "[/table]";
					bb_windowtitle = QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "outside") + " " + Game.townName;
				});
			} 
            else if (mode === "bbcode_buildings") {
				var buildings_levels = ITowns.getTown(parseInt(Game.townId)).buildings();
				var q_buildings = {};
				var q_buildings_special = {
					"trade_office" : "http://s1.directupload.net/images/130426/sivub4fd.png",
					"tower" : "http://s7.directupload.net/images/130426/wjbtzr8z.png",
					"thermal" : "http://s14.directupload.net/images/130426/9hzexzo7.png",
					"theater" : "http://s1.directupload.net/images/130426/daevkl33.png",
					"statue" : "http://s7.directupload.net/images/130426/67vl4qhs.png",
					"oracle" : "http://s7.directupload.net/images/130426/7jj7uzgp.png",
					"lighthouse" : "http://s14.directupload.net/images/130426/xanhmd6w.png",
					"library" : "http://s1.directupload.net/images/130426/3yl9yvuc.png"
				}
				var find_buildings_special = "trade_office tower thermal theater statue oracle lighthouse library";
				var lv_buildings_standard = "";
				var lv_buildings_special = "";
				$.each(GameData.buildings, function (building) {
					if (find_buildings_special.indexOf(building) > -1 && buildings_levels.getBuildingLevel(building) > 0) {
						lv_buildings_standard += q_buildings_special[building];
						lv_buildings_special += buildings_levels.getBuildingLevel(building) + ";";
					}
					q_buildings[building] = buildings_levels.getBuildingLevel(building) + ";";
					if (buildings_levels.getBuildingLevel(building) < 10) {
						q_buildings[building] = q_buildings[building];
					}
				});
				var lv_buildings_standard_reihenfolge =
					"main;" + q_buildings.main +
					"lumber;" + q_buildings.lumber +
					"farm;" + q_buildings.farm +
					"stoner;" + q_buildings.stoner +
					"storage;" + q_buildings.storage +
					"ironer;" + q_buildings.ironer +
					"barracks;" + q_buildings.barracks +
					"temple;" + q_buildings.temple +
					"market;" +  q_buildings.market +
					"docks;" + q_buildings.docks +
					"academy;" + q_buildings.academy +
					"wall;" + q_buildings.wall +
					"hide;" + q_buildings.hide +
					lv_buildings_special;
				bb_content = Game.townName + ";";
				bb_content += lv_buildings_standard + lv_buildings_standard_reihenfolge;
				return bb_content; 
			} 
            
            else if (mode === "bbcode_cities_all") {
				bb_content = "";
				$.each(cities_own, function (key, town) {
					bb_content += "[town]" + town.id + "[/town] (" + town.attributes.points + ") " + town.attributes.island_x + "|" + town.attributes.island_y + "\n";
				});
				bb_windowtitle = QT.Lang.get("bbcode", "cities");
			} else if (mode === "bbcode_cities_grp") {
				var bb_content = "";
				$.each(cities_towngroup, function (key, town) {
					bb_content += "[town]" + town.attributes.town_id + "[/town] (" + town.town_model.attributes.points + ") " + town.town_model.attributes.island_x + "|" + town.town_model.attributes.island_y + "\n";
				});
				bb_windowtitle = QT.Lang.get("bbcode", "cities");
			}
			var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
			var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
			var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
			var expTitel = "Copy & Paste";
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
			wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + bb_windowtitle);
			wnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
			$("#expTextarea").focus(function () {
				var that = this;
				setTimeout(function () {
					$(that).select();
				}, 10);
			});
		},
		city_view_btn : function () {
			$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').removeClass("first");
			$('#ui_box .nui_main_menu .middle .content ul').not("ul li ul").prepend('<li data-option-id="cityview" class="messages main_menu_item first"><span class="content_wrapper"><span class="button_wrapper" style="opacity: 1;"><span class="button"><span class="icon" style="background:url(http://s14.directupload.net/images/140424/vbvnndai.png)"></span><span class="indicator" style="display: none;">0</span></span></span><span class="name_wrapper" style="opacity: 1;"><span class="name">' + QT.Lang.get("grepo_mainmenu", "city_view") + '</span></span></span></li>');
			$('#ui_box .nui_main_menu .middle .content ul').not("ul li ul").css({
				"height" : "+=34px"
			});

			function QT_island_overview() {
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .icon').css({
					"background" : "url(http://s14.directupload.net/images/140501/rwe2n26g.png) no-repeat",
					"top" : "8px",
					"left" : "5px"
				});
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .name').text(QT.Lang.get("grepo_mainmenu", "island_view"));
			}
			function QT_city_overview() {
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .icon').css({
					"background" : "url(http://s14.directupload.net/images/140424/vbvnndai.png) no-repeat",
					"top" : "6px",
					"left" : "6px"
				});
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .name').text(QT.Lang.get("grepo_mainmenu", "city_view"));
			}

			$.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('QT_city_overview', function (e, data) {
				QT_island_overview();
			});

			$.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).subscribe('QT_island_view', function (e, data) {
				QT_city_overview();
			});

			$.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).subscribe('QT_strategic_map', function (e, data) {
				QT_city_overview();
			});

			$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview]').click(function () {
				if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) {
					$("#ui_box .bull_eye_buttons .city_overview").click();
				} else {
					$("#ui_box .bull_eye_buttons .island_view").click();
				}
			});
		},
		city_view_window : function () {
			$.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('QT_city_overview_window', function (e, data) {
				var city_wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
				if (city_wnd) {
					city_wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
					return;
				}
				var html = '<div id="QT_townoverview"></div>';
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_TOWNOVERVIEW) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_TOWNOVERVIEW);
				wnd.setContent(html);
				wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
				var JQel = wnd.getJQElement();
				
				JQel.find(".gpwindow_content").css({
					"overflow" : "hidden",
					"border" : "1px solid black"
				});
				
				JQel.find('#QT_townoverview').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
				
				$('DIV.ui_construction_queue').css({
					"bottom":"-3px"
				});
				$('DIV.ui_city_overview .town_background').css({
					"left" : "-566px",
					"top" : "-316px"
				});
			});
			
			$("#ui_box .bull_eye_buttons .rb_map").on("rb:change:value", function (e, value, old_value) {
				if (value === 'island_view' || value === 'strategic_map') {
					var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
					if (!wnd)
						return;
					wnd.close();
				}
			});
		},
		city_view_windowTitle : function () {
			var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
			if (wnd)
				wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
		},
		commandOverview : function (a, b, c) {
			var d = b.responseText.match(/{(.+)}/);
			var e = $.parseJSON("{" + d[1] + "}");
			if (e.json.data != undefined) {
				if (e.json.data.total_commands.length > 0)
					$("#place_defense .game_border .game_header").html($("#place_defense .game_border .game_header").html().split(" (")[0] + " (" + e.json.data.total_commands + ")");
				var f = {
					attack_land : 0,
					support : 0,
					attack_sea : 0,
					attack_spy : 0,
					farm_attack : 0,
					abort : 0,
					attack_takeover : 0
				};
				for (var g = 0; g < e.json.data.total_commands.length; g++)
					f[e.json.data.commands[g].type]++;
				var h = $("div .support_filter");
				$(h[0]).mousePopup(new MousePopup("Befehle: " + f.attack_land));
				$(h[1]).mousePopup(new MousePopup("Befehle: " + f.support));
				$(h[2]).mousePopup(new MousePopup("Befehle: " + f.attack_sea));
				$(h[3]).mousePopup(new MousePopup("Befehle: " + f.attack_spy));
				$(h[4]).mousePopup(new MousePopup("Befehle: " + f.farm_attack));
				$(h[5]).mousePopup(new MousePopup("Befehle: " + f.abort));
				$(h[6]).mousePopup(new MousePopup("Befehle: " + f.attack_takeover))
			}
		},
		cultureOverview : function () {
			var a = $("ul#cultur_overview_towns");
			var b,
			c,
			d,
			e;

			e = 0;
			b = $('a[class~="confirm"][class~="type_triumph"]');
			d = $('a[class~="confirm"][class~="type_triumph"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			e = 0;
			b = $('a[class~="confirm"][class~="type_theater"]');
			d = $('a[class~="confirm"][class~="type_theater"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			e = 0;
			b = $('a[class~="confirm"][class~="type_party"]');
			d = $('a[class~="confirm"][class~="type_party"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			var g = $("ul#culture_overview_towns span.eta");
			var h = $("#culture_points_overview_bottom #place_culture_count").text();
			if (h.indexOf("[") < 1) {
				var i = h.split("/");
				var j = parseInt(i[0]) + g.length;
				var k = parseInt(i[1]) - j;
				if (k > 0) {
					$("#culture_points_overview_bottom #place_culture_count").append("<span id='qculture'>[-" + k + "]</span>");
				} else {
					var l = new Array;
					for (var f = 0; f < g.length; f++)
						l.push($(g[f]).text());
					l.sort();
					var m = l[l.length + k - 1];
					$("#culture_points_overview_bottom #place_culture_count").append(" [<span id='qculture'></span>]<span id='qcultureplus' style='color: #ECB44D'> +" + k * -1 + "</span>").find("span#qculture").countdown(m);
				}
			} else {
				var i = h.split("/");
				var j = parseInt(i[0]) + g.length;
				var k = parseInt(i[1]) - j;
				if (k > 0) {
					$("#qculture").text("[-" + k + "]");
				} else {
					CultureOverview.wnd.reloadContent();
				}
			}

			if ($('#qcultureBTN_wrapper').length == 0) {
				$("#culture_overview_wrapper").parent().append('<div id="qcultureBTN_wrapper"><div class="qcultureBTN_wrapper_right"><div id="qcultureBTN_theather_r" class="qcultureBTN_r qcultureBTN_theather"></div><div id="qcultureBTN_triumph_r" class="qcultureBTN_r qcultureBTN_triumph"></div><div id="qcultureBTN_olympicgames_r" class="qcultureBTN_r qcultureBTN_olympicgames"></div><div id="qcultureBTN_cityfestival_r" class="qcultureBTN_r qcultureBTN_cityfestival"></div></div></div>');
				//<div class="qcultureBTN_wrapper_left"><div id="qcultureBTN_theather_l" class="qcultureBTN_l qcultureBTN_theather"></div><div id="qcultureBTN_triumph_l" class="qcultureBTN_l qcultureBTN_triumph"></div><div id="qcultureBTN_olympicgames_l" class="qcultureBTN_l qcultureBTN_olympicgames"></div><div id="qcultureBTN_cityfestival_l" class="qcultureBTN_l qcultureBTN_cityfestival"></div></div>
				$("#culture_overview_wrapper").css({
					"top" : "35px",
					"height" : "370px"
				});
				$("#qcultureBTN_wrapper").css({

					"color" : "white",
					"font-family" : "Verdana",
					"font-weight" : "bold",
					"font-size" : "12px",
					"text-align" : "center",
					"line-height" : "25px",
					"text-shadow" : "1px 1px 0 #000000"
				});
				$(".qcultureBTN_wrapper_left").css({
					"position" : "absolute",
					"top" : "0px",
					"left" : "0px",
					"margin-left" : "7px"
				});
				$(".qcultureBTN_wrapper_right").css({
					"position" : "absolute",
					"top" : "0px",
					"right" : "0px"
				});
				$(".qcultureBTN_l, .qcultureBTN_r").css({
					"cursor" : "pointer",
					"width" : "25px",
					"height" : "25px",
					"float" : "right",
					"position" : "relative",
					"margin-left" : "3px",
					"border" : "2px groove gray",
					"background" : "url(http://s7.directupload.net/images/140221/lztu5tha.png)"
				});
				$(".qcultureBTN_cityfestival").css({
					"background-position" : "0 -100px"
				});
				$(".qcultureBTN_olympicgames").css({
					"background-position" : "0 -25px"
				});
				$(".qcultureBTN_triumph").css({
					"background-position" : "0 -75px"
				});
				$(".qcultureBTN_theather").css({
					"background-position" : "0 -50px"
				});
				var qcultureBTN_r_clicked_last = "";
				function hideTownElements(JQelement) {
					var qcultureBTN_mode = "";
					switch (JQelement.id) {
					case "qcultureBTN_cityfestival_r":
						qcultureBTN_mode = "ul li:eq(0)";
						break;
					case "qcultureBTN_olympicgames_r":
						qcultureBTN_mode = "ul li:eq(1)";
						break;
					case "qcultureBTN_triumph_r":
						qcultureBTN_mode = "ul li:eq(2)";
						break;
					case "qcultureBTN_theather_r":
						qcultureBTN_mode = "ul li:eq(3)";
						break;
					default:
						HumanMessage.error("Error");
						break;
					}
					if (qcultureBTN_r_clicked_last === JQelement.id) {
						$("ul#culture_overview_towns li").filter(function () {
							return !!$(qcultureBTN_mode, this).find('.eta').length;
						}).toggle();
						$(JQelement).toggleClass("culture_red");
					} else {
						$("ul#culture_overview_towns li").show().filter(function () {
							return !!$(qcultureBTN_mode, this).find('.eta').length;
						}).hide();
						$(".qcultureBTN_r").removeClass("culture_red");
						$(JQelement).addClass("culture_red");
					}
					qcultureBTN_r_clicked_last = JQelement.id;
					$(".qcultureBTN_r").css({
						border : "2px groove #808080"
					});
					$(".culture_red").css({
						border : "2px groove #CC0000"
					});
				}
				$(".qcultureBTN_r").click(function () {
					hideTownElements(this);
				});
				/*
				function hideCelebrationElements (JQelement) {
				$(".qcultureBTN_r").css({border: "2px groove #808080"});
				$(".culture_red").css({border: "2px groove #CC0000"});
				$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(2)").hide();
				$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(4)").hide();
				}
				$(".qcultureBTN_l").click(function () {
				hideCelebrationElements(this);
				});*/
			}

			var qcultureCounter = {
				cityfestivals : 0,
				olympicgames : 0,
				triumph : 0,
				theather : 0
			};

			var qbashpoints = $("#culture_points_overview_bottom .points_count").text().split("/");
			var qgoldforgames = Math.floor($("#ui_box .gold_amount").text() / 50);
			qcultureCounter.triumph = Math.floor((parseInt(qbashpoints[0]) - parseInt(qbashpoints[1])) / 300) + 1;
			if (qcultureCounter.triumph < 0) {
				qcultureCounter.triumph = 0;
			}
			qcultureCounter.cityfestivals = $('a[class~="confirm"][class~="type_party"]:not(.disabled)').length;
			qcultureCounter.olympicgames = $('a[class~="confirm"][class~="type_games"]:not(.disabled)').length;
			if (qgoldforgames < qcultureCounter.olympicgames) {
				qcultureCounter.olympicgames = qgoldforgames;
			}
			qcultureCounter.theather = $('a[class~="confirm"][class~="type_theater"]:not(.disabled)').length;

			$("#qcultureBTN_cityfestival_r").text(qcultureCounter.cityfestivals);
			$("#qcultureBTN_olympicgames_r").text(qcultureCounter.olympicgames);
			$("#qcultureBTN_triumph_r").text(qcultureCounter.triumph);
			$("#qcultureBTN_theather_r").text(qcultureCounter.theather);
			$(".qcultureBTN_cityfestival").mousePopup(new MousePopup(QT.Lang.get("culture", "cityfestivals")));
			$(".qcultureBTN_olympicgames").mousePopup(new MousePopup(QT.Lang.get("culture", "olympicgames")));
			$(".qcultureBTN_triumph").mousePopup(new MousePopup(QT.Lang.get("culture", "triumph")));
			$(".qcultureBTN_theather").mousePopup(new MousePopup(QT.Lang.get("culture", "theater")));
			//$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(2)").hide();

		},
		farmingvillageshelper : {
			rememberloot : function () {
				var activeFarmClass = $('#time_options_wrapper .active').attr('class').split(' ');
				activeFarm = activeFarmClass[1];
			},
			setloot : function () {
				setTimeout(function () {
					$('#time_options_wrapper .' + activeFarm).click();
				}, 500);
			},
			islandHeader : function () {
				$('#fto_town_list li').each(function( index ) {
					if (this.classList.length == 2) {
						$(this).addClass("q_li_island");
						$(this).append(
						'<div class="qcolordivider" style="background-image: url(http://s14.directupload.net/images/140805/wqknyseg.png); display: block; height: 24px; margin: -4px -2px;"></div>' +
						'<div class="checkbox_new checked disabled" style="position: absolute; right: 2px; top: 5px"><div class="cbx_icon"></div></div>'
						);
						$(this).find("span").css({
							"margin-left" : "2px"
						});
						$(this).find("a").css({
							"color" : "rgb(238, 221, 187)"
						});
					}
				});
				$('.qcolordivider').click(function () {
					var el = $(this).parent().nextUntil(".q_li_island");
					if ($('#fto_town_list li:first[style*="border-right"]').length == 0) {
						el.slideToggle();
					} else {
						el.toggleClass("hidden");
					}
				});
				$("#fto_town_wrapper .game_header").append('<a href="#" id="q_toggleAutohide" style="top: 6px; right: 5px; position: absolute; height: 11px; width: 17px; background-image: url(http://s14.directupload.net/images/140807/bydwxdus.png)"></a>');
				if (!QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
					$("#q_toggleAutohide").addClass('q_autoHideCitiesOff');
				}
				
				$("#q_toggleAutohide").click(function () {
					if (QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
						QT.Settings.save("qmenu_settings_farmhelper_hidecities", false);
					} else {
						QT.Settings.delete("qmenu_settings_farmhelper_hidecities");
					}
					QT.Settings.values.qmenu_settings_farmhelper_hidecities = !QT.Settings.values.qmenu_settings_farmhelper_hidecities;
					$(this).toggleClass('q_autoHideCitiesOff');
				});
				$('<style type="text/css">#fto_town_list li.active {background: rgba(208, 190, 151, 0.60)} .q_autoHideCitiesOff {background-position: 0px -11px}</style>').appendTo('head');
			},
			indicateLoot : function () {
				var activeIsland = $('#fto_town_list li.active').prevAll(".q_li_island").first();
				activeIsland.find("div.checkbox_new").removeClass("disabled");
				if (QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
					activeIsland.find("div.qcolordivider").trigger( "click" );
				}
			},
			switchTown : function (direction) {
				var el;
				if (direction === "up") {
					el = $('#fto_town_list li.active').prevAll("li:not(.q_li_island):visible").first();
				} else {
					el = $('#fto_town_list li.active').nextAll("li:not(.q_li_island):visible").first();
				}
				el.click();
				if (el.get(0)) {
					el.get(0).scrollIntoView();
					var scrollPosition = el.get(0).parentNode.scrollTop;
					var scrollMax = scrollPosition += 405;
					var scrollContainer = el.get(0).parentNode.scrollHeight;
					if (scrollMax != scrollContainer) {
						el.get(0).parentNode.scrollTop -= 160;
					}
				}
			}
		},
		filter : function (playerID) {
			var tester = [297128, 1764472, 432065, 880414, 7809196, 927818, 879988, 265587, 600297, 270260, 603597, 32034, 304581, 1472815, 728273, 1039235, 1550585, 366741, 8271245];
			if (tester.indexOf(playerID) < 0)
				return true;
		},
		fix_Zindex : function () {
			var index_highest = parseInt($("#town_groups_list").css("z-index"), 10);
			$(".ui-dialog").each(function () {
				var index_current = parseInt($(this).css("z-index"), 10);
				if (index_current > index_highest) {
					index_highest += index_current;
				}
			});
			$("#town_groups_list").css({
				"z-index" : index_highest
			})
		},
		forumDeleteMultiple : function () {
			if ($('#forum #postlist').length) {
				if (!$('.qdeletecheckbox').length) {
					$("div.post_functions").each(function( index ) {
						if ($(this).find('a').length > 2) {
							$(this).append('<input class="qdeletecheckbox" type="checkbox">');
						}
					});
				}
				if (!$('#qdeleteAllcheckbox').length && $('.qdeletecheckbox').length) {
					if ($('div.forum_footer').length) {
						$("div.forum_footer").append('<input id="qdeleteAllcheckbox" type="checkbox"  style="margin-right: -7px; margin-left: 25px">');
					} else {
						$("div.game_list_footer").append('<input id="qdeleteAllcheckbox" type="checkbox"  style="position: absolute; right: 6px;">');
					}
				}
				if (!$('#qdeletemultipleBTN').length && $('.qdeletecheckbox').length) {
					$('#forum_buttons').append('<a id="qdeletemultipleBTN" class="q_delete" href="#"></a>');
					$(".q_delete").css({
						"margin-top" : "2px",
						"margin-left" : "2px",
						"position" : "absolute",
						"height" : "23px",
						"width" : "22px",
						"background-image" : "url(http://s14.directupload.net/images/130725/sz66nazr.png)",
						"background-repeat" : "no-repeat",
						"background-position" : "0px 0px"
					});
					$(".q_delete").hover(
						function () {
						$(this).css({
							"background-position" : "0px -23px"
						});
					},
						function () {
						$(this).css({
							"background-position" : "0px 0px"
						});
					});
				}
				
				function AreAnyCheckboxesChecked() {
					var checkboxes = $("#forum #postlist :checkbox");
					var checkboxesChecked = 0;
					for (var i = 0; i < checkboxes.length; i++) {
						if (checkboxes[i].checked) {
							checkboxesChecked++
						}
					}
					return checkboxesChecked;
				}
				
				$('#qdeletemultipleBTN').click(function () {
					var numberChecked = AreAnyCheckboxesChecked();
					if (numberChecked > 0) {
						var deleteconfirmText = "<img style='position: absolute; top:5px;' src='http://s1.directupload.net/images/130724/d7ce2sy6.png'><span style='position: absolute; color: #141414; font: 21px TrajanPro; display: inline; letter-spacing: -5px; margin: -14px auto; padding-left: 0px; width: 22px;'><b>" + numberChecked + "</b></span><br/>" + QT.Lang.get("forum", "delete_sure") + "";
						hOpenWindow.showConfirmDialog('', deleteconfirmText, function () {
							$("#forum #postlist :checkbox:checked").each(function (i) {
								var self = this
									setTimeout(function () {
										var deleteonlick = $(self).parent().find("a:last").attr("onclick").slice(17, -1).split(",");
										Forum.deletePost(deleteonlick[0], deleteonlick[1], true, deleteonlick[3]);
									}, i * 500);
							});
						});
					} else {
						HumanMessage.error(QT.Lang.get("forum", "no_selection"));
					}
				});
				
				$('#qdeleteAllcheckbox').click(function () {
					$('#forum input[type="checkbox"]').prop('checked', this.checked)
				});
				
				$("#forum #postlist :checkbox").click(function () {
					if ($('#qdeleteAllcheckbox').is(":checked")) {
						$('#qdeleteAllcheckbox').prop('checked', false);
					} else if ($('#forum #postlist input[type="checkbox"]').not(":checked").length === 0) {
						$('#qdeleteAllcheckbox').prop('checked', true);
					}
				});
			}
		},
		forumMaximize : function () {
			var qmenu_forum_finder = $(".forum_content").parent().parent().parent();
			if (qmenu_forum_finder.find(".menu_inner").width() != 5000) {
				var forumWidth = qmenu_forum_finder.find(".menu_inner").width();
				qmenu_forum_finder.css({
					"margin-left" : 0 - (forumWidth - 810) / 2 - 85,
					"width" : forumWidth + 170
				});
				qmenu_forum_finder.find(".menu_inner").css({
					"position" : "static"
				});
				qmenu_forum_finder.find(".next").remove();
				qmenu_forum_finder.find(".prev").remove();
			}
			qmenu_forum_finder.find("#wrapper").css({
				"width" : "780px",
				"margin" : "0 auto"
			});
		},
		fullscreenmode : function () {
			$(".nui_toolbar, .nui_left_box, .nui_main_menu, .nui_right_box, .ui_resources_bar, .nui_units_box, .picomap_area, .gods_area, .toolbar_buttons, .tb_activities, .ui_quickbar, .town_name_area, .leaves, .minimized_windows_area, .btn_close_all_windows, #notification_area, #tutorial_quest_container, #island_quests_overview, #bug_reports_link, #BTN_HK").css('visibility', 'hidden');
			$('<div id="vb_back" style="position:absolute;cursor:pointer;z-index:1;top:1px;left:50%;border:1px solid #FFCC66;background-color:#2D5487"><img src=http://s14.directupload.net/images/120327/4tnvbg37.png></img></div>').appendTo("body");
			$("#vb_back").click(function () {
				$(".nui_toolbar, .nui_left_box, .nui_main_menu, .nui_right_box, .ui_resources_bar, .nui_units_box, .picomap_area, .gods_area, .toolbar_buttons, .tb_activities, .ui_quickbar, .town_name_area, .leaves, .minimized_windows_area, .btn_close_all_windows, #notification_area, #tutorial_quest_container, #island_quests_overview, #bug_reports_link, #BTN_HK").css('visibility', 'visible');
				$("#vb_back").remove();
			});
		},
		grepopoints : function (event, xhr, settings) {
			var a = GPWindowMgr.getOpen(Layout.wnd.TYPE_BUILDING);
			if (a.length == 0)
				return;
			var wnd = a[a.length - 1];
			var wndID = wnd.getID();
			if ($("DIV#gpwnd_" + wndID).find("span.tilx_points").length > 0 || $("DIV#gpwnd_" + wndID).find("span.tilx_points_block").length > 0)
				return;
			var buildings_array = GameData.buildings;
			var calculatePoints = function (level, val) {
				points_base = val.points;
				points_factor = val.points_factor
					points = Math.round(val.points * (Math.pow(val.points_factor, level)));
				return points;
			};
			var examineQueue = function (name, level, val) {
				$("DIV#gpwnd_" + wndID + " .building_icon40x40").each(function () {
					if ($(this).hasClass(name)) {
						if (val.max_level == 1) {
							points = "500";
							if ($(this).children("img").length > 0)
								points = "-500";
						} else if ($(".tear_down", this).length > 0) {
							points_old = calculatePoints(level, val);
							--level;
							points_new = calculatePoints(level, val);
							if (level === 0) {
								points = "-" + val.points;
							} else {
								points = points_new - points_old;
							}
						} else {
							points_old = calculatePoints(level, val);
							++level;
							points_new = calculatePoints(level, val);
							if (level === 1) {
								points = val.points;
							} else {
								points = points_new - points_old;
							}
						}
						$(this).append('<span class="tilx_points_block">' + (points !== undefined ? points : '?') + ' P<\/span>');
					}
				});
				return level;
			};
			$.each(buildings_array, function (key, val) {
				var b = $("DIV#gpwnd_" + wndID + " #building_main_" + key);
				if (b.length > 0) {
					level = parseInt($('.level', b).eq(0).text(), 10);
					factor = val.points_factor;
					if (!isNaN(level)) {
						level = examineQueue(key, level, val);
						points_old = calculatePoints(level, val);
						if (level === 0) {
							$('.build:not(.tear_down), .build_grey:not(.tear_down)', b).append('<span class="tilx_points"> (' + (val.points !== undefined ? val.points : '?') + ' P)<\/span>');
						} else if (level < val.max_level && level > 0) {
							points_new = calculatePoints(level + 1, val);
							points = points_new - points_old;
							$('.build:not(.tear_down), .build_grey:not(.tear_down)', b).append('<span class="tilx_points"> (' + (points !== undefined ? points : '?') + ' P)<\/span>');
						}
						if (level - 1 >= 0) {
							points_new = calculatePoints(level - 1, val);
							points = points_new - points_old;
							if (val.max_level === 1) {
								points = 500;
							} else if (level === 1) {
								points = val.points;
							}
							$('.tear_down', b).append('<span class="tilx_points"> (-' + (points !== undefined ? points : '?') + ' P)<\/span>');
						}
					}
				} else {
					var c = $("DIV#gpwnd_" + wndID + " #special_building_" + key).not(".special_tear_down");
					if (c.length > 0) {
						level = examineQueue(key, 0, val);
						if (level === 0) {
							c.append('<span class="tilx_points_block">' + (val.points !== undefined ? val.points : '?') + ' P<\/span>');
						}
						if ($("DIV#gpwnd_" + wndID + " #special_building_" + key + ".special_tear_down").css('backgroundImage').replace(/.*\/([^.]+)\.png.*/, '$1') === key) {
							$('#special_building_' + key + '.special_tear_down').append('<span class="tilx_points_block"> -' + (points !== undefined ? '500' : '?') + ' P<\/span>');
						}
					}
				}
			});
			$("span.tilx_points").css({
				"font-size" : "7px",
				"position" : "relative",
				"bottom" : "1px"
			});
			$("span.tilx_points_block").css({
				"display" : "block",
				"position" : "absolute",
				"top" : "-2px",
				"width" : "100%",
				"z-index" : "5",
				"color" : "#fff",
				"text-shadow" : "1px 1px 0px #000",
				"font-size" : "9px",
				"font-weight" : "bold",
				"background-color" : "rgba(0, 0, 0, 0.4)",
				"text-align" : "center"
			});
		},
		googledocs : function () {
			var html = $('<iframe />', {
					id : "googledocs_frame",
					src : "",
					style : "width:850px;height:506px;border:1px solid black;"
				});
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_GOOGLEDOCS) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_GOOGLEDOCS);
			wnd.setTitle("Google Docs");
			wnd.setContent(html);
			QT.Functions.helper.grepo_input("margin-left:-5px;margin-top:3px;float:left", "googledocsURL_CHANGE_TEXTFELD", QT.Settings.values.googledocsurl).insertAfter('#googledocs_frame');
			QT.Functions.helper.grepo_btn("googledocsURL_RESET_BUTTON", QT.Lang.get("googledocs", "reset")).insertAfter('#googledocs_frame');
			QT.Functions.helper.grepo_btn("googledocsURL_CHANGE_BUTTON", QT.Lang.get("googledocs", "change_url")).insertAfter('#googledocs_frame');
			$("#googledocsURL_CHANGE_TEXTFELD").css({
				"width" : "580px"
			});
			$("#googledocsURL_CHANGE_BUTTON").css({
				"margin-right" : "0px",
				"margin-top" : "3px",
				"float" : "right"
			}).click(function () {
				QT.Settings.values.googledocsurl = $("#googledocsURL_CHANGE_TEXTFELD").val();
				setTimeout(function () {
					QT.Settings.save("googledocsurl", QT.Settings.values.googledocsurl);
				}, 0);
				document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
			});
			$("#googledocsURL_RESET_BUTTON").css({
				"margin-top" : "3px",
				"float" : "right"
			}).click(function () {
				QT.Settings.values.googledocsurl = "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dEF3bWs3SW5iWjdyUEE0M0c3Znpmc3c";
				QT.Settings.delete("googledocsurl");
				document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
				document.getElementById('googledocsURL_CHANGE_TEXTFELD').value = QT.Settings.values.googledocsurl;
			});
			document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
		},
		hidesIndexIron : function () {
			if ($('#hide_espionage').length == 0)
				return;
			var b = ITowns.getTown(parseInt(Game.townId)).getCurrentResources().iron;
			if (b > 15e3) {
				$("#hide_espionage :input").val(b - 15e3);
				setTimeout(function () {
					$("#hide_espionage :input").select().blur();
				}, 10);
			} else {
				$("#hide_espionage :input").val("");
				setTimeout(function () {
					$("#hide_espionage :input").select().blur();
				}, 10);
			}
		},
		hidesIndexAddPoints : function () { //DEFEKT
			function addPoints(nStr) {
				nStr += '';
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + '.' + '$2');
				}
				return x1 + x2;
			}
			var hideSilver = $(".hide_storage_level").text();
			$(".hide_storage_level").text(addPoints(hideSilver));
		},
		hidesSort : function () {
			$("#hides_overview_wrapper").parent().parent().append('<div id="hides_sort_control" class="overview_search_bar" style="width:741px;margin-left:6px"><span class="grepo_input" style="margin:2px"><span class="left"><span class="right"><select name="qsort_towns" id="qsort_towns" type="text"><option value="ironinstore">' + QT.Lang.get("caves", "stored_silver") + '</option><option value="name">' + QT.Lang.get("caves", "name") + '</option><option value="wood">' + QT.Lang.get("caves", "wood") + '</option><option value="stone">' + QT.Lang.get("caves", "stone") + '</option><option value="iron">' + QT.Lang.get("caves", "silver") + '</option></select></span></span></span><div id="qsortinit" class="button_order_by active" style="margin: 3px 0 0 3px"></div></div>');
			QT.Functions.helper.grepo_input("margin-top:0px","qsortfilterbox","").appendTo('#hides_sort_control');
			$('#hides_overview_towns').css({
				"margin-top" : "39px"
			});

			var selection,
			order;
			$("#qsortinit").click(function () {
				sort($("#qsort_towns").val());
				$(this).toggleClass('active')
			});

			function isNumber(n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}
			
			function setfilter(selection) {
				$('#hides_overview_towns>li').show();
				if (isNumber($('#qsortfilterbox').val())) {
					regexpRES = RegExp(/wood|stone|iron/);
					regexpInS = RegExp(/eta/);
					regexpNoT = RegExp(/gp_town_link/);
					numericfilter = parseInt($('#qsortfilterbox').val());
					$('#hides_overview_towns>li').each(function (i, e) {
						if (regexpRES.test(selection)) {
							selectedSort = parseInt($(e).find(selection).text()) || 0;
						} else if (regexpInS.test(selection)) {
							selectedSort = parseInt($(e).find(selection).text().substr(1)) || 0;
						} else {
							selectedSort = $(e).find(selection).text();
							if (!(selectedSort.indexOf(numericfilter) >= 0)) {
								$(e).hide();
							}
						}
						
						if (numericfilter > selectedSort) {
							$(e).hide();
						}
					});
				} else {
					namefilter = $('#qsortfilterbox').val();
					$('#hides_overview_towns>li').each(function (i, e) {
						townname = $(e).find('a.gp_town_link').text();
						if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) {
							$(e).hide();
						}
					});
				}
			};
			
			function sort(selection) {
				order = !order;
				switch (selection) {
				case "ironinstore":
					selection = 'span.eta';
					break;
				case "name":
					selection = 'a.gp_town_link';
					break;
				case "wood":
					selection = 'span.wood span.count';
					break;
				case "stone":
					selection = 'span.stone span.count';
					break;
				case "iron":
					selection = 'span.iron span.count';
					break;
				}
				setfilter(selection);
				var qArrayUnsorted = $('#hides_overview_towns>li').get();
				qArrayUnsorted.sort(function (a, b) {
					regexpRES = RegExp(/wood|stone|iron/);
					regexpInS = RegExp(/eta/);
					if (regexpRES.test(selection)) {
						a = parseInt($(a).find(selection).text()) || 0;
						b = parseInt($(b).find(selection).text()) || 0;
					} else if (regexpInS.test(selection)) {
						a = parseInt($(a).find(selection).text().substr(1)) || 0;
						b = parseInt($(b).find(selection).text().substr(1)) || 0;
					} else {
						a = $(a).find(selection).text().toLowerCase();
						b = $(b).find(selection).text().toLowerCase();
						if (order) {
							return a.localeCompare(b);
						} else {
							return b.localeCompare(a);
						}
					}
					if (order) {
						return b - a
					} else {
						return a - b
					}
				});
				for (var i = 0; i < qArrayUnsorted.length; i++) {
					qArrayUnsorted[i].parentNode.appendChild(qArrayUnsorted[i]);
				}
			}
		},
		hidesoverviewiron : function () {
			var b = $("#hides_overview_towns");
			var c = b.find(".town_item");
			for (var d = 0; d < c.length; d++) {
				var e = $(c[d]);
				var f = e.find(".iron");
				var g = Number(f.text().trim());
				var h = e.find("input");
				if (null != h.val() && g > 15e3) {
					h.val(g - 15e3).change();
					e.find(".iron_img").click();
					var i = HidesOverview.spinners[e.find(".iron_img").attr("name")];
					i.setValue(g - 15e3)
				}
			}
		},
        Inactivity : {
			cache : {},
			addToCache : function (players) {
				$.extend(QT.Functions.Inactivity.cache, players);
			},
			isCached : function (ID) {
				return (ID in QT.Functions.Inactivity.cache) ? true : false;
			},
			getData : function (players) {
				var playersString = players.toString();
				var Ajax = $.ajax({
						url : "http://marco93.de/grepolis/player_inactivity.php",
						dataType : "jsonp",
						data : {
							"world" : wID,
							"players" : playersString
						}
					}).done(function (data) {
						QT.Functions.Inactivity.addToCache(QT.Functions.Inactivity.calcDays(data));
					});
				return Ajax;
			},
			calcDays : function (data) {
				var date_now = new Date();
				var playerArray = {};
				var dataArray = data.split(',');
				$.each(dataArray, function (index, value) {
					var obj_temp = value.split(':');
					var date_user = new Date(parseInt(obj_temp[1], 10) * 1000);
					var date_diff = date_now - date_user;
					var inactive_days = date_diff / 1000 / 60 / 60 / 24;
					var inactive_days_quarter = Math.floor(inactive_days * 4) / 4;
					playerArray[obj_temp[0]] = inactive_days_quarter;
				});
				return playerArray;
			},
			getBG : function (inactive_days) {
				var bgImage = "http://s14.directupload.net/images/140415/mju99vog.png";
				var bgPos = "";
				if (inactive_days < 2) {
					bgPos = "0 -12px";
				} else if (inactive_days >= 2 && inactive_days < 5) {
					bgPos = "0 -24px";
				} else if (inactive_days >= 5) {
					bgPos = "0 -36px";
				}
				return 'url(' + bgImage + ') no-repeat ' + bgPos + '';
			},
			createPopup : function (inactive_days) {
				var popupHTML = '';
				if (typeof inactive_days === 'undefined') {
					popupHTML += QT.Lang.get("town_info", "no_data");
				} else {
					popupHTML += '<b>' + QT.Lang.get("town_info", "inactivity") + ':</b> ' + inactive_days + ' ' + QT.Lang.get("town_info", "days");
				}
				popupHTML += '<p/><span style="font-size:10px">powered by Tondas ' + QT.Lang.get("town_info", "polissuche") + '</span>';
				return popupHTML;
			},
			addDisplay : function (style, link) {
				var p_link = (link) ? link : QT.Links.Polissuche;
				return '<a class="qt_activity" style="display:block; float:left; width:20px; height:12px; background:url(http://s1.directupload.net/images/140416/7fwyuv54.gif) no-repeat;' + style + '" href="' + p_link + '" target="_blank"><span class="qt_activity_number" style="display:block; margin-top:1px; font-size: 8px; color:#EEDDBB; text-shadow:1px 1px #000000; text-align:center"></span></a>';
			},
			changeDisplay : function (JQelement, inactive_days) {
				var number_days = Math.floor(inactive_days);
				var background = QT.Functions.Inactivity.getBG(number_days);
				if (typeof inactive_days === 'undefined') {
					number_days = '-';
				}
				$(JQelement).find(".qt_activity_number").text(number_days);
				$(JQelement).css({
					"background" : background
				});
				$(JQelement).mousePopup(new MousePopup(QT.Functions.Inactivity.createPopup(inactive_days)));
			},
			Filter : {
				coordinates : function () {
					var currentTownX = ITowns.getCurrentTown().getIslandCoordinateX();
					var currentTownY = ITowns.getCurrentTown().getIslandCoordinateY();
					return ';order_type:distance;order_x:' + currentTownX + ';order_y:' + currentTownY;
				}
			}
		},
		islandAddPlayerlinks : function (event, xhr, settings) {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			var d = $.parseJSON(xhr.responseText).json.json.town_list;
			var playerIdArray = [];
			$.each(d, function (key, town) {
				playerIdArray[town.player] = town.pid;
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left UL LI SPAN.player_name").each(function (index, element) {
				var name = $(this).text();
				var id = playerIdArray[name];
				if (id)
					$(this).html(QT.Functions.helper.grepo_playerlink(name, id));
			});
		},
		islandFarmingVillages : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " DIV.center1").css({
				"left" : "255px",
				"width" : "450px",
				"top" : "-1px"
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left").css({
				"bottom" : "0px",
				"left" : "0px",
				"position" : "absolute",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left UL.game_list").css({
				"height" : "352px",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_right").css({
				"bottom" : "0px",
				"right" : "0px",
				"position" : "absolute",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list").css({
				"height" : "382px",
			});
			if ($("DIV#gpwnd_" + c + " DIV.captain_commercial").is(":visible"))
				return;
			if (!$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list li:first-child SPAN").hasClass("small player_name")) {
				$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list").css({
					"height" : "100%",
				});
			}
			$("DIV#gpwnd_" + c + " DIV#farm_town_overview_btn").css({
				"top" : "486px",
			});
		},
        /*
		islandInactivity : function (event, xhr, settings) {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			var d = $.parseJSON(xhr.responseText).json.json.town_list;
			var townInfoArray = [];
			$.each(d, function (key, town) {
				townInfoArray[town.id] = town.pid;
			});
			var JQelement = $("DIV#gpwnd_" + c + " DIV.island_info_left UL LI");
			var currentTownXY = QT.Functions.Inactivity.Filter.coordinates();
			var players = [];
			JQelement.prepend(QT.Functions.Inactivity.addDisplay("margin:2px 3px 0 0;"));
			JQelement.each(function () {
				var e = $(this).find(".gp_town_link").attr("href");
				var f = e.split(/#/);
				var g = $.parseJSON(atob(f[1] || f[0]));
				var qt_activityElement = $(this).find(".qt_activity");
				if (!townInfoArray[g.id]) {
					QT.Functions.Inactivity.changeDisplay(qt_activityElement);
				} else if (QT.Functions.Inactivity.isCached(townInfoArray[g.id])) {
					var inactive_days_cached = QT.Functions.Inactivity.cache[townInfoArray[g.id]];
					QT.Functions.Inactivity.changeDisplay(qt_activityElement, inactive_days_cached);
				} else {
					players.push(townInfoArray[g.id]);
				}
				qt_activityElement.data("id", townInfoArray[g.id]).prop('href', 'http://polissuche.marco93.de/' + wID + '.html?filter=player_id:' + townInfoArray[g.id] + currentTownXY + '');
			});

			if (!players.length > 0)
				return;

			QT.Functions.Inactivity.getData(players).done(function (data) {
				JQelement.find(".qt_activity").each(function (index, element) {
					var dataID = $(this).data('id');
					QT.Functions.Inactivity.changeDisplay(this, QT.Functions.Inactivity.cache[dataID]);
				});
			});
		},
        */
		islandMessage : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " DIV#island_towns_controls").append('<a id="q_message_island" class="q_message" href="#"></a>');
			$(".q_message").css({
				"margin-top" : "2px",
				"right" : "3px",
				"position" : "absolute",
				"height" : "23px",
				"width" : "22px",
				"background-image" : "url(http://s14.directupload.net/images/130417/4lhes4y6.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px 0px"
			});
			$(".q_message").hover(
				function () {
				$(this).css({
					"background-position" : "0px -23px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			});
			$("DIV#gpwnd_" + c + " .q_message").click(function () {
				var spielernamen = "";
				$("DIV#gpwnd_" + c + " #island_info_towns_left_sorted_by_name li span.player_name").each(function () {
					if ($(this).text() != pName && $(this).text() != QT.Lang.get("messages", "ghosttown") && $(this).text() != QT.Lang.get("messages", "no_cities") + "." && spielernamen.indexOf($(this).text()) < 0) {
						spielernamen += $(this).text() + ";";
					}
				});
				Layout.newMessage.open({
					recipients : spielernamen
				});
			});
		},
		messageInputwidth : function () {
			$('#message_recipients').css({
				"width" : "480px"
			});
			$('#message_subject').css({
				"width" : "480px"
			});
			$('#message_buttons').css({
				"width" : "0px"
			});
		},
		messageViewAll : function () {
			var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
			var wndID = wnd.getID();
			if ($(".paginator_qt").is(":visible"))
				return;
			$("DIV#gpwnd_" + wndID + " DIV#message_message_list .paginator_bg:last").after('<a id="QT_viewAll" class="paginator_bg paginator_qt" href="javascript:void(0)">' + QT.Lang.get("messages", "all") + '</a>');
			var pages = $("DIV#gpwnd_" + wndID + " DIV#message_message_list .paginator_bg").not("#QT_viewAll").length;
			var params = {
				offset : 0,
				id : Message.id
			};
			function pagesLoad() {
				gpAjax.ajaxGet('message', 'view', params, true, function (return_data) {
					var elements = return_data.html;
					var found = $('.message_post', elements);
					$('#message_post_container').append(found);
					params.offset += 10;
					if (params.offset < pages * 10)
						pagesLoad();
				});
			}
			$("#QT_viewAll").click(function () {
				$('#message_post_container').empty();
				pagesLoad();
				var prevPage = $("#paginator_selected").text();
				var paginatorOnclick = "'message_message_list', " + prevPage + ", " + params.id + ", 'message', 'view'";
				$("#paginator_selected").replaceWith('<a class="paginator_bg" onclick="paginatorTabsGotoPage(' + paginatorOnclick + ')" href="javascript:void(0)">' + prevPage + '</a>');
				$("#QT_viewAll").replaceWith('<strong id="paginator_selected" class="paginator_bg paginator_qt">' + QT.Lang.get("messages", "all") + '</strong>');
			});
		},
		messageExport : function () {
			var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
			var wndID = wnd.getID();
			if ($("#qt_messageExport").is(":visible"))
				return;
			$("DIV#gpwnd_" + wndID + " DIV#message_message_list .game_header:first").append('<div id="qt_messageExport" style="float:right; margin-top:-19px; cursor:pointer;"><img src="http://s14.directupload.net/images/140124/8tzken7v.png"/></div><div id="qt_messageExportTMP" style="display:none"></div>');
			$("#qt_messageExport").mousePopup(new MousePopup(QT.Lang.get("messages", "export")));
			$("#qt_messageExport").click(function () {
				var bb_content = "[quote]";
				var format_search = [
					/\<b\>(.*?)\<\/b\>/ig,
					/\<i\>(.*?)\<\/i\>/ig,
					/\<u\>(.*?)\<\/u\>/ig,
					/\<s\>(.*?)\<\/s\>/ig,
					/\<center\>(.*?)\<\/center\>/ig,
					/\<a class="bbcodes bbcodes_url".+href.+url=(.*?)%3A%2F%2F(.*?)".+\>(.*?)\<\/a>/ig,
					/\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)\".+\<\/span\>/ig,
					/\<img src="(.*?)" alt=""\>/ig,
					/\<span class="bbcodes bbcodes_color" style="color:(.*?)"\>(.*?)\<\/span\>/ig,
					/\<span class="bbcodes bbcodes_island"\>\<a href=\"#(.*?)\" .+\<\/span\>/ig,
					/\<table.+\<tbody\>(.*?)\<\/tbody\>\<\/table\>/ig,
					/\<tr\>\<td\>/ig,
					/\<tr\>\<th\>/ig,
					/\<\/td\>\<\/tr\>/ig,
					/\<\/th\>\<\/tr\>/ig,
					/\<\/td\>/ig,
					/\<\/th\>/ig,
					/\<td\>/ig,
					/\<th\>/ig
				];
				var format_replace = [
					'[b]$1[/b]',
					'[i]$1[/i]',
					'[u]$1[/u]',
					'[s]$1[/s]',
					'[center]$1[/center]',
					'[url=$1://$2]$3[/url]',
					replaceBBtowns,
					'[img]$1[/img]',
					'[color=$1]$2[/color]',
					replaceBBislands,
					'[table]$1[/table]',
					'[*]',
					'[**]',
					'[/*]',
					'[/**]',
					'[|]',
					'[||]',
					'',
					''
				];
				function replaceBBtowns(match, p1, offset, string) {
					var a = $.parseJSON(atob(p1));
					return '[town]' + a.id + '[/town]'
				};
				function replaceBBislands(match, p1, offset, string) {
					var a = $.parseJSON(atob(p1));
					return '[island]' + a.id + '[/island]'
				};

				$("#message_post_container .message_post").each(function (index, element) {
					var qt_messageExportTMP = $("#qt_messageExportTMP");
					qt_messageExportTMP.empty();
					$(this).clone().appendTo(qt_messageExportTMP);

					qt_messageExportTMP.find(".published_report").replaceWith("[report][/report]"); //replace reports
					qt_messageExportTMP.find(".bbcode_awards").replaceWith("[img]http://s1.directupload.net/images/140428/twuzm5vx.png[/img]"); //replace awards
					qt_messageExportTMP.find(".reservation_list").replaceWith(""); //remove reservations
					qt_messageExportTMP.find(".bbcodes_spoiler").replaceWith(function () { //replace spoiler
						$(this).find(".button").remove();
						return '[spoiler=' + $("b:first", this).text() + ']' + $(".bbcodes_spoiler_text", this).html() + '[/spoiler]';
					});
					qt_messageExportTMP.find(".bbcodes_quote").replaceWith(function () { //replace quotes
						return '[quote]' + $(".quote_message", this).html() + '[/quote]';
					});
					qt_messageExportTMP.find(".bbcodes_size").replaceWith(function () { //replace size
						return '[size=' + $(this)[0].style.fontSize + ']' + $(this).html() + '[/size]';
					});
					qt_messageExportTMP.find(".bbcodes_player").replaceWith(function () { //replace player
						return '[player]' + $(this).text() + '[/player]';
					});
					qt_messageExportTMP.find(".bbcodes_ally").replaceWith(function () { //replace ally
						return '[ally]' + $(this).text() + '[/ally]';
					});
					qt_messageExportTMP.find(".bbcodes_font").replaceWith(function () { //replace font
						return '[font=' + $(this).attr('class').split(' ').pop() + ']' + $(this).html() + '[/font]';
					});
					qt_messageExportTMP.find("script").remove(); //remove script tags

					var author = $(".message_poster .gp_player_link", this).text();
					var postDate = $(".message_poster .message_date", this).text().trim();
					bb_content += '[size=7][player]' + author + '[/player] ' + postDate + '[/size]\n';
					bb_content += '[img]http://s7.directupload.net/images/140502/izczcrte.png[/img]\n';
					var postHTML = $("#qt_messageExportTMP .message_post_content").html().trim();
					postHTML = postHTML.replace(/(\r\n|\n|\r|\t)/gm, ""); //remove line-breaks, tab characters
					postHTML = postHTML.replace(/<br\s*\/?>/mg, "\n"); //add line-breaks instead of <br>
					postHTML = postHTML.replace(/&nbsp;/mg, " ") //replace &nbsp
						for (var i = 0; i < format_search.length; i++) {
							postHTML = postHTML.replace(format_search[i], format_replace[i]);
						}
						bb_content += postHTML + "\n";
					bb_content += '[img]http://s1.directupload.net/images/140502/f3i4p5oy.png[/img]';
					bb_content += "\n";
				});

				bb_content = bb_content.slice(0, -1);
				bb_content += "[/quote]";

				var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
				var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
				var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
				var expTitel = "Copy & Paste";
				var BBwnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				BBwnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + QT.Lang.get("bbcode", "messages"));
				BBwnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
		},
		mutationobserver : function () {
			var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (mutation.addedNodes[0]) {
							if (mutation.addedNodes[0].id === "town_groups_list") {
								if (values.qmenu_settings_stadtliste)
									QT.Functions.townslist();
								QT.Functions.fix_Zindex();
							}
						}
					});
				});
			observer.observe($('body').get(0), {
				attributes : false,
				childList : true,
				characterData : false
			});
		},
		openLink : function (linkArray) {
			if (QT.Settings.values.qmenu_settings_links) {
				var html = $('<iframe />', {
						id : "win_gs_s_frame",
						src : linkArray[0],
						style : 'width:'+linkArray[1]+'px;height:'+linkArray[2]+'px;border:1px solid black;'
					});
				var wnd = GPWindowMgr.Create(GPWindowMgr[linkArray[4]]) || GPWindowMgr.getOpenFirst(GPWindowMgr[linkArray[4]]);
				wnd.setTitle(linkArray[3]);
				wnd.setContent(html);
			} else {
				window.open(linkArray[0]);
			}
		},
		playerGSButton : function (event, xhr, settings) {
			var b = settings.url.match(/player_id%22%3A(\d*)%2C/);
			var c = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_PROFILE);
			if (!c)
				return;
			var d = $("DIV#gpwnd_" + c.getID() + " DIV#player_buttons ");
			$(d[0]).append("<a target=_blank href=http://" + mID + ".grepostats.com/world/" + wID + "/player/" + b[1] + '><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>')
		},
        qtoolbox : function () {
          
            $('#ui_box .nui_main_menu .bottom').append('<div id="qtbox_wrapper" style="position: absolute; display: block; width: 100%; bottom: 31px;"></div>');
			$('#ui_box .nui_main_menu .bottom').css({
				"bottom" : "-3px"
			});
			$('#ui_box .nui_main_menu .leaves').hide();
			$('#ui_box .nui_main_menu .content ul li:last-child').removeClass("last");
			$('#ui_box .nui_main_menu .content ul li:last-child span.button_wrapper').css({
				"height" : "15px"
			});
			$("#qtbox_main_btn").hover(
				function () {
				$(this).css({
					"background-image" : "url(http://s7.directupload.net/images/140119/ywi4jbg2.png)"
				});
			},
				function () {
				$(this).css({
					"background-image" : "url(http://s7.directupload.net/images/140119/nebf5887.png)"
				});
			});

            // Buttonbox
            
			$('#qtbox_wrapper').append('<div id="qtbox_buttons_wrapper" style="display: block; position: relative; height: 26px; width: 100%; bottom: 0px; background:url(http://s7.directupload.net/images/131007/wh2uwdro.png) no-repeat"></div>');
			$('#ui_box .nui_main_menu .bottom, #ui_box .nui_main_menu .leaves').css({
					"bottom" : "-=27px"
			});
			$('#qtbox_buttons_wrapper').append('<input id="qtbox_button1" class="qtbox_button" type="image" src="http://s1.directupload.net/images/140901/qg27v55b.png" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 3px;"></input><input id="qtbox_button2" class="qtbox_button" type="image" src="http://s1.directupload.net/images/140901/j6cvv59x.png" style="display:  block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 29px;"></input>');
			$('#qtbox_button1').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "settings")));
   		    $("#qtbox_button1").click(function(){
                QT.Functions.scriptmanager();
			});

			$('#qtbox_button2').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "update_stats")));
   		$("#qtbox_button2").click(function()
   		{
				var towns = QT.Functions.bbcodes('bbcode_intown');  		    	   
				var buildings = QT.Functions.bbcodes('bbcode_buildings');
            	var dt = new Date();
            	var result = towns + "\r\n" + buildings + "\r\n" + "Datum:" + dt.toISOString();
                
        		var SCOPES = 'https://www.googleapis.com/auth/drive';
        		gapi.client.load('drive', 'v2');
   				gapi.auth.authorize({'client_id': QT.Settings.values.googledrive_client_id, 'scope': SCOPES, 'immediate': true},handleAuthResult);
                
				function handleAuthResult(authResult) 
        		{
                    if (authResult.error == undefined) 
          			{
          				// Access token has been successfully retrieved, requests can be sent to the API
		        		insertFile(result);
        			} 
          			else 
        			{
	          			gapi.auth.authorize({'client_id': QT.Settings.values.googledrive_client_id, 'scope': SCOPES, 'immediate': false},handleAuthResult);
  			    	}
        		};
                				 				
        	function insertFile(filecontent) 
        	{
					var guid = (function() {
  						function s4() {
    						return Math.floor((1 + Math.random()) * 0x10000)
               				.toString(16)
               				.substring(1);
  									}
	  					return function() {
	    				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	           			s4() + '-' + s4() + s4() + s4();
  					};
					})();                	
    	            const boundary = '-------314159265358979323846';
        			const delimiter = "\r\n--" + boundary + "\r\n";
        			const close_delim = "\r\n--" + boundary + "--";
                
            	    var metadata = {
            			'title': guid() + ".txt",
            			'mimeType': 'text/plain',
                        "parents": [{
    						"kind": "drive#file",
    						"id": QT.Settings.values.googledrive_folder_id
  						 }]
          			};

					var multipartRequestBody =
              		delimiter +
              		'Content-Type: application/json\r\n\r\n' +
              		JSON.stringify(metadata) +
              		delimiter +
              		'Content-Type: text/plain' + '\r\n' + '\r\n' +
              		filecontent  +
              		close_delim;                  
                
    			var request = gapi.client.request({
					'path': '/upload/drive/v2/files',
              		'method': 'POST',
              		'params': {'uploadType': 'multipart'},
              		'headers': {
                	'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
              		'body': multipartRequestBody});    			
		      	callback = function(file) 
		      	{
                    if(file === false)
                    {
                    	alert('Fehler beim senden der Daten!');
	                }
                    else
                    {
                    	alert('Daten gesendet!');
                    }
		      	};
    			request.execute(callback);
        		};
      		})
			$(".qtbox_button").hover(
			function () 
			{
				$(this).css({"background" : "url(http://s7.directupload.net/images/131008/vyhnznhd.png)"});
			},
			function () 
			{
				$(this).css({"background" : "none"});
			});
		},
		questlist : function () {
			$('#quest_overview').prepend("<li id='q_qadd'><ul><li id='q_lock'></li><li id='q_qarrow'></li><li id='q_qhide'></li></ul></li>");
			$('#q_qadd').css({
				"cursor" : "pointer",
				"z-index" : "4",
				"height" : "20px",
				"width" : "52px",
				"margin-left" : "9px",
				"margin-top" : "-20px",
				"position" : "absolute",
				"background" : "url('http://s7.directupload.net/images/130417/mvyxzaeg.png') no-repeat scroll transparent"
			});
			$('#q_lock')
			.css({
				"cursor" : "pointer",
				"z-index" : "5",
				"height" : "16px",
				"width" : "10px",
				"margin-left" : "3px",
				"margin-top" : "3px",
				"position" : "absolute",
				"background" : "url('http://s7.directupload.net/images/130412/7pi7gioz.png') no-repeat scroll 0px 0px / 21px 14px transparent"
			})
			.hover(function () {
				$(this).css({
					"background-position" : "-10px 0px"
				});
			}, function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			})
			.toggle(
				function () {
				$('#quest_overview').draggable({
					disabled : false
				});
				$(this).css({
					"width" : "14px",
					"background" : "url('http://s7.directupload.net/images/130412/pnljoi2y.png') no-repeat scroll 0px 0px / 28px 14px transparent"
				})
				.off('hover')
				.hover(function () {
					$(this).css({
						"background-position" : "-14px 0px"
					});
				}, function () {
					$(this).css({
						"background-position" : "0px 0px"
					});
				});
			},
				function () {
				$('#quest_overview').draggable({
					disabled : true
				});
				$(this).css({
					"width" : "10px",
					"background" : "url('http://s7.directupload.net/images/130412/7pi7gioz.png') no-repeat scroll 0px 0px / 21px 14px transparent"
				})
				.off('hover')
				.hover(function () {
					$(this).css({
						"background-position" : "-10px 0px"
					});
				}, function () {
					$(this).css({
						"background-position" : "0px 0px"
					});
				});
			});
			$('#q_qarrow')
			.css({
				"cursor" : "pointer",
				"z-index" : "5",
				"height" : "16px",
				"width" : "10px",
				"margin-left" : "16px",
				"margin-top" : "3px",
				"position" : "absolute",
				"background" : "url('http://s1.directupload.net/images/130417/ayoe9glf.png') no-repeat scroll 0px 0px / 21px 14px transparent"
			})
			.hover(function () {
				$(this).css({
					"background-position" : "-11px 0px"
				});
			}, function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			})
			.toggle(
				function () {
				QT.Settings.save("qmenu_settings_questpfeil", false);
				QT.Settings.values.qmenu_settings_questpfeil = false;
				$('<style id="qarrowstyle" type="text/css">.helper_arrow {display: none}</style>').appendTo('head');
			},
				function () {
				QT.Settings.delete("qmenu_settings_questpfeil");
				QT.Settings.values.qmenu_settings_questpfeil = true;
				$('#qarrowstyle').remove();
			});
			if (!QT.Settings.values.qmenu_settings_questpfeil) {
				$('#q_qarrow').click();
			}
			$('#q_qhide')
			.css({
				"z-index" : "5",
				"height" : "16px",
				"width" : "16px",
				"margin-left" : "28px",
				"margin-top" : "5px",
				"position" : "absolute",
				"background" : "url('http://s14.directupload.net/images/130417/5vowoe8a.png') no-repeat scroll 0px 0px / 20px 11px transparent"
			})
			.hover(function () {
				$(this).css({
					"background-position" : "-16px 0px"
				});
			}, function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			})
			.click(function () {
				$('#quest_overview li[id*="quest"]').each(function () {
					$(this).toggle();
				});
			});
		},
		reportsColor : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "attacking") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid red"
				}).addClass("angriffe");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "supporting") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid green"
				}).addClass("unterstützungen");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "support") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid green"
				}).addClass("unterstützungen");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "spy") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid blue"
				}).addClass("spios");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "spying") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid blue"
				}).addClass("spios");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "conquered") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid black"
				});
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "enacted") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid purple"
				}).addClass("zauber");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "farming_village") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid yellow"
				}).addClass("farm");
			});
		},
		reportsFilter : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			if (!$("#qmenu_berichte_icon_wrapper").is(":visible")) {
				$('<div id="qmenu_berichte_icon_wrapper" style="display:inline;position:absolute;margin-top:-1px;margin-left:120px"></div>').appendTo("DIV#gpwnd_" + c + " #es_page_reports");
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: 0 0;"><input type="checkbox" id="angriffe" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -24px 0;"><input type="checkbox" id="unterstützungen" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://s1.directupload.net/images/130116/7hzmc2e7.png);"><input type="checkbox" id="zauber" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -72px 0;"><input type="checkbox" id="spios" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -96px 0;"><input type="checkbox" id="farm" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$(".qmenu_berichte_Icon").css({
					'display' : 'inline-block',
					'background-repeat' : 'no-repeat',
					'width' : '24px',
					'height' : '24px',
					'position' : 'relative',
					'float' : 'left',
					'margin-left' : '24px'
				});
				$(".qmenu_berichte_checkbox").css({
					'margin-top' : '5px',
					'margin-left' : '29px'
				});
				$(".qmenu_berichte_checkbox").click(function () {
					classid = this.id;
					var checkBoxes = $("li." + classid + " INPUT[type='checkbox']");
					checkBoxes.attr("checked", !checkBoxes.attr("checked"));
				});
			}
		},
		reportsLosses : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			if (document.getElementById('RepConvRes')) {
				document.getElementById('RepConvRes').style.visibility = "hidden";
			}
			if ($("DIV#gpwnd_" + c + " DIV#report_arrow img").length <= 0) {
				return;
			}
			var report_type = $("DIV#gpwnd_" + c + " DIV#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1");
			switch (report_type) {
			case "attack":
			case "take_over":
			case "breach":
				var AttackUnitsRessources = {
					unit_w : 0,
					unit_s : 0,
					unit_i : 0,
					unit_f : 0,
					unit_p : 0,
					total_w : 0,
					total_s : 0,
					total_i : 0,
					total_f : 0,
					total_p : 0
				};
				var DefenseUnitsRessources = {
					unit_w : 0,
					unit_s : 0,
					unit_i : 0,
					unit_f : 0,
					unit_p : 0,
					total_w : 0,
					total_s : 0,
					total_i : 0,
					total_f : 0,
					total_p : 0
				};
				if ($("DIV#gpwnd_" + c + " DIV#resources").length) {
					$("DIV#gpwnd_" + c + " .report_side_attacker_unit").each(function (index, value) {
						var unitNumber = $("span.report_losts", this).text();
						var unitName = $("div.report_unit", this).attr("class").split(/\s/);
						unitName = unitName[5];

						if (unitName != "militia" && unitNumber != "-?") {
							AttackUnitsRessources.unit_w = Math.abs(GameData.units[unitName].resources.wood * unitNumber);
							AttackUnitsRessources.unit_s = Math.abs(GameData.units[unitName].resources.stone * unitNumber);
							AttackUnitsRessources.unit_i = Math.abs(GameData.units[unitName].resources.iron * unitNumber);
							AttackUnitsRessources.unit_f = Math.abs(GameData.units[unitName].favor * unitNumber);
							AttackUnitsRessources.unit_p = Math.abs(GameData.units[unitName].population * unitNumber);
							AttackUnitsRessources.total_w += AttackUnitsRessources.unit_w;
							AttackUnitsRessources.total_s += AttackUnitsRessources.unit_s;
							AttackUnitsRessources.total_i += AttackUnitsRessources.unit_i;
							AttackUnitsRessources.total_f += AttackUnitsRessources.unit_f;
							AttackUnitsRessources.total_p += AttackUnitsRessources.unit_p;
							var unitPopup = GameData.units[unitName].name + '<div style="margin-top: 5px; margin-bottom:5px; height: 1px; border: none; background: #B48F45"/><img src="http://cdn.grepolis.com/images/game/res/wood.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_w + '<br> <img src="http://cdn.grepolis.com/images/game/res/stone.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_s + '<br> <img src="http://cdn.grepolis.com/images/game/res/iron.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_i + '<br> <img src="http://cdn.grepolis.com/images/game/res/favor.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_f + '<br> <img src="http://cdn.grepolis.com/images/game/res/pop.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_p;
							$("div.report_unit", this).mousePopup(new MousePopup(unitPopup));
						}
					});
					$("DIV#gpwnd_" + c + " .report_side_defender_unit").each(function (index, value) {
						var unitNumber = $("span.report_losts", this).text();
						var unitName = $("div.report_unit", this).attr("class").split(/\s/);
						unitName = unitName[5];

						if (unitName != "militia" && unitNumber != "-?") {
							DefenseUnitsRessources.unit_w = Math.abs(GameData.units[unitName].resources.wood * unitNumber);
							DefenseUnitsRessources.unit_s = Math.abs(GameData.units[unitName].resources.stone * unitNumber);
							DefenseUnitsRessources.unit_i = Math.abs(GameData.units[unitName].resources.iron * unitNumber);
							DefenseUnitsRessources.unit_f = Math.abs(GameData.units[unitName].favor * unitNumber);
							DefenseUnitsRessources.unit_p = Math.abs(GameData.units[unitName].population * unitNumber);
							DefenseUnitsRessources.total_w += DefenseUnitsRessources.unit_w;
							DefenseUnitsRessources.total_s += DefenseUnitsRessources.unit_s;
							DefenseUnitsRessources.total_i += DefenseUnitsRessources.unit_i;
							DefenseUnitsRessources.total_f += DefenseUnitsRessources.unit_f;
							DefenseUnitsRessources.total_p += DefenseUnitsRessources.unit_p;
							var unitPopup = GameData.units[unitName].name + '<div style="margin-top: 5px; margin-bottom:5px; height: 1px; border: none; background: #B48F45"/><img src="http://cdn.grepolis.com/images/game/res/wood.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_w + '<br> <img src="http://cdn.grepolis.com/images/game/res/stone.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_s + '<br> <img src="http://cdn.grepolis.com/images/game/res/iron.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_i + '<br> <img src="http://cdn.grepolis.com/images/game/res/favor.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_f + '<br> <img src="http://cdn.grepolis.com/images/game/res/pop.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_p;
							$("div.report_unit", this).mousePopup(new MousePopup(unitPopup));
						}
					});
					$("DIV#gpwnd_" + c + " DIV#resources").append('<p><table><tr><td width="50%">' + AttackUnitsRessources.total_w + '</td><td><img class="unit_order_res wood" alt="' + GameData.resources.wood + '" src="http://cdn.grepolis.com/images/game/res/wood.png" width="20" height="20"/></td><td width="50%">' + DefenseUnitsRessources.total_w + '</td></tr><tr><td>' + AttackUnitsRessources.total_s + '</td><td><img class="unit_order_res stone" alt="' + GameData.resources.stone + '" src="http://cdn.grepolis.com/images/game/res/stone.png" width="20" height="20"/></td><td>' + DefenseUnitsRessources.total_s + '</td></tr><tr><td>' + AttackUnitsRessources.total_i + '</td><td><img class="unit_order_res iron" alt="' + GameData.resources.iron + '" src="http://cdn.grepolis.com/images/game/res/iron.png" width="20" height="20"/></td><td>' + DefenseUnitsRessources.total_i + '</td></tr><tr><td>' + AttackUnitsRessources.total_f + '</td><td><img class="unit_order_res favor" alt="' + GameData.favor + '" src="http://cdn.grepolis.com/images/game/res/favor.png" width="20" height="20"/></td><td>' + DefenseUnitsRessources.total_f + '</td></tr><tr><td>' + AttackUnitsRessources.total_p + '</td><td><img class="unit_order_res population" alt="' + GameData.population + '" src="http://cdn.grepolis.com/images/game/res/pop.png" width="20" height="20"/></td><td>' + DefenseUnitsRessources.total_p + "</td></tr></table>")
				}
			}
		},
		reportsMove : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			var folder = "";
			$("DIV#gpwnd_" + c + " #folder_menu_reports a").each(function () {
				folder += "<option value=" + $(this).parent().attr("name").substr(7) + ">" + $(this).text() + "</option>";
			});
			if (!$('#qselect').is(':visible') && folder.length > 0) {
				$("DIV#gpwnd_" + c + " #report_reports").append('<select id="qselect"><option disabled selected>' + QT.Lang.get("reports", "choose_folder") + '</option>' + folder + '</select>');
				$("#qselect").css({
					'margin-top' : '5px',
					'margin-left' : '2px'
				});
				$("#qselect").change(function () {
					var params = {
						folder_id : this.options[this.selectedIndex].value,
						report_ids : Reports.getReportsIds()
					};
					Layout.wnd.getOpenFirst(Layout.wnd.TYPE_REPORT).requestContentPost('report', 'move', params);
					this.options[0].selected = true;
				});
				$("DIV#gpwnd_" + c + " #folder_menu_reports").hide();
				$("DIV#gpwnd_" + c + " #report_list").removeClass("with_menu");
			}
		},
		reportFoldersort : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();

			var foldersContainer = $("DIV#gpwnd_" + c + " #folder_menu_reports .hor_scrollbar_cont");
			var folders = $("DIV#gpwnd_" + c + " #folder_menu_reports SPAN.folder");

			folders.sort(function (a, b) {
				var an = $(a).text().trim(),
				bn = $(b).text().trim();
				if (an > bn) {
					return 1;
				}
				if (an < bn) {
					return -1;
				}
				return 0;
			});
			folders.appendTo(foldersContainer);
        	},
    	scriptmanager : function () {
			var grepoGameBorder = '<div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;padding:3px 11px">';
			var inhalte = {
				qset_tab1 : tab1()
			};
			function tab1() {
				var inhalt_tab1 = [];

                var HTML_tab1 = "";
				HTML_tab1 += grepoGameBorder + QT.Lang.get("settings", "settings") + '</div>';
				HTML_tab1 += '<div id="settings_content" class="contentDiv" style="padding:0 5px; overflow: auto; height:90px">';
                
                HTML_tab1 += '<div style="width:500px; height:40px;">';
                HTML_tab1 += '<div style="float:left; margin-top: 8px; padding: 5px; width:180px;">' +  QT.Lang.get("settings", "setting1") + '</div>';
                HTML_tab1 += QT.Functions.helper.grepo_input("margin-top: 5px; padding: 5px; width:300px; float:left;", "input_setting1", QT.Settings.values.googledrive_client_id)[0].outerHTML;
                HTML_tab1 += '</div>';

                HTML_tab1 += '<div style="width:500px; height:40px;">';
                HTML_tab1 += '<div style="float:left; margin-top: 8px; padding: 5px; width:180px; " >' +  QT.Lang.get("settings", "setting2") +'</div>';
                HTML_tab1 +=  QT.Functions.helper.grepo_input("margin-top: 5px; padding: 5px; width:300px; float:left;", "input_setting2", QT.Settings.values.googledrive_folder_id)[0].outerHTML;
                HTML_tab1 += '</div>';
                HTML_tab1 += '</div>';
				HTML_tab1 += QT.Functions.helper.grepo_btn("qmenu_einstellungen_safe_BTN", QT.Lang.get("settings", "save"))[0].outerHTML;
				return HTML_tab1;
			};
			function handle_and_style() {
				$("#qmenu_einstellungen_sendmail").css({
					"margin-left" : "1px"
				});
				$("#qmenu_einstellungen_sendmail").click(function () {
					if ($("#trans_lang").length && !$.trim($("#trans_lang").val())) {
						HumanMessage.error(QT.Lang.get("settings", "enter_lang_name"));
						return;
					} else if ($("#langdiv").val() === QT.Lang.get("settings", "info")) {
						HumanMessage.error(QT.Lang.get("settings", "choose_lang"));
						return;
					} else if ($("#trans_content .toSend").length === 0) {
						HumanMessage.error(QT.Lang.get("settings", "no_translation"));
						return;
					}
					hOpenWindow.showConfirmDialog('', QT.Lang.get("settings", "trans_sure"), function () {
						$("#qtajaxloader").css({
							"display" : "block"
						});
						var trans_HTML_send = pName + "<br/>" + sID + "<br/>" + wID + "<p/>";
						$("#trans_content > DIV").each(function (i) {
							if ($(".toSend", this).length != 0) {
								trans_HTML_send += "<b>" + $("SPAN", this).text() + " : {</b><br/>";
								$(".toSend", this).each(function (index) {
									trans_HTML_send += $(this).data("name") + " : '" + $("td:last textarea", this).val() + "',<br/>";
								});
								trans_HTML_send += "},<br/>";
							}
						});
						var xhr = $.ajax({
								type : 'POST',
								url : "https://mandrillapp.com/api/1.0/messages/send.json",
								dataType : 'json',
								data : {
									key : 'Q1FnSR3v9I0K07yUvgCUgw',
									message : {
										html : trans_HTML_send,
										subject : 'Quack Toolsammlung Translation ' + $("#langdiv").val(),
										from_email : "QuackToolsammlung@mail.com",
										to : [{
												"email" : "Quackmaster@web.de",
											}
										]
									}
								}
							});
						xhr.done(function (data) {
							$("#qtajaxloader").css({
								"display" : "none"
							});
							HumanMessage.success(QT.Lang.get("settings", "trans_success"));
						});
						xhr.fail(function (jqXHR, textStatus, errorThrown) {
							$("#qtajaxloader").css({
								"display" : "none"
							});
							HumanMessage.error(QT.Lang.get("settings", "trans_fail"));
						});
					});
				});
				$(".qbox").click(function () {
					$(this).toggleClass("checked");
				});
				$("#qmenu_einstellungen_safe_BTN").css({
					"float" : "right",
					"margin-right" : "1px"
				}).click(function () {
                    QT.Settings.values.googledrive_client_id = $("#input_setting1").val();
                    QT.Settings.values.googledrive_folder_id = $("#input_setting2").val();
                    QT_saveValue('googledrive_client_id', QT.Settings.values.googledrive_client_id);				
					QT_saveValue('googledrive_folder_id', QT.Settings.values.googledrive_folder_id);				
					window.location.reload();
                });
				$(".contentDiv > DIV:last-child").css({
					"margin-bottom" : "5px"
				});
				$("#langdiv").change(function () {
					var lang_tab2 = $(this).val().toLowerCase();
					var langHTML_tab2 = "";
					if ($(this).val() === QT.Lang.get("settings", "info")) {
						wnd.setContent(inhalte.qset_tab2);
						handle_and_style();
						return;
					} else if ($(this).val() === QT.Lang.get("settings", "add_lang")) {
						langHTML_tab2 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + QT.Lang.get("settings", "language") + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
						langHTML_tab2 += '<tr><td style="width:50%"><div style="max-height:150px; overflow:auto">' + QT.Lang.get("settings", "name") + '</div></td>';
						langHTML_tab2 += '<td style="width:50%"><textarea id="trans_lang"></textarea></td>';
						langHTML_tab2 += '</tr></tbody></table></div>';
					}
					$.each(QT.Lang.en, function (a, b) {
						if (a != "meta") {
							langHTML_tab2 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + a + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
							$.each(b, function (c, d) {
								langHTML_tab2 += '<tr data-name="' + c + '">';
								langHTML_tab2 += '<td style="width:50%"><div style="max-height:150px; overflow:auto">' + d + '</div></td>';
								langHTML_tab2 += (QT.Lang[lang_tab2] != undefined && QT.Lang[lang_tab2][a] != undefined && QT.Lang[lang_tab2][a][c] != undefined) ? '<td style="width:50%"><textarea>' + QT.Lang[lang_tab2][a][c] + '</textarea></td>' : '<td style="width:50%"><textarea>' + QT.Lang.en[a][c] + '</textarea></td>';
								langHTML_tab2 += '</tr>';
							});
							langHTML_tab2 += '</tbody></table></div>';
						}
					});
					$("#trans_content").html(langHTML_tab2);
					$("#trans_content td").css({
						"width" : "50%",
						"border" : "1px solid transparent",
					});
					$("#trans_content textarea").css({
						"height" : "18px",
						"width" : "99%",
						"resize" : "vertical",
						"margin" : "0",
						"padding" : "0"
					});
					$("#trans_content textarea").on("change", function () {
						$(this).parent().css({
							"border" : "1px solid green"
						});
						$(this).parent().parent().addClass("toSend");
						$(this).val($(this).val());
					});
					$(".contentDiv div:last-child").css({
						"margin-bottom" : "5px"
					});
				});
				/* Implement Check Update Button later
				<a id="qtUpdate_check" class="down_big reload" href="#" style="float:right;margin-top:4px"></a>
				$("#qtUpdate_check").click(function () {
					QT.Updater.hideNotice();
					QT.Updater.forceCheck();
				});
				$('#qtUpdate_check').mousePopup(new MousePopup(QT.Lang.get("settings", "update_check")));*/
			}
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_SCRIPTMANAGER) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_SCRIPTMANAGER);
			wnd.setTitle(QT.Lang.get("qtoolbox", "settings"));
			wnd.setContent(inhalte.qset_tab1);
			if ($("#qmenu_settings_tabs").length === 0) {
				wnd.getJQElement().append('<div class="menu_wrapper minimize closable" style="left: 1px; right: 33px"><ul id="qmenu_settings_tabs" class="menu_inner">' + QT.Functions.helper.grepo_submenu("qset_tab1", QT.Lang.get("settings", "settings"))[0].outerHTML + '</ul></div>');
			}
			$("#qmenu_settings_tabs li a").removeClass("active");
			$("#qset_tab1").addClass("active");
			handle_and_style();
			$("#qmenu_settings_tabs li a").click(function () {
				$("#qmenu_settings_tabs li a").removeClass("active");
				$(this).addClass("active");
				wnd.setContent(inhalte[this.id]);
				handle_and_style();
			});
		},
		selectunitshelper : function () {
		/*
		
			var scriptEl = document.createElement("script");
			scriptEl.setAttribute('type', 'text/javascript');
			scriptEl.appendChild(document.createTextNode("	var gt_db_debugger=false;	var gt_db_content=new Array();	var gt_db_MaxContentLength=14;	function gt_db_FormatTime(t)	{		var h=t.getHours();		if (h<10) h='0'+h;		var m=t.getMinutes();		if (m<10) m='0'+m;		var s=t.getSeconds();		if (s<10) s='0'+s;		return h+':'+m+':'+s;	};	function gt_db_RefreshContent()	{		if (!gt_db_debugger) return;		var gt_wnd;		gt_wnd=GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_CUSTOM);		if (!gt_wnd)		{			Layout.wnd.Create(Layout.wnd.TYPE_CUSTOM, 'G.Tio Tools Console');			gt_wnd=GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_CUSTOM);		}		if (gt_db_content.length==gt_db_MaxContentLength)		{			gt_db_content.shift();		}		var gt_temp_content='';		for (var i=0; i<gt_db_content.length; i++)		{			gt_temp_content=gt_temp_content+gt_db_content[i];		}		gt_wnd.setContent(gt_temp_content);	}	function gt_db_Debug(message)	{		var now=new Date();		gt_db_content.push(gt_db_FormatTime(now)+' '+message+'<br>');		gt_db_RefreshContent();	};	(function(){		gt_db_content.push('Tools startet...<br>');		window.setTimeout(gt_db_RefreshContent, 3000);	})();	"));
			document.body.appendChild(scriptEl);

			var scriptEl = document.createElement("script");
			scriptEl.setAttribute('type', 'text/javascript');
			scriptEl.appendChild(document.createTextNode("	function gt_st_ajaxComplete(e, xhr, settings)	{		var url = settings.url.split('?'); var action = url[0].substr(5) + '/' + url[1].split(/&/)[1].substr(7);		if (action=='/town_info/support' || action=='/town_info/attack')		{			gt_bl_initWnd();		}			};	$(document).ajaxComplete(gt_st_ajaxComplete);"));
			document.body.appendChild(scriptEl);

			var scriptEl = document.createElement("script");
			scriptEl.setAttribute('type', 'text/javascript');
			scriptEl.appendChild(document.createTextNode("	var gt_bl_unitPopulation={sword:1,slinger:1,archer:1,hoplite:1,rider:3,chariot:4,catapult:15,minotaur:30,zyklop:40,medusa:18,cerberus:30,fury:55,centaur:12};	var gt_bl_groundUnits=new Array('sword','slinger','archer','hoplite','rider','chariot','catapult','minotaur','zyklop','medusa','cerberus','fury','centaur','calydonian_boar','godsent');	function gt_bl_process(wndid)	{		var wnd=GPWindowMgr.GetByID(wndid);		if (!wnd)			return;		var handler=wnd.getHandler();		if (!handler)			return;		var units=new Array();		var item;		for (var i=0; i<gt_bl_groundUnits.length; i++)		{			if (handler.data.units[gt_bl_groundUnits[i]])			{				item={name:gt_bl_groundUnits[i], count:handler.data.units[gt_bl_groundUnits[i]].count, population:handler.data.units[gt_bl_groundUnits[i]].population};				units.push(item);			}		}		if (handler.data.researches && handler.data.researches.berth)			var berth=handler.data.researches.berth;		else			var berth=0;		var totalCap=handler.data.units.big_transporter.count*(handler.data.units.big_transporter.capacity+berth)+handler.data.units.small_transporter.count*(handler.data.units.small_transporter.capacity+berth);						units.sort(function(a,b){			return b.population-a.population;		});		for (i=0; i<units.length; i++)			gt_db_Debug('i='+i+ ' name='+units[i].name+' pop='+units[i].population+' c='+units[i].count);		for (i=0; i<units.length; i++)			if (units[i].count==0)			{				units.splice(i,1);				i=i-1;			};		gt_db_Debug('---');		for (i=0; i<units.length; i++)			gt_db_Debug('i='+i+ ' name='+units[i].name+' pop='+units[i].population+' c='+units[i].count);								var restCap=totalCap;		var sendUnits=new Array();		for (i=0; i<units.length; i++)		{			item={name:units[i].name, count:0};			sendUnits[units[i].name]=item;		};		for (j=0; j<gt_bl_groundUnits.length; j++)		{			if (sendUnits[gt_bl_groundUnits[j]])				gt_db_Debug(sendUnits[gt_bl_groundUnits[j]].name+' '+sendUnits[gt_bl_groundUnits[j]].count);		}						var hasSent;		k=0;		while (units.length>0)		{			hasSent=false;			k=k+1;			for (i=0; i<units.length; i++)			{				if (units[i].population<=restCap)				{					hasSent=true;					units[i].count=units[i].count-1;					sendUnits[units[i].name].count=sendUnits[units[i].name].count+1;					restCap=restCap-units[i].population;				}			}			for (i=0; i<units.length; i++)				if (units[i].count==0)				{					units.splice(i,1);					i=i-1;				};			if (!hasSent)			{				gt_db_Debug('Abbruch nach '+k+' loops');				break;			}		}		gt_db_Debug('nach '+k+'---- rest='+restCap);		for (i=0; i<gt_bl_groundUnits.length; i++)		{			if (sendUnits[gt_bl_groundUnits[i]])				gt_db_Debug(sendUnits[gt_bl_groundUnits[i]].name+' '+sendUnits[gt_bl_groundUnits[i]].count);		}		handler.getUnitInputs().each(function ()		{			if (!sendUnits[this.name])			{				if (handler.data.units[this.name].count>0)					this.value=handler.data.units[this.name].count;				else					this.value='';			}		});		for (i=0; i<gt_bl_groundUnits.length; i++)		{			if (sendUnits[gt_bl_groundUnits[i]])			{				if (sendUnits[gt_bl_groundUnits[i]].count>0)					$('DIV#gpwnd_'+wndid+' INPUT.unit_type_'+gt_bl_groundUnits[i]).val(sendUnits[gt_bl_groundUnits[i]].count);				else					$('DIV#gpwnd_'+wndid+' INPUT.unit_type_'+gt_bl_groundUnits[i]).val('');			}		}		$('DIV#gpwnd_'+wndid+' INPUT.unit_type_sword').trigger('change');	}	function gt_bl_delete(wndid)	{		var wnd=GPWindowMgr.GetByID(wndid);		if (!wnd)			return;		var handler=wnd.getHandler();		if (!handler)			return;		handler.getUnitInputs().each(function ()		{			this.value='';		});		$('DIV#gpwnd_'+wndid+' INPUT.unit_type_sword').trigger('change');	}	function gt_bl_initWnd()	{		var wnds=GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);		if (wnds.length==0)		{			return;		}		var testel=$('DIV#gpwnd_'+wndid+' A.gt_balanced);		if (testel.length>0) return;		var wnd=wnds[wnds.length-1];		var wndid=wnd.getID();		var ael=$('DIV#gpwnd_'+wndid+' A.select_all_units');		$(ael).after('&nbsp;|&nbsp;<a class=gt_balanced style=\\\'position:relative; top:3px\\\' href=javascript:gt_bl_process('+wndid+')>" + QT.Lang.get("town_info", "no_overload") + "</a>		&nbsp;|&nbsp;<a style=\\\'position:relative; top:3px\\\' href=javascript:gt_bl_delete('+wndid+')>" + QT.Lang.get("town_info", "delete") + "</a>');	}"));
			document.body.appendChild(scriptEl);
		}}
		*/
		},
		statsandscripts : function () {
			var grepoGameBorder = '<div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;padding:3px 11px">';
			var grepoGameBorderContainer = '<div class="qsettingsContainer" style="padding:5px 5px 0px 5px; overflow: auto">';
			
			var SAS_HTML = [];
			SAS_HTML[0] = ["Tools", {
					"grepostats" : ["Grepolis Stats", "http://adf.ly/B7C8k", "Clash Rank", "http://www.clashrank.com/contact", QT.Links.grepostats, "Bietet Statistiken und Übersichten über Spieler, Allianzen, Städte und vielem mehr"],
					"grepolisintel" : ["Grepolis Intel", "http://adf.ly/B7D1y", "wansyth", "mailto:wansyth@grepointel.com", QT.Links.grepointel, "Ähnlich wie Grepo Stats, aber mit einigen zusätzlichen Funktionen wie Serverkarten oder Polissuche"],
					"grepolismaps" : ["Grepolis Maps", "http://adf.ly/B7BlJ", "Gehirnpfirsich", "mailto:info@twmaps.org", QT.Links.grepomaps_main, "Kartentool - Weltkarten aller Server"],
					"quo" : ["Quo - Allianz Bashliste", "http://adf.ly/pc8xL", "Maltokor", "http://forum.de.grepolis.com/private.php?do=newpm&u=47548", QT.Links.quo_main, "Alternative zu Grepobash"],
					"grepobash" : ["Grepolis Bashrangliste", "http://adf.ly/B6HBW", "quert", "mailto:support@terenceds.de", QT.Links.grepobash_main, "Allianzinterne Bashrangliste"],
					"polissuche" : ["Polissuche", "http://adf.ly/fGG9b", "tonda", "http://forum.de.grepolis.com/private.php?do=newpm&u=1345", QT.Links.polisssuche_main, "Deutsche Suchfunktion für Städte mit breiter Auswahl von Filteroptionen. Nützlich um Geisterstädte und Inaktive zu finden"],
					"grepofinder" : ["Grepolis Finder", "http://adf.ly/B7D6r", "Ludovic Drolez", "mailto:ludo@drolez.com", QT.Links.grepofinder_main, "Suchen von Städten mit bestimmten Filteroptionen. Nützlich um Geisterstädte und Inaktive zu finden"],
					"grepounitcompare" : ["Grepolis Einheiten Vergleich", "http://adf.ly/B7Cry", "Quackmaster", "http://forum.de.grepolis.com/private.php?do=newpm&u=11342", QT.Links.einheitenvergleich, "Eine Tabelle um die Verteidigungswerte der einzelnen Einheiten in Grepolis miteinander zu vergleichen"],
					"grepoutils" : ["Grepoutils", "http://adf.ly/B7Cgc", "sayunu", "http://forum.pt.grepolis.com/member.php?219-sayunu", QT.Links.grepoutils, "Bietet einige Tools für Grepolis"],
					"grepolisrevobericht" : ["Grepolis Revo Bericht", "http://adf.ly/cY3Ww", "znyde", "http://forum.de.grepolis.com/private.php?do=newpm&u=47082", QT.Links.grepolisrevobericht, "Formatiert eure Deffanfragen anschaulich und übersichtlich für das Forum"],
					"grepoforen" : ["GrepoForen", "http://adf.ly/cY4st", "schüri", "http://forum.de.grepolis.com/private.php?do=newpm&u=1559", QT.Links.grepoforen, "Kostenloses Grepo-phpBB-Forum, dass im Vergleich zu einem normalen Forum über viele nützliche Zusatzfunktionen für Grepolis verfügt."],
					"abakus" : ["Abakus - Der Grepolis Rechner", "http://adf.ly/B7CyQ", "Aerials", "http://forum.de.grepolis.com/private.php?do=newpm&u=781", QT.Links.abakus, "Rechner und Planer rund um Grepolis zum Download auf den Computer"],
					"grepotool" : ["Grepotool", "http://adf.ly/eAYD9", ".Pete.", "http://forum.de.grepolis.com/private.php?do=newpm&u=38433", QT.Links.grepotool, "<ul><li>Frei scroll- und zoombare Grepo-Karte einer jeden Welt</li><li>Spieler oder Allianzen können farblich markiert werden (politische Karte)</li><li>Man kann zu jeder Stadt eintragen, welche Einheiten drinstehen</li><li>Es lassen sich verschiedene Listen von Städten anlegen</li><li>uvm.</li></ul>"],
					"revoformatierer" : ["Grepolis Revolte-Bericht-Formatierer", "http://adf.ly/pc9Vp", "zynde", "http://forum.de.grepolis.com/member.php?47082-znyde", QT.Links.revoformatierer, "Formatiert Revolte Berichte für das Allianzforum"],
					"youscreen" : ["YouScreen", "http://adf.ly/BKCfU", "Lukas Ruschitzka", "mailto:webmaster@youscreen.de", QT.Links.youscreen, "Screenshot Tool - mit der Druck-Taste einen Screenshot erstellen und direkt ins Internet hochladen (vorherige Bearbeitung möglich)"],
				}
			];
			SAS_HTML[1] = ["Skripte", {
					"quacktools" : ["Quack Toolsammlung", "http://adf.ly/AAMwY", "Quackmaster", "http://forum.de.grepolis.com/private.php?do=newpm&u=11342", QT.Links.quacktools, "<ul><li>Grepo Stats Button in der Stadtinfo, Spielerinfo und Allianzinfo</li><li>Überschüssiges Silber bis 15k wird in das Formfeld in der Höhle vorab eingetragen. Im Formfeld können Beträge mit Enter bestätigt werden</li><li>In Berichten und im Simulator werden Truppenverluste in Rohstoffe/Gunst/BP umgerechnet</li><li>Anzeige von Punkten für bestimmte Gebäude im Senat</li><li>Buttonleiste mit Links zu allen wichtigen Toolseiten</li><li>Verschieden Ansichtsmöglichkeiten</li><li>BB Code Ausgabe der stationierten Truppen in und außerhalb einer Stadt für das Allianzforum oder Nachrichten</li><li>BB Code Ausgabe aller Gebäudestufen einer Stadt</li><li>Kein Überladen der Schiffe im Angriffs-/Unterstützungsfenster</li><li>Erweiterung der Kulturübersicht (G.Tio2.0Tools)</li><li>Erweiterung der Befehlsübersicht (Anzahl von Bewegungen wird angezeigt)</li><li>Hotkeys zu verschiedenen Funktionen</li><li>Übersicht über sämtliche erlaubten Statistiken und Skripte</li><li>Transportrechner</li><li>Online Timer</li><li>Google Docs Implementation</li><li>Berichte werden farblich markiert und können nach Filtern ausgewählt werden</li><li>Die Breite des Forums kann nach der Anzahl der Menüpunkte erhöht werden</li><li>Anzeige und Funktionen des Skriptes können an-/abgeschaltet werden</li><li>Questsymbole und Questpfeil können verschoben oder versteckt werden</li><li>Button in der Inselübersicht um eine Nachricht an alle Spieler auf der Insel schicken zu können</li><li>Auswahlliste aller Ordner im Berichtefenster</li><li>Beiträge im Forum können selektiert und gelöscht werden</li><li>BB-Code Button neben dem Stadtnamen</li><li>Sortierfunktion in der Höhlenübersicht</li><li>Akademieplaner</li><li>Gewählte Farmoption in der Bauerndörferübersicht (Kaptitän) wird sich gemerkt und automatisch ausgewählt</li></ul>"],
					"grc" : ["Grepolis Report Converter", "http://adf.ly/MBEgz", "Potusek", "mailto:grepolis@potusek.eu", QT.Links.grc, "<ul><li>Kann so gut wie alles in BB-Code umwandeln</li><li>Zugriff auf Spieler-Statistiken</li><li>Anzeige der Verluste (in der Mauer)</li><li>Emoticons in Nachrichten und Beiträgen im Forum</li><li>Zeitanzeige wann ein Zauber wieder verwendet werden kann</li><li>Mehrzeilige Ansicht der Tabs im Allianz Forum</li></ul>"],
					"diotools" : ["DIO-Tools", "http://adf.ly/cY7c1", "Diony", "http://forum.de.grepolis.com/private.php?do=newpm&u=10548", QT.Links.diotools, "<ul><li>Eigens erstellte Grepo-Smileys</li><li>Biremenzähler</li><li>Einheitenstärke DEF/OFF im Einheitenmenü und Auswahl der Einheitentypen</li><li>Einheitenstärke DEF & Bevölkerung in der Kaserne</li><li>Transporterkapazität</li><li>Verkürzte Laufzeit im ATT/UT-Fenster</li><li>Diverse Erweiterungen des Handelsfensters</li><li>Diverse Erweiterungen für Weltwunder</li><li>Angriffs- Unterstützungs-Zähler im Eroberungsfenster</li><li>Diverse GUI-Optimierungen</li></ul>"],
					"playerprofile" : ["Zurück-Button für Spielerprofile", "http://adf.ly/Djc2I", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.playerprofilescript, "Merkt sich geöffnete Spielerprofile die im Spielerprofilfenster vor und zurück geblättert werden können. Legt außerdem eine Chronik an, welche eine Übersicht aller geöffneten Spielerprofile bietet"],
					"transportrechner_menidan" : ["Transportrechner", "http://adf.ly/cY7nh", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.transportrechner_menidan, "Ein weiterer Transportrechner"],
					"zeitrechner" : ["Zeitrechner", "http://adf.ly/cY7JP", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.zeitrechner, "Rechnet die Summe bzw. Differenz von zwei Uhrzeiten aus"],
					"attackwarner" : ["Angriffswarner", "http://adf.ly/cY7c0", "gordon1982", "http://forum.de.grepolis.com/private.php?do=newpm&u=41281", QT.Links.attackwarner, "Spielt einen Warnton ab, wenn man angegriffen wird"],
					"bauerndorfalarm" : ["Bauerndorf Alarm", "http://adf.ly/cY7c2", "Kapsonfire", "http://forum.de.grepolis.com/private.php?do=newpm&u=46026", QT.Links.bauerndorfalarm, "Das Skript gibt Bescheid, wenn im aktuellen Sichtbereich Bauerndörfer zum farmen verfügbar sind"],
					"grepotownlist" : ["Grepolis Stats Townlist", "http://adf.ly/AARtm", "GTeauDFAdGTio", "http://forum.de.grepolis.com/private.php?do=newpm&u=8531", QT.Links.grepotownslist, "Zusatzfunktionen für die Grepolis Stats Seite. Ermöglicht die Umwandlung der Städte eines Spielers in BB-Code"],
					"gs_eroberungsstatistiken" : ["Grepolis Stats Eroberungsstatistiken", "http://adf.ly/rGbkm", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.gs_eroberungsstatistiken, "Erstellt Statistiken für die Eroberungen von Allianzen"],
				}
			];
			
			var inhalt = "";

			inhalt += '<div id="stats_scripts_content" class="contentDiv" style="padding:0 5px; overflow: auto; height:434px">';
			
			$.each(SAS_HTML, function (a, b) {
				inhalt += '<div id="' + b[0] + '">' + grepoGameBorder + b[0] + '<a class="forum_export" style="float:right" href="#"><img src="http://s14.directupload.net/images/140124/8tzken7v.png" style="margin-top: -2px; margin-left: 11px;" /></a>' + "</div>" + grepoGameBorderContainer;
				$.each(b[1], function (c, d) {
					inhalt += '<a href="' + d[1] + '" target="_blank">' + d[0] + '</a>';
					inhalt += '<small> von <a href="' + d[3] + '" target="_blank">' + d[2] + '</a></small><br />';
					inhalt += '<small><a href="' + d[4] + '" target="_blank">Direktlink</a></small><br />';
					inhalt += d[5] + '<p />';
				});
				inhalt += "</div></div></div>";
			});

			inhalt += '</div>';

			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_STATSANDSCRIPTS) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_STATSANDSCRIPTS);
			wnd.setTitle(QT.Lang.get("qtoolbox", "stats_scripts"));
			wnd.setContent(inhalt);
			var mo_Export = "Liste als BB-Code für das Forum";
			$('.forum_export').mousePopup(new MousePopup(mo_Export));
			var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
			var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
			var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
			var expTitel = "Copy & Paste";
			$('#Tools .forum_export').click(function () {
				var expInhalt_Stats = "[quote][font=sansserif][center][size=20][b]Tools:[/b][/size][/center][/font][/quote]\n[quote][font=sansserif]";
				$.each(SAS_HTML[0][1], function (a, b) {
					expInhalt_Stats += '[size=10][url=' + b[1] + ']' + b[0] + '[/url][/size]';
					expInhalt_Stats += '[size=6] von [url=' + b[3] + ']' + b[2] + '[/url]\n[url=' + b[4] + ']Direktlink[/url][/size]\n';
					expInhalt_Stats += b[5] + '\n\n';
				});
				expInhalt_Stats += "[/font][/quote]";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - Tools");
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + expInhalt_Stats + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
			$('#Skripte .forum_export').click(function () {
				var expInhalt_Skripte = "[quote][font=sansserif][center][size=20][b]Skripte:[/b][/size]\nAdd-ons installieren um die Skripte zum laufen zu bringen:\n[b]Firefox:[/b] [url=https://addons.mozilla.org/de/firefox/addon/greasemonkey/]Greasemonkey[/url] ; [b]Chrome:[/b] [url=https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo]Tampermonkey[/url][/center][/font][/quote]\n[quote][font=sansserif]";
				$.each(SAS_HTML[1][1], function (a, b) {
					expInhalt_Skripte += '[size=10][url=' + b[1] + ']' + b[0] + '[/url][/size]';
					expInhalt_Skripte += '[size=6] von [url=' + b[3] + ']' + b[2] + '[/url]\n[url=' + b[4] + ']Direktlink[/url][/size]\n';
					if (b[5].indexOf("<") != -1) {
						var text_sanatize = b[5].replace(/<\li>/ig, '- ').replace(/<\/li>/ig, '\n').replace(/(<([^>]+)>)/ig, "");
						expInhalt_Skripte += text_sanatize + '\n';
					} else {
						expInhalt_Skripte += b[5] + '\n\n';
					}
				});
				expInhalt_Skripte += "[/font][/quote]";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - Skripte");
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + expInhalt_Skripte + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
		},
		tb_activitiesExtra : function () {
			$("#toolbar_activity_recruits_list").hover(
				function () {
				if ($("#qplusmenuRecruits").length == 0) {
					$("#toolbar_activity_recruits_list").append('<div id="qplusmenuRecruits" class="qplusmenu"><div id="qplusdraghandleRecruits" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuRecruits .qplusback').click(function () {
						qplus_destroy("qplusmenuRecruits");
					});
				}
			}, function () {
				$('#qplusmenuRecruits').remove();
			});
			$("#toolbar_activity_commands_list").hover(
				function () {
				if ($("#qplusmenuCommands").length == 0) {
					$("#toolbar_activity_commands_list").append('<div id="qplusmenuCommands" class="qplusmenu"><div id="qplusdraghandleCommands" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuCommands .qplusback').click(function () {
						qplus_destroy("qplusmenuCommands");
					});
				}
			}, function () {
				$('#qplusmenuCommands').remove();
			});
			$("#toolbar_activity_trades_list").hover(
				function () {
				if ($("#qplusmenuTrades").length == 0) {
					$("#toolbar_activity_trades_list").append('<div id="qplusmenuTrades" class="qplusmenu"><div id="qplusdraghandleTrades" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuTrades .qplusback').click(function () {
						qplus_destroy("qplusmenuTrades");
					});
				}
			}, function () {
				$('#qplusmenuTrades').remove();
			});

			$('<style id="qplusmenustyle" type="text/css">\
																									.displayImp {display: block !important}\
																									.qplusmenu {margin:6px 22px 2px 5px;height:11px;display:block;position:relative}\
																									.qplusdraghandle {width:100%;height:11px;position:absolute;background:url(http://s14.directupload.net/images/131001/7guz6abs.png)}\
																									.qplusback {right:-18px;margin-top:-1px;width:16px;height:12px;position:absolute;background:url(http://s1.directupload.net/images/131001/u6le7bdw.png)}\
																									</style>').appendTo('head');

			$('#toolbar_activity_recruits_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$("#qplusmenuRecruitsSTYLE").remove();
					$('#toolbar_activity_recruits_list').addClass("displayImp");
				},
				stop : function () {
					var qposition = $('#toolbar_activity_recruits_list').position();
					$('<style id="qplusmenuRecruitsSTYLE" type="text/css">#toolbar_activity_recruits_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});
			$('#toolbar_activity_commands_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$('#toolbar_activity_commands, #toolbar_activity_commands_list').off("mouseout");
					$("#qplusmenuCommandsSTYLE").remove();
					$('#toolbar_activity_commands_list').addClass("displayImp");

				},
				stop : function () {
					var qposition = $('#toolbar_activity_commands_list').position();
					$('<style id="qplusmenuCommandsSTYLE" type="text/css">#toolbar_activity_commands_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});
			$('#toolbar_activity_trades_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$("#qplusmenuTradesSTYLE").remove();
					$('#toolbar_activity_trades_list').addClass("displayImp");
				},
				stop : function () {
					var qposition = $('#toolbar_activity_trades_list').position();
					$('<style id="qplusmenuTradesSTYLE" type="text/css">#toolbar_activity_trades_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});

			function qplus_destroy(JQselector) {
				if (JQselector == "qplusmenuCommands") {
					$('#toolbar_activity_commands_list').hide();
					$('#toolbar_activity_commands_list').on("mouseleave", function () {
						$('#toolbar_activity_commands_list').hide();
					});
					$('#toolbar_activity_recruits, #toolbar_activity_trades').on("mouseenter", function () {
						$('#toolbar_activity_commands_list').hide();
					});
				}
				$("#" + JQselector).parent().removeClass("displayImp");
				$("#" + JQselector + "STYLE").remove();
			}

		},
		townGSButton : function () {
			var wndArray = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
			for (var e in wndArray) {
				if (wndArray.hasOwnProperty(e)) {
					var c = wndArray[e].getID();
					var d = $("DIV#gpwnd_" + c + " .qt_gsbutton");
					if (!$("DIV#gpwnd_" + c + " DIV#towninfo_towninfo A.gp_player_link").length > 0 || d.length > 0)
						continue;
					var e = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo A.gp_player_link").attr("href");
					var f = e.split(/#/);
					var g = $.parseJSON(atob(f[1] || f[0]));
					var h = window.location.host.replace(/.grepolis.com.*$/, "");
					var i = h.replace(/\d+/, "");
					var j = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_right");
					$(j[1]).append('<a class="qt_gsbutton" target="_blank" href="http://' + i + ".grepostats.com/world/" + h + "/player/" + g.id + '"><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>');
					$(j[1]).css("width", "+=25px");
					if (!$('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').length > 0)
						continue;
					var k = $('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').attr("onclick").replace(")", "").split(",")[1];
					var l = $('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').parent().find(".list_item_right");
					l.prepend('<span class="qt_gsbutton"><a class="qt_gsbutton" target="_blank" href="http://' + i + ".grepostats.com/world/" + h + "/alliance/" + k + '"><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a></span>');
					l.css("width", "60px")

				}
			}
		},
		townInactivity : function () {
			var wndArray = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
			for (var e in wndArray) {
				if (wndArray.hasOwnProperty(e)) {
					var c = wndArray[e].getID();

					var d = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_left A.qt_activity")
						if (!$("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_left A.gp_player_link").length > 0 || d.length > 0)
							continue;
						var e = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_left A.gp_player_link").attr("href");
					var f = e.split(/#/);
					var g = $.parseJSON(atob(f[1] || f[0]));
					var currentTownXY = QT.Functions.Inactivity.Filter.coordinates();
					$("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_left").prepend(QT.Functions.Inactivity.addDisplay("margin:2px 3px 0 0;", 'http://polissuche.marco93.de/' + wID + '.html?filter=player_id:' + g.id + currentTownXY + ''));
					var JQelement = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_left A.qt_activity");

					if (QT.Functions.Inactivity.isCached(g.id)) {
						var inactive_days_cached = QT.Functions.Inactivity.cache[g.id];
						QT.Functions.Inactivity.changeDisplay(JQelement, inactive_days_cached);
						continue;
					}

					QT.Functions.Inactivity.getData(g.id).done(function (data) {
						QT.Functions.Inactivity.changeDisplay(JQelement, QT.Functions.Inactivity.cache[g.id]);
					});

				}
			}
		},
		townTradeImprovement : function () { //name
			var wndArray = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
			for (var e in wndArray) {
				if (wndArray.hasOwnProperty(e)) {
					var wndID = wndArray[e].getID();
					if ($("DIV#gpwnd_" + wndID + " .q_needed").length > 0 || $("DIV#gpwnd_" + wndID + " .town-capacity-indicator").length == 0)
						continue;

					$("DIV#gpwnd_" + wndID + " div.amounts").each(function () {
						var rescurrent = $(this).find("span.curr").html();
						var ressended = ($(this).find("span.curr2").html() == "") ? 0 : parseInt($(this).find("span.curr2").html().substring(3));
						var ressending = ($(this).find("span.curr3").html() == "") ? 0 : parseInt($(this).find("span.curr3").html().substring(3));
						var resmaxtown = $(this).find("span.max").html();
						var resneeded = resmaxtown - rescurrent - ressended - ressending;
						$(this).append('<span class="q_needed"> &#9658; ' + resneeded + '</span>');
					});

					function rescalc(mode) {
						var resmaxmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .max").html());
						var ressendingNOW = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(0).select().blur();
						var rescurrmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .curr").html());
						var restotalmarket = resmaxmarket - rescurrmarket;
						var resselector = $("DIV#gpwnd_" + wndID + " #town_capacity_" + mode.substring(2));
						var rescurrent = resselector.find("span.curr").html();
						var ressended = (resselector.find("span.curr2").html() == "") ? 0 : parseInt(resselector.find("span.curr2").html().substring(3));
						var ressending = (resselector.find("span.curr3").html() == "") ? 0 : parseInt(resselector.find("span.curr3").html().substring(3));
						var resmaxtown = resselector.find("span.max").html();
						var resneeded = resmaxtown - rescurrent - ressended - ressending;
						var b = (resneeded > restotalmarket) ? restotalmarket : resneeded;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(b).select().blur();
						var ressendingNOW2 = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						var c = (ressendingNOW == ressendingNOW2) ? 0 : b;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(c).select().blur();
					}

					function rescalccult(mode) {
						var resmaxmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .max").html());
						var ressendingNOW = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(0).select().blur();
						var rescurrmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .curr").html());
						var restotalmarket = resmaxmarket - rescurrmarket;

						var resselector = $("DIV#gpwnd_" + wndID + " #town_capacity_" + mode.substring(2));
						var rescurrent = resselector.find("span.curr").html();
						var ressended = (resselector.find("span.curr2").html() == "") ? 0 : parseInt(resselector.find("span.curr2").html().substring(3));
						var ressending = (resselector.find("span.curr3").html() == "") ? 0 : parseInt(resselector.find("span.curr3").html().substring(3));
						var resmaxtown = resselector.find("span.max").html();
						var resneeded = resmaxtown - rescurrent - ressended - ressending;
						var tradetype = (mode == "q_stone") ? 18000 : 15000;
						var a = tradetype - rescurrent - ressended - ressending;
						var b = (a > restotalmarket) ? restotalmarket : a;
						var c = (b > resneeded) ? resneeded : b;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(c).select().blur();
						var ressendingNOW2 = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						var d = (ressendingNOW == ressendingNOW2) ? 0 : c;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(d).select().blur();
					}

					function rescalccultReverse(mode) {
						var resmaxmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .max").html());
						var ressendingNOW = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(0).select().blur();
						var rescurrmarket = parseInt($("DIV#gpwnd_" + wndID + " #big_progressbar .caption .curr").html());
						var restotalmarket = resmaxmarket - rescurrmarket;
						var townrescurrent = $("div#ui_box div.ui_resources_bar div.indicator[data-type='" + mode.substring(2) + "'] div.amount").text();
						var tradetype = (mode == "q_stone") ? 18000 : 15000;
						var a = townrescurrent - tradetype;
						var b = (tradetype > townrescurrent) ? 0 : a;
						var c = (b > restotalmarket) ? restotalmarket : b;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(c).select().blur();
						var ressendingNOW2 = parseInt($("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val());
						var d = (ressendingNOW == ressendingNOW2) ? 0 : c;
						$("DIV#gpwnd_" + wndID + " #trade_type_" + mode.substring(2)).find("input").val(d).select().blur();
					}

					$("DIV#gpwnd_" + wndID + " #trade_tab").append(
						'<a id="q_wood" class="q_send" style="top:211px" href="#"></a>' +
						'<a id="q_stone" class="q_send" style="top:245px" href="#"></a>' +
						'<a id="q_iron" class="q_send" style="top:279px" href="#"></a>' +
						'<a id="q_wood" class="q_send_cult" style="top:211px" href="#"></a>' +
						'<a id="q_stone" class="q_send_cult" style="top:245px" href="#"></a>' +
						'<a id="q_iron" class="q_send_cult" style="top:279px" href="#"></a>' +
						'<a id="q_wood" class="q_send_cult_reverse" style="top:211px" href="#"></a>' +
						'<a id="q_stone" class="q_send_cult_reverse" style="top:245px" href="#"></a>' +
						'<a id="q_iron" class="q_send_cult_reverse" style="top:279px" href="#"></a>');

					$("DIV#gpwnd_" + wndID + " .q_send").click(function () {
						rescalc(this.id);
					});
					$("DIV#gpwnd_" + wndID + " .q_send_cult").click(function () {
						rescalccult(this.id);
					});
					$("DIV#gpwnd_" + wndID + " .q_send_cult_reverse").click(function () {
						rescalccultReverse(this.id);
					});

				}
			}

			$(".q_send_cult").css({
				"right" : "84px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s7.directupload.net/images/130330/d67gpq9g.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});
			$(".q_send_cult_reverse").css({
				"left" : "105px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s7.directupload.net/images/130619/p6jyv8gu.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});
			$(".q_send").css({
				"right" : "105px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s1.directupload.net/images/130330/x2pnbew9.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});

			$(".q_send, .q_send_cult, .q_send_cult_reverse").hover(
				function () {
				$(this).css({
					"background-position" : "0px -17px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px -1px"
				});
			});
		},
		townslist : function () {
			if ($('#town_groups_list a.town_bb').length != 0)
				return;
			$('.content .group_name .name').append('<a class="town_bb" style="position: absolute; display: block; top: 4px; right: 16px;" href="#"><img src="http://s14.directupload.net/images/140124/8tzken7v.png" style="height: 15px; width: 17px;" /></a>');
			$('.town_bb').click(function (e) {
				var towngrp_id = $(this).parent().data('groupid');
				var cities_towngroup = ITowns.town_group_towns.getTowns(towngrp_id);
				var bb_content = "";
				$.each(cities_towngroup, function (key, town) {
					bb_content += "[town]" + town.attributes.town_id + "[/town] (" + town.town_model.attributes.points + ") " + town.town_model.attributes.island_x + "|" + town.town_model.attributes.island_y + "\n";
				});
				var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
				var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
				var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
				var expTitel = "Copy & Paste";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + QT.Lang.get("bbcode", "cities"));
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
			$('.town_group_town').hover(function () {
				var townID = $(this).data("townid");
				$(this).append('<div class="jump_town" data-townid="' + townID + '"></div>');
				$(".jump_town")
				.css({
					"display" : "block",
					"top" : "2px",
					"right" : "15px",
					"height" : "16px",
					"width" : "16px",
					"position" : "absolute",
					"background" : "url('http://cdn.grepolis.com/images/game/layout/town_list_btns.png') repeat scroll -32px 0 transparent"
				})
				.click(function (e) {
					e.stopPropagation();
					WMap.mapJump(ITowns.getTown(townID), true);
				}) // MapTiles.focusTown(townID);
				.hover(function () {
					$(this).css({
						"background-position" : "-32px -16px"
					});
				}, function () {
					$(this).css({
						"background-position" : "-32px 0"
					});
				});
			}, function () {
				$(".jump_town").remove();
			});
		},
		transportcalculator : {
			init : function () {
				$('#ui_box .nui_units_box .units_naval').after('<div id="units_transport" class="container_hidden" style="position:relative"><div class="top"></div><div class="bottom"></div><div class="middle"><div class="left"></div><div class="right"></div><div class="content"><div class="units_wrapper clearfix"><div id="tr_wrapper"><div id="tr_options"><div id="tr_recruit" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_recruit"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_outside" class="checkbox_new disabled" style="margin-right:-1px"><div class="tr_options tr_outside tr_deactivated"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_big_transporter" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_big_transporter"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_small_transporter" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_small_transporter"></div><div class="cbx_icon" style="margin-top:2px"></div></div></div><div id="tr_content"></div></div></div><div id= "tr_btn" class="">' + QT.Lang.get("transport_calc", "btn_main") + '</div><div id="tr_btn_top"></div><div class="bottom" style="bottom:19px"></div></div></div></div>');
				$("#tr_btn").css({
					"cursor" : "pointer",
					"position" : "relative",
					"height" : "16px",
					"right" : "5px",
					"font-size" : "10px",
					"font-weight" : "bold",
					"color" : "#EEDDBB",
					"padding-left" : "3px",
					"background" : "url(http://s14.directupload.net/images/140307/2mughecu.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0)"
				});
				$("#tr_btn_top").css({
					"position" : "absolute",
					"height" : "6px",
					"right" : "0px",
					"bottom" : "14px",
					"width" : "138px",
					"background" : "url(http://s14.directupload.net/images/140424/9ol6fg6t.png) no-repeat"
				});
				$("#tr_wrapper").css({
					"padding" : "7px 7px 17px 7px",
					"color" : "#ECB44D",
					"font-size" : "10px",
					"display" : "none",
					"margin-left" : "-6px",
					"background" : "url(http://zz.cdn.grepolis.com/images/game/layout/layout_units_nav_bg.png) repeat scroll 0 0 rgba(0, 0, 0, 0)"
				});
				$(".tr_options").css({
					"background" : "url(http://s14.directupload.net/images/140130/zo8kqb7x.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0)",
					"width" : "15px",
					"height" : "18px",
					"float" : "left"
				});
				$(".tr_outside").css({
					"background-position" : "0 -36px"
				});
				$(".tr_recruit").css({
					"background-position" : "0 -54px"
				});
				$(".tr_deactivated").css({
					"background-image" : "url(http://s7.directupload.net/images/140729/z474f6rk.png)"
				});
				$(".tr_big_transporter").css({
					"background-position" : "0 0"
				});
				$(".tr_small_transporter").css({
					"background-position" : "0 -18px"
				});
				$('#tr_recruit').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "recruits")));
				$('#tr_outside').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "disabled")));
				$('#tr_big_transporter').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "slowtrans")));
				$('#tr_small_transporter').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "fasttrans")));
				$("#tr_options .checkbox_new").click(function () {
					if ($(this).find('DIV.tr_deactivated').length === 0) {
						$(this).toggleClass("checked");
						$("#tr_content").html(QT.Functions.transportcalculator.refresh());
					}
				});
				$("#tr_btn").hover(
					function () {
					$("#tr_btn").css({
						"color" : "#ECB44D"
					});
				},
					function () {
					$("#tr_btn").css({
						"color" : "#EEDDBB"
					});
				});
				$("#tr_btn").click(function () {
					if ($("#tr_wrapper").css('display') == 'none') {
						$("#tr_content").html(QT.Functions.transportcalculator.refresh());
					}
					$("#tr_wrapper").slideToggle();
				});
			},
			refresh : function () {
				var selected_town = ITowns.getTown(Game.townId);
				var GD_units = GameData.units;
				var GD_heroes = GameData.heroes;
				var Transporter_Offset = selected_town.researches().hasBerth() ? GameDataResearches.getBonusBerth() : 0;
				var Ground_Units_BHP = 0;
				var Transport_Capacity = 0;
				var units_outside = 0;
				//var FreePopulation = selected_town.getAvailablePopulation();
				// Units inside town
				var units_own = selected_town.units();
				$.each(units_own, function (unit, number) {
					// Landtruppen
					if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
						Ground_Units_BHP += number * GD_units[unit].population;
					}
					// Transportschiffe
					else if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
						if ($(".tr_" + unit).parent().hasClass("checked")) {
							Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
						}
					}
				});
				// recruits
				if ($(".tr_recruit").parent().hasClass("checked")) {
					var recruits = selected_town.getUnitOrdersCollection().models;
					for (var i = 0; i < recruits.length; ++i) {
						var unit = recruits[i].attributes.unit_type;
						var number = recruits[i].attributes.units_left;
						//Landtruppen
						if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
							Ground_Units_BHP += number * GD_units[unit].population;
						}
						// Transportschiffe
						else if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
							if ($(".tr_" + unit).parent().hasClass("checked")) {
								Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
							}
						}
					}
				}
				// Units outside town
				if ($(".tr_outside").parent().hasClass("checked")) {
					gpAjax.ajaxPost('units_beyond_info', 'get_supporting_units_for_foreigners', {}, false, function (data) {
						$.each(data.collections[0].data, function (index, object) {
							if (object.home_town_id == Game.townId) {
								$.each(object, function (unit, number) {
									if (!(unit in GD_heroes) && GD_units[unit] && number != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
										Ground_Units_BHP += number * GD_units[unit].population;
									} else if (!(unit in GD_heroes) && GD_units[unit] && number != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
										if ($(".tr_" + unit).parent().hasClass("checked")) {
											Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
										}
									}
								});
							}
						});
						$("#tr_content").html(createHint(Transport_Capacity, Ground_Units_BHP));
					});
				} else {
					$("#tr_content").html(createHint(Transport_Capacity, Ground_Units_BHP));
				}
				function createHint(Transport_Capacity, Ground_Units_BHP) {
					var textCapacity = '' + QT.Lang.get("transport_calc", "available") + '<br><span style="background: url(http://s14.directupload.net/images/131025/6coe5znl.png) repeat scroll 0 0 rgba(0, 0, 0, 0); color: #EEDDBB; font-family: Verdana; font-size: 11px; font-weight: bold; text-shadow: 1px 1px 0 #000000; width:110px; display:inline-block"><b>' + Transport_Capacity + '</b></span>';
					var textUnits = '' + QT.Lang.get("transport_calc", "transportable") + '<br><span style="background: url(http://s14.directupload.net/images/131025/6coe5znl.png) repeat scroll 0 0 rgba(0, 0, 0, 0); color: #EEDDBB; font-family: Verdana; font-size: 11px; font-weight: bold; text-shadow: 1px 1px 0 #000000; width:110px; display:inline-block""><b>   ' + Ground_Units_BHP + '</b></span>';
					return textCapacity + '<br>' + textUnits;
				}
			}
		},
		unitsBeyondView : function () {
			var selected_town = ITowns.getTown(Game.townId);
			var GD_units = GameData.units;
			var GD_heroes = GameData.heroes;
			var Transporter_Offset = selected_town.researches().hasBerth() ? GameDataResearches.getBonusBerth() : 0;
			var tr_small_cap = GameData.units.small_transporter.capacity + Transporter_Offset;
			var tr_big_cap = GameData.units.big_transporter.capacity + Transporter_Offset;

			function calculate(tr_type_cap, Transport_Capacity, Ground_Units_BHP) {
				var diff = Transport_Capacity - Ground_Units_BHP;
				var tr_empty = Math.floor(diff / tr_type_cap);
				var rest = tr_type_cap - (diff - (tr_empty * tr_type_cap));
				if (rest != tr_type_cap) {
					tr_empty++;
				} else {
					rest = 0;
				}
				return [tr_empty, rest];
			}

			$("#units_beyond_list > LI").each(function (i, e) {
				var Ground_Units_BHP = 0;
				var Transport_Capacity = 0;
				var a = $(this).children("a");
				a.each(function (index) {
					var className = this.className.split(' ');
					var unit = className[className.length - 2];
					var number = $(this).text().trim();
					if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
						Ground_Units_BHP += number * GD_units[unit].population;
					} else if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
						Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
					}
				});

				$(this).find(".place_sendback_container").css({
					"margin-top" : "4px"
				});

				if (Transport_Capacity > 0) {
					var tr_small = calculate(tr_small_cap, Transport_Capacity, Ground_Units_BHP);
					var tr_big = calculate(tr_big_cap, Transport_Capacity, Ground_Units_BHP);
					var tooltip =
						'<div style="position: absolute; margin-left: 40px; margin-top: 5px">' +
						'<div class="qt_sendback_big">' +
						'<div class="qt_sendback_img" style="background-position: 0px 0px; "><span class="qt_sendback_img_span big_naval">' + tr_big[0] + '</span></div>' +
						'<div class="qt_sendback_img" style="background-position: 0px -36px; margin-left: 15px"><span class="qt_sendback_img_span big_land">' + tr_big[1] + '</span></div>' +
						'</div>' +
						'<div class="qt_sendback_small">' +
						'<div class="qt_sendback_img" style="background-position: 0px -18px;"><span class="qt_sendback_img_span small_naval">' + tr_small[0] + '</span></div>' +
						'<div class="qt_sendback_img" style="background-position: 0px -36px; margin-left: 15px"><span class="qt_sendback_img_span small_land">' + tr_small[1] + '</span></div>' +
						'</div></div>';

					if ($(this).find(".qt_sendback_header_span").length == 0) {
						$(this).children("h4").append('<span class="qt_sendback_header_span"> (' + Ground_Units_BHP + '/' + Transport_Capacity + ')</span>')
						$(this).find(".place_sendback_container").append(tooltip);
					} else {
						$(this).find(".qt_sendback_header_span").text(' (' + Ground_Units_BHP + '/' + Transport_Capacity + ')');
						$(this).find(".qt_sendback_big .big_naval").text(tr_big[0]);
						$(this).find(".qt_sendback_big .big_land").text(tr_big[1]);
						$(this).find(".qt_sendback_small .small_naval").text(tr_small[0]);
						$(this).find(".qt_sendback_small .small_land").text(tr_small[1]);
					}
				}
			});
			$(".qt_sendback_img").css({
				"width" : "18px",
				"height" : "16px",
				"background-image" : "url(http://s1.directupload.net/images/140619/vyxakj9l.png)",
				"background-repeat" : "no-repeat",
				"display" : "block",
				"float" : "left"
			});
			$(".qt_sendback_img_span").css({
				"margin-left" : "20px"
			});
			$(".qt_sendback_small").css({
				"float" : "left",
				"margin-top" : "1px"
			});
		},
		unitcomparison : function () {
			window.open(QT.Links.Unitvergleich);
		},
		windowmanager : function () {
			//BB-Codes
			function WndHandlerQTbbcode(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTbbcode, WndHandlerDefault);
			WndHandlerQTbbcode.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 700,
					height : 330,
					minimizable : true,
					title : "BB-Code"
				};
			};
			GPWindowMgr.addWndType("QT_BBCODE", "qtbbcode", WndHandlerQTbbcode, 1);
			//Grepo Stats
			function WndHandlerQTgrepostats(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgrepostats, WndHandlerDefault);
			WndHandlerQTgrepostats.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 565,
					minimizable : true,
					title : "Grepo Stats"
				};
			};
			GPWindowMgr.addWndType("QT_GREPOSTATS", "qtgs", WndHandlerQTgrepostats, 1);
			//Grepo Intel
			function WndHandlerQTgrepointel(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgrepointel, WndHandlerDefault);
			WndHandlerQTgrepointel.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 1013,
					height : 565,
					minimizable : true,
					title : "Grepo Intel"
				};
			};
			GPWindowMgr.addWndType("QT_GREPOINTEL", "qtgi", WndHandlerQTgrepointel, 1);
			//Server Maps
			function WndHandlerQTservermaps(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTservermaps, WndHandlerDefault);
			WndHandlerQTservermaps.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 1038,
					height : 565,
					minimizable : true,
					title : "Server Map"
				};
			};
			GPWindowMgr.addWndType("QT_SERVERMAPS", "qtservermaps", WndHandlerQTservermaps, 1);
			//Townsearches
			function WndHandlerQTtownsearches(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTtownsearches, WndHandlerDefault);
			WndHandlerQTtownsearches.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 565,
					minimizable : true,
					title : "Townsearch"
				};
			};
			GPWindowMgr.addWndType("QT_TOWNSEARCHES", "qttownsearches", WndHandlerQTtownsearches, 1);
			//Bashlists
			function WndHandlerQTbashlists(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTbashlists, WndHandlerDefault);
			WndHandlerQTbashlists.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 563,
					minimizable : true,
					title : "Bashlist"
				};
			};
			GPWindowMgr.addWndType("QT_BASHLISTS", "qtbashlists", WndHandlerQTbashlists, 1);
			//Scriptmanager
			function WndHandlerQTscriptmanager(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTscriptmanager, WndHandlerDefault);
			WndHandlerQTscriptmanager.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 550,
					height : 210,
					minimizable : true,
					title : "Scriptmanager"
				};
			};
			GPWindowMgr.addWndType("QT_SCRIPTMANAGER", "qtscriptmanager", WndHandlerQTscriptmanager, 1);
			//Stats&Scripts
			function WndHandlerQTstatsandscripts(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTstatsandscripts, WndHandlerDefault);
			WndHandlerQTstatsandscripts.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 750,
					height : 500,
					minimizable : true,
					title : "Stats & Scripts"
				};
			};
			GPWindowMgr.addWndType("QT_STATSANDSCRIPTS", "qtstatsandscripts", WndHandlerQTstatsandscripts, 1);
			//Google Docs
			function WndHandlerQTgoogledocs(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgoogledocs, WndHandlerDefault);
			WndHandlerQTgoogledocs.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 852,
					height : 600,
					minimizable : true,
					title : "Google Docs"
				};
			};
			GPWindowMgr.addWndType("QT_GOOGLEDOCS", "qtgoogledocs", WndHandlerQTgoogledocs, 1);
			//Townoverview
			function WndHandlerQTtownoverview(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTtownoverview, WndHandlerDefault);
			WndHandlerQTtownoverview.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					height : 600,
					width : 800,
					minimizable : true,
					title : QT.Lang.get("grepo_mainmenu", "city_view")
				};
			};
			WndHandlerQTtownoverview.prototype.onClose = function () {
				$('#ui_box').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
				if ($("#minimap_canvas").hasClass('expanded')) {
					$.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).publish({});
				} else {
					$.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).publish({});
				}
			};
			GPWindowMgr.addWndType("QT_TOWNOVERVIEW", "qttownoverview", WndHandlerQTtownoverview, 1);
			//Rest
			function WndHandlerQTstandard(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTstandard, WndHandlerDefault);
			WndHandlerQTstandard.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					height : 500,
					width : 750,
					minimizable : true,
					title : ""
				};
			};
			GPWindowMgr.addWndType("QT_STANDARD", "qtstandard", WndHandlerQTstandard, 1);
		}
	};

	/************************************************************************
	 * Observer
	 ***********************************************************************/
	$.Observer(GameEvents.game.load).subscribe('QT', function (e, data) {
		QT.Settings.setValues();
		QT_sendStats(mID, sID, QT.Settings.values.script_version);
		QT.Functions.mutationobserver();
		QT.Functions.windowmanager();
		QT.Functions.selectunitshelper();
		QT.Functions.qtoolbox();
        /*
		if (QT.Settings.values.qmenu_settings_hotkey_active)
			QT.Functions.hotkeys();
		if (QT.Settings.values.qmenu_settings_cityview_BTN)
			QT.Functions.city_view_btn();
		if (QT.Settings.values.qmenu_settings_cityview_window)
			QT.Functions.city_view_window();
		if (QT.Settings.values.qmenu_settings_townbb)
			QT.Functions.bbcodeBtnTown();
		if (QT.Settings.values.qmenu_settings_plusmenu)
			QT.Functions.tb_activitiesExtra();
		if (QT.Settings.values.qmenu_settings_transport_rechner)
			QT.Functions.transportcalculator.init();
		if (QT.Settings.values.qmenu_settings_questliste && $('#quest_overview li').length !== 0)
			QT.Functions.questlist();
        */
		$(document).ajaxComplete(function (event, xhr, settings) {
			var a = settings.url.split("?");
			var b = a[0].substr(6);
			var c = a[1].split("&")[1].substr(7);
			if (b in QT.CallAjaxFunction && c in QT.CallAjaxFunction[b]) {
				QT.CallAjaxFunction[b][c](event, xhr, settings);
			}
		});
	});
}

/************************************************************************
 * Start Method
 ***********************************************************************/
var DATA = {
	script_version : GM_info.script.version
};

var keys = GM_listValues();
for (var i = 0, key = null; key = keys[i]; i++) {
	DATA[key] = GM_getValue(key);
}

unsafeWindow.QT_saveValue = function (name, val) {
	setTimeout(function () {
		GM_setValue(name, val);
	}, 0);
};
unsafeWindow.QT_saveAllValues = function (values) {
	setTimeout(function () {
		var keys = GM_listValues();
		for (var i = 0, key = null; key = keys[i]; i++) {
			GM_deleteValue(key);
		}
		for (key in values) {
			GM_setValue(key, values[key]);
		}
		window.location.reload();
	}, 0);
};
unsafeWindow.QT_deleteValue = function (name) {
	setTimeout(function () {
		GM_deleteValue(name);
	}, 0);
};
unsafeWindow.QT_deleteAllValues = function () {
	setTimeout(function () {
		var keys = GM_listValues();
		for (var i = 0, key = null; key = keys[i]; i++) {
			GM_deleteValue(key);
		}
		window.location.reload();
	}, 0);
};
unsafeWindow.QT_sendStats = function (market_id, player_id, script_version) {
	setTimeout(function () {
		GM_xmlhttpRequest({
			method : "POST",
			url : "http://grepolisqt.de/test.php?market_id=" + market_id + "&player_id=" + player_id + "&script_version=" + script_version
		});
	}, 0);
};

if (typeof exportFunction == 'function') {
	exportFunction(unsafeWindow.QT_saveValue, unsafeWindow, {
		defineAs : "QT_saveValue"
	});
	exportFunction(unsafeWindow.QT_saveAllValues, unsafeWindow, {
		defineAs : "QT_saveAllValues"
	});
	exportFunction(unsafeWindow.QT_deleteValue, unsafeWindow, {
		defineAs : "QT_deleteValue"
	});
	exportFunction(unsafeWindow.QT_deleteAllValues, unsafeWindow, {
		defineAs : "QT_deleteAllValues"
	});
	exportFunction(unsafeWindow.QT_sendStats, unsafeWindow, {
		defineAs : "QT_sendStats"
	});
}

function appendScript() {

	if (unsafeWindow.Game) {
		var QT_script = document.createElement('script');
		QT_script.type = 'text/javascript';
		QT_script.textContent = main_script.toString() + "\n main_script(" + JSON.stringify(DATA) + ");";
		document.body.appendChild(QT_script);
	} else {
		setTimeout(function () {
			appendScript();
		}, 100);
	}
}


appendScript();

