// ==UserScript==
// @name           Pokec.sk - zvyraznenie sprav od priatelov
// @namespace      http://
// @description    Zvyraznenie sprav na skle od uzivatelov v zozname priatelov. Spravy su zvyraznene malou ikonkou vedla casu odoslania spravy.
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant          GM_addStyle
// @author         MaxSVK
// @version        1.1
// @date           2014-July-27
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/3680/Pokecsk%20-%20zvyraznenie%20sprav%20od%20priatelov.user.js
// @updateURL https://update.greasyfork.org/scripts/3680/Pokecsk%20-%20zvyraznenie%20sprav%20od%20priatelov.meta.js
// ==/UserScript==

/* ********** Get list of friends ******************************************* */

var friends = new Array();

function setFriend(friend) {
	friends.push(friend);
}

$.getFriends = function(i9, args) {
	args = $.extend({
		url: "/moji-priatelia?i9=" + i9,
		type: "GET",
		data: null,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: false,
		success: function(result) {
			var arrayOfFriendObjects = result.friends;
			for(var i = 0; i < arrayOfFriendObjects.length; i++)
			{
				setFriend(arrayOfFriendObjects[i][1]);
			}
		}
	}, args);
	return $.ajax(args);
};

var userIdentification = unsafeWindow.i9;

$.getFriends(userIdentification);

/* ********** Add new CSS *************************************************** */

var style = "";

for(var i = 0; i < friends.length; i++) {
	style += 'div[data-azetid="' + friends[i] + '"] .cas';
	if (i + 1 < friends.length) {
		style += ', ';
	}
}

style += '\n{text-align:left !important; width: 100% !important; height: 16px !important; background: rgba(0, 0, 0, 0) -30px -3908px no-repeat scroll url("http://s.aimg.sk/pokec_base/css/kabaty/kabat1/sprite_32px.gif?v=4") !important;}';
GM_addStyle(style);