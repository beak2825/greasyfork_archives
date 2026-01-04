// ==UserScript==
// @name         SO-ify Chat
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Style SE chat like SO
// @author       amflare
// @match        https://chat.stackexchange.com/*
// @grant
// @downloadURL https://update.greasyfork.org/scripts/34036/SO-ify%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/34036/SO-ify%20Chat.meta.js
// ==/UserScript==
    
(function() {
	'use strict';

	// Replace CSS With SO Style Sheet
	$("link[rel='stylesheet']").attr('href','https://cdn-chat.sstatic.net/chat/css/chat.stackoverflow.com.css?v=ed51c363e03e');

	// Replace Foot Logo
	$('#footer-logo img').attr('src' ,'https://cdn.sstatic.net/Sites/stackoverflow/img/logo.png?v=da');

	// Replace Favicon
	$("link[rel='shortcut icon']").attr('href','https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d');

	//Remove Background Image
	$('#container').attr('style', 'background:none!important;');

	// Change Site Name in Browser Tab
	var title = $('title').text().split(" - ")[0];
	$('title').text(title+' - Stack Overflow')
})();