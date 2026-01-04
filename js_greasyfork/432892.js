// ==UserScript==
// @name			Direct Image Link E621/926 Silent
// @version			2021.09.24.1
// @description:en	Images direct links ripper for pages with search results (silent version)
// @description		Рипалка ссылок в результатах поиска, для менеджеров закачки (тихий вариант)
// @include			http*://e621.net/posts*
// @include			http*://e926.net/posts*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=e621.net
// @grant			GM_setClipboard
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/432892/Direct%20Image%20Link%20E621926%20Silent.user.js
// @updateURL https://update.greasyfork.org/scripts/432892/Direct%20Image%20Link%20E621926%20Silent.meta.js
// ==/UserScript==

var prevs = document . querySelectorAll ( '.post-preview' ),
	txt = document . createTextNode ( '' ),
	x, src, md5, link, name,
	lever = 0; // 1 - pic source, 0 - file name

if ( prevs != null ) {
	for ( x = 0; x < prevs . length; x++ ) {
		src = prevs [ x ] . getAttribute ( 'data-file-url' );
		md5 = src . split ( '/' );
		name = md5 [ md5 . length - 1 ];
		md5 = name . split ( '.' ) [ 0 ];

		txt . textContent += ( lever ? src : name ) + '\n'; /* select link */

		link = document . createElement ( 'a' ); /* thumb link */
		link . setAttribute ( 'href', src );
		link . innerHTML = md5;
		link . style = 'word-wrap: anywhere;';
		prevs [ x ] . appendChild ( link );

	}
	GM_setClipboard ( txt . textContent, "text" );
}
