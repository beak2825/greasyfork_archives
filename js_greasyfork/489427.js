// ==UserScript==
// @name        TW GoldCoins
// @version     0.02
// @license     LGPLv3
// @description Items Needed for Gold Coins (St Patrick Quests)
// @author      hiroaki
// @match       https://*.the-west.gr/game.php*
// @match       https://*.the-west.net/game.php*
// @grant       none
// @namespace   https://greasyfork.org/users/3197
// @icon        https://westzz.innogamescdn.com/images/items/yield/item_51915.png
// @downloadURL https://update.greasyfork.org/scripts/489427/TW%20GoldCoins.user.js
// @updateURL https://update.greasyfork.org/scripts/489427/TW%20GoldCoins.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	const SCRIPT_NAME = 'TW GoldCoins';
	const SCRIPT_VERSION = '0.02';
	HiroGoldCoins = {
		days_left: 0,
		divBuffBars: null,
		divBox: null,
		imgMini: null,
		imageOk: null,
		imageNot: null,
		imageScript: null,
		loaded: false,
		questItems: [
			{ id: 2432000, name: 'Μπουκάλι με γάλα', need: 52, count: 0 },
			{ id: 2450000, name: 'Βάζο με ωμό αυγό', need: 130, count: 0 },
			{ id: 701000, name: 'Κόκκος', need: 100, count: 0 },
			{ id: 702000, name: 'Ταμπάκο', need: 290, count: 0 },
			{ id: 704000, name: 'Βαμβάκι', need: 150, count: 0 },
			{ id: 1811000, name: 'Βατόμουρα', need: 200, count: 0 },
			{ id: 1814000, name: 'Άνθος λωτού', need: 200, count: 0 },
			{ id: 1825000, name: 'Λουλάκι', need: 50, count: 0 },
			{ id: 717000, name: 'Σολομός', need: 60, count: 0 },
			{ id: 705000, name: 'Πέστροφα', need: 120, count: 0 },
			{ id: 1815000, name: 'Καβουρόψιχα', need: 120, count: 0 },
			{ id: 751000, name: 'Πίπα', need: 9, count: 0 },
			{ id: 711000, name: 'Ξύλο', need: 270, count: 0 },
			{ id: 778000, name: 'Κατσαρόλα Μαγειρέματος', need: 110, count: 0 },
			{ id: 2444000, name: 'Είδη Ιεροτελεστίας', need: 26, count: 0 },
			{ id: 1791000, name: 'Χρυσόσκονη', need: 88, count: 0 },
			{ id: 235000, name: 'Καφέ ημίψηλο καπέλο', need: 9, count: 0 },
			{ id: 525000, name: 'Καφέ παπιγιόν', need: 9, count: 0 },
			{ id: 507000, name: 'Γκρίζο Ινδιάνικο μενταγιόν', need: 13, count: 0 },
			{ id: 41171000, name: 'Μαύρο Κολιέ με Καρδιά', need: 12, count: 0 },
			{ id: 342000, name: 'Περίεργο γιλέκο', need: 9, count: 0 },
			{ id: 11014000, name: 'Καφέ καρό ζώνη', need: 9, count: 0 },
			{ id: 10075000, name: 'Μαύρο λινό παντελόνι', need: 9, count: 0 },
			{ id: 432000, name: 'Παπούτσια προσκυνητή', need: 9, count: 0 },
		],
		init: function() {
			var that = this;
			if(this.loaded) return false;
			if(!!(Game && Game.loaded && Bag.loaded)) {
				this.loaded = true;
				this.cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com";
				this.imageOk = this.cdnBase + "/images/window/achievements/finished_shape.png";
				this.imageNot = this.cdnBase + "/images/icons/delete.png";
				this.imageScript = this.cdnBase + "/images/items/yield/item_51919.png"
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
			this.divBox = $('<div id="buff_div_products" class="buff_div buff_div_items" style="width: 43px; height: 43px;" />').appendTo(this.divBuffBars);
			this.imgMini = $('<img src="'+this.imageScript+'" width="43" height="43" alt="" />').appendTo(this.divBox);
		},
		calculate: function() {
			var that = this, have_items = true, table = '', imageStatus = '', total_have = 0, total_need = 0;
			var today = new Date(), date_valentine = new Date(today.getFullYear()+1, 1, 14);
			this.days_left = Math.ceil((date_valentine - today)/86400000);
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
			table+='<tr style="color: '+tr_color+';"><td colspan="2" style="border-top: 1px solid #000000; font-size: 8pt; padding-top: 4px; color: #000066;">'+SCRIPT_NAME+' v'+SCRIPT_VERSION+' (MrBean)</td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">'+total_have+' /</td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">&nbsp;'+total_need+'</td></tr>';
			table+='</table>';
			imageStatus = have_items ? this.imageOk : this.imageNot;
			if(this.divStatus) this.divStatus.remove();
			this.divStatus = $('<div class="bag_item_count" style="cursor: default; position: relative; float: left; left: 2px; bottom: 18px;"><img src="'+imageStatus+'" alt="" width="24" height="24" /></div>').appendTo(this.divBox);
			this.imgMini.addMousePopup({'content': table });
		},
	};
	$(function() { try { HiroGoldCoins.init(); } catch(x) { console.trace(x); } });
});