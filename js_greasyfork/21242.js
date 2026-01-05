// ==UserScript==
// @name        Furvilla - User Links
// @namespace   Shaun Dreclin
// @description Adds some useful link icons in your user info area.
// @include     /^https?://www\.furvilla\.com/.*$/
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21242/Furvilla%20-%20User%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/21242/Furvilla%20-%20User%20Links.meta.js
// ==/UserScript==

if(document.querySelector(".user-info")) {
	var userLink = document.querySelector(".user-info h4 a").href;
	var userID = userLink.split("/").pop();
	
	document.querySelector(".user-info").innerHTML += '<div style="position: absolute; top: 185px; left: 47px;">' +
	'<a href="http://www.furvilla.com/stall/manage"><i class="fa fa-shopping-cart" style="padding: 5px;"></i></a>' +
	'<a href="http://www.furvilla.com/inventory/quickstock"><i class="fa fa-list" style="padding: 5px;"></i></a>' +
	'<a href="http://www.furvilla.com/menagerie/' + userID + '"><i class="fa fa-paw" style="padding: 5px;"></i></a>' +
	'<a href="http://www.furvilla.com/forums/posts/recent/' + userID + '"><i class="fa fa-reply-all" style="padding: 5px;"></i></a>' +
	'<a href="http://www.furvilla.com/forums/threads/recent/' + userID + '"><i class="fa fa-quote-left" style="padding: 5px;"></i></a>' +
	'</div>';
}
