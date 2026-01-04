// ==UserScript==
// @name Yandex.Card userscript
// @description Добавит Яндекс.Карточку на все сайты. Использовать вместо расширения.
// @author NeoCortex
// @license MIT
// @version 0.1.
// @include *://*
// @run-at document-end
// @namespace https://greasyfork.org/users/12790
// @downloadURL https://update.greasyfork.org/scripts/37179/YandexCard%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/37179/YandexCard%20userscript.meta.js
// ==/UserScript==
(function (window, undefined) {
	var uri = 'https://static.yandex.net/yobject/v2/_/loader.js';
	if((document.querySelector('script[src="' + uri + '"]') !== null) ||
       (typeof window.ya !== 'undefined')) return false;

	var x = document.createElement('script');
	x.src = uri;
	document.body.appendChild(x);

	if ('loading' == document.readyState) {
	  alert("YaCard: \"@run-at document-end\" doesn't work, using fallback...");
	  window.onload = function(){ ya.yobject.load(document.body); };
	} else {
	  setTimeout(function() {
		  try { ya.yobject.load(document.body); }
		  catch(e) { window.onload = function(){ ya.yobject.load(document.body); }; }
		}, 100);
	}
})(window);