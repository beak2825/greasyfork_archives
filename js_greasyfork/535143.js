// ==UserScript==
// @name         (8chan) Custom CSS and settings + skip disclaimer
// @version      1.3
// @description  Custom CSS 8chan
// @run-at       document-start
// @match        *://8chan.moe/*
// @match        *://8chan.se/*
// @match        *://8chan.cc/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*
// @match        *://8chan.moe/.static/pages/disclaimer.html
// @match        *://8chan.se/.static/pages/disclaimer.html
// @match        *://8chan.cc/.static/pages/disclaimer.html
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/.static/pages/disclaimer.html
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @namespace https://greasyfork.org/users/1459944
// @downloadURL https://update.greasyfork.org/scripts/535143/%288chan%29%20Custom%20CSS%20and%20settings%20%2B%20skip%20disclaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/535143/%288chan%29%20Custom%20CSS%20and%20settings%20%2B%20skip%20disclaimer.meta.js
// ==/UserScript==

// setInterval(() => thread.refreshPosts(true), 5 * 1000);

(function () {
	'use strict';

	// Get current URL
	var currentUrl = window.location.href;

	// skip disclaimer
	if (window.location.href.includes('/.static/pages/disclaimer.html')) window.location.href = '/.static/pages/confirmed.html';

	////////////////////////////////////////////////////
	//////////////////// CUSTOM CSS ////////////////////
	////////////////////////////////////////////////////

	let _CSS = ``;

	// Replace //-style line comments with /* */ blocks
	_CSS = _CSS.replace(/\/\/.*$/gm, (match) => `/*${match.replace('//', '').trim()}*/`);

	// Clean whitespace (optional)
	_CSS = _CSS.trim().replace(/\s\s+/g, ' ');

	localStorage.setItem('customCSS', _CSS);

	////////////////////////////////////////////////////
	///////////////// CUSTOM JAVASCRIPT ////////////////
	////////////////////////////////////////////////////

	let _JS = `console.log('Hello World!');`;
	localStorage.setItem('customJS', _JS);

	////////////////////////////////////////////////////
	///////////////////// SETTINGS /////////////////////
	////////////////////////////////////////////////////

	// Local Times
	localStorage.setItem('localTime', 'true');
	// run only when on the main page
	if (currentUrl.match(/^https:\/\/8chan\.se$/) || currentUrl.match(/^https:\/\/8chan\.moe$/) ) {
		/* Themes:
			Cefault CSS = custom
			Board CSS = custom-force
			Yotsuba B = global
			Yotsuba P = yotsuba_p
			Yotsuba = yotsuba
			Miku = miku
			Yukkuri = yukkuri
			Hispita = hispita
			Warosu = warosu
			Vivian = vivian
			Tomorrow = tomorrow
			Lain = lain
			Royal = royal
			Hispaperro = hispaperro
			HispaSexy = hispasexy
			Avellana = avellana
			Rvita = evita
			Redchanit = redchanit
			MoeOS8 = moeos
			Windows 95 = win95
			Penumbra = penumbra
			Penumbra Clear = penumbra_clear */
		localStorage.setItem('selectedTheme', 'tomorrow');
		// Local Times
		localStorage.setItem('localTime', 'true');
		// Relative Times
		localStorage.setItem('relativeTime', 'false');
		// Image Preview on Hover
		localStorage.setItem('hoveringImage', 'true');
		// Disable Autoloop
		localStorage.setItem('noAutoLoop', 'false');
		// Disable Proof of Work Solver
		localStorage.setItem('noJsValidation', 'false');
		// Disable WebSockets
		localStorage.setItem('noWs', 'false');
		// Inline Replies
		localStorage.setItem('inlineReplies', 'false');
		// Bottom Replies
		localStorage.setItem('bottomBacklinks', 'false');
		// Disable Autohiding Deleted Posts
		localStorage.setItem('noAutohideDeleted', 'false');
		// Disable Mobile Swipe Actions
		localStorage.setItem('disableSwipeActions', 'false');
		// Show Individual File Sizes
		localStorage.setItem('fileMeter', 'false');
		// Media Default Volume - from 0 to 1
		localStorage.setItem('videovol', '0.1');
		// Syntax Highlighting Theme
		localStorage.setItem('syntaxTheme', '0');
		// Smooth Scroll Behavior 0 DEFAULT, 1 ENABLED, 2 DISABLED
		localStorage.setItem('smoothScroll', '0');
		// Touch Action Sensitivity
		localStorage.setItem('touchThreshold', '50');
		// Oekaki Provider
		////   Tegaki = /.static/oekaki/tegaki/index.html
		////   Klecks = /.static/oekaki/klecks/index.html
		////   PaintBBS NEO = /.static/oekaki/PaintBBS/index.html
		localStorage.setItem('oekakiProvider', '/.static/oekaki/tegaki/index.html');

		// doesn't do shit
		localStorage.setItem('hideSideCatalog', 'false');
	}

	////////////////////////////////////////////////////
	//////////////////// CUSTOM CSS ////////////////////
	////////////////////////////////////////////////////

	function parseColor(color) {
		let result;

		// Named HTML colors to hex mapping
		const htmlColors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

		// Convert named color to hex first if it exists
		if (htmlColors[color.toLowerCase()]) {
			color = htmlColors[color.toLowerCase()];
		}

		// Helper function to validate and clamp RGB values
		const clampRGB = (value) => Math.min(255, Math.max(0, parseInt(value, 10)));

		// Helper function to validate and clamp alpha values
		const clampAlpha = (value) => {
			const num = parseFloat(value);
			return Math.min(1, Math.max(0, isNaN(num) ? 1 : num));
		};

		// Hex formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
		if (/^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
			let hex = color.slice(1);
			// Expand shorthand (e.g., #RGBA → #RRGGBBAA)
			if (hex.length === 3 || hex.length === 4) {
				hex = hex.split('').map(x => x + x).join('');
			}
			// Parse to [r, g, b, a] (alpha defaults to 1 if missing)
			const r = clampRGB(parseInt(hex.slice(0, 2), 16));
			const g = clampRGB(parseInt(hex.slice(2, 4), 16));
			const b = clampRGB(parseInt(hex.slice(4, 6), 16));
			const a = hex.length === 8 ? clampAlpha(parseInt(hex.slice(6, 8), 16) / 255) : 1;
			return [r, g, b, a];
		}
		// RGB: rgb(r, g, b) → [r, g, b, 1]
		else if (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(color)) {
			const matches = color.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
			const r = clampRGB(matches[1]);
			const g = clampRGB(matches[2]);
			const b = clampRGB(matches[3]);
			return [r, g, b, 1];
		}
		// RGBA: rgba(r, g, b, a) → [r, g, b, a]
		else if (/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.\d+|0|1)\s*\)$/i.test(color)) {
			const matches = color.match(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.\d+|0|1)\s*\)/i);
			const r = clampRGB(matches[1]);
			const g = clampRGB(matches[2]);
			const b = clampRGB(matches[3]);
			const a = clampAlpha(matches[4]);
			return [r, g, b, a];
		}
		// Return null if format is invalid
		return null;
	};

	/*
			 * color:				rgba(255, 255, 255, 1)
			 * h: hue,				range (-100 — 100)
			 * s: saturation,		range (-100 — 100)
			 * v: value/brightness,	range (-100 — 100)
			 * a: alpha,	decimal range (  0  —  1 ) and -1 = keep original alpha
			 */
	function adjustColor(color, { h = 0, s = 0, v = 0, a = -1 } = {}) {
		const rgba = parseColor(color);
		if (!rgba) return color;

		// Normalize RGB to [0, 1] and extract alpha (default: 1)
		let [r, g, b, originalA = 1] = rgba;
		r /= 255; g /= 255; b /= 255;

		// Convert to HSV
		const [hue, sat, val] = rgbToHsv(r, g, b);

		// Adjust Hue (handle negative values by looping)
		let newHue = (hue * 360 + h) % 360; // Apply hue shift
		newHue = newHue < 0 ? newHue + 360 : newHue; // Ensure 0-360 range

		// Adjust Saturation & Value (clamped to 0-1)
		const newSat = Math.min(1, Math.max(0, sat + s / 100));
		const newVal = Math.min(1, Math.max(0, val + v / 100));

		// Handle Alpha (if a=-1, keep original; else clamp to [0, 1])
		const newAlpha = a === -1 ? originalA : Math.min(1, Math.max(0, a));

		// Convert back to RGB
		const [newR, newG, newB] = hsvToRgb(newHue, newSat, newVal);

		// Return as RGBA string
		return `rgba(${Math.round(newR * 255)},${Math.round(newG * 255)},${Math.round(newB * 255)},${newAlpha.toFixed(1)})`;
	};

	function rgbToHsv(r, g, b) {
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let hVal, sVal, vVal = max;
		const d = max - min;

		sVal = max === 0 ? 0 : d / max;

		if (d === 0) {
			hVal = 0;
		} else {
			switch (max) {
				case r: hVal = (g - b) / d + (g < b ? 6 : 0); break;
				case g: hVal = (b - r) / d + 2; break;
				case b: hVal = (r - g) / d + 4; break;
			}
			hVal /= 6;
		}

		return [hVal, sVal, vVal];
	};

	function hsvToRgb(h, s, v) {
		const c = v * s;
		const x = c * (1 - Math.abs((h / 60) % 2 - 1));
		const m = v - c;

		let r1, g1, b1;
		if (h < 60) [r1, g1, b1] = [c, x, 0];
		else if (h < 120) [r1, g1, b1] = [x, c, 0];
		else if (h < 180) [r1, g1, b1] = [0, c, x];
		else if (h < 240) [r1, g1, b1] = [0, x, c];
		else if (h < 300) [r1, g1, b1] = [x, 0, c];
		else [r1, g1, b1] = [c, 0, x];

		return [r1 + m, g1 + m, b1 + m];
	};

	const rootStyles = window.getComputedStyle(document.documentElement);
	let linkColor = rootStyles.getPropertyValue('--link-color').trim() || 'rgba(152,191,247,1)';
	linkColor = adjustColor(linkColor, { h: 0, s: -10, v: 0, a:0.4 });

	GM_addStyle(`
		/* Red solid border for posts quoting you */
		/*.innerPost:has(.quoteLink.you) { border-left: 8px solid red !important; }*/

		/* Red dashed border for your own posts */
		/*.innerPost:has(.linkName.youName) { border-left: 6px dotted red !important; }*/

		/* For posts that are yours and quote you */
		/*.innerPost:has(.linkName.youName):has(.quoteLink.you) { border-left: 6px double red !important; }*/

		/* Smaller filename font, smaller thumbnails, subjectively better multi-file posts. */
		a.imgLink img:not(.imgExpanded) {
			/*width: 180px;*/
			max-width: 220px;
			max-height: 220px;
			object-fit: contain;
		}
		a.imgLink img.imgExpanded {
			/*max-height: 400px;*/
			/*max-width: 600px !important;*/
			max-height: 600px;
			max-width: 900px !important;
			object-fit: contain;
		}
		div.panelUploads.multipleUploads figure.uploadCell details summary
		div.uploadDetails :not(.coloredIcon, .originalNameLink, .hideMobile) {
			display: none;
		}
		.uploadDetails {
			font-size: 9px !important;
			max-width: 515px;
		}
		.panelUploads.multipleUploads .uploadDetails {
			font-size: 9px !important;
			max-width: 215px;
			min-height: 33px;
		}
		.divMessage {
			margin: 1em 1em 1em 1em;
		}
		/*
		.innerPost {
			min-width: 50%;
		}*/


		/* Hide hidden post stubs */
		/*.postCell:has(> span.unhideButton.glowOnHover) {
			display: none;
		}*/

		.imgExpanded/*, video*/ { max-width: 600px !important; }

		.innerOP video,
		.innerPost video {
			max-width: 500px !important;
			height: auto !important; /* Maintain aspect ratio */
		}

		/* change position of thread info (post count / unique poster id count / file count) */
		.threadInfo {
			position: fixed;
			top: 5%;
			right: 1%;
			z-index: 0;
			color: var(--text-color);
			font-size: 10px;
			text-align: right;
			text-shadow: -1px -1px 0 var(--background-gradient), 1px -1px 0 var(--background-gradient), -1px 1px 0 var(--background-gradient), 1px 1px 0 var(--background-gradient);
		}
		/*.threadInfo #postCount::before {
			content: "P: " !important;
		}
		.threadInfo #fileCount::before {
			content: "F: " !important;
		}*/
		.threadBottom .threadInfo > :not(:last-child)::after {
			content: "\\A" !important;
			white-space: pre-line !important;
		}

		/* always show full filename + change style */
		a.originalNameLink {
			display: inline-block;
			vertical-align: bottom;
			max-width: 100%;
			display: inline;
			overflow-wrap: anywhere;
			white-space: normal;
			/*color: #FFD1B2 !important;*/
			color: #59B2B2 !important;
			/*font-family: 'Times New Roman', serif;*/
			font-family: Arial, sans-serif;
			filter: drop-shadow(0 0 0.1rem var(--menu-color));
		}

		/* On hover: Quoted posts in-view get highlighted with a solid border */
		/*.innerPost:has(.replyUnderline) {*/
		/*.markedPost.markedByHover {
			background: ${linkColor} !important;
			border-left: 6px solid var(--text-color) !important;
			border-right: 3px dashed var(--text-color) !important;
			border-top: 3px dashed var(--text-color) !important;
			border-bottom: 3px dashed var(--text-color) !important;
		}*/
		.markedPost.markedByHover {
			border-left: 6px solid var(--link-color) !important;
			border-right: 3px dashed var(--link-color) !important;
			border-top: 3px dashed var(--link-color) !important;
			border-bottom: 3px dashed var(--link-color) !important;
			filter: contrast(105%);
		}

		/*.divPosts {
			opacity: 0;
		}*/

		/*div#quick-reply {
			width: 308px;
		}*/

	/* Quick Reply */
	:root.sticky-qr #quick-reply {
		display: block;
		top: auto !important;
		bottom: 0;
		left: auto !important;
		position: fixed;
		right: 0 !important;
	}
	:root.sticky-qr #qrbody {
		resize: vertical;
		max-height: 50vh;
		height: 130px;
	}
	#qrbody {
		min-width: 300px;
	}
	:root.bottom-header #quick-reply {
		bottom: 28px !important;
	}
	#quick-reply {
		padding: 0;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}
	#quick-reply:hover,
		#quick-reply:focus-within {
			opacity: 1;
		}
	.floatingMenu {
		padding: 0 !important;
	}
	#qrFilesBody {
		max-width: 300px;
	}

	/* hide cat on jp */
	/*#oneko {
	    display: none;
	}*/

	a.originalNameLink:after { font-family: 'Icons'; content:' \\e04e '; }

	div.panelUploads.multipleUploads figure.uploadCell details summary div.uploadDetails :not(.coloredIcon, .originalNameLink, .hideMobile) { display: inline !important; }

	#boardContentLinks {
	    display: none;
	}
	figure.uploadCell details summary {
	    font-size: 7px;
	}

	.coloredIcon::before {
	    margin-right: 0.1em !important;
	}

	#fcxm .floatingMenu.fcx-active {
	    overflow-x: scroll;
	    font-size: 70% !important;
		max-height: 300px !important;
	}

	.nameLabel {
	    max-width: initial !important;
	}

	body {
	    background-image: unset !important;
	}

`);

	////////////////////////////////////////////////////
	///////////////// CUSTOM JAVASCRIPT ////////////////
	////////////////////////////////////////////////////

	// Unique ID: Disable click events without affecting hover
	// Double clicking on labelId gives it the .markedPost CSS class attributes which I don't want.
	/*document.addEventListener('click', function(e) {
		if (e.target.closest('.labelId')) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}, true); // Use capture phase to block early*/

	//Thread trimmer
	//This is a thread trimming script designed to automatically clean up long discussion threads.
	/*
	const threadTrimmer = function () {
		var maxLength = 500;
		var postLinks = document.querySelectorAll('.postCell');
		if (postLinks.length > maxLength){
			for (let i=0; i < postLinks.length-maxLength; i++){
				postLinks[i].remove();
			}
		}
	}
	setInterval(threadTrimmer, 10000); //Cleans up once every 10s
	*/
	/*
	//Hide replies to hidden posts
	const hideReplies = function() {
		const _posts = document.querySelectorAll('.postCell');
		for (let i = 0; i < _posts.length; i++){
			var _post = _posts[i];
			const postLinks = _post.querySelectorAll('.divMessage > a.quoteLink');
			if (postLinks != null && postLinks.length > 0){
				postLinks.forEach(_linkedPost => {
					const _linkID = _linkedPost.href.split('#')[1];
					try {
						if (document.getElementById(_linkID).firstChild.className == "unhideButton glowOnHover"
							|| document.getElementById(_linkID).style.display == 'none'){
							_post.style.display = 'none';
						}
					} catch (error){
					}
				});
			}
		}
	}
	setInterval(hideReplies, 2000);*/

	/*
	//Prevent auto scrolling to the bottom after replying.
	thread.replyCallback = function(status, data) {

		if (status === 'ok') {

			postCommon.storeUsedPostingPassword(api.boardUri, api.threadId, data);
			api.addYou(api.boardUri, data);

			document.getElementById('fieldMessage').value = '';
			document.getElementById('fieldSubject').value = '';
			qr.clearQRAfterPosting();
			postCommon.clearSelectedFiles();

			if (!thread.autoRefresh || !thread.socket) {
				thread.refreshPosts(true);
			}

		} else {
			alert(status + ': ' + JSON.stringify(data));
		}

	};

	thread.replyCallback.stop = function() {

		thread.replyButton.value = thread.originalButtonText;

		qr.setQRReplyText(thread.originalButtonText);

		thread.replyButton.disabled = false;
		qr.setQRReplyEnabled(true);

	};

	thread.replyCallback.progress = function(info) {

		if (info.lengthComputable) {
			var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
			+ '%';
			thread.replyButton.value = newText;

			qr.setQRReplyText(newText);
		}

	};*/


	// 1.19 KB of base64 data
	/*const SPOILER128 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALHSURBVHja7N1dcppwGMVhaDrTbeBKZCelN3UZyDKSm+JOcCW4j36Qm3RG/3ZEyocCz28mF8TETF5Ozjm8aoyjFk6n02uE2ZIkye7W7Z+MaN0QAAFgzcRtmV9VlSnNmDRNb3YCDiACQABYbwdI0/Qi87MsCzuBKc17D3BxXJYlBwABgAAQRVH0eeg7LIrCVEckz3MOAAIAAeApOoDMn5Zw3n07AQcQASAA6AD3Eu6Wu/Lj6/biON1X39d8Aqp9+nZ+/O1w7HU+uj52wwFEAAgAOsD/ZkhXwszfbOK3Fc//S10HHegw7DzazicHeCyNCFg3vwjgcbx8fDySP7PbA8yNum567RmW3lFEgMtAEADsAWT+ffe3tE7AAUQACAA6wFwF1zXzzzL87xKoic4WMm33t7ROMLUAXp7od//t73/6CPhp5DoA7AGmo2tGh18/9F6BA4AAQAAgABAACAAEAHuA6a7z21j6dT8HAAGAALCUDjB15ntOIEQACAA6gMznACAAEAB0gOWwtv9ZxAFEAAgAOoCM5wAgABAAdIAl0/ZYgD0ARAAIADqAPQAHAAGAAKADDEf4PnlX75mzMsJ5RNGRA4AAQABYZAe4em/cw9qvy48cAAQAAsAsO0Bd1xfHm83GVEcknHdVVRwABAACwCQdIHw/+jCDwozCsITzDs8HBwABgAAw1R7gKoOS5HaGlaWpDzlvDgACAAHgQR0gpNzv20LM1DkACAAEgMcTX30ijl/Pj/M8N6UZUxTFxXHTNDsOAAIAAeBfHaCtE2BehJnPAUAAIADc2wF6/wB7hUGv2zkACAAEgLl2gL5st9te35+m6c3b+77W7njs93r/sTOfA4AAQAD4YPT/EdQ307p2iLaMT1petzB0R5g60zkACAAEgLH2AGVZen7AE5Nl2Y4DgABAABijA3iO4HPTde/AAUQACACr5X0ArQfAebFBVR8AAABaZVhJZk1NACoAAAAIAAUBEgADAAAAAQABAAABGgAFAAAAAQAAAEoBGwAFAAAAAQAAAFIBKAADAAAAAQACAAACEwADAAAAAQABAAAAAAAAAAAASAAAAAEAAABIAAAAAR9S9zQAAAAASUVORK5CYII=';

	// Replaces spoiler thumbnails with their actual image thumbnails dynamically
	function replaceSpoilerImages() {
		// Find all spoiler images
		const spoilerImages = document.querySelectorAll('img[src="/v/custom.spoiler"], img[src="/spoiler.png"], img[src="/a/custom.spoiler"]');

		spoilerImages.forEach(image => {
			image.setAttribute("data-spoiler", true);

			const uploadCell = image.closest('.uploadCell');
			const parent = image.parentElement;
			const fileName = parent.href.split("/")[4];
			const noThumbnail = !fileName.includes(".");
			const dimensionLabel = uploadCell.querySelector('.dimensionLabel'); // e.g. '123x123'
			const dataFilemime = parent.getAttribute('data-filemime');

			if (noThumbnail) {
				image.src = `/.media/${fileName}`;
			} else {
				image.src = `/.media/t_${fileName.split(".")[0]}`;
			}

			const imageMimeRE = /^image\/.+$/;

			// set full image as a thumbnail for small images (200x200 or less). fix for small images. small images don't have thumbnails.
			if (dimensionLabel && imageMimeRE.test(dataFilemime)) {
				const dimensions = dimensionLabel.textContent.trim().split('x');
				if (dimensions.length === 2) {
					const width = parseInt(dimensions[0]);
					const height = parseInt(dimensions[1]);
					if (width <= 300 && height <= 300) {
						image.src = `/.media/${fileName}`;
					} else {
						image.src = `/.media/t_${fileName.split(".")[0]}`;
					}
				}
			} else {
				image.src = `/.media/t_${fileName.split(".")[0]}`;
			}

			updateSpoilerMini(image);
		});
	}

	function updateSpoilerMini(image) {
		const imgLink = image.closest('a.imgLink');
		if (!imgLink) return;

		const existingMini = imgLink.querySelector('.sp0iler-mini');
		if (existingMini) {
			return;
		}

		// Add spoiler-mini
		const spoilerMini = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		spoilerMini.classList.add('sp0iler-mini');
		spoilerMini.style = "position: absolute; top: 0px; right: 0px; width: 24px; height: 24px; opacity: 0.8; z-index: 0;"
		spoilerMini.setAttribute('viewBox', '0 0 32 32');
		spoilerMini.setAttribute('shape-rendering', 'crispEdges');
		spoilerMini.innerHTML = `<path stroke="#dfdfdf" d="M2 0h24M27 0h3M1 1h1M30 1h1M4 21h1M27 21h1M5 22h14M20 22h7" /><path stroke="#dddfdf" d="M26 0h1" /><path stroke="#9f9f9f" d="M2 1h3M6 1h3M11 1h3M15 1h5M21 1h9M1 2h1M30 2h1M1 3h1M30 3h1M1 4h1M30 4h1M1 5h1M3 5h1M30 5h1M28 6h1M3 7h1M28 7h1M3 8h1M28 8h1M3 9h1M28 9h1M3 10h1M28 10h1M3 11h1M28 11h1M28 12h1M3 13h1M28 13h1M3 14h1M28 14h1M3 15h1M28 15h1M3 16h1M28 16h1M3 17h1M28 17h1M3 18h1M28 18h1M3 19h1M28 19h1M3 20h1M28 20h1M3 21h1M28 21h1M4 22h1M27 22h1M7 23h20M15 29h2M3 30h6M11 30h6M18 30h11" /><path stroke="#9f9f9d" d="M5 1h1M10 1h1" /><path stroke="#9f9f9e" d="M9 1h1M28 5h1M3 6h1M10 30h1" /><path stroke="#9d9f9f" d="M14 1h1M9 30h1" /><path stroke="#9f9d9f" d="M20 1h1" /><path stroke="#3f3f3f" d="M0 2h1M31 2h1M0 3h1M31 3h1M0 4h1M31 4h1M0 5h1M31 5h1M0 6h1M31 6h1M0 7h1M31 7h1M0 8h1M31 8h1M0 9h1M31 9h1M31 10h1M0 11h1M31 11h1M0 12h1M31 12h1M0 13h1M0 14h1M31 14h1M0 15h1M31 15h1M0 16h1M31 16h1M0 17h1M31 17h1M31 18h1M0 19h1M31 19h1M0 20h1M31 20h1M0 21h1M31 22h1M0 23h1M31 23h1M0 24h1M31 24h1M11 28h3M17 28h4M11 29h2M19 29h2" /><path stroke="#808080" d="M2 2h24M27 2h3M3 3h2M27 3h3M2 4h2M28 4h2M2 5h1M29 5h1M1 6h2M29 6h2M2 7h1M29 7h2M1 8h2M29 8h2M1 9h2M29 9h2M1 10h2M30 10h1M1 11h2M29 11h2M1 12h2M29 12h2M1 13h2M29 13h2M1 14h2M29 14h2M1 15h2M29 15h2M1 16h2M29 16h2M1 17h2M29 17h2M1 18h1M29 18h2M2 19h1M29 19h2M1 20h2M30 20h1M1 21h2M29 21h2M2 22h2M28 22h2M1 23h4M27 23h4M1 24h22M24 24h7M2 25h25M28 25h2M7 27h2M10 27h15M15 28h2M13 29h2M17 29h2" /><path stroke="#828080" d="M26 2h1M29 10h1M2 18h1" /><path stroke="#818080" d="M2 3h1M1 22h1M27 25h1" /><path stroke="#010101" d="M5 3h8M14 3h1M16 3h11M4 4h5M10 4h18M4 5h3M25 5h3M4 6h3M8 6h16M25 6h3M4 7h3M8 7h4M13 7h1M19 7h5M25 7h3M5 8h2M8 8h3M12 8h1M19 8h4M26 8h2M5 9h2M8 9h4M15 9h2M20 9h4M25 9h3M4 10h3M8 10h4M14 10h4M20 10h4M25 10h3M4 11h3M8 11h4M14 11h4M20 11h4M25 11h3M4 12h3M8 12h5M14 12h1M21 12h3M25 12h3M4 13h3M8 13h2M11 13h5M19 13h5M25 13h3M4 14h2M8 14h4M13 14h2M18 14h6M26 14h2M4 15h3M8 15h7M17 15h3M21 15h3M25 15h3M4 16h2M8 16h13M22 16h2M25 16h3M4 17h3M8 17h7M17 17h7M25 17h3M4 18h3M8 18h10M19 18h2M22 18h2M25 18h3M4 19h3M25 19h3M4 20h1M6 20h22M5 21h19M25 21h2M1 25h1M30 25h1M2 26h14M17 26h13M6 27h1M7 28h4M21 28h5M10 29h1M21 29h1M3 31h1M5 31h13M19 31h1M21 31h8" /><path stroke="#010001" d="M13 3h1M15 3h1M4 8h1M11 8h1M15 12h1M6 14h1M21 16h1M16 26h1" /><path stroke="#030101" d="M9 4h1M23 8h1M13 12h1M20 12h1M6 16h1" /><path stroke="#e0e000" d="M7 5h15M23 5h1M7 6h1M24 6h1M7 7h1M14 7h3M24 7h1M7 8h1M13 8h3M17 8h2M24 8h1M12 9h3M17 9h3M24 9h1M7 10h1M12 10h2M18 10h2M24 10h1M7 11h1M12 11h1M18 11h2M24 11h1M7 12h1M17 12h2M24 12h1M7 13h1M16 13h3M24 13h1M7 14h1M15 14h3M24 14h1M7 15h1M15 15h2M24 15h1M7 16h1M24 16h1M7 17h1M15 17h2M7 18h1M24 18h1M7 19h18" /><path stroke="#e0e100" d="M22 5h1" /><path stroke="#e0e200" d="M24 5h1M7 9h1M19 12h1" /><path stroke="#808081" d="M1 7h1M1 19h1" /><path stroke="#010100" d="M12 7h1M10 13h1M24 21h1" /><path stroke="#e2e000" d="M17 7h1" /><path stroke="#010301" d="M18 7h1M12 14h1M25 14h1M4 31h1" /><path stroke="#e0e002" d="M16 8h1" /><path stroke="#010103" d="M25 8h1M4 9h1M16 12h1M6 28h1M18 31h1" /><path stroke="#3f3f3e" d="M0 10h1M31 21h1" /><path stroke="#e1e000" d="M13 11h1M24 17h1" /><path stroke="#9e9f9f" d="M3 12h1M17 30h1" /><path stroke="#3f3e3f" d="M31 13h1" /><path stroke="#000101" d="M20 15h1M18 18h1M21 18h1M5 20h1M25 27h1M20 31h1" /><path stroke="#3d3f3f" d="M0 18h1M14 28h1" /><path stroke="#808280" d="M29 20h1" /><path stroke="#3f3f3d" d="M0 22h1" /><path stroke="#dfdfdd" d="M19 22h1" /><path stroke="#808180" d="M30 22h1" /><path stroke="#df0000" d="M5 23h2" /><path stroke="#808083" d="M23 24h1" /><path stroke="#808082" d="M9 27h1" />`;

		imgLink.style.position = 'relative';
		imgLink.appendChild(spoilerMini);

		// Observe this image for style changes
		//const styleObserver = new MutationObserver((mutations) => {
		//	mutations.forEach(mutation => {
		//		image.style.border = "0";
		//		spoilerMini.style.display = image.style.display;
		//		if (!settings.enabled || !settings.revealSpoilers) {
		//			spoilerMini.style.display = 'none';
		//		}
		//	});
		//});
		//
		//styleObserver.observe(image, { attributes: true });
	}

	// Run on page load
	window.addEventListener('load', replaceSpoilerImages);
	document.addEventListener('DOMContentLoaded', replaceSpoilerImages);

	// Watch for AJAX/dynamic content (e.g., posts loading on scroll)
	//const observer = new MutationObserver(replaceSpoilerImages);
	//observer.observe(document.body, { childList: true, subtree: true });


	// Watch for new posts
	const thread = document.getElementById('threadList');
	if (thread) {
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === 1 && node.classList.contains('postCell')) {
						console.log('MutationObserver');
						replaceSpoilerImages();
					}
				}
			}
		});
		observer.observe(thread, { childList: true, subtree: true });
	}*/

})();