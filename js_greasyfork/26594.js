// ==UserScript==
// @name        HoFF - Facebook Chat Offline Hide
// @namespace   hoff
// @include     https://www.facebook.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1.3
// @description Hides the Offline users from the Facebook Chat
// @downloadURL https://update.greasyfork.org/scripts/26594/HoFF%20-%20Facebook%20Chat%20Offline%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/26594/HoFF%20-%20Facebook%20Chat%20Offline%20Hide.meta.js
// ==/UserScript==
var callback = function () {
	console.log("HoFF Started :).");
	setInterval(function () {
		var get_chat_list = document.getElementsByClassName('_42fz');
		var chat_list = Array.prototype.slice.call(get_chat_list);
		for (index = 0; index < chat_list.length; index++) {
			var found = chat_list[index].getElementsByTagName('span');
			if (found.length === 0) {
				console.log(found);
				chat_list[index].hidden = true;
			}
		}
	}, 5000);
};

if (
document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
	callback();
} else {
	document.addEventListener("DOMContentLoaded", callback);
}