// ==UserScript==
// @name           Bogleg's GLB Skill Points Page Enhancements - Chrome Friendly
// @namespace      Bogleg(+MR)
// @description    Makes the skill point page easier to use
// @version        1.3.0
// @include        http://goallineblitz.com/game/skill_points.pl?*
// @include        http://glb.warriorgeneral.com/game/skill_points.pl?*
// @downloadURL https://update.greasyfork.org/scripts/2832/Bogleg%27s%20GLB%20Skill%20Points%20Page%20Enhancements%20-%20Chrome%20Friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/2832/Bogleg%27s%20GLB%20Skill%20Points%20Page%20Enhancements%20-%20Chrome%20Friendly.meta.js
// ==/UserScript==
// all credit to bogleg and the person who modified it for chrome (mk?, air?)

function figureNextCaps(curVal) {
	var out = '';
	var cur = curVal;
	var origCost = 0;
	var caps = 4;
	var needed = 0;
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
	var divs = document.getElementById('attribute_list').getElementsByTagName('div');
	for (var div=0; div<divs.length; div++) {
		if (divs[div].className == 'attribute_value') {
			var tip = figureNextCaps(parseFloat(divs[div].innerHTML));
			divs[div].setAttribute('onmouseover', "set_tip('" + tip + "', 0, 1, 1, 1)");
			divs[div].setAttribute('onmouseout', "unset_tip()");
		}
	}
}

installCapTips();
