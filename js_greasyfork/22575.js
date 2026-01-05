// ==UserScript==
// @name			Direct Image Link Twitter
// @version			2020.09.24
// @description		Прямые ссылки под эскизами
// @match			http*://twitter.com*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=twitter.com
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/22575/Direct%20Image%20Link%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/22575/Direct%20Image%20Link%20Twitter.meta.js
// ==/UserScript==

var pic, i, link, source;

function linker ( ) {
	pic = document.querySelectorAll ( '.AdaptiveMedia' );
	for ( i = pic.length - 1; i >= 0; --i ) {
		link = document.createElement ( 'a' );
		pic [ i ].appendChild ( link );
		pic [ i ].className = pic [ i ].className.replace ( 'AdaptiveMedia', 'Adapt1veMedia' );
		source = pic [ i ].querySelector ( 'img' ).getAttribute ( 'src' ) + ':large';
		link.setAttribute ( 'href', source );
		link.innerHTML = source;
	}
}
setInterval ( linker, 5000 );
