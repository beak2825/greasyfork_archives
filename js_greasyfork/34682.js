// ==UserScript==
// @name               TW Medals
// @version            0.02
// @license            LGPLv3
// @description        The West Premium Bonus Medals
// @author             hiroaki
// @grant              none
// @include            http*://*.beta.the-west.net/game.php*
// @namespace          https://greasyfork.org/users/3197
// @icon               https://westzz.innogamescdn.com/images/items/yield/automation_award.png
// @downloadURL https://update.greasyfork.org/scripts/34682/TW%20Medals.user.js
// @updateURL https://update.greasyfork.org/scripts/34682/TW%20Medals.meta.js
// ==/UserScript==

function appendScript(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	document.body.appendChild(newScript);
	document.body.removeChild(newScript);
}
appendScript(function() {
	var VERSION = 0.02;
	var URL_INSTALL = "https://greasyfork.org/scripts/34682-tw-medals";
	var scriptAuthor = "hiroaki";
	var scriptDescription = "Too bored to write a description";
	var scriptName = "TW Medals";
	var scriptObject = "HiroMedals";
	this[scriptObject] = {
		popupContent: '',
		medals: {
			automation: { itemId: 21342000, count: 0, name: '' },
			character: { itemId: 21340000, count: 0, name: '' },
			energy: { itemId: 21341000, count: 0, name: '' },
			income: { itemId: 21343000, count: 0, name: '' },
		},
		openInventory: function() {
			var invItem, medalItems = [];
			$.each(this.medals, function(key, val) {
				if(val.count) medalItems.push(Bag.getItemByItemId(val.itemId));
			});
			Wear.open();
			Inventory.showSearchResult(medalItems);
		},
		updateMedals: function() {
			$.each(this.medals, function(key, val) {
				var item = Bag.getItemByItemId(val.itemId);
				val.count = Bag.getItemCount(val.itemId);
				val.name = item.obj.name;
			});
			var popupContent = '<table>';
			$.each(this.medals, function(key, val) {
				popupContent += '<tr><td style="white-space: nowrap;">' + val.name + ':</td><td style="text-align: right; font-weight: bold; padding-left: 8px">' + val.count + '</td></tr>';
			});
			popupContent += '</table>';
			this.popupContent = popupContent;
		},
		doIt: function() {
			this.updateMedals();
			$.each(this.medals, function(key, val) {
				if(val.count) ItemUse.doIt(val.itemId);
			});
		},
		useMedals: function() {
			this.updateMedals();
			var avail = 0, title = "Use bonus medals?", table = '<table>';
			$.each(this.medals, function(key, val) {
				if(val.count) {
					table += '<tr><td>'+val.name+'</td><td>('+val.count + ' available)</tr>';
					++ avail;
				}
			});
			table += '</table>';
			if(avail) {
				var message = '<div>Do you want to use these ' + avail + ' medals?' + '<br />' + table + '</div>'; 
				new west.gui.Dialog(title, message, west.gui.Dialog.SYS_QUESTION).addButton("yes", function() {
					HiroMedals.doIt();
				}).addButton("Inventory", function() {
					HiroMedals.openInventory();
				}).addButton("cancel", function() {}).show();
			}
		},
		design: function() {
			var imageSrc = Game.cdnURL + '/images/items/yield/automation_award.png';
			this.updateMedals();
			var divCharacter = $("#buff_div_" + Character.charClass);
			divCharacter.css({"position": "relative"});
			var divMedals = $("<div />", { style: "position: absolute; width: 43px; height: 64px; top: 0px; right: 0px; z-index: 18; width: 20px; height: 18px;" }).hide();
			var imgMedals = $('<img src="'+imageSrc+'" alt="" title="Bonus Medals">').click(function(){ HiroMedals.useMedals(); return false; });
			imgMedals.css({ "width": "24px", "height": "24px", "position": "absolute", "right": "0px", "top": "24px" });
			imgMedals.appendTo(divMedals);
			divMedals.appendTo("#buff_div_" + Character.charClass + " .bag_item_mini");
			divMedals.show();
			imgMedals.addMousePopup(this.popupContent);
		},
		script: {
			api: null,
			listeningSignals: [ 'game_config_loaded', 'inventory_loaded' ] ,
			loaded: false,
			init: function() {
				if(this.loaded) return false;
				if(!!(Game && Game.loaded && Bag.loaded)) {
					this.loaded = true;
					this.api = TheWestApi.register(scriptObject, scriptName, '2.04', Game.version.toString(), scriptAuthor, URL_INSTALL);
					this.api.setGui(scriptDescription);
					HiroMedals.design();
				}
				else {
					var that = this;
					EventHandler.listen('game_config_loaded', function() {
						that.init();
						return EventHandler.ONE_TIME_EVENT;
					});
					EventHandler.listen('inventory_loaded', function() {
						that.init();
						return EventHandler.ONE_TIME_EVENT;
					});
				}
			},
		}
	};
	$(function() { try { HiroMedals.script.init(); } catch(x) { console.trace(x); } });
});