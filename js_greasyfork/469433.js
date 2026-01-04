// ==UserScript==
// @name          Lichess Puzzle Auto-Zen Mode
// @namespace     http://userstyles.org
// @description   Automatically Enters Zen Mode in Puzzle Training
// @author        636597
// @include       *://*lichess.org/training*

// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/469433/Lichess%20Puzzle%20Auto-Zen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/469433/Lichess%20Puzzle%20Auto-Zen%20Mode.meta.js
// ==/UserScript==

function sleep( ms ) { return new Promise( resolve => setTimeout( resolve , ms ) ); }

function hide_puzzle_info() {
	try{
		var styles = `
			a[href^="/training/"]  { visibility: hidden !important; }
			a[href^="/@/"]  { visibility: hidden !important; }
			div.infos.puzzle { visibility: hidden !important; }
		`;
		var styleSheet = document.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
	}
	catch(e) {
		console.log( e );
	}
}

function click_fucking_menu_button() {
	return new Promise( function( resolve , reject ) {
		try {
			// select the button
			console.log( "click_fucking_menu_button()" );
			let button = document.querySelector( 'button.board-menu-toggle' );
			console.log( button );
			let events = [ 'mouseover' , 'mousedown' , 'mouseup' , 'click' ];
			events.forEach( ( eventName ) => {
				let event = new MouseEvent( eventName, {
					bubbles: true ,
					cancelable: false ,
				});
				try { button.dispatchEvent( event ); }
				catch( e ) { console.log( e ); }
			});
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}

function click_fucking_zen_button() {
	return new Promise( function( resolve , reject ) {
		try {
			// select the button
			console.log( "click_fucking_zen_button()" );
			let button = document.querySelector( 'div.abset-zen' );
			console.log( button );
			button = button.querySelectorAll( "input" )[ 0 ];
			console.log( button );
			let events = [ 'mouseover' , 'mousedown' , 'mouseup' , 'click' ];
			events.forEach( ( eventName ) => {
				let event = new MouseEvent( eventName, {
					bubbles: true ,
					cancelable: false ,
				});
				try { button.dispatchEvent( event ); }
				catch( e ) { console.log( e ); }
			});
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}

function on_element_to_exist( query_selector , timeout=10000 , check_interval=500 ) {
	return new Promise( function( resolve , reject ) {
		try {
			let READY_CHECK_INTERVAL = setInterval( function() {
				let item = document.querySelectorAll( query_selector );
				if ( item ) {
					if ( item[ 0 ] ) {
						clearInterval( READY_CHECK_INTERVAL );
						resolve( item[ 0 ] );
						return;
					}
				}
			} , check_interval );
			setTimeout( function() {
				clearInterval( READY_CHECK_INTERVAL );
				resolve( false );
				return;
			} , timeout );
		}
		catch( error ) { console.log( error ); resolve( false ); return; }
	});
}

( async ()=> {
	window.addEventListener ( "load" , hide_puzzle_info );
	hide_puzzle_info();
	await on_element_to_exist( "button.board-menu-toggle" );
	let menu_button = document.querySelector( "button.board-menu-toggle" );
	// await sleep( 1000 );
	await click_fucking_menu_button();
	// await sleep( 1000 );
	await on_element_to_exist( "div.abset-zen" )
	await click_fucking_zen_button();
})();