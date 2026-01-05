// ==UserScript==
// @name            VK-friends-parser
// @version         0.3
// @description     Parsing "vk-friends" page
// @author          Max Donchenko (https://github.com/goodwin64/)
// @match           http://tampermonkey.net/
// @include         https://vk.com/*
// @name:ru
// @namespace https://greasyfork.org/users/25920
// @downloadURL https://update.greasyfork.org/scripts/16837/VK-friends-parser.user.js
// @updateURL https://update.greasyfork.org/scripts/16837/VK-friends-parser.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.onload = function parse(){
        var globalFriendsMap = globalFriendsMap || {};
	var friends = document.getElementsByClassName("user_block clear_fix");
	var friendsCount = 27;

	for (var i = 0; i < friendsCount; i++){
		var friend = friends[i];
		var avatar = friend.getElementsByClassName("friends_photo_img")[0].src;
		var friendFullName = friend.getElementsByClassName("friends_field")[0].childNodes[0].text.split(" ");
		var friendName = friendFullName[0];
		var friendSurname = friendFullName[1];
		var link = friend.getElementsByClassName("friends_act")[0].href; // https://vk.com/write12345678
		var id = link.slice( link.indexOf("write") + 5 );
		globalFriendsMap[id] = [friendName, friendSurname, avatar, link];
	}

	return globalFriendsMap;
};