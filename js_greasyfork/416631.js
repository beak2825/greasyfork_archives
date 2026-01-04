// ==UserScript==
// @name           GLB Skill Points Page Enhancements
// @description     adds pop up with the needed SPs to next skill cap
// @namespace      nikkoum
// @version        1.3.0
// @include        https://glb.warriorgeneral.com/game/skill_points.pl?*
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/416631/GLB%20Skill%20Points%20Page%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/416631/GLB%20Skill%20Points%20Page%20Enhancements.meta.js
// ==/UserScript==
/* eslint-env jquery */
/* initially by bogleg , i merely defined a variable and added an updated link to a recent jquery version */


function figureNextCaps(curVal) {
	var out = '';
	var cur = curVal;
	var origCost = 0;
	var caps = 4;
	var needed = 0;
	var cost = 0;
	while (caps > 0) {
		cost = parseInt(Math.exp(0.0003 * Math.pow(cur, 2)));
		if (cost > origCost) {
			if (origCost > 0) {
				if (out.length) out += '<br />';
				out += '<b>' + cur + '</b>&nbsp;(' + origCost + '-cap)&nbsp;cost:&nbsp;' + needed + '&nbsp;Skill&nbsp;Point' + ((needed == 1) ? '' : 's');
				--caps;
			}
			origCost = cost;
		}
		needed += cost;
		cur = Math.round((cur + 1) * 100) / 100;
	}
	return out;
}

function installCapTips() {
	$('#attribute_list div.attribute_value').each(function() {
		$(this).mouseover(function() {
			unsafeWindow.set_tip(figureNextCaps(parseFloat(this.innerHTML)), 0, 1, 1, 1);
		}).mouseout(function() {
			unsafeWindow.unset_tip();
		});
	});
}

installCapTips();