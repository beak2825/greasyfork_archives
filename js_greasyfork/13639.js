// ==UserScript==
// @name	HTML5 Player on animespirit.ru with myvi.ru
// @version	0.3.1
// @author	Anonimous
// @namespace	https://greasyfork.org/en/users/16081-lolipop/HTML5animespirit
// @description	HTML5 Player on animespirit.ru with myvi.ru. Показывает видео встроенное с myvi.ru без Flash плеера.
// @include	/^https?\:\/\/(www\.)?animespirit\.ru($|\/.*$)/
// @license      GPL version 3 or any later version; www.gnu.org/licenses/gpl-3.0.en.html
// @grant	none
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/13639/HTML5%20Player%20on%20animespiritru%20with%20myviru.user.js
// @updateURL https://update.greasyfork.org/scripts/13639/HTML5%20Player%20on%20animespiritru%20with%20myviru.meta.js
// ==/UserScript==

/*
 * documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 * https://msdn.microsoft.com/ru-ru/library/dn265034%28v=vs.85%29.aspx
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */

;(function() {

	const flashPreLink = 'http://myvi.ru/player/flash';
	const html5PreLink = 'http://myvi.ru/player/embed/html';
	const target = document.body;
	const config = {
		childList : true,
		attributes : true,
		characterData : true,
		subtree : true
	};
	const videoType = 'application/mpeg';
	const videoTagName = 'object';
	const videoLinkAttrName = 'data';

	let observer = new MutationObserver(function(mutations) {
		
		for (let mutation of mutations) {
			if (mutation.type === 'childList' || mutation.type === 'attributes') {
				replaceByHTML5(mutation.target);
			}
		}

	});

	function replaceByHTML5(node) {
		if (isObject(node)) {
			replaceVideo(node);
		}
		
		let objs = node.getElementsByTagName(videoTagName);
		
		replaceVideos(objs);
	}
	
	function replaceVideos(objs) {
		for (let obj of objs) {
			replaceVideo(obj);
		}
	}
	
	function replaceVideo(obj) {
		if(isVideoObject(obj)) {
			replacePlayer(obj);
		}
	}
	
	function replacePlayer(obj) {
		obj.type = videoType;
		obj.data = (obj.data).replace(flashPreLink, html5PreLink);
	}
	
	function isVideoObject(obj) {
		let isVideoObj = obj.hasAttribute(videoLinkAttrName)
			&& isVideoLink(obj.data);
		
		return isVideoObj;
	}
	
	function isObject(node) {
		let isObj = node.tagName.toLowerCase() === videoTagName;

		return isObj;
	}
				 
	function isVideoLink(data) {
		let linkRegExp = /^https?\:\/\/(www\.)?myvi\.ru\/player\/flash.*/i;
		let isLink = linkRegExp.test(data);
		
		return isLink;
	}

	function run() {
		observer.observe(target, config);
		replaceVideos(document.getElementsByTagName(videoTagName));
	}

	/*
	 * running
	 */
	run();

})();