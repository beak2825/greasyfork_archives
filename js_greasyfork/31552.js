// ==UserScript==
// @name       DSSelectVillages
// @namespace  phisa  
// @description  Kordy z mapy
// @copyright  Phisa / Philipp Winter, 2013
// @license    MIT License - just do anything you want with this script, just add this copyright notice - http://opensource.org/licenses/MIT
// @include    https://de*.die-staemme.de/game.php*screen=map*
// @include    https://pl*.plemiona.pl/game.php*screen=map*
// @include    https://zz2.beta.tribalwars.net/game.php*screen=map*
// @version 0.0.1.20170718072006
// @downloadURL https://update.greasyfork.org/scripts/31552/DSSelectVillages.user.js
// @updateURL https://update.greasyfork.org/scripts/31552/DSSelectVillages.meta.js
// ==/UserScript==
win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;


//Init-Script
win.showWithCoords = true;
win.showWithCounter = true;
win.breakAfter = 5;
win.activationCharCode = 'b';


win.$.ajaxSetup({
    cache: true
});
var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
win.ScriptAPI.register('162-SelectVillages', true, 'Phisa', 'philipp.winter@postopus.de');

win.DSSelectVillages = {
    currentLang: 'de',

    showWithCoords: true,

    showWithCounter: true,

    breakAfter: 5,

    enabled: false,

    villages: [],

    villagesId: [],

    lang: {
        de: {
            UI: {
                selectedVillages: "Wybierz wioski:",
                enableShowWithCoords: "z kodami BB",
                enableShowWithCounter: "z numerowaniem"
            }
        }
    },

	enableScript: function () {
		this.enabled = true;
		this.showWithCoords = win.showWithCoords;
		this.showWithCounter = win.showWithCounter;
		this.breakAfter = win.breakAfter;
		win.TWMap.mapHandler.integratedSpawnSector = win.TWMap.mapHandler.spawnSector;
		win.TWMap.mapHandler.spawnSector = this.spawnSector;

		this.oldClickFunction = win.TWMap.mapHandler.onClick;
		win.TWMap.mapHandler.onClick = this.clickFunction;
		win.TWMap.reload();

		this.showUi();
	},

	spawnSector: function (data, sector) {
		win.TWMap.mapHandler.integratedSpawnSector(data, sector);
		for (var i = 0; i < win.DSSelectVillages.villagesId.length; i++) {
			var villageId = win.DSSelectVillages.villagesId[i];
			if(villageId === null){
				continue;
			}
			var v = $('#map_village_' + villageId);
			$('<div class="DSSelectVillagesOverlay" id="DSSelectVillages_overlay_' + villageId + '" style="width:52px; height:37px; position: absolute; z-index: 50; left:' + $(v).css('left') + '; top: ' + $(v).css('top') + ';"></div>').appendTo(v.parent());
			$('#DSSelectVillages_overlay_' + villageId).css('outline', '2px solid red');
		}
	},

	markVillageAsSelected: function (id) {
		$('#DSSelectVillages_overlay_' + id).css('outline', '2px solid red');
	},
	demarkVillageAsSelected: function (id) {
		$('#DSSelectVillages_overlay_' + id).css('outline', '');
	},

	disableScript: function () {
		this.enabled = false;
		this.villages = [];
		this.villagesId = [];
		win.TWMap.mapHandler.onClick = this.oldClickFunction;
		win.TWMap.mapHandler.spawnSector = win.TWMap.mapHandler.integratedSpawnSector;
		win.TWMap.reload();
		$('#bb_main_div').remove();
	},

	showUi: function () {
		var main_div = $('<div id="bb_main_div" class="popup_style" style="display: block; top: 100px; left: 700px; z-index: 9999; position: fixed"></div>');
		$('body').append(main_div);
		$(main_div).draggable();
		var close_button = $('<div class="popup_menu"><a href="Javascript:void(0);" id="a_close">Zamknij</a></div>');
		var main = $('#bb_main_div');
		main.append(close_button);
		$('#a_close').click(function () {
			$('#bb_main_div').remove();
			win.DSSelectVillages.disableScript();
		});
		var output_div =
			$('<div class="popup_content">' +
				'<h3 align="center">' + this.lang[this.currentLang].UI.selectedVillages + '</h3>' +
				'<input type="checkbox" checked="true" id="bbcode" /> ' +
				this.lang[this.currentLang].UI.enableShowWithCoords + '<br />' +
				'<input type="checkbox" checked="true" id="zaehlen" /> ' +
				this.lang[this.currentLang].UI.enableShowWithCounter + '<br />' +
				'<textarea id="output" cols="35" rows="20" readonly style="width: 307px !important; height: 332px !important;text-align:center;">' +
				'</textarea>' +
				'</div>');
		main.append(output_div);
		var chkbxBBcode = $('#bbcode');
		var chkbxcounter = $('#zaehlen');
		chkbxBBcode.prop('checked', this.showWithCoords);
		chkbxcounter.prop('checked', this.showWithCounter);
		chkbxBBcode.change(function () {
			win.DSSelectVillages.showWithCoords = this.checked;
			win.DSSelectVillages.outputCoords();
		});
		chkbxcounter.change(function () {
			win.DSSelectVillages.showWithCounter = this.checked;
			win.DSSelectVillages.outputCoords();
		});
	},

	outputCoords: function () {
		var coordsOutput = "";
		for (var i = 0; i < this.villages.length; i++) {
			if (this.villages[i] === null) {
				continue;
			}
			var realCount = 0;
			for (var j = 0; j <= i; j++) {
				if (this.villages[j] != null) {
					realCount++;
				}
			}
			coordsOutput += (this.showWithCounter ? realCount + ". " : "" ) + (this.showWithCoords ? "[coord]" : "") + this.villages[i] + (this.showWithCoords ? "[/coord]" : "") + "\n";
			if (this.breakAfter != -1 && realCount % this.breakAfter == 0) {
				coordsOutput += "\n";
			}
		}
		$('#output').html(coordsOutput);
		$("#output").select();
	},

	handleVillage: function (x, y) {
		var coord = x + "|" + y;
		var index = this.villages.indexOf(coord);
		var village = win.TWMap.villages[(x) * 1000 + y];
		if (!village) {
			return;
		}
		if (index === -1) {
			this.villages.push(coord);
			this.villagesId.push(village.id);
			this.markVillageAsSelected(village.id);
			win.TWMap.reload();
		} else {
			this.villages[index] = null;
			var indexId = this.villagesId.indexOf(village.id);
			this.villagesId[indexId] = null;
			this.demarkVillageAsSelected(village.id);
		}
		this.outputCoords();
	},

	clickFunction: function (x, y, event) {
		win.DSSelectVillages.handleVillage(x, y);
		return false; //Signal that the TWMap should not follow the URL associated to this click event
	},

	oldClickFunction: null
};

(function () {
	$(document).on("keypress",
		function (e) {
			if (String.fromCharCode(e.which) == win.activationCharCode) {
				if (win.DSSelectVillages.enabled == false) {
					win.DSSelectVillages.enableScript();
				} else {
					win.DSSelectVillages.disableScript();
				}
			}
		}
	);
})();