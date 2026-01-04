// ==UserScript==
// @name	       Flash to HTML5 [animespirit.ru, anidream.net]
// @name:en        Flash to HTML5 [animespirit.ru, anidream.net]
// @version	       1.0.1
// @author	       Iron_man
// @namespace	   https://greasyfork.org/users/136230
// @description    HTML5 плеер для myvi.ru видео на сайтах animespirit.ru и anidream.net
// @description:en HTML5 Player for myvi.ru videos on animespirit.ru and anidream.net
// @include        *://anidream.net/*
// @include		   *://animespirit.ru/*
// @include		   *://*.animespirit.ru/*
// @grant	       none
// @run-at	       document-end
// @downloadURL https://update.greasyfork.org/scripts/38064/Flash%20to%20HTML5%20%5Banimespiritru%2C%20anidreamnet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/38064/Flash%20to%20HTML5%20%5Banimespiritru%2C%20anidreamnet%5D.meta.js
// ==/UserScript==

(function(){
	'use strict';
	var MutationObserver = window.MutationObserver || window.WebkitMutationObserver;
	var config = {
		'childList': true,
		'subtree': true,
	};
	var observer = new MutationObserver( callback );
	observer.observe($('body'), config);
	function callback(mutationList)
	{
		for( var i = 0, len = mutationList.length; i < len; ++i )
			replaceByHTML5( mutationList[i].target );
	}
	function replaceByHTML5( element )
	{
		var object = $('object[data*="myvi.ru/player/flash"]', element),
			iframe = $('iframe[src*="anidream.net/php/myvi.php"]', element);
		if( object )
		{
			var source = $attr(object, 'data').replace(/player\/flash/, 'player/embed/html');
			$attr(object, {
				'data': source.replace(/^http\:/, 'https:'),
				'type': 'application/mpeg',
			});
		}
		else if( iframe )
		{
			var videoid = getURL(iframe.src, 'search');
			videoid = decodeURIComponent(videoid.slice(1));
			iframe.src = 'https://myvi.ru/player/embed/html/' + videoid;
		}
	}
	function $(selector, element){return (element||document).querySelector(selector);}
	function $attr(element, attributes)
	{
		if( typeof attributes == 'string' )
			return element.getAttribute(attributes);
		for( var key in attributes )
			element.setAttribute(key, attributes[key]);
	}
	function getURL( url, property )
	{
		var a = document.createElement('a');
		a.href = url;
		return a[property || 'href'];
	}
})();