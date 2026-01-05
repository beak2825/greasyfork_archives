// ==UserScript==
// @name        Aliexpress No Auto Translate
// @name:ru     Aliexpress No Auto Translate
// @description Aliexpress disable auto translate in title and description
// @description:ru Отключение автоматического перевода названия и описания товара на Алиэкспресс
// @namespace   http://aliexpress.com
// @author      Sendyx
// @version     2.01
// @grant       none
// @include     http://*
// @include     https://*
// @downloadURL https://update.greasyfork.org/scripts/16430/Aliexpress%20No%20Auto%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/16430/Aliexpress%20No%20Auto%20Translate.meta.js
// ==/UserScript==
(function () {
	function rwLink(link) {
		var url = link.href;
		if (url.indexOf('ru.aliexpress.com') >  - 1 || url.indexOf('pt.aliexpress.com') >  - 1 || url.indexOf('es.aliexpress.com') >  - 1 || url.indexOf('id.aliexpress.com') >  - 1 || url.indexOf('fr.aliexpress.com') >  - 1) {
			if (url.indexOf('.aliexpress.com/item/') >  - 1 || url.indexOf('.aliexpress.com/store/product/') >  - 1) {
				if (url.indexOf('isOrigTitle') ==  - 1 && url.indexOf('isOrig') ==  - 1) {
					if (url.indexOf('?') >  - 1) {
						link.href = url.replace('?', '?isOrigTitle=true&isOrig=true&');
					} else if (url.indexOf('#') >  - 1) {
						link.href = url.replace('#', '?isOrigTitle=true&isOrig=true#');
					} else {
						link.href += '?isOrigTitle=true&isOrig=true';
					}
				}
			}
		}
	}
	rwLink(location);
	function rwaSimple() {
		var links = document.getElementsByTagName('a');
		for (var i = 0; i < links.length; ++i)
			rwLink(links[i]);
	}
	(function () {
		document.addEventListener('DOMNodeInserted', function (event) {
			var node = event.target;
			if (node instanceof HTMLAnchorElement)
				rwLink(node);
			var links = node.getElementsByTagName('a');
			for (var i = 0; i < links.length; ++i)
				rwLink(links[i]);
		}, false);
	})();
	rwaSimple();
})();