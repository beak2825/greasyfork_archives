// ==UserScript==
// @name			Direct Image Link Booru.org
// @version			2020.05.22
// @description		Показывает прямые ссылки под эскизами
// @include			http*://*booru.org*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=booru.org
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/400677/Direct%20Image%20Link%20Booruorg.user.js
// @updateURL https://update.greasyfork.org/scripts/400677/Direct%20Image%20Link%20Booruorg.meta.js
// ==/UserScript==

if ( document.querySelector ( 'h1' ).innerHTML == '404 Not Found' ) window.close;

var img = document.querySelectorAll ( "div.thumb img" ),
	nlink, src, x;

if ( img.length > 0 ) {
	for ( x = 0; x < img.length; x++ ) {
		if ( img [ x ].getAttribute ( 'src' ) != null ) {
			src = img [ x ].getAttribute ( 'src' )
				//.split ( '?' ) [ 0 ]
				//.replace ( "thumbnails", "images" )
				//.replace ( "thumbnail_", "" )
				.replace ( "/img/", "/img/view/" )
				.replace ( "/thumb.", "." );
			nlink = document.createElement ( 'a' );
			nlink.setAttribute ( 'href', src );
			nlink.innerHTML = 'Link';
			nlink.style = 'background-color: black; border-radius: 5px; bottom: 26px; color: white; font-weight: bold; height: auto; padding: 2px 5px; position: relative; width: auto;';
			img [ x ].parentNode.appendChild ( nlink );
		}
	}
}
