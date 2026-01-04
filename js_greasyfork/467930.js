// ==UserScript==
// @name        TW QuestItemsNeeded
// @version     0.03
// @license     LGPLv3
// @description Products Needed for Quests
// @author      hiroaki
// @match       https://*.the-west.gr/game.php*
// @match       https://*.the-west.net/game.php*
// @grant       none
// @namespace   https://greasyfork.org/users/3197
// @icon        https://westzz.innogamescdn.com/images/items/yield/xmas17_set1_yield1.png
// @downloadURL https://update.greasyfork.org/scripts/467930/TW%20QuestItemsNeeded.user.js
// @updateURL https://update.greasyfork.org/scripts/467930/TW%20QuestItemsNeeded.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	const SCRIPT_NAME = 'TW QuestItemsNeeded';
	const SCRIPT_VERSION = '0.03';
	const QUEST_NAME = 'Gifts and Clues';
	HiroQuestItemsNeeded = {
		divBuffBars: null,
		divBox: null,
		imgMini: null,
		imageOk: null,
		imageNot: null,
		imageScript: null,
		loaded: false,
		questItems: [
			{ id: 749000, name: 'Lasso', need: 1, count: 0 },
			{ id: 1812000, name: 'Seeds', need: 20, count: 0 },
			{ id: 1810000, name: 'Pumpkin', need: 1, count: 0 },
			{ id: 793000, name: 'Tomato', need: 5, count: 0 },
			{ id: 701000, name: 'Grain', need: 20, count: 0 },
			{ id: 721000, name: 'Coal', need: 4, count: 0 },
			{ id: 741000, name: 'Jug', need: 1, count: 0 },
			{ id: 1917000, name: 'Leather strap', need: 2, count: 0 },
			{ id: 712000, name: 'Leather', need: 4, count: 0 },
			{ id: 745000, name: 'Flour', need: 20, count: 0 },
			{ id: 778000, name: 'Cooking pot', need: 2, count: 0 },
			{ id: 2432000, name: 'Bottle of milk', need: 3, count: 0 },
			{ id: 750000, name: 'Handcuffs', need: 1, count: 0 },
			{ id: 724000, name: 'Buffalo skin', need: 1, count: 0 },
			{ id: 542000, name: 'Grey Shawl', need: 1, count: 0 },
			{ id: 41074000, name: 'Blue bone necklance', need: 1, count: 0 },
			{ id: 368000, name: 'Dancer\'s dress', need: 1, count: 0 },
			{ id: 2132000, name: 'Field cook\'s bag', need: 1, count: 0 },
		],
		init: function() {
			var that = this;
			if(this.loaded) return false;
			if(!!(Game && Game.loaded && Bag.loaded)) {
				this.loaded = true;
				this.cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com";
				this.imageOk = this.cdnBase + "/images/window/achievements/finished_shape.png";
				this.imageNot = this.cdnBase + "/images/icons/delete.png";
				this.imageScript = this.cdnBase + "/images/items/yield/xmas17_set1_yield1.png";
				this.draw();
				this.calculate();
				EventHandler.listen('inventory_changed', function() {
					setTimeout(function() {
						that.calculate();
					}, 2e3);
				}, this);
			}
			else {
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
		draw: function() {
			this.divBuffBars = $('#buffbars');
			this.divBox = $('<div id="buff_div_quest" class="buff_div buff_div_items" style="width: 43px; height: 43px;" />').appendTo(this.divBuffBars);
			this.imgMini = $('<img src="'+this.imageScript+'" width="43" height="43" alt="" />').appendTo(this.divBox);
		},
		calculate: function() {
			var that = this, have_items = true, table = '', imageStatus = '', total_have = 0, total_need = 0;
			$.each(this.questItems, function(itemId, rec) {
				var invItem = Bag.getItemByItemId(rec.id);
				if(invItem) {
					that.questItems[itemId].name = invItem.obj.name;
					that.questItems[itemId].count = invItem.count;
				}
			});
			table = '<table cellspacing="0" cellpadding="0">';
			$.each(this.questItems, function(itemId, rec) {
				var img = '', tr_color = '#006600';
				if(rec.count >= rec.need) img = '<img src="'+that.imageOk+'" width="16" height="16" alt="ok" />';
				else {
					img = '<img src="'+that.imageNot+'" width="16" height="16" alt="not ok" />';
					tr_color = '#660000';
					have_items = false;
				}
				total_have += Math.min(rec.count, rec.need);
				total_need += rec.need;
				table += '<tr style="color: '+tr_color+';"><td>'+img+'</td><td style="padding-right: 8px;">'+rec.name+':</td><td style="text-align: right;">'+rec.count+' /</td><td style="text-align: right;">'+rec.need+'</td></tr>';
			});
			tr_color = total_have < total_need ? "#660000" : "#006600";
			table+='<tr style="color: '+tr_color+';"><td colspan="2" style="border-top: 1px solid #000000; font-size: 8pt; padding-top: 4px; color: #000066;">Quest: <b>'+QUEST_NAME+'</b></td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">'+total_have+' /</td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">&nbsp;'+total_need+'</td></tr>';
			table+='</table>';
			imageStatus = have_items ? this.imageOk : this.imageNot;
			if(this.divStatus) this.divStatus.remove();
			this.divStatus = $('<div class="bag_item_count" style="cursor: default; position: relative; float: left; left: 2px; bottom: 18px;"><img src="'+imageStatus+'" alt="" width="24" height="24" /></div>').appendTo(this.divBox);
			this.imgMini.addMousePopup({'content': table });
		},
	};
	$(function() { try { HiroQuestItemsNeeded.init(); } catch(x) { console.trace(x); } });
});