// ==UserScript==
// @name         DigDig.IO Server Selector
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Server selector for digdig.io. Double click to copy, single click to download.
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428987/DigDigIO%20Server%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/428987/DigDigIO%20Server%20Selector.meta.js
// ==/UserScript==

unsafeWindow.Image = new Proxy( unsafeWindow.Image, {
	construct( target, thisArgs, args ) {

		const result = Reflect.construct( ...arguments );

		result.crossOrigin = 'anonymous';

		return result;

	}
} );

GM_addStyle( `

body {
	margin: 0;
	overflow: hidden;
	font-family: 'Ubuntu';
	text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000;
	color: #fff;
	width: 100vw;
	height: 100vh;
}

.pointer-lock canvas {
	pointer-events: none;
}

.pointer-lock:after {
	content: 'Pointer is locked. Press [X] to unlock.';
	position: absolute;
	left: 50%;
	top: 10px;
	transform: translate(-50%, 0);
	background: rgb(233 30 30 / 60%);
	padding: 2px 5px;
	text-shadow: none;
	z-index: 999;
}

.group {
	position: absolute;
	right: 15px;
	bottom: 15px;
	display: flex;
	flex-direction: column;
}

.group > * {
	margin-bottom: 8px;
}

.group > *:last-child {
	margin-bottom: 0;
}

.btn {
	background: #aeaeae;
	font-size: 2.25em;
	text-align: center;
	padding: 0.2em;
	cursor: pointer;
	box-shadow: inset 0 0 0 0.1em rgba(0, 0, 0, 0.25);
	border-radius: 0.1em;
	position: relative;
	user-select: none;
}

.btn:before {
	content: ' ';
	position: absolute;
	top: 0.1em;
	left: 0.1em;
	width: calc(100% - 0.2em);
	height: calc(100% - 0.2em);
	background: transparent;
}

.btn:hover:before {
	background: hsla(0, 0%, 100%, 0.25);
}

.btn:active:before {
	background: rgba(0, 0, 0, 0.1);
}

.btn i {
	text-shadow: none;
}

[tooltip] {
	position: relative;
}

[tooltip]:after {
	content: attr(tooltip);
	font-size: 0.9rem;
	position: absolute;
	right: 100%;
	top: 50%;
	transform: translate(-10px, -50%);
	white-space: nowrap;
	pointer-events: none;
	background: rgba(0, 0, 0, 0.5);
	padding: 0.25em 0.4em;
	border-radius: 0.2em;
	opacity: 0;
	transition: 0.2s;
	z-index: 999;
}

[tooltip]:not(.disabled):hover:after {
	opacity: 1;
}

[tooltip]:is(.force-tooltip):after {
	opacity: 1 !important;
}

.dialog {
	position: absolute;
	right: 85px;
	bottom: 15px;
	background: #aeaeae;
	padding: 0.75em;
	border-radius: 0.3em;
	box-shadow: inset 0 0 0 0.3em rgba(0, 0, 0, 0.25);
	width: 300px;
	transition: 0.2s;
}

.dialog > * {
	margin-bottom: 5px;
}

.dialog > *:last-child {
	margin-bottom: 0;
}

.dialog.disabled {
	transform: translate(0, calc(100% + 15px));
}

.dialog .btn {
	font-size: 1.25rem;
	background: #bb5555;
}

.title {
	font-size: 1.5em;
	text-align: center;
}

.spinner {
	margin: 10px auto;
	width: 60px;
	height: 60px;
	border: 10px solid transparent;
	border-top-color: rgba(0, 0, 0, 0.3);
	border-radius: 50%;
	animation: spin 0.5s infinite;
}

.option {
	background: rgba(0, 0, 0, 0.1);
	padding: 0.5em 0.75em;
	border-radius: 0.25em;
	cursor: pointer;
}

.option.active {
	box-shadow: inset 0 0 0 0.15em rgba(0, 0, 0, 0.2);
}

@keyframes spin {
	from {
		transform: rotate(0);
	}

	to {
		transform: rotate(360deg);
	}
}

` );

const temp = document.createElement( 'div' );

temp.innerHTML += `

<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
<div class="group">
	<div class="btn leaderboard-btn" tooltip="Capture leaderboard [G]">
		<i class="fa fa-trophy"></i>
	</div>
	<div class="btn screenshot-btn" tooltip="Take screenshot [F]">
		<i class="fa fa-camera"></i>
	</div>
	<div class="btn servers-btn" tooltip="Servers">
		<i class="fa fa-globe"></i>
	</div>
</div>
<div class="dialog disabled">
	<div class="title">Servers</div>
	<div class="spinner"></div>
	<div class="btn refresh-btn">refresh</div>
	<div class="btn close-btn">close</div>
	</div>
</div>

`;

while ( temp.children.length > 0 ) {

	document.body.appendChild( temp.children[ 0 ] );

}

temp.innerHTML = '';

const spinner = document.querySelector( '.spinner' );

let selectedServerId = new URLSearchParams( document.location.search.substring( 1 ) ).get( 'server' );

if ( selectedServerId ) {

	const idFromUrl = selectedServerId;

	const interval = setInterval( function () {

		if ( idFromUrl !== selectedServerId ) {

			clearInterval( interval );

		}

		try {

			connect( idFromUrl );

			clearInterval( interval );

		} catch ( e ) { }

	}, 50 );

}

fetchAll();

async function fetchAll() {

	spinner.style.display = '';

	await fetchServers( 'ffa' );
	await fetchServers( 'teams' );
	await fetchServers( 'tag' );
	await fetchServers( 'br' );
	await fetchServers( 'maze' );

	spinner.style.display = 'none';

}

const serverIds = {};

const refreshBtn = document.querySelector( '.refresh-btn' );

async function fetchServers( mode ) {

	const response = await fetch( 'https://api.n.m28.io/endpoint/digdig-' + mode + '/findEach' );
	const json = await response.json();

	for ( let key in json.servers ) {

		const id = json.servers[ key ].id;

		if ( ! serverIds[ id ] ) {

			serverIds[ id ] = true;

			const div = document.createElement( 'div' );
			div.classList.add( 'option' );
			div.innerHTML = mode + '_' + key.split( '-' )[ 1 ] + '_' + id;
			div.setAttribute( 'data-id', id );

			dialog.insertBefore( div, refreshBtn );

			div.onclick = function () {

				connect( id );

			}

			if ( selectedServerId === id ) {

				div.click();

			}

		}

	}

}

function connect( id ) {

	selectedServerId = id;

	cp6.forceServerID( selectedServerId );

	onServerChange();

}

unsafeWindow.console.log = new Proxy( unsafeWindow.console.log, {
	apply( target, thisArgs, [ text ] ) {

		if ( typeof text === 'string' && text.startsWith( 'Connecting to ' ) ) {

			const id = text.split('Connecting to ')[ 1 ].split( '.' )[ 0 ];

			if ( id !== selectedServerId ) {

				selectedServerId = id;

				onServerChange();

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

function onServerChange() {

	const url = new URL( window.location );
	url.searchParams.set( 'server', selectedServerId );

	history.pushState( {}, document.title, url );

	const active = document.querySelector( '.option.active' );

	if ( active ) {

		active.classList.remove( 'active' );

	}

	const option = document.querySelector( '[data-id="' + selectedServerId + '"]' );

	if ( option ) {

		option.classList.add( 'active' );

	}

}

const dialog = document.querySelector( '.dialog' );
const serversBtn = document.querySelector( '.servers-btn' );

serversBtn.onclick = function () {

	if ( dialog.classList.contains( 'disabled' ) ) {

		dialog.classList.remove( 'disabled' );
		this.classList.add( 'disabled' );

	} else {

		hideDialog();

	}

}

document.body.onclick = function ( event ) {

	if ( [ 'canvas', 'loading' ].indexOf( event.target.id ) > - 1 || event.target === this ) {

		hideDialog();

	}

}

document.querySelector( '.close-btn' ).onclick = hideDialog;

refreshBtn.onclick = fetchAll;

function hideDialog() {

	dialog.classList.add( 'disabled' );
	serversBtn.classList.remove( 'disabled' );

}

function createClickListener( a, b ) {

	let clicks = 0;

	return function () {

		clicks ++;

		setTimeout( function () {

			if ( clicks === 1 ) {

				a();

			}

			clicks = 0;

		}, 300 );

		if ( clicks === 2 ) {

			b();

		}

	}

}

const screenshotBtn = document.querySelector( '.screenshot-btn' );
const leaderboardBtn = document.querySelector( '.leaderboard-btn' );

const displayCopiedScreenshot = createCopiedDisplayer( screenshotBtn );
const displayCopiedLeaderboard = createCopiedDisplayer( leaderboardBtn );

screenshotBtn.onclick = createClickListener(
	function () {

		downloadCanvas( document.querySelector( 'canvas' ), 'digdig' );

	},
	copyScreenshot
);

leaderboardBtn.onclick = createClickListener(
	function () {

		if ( leaderboard ) {

			downloadCanvas( getLeaderboardCanvas(), 'digdig_leaderboard' );

		}

	},
	copyLeaderboard
);

function copyScreenshot() {

	copyCanvasToClipboard( document.querySelector( 'canvas' ) );

	displayCopiedScreenshot();

}

function copyLeaderboard() {

	if ( leaderboard ) {

		copyCanvasToClipboard( getLeaderboardCanvas() );

		displayCopiedLeaderboard();

	}

}

window.addEventListener( 'keyup', function ( event ) {

	const key = String.fromCharCode( event.keyCode );

	if ( key === 'F' ) {

		copyScreenshot();

	} else if ( key === 'G' ) {

		copyLeaderboard();

	} else if ( key === 'X' ) {

		document.body.classList.toggle( 'pointer-lock' );

	}

} );

function createCopiedDisplayer( element ) {

	let old, timeout;

	return function () {

		if ( element.classList.contains( 'force-tooltip' ) ) {

			clearTimeout( timeout );

		} else {

			old = element.getAttribute( 'tooltip' );
			element.setAttribute( 'tooltip', 'Copied!' );
			element.classList.add( 'force-tooltip' );

		}

		timeout = setTimeout( function () {

			element.setAttribute( 'tooltip', old );
			element.classList.remove( 'force-tooltip' );

		}, 1000 );

	}

}


function getLeaderboardCanvas() {

	const offset = - 115 * 0.8 * 0;

	const canvas = document.createElement( 'canvas' );

	canvas.width = leaderboard.width;
	canvas.height = leaderboard.height + offset;

	canvas.getContext( '2d' ).drawImage( leaderboard, 0, offset );

	return canvas;

}

function copyCanvasToClipboard( canvas ) {

	canvas.toBlob( function ( blob ) {

		navigator.clipboard.write( [ new ClipboardItem( { 'image/png': blob } ) ] );

	} );

}

function downloadCanvas( canvas, filename ) {

	const a = document.createElement( 'a' );

	a.href = canvas.toDataURL();
	a.download = filename + '_' + Date.now() + '.png';

	a.click();

}

let leaderboard;
let leaderboardPartial;

const Canvas = unsafeWindow.OffscreenCanvas ? unsafeWindow.OffscreenCanvas.prototype : unsafeWindow.HTMLCanvasElement.prototype;

Canvas.getContext = new Proxy( Canvas.getContext, {
	apply() {

		const ctx = Reflect.apply( ...arguments );

		ctx.fillText = new Proxy( ctx.fillText, {
			apply( target, thisArgs, args ) {

				if ( args[ 0 ].indexOf( 'Diggers' ) > - 1 ) {

					leaderboardPartial = ctx.canvas;

				}

				return Reflect.apply( ...arguments );

			}
		} );

		ctx.drawImage = new Proxy( ctx.drawImage, {
			apply( target, thisArgs, args ) {

				if ( args[ 0 ] === leaderboardPartial ) {

					leaderboard = ctx.canvas;

				}

				return Reflect.apply( ...arguments );

			}
		} );

		return ctx;

	}
} )