// ==UserScript==
// @name	Google Favicons
// @description	Adds favicons to Google search results.
// @include	https://www.google.*/search*
// @version	1.12
// @grant       GM_addStyle
// @icon        https://i.imgur.com/ezjWmEO.png
// @namespace   https://greasyfork.org/users/14186
// @downloadURL https://update.greasyfork.org/scripts/12395/Google%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/12395/Google%20Favicons.meta.js
// ==/UserScript==

/**
 * [+] CSS INFO
 * #res img.favicon = Normal Results Favicon Position
 * div.action-menu img.favicon = Normal Results Hide Incorrect Sub Google Favicons
 * div#res div#search div#ires div.g div.rc div.r h3 = Normal Results Adjust Title for Favicon room
 * #res div.gG0TJc img.favicon, #res div.card-section a.RTNUJf img.favicon = News Tab Favicon Position
 * #res div.card-section a.RTNUJf img.favicon = News Tab Sub Results Favicon Size
 * [+] QUERY INFO
 * #res .g div.rc div.r a = Normal Results
 * #res div.gG0TJc a = News Tab Header Results
 * #res div.card-section a.RTNUJf = News Tab Sub Results
 */

(function(){

	(typeof GM_addStyle != 'undefined' ? GM_addStyle : function addStyle(css) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement("style");
		style.type = "text/css";
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	})("#res img.favicon {\
        border: none;\
        margin-left: 1px;\
        position: absolute;\
        margin-top: 1px;\
        z-index: 9;\
		}\
		div.action-menu img.favicon {\
        display: none;\
		}\
		div#res div#search div#ires div.g div.rc div.r h3 {\
        text-indent: 26px;\
		}\
		#res div.gG0TJc img.favicon, #res div.card-section a.RTNUJf img.favicon {\
        position: relative;\
        vertical-align: middle;\
        margin-left: 0px;\
        margin-top: 0px;\
        margin-right: 7px;\
        top: -2px;\
		}\
		#res div.card-section a.RTNUJf img.favicon {\
        width: 0.9em;\
        height: 0.9em;\
        padding-bottom: 0px;\
        vertical-align: sub;\
		}\
		");

	var FAVICON_GRABBER = 'https://www.google.com/s2/favicons?domain='; // 'http://favicon.yandex.net/favicon/'
var QUERY = '#res .g div.rc div.r a, #res div.gG0TJc a, #res div.card-section a.RTNUJf';

/**
 * @param {NodeList} links
 */
function add_favicons_to(links) {
	for (var i=0; i<links.length; i++) {
		if (links[i].firstChild.className != 'favicon') {
			var host = links[i].href.replace(/.*https?:\/\//, '').replace(/\/.*$/,'');
			var img = document.createElement('IMG');
			img.src = FAVICON_GRABBER + host;
			img.width = '16';
			img.height = '16';
			img.className = 'favicon';
			links[i].insertBefore(img, links[i].firstChild);
		}
	}
}

add_favicons_to(document.querySelectorAll(QUERY));

/**
 * Debounce function from http://code.google.com/p/jquery-debounce/
 */
function debounce(fn, timeout, invokeAsap, context) {
	if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
		context = invokeAsap;
		invokeAsap = false;
	}
	var timer;
	return function() {
		var args = arguments;
		if(invokeAsap && !timer) {
			fn.apply(context, args);
		}
		clearTimeout(timer);
		timer = setTimeout(function() {
			if(!invokeAsap) {
				fn.apply(context, args);
			}
			timer = null;
		}, timeout);
	};
}

document.addEventListener('DOMNodeInserted', debounce(function handleNewFavicons(event){
		if (event.target.className != 'favicon') {
			add_favicons_to(document.querySelectorAll(QUERY));
		}
	}, 500)
, false);

})();