// ==UserScript==
// @name           QT Framework for Grepolis
// @namespace      Quack
// @description    A script framework for Grepolis
// @include        http://*.grepolis.*/game*
// @icon           http://s1.directupload.net/images/140711/eshmcqzu.png
// @version        1.02.02
// @grant          GM_listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3596/QT%20Framework%20for%20Grepolis.user.js
// @updateURL https://update.greasyfork.org/scripts/3596/QT%20Framework%20for%20Grepolis.meta.js
// ==/UserScript==

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
				return QT.Lang.en[a][b]
			}
		},
		de : {
			test : {
				teststring : 'Sprache wurde erkannt'
			}
		},
		en : {
			test : {
				teststring : 'Language detected'
			}
		}
	};

	/************************************************************************
	 * Images
	 ***********************************************************************/
	QT.Images = {};

	/************************************************************************
	 * Links
	 ***********************************************************************/
	QT.Links = {};

	/************************************************************************
	 * Settings
	 ***********************************************************************/
	QT.Settings = {
		values : {
			"messageOpenAlert" : true,
			"reportOpenAlert" : true,
			"onlinetotal" : 0
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
		message : {
		default:
			function (event, xhr, settings) {
				if (QT.Settings.values.messageOpenAlert)
					QT.Functions.messageOpenAlert();
			}
		},
		report : {
			index : function () {
				if (QT.Settings.values.reportOpenAlert)
					QT.Functions.reportOpenAlert();
			}
		}
	};

	/************************************************************************
	 * Functions
	 ***********************************************************************/
	QT.Functions = {
		messageOpenAlert : function () {
			alert("Die Nachrichten wurden geöffnet");
		},
		reportOpenAlert : function () {
			alert("Die Berichte wurden geöffnet");
		},
		testButtons : function () {
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
		}
	};

	/************************************************************************
	 * Observer
	 ***********************************************************************/
	$.Observer(GameEvents.game.load).subscribe('QT', function (e, data) {
		QT.Settings.setValues();
		QT.Functions.testButtons();

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

unsafeWindow.QT_saveValue = function (name, value) {
	setTimeout(function () {
		GM_setValue(name, value);
	}, 0);
};
unsafeWindow.QT_saveAllValues = function (values) {
	setTimeout(function () {
		var exceptions = ["qmenu_update_next", "qmenu_online_version", "onlinetotal, googledocsurl"];
		var keys = GM_listValues();
		for (var i = 0, key = null; key = keys[i]; i++) {
			if (exceptions.indexOf(key) > -1) {
				continue;
			}
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
