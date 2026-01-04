// ==UserScript==
// @name         Surviv.io | Hack Menu
// @namespace    https://github.com/iBLiSSIN
// @version      1.0.0
// @license MIT
// @description  Testing 
// @author       vnbpm
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437194/Survivio%20%7C%20Hack%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/437194/Survivio%20%7C%20Hack%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var doWork = function () {
		if (!window.tempVars) {
			setTimeout(doWork, 100);
			return;
		}
		try {
			$(document);
		}
		catch (e) {
			setTimeout(doWork, 100);
			return;
		}

		$("#ui-center").append(window.tempVars.menuHtml);

		window.menu = {};
		window.menu.UserSetting = {};

		var defaultSetting = function () {

			window.menu.UserSetting = {
				shoot: {
					spinBotEnabled: true,
					lasersightEnabled: false,
					fragGrenadeTimerEnabled: false,
					bumpFireEnabled: true,
					autoAimEnabled: true,
					autoAimAlwaysOnEnabled: false,
					autoReloadEnabled: false,
					autoAimSpeedInertia: 0.4,
					autoAimPredictionInertia: 0.7,
					autoAimRestirctionEnabled: false,
					autoAimRestirctionAngle: 20,
					autoAimRestrictionCloseRange: 11,
					autoAimPingCorrectionEnabled: false,
					// autoAimAntiAntiCheatEnabled: 	true,
					// autoAimAntiAntiCheatInertia:	0.4,
				},
				loot: {
					// lootHighlightEnabled: 			true,
					autolootEnabled: false,
					autolootSafeDistance: 0.9,
					autolootDropDelay: 0.8,
				},
				look: {
					zoomEnabled: true,
					zoomSpeed: 5,
					obstaclesAlphaEnabled: false,
					obstaclesAlphaTreeLevel: 0.15,
					obstaclesAlphaBushLevel: 0.5,
					obstaclesAlphaTableLevel: 0.15,
					ceilingAlphaEnabled: false,
					ceilingAlphaLevel: 0.15,
					smokeAlphaEnabled: false,
					smokeAlphaLevel: 0.15,
					enemyLinesEnabled: true,
					customCursorLevel: 0,
					barrelRedRecolorEnabled: false,
					targetIndicatorEnabled: true,
				},
				binds: {
					autoAim: { code: -3, shift: false, ctrl: false, alt: false },
					switchMainWeapon: { code: 188, shift: false, ctrl: false, alt: false },
					zoomIn: { code: -5, shift: false, ctrl: false, alt: false },
					zoomOut: { code: -4, shift: false, ctrl: false, alt: false },
					displayNames: { code: 74, shift: false, ctrl: false, alt: false },
					// streamerMode: {code: 80, shift: false, ctrl: false, alt: false},
					spinPressed: { code: 16, shift: true, ctrl: false, alt: true },
					// teamPing: { code: 86, shift: false, ctrl: false, alt: false },
					// emotes: { code: 67, shift: false, ctrl: false, alt: false },
				}
			}
		}

		var loadSetting = function () {
			var mergeCategory = function (category, base) {
				for (var param in base) {
					if (!category.hasOwnProperty(param)) {
						category[param] = base[param];
					}
				}
			}

			var storedString = localStorage.getItem('cheat2Setting');

			if (!storedString || storedString == "undefined")
				return;

			var stored = JSON.parse(storedString);
			var base = window.menu.UserSetting;


			for (var cat in base) {
				if (base.hasOwnProperty(cat))
					if (stored.hasOwnProperty(cat))
						mergeCategory(stored[cat], base[cat]);
					else
						stored[cat] = base[cat];
			}

			window.menu.UserSetting = stored;
		}

		var saveSetting = function () {
			localStorage.setItem('cheat2Setting', JSON.stringify(window.menu.UserSetting))
		}

		var updateSetting = function () {

			var btnGetState = function (btn) {
				return $("#btn-cheat-" + btn).hasClass("enabled");
			}

			var sliderGetValue = function (slider) {
				return $("#slider-" + slider).val();
			}

			window.menu.UserSetting.shoot = {
				spinBotEnabled: btnGetState("spinBotEnabled"),
				lasersightEnabled: btnGetState("lasersightEnabled"),
				fragGrenadeTimerEnabled: btnGetState("fragGrenadeTimerEnabled"),
				bumpFireEnabled: btnGetState("bumpFireEnabled"),
				autoAimEnabled: btnGetState("autoAimEnabled"),
				autoAimAlwaysOnEnabled: btnGetState("autoAimAlwaysOnEnabled"),
				autoReloadEnabled: btnGetState("autoReloadEnabled"),
				autoAimSpeedInertia: sliderGetValue("autoAimSpeedInertia"),
				autoAimPredictionInertia: sliderGetValue("autoAimPredictionInertia"),
				autoAimRestirctionEnabled: btnGetState("autoAimRestirctionEnabled"),
				autoAimRestirctionAngle: sliderGetValue("autoAimRestirctionAngle"),
				autoAimRestrictionCloseRange: sliderGetValue("autoAimRestrictionCloseRange"),
				autoAimPingCorrectionEnabled: btnGetState("autoAimPingCorrectionEnabled"),
				// autoAimAntiAntiCheatEnabled: 	btnGetState("autoAimAntiAntiCheatEnabled"),
				// autoAimAntiAntiCheatInertia:	sliderGetValue("autoAimAntiAntiCheatInertia"),
			};
			window.menu.UserSetting.loot = {
				// lootHighlightEnabled: 			btnGetState("lootHighlightEnabled"),
				autolootEnabled: btnGetState("autolootEnabled"),
				autolootSafeDistance: sliderGetValue("autolootSafeDistance"),
				autolootDropDelay: sliderGetValue("autolootDropDelay"),
			};
			window.menu.UserSetting.look = {
				zoomEnabled: btnGetState("zoomEnabled"),
				zoomSpeed: sliderGetValue("zoomSpeed"),
				obstaclesAlphaEnabled: btnGetState("obstaclesAlphaEnabled"),
				obstaclesAlphaTreeLevel: sliderGetValue("obstaclesAlphaTreeLevel"),
				obstaclesAlphaBushLevel: sliderGetValue("obstaclesAlphaBushLevel"),
				obstaclesAlphaTableLevel: sliderGetValue("obstaclesAlphaTableLevel"),
				ceilingAlphaEnabled: btnGetState("ceilingAlphaEnabled"),
				ceilingAlphaLevel: sliderGetValue("ceilingAlphaLevel"),
				smokeAlphaEnabled: btnGetState("smokeAlphaEnabled"),
				smokeAlphaLevel: sliderGetValue("smokeAlphaLevel"),
				enemyLinesEnabled: btnGetState("enemyLinesEnabled"),
				customCursorLevel: sliderGetValue("customCursorLevel"),
				barrelRedRecolorEnabled: btnGetState("barrelRedRecolorEnabled"),
				targetIndicatorEnabled: btnGetState("targetIndicatorEnabled")
			};
		}

		var updateMenu = function () {

			var btnSetState = function (btn, state) {
				// console.log("Setting new state.");
				$("#btn-cheat-" + btn).removeClass(state ? "disabled" : "enabled");
				$("#btn-cheat-" + btn).addClass(state ? "enabled" : "disabled");
			}

			var sliderSetValue = function (slider, value) {
				var cap = $("#menu-text-" + slider).text();
				$("#menu-text-" + slider).text(cap.substr(0, cap.indexOf(': ') + 2) + value.toString())
				$("#slider-" + slider).val(value);
			}

			var btnSetBind = function (btn, bind) {
				var btn = $("#btn-bind-" + btn);
				var cap = btn.text();
				cap = cap.substr(0, cap.indexOf(': ') + 2);

				var keyName =
					(bind.ctrl ? "Ctrl-" : "") +
					(bind.alt ? "Alt-" : "") +
					(bind.shift ? "Shift-" : "") +
					window.gameVars.Input.Keys.NameOf(bind.code);

				btn.text(cap + keyName)
			}

			var state = {};

			// shoot
			state = window.menu.UserSetting.shoot;
			btnSetState("spinBotEnabled", state.spinBotEnabled);
			btnSetState("lasersightEnabled", state.lasersightEnabled);
			btnSetState("fragGrenadeTimerEnabled", state.fragGrenadeTimerEnabled);
			btnSetState("bumpFireEnabled", state.bumpFireEnabled);
			btnSetState("autoAimEnabled", state.autoAimEnabled);
			btnSetState("autoAimAlwaysOnEnabled", state.autoAimAlwaysOnEnabled);
			btnSetState("autoReloadEnabled", state.autoReloadEnabled);
			sliderSetValue("autoAimSpeedInertia", state.autoAimSpeedInertia);
			sliderSetValue("autoAimPredictionInertia", state.autoAimPredictionInertia);
			btnSetState("autoAimRestirctionEnabled", state.autoAimRestirctionEnabled);
			sliderSetValue("autoAimRestirctionAngle", state.autoAimRestirctionAngle);
			sliderSetValue("autoAimRestrictionCloseRange", state.autoAimRestrictionCloseRange);
			btnSetState("autoAimPingCorrectionEnabled", state.autoAimPingCorrectionEnabled);
			// btnSetState("autoAimAntiAntiCheatEnabled",	state.autoAimAntiAntiCheatEnabled);
			// sliderSetValue("autoAimAntiAntiCheatInertia",state.autoAimAntiAntiCheatInertia);

			// loot
			state = window.menu.UserSetting.loot;

			// btnSetState("lootHighlightEnabled",				state.lootHighlightEnabled);
			btnSetState("autolootEnabled", state.autolootEnabled);
			sliderSetValue("autolootSafeDistance", state.autolootSafeDistance);
			sliderSetValue("autolootDropDelay", state.autolootDropDelay);

			// look
			state = window.menu.UserSetting.look;

			btnSetState("zoomEnabled", state.zoomEnabled);
			sliderSetValue("zoomSpeed", state.zoomSpeed);
			btnSetState("obstaclesAlphaEnabled", state.obstaclesAlphaEnabled);
			sliderSetValue("obstaclesAlphaTreeLevel", state.obstaclesAlphaTreeLevel);
			sliderSetValue("obstaclesAlphaBushLevel", state.obstaclesAlphaBushLevel);
			sliderSetValue("obstaclesAlphaTableLevel", state.obstaclesAlphaTableLevel);
			btnSetState("ceilingAlphaEnabled", state.ceilingAlphaEnabled);
			sliderSetValue("ceilingAlphaLevel", state.ceilingAlphaLevel);
			btnSetState("smokeAlphaEnabled", state.smokeAlphaEnabled);
			sliderSetValue("smokeAlphaLevel", state.smokeAlphaLevel);
			btnSetState("enemyLinesEnabled", state.enemyLinesEnabled);
			sliderSetValue("customCursorLevel", state.customCursorLevel);
			btnSetState("barrelRedRecolorEnabled", state.barrelRedRecolorEnabled);
			btnSetState("targetIndicatorEnabled", state.targetIndicatorEnabled);

			//binds
			state = window.menu.UserSetting.binds;

			btnSetBind("autoAim", state.autoAim);
			btnSetBind("switchMainWeapon", state.switchMainWeapon);
			btnSetBind("zoomIn", state.zoomIn);
			btnSetBind("zoomOut", state.zoomOut);
			btnSetBind("displayNames", state.displayNames);
			btnSetBind("spinPressed", state.spinPressed);

			// btnSetBind("streamerMode",						state.streamerMode);
			btnSetBind("teamPing", state.teamPing);
			// btnSetBind("emotes", state.emotes);

		}

		var changeTab = function (tabName) {

			var btnSetState = function (btn, state) {
				$("#btn-tab-selector-" + btn).removeClass(state ? "disabled" : "enabled");
				$("#btn-tab-selector-" + btn).addClass(state ? "enabled" : "disabled");
			}

			var tabSetState = function (tab, state) {
				$("#tab-" + tab).css("display", state ? "block" : "none");
			}

			var updateTabCategory = function (tab) {
				btnSetState(tab, tab == tabName);
				tabSetState(tab, tab == tabName);
			}

			updateTabCategory("shoot");
			updateTabCategory("loot");
			updateTabCategory("look");
			updateTabCategory("binds");
		}

		var setEvents = function (tabName) {

			var btnSetEvent = function (btn, tab) {

				var btnElement = $("#btn-cheat-" + btn);
				var name = btn;
				var tabb = tab;

				btnElement.click(() => {
					window.menu.UserSetting[tabb][name] = !window.menu.UserSetting[tabb][name];
					saveSetting();
					updateMenu();
				});
			}

			var btnBindSetEvent = function (btn, tab) {

				var btnElement = $("#btn-bind-" + btn);
				var name = btn;
				var tabb = tab;

				btnElement.click(() => {
					if (window.gameVars.Input.GlobalHookCallback)
						window.gameVars.Input.GlobalHookCallback.call(this, null);
					updateMenu();
					btnElement.addClass("disabled");
					window.gameVars.Input.GlobalHookCallback = function (bind) {
						window.gameVars.Input.GlobalHookCallback = null;
						btnElement.removeClass("disabled");
						if (bind) window.menu.UserSetting[tabb][name] = bind;
						saveSetting();
						updateMenu();
					}
				});
			}

			var sliderSetEvent = function (slider, tab) {
				var sliderElement = $("#slider-" + slider);
				var name = slider;
				var tabb = tab;

				sliderElement.change((e) => {
					window.menu.UserSetting[tab][name] = parseFloat(sliderElement.val());
					saveSetting();
					updateMenu();
				});
			}

			var tabSetEvent = function (tab) {

				var tabButton = $("#btn-tab-selector-" + tab);
				var tabName = tab;
				tabButton.click(() => {
					changeTab(tabName);
				});

				function endsWith(str, suffix) {
					return str.indexOf(suffix, str.length - suffix.length) !== -1;
				}

				for (var name in window.menu.UserSetting[tab]) {
					if (tab == "binds")
						btnBindSetEvent(name, tab);
					else if (endsWith(name, "Enabled"))
						btnSetEvent(name, tab);
					else
						sliderSetEvent(name, tab);
				}
			}

			tabSetEvent("shoot");
			tabSetEvent("loot");
			tabSetEvent("look");
			tabSetEvent("binds");
		}

		var menuTimer = function () {
			setTimeout(menuTimer, 100);

			var baseMenu = $("#ui-game-menu")

			if (!baseMenu)
				return;

			var menuActive = baseMenu.css("display") != "none";

			if (window.gameVars)
				window.gameVars.Menu = menuActive;

			var cheatMenu = $("#cheat-menu");

			var center = $("#ui-center");

			center.css("display", "inline-grid");
			center.css("grid-gap", "25px");
			baseMenu.css("grid-row", "1");
			cheatMenu.css("display", menuActive ? "block" : "none");
			cheatMenu.css("grid-row", "1");
		}

		defaultSetting();
		loadSetting();
		updateMenu();
		changeTab("shoot");
		setEvents();
		menuTimer();

		// Other UI stuff is here for now
		$("#ui-health-actual").append(window.tempVars.counterHtml);

		window.gameVars.UI.FPSText = $("#fps_text");
		// window.gameVars.UI.LATText = $("#lat_text");

	};
	doWork();
})();