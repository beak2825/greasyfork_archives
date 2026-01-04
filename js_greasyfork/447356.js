// ==UserScript==
// @name        ChessBotPy
// @namespace   ChessBotPy
// @match       *://lichess.org/*
// @match       *://www.chess.com/*
// @match       *://chess24.com/*
// @match       *://gameknot.com/*
// @match       *://arena.myfide.net/*
// @grant       none
// @inject-into content
// @require     https://cdn.jsdelivr.net/npm/vue@2.6.11
// @version     12.0
// @author      FallDownTheSystem
// @description ChessBotPy Client
// @downloadURL https://update.greasyfork.org/scripts/447356/ChessBotPy.user.js
// @updateURL https://update.greasyfork.org/scripts/447356/ChessBotPy.meta.js
// ==/UserScript==

// Global state
let numOfMoves = -1;
let fen = '';
let uid = uuidv4();
let ws = null;
let app = null;
let popup = null;
let host = window.location.host;
let origin = window.location.origin;
const WHITE = 1;
const BLACK = 0;

if (host === 'www.chess.com') {
	window.document.domain = 'chess.com';
}

// A new window is opened to allow a websocket connection, since the main page has a restricted CSP
// this is just an alias to the document object of the main window
let doc = window.document;
if (window.opener != null) {
	doc = window.opener.document;
}

let siteMap = {
	'lichess.org': {
		movesSelector: '.rmoves, .tview2',
		sanSelector: 'm2, move',
		overlaySelector: '.cg-wrap',
		analysisSelector: '.analyse__tools',
		sideFinder: () => (doc.querySelector('.orientation-white') != null ? WHITE : BLACK)
	},
	'www.chess.com': {
		movesSelector:
			'.vertical-move-list-component, .horizontal-move-list-component, .computer-move-list, .move-list-controls-component, .move-list-component',
		sanSelector: '.move-text-component, .gotomove, .move-list-controls-move, .move-component, .move-text',
		overlaySelector: '#chessboard_boardarea, .board-layout-chessboard, .board-board',
		analysisSelector: '.with-analysis, .with-analysis-collapsed',
		sideFinder: () => (doc.querySelector('.board-player-default-bottom.board-player-default-black') != null ? BLACK : WHITE)
	},
	'chess24.com': {
		movesSelector: '.Moves',
		sanSelector: '.move',
		overlaySelector: '.chess-board > .svg',
		analysisSelector: '.with-analysis',
		sideFinder: () => (doc.querySelector('.bottom .playerInfo.black') != null ? BLACK : WHITE)
	},
	'gameknot.com': {
		movesSelector: '#chess-board-moves, #game-board-moves',
		sanSelector: '.fig-all',
		overlaySelector: '#chess-board-acboard, #game-board-acboard',
		analysisSelector: '.with-analysis',
		sideFinder: () =>
			doc.querySelector('#chess-board-my-side-color .player_white, #game-board-my-side-color .player_white') != null ? WHITE : BLACK
	},
	'arena.myfide.net': {
		movesSelector: '.notifications__table',
		sanSelector: '.notifications__move',
		overlaySelector: '.cg-board',
		analysisSelector: '.analyse__tools',
		sideFinder: () => (doc.querySelector('.orientation-white') != null ? WHITE : BLACK)
	}
};

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
	);
}

function hotkey(e) {
	if (!e.altKey) {
		return;
	}
	switch (e.code) {
		case 'KeyW':
			if (app.playingAs !== WHITE) {
				console.log('Playing as white');
				app.playingAs = 1;
				ws.send(JSON.stringify({ type: 'setting', data: { key: 'side', value: 1 } }));
			}
			break;
		case 'KeyQ':
			if (app.playingAs != BLACK) {
				console.log('Playing as black');
				app.playingAs = 0;
				ws.send(JSON.stringify({ type: 'setting', data: { key: 'side', value: 0 } }));
			}
			break;
		case 'KeyA':
			if (!app.running) {
				console.log('Resuming');
				app.running = true;
				ws.send(JSON.stringify({ type: 'setting', data: { key: 'running', value: true } }));
			}
			break;
		case 'KeyS':
			if (app.running) {
				console.log('Stopping');
				app.running = false;
				ws.send(JSON.stringify({ type: 'setting', data: { key: 'running', value: false } }));
			}
			break;
		default:
			break;
	}
}

function updateSide() {
	let side = siteMap[host].sideFinder();
	if (app.playingAs !== side) {
		app.playingAs = side;
		console.log('Starting as', side == 0 ? 'black' : 'white');
		ws.send(JSON.stringify({ type: 'setting', data: { key: 'side', value: side } }));
	}
}

function parseLAN(LAN, turn) {
	let moves = LAN.split('-');
	if (moves.length == 1) {
		moves = LAN.split('x');
	}

	[from, to] = moves;

	// Long castles (O-O-O)
	if (moves.length == 3) {
		if (turn == WHITE) {
			return { from: 'e1', to: 'c1' };
		}
		return { from: 'e8', to: 'c8' };
	}

	// Short castles
	if (from.toLowerCase() == 'o') {
		if (turn == WHITE) {
			return { from: 'e1', to: 'g1' };
		}
		return { from: 'e8', to: 'g8' };
	}

	return { from: from.slice(-2), to: to.slice(0, 2) };
}

function range(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx);
}

function squareToPos(square, size) {
	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const ranks = range(1, 8);

	app.playingAs == WHITE ? ranks.reverse() : files.reverse();

	let [file, rank] = square.split('');
	rank = parseInt(rank);

	const x = files.indexOf(file);
	const y = ranks.indexOf(rank);

	const squareSize = size / 8;

	return [squareSize * x + squareSize / 2, squareSize * y + squareSize / 2];
}

function drawPieceOnlyOverlay({ width, height, top, left }) {
	let span = doc.createElement('span');
	span.innerText = app.bestPiece;
	span.id = 'py-overlay';
	span.style.position = 'absolute';
	span.style.zIndex = '99999';
	span.style.pointerEvents = 'none';
	span.style.top = top + height + 8 + 'px';
	span.style.left = left + width / 3 + 'px';
	span.style.width = 200 + 'px';
	span.style.height = 100 + 'px';
	span.style.color = 'white';
	span.style.fontSize = '16px';
	span.style.textShadow = '0px 0px 5px #000';
	span.style.marginTop = '4px';
	doc.body.appendChild(span);
}

function drawOnScreen() {
	let existing = doc.getElementById('py-overlay');
	if (existing) {
		existing.remove();
	}

	if (!app.drawOverlay) {
		return;
	}

	let boardElement = doc.querySelector(siteMap[host].overlaySelector);
	let rect = boardElement.getBoundingClientRect();
	let { width, height, top, left } = rect;

	if (app.pieceOnly) {
		drawPieceOnlyOverlay(rect);
		return;
	}

	let svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.id = 'py-overlay';
	svg.style.position = 'absolute';
	svg.style.zIndex = '99999';
	svg.style.pointerEvents = 'none';
	svg.style.width = width + 'px';
	svg.style.height = height + 'px';
	svg.style.top = top + 'px';
	svg.style.left = left + 'px';
	svg.setAttribute('width', width);
	svg.setAttribute('height', width);

	let turn = +app.turn;
	let lanMoves = app.pvs.map((x) => x.lan);
	let lanPV = lanMoves[app.selectedPV - 1];

	if (lanPV && lanPV.length > 0) {
		drawArrow(svg, lanPV[0], turn, width);
	}

	if (lanPV && lanPV.length > 1) {
		drawArrow(svg, lanPV[1], (turn + 1) % 2, width);
	}

	doc.body.appendChild(svg);
}

function drawArrow(svg, move, turn, size) {
	colors = {
		0: 'hsla(350, 100%, 50%, 0.66)', // BLACK
		1: 'hsla(145, 100%, 50%, 0.66)' // WHITE
	};

	const squareSize = size / 8;

	let marker = doc.createElementNS('http://www.w3.org/2000/svg', 'marker');
	marker.id = 'triangle' + turn;
	marker.setAttribute('viewBox', '0 0 20 20');
	marker.setAttribute('refX', '0');
	marker.setAttribute('refY', '5');
	marker.setAttribute('markerUnits', 'strokeWidth');
	marker.setAttribute('markerWidth', squareSize / 12);
	marker.setAttribute('markerHeight', squareSize / 12);
	marker.setAttribute('orient', 'auto');
	marker.setAttribute('fill', colors[turn]);

	let path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'M 0 0 L 7.5 5 L 0 10 z');
	marker.appendChild(path);

	svg.appendChild(marker);

	let { from, to } = parseLAN(move, turn);
	[x1, y1] = squareToPos(from, size);
	[x2, y2] = squareToPos(to, size);

	const xDist = x2 - x1;
	const yDist = y2 - y1;
	const dist = Math.sqrt(xDist * xDist + yDist * yDist);
	const newDist = dist - squareSize * (2 / 5);
	const scale = newDist / dist;

	x2 = x1 + xDist * scale;
	y2 = y1 + yDist * scale;

	let line = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', x1);
	line.setAttribute('y1', y1);
	line.setAttribute('x2', x2);
	line.setAttribute('y2', y2);
	line.setAttribute('marker-end', `url(#triangle${turn})`);
	line.setAttribute('stroke', colors[turn]);
	line.setAttribute('stroke-width', squareSize / 6);
	// line.setAttribute('stroke-linecap', 'round');
	svg.appendChild(line);
}

const findGame = async () => {
	await waitForElement(siteMap[host].sanSelector, 1);
	// Get the side you're plaing as
	updateSide();
	let boardSize = 0;
	console.log('Starting loop');
	while (true) {
		await sleep(50);

		// Force resizing because sometimes elements are dynamic and event listeners get broken
		let boardElement = doc.querySelector(siteMap[host].overlaySelector);
		if (boardElement) {
			let newBoardSize = boardElement.getBoundingClientRect().width;
			if (newBoardSize != boardSize) {
				boardSize = newBoardSize;
				drawOnScreen();
			}
		}
		// Handle getting FEN directly
		if (host === 'lichess.org') {
			let fenput = doc.querySelector('.analyse__underboard__fen');
			if (fenput != null) {
				if (fenput.value != fen) {
					fen = fenput.value;
					console.log('Sending updated FEN.');
					ws.send(JSON.stringify({ type: 'fen', data: fen }));
				}
				continue;
			}
		}
		// Get moves through SAN
		let moves = [...doc.querySelectorAll(siteMap[host].sanSelector)].map((x) => cleanse(x.innerText)).filter((x) => x != '');

		if (host == 'arena.myfide.net') {
			moves = [...doc.querySelectorAll(siteMap[host].sanSelector)].map((x) => cleanse(parseFideSAN(x))).filter((x) => x != '');
		}

		// Number of moves changed, update all the things!
		if (moves.length != numOfMoves) {
			if (moves.length < 2 || (host == 'lichess.org' && doc.location.pathname.startsWith('/training'))) {
				updateSide();
			}
			numOfMoves = moves.length;
			console.log('Sending updated moves.');
			ws.send(JSON.stringify({ type: 'moves', data: moves }));
		}
	}
};

const cleanse = (x) => {
	chars = ['↵', '✓', '1-0', '0-1', '1/2-1/2', '\n', /\[+-][0-9.]+/];
	for (let c of chars) {
		x = x.replace(c, '');
	}
	return x.trim();
};

const parseFideSAN = (x) => {
	let innerText = x.innerText;
	if (innerText.includes('0-0')) {
		innerText = innerText.replace(/0/g, 'O');
	}
	const img = x.querySelector('img');
	if (img == null) {
		return innerText;
	}
	const src = img.src.split('/');
	const piece = src[src.length - 1].replace('.svg', '').split('')[1];
	return piece == 'P' ? innerText : piece + innerText;
};

const connect = (url) => {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(url);
		ws.onopen = () => resolve(ws);
		ws.onerror = (err) => reject(err);
	});
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForElement = async (selector, timeout) => {
	let now = Date.now();
	const end = now + timeout * 1000;
	while (end > now) {
		now = Date.now();
		let element = document.querySelector(selector);
		if (element != null) {
			console.log('Found element.');
			return element;
		}
		await sleep(100);
	}
	console.warn('Waiting for element timed out');
	return null;
};

const loadCSS = (url) => {
	return new Promise((resolve, reject) => {
		const linkElement = document.createElement('link');
		linkElement.rel = 'stylesheet';
		linkElement.type = 'text/css';
		linkElement.href = url;
		linkElement.media = 'all';
		linkElement.onload = (event) => resolve(event);
		linkElement.onerror = (err) => reject(err);
		const head = document.querySelector('head');
		head.appendChild(linkElement);
	});
};

const main = async () => {
	if (window.location.href != `${origin}/.css`) {
		let element = await waitForElement(siteMap[host].movesSelector, 60);
		if (element == null) {
			return;
		}

		let hasAnalysis = (await waitForElement(siteMap[host].analysisSelector, 1)) != null;
		if (hasAnalysis) {
			return;
		}

		popup = window.open(`${origin}/.css`, '_blank');
		window.addEventListener('beforeunload', function () {
			popup.close();
		});
		window.focus(); // Return back to main window (on FF at least)
		return;
	}
	window.document.title = `Client: ${window.opener.location.pathname}`;

	// await loadCSS('http://127.0.0.1:8080/dist/tailwind.css');
	window.document.head.innerHTML = '';
	await loadCSS('https://fonts.googleapis.com/css?family=Nunito:400,700|Open+Sans:400,700&display=swap');

	const styleString = /*css*/ `
	#layout {
		display: grid;
		grid-gap: 2px;
		height: 100vh;
		padding: 2px;
		grid-template-columns: 1fr;
		grid-template-areas:
			"board"
			"pvs"
			"settings"
	}

	@media (min-width: 1280px) {
		#layout {
			grid-template-columns: 42fr 58fr;
			grid-template-rows: 67fr 33fr;
			grid-template-areas:
				"settings board"
				"settings pvs";
		}
	}

	#settings {
		grid-area: settings;
	}

	#board {
		grid-area: board;
	}

	#board svg {
		height: 100%;
		width: 100%;
	}

	#board svg line, #board svg polygon {
		opacity: 100%;
	}

	#board-container {
		height: 63vh;
		width: 63vh;
	}

	#pvs {
		grid-area: pvs;
	}

	.font-sans {
		font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
	}

	.font-serif {
		font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
	}

	.font-mono {
		font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
	}

	.font-display {
		font-family: 'Nunito', 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
	}
	
	.checkbox > input:checked {
		background-color: #667eea;
	}
	
	.checkbox > input:checked + span::before {
		content: '✓';
		color: white;
		font-weight: bolder;
		position: absolute;
		left: 0.4rem;
	}

	.radio > input:checked {
		background-color: #667eea;
	}
	
	.radio > input:checked + span::before {
		content: '';
		display: block;
		background: white;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 9999px;
		position: absolute;
		left: 0.45rem;
		top: 0.45rem;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		background-color: #667eea;
		border-radius: 9999px;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		background-color: #667eea;
		border-radius: 9999px;
		cursor: pointer;
	}
	// Generated tailwindcss goes here
	/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}b{font-weight:bolder}code{font-family:monospace,monospace;font-size:1em}button,input,select{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}[hidden]{display:none}h1,pre{margin:0}button{background-color:transparent;background-image:none;padding:0}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}input::-moz-placeholder{color:#a0aec0}input:-ms-input-placeholder{color:#a0aec0}input::-ms-input-placeholder{color:#a0aec0}input::placeholder{color:#a0aec0}[role=button],button{cursor:pointer}h1{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,select{padding:0;line-height:inherit;color:inherit}code,pre{font-family:Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}object,svg{display:block;vertical-align:middle}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.bg-gray-100{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247,250,252,var(--bg-opacity))}.bg-gray-200{--bg-opacity:1;background-color:#edf2f7;background-color:rgba(237,242,247,var(--bg-opacity))}.bg-gray-700{--bg-opacity:1;background-color:#4a5568;background-color:rgba(74,85,104,var(--bg-opacity))}.bg-gray-800{--bg-opacity:1;background-color:#2d3748;background-color:rgba(45,55,72,var(--bg-opacity))}.bg-gray-900{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26,32,44,var(--bg-opacity))}.bg-indigo-500{--bg-opacity:1;background-color:#667eea;background-color:rgba(102,126,234,var(--bg-opacity))}.hover\\:bg-indigo-600:hover{--bg-opacity:1;background-color:#5a67d8;background-color:rgba(90,103,216,var(--bg-opacity))}.border-gray-500{--border-opacity:1;border-color:#a0aec0;border-color:rgba(160,174,192,var(--border-opacity))}.border-gray-700{--border-opacity:1;border-color:#4a5568;border-color:rgba(74,85,104,var(--border-opacity))}.border-gray-900{--border-opacity:1;border-color:#1a202c;border-color:rgba(26,32,44,var(--border-opacity))}.border-indigo-500{--border-opacity:1;border-color:#667eea;border-color:rgba(102,126,234,var(--border-opacity))}.hover\\:border-indigo-400:hover{--border-opacity:1;border-color:#7f9cf5;border-color:rgba(127,156,245,var(--border-opacity))}.focus\\:border-indigo-500:focus{--border-opacity:1;border-color:#667eea;border-color:rgba(102,126,234,var(--border-opacity))}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.border-2{border-width:2px}.border{border-width:1px}.cursor-pointer{cursor:pointer}.focus-within\\:cursor-move:focus-within{cursor:move}.first\\:cursor-move:first-child{cursor:move}.last\\:cursor-move:last-child{cursor:move}.odd\\:cursor-move:nth-child(odd){cursor:move}.even\\:cursor-move:nth-child(2n){cursor:move}.hover\\:cursor-move:hover{cursor:move}.focus\\:cursor-move:focus{cursor:move}.active\\:cursor-move:active{cursor:move}.visited\\:cursor-move:visited{cursor:move}.disabled\\:cursor-move:disabled{cursor:move}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-center{justify-content:center}.font-sans{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.font-serif{font-family:Georgia,Cambria,Times New Roman,Times,serif}.font-mono{font-family:Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.font-bold{font-weight:700}.h-3{height:.75rem}.h-4{height:1rem}.h-6{height:1.5rem}.h-8{height:2rem}.h-10{height:2.5rem}.h-full{height:100%}.text-xs{font-size:.75rem}.text-sm{font-size:.875rem}.text-4xl{font-size:2.25rem}.mt-2{margin-top:.5rem}.mr-2{margin-right:.5rem}.mb-2{margin-bottom:.5rem}.ml-2{margin-left:.5rem}.mr-3{margin-right:.75rem}.mb-3{margin-bottom:.75rem}.mr-4{margin-right:1rem}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mr-10{margin-right:2.5rem}.outline-none{outline:0}.focus\\:outline-none:focus{outline:0}.p-2{padding:.5rem}.p-3{padding:.75rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.pr-8{padding-right:2rem}.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-y-0{top:0;bottom:0}.right-0{right:0}.fill-current{fill:currentColor}.text-white{--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity))}.text-gray-100{--text-opacity:1;color:#f7fafc;color:rgba(247,250,252,var(--text-opacity))}.text-gray-200{--text-opacity:1;color:#edf2f7;color:rgba(237,242,247,var(--text-opacity))}.text-gray-400{--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}.text-gray-500{--text-opacity:1;color:#a0aec0;color:rgba(160,174,192,var(--text-opacity))}.text-gray-600{--text-opacity:1;color:#718096;color:rgba(113,128,150,var(--text-opacity))}.text-gray-700{--text-opacity:1;color:#4a5568;color:rgba(74,85,104,var(--text-opacity))}.uppercase{text-transform:uppercase}.tracking-wide{letter-spacing:.025em}.align-bottom{vertical-align:bottom}.visible{visibility:visible}.whitespace-pre-wrap{white-space:pre-wrap}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.w-1{width:.25rem}.w-4{width:1rem}.w-6{width:1.5rem}.w-8{width:2rem}.w-10{width:2.5rem}.w-32{width:8rem}.w-40{width:10rem}.w-48{width:12rem}.w-64{width:16rem}.w-1\\/2{width:50%}.w-full{width:100%}@media (min-width:640px){.sm\\:cursor-move{cursor:move}.sm\\:focus-within\\:cursor-move:focus-within{cursor:move}.sm\\:first\\:cursor-move:first-child{cursor:move}.sm\\:last\\:cursor-move:last-child{cursor:move}.sm\\:odd\\:cursor-move:nth-child(odd){cursor:move}.sm\\:even\\:cursor-move:nth-child(2n){cursor:move}.sm\\:hover\\:cursor-move:hover{cursor:move}.sm\\:focus\\:cursor-move:focus{cursor:move}.sm\\:active\\:cursor-move:active{cursor:move}.sm\\:visited\\:cursor-move:visited{cursor:move}.sm\\:disabled\\:cursor-move:disabled{cursor:move}}@media (min-width:768px){.md\\:cursor-move{cursor:move}.md\\:focus-within\\:cursor-move:focus-within{cursor:move}.md\\:first\\:cursor-move:first-child{cursor:move}.md\\:last\\:cursor-move:last-child{cursor:move}.md\\:odd\\:cursor-move:nth-child(odd){cursor:move}.md\\:even\\:cursor-move:nth-child(2n){cursor:move}.md\\:hover\\:cursor-move:hover{cursor:move}.md\\:focus\\:cursor-move:focus{cursor:move}.md\\:active\\:cursor-move:active{cursor:move}.md\\:visited\\:cursor-move:visited{cursor:move}.md\\:disabled\\:cursor-move:disabled{cursor:move}}@media (min-width:1024px){.lg\\:cursor-move{cursor:move}.lg\\:focus-within\\:cursor-move:focus-within{cursor:move}.lg\\:first\\:cursor-move:first-child{cursor:move}.lg\\:last\\:cursor-move:last-child{cursor:move}.lg\\:odd\\:cursor-move:nth-child(odd){cursor:move}.lg\\:even\\:cursor-move:nth-child(2n){cursor:move}.lg\\:hover\\:cursor-move:hover{cursor:move}.lg\\:focus\\:cursor-move:focus{cursor:move}.lg\\:active\\:cursor-move:active{cursor:move}.lg\\:visited\\:cursor-move:visited{cursor:move}.lg\\:disabled\\:cursor-move:disabled{cursor:move}.lg\\:overflow-y-auto{overflow-y:auto}}@media (min-width:1280px){.xl\\:cursor-move{cursor:move}.xl\\:focus-within\\:cursor-move:focus-within{cursor:move}.xl\\:first\\:cursor-move:first-child{cursor:move}.xl\\:last\\:cursor-move:last-child{cursor:move}.xl\\:odd\\:cursor-move:nth-child(odd){cursor:move}.xl\\:even\\:cursor-move:nth-child(2n){cursor:move}.xl\\:hover\\:cursor-move:hover{cursor:move}.xl\\:focus\\:cursor-move:focus{cursor:move}.xl\\:active\\:cursor-move:active{cursor:move}.xl\\:visited\\:cursor-move:visited{cursor:move}.xl\\:disabled\\:cursor-move:disabled{cursor:move}}
	`;

	let head = document.getElementsByTagName('head')[0];
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = styleString;
	head.appendChild(style);

	let body = document.getElementsByTagName('body')[0];
	body.classList.add('bg-gray-900');
	// To make sure PurgeCSS generates html classes
	// <html></html>
	/*html*/
	body.innerHTML = `
	<div id="app" class="font-sans text-gray-100">
		<div id="layout">
			<div id="settings" class="bg-gray-800 p-3 lg:overflow-y-auto">
				<div>
					<div class='inline-flex flex-col'>
						<div class="inline-flex flex-col mr-10 mb-4">
							<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Status</span>
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input 
									type="checkbox" name="running" v-model="running" @change="handleSettingChange($event, 'running', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" :title=" running ? 'ALT + S' : 'ALT + A'">{{ running ? 'Running' : 'Paused' }}</span>
							</label>
						</div>

						<div class="inline-flex flex-col mr-10 mb-4">
							<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Playing as</span>
							<label class="radio inline-flex cursor-pointer relative mb-2">
								<input 
									type="radio" name="side" value="1" v-model.number="playingAs" @change="handleSettingChange($event, 'side', 'int')"
									class="w-6 h-6 bg-gray-900 rounded-full cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="ALT + W">White</span>
							</label>
							<label class="radio inline-flex cursor-pointer relative mb-2">
								<input 
									type="radio" name="side" value="0" v-model.number="playingAs" @change="handleSettingChange($event, 'side', 'int')"
									class="w-6 h-6 bg-gray-900 rounded-full cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="ALT + Q">Black</span>
							</label>
						</div>

						<div class="inline-flex flex-col mr-10 mb-4">
							<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Run engine for</span>
							<label class="radio inline-flex cursor-pointer relative mb-2">
								<input
									type="radio" name="run-engine" value="0" v-model.number="runEngineFor" @change="handleSettingChange($event, 'run', 'int')"
									class="w-6 h-6 bg-gray-900 rounded-full cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Me</span>
							</label>
							<label class="radio inline-flex cursor-pointer relative mb-2">
								<input
									type="radio" name="run-engine" value="1" v-model.number="runEngineFor" @change="handleSettingChange($event, 'run', 'int')"
									class="w-6 h-6 bg-gray-900 rounded-full cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Opponent</span>
							</label>
							<label class="radio inline-flex cursor-pointer relative mb-2">
								<input
									type="radio" name="run-engine" value="2" v-model.number="runEngineFor" @change="handleSettingChange($event, 'run', 'int')"
									class="w-6 h-6 bg-gray-900 rounded-full cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Both</span>
							</label>
						</div>
					</div>

					<div class='inline-flex flex-col'>
					
						<div class="inline-flex flex-col mb-4">
							<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Engine path</span>
							<input
								type="text" v-model="enginePath" @change="handleSettingChange($event, 'engine_path', 'path')" :title="enginePath"
								class="bg-gray-900 w-64 h-10 appearance-none border-2 border-gray-900 rounded py-2 px-4 text-gray-400 focus:outline-none focus:border-indigo-500"
							>
						</div>

						<div class="inline-flex flex-col mr-10 mb-4">
							<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Limit</span>
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="useDepth" @change="handleSettingChange($event, 'use_depth', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Depth {{ depth }}</span>
							</label>
							<input
								type="range" min="1" max="30" v-model.number="depth" @change="handleSettingChange($event, 'depth', 'int')"
								class="slider w-64 appearance-none bg-gray-900 outline-none h-3 rounded-full mt-2 mb-4"
							>
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="useTime" @change="handleSettingChange($event, 'use_time', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Time {{ time }}</span>
							</label>
							<input
								type="range" min="0.01" max="30" step="0.01" v-model.number="time" @change="handleSettingChange($event, 'time', 'float')"
								class="slider appearance-none bg-gray-900 outline-none h-3 rounded-full mt-2 mb-4"
							>
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="useNodes" @change="handleSettingChange($event, 'use_nodes', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">Nodes {{ nodes }}</span>
							</label>
							<input
								type="number" min="1" step="1" v-model.number="nodes" @change="handleSettingChange($event, 'nodes', 'int')"
								class="bg-gray-900 w-64 h-10 appearance-none border-2 border-gray-900 rounded py-2 px-4 text-gray-400 focus:outline-none focus:border-indigo-500"
							>
						</div>

						<div class="flex flex-col mr-10 mb-4">
							<span class="w-48 text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Principal variations</span>
							<label class="mb-2">
								PV {{ multipv }}
							</label>
							<input
								type="range" min="1" max="16" v-model.number="multipv" @change="handleSettingChange($event, 'multipv', 'int')"
								class="slider appearance-none bg-gray-900 outline-none h-3 rounded-full mt-2 mb-4"
							>
						</div>
					</div>

					<div class='inline-flex flex-col'>
						<span class="text-gray-500 font-display font-bold mb-2 text-xs uppercase tracking-wide">Misc settings</span>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="drawBoard" @change="handleSettingChange($event, 'draw_board', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Draw the SVG board with suggested moves">Draw board</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="drawOverlay" @change="handleSettingChange($event, 'draw_overlay', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Draw best move and response over the actual board">Draw overlay</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="drawEvalbar" @change="handleSettingChange($event, 'draw_evalbar', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Show evaluation bar next to the board">Draw eval bar</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="drawPVs" @change="handleSettingChange($event, 'draw_pvs', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Show principal variations">Draw principal variations</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="useVoice" @change="handleSettingChange($event, 'use_voice', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Read the best move out loud">Enable voice</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="logEngine" @change="handleSettingChange($event, 'clear_log', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Clear engine debug log each time before engine is ran">Clear log</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="useBook" @change="handleSettingChange($event, 'use_book', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Load opening book files from 'books' folder">Use opening books</span>
							</label>
						</div>

						<div class="inline-flex flex-col mb-4">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="pieceOnly" @change="handleSettingChange($event, 'piece_only', 'checkbox')"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2" title="Best move only tells you what piece to move">Piece only</span>
							</label>
						</div>

					</div>
				</div>
				<div>
					<h1 class="text-4xl font-display text-gray-200">Engine settings</h1>
					<div v-for="setting in engineSettings" class="mb-4">

						<div class="text-gray-500 font-display font-bold text-xs uppercase tracking-wide mb-2">{{ setting.name }}</div>

						<span v-if="setting.type === 'spin'">
							<input
								type="range" :min="setting.min" :max="setting.max" v-model.number="setting.value"
								class="slider appearance-none w-64 bg-gray-900 outline-none h-3 rounded-full mb-4"
								@change="handleEngineSettingChange(setting.name, setting.value)"
							>
							<input
								type="number" :min="setting.min" :max="setting.max" v-model="setting.value" :title="setting.value"
								@change="handleEngineSettingChange(setting.name, setting.value)"
								class="bg-gray-900 ml-2 h-8 appearance-none border-2 border-gray-900 rounded py-2 px-4 text-gray-400 mb-4 focus:outline-none focus:border-indigo-500"
							>
							<span class="text-sm text-gray-600"> ({{ setting.default }})</span>
						</span>

						<span v-else-if="setting.type === 'combo'">
							<div class="inline-block relative w-64">
								<select 
									v-model="setting.value"
									@change="handleEngineSettingChange(setting.name, setting.value)"
									class="block appearance-none w-full bg-gray-700 px-4 py-2 pr-8 rounded border-2 border-gray-700 focus:outline-none focus:border-indigo-500"
								>
									<option v-for="opt in setting.var">{{opt}}</option>
								</select>
								<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<svg class="fill-current text-white h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
								</div>
							</div>
						</span>

						<span v-else-if="setting.type === 'string'">
							<input
								type="text" v-model="setting.value" :title="setting.value"
								@change="handleEngineSettingChange(setting.name, setting.value)"
								class="bg-gray-900 w-64 h-10 appearance-none border-2 border-gray-900 rounded py-2 px-4 text-gray-400 mb-4 focus:outline-none focus:border-indigo-500"
							>
							<span class="text-sm text-gray-600 ml-2"> ({{ setting.default }})</span>
						</span>

						<span v-else-if="setting.type === 'check'">
							<label class="checkbox inline-flex cursor-pointer relative mb-2">
								<input
									type="checkbox" v-model="setting.value" true-value="True" false-value="False"
									@change="handleEngineSettingChange(setting.name, setting.value)"
									class="w-6 h-6 bg-gray-900 rounded cursor-pointer outline-none appearance-none"
								>
								<span class="ml-2">{{ setting.value.toString().toLowerCase() == 'true' ? 'Enabled' : 'Disabled' }}</span>
							</label>
						</span>

						<span v-else-if="setting.type === 'button'">
							<button
								class="bg-indigo-500 w-64 hover:bg-indigo-600 text-white py-2 px-4 rounded"
								@click='handleButton(setting.name)'
							>
								{{ setting.name }}
							</button>
						</span>

						<span v-else class="mb-5">
							{{ setting.type }} ???
						</span>

					</div>
				</div>
			</div>

			<div id="board" class="flex bg-gray-800 p-3">
				<div class="flex items-end mr-3 bg-gray-100 w-10" v-if="drawEvalbar" style="min-height: 30vh">
					<div class="flex items-end justify-center text-sm font-display text-white bg-gray-900 w-10"
						:style="{ height: evalBarHeight + '%' }">
						<span class="text-gray-600"> {{ currentScore }} </span>
					</div>
				</div>
				<div class="flex flex-col">
					<span class='font-display text-gray-200'>{{ currentEco }}</span>
					<span class='font-display text-gray-200' v-if="pieceOnly">{{ bestPiece }}</span>
					<div id="board-container" v-html="board" v-else-if="drawBoard"></div>
				</div>
			</div>

			<div id="pvs" class="bg-gray-800 p-3 lg:overflow-y-auto">
				<div class="text-white font-display text-xs tracking-wide" v-if="pieceOnly">
					{{ bestPiece }}
				</div>
				<div class="flex flex-row flex-wrap" v-else-if="drawPVs">
					<div
						v-for="(line, pv_index) in pvs"
						@click="onSelectPV(pv_index + 1)"
						class="w-48 mr-4 mb-3 p-2 border-2 border-gray-500 rounded hover:border-indigo-400"
						:class="{ 'border-indigo-500': selectedPV == pv_index + 1 }"
					>
						<div class="text-white font-display text-xs" :title="line.eco">
							{{ line.eco }}
						</div>
						<div class="text-gray-500 font-display font-bold text-xs uppercase tracking-wide mb-2">
							PV {{ line.multipv }}
							<span class="font-sans text-white text-sm ml-2">
								{{ line.score }}
							</span>
						</div>
						<div class="flex flex-row flex-wrap">
							<div v-for="(mov, i) in line.pv" class="w-1/2">
								<span :class="{ 'text-gray-400': i % 2 != 0 }">{{ mov }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;

	app = new Vue({
		el: '#app',
		data: {
			board: '',
			messages: [],
			enginePath: '',
			playingAs: WHITE,
			runEngineFor: 0,
			useDepth: true,
			depth: 8,
			useTime: true,
			time: 1.0,
			useNodes: false,
			nodes: 100,
			engineSettings: [],
			drawBoard: true,
			useVoice: true,
			multipv: 1,
			logEngine: '',
			useBook: true,
			drawOverlay: true,
			drawEvalbar: true,
			drawPVs: true,
			pvs: [],
			selectedPV: 1,
			running: true,
			turn: WHITE,
			currentEco: '',
			analysis: false,
			book: false,
			pieceOnly: false,
			bestPiece: ''
		},
		computed: {
			currentScore() {
				if (this.pvs.length && !this.book) {
					let score = this.pvs[0].score;
					if (typeof score === 'string' && score.includes('#')) {
						score = score.includes('-') ? -9999 : 9999;
					}
					if (this.turn == BLACK) {
						score *= -1;
					}
					return score;
				}
				return 0;
			},
			evalBarHeight() {
				return 100 - (2 / (1 + Math.exp(-0.004 * this.currentScore)) - 1 + 1) * 50;
			}
		},
		methods: {
			handleSettingChange(event, key, type) {
				let value = event.target.value;
				if (type == 'checkbox') {
					value = event.target.checked;
				} else if (type == 'int') {
					value = parseInt(value);
				} else if (type == 'float') {
					value = parseFloat(value);
				} else if (type == 'path') {
					value = value.replace(/\\/g, '/');
				}
				console.log(`Changed ${key} to:`, value);
				ws.send(JSON.stringify({ type: 'setting', data: { key, value } }));
			},
			handleEngineSettingChange(key, value) {
				console.log(`Changed engine setting ${key} to:`, value);
				ws.send(JSON.stringify({ type: 'engine_setting', data: { key, value } }));
			},
			handleButton(key) {
				if (key === 'Clear Hash') {
					console.log('Clearing hash...');
					ws.send(JSON.stringify({ type: 'clear_hash', data: true }));
				}
			},
			onSelectPV(pv) {
				console.log('Changing PV to', pv);
				this.selectedPV = pv;
				drawOnScreen();
				ws.send(JSON.stringify({ type: 'draw_svg', data: pv }));
			}
		}
	});

	try {
		ws = await connect(`ws://127.0.0.1:5678/${uid}`);
	} catch {
		console.error('Failed to connect. Make sure the server is running and refresh the page.');
		return;
	}

	console.log('Connection estabished.');
	ws.onmessage = function (event) {
		data = JSON.parse(event.data);
		switch (data.target) {
			case 'board':
				app.board = data.message;
				break;
			case 'error':
				console.log(data.message);
				break;
			case 'setting':
				const { key, value } = data.message;
				if (key in app.$data) {
					app.$data[key] = value;
				} else {
					console.error(`No key: ${key} found in app data!`);
				}
				break;
			case 'engine_settings':
				app.engineSettings = data.message;
				console.log('Received engine settings');
				break;
			case 'multipv':
				app.pvs = data.message.multipv;
				app.turn = data.message.turn;
				app.currentEco = data.message.current_eco;
				app.book = data.message.book;
				app.bestPiece = data.message.best_piece;
				app.selectedPV = 1;
				drawOnScreen();
				break;
			default:
				console.warn('Received unknown message type:');
				console.log(data);
		}
	};

	doc.addEventListener('keydown', hotkey);
	await findGame();
};

main();
