// ==UserScript==
// @name			Direct URL Webtoons
// @version			2020.04.19.1
// @description		Extract Pic Links
// @include			http*://www.webtoons.com*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=webtoons.com
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/401301/Direct%20URL%20Webtoons.user.js
// @updateURL https://update.greasyfork.org/scripts/401301/Direct%20URL%20Webtoons.meta.js
// ==/UserScript==

var timer = 300,
	imgs, x, img, a,
	nod = document.createElement ( "span" );

//NODE
nod.style = 'font-size: 15px; left: 5px; position: fixed; width: 550px; text-decoration: underline; top: 50px;';
document.querySelector ( "body" ).appendChild ( nod );

//RELOADER
function reloader ( ) {
	nod.innerHTML = '';
	imgs = document.querySelectorAll ( "img._images" );
	for ( x = 0; x < imgs.length; x++ ) {
		img = imgs [ x ].getAttribute ( 'data-url' );
		a = document.createElement ( "a" );
		a.href = img;
		a.innerHTML = img;
		a.style.display = 'block';
		nod.appendChild ( a );
	}
}
setInterval ( reloader, timer );

// HOTKEYS
var prev = document.querySelector ( '.pg_prev' ),
	next = document.querySelector ( '.pg_next' );
if ( prev != null ) prev.accessKey = "z";
if ( next != null ) next.accessKey = "x";

// SELECTION
function selectblock ( name ) {
	var rng = document.createRange ( );
	rng.selectNode ( name );
	var sel = window.getSelection ( );
	sel.removeAllRanges ( );
	sel.addRange ( rng );
}
selectblock ( nod );