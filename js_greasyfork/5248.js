// ==UserScript==
// @name           Nyanpasu Mention Sound for plug.dj
// @description    Creates plug.dj Nyanpasu mention sound.
// @author         Edited by Uri
// @include        https://plug.dj/*
// @version        1.0
// @namespace https://greasyfork.org/users/5564
// @downloadURL https://update.greasyfork.org/scripts/5248/Nyanpasu%20Mention%20Sound%20for%20plugdj.user.js
// @updateURL https://update.greasyfork.org/scripts/5248/Nyanpasu%20Mention%20Sound%20for%20plugdj.meta.js
// ==/UserScript==
/**
 *  * CHAT EVENT :
 *   * AutoNotice
 *    ** Method :
 *     ** copy/paste the entire script into the Firefox Console
 *      ** about:config -> security.mixed_content.block_active_content = false
 *       */
(function(){
	var autoNotice;

	var ownUserName = API.getUser().username;
	var loadedSound = new Audio(decodeURIComponent("http://nyanpass.com/nyanpass.ogg"));
	function analyseChat(chat){
		var message = chat.message;
		var username = chat.un;
		var type = chat.type;
		var uid = chat.uid;
		var cid = chat.cid;
		var timestamp = chat.timestamp;

		if(message.match("@" + ownUserName))
		{
			// AutoNotice
			autoNotice && loadedSound.play();
		}
	}

	/**
	* Chat API
	*/
	function refreshAPIStatus()
	{
		API.off(API.CHAT);
		autoNotice && API.on(API.CHAT, analyseChat);
	}
	function startAutoNotice(){
		autoNotice = true;
		refreshAPIStatus();
	}
	function stopAutoNotice(){
		autoNotice = false;
		refreshAPIStatus();
	}
	startAutoNotice();
})();