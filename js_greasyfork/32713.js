// ==UserScript==
// @name           nhentai pop-under remover
// @description    Disables annoing window that opens after clicking anywhere on page.
// @include        http://*.nhentai.net/*
// @include        https://nhentai.net/*
// @version 0.0.1.20170830102918
// @namespace https://greasyfork.org/users/150965
// @downloadURL https://update.greasyfork.org/scripts/32713/nhentai%20pop-under%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/32713/nhentai%20pop-under%20remover.meta.js
// ==/UserScript==

(function() {
	var html = document.documentElement.innerHTML;
	html.replace('show_popunders: true','show_popunders: false');
	document.documentElement.innerHTML = html;
})();