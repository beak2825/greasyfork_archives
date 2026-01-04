// ==UserScript==
// @name         GLB Tag Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter Tag Menu!
// @include      http://glb.warriorgeneral.com/game/scout_team.pl?team_id=*
// @author       Seattleniner
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374717/GLB%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/374717/GLB%20Tag%20Filter.meta.js
// ==/UserScript==

var keep = ["none", "passer", "rusher", "receiver", "blocker"];
var select = document.getElementById('tag');

// Do not edit below

function containsItem(arr, value) {
	var l = arr.length;

	while (l--)
		if (arr[l] == value)
			return true;

	return false;
}

var i = 0;

while (select.options.length != keep.length) {
	if (!containsItem(keep, select[i].value)) {
		select.remove(i);
		i = 0;
	} else {
		++i;
	}
}