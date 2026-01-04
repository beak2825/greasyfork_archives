// ==UserScript==
// @name         Transformania Time Focus Text Boxes
// @namespace    http://steamcommunity.com/id/siggo/
// @version      1.0.1
// @description  For Transformania Time multiplayer edition. Places focus in some text entry fields as soon as the page loads. Saves you some clicks.
// @author       Prios
// @match        https://www.transformaniatime.com/pvp/playerlookup
// @match    	 https://www.transformaniatime.com/pvp/myfriends
// @match        https://www.transformaniatime.com/PvP/Shout
// @match        https://www.transformaniatime.com/pvp/shout
// @match    	 https://www.transformaniatime.com/pvp/myskills
// @match    	 https://www.transformaniatime.com/messages/write*
// @match		 https://www.transformaniatime.com/item/selfcast
// @match		 https://www.transformaniatime.com/Info/GearTool
// @match		 https://www.transformaniatime.com/npc/lorekeeperlearnspell*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/472514/Transformania%20Time%20Focus%20Text%20Boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/472514/Transformania%20Time%20Focus%20Text%20Boxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var thisURL = window.location.pathname;
	var textBox;

	switch (thisURL) { // goofy but works and is easy to understand
		case '/pvp/playerlookup':
			textBox = $( '#FirstName' );
		break;
		case '/pvp/myfriends':
			textBox = $( '[type="search"]' );
		break;
		case '/PvP/Shout':
			textBox = $( '#Message' );
		break;
        case '/pvp/shout':
            textBox = $( '#Message' );
        break;
		case '/pvp/myskills':
			textBox = $( '[type="search"]' );
		break;
		case '/messages/write':
			textBox = $( '#MessageText' );
		break;
		case '/item/selfcast':
			textBox = $( '[type="search"]' );
		break;
		case '/Info/GearTool':
			textBox = $( '[type="search"]' );
		break;
		case '/npc/lorekeeperlearnspell':
			textBox = $( '[type="search"]' );
	}

	textBox[0].focus();

})();