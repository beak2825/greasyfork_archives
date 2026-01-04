// ==UserScript==
// @name        Skribbl Line Tool
// @namespace   https://greasyfork.org/users/281093
// @match       *://skribbl.io/*
// @grant       none
// @version     1.1
// @license		MIT
// @copyright   2020, Faux (https://greasyfork.org/users/281093)
// @author      Ghibli
// @description Hold shift to enable line drawing, press Space to snap to right angles
// @downloadURL https://update.greasyfork.org/scripts/410108/Skribbl%20Line%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/410108/Skribbl%20Line%20Tool.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const canvas = document.querySelector('#canvasGame');
const lineCanvas = document.createElement('canvas');
const lineCtx = lineCanvas.getContext('2d');

lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);

lineCanvas.setAttribute('style', `
	position: absolute;
	cursor: crosshair;
	width: 100%;
	user-select: none;
	z-index: 2;
	filter: opacity(0.1);
	display: none;`
);

lineCanvas.clear = () => {
	lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
};

let origin = {
	preview: {},
	real: {}
};

const pos = {
	preview: {},
	real: {}
};

let canvasHidden = true;
let drawingLine = false;
let snap = false;

document.addEventListener('keydown', (e) => {
	if (!isDrawing()) return;
	if (e.code === 'ShiftLeft' && canvasHidden) {
		lineCanvas.style.display = '';
		disableScroll();
		canvasHidden = false;
	}
	else if (e.code === 'Space' && !snap && !canvasHidden) {
		snap = true;
		document.dispatchEvent(createMouseEvent('pointermove', pos.real));
	}
});

document.addEventListener('keyup', (e) => {
	if (e.code === 'ShiftLeft' && !canvasHidden) {
		hideLineCanvas();
		document.removeEventListener('pointermove', savePos);
		document.removeEventListener('pointerup', mouseUpDraw);
	}
	else if (e.code === 'Space' && snap) {
		snap = false;
		document.dispatchEvent(createMouseEvent('pointermove', pos.real));
	}
});

function hideLineCanvas() {
	lineCanvas.style.display = 'none';
	canvasHidden = true;
	enableScroll();
	resetLineCanvas();
}

function savePos(e) {
	e.preventDefault();
	pos.preview = getPos(e);
	pos.real = getRealPos(e);

	if (canvasHidden || !drawingLine) return;
	lineCanvas.clear();
	drawPreviewLine(pos.preview);
}

lineCanvas.addEventListener('pointerdown', (e) => {
	if (!e.shiftKey) hideLineCanvas();
	origin = getPos(e);
	origin.real = getRealPos(e);
	drawingLine = true;
	document.addEventListener('pointerup', mouseUpDraw);
	document.addEventListener('pointermove', savePos);
});

function mouseUpDraw(e) {
	document.removeEventListener('pointermove', savePos);
	document.removeEventListener('pointerup', mouseUpDraw);
	drawLine(origin.real.x, origin.real.y, pos.real.x, pos.real.y);
	pos.preview = getPos(e);
	pos.real = getRealPos(e);
	resetLineCanvas();
}

function resetLineCanvas() {
	drawingLine = false;
	lineCanvas.clear();
}

function getPos(event) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasScale = canvas.width / canvasRect.width;
	return {
		x: (event.clientX - canvasRect.left) * canvasScale,
		y: (event.clientY - canvasRect.top) * canvasScale
	};
}

function getRealPos(event) {
	return {
		x: event.clientX,
		y: event.clientY
	};
}

function drawPreviewLine(coords) {
	lineCtx.beginPath();
	lineCtx.moveTo(origin.x, origin.y);

	if (snap) {
		if (Math.abs(coords.x - origin.x) < Math.abs(coords.y - origin.y)) {
			lineCtx.lineTo(origin.x, coords.y);
		}
		else {
			lineCtx.lineTo(coords.x, origin.y);
		}
	}
	else {
		lineCtx.lineTo(coords.x, coords.y);
	}
	// lineCtx.globalAlpha = 0.2;
	lineCtx.lineWidth = 3;
	lineCtx.stroke();
}

function drawLine(x1, y1, x2, y2) {
	const coords = { x: x1, y: y1 };
	const newCoords = { x: x2, y: y2 };

	if (snap) {
		if (Math.abs(x2 - x1) < Math.abs(y2 - y1)) {
			newCoords.x = x1;
		}
		else {
			newCoords.y = y1;
		}
	}

	canvas.dispatchEvent(createMouseEvent('mousedown', coords, true));
	canvas.dispatchEvent(createMouseEvent('mousemove', newCoords, true));
	canvas.dispatchEvent(createMouseEvent('mouseup', newCoords, true));
}

function createMouseEvent(name, coords, bubbles = false) {
	return new MouseEvent(name, {
		bubbles: bubbles,
		clientX: coords.x,
		clientY: coords.y,
		button: 0
	});
}

const keys = { 32: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
	e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}

function isDrawing() {
	return document.querySelector('.containerTools').offsetParent !== null;
}

let supportsPassive = false;
try {
	window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
		get: function() {
			supportsPassive = true;
			return true;
		}
	}));
}
catch(e) {
	console.log(e);
}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
	window.addEventListener('DOMMouseScroll', preventDefault, false);
	window.addEventListener(wheelEvent, preventDefault, wheelOpt);
	window.addEventListener('touchmove', preventDefault, wheelOpt);
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
	window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
	window.removeEventListener('touchmove', preventDefault, wheelOpt);
	window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

window.addEventListener('blur', hideLineCanvas);