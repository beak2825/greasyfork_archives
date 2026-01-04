// ==UserScript==
// @name        V LIVE Video Rotation
// @description Adds buttons and keyboard shortcuts to rotate and flip the video.
// @version     1.10
// @author      aqmx
// @namespace   aqmx
// @license     MIT
// @match       https://www.vlive.tv/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379342/V%20LIVE%20Video%20Rotation.user.js
// @updateURL https://update.greasyfork.org/scripts/379342/V%20LIVE%20Video%20Rotation.meta.js
// ==/UserScript==


GM_addStyle(`
#video-rotation-controls {
	margin-left: 15px;
}
#video-rotation-controls button {
	font-size: 20px;
	background: #f5f5f5;
	border: 1px solid #d9d9d9;
	color: #414141;
	line-height: 22px;
	height: 24px;
	width: 24px;
	outline: 0;
}
#video-rotation-controls button:not(:last-child) {
	margin-right: 3px;
}
#playerBoxArea > .u_rmcplayer:fullscreen div[id*=".videoArea"],
#playerBoxArea > .vwplayer_vlivelive:fullscreen .videoBox {
    height: calc(100% - 4px);
    width: calc(100% - 4px);
}
`);


let directions = {
	left: 'r270',
	up: 'r0',
	right: 'r90',
	down: 'r180',
	flipH: 'flipH',
	flipV: 'flipV',
}
let rotations = {
	r90: 'rotate(90deg)',
	r180: 'rotate(180deg)',
	r270: 'rotate(270deg)',
};
let scaling = {
	flipH: 'scaleX(-1)',
	flipV: 'scaleY(-1)',
	portrait: 'scale(1.77777)',
	landscape: 'scale(0.5625)',
};

/*let brightnessPercent = 100;
let brightness = {
	up: 5,
	down: -5,
	reset: 0,
}*/

let attempts = 0;
let controlsID = 'video-rotation-controls';
let shortcutsEnabled = true;
let shortcuts = {
	'Numpad8': directions.up,
	'Numpad2': directions.down,
	'Numpad4': directions.left,
	'Numpad6': directions.right,
	'Numpad9': directions.flipH,
	'Numpad3': directions.flipV,
}
let stylesheet = null;
let timer = null;


(() => {
	stylesheet = document.createElement('style');
	document.head.appendChild(stylesheet);

	let getAllSubsets = arr => arr.reduce((subsets, value) => subsets.concat(subsets.map(set => [...set, value])), [[]]).slice(1);
	let scalings = getAllSubsets(Object.keys(scaling));

	for (let rule in rotations) {
		stylesheet.sheet.insertRule(`video.${rule} { transform: ${rotations[rule]}; }`, stylesheet.sheet.cssRules.length);
		for (let scalingSet of scalings) {
			stylesheet.sheet.insertRule(`video.${rule}.${scalingSet.reduce((s, v) => s+'.'+v)} { transform: ${rotations[rule] + scalingSet.reduce((s, v) => s+' '+scaling[v], '')}; }`, stylesheet.sheet.cssRules.length);
		}
	}

	let flips = getAllSubsets([directions.flipH, directions.flipV]);
	for (let flipSet of flips) {
		stylesheet.sheet.insertRule(`video.${flipSet.reduce((s, v) => s+'.'+v)} { transform:${flipSet.reduce((s, v) => s+' '+scaling[v], '')}; }`, stylesheet.sheet.cssRules.length);
	}

	addButtons();

	// Re-add buttons if page changes
	window.history.pushState = function() {
		History.prototype.pushState.apply(history, arguments);
		attempts = 0;
		setTimeout(addButtons, 2000);
	}
})();

function addButtons() {
	clearTimeout(timer);
	let btnArea = document.querySelector('[class^="video_content"] [class^="video_detail"] [class^="post_detail_reaction_info"]');

	if (!btnArea) {
		if (++attempts < 10) {
			timer = setTimeout(addButtons, 500);
		}
		return;
	}
	else if (document.getElementById(controlsID)) {
		return;
	}

	let btnDirections = [
		[directions.left, '🠘'],
		[directions.up, '🠙'],
		[directions.right, '🠚'],
		[directions.down, '🠛'],
		[directions.flipV, '🡙'],
		[directions.flipH, '🡘'],
	];
	/*let btnBrightness = [
		['up', '+'],
		['down', '−'],
		['reset', '⟳'],
	];*/

	let div = document.createElement('div');
	div.id = controlsID;
	for (let entry of btnDirections) {
		let btn = document.createElement('button');
		btn.dataset.direction = entry[0];
		btn.textContent = entry[1];
		div.appendChild(btn);
	}
	/*for (let entry of btnBrightness) {
		let btn = document.createElement('button');
		btn.dataset.brightness = entry[0];
		btn.textContent = entry[1];
		div.appendChild(btn);
	}*/

	btnArea.style.justifyContent = 'initial';
	btnArea.appendChild(div);
}

function rotateVideo(direction) {
	let video = document.querySelector('.u_rmcplayer_video video') || document.querySelector('.vwplayer_vlivelive .videoBox video');
	if (!video) return;
	let flip = [directions.flipH, directions.flipV].includes(direction);

	if (flip) {
		video.classList.toggle(direction);
	}
	else {
		video.classList.remove(directions.left, directions.right, directions.down, 'portrait', 'landscape');
		if (direction != directions.up) {
			video.classList.add(direction);
			if ([directions.left, directions.right].includes(direction)) {
				video.classList.add(video.videoHeight > video.videoWidth ? 'portrait' : 'landscape');
			}
		}
	}
}

/*function changeBrightness(value) {
	let video = document.querySelector('.u_rmcplayer_video video') || document.querySelector('.vwplayer_vlivelive .videoBox video');
	if (!video) return;

	if (brightness[value]) {
		brightnessPercent += brightness[value];
		video.style.filter = 'brightness('+brightnessPercent+'%)';
	}
	else {
		brightnessPercent = 100;
		video.style.filter = null;
	}
}*/

window.addEventListener('click', function(e) {
	if (e.target.parentNode.id != controlsID || e.target.tagName.toLowerCase() != 'button') {
		return;
	}
	else if (e.target.dataset.direction) {
		rotateVideo(e.target.dataset.direction);
	}
	/*else if (e.target.dataset.brightness) {
		changeBrightness(e.target.dataset.brightness);
	}*/
}, true);


// Shortcuts
window.addEventListener('keydown', function(e) {
	let stopPropagation = false;
	if (shortcuts[e.code] && shortcutsEnabled) {
		rotateVideo(shortcuts[e.code]);
		stopPropagation = true;
	}
	else if (e.code == 'Pause') {
		shortcutsEnabled = !shortcutsEnabled;
		stopPropagation = true;
	}

	if (stopPropagation) {
		e.preventDefault();
		e.stopPropagation();
	}
}, true);
