// ==UserScript==
// @name        TW AdventCalendar
// @version     0.03
// @license     LGPLv3
// @description Advent Calendar Quest Requirements
// @author      hiroaki
// @match       https://*.the-west.gr/game.php*
// @match       https://*.the-west.net/game.php*
// @grant       none
// @namespace   https://greasyfork.org/users/3197
// @icon        https://westzz.innogamescdn.com/images/items/yield/adventcal.png
// @downloadURL https://update.greasyfork.org/scripts/456394/TW%20AdventCalendar.user.js
// @updateURL https://update.greasyfork.org/scripts/456394/TW%20AdventCalendar.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	const SCRIPT_LINK = "https://greasyfork.org/en/scripts/456394-tw-adventcalendar";
	const SCRIPT_NAME = 'TW AdventCalendar';
	const SCRIPT_VERSION = '0.03';
	HiroAdventCalendar = {
		divBuffBars: null,
		divBox: null,
		imgMini: null,
		imageOk: null,
		imageNot: null,
		imageCal: null,
		loaded: false,
		questItems: [
			{ id: 709000, name: 'Turkey', need: 12, count: 0 },
			{ id: 746000, name: 'Beans', need: 22, count: 0 },
			{ id: 703000, name: 'Sugar', need: 30, count: 0 },
			{ id: 1810000, name: 'Pumpkin', need: 36, count: 0 },
			{ id: 1808000, name: 'Potato', need: 40, count: 0 },
			{ id: 2162000, name: 'Ground Coffee', need: 42, count: 0 },
			{ id: 2160000, name: 'Speared Fish', need: 42, count: 0 },
			{ id: 700000, name: 'Ham', need: 40, count: 0 },
			{ id: 701000, name: 'Grain', need: 36, count: 0 },
			{ id: 793000, name: 'Tomato', need: 30, count: 0 },
			{ id: 706000, name: 'Berries', need: 22, count: 0 },
			{ id: 748000, name: 'Corn', need: 12, count: 0 },
		],
		init: function() {
			var that = this;
			if(this.loaded) return false;
			if(!!(Game && Game.loaded && Bag.loaded)) {
				this.loaded = true;
				this.cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com"
				this.imageOk = this.cdnBase + "/images/window/achievements/finished_shape.png";
				this.imageNot = this.cdnBase + "/images/icons/delete.png";
				this.imageCal = this.cdnBase + "/images/items/yield/adventcal.png?5";
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
			this.divBox = $('<div id="buff_div_xmas" class="buff_div buff_div_items" style="width: 43px; height: 43px;" />').appendTo(this.divBuffBars);
			this.imgMini = $('<img src="'+this.imageCal+'" width="43" height="43" alt="" />').appendTo(this.divBox);
		},
		calculate: function() {
			var that = this, have_items = true, table = '', imageStatus = '';
			$.each(this.questItems, function(itemId, rec) {
				var invItem = Bag.getItemByItemId(rec.id);
				if(invItem) {
					that.questItems[itemId].name = invItem.obj.name;
					that.questItems[itemId].count = invItem.count;
				}
			});
			$.each(this.questItems, function(itemId, rec) {
				var img = '', tr_color = '#006600';
				if(rec.count >= rec.need) img = '<img src="'+that.imageOk+'" width="16" height="16" alt="ok" />';
				else {
					img = '<img src="'+that.imageNot+'" width="16" height="16" alt="not ok" />';
					tr_color = '#660000';
					have_items = false;
				}
				table += '<tr style="color: '+tr_color+'"><td>'+img+'</td><td>'+rec.name+'</td><td style="text-align: right;">'+rec.count+' /</td><td>'+rec.need+'</td></tr>'
			});
			table+='<tr><td colspan="4" style="text-align: right; font-size: 8pt;">'+SCRIPT_NAME+' v'+SCRIPT_VERSION+'</td></tr>';
			table+='</table>';
			imageStatus = have_items ? this.imageOk : this.imageNot;
			if(this.divStatus) this.divStatus.remove();
			this.divStatus = $('<div class="bag_item_count" style="cursor: default; position: relative; float: left; left: 2px; bottom: 18px;"><img src="'+imageStatus+'" alt="" width="24" height="24" /></div>').appendTo(this.divBox);
			this.imgMini.addMousePopup({'content': table });
		},
	};
	$(function() { try { HiroAdventCalendar.init(); } catch(x) { console.trace(x); } });
});