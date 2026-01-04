// ==UserScript==
// @name GitHub Hide Suggested Repository Name
// @namespace http://userstyles.org
// @description Hides GitHub Suggested Repository Name
// @author 636597
// @match https://*.github.com/new*
// @run-at document-start
// @version 0.4
// @downloadURL https://update.greasyfork.org/scripts/487264/GitHub%20Hide%20Suggested%20Repository%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/487264/GitHub%20Hide%20Suggested%20Repository%20Name.meta.js
// ==/UserScript==

function on_element( query_selector , interval=20 , timeout=10000 ) {
	return new Promise( function( resolve , reject ) {
		try {
			let READY_CHECK_INTERVAL = setInterval( function() {
				let item = document.querySelectorAll( query_selector );
				if ( item ) {
					if ( item[ 0 ] ) {
						clearInterval( READY_CHECK_INTERVAL );
						resolve( item[0] );
						return;
					}
				}
			} , interval );
			setTimeout( function() {
				clearInterval( READY_CHECK_INTERVAL );
				resolve( false );
				return;
			} , timeout );
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}

function hide() {
	document.querySelectorAll('button[aria-label*="suggested"]').forEach(el => el.parentNode.style.display = 'none');
}

function add_css() {
	var sheet = document.createElement('style');
	sheet.innerHTML = 'button[aria-label*="suggested"] {display: none !important}';
	document.body.appendChild(sheet);
}

function add_css_two() {
	let css = 'button[aria-label*="suggested"] {display: none !important;}';
	let head = document.head || document.getElementsByTagName('head')[0];
	let style = document.createElement('style');
	head.appendChild(style);
	style.type = 'text/css';
	if ( style.styleSheet ){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
}

function init( input_element=false ) {
	hide();
	if ( !input_element ) {
		input_element = document.querySelector('input[aria-label="Repository"]');
	}
	input_element.addEventListener('input',hide);
}

( async ()=> {
	add_css();
	add_css_two();
	let x_input = await on_element( 'input[aria-label="Repository"]' );
	init( x_input );
})();