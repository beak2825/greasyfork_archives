// ==UserScript==
// @name         TfT Map Tweak
// @namespace	 http://steamcommunity.com/id/siggo/
// @version      1.0.2
// @description  For Transformania Time multplayer edition. Starts the enchantment map view closer to the center of town. Starts the standard map centered on the player's location.
// @author       Prios
// @match        https://www.transformaniatime.com/pvp/worldmap?showEnchant=*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/472516/TfT%20Map%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/472516/TfT%20Map%20Tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var thisURL = window.location.href;
	var enchantmentMapOffset = 0;

	if ( thisURL === 'https://www.transformaniatime.com/pvp/worldmap?showEnchant=true' ) {
        $( '.mapcell' )
			[enchantmentMapOffset].scrollIntoView({behavior:'smooth', block:'center', inline:'center'})
		;
	}
	else if ( thisURL === 'https://www.transformaniatime.com/pvp/worldmap?showEnchant=false' ) {
		$( '[style*="lightpink"]' )
			[0].scrollIntoView({behavior:'smooth', block:'center', inline:'center'})
		;
	}

})();