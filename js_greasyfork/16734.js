// ==UserScript==
// @name        Aliexpress remove localized links
// @name:ru     Aliexpress remove localized links
// @description Remove localized links to Aliexpress and replaces them to English site
// @description:ru Удаляет ссылки с переводом на Aliexpress и заменяет их на английские
// @namespace   http://aliexpress.com
// @author      Sendyx
// @version     2.1
// @grant       none
// @include	http://*
// @include	https://*
// @downloadURL https://update.greasyfork.org/scripts/16734/Aliexpress%20remove%20localized%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/16734/Aliexpress%20remove%20localized%20links.meta.js
// ==/UserScript==
(function () {
	function rwLink(link) {
		var url = link.href;
		if (url.indexOf('aliexpress.ru') >  - 1 || url.indexOf('ru.aliexpress.com') >  - 1 || url.indexOf('pt.aliexpress.com') >  - 1 || url.indexOf('es.aliexpress.com') >  - 1 || url.indexOf('id.aliexpress.com') >  - 1 || url.indexOf('fr.aliexpress.com') >  - 1) {
			if (url.indexOf('ru.aliexpress.com') >  - 1) {
				link.href = url.replace('ru.aliexpress.com', 'aliexpress.com');
			} else if (url.indexOf('aliexpress.ru') >  - 1) {
				link.href = url.replace('aliexpress.ru', 'aliexpress.com');	
			} else if (url.indexOf('pt.aliexpress.com') >  - 1) {
				link.href = url.replace('pt.aliexpress.com', 'aliexpress.com');
			} else if (url.indexOf('es.aliexpress.com') >  - 1) {
				link.href = url.replace('es.aliexpress.com', 'aliexpress.com');
			} else if (url.indexOf('id.aliexpress.com') >  - 1) {
				link.href = url.replace('id.aliexpress.com', 'aliexpress.com');
			} else {
				link.href = url.replace('fr.aliexpress.com', 'aliexpress.com');
			}
		}
	}

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