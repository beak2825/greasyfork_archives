// ==UserScript==
// @name        Redir from infopolk.ru
// @namespace   https://greasyfork.org/ru/scripts/20978-redir-from-infopolk-ru
// @description Форвард статьи из iframe наверх
// @include     http://infopolk.ru/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20978/Redir%20from%20infopolkru.user.js
// @updateURL https://update.greasyfork.org/scripts/20978/Redir%20from%20infopolkru.meta.js
// ==/UserScript==

(function(){
	var fr=document.getElementsByTagName('iframe')
	if (fr.length >= 1)
		window.location.href=fr[0].src
})();
