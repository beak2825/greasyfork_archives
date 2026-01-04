// ==UserScript==
// @name         IRCCloud automatically reconnect
// @version      0.1.0
// @description  IRCCloud: automatically reconnect to network after disconnected (for free version)
// @match        *://www.irccloud.com
// @match        *://www.irccloud.com/*
// @namespace    https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/394095/IRCCloud%20automatically%20reconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/394095/IRCCloud%20automatically%20reconnect.meta.js
// ==/UserScript==

(function(){
	let delay=1000
	let handler=setTimeout(function tryReconnect(){
		let elem=document.querySelector('a.reconnect')
		if(elem!==null){
			elem.click()
		}else{
			const hardZombieWarning=document.getElementById("hardZombieWarning")
			if(hardZombieWarning && hardZombieWarning.style.display === "block")
				location.reload()
		}

		delay=Math.min(60000, delay*2)
		handler=setTimeout(tryReconnect, delay)
	},delay)
})();
