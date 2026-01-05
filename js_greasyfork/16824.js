// ==UserScript==
// @name         Torn Faction Average Level Calculator
// @version      0.6
// @description  Relentless Countinous Chaining Days in War Base estimator
// @author       Zanoab
// @match        *://www.torn.com/factions.php?step=profile*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/10403
// @downloadURL https://update.greasyfork.org/scripts/16824/Torn%20Faction%20Average%20Level%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/16824/Torn%20Faction%20Average%20Level%20Calculator.meta.js
// ==/UserScript==

jQuery.noConflict(true)(document).ready(function($) {
	var var_maxLevel = "averageFactionMaxLevel";
	
	var getRespect = function() {
		var a = $(".f-msg > .respect").text().match(/RESPECT: ([\d,]+)/);
		if (a) {
			return a[1].replace(/[,]/g, "");
		}
		return NaN;
	};
	
	var recount = function(max) {
		max = max != null ? max : Number(localStorage.getItem(var_maxLevel))
		var total = 0, count = 0, totalCount = 0;
		$(".faction-info-wrap > .f-war-list > .member-list > li").each(function(i, ele) {
			ele = $(ele);
			var a = ele.find(".acc-wrap > .lvl").text().match(/Level:\W*(\d+)/);
			if (a) {
				++totalCount;
				
				switch(ele.find(".info-wrap > .status > .t-red").text()) {
					case "Federal":
						// In federal, ignore...
						return;
					case "Traveling":
						// Travelling, not handled yet
						break;
				}
				
				a = Number(a[1]);
				if (!max || a <= max) {
					++count;
					total += a;
				}
			}
		});
		$('.avg-lvl').text(count ? (total / count).toFixed(2) : 0);
		$('.avg-total').text(count == totalCount || count == 0 ? count : (""+count+"/"+totalCount+" ("+(100*count/totalCount).toFixed(2)+"%)"));
		$('.avg-max').text(max ? " (Max Level: "+max+")" : "")
		
		var respect = getRespect();
		respect = Math.min(Math.max(respect, 1000), 10000);
		$('.avg-days').text(total ? ((respect / 4 * 80) / (total * 30)).toFixed(2) : "Pony!");
	};
	
	$("<span style='margin-left:5px;'>(Average Level: <span class='avg-lvl'></span> over <span class='avg-total'></span> players<span class='avg-max'></span> (Estimated Days: <span class='avg-days'></span>))</span>").appendTo('[id="factions"] > .faction-info-wrap > .title-black').click(function() {
		var a = prompt("Enter the maximum level to count:");
		localStorage.setItem(var_maxLevel, a)
		recount(Number(a));
	});
	recount();
});