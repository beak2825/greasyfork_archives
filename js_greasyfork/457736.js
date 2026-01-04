// ==UserScript==
// @name        TW ProductsNeeded
// @version     0.04
// @license     LGPLv3
// @description Buffs & Products Needed until next Valentine's day
// @author      hiroaki
// @match       https://*.the-west.gr/game.php*
// @match       https://*.the-west.net/game.php*
// @grant       none
// @namespace   https://greasyfork.org/users/3197
// @icon        https://westzz.innogamescdn.com/images/items/yield/package_sale_2017_quest.png
// @downloadURL https://update.greasyfork.org/scripts/457736/TW%20ProductsNeeded.user.js
// @updateURL https://update.greasyfork.org/scripts/457736/TW%20ProductsNeeded.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	const SCRIPT_NAME = 'TW ProductsNeeded';
	const SCRIPT_VERSION = '0.04';
	HiroProductsNeeded = {
		days_left: 0,
		divBuffBars: null,
		divBox: null,
		imgMini: null,
		imageOk: null,
		imageNot: null,
		imageScript: null,
		loaded: false,
		questItems: [
			{ id: 716000, name: 'Granite Blocks', need: 0, multiplier: 2, count: 0 },
			{ id: 704000, name: 'Cotton', need: 0, multiplier: 2, count: 0 },
			{ id: 767000, name: 'Roll of Wire', need: 0, multiplier: 2, count: 0 },
			{ id: 763000, name: 'Tooth Bracelet', need: 0, multiplier: 1, count: 0 },
			{ id: 752000, name: 'Oil', need: 0, multiplier: 2, count: 0 },
			{ id: 724000, name: 'Buffalo Skin', need: 0, multiplier: 1, count: 0 },
			{ id: 1891000, name: 'Chewing Tobacco', need: 0, multiplier: 1, count: 0 },
			{ id: 1939000, name: 'Filtered cigarette', need: 0, multiplier: 3, count: 0 },
			{ id: 1890000, name: 'Tea', need: 1000, multiplier: false, count: 0 },
			{ id: 1928000, name: 'Sleeping Bag', need: 100, multiplier: false, count: 0 },
			{ id: 1883000, name: 'Stomach Medicine', need: 100, multiplier: false, count: 0 },
		],
		init: function() {
			var that = this;
			if(this.loaded) return false;
			if(!!(Game && Game.loaded && Bag.loaded)) {
				this.loaded = true;
				this.cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com";
				this.imageOk = this.cdnBase + "/images/window/achievements/finished_shape.png";
				this.imageNot = this.cdnBase + "/images/icons/delete.png";
				this.imageScript = this.cdnBase + "/images/items/yield/wishlist.png";
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
				if(rec.multiplier) that.questItems[itemId].need = that.days_left * rec.multiplier;
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
			table+='<tr style="color: '+tr_color+';"><td colspan="2" style="border-top: 1px solid #000000; font-size: 8pt; padding-top: 4px; color: #000066;">'+SCRIPT_NAME+' v'+SCRIPT_VERSION+'</td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">'+total_have+' /</td><td style="border-top: 1px solid #000000; font-weight: bold; text-align: right;">&nbsp;'+total_need+'</td></tr>';
			table+='</table>';
			imageStatus = have_items ? this.imageOk : this.imageNot;
			if(this.divStatus) this.divStatus.remove();
			this.divStatus = $('<div class="bag_item_count" style="cursor: default; position: relative; float: left; left: 2px; bottom: 18px;"><img src="'+imageStatus+'" alt="" width="24" height="24" /></div>').appendTo(this.divBox);
			this.imgMini.addMousePopup({'content': table });
		},
	};
	$(function() { try { HiroProductsNeeded.init(); } catch(x) { console.trace(x); } });
});