// ==UserScript==
// @name         Vulcun.com jackpot bot
// @version      0.1
// @description  [DISCONTINUED] automatically clicks the "enter for x%" button, checks every 10 seconds, whether the button is disabled, if not then click it
// @author       mik13ST (ЖНИК)
// @match        https://vulcun.com/user/jackpot
// @require	     https://code.jquery.com/jquery-2.1.4.min.jss
// @grant        none
// @namespace https://greasyfork.org/users/20071
// @downloadURL https://update.greasyfork.org/scripts/13843/Vulcuncom%20jackpot%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/13843/Vulcuncom%20jackpot%20bot.meta.js
// ==/UserScript==

timer=setInterval(function() {
	if (!$("#submit-wager")[0].disabled) {
		$("#submit-wager")[0].click();
	}
},10000);