// ==UserScript==
// @name        Kharus Raid Patch
// @namespace   Kharus Raid Patch
// @match       https://kharus.com/battle/raid*
// @match       http://kharus.com/battle/raid*
// @description:en for Kharus Raid
// @version     20161228.002

// @description for Kharus Raid
// @downloadURL https://update.greasyfork.org/scripts/26085/Kharus%20Raid%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/26085/Kharus%20Raid%20Patch.meta.js
// ==/UserScript==

function RaidPatch() {
	if($('button.btn-primary').val() == "getreward"){
		$('button.btn-primary[value=getreward]').trigger('click');
        return false;
	}
	if($('button.btn-primary[value=dobattle]').val() == "dobattle"){
        $('button.btn-primary[value=dobattle]').trigger('click');
        return false;
    }

	location.reload();
}
setInterval(RaidPatch, 13000);