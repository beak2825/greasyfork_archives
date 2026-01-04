// ==UserScript==
// @name        Line Drawing Tool
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.3.3
// @license		MIT
// @author      Bell
// @description Press Space to snap to right angles
// @downloadURL https://update.greasyfork.org/scripts/408292/Line%20Drawing%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/408292/Line%20Drawing%20Tool.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const canvas = document.querySelector('#canvas');

const lineCanvas = document.createElement('canvas');
const lineCtx = lineCanvas.getContext('2d');
lineCanvas.style.position = 'absolute';
lineCanvas.style.cursor = 'crosshair';
lineCanvas.style.width = '100%';
lineCanvas.style.display = 'none';
lineCanvas.style.userSelect = 'none';
lineCanvas.style.zIndex = '2';
lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);

lineCanvas.clear = () => {
	lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
};

let origin = {};
let realOrigin = {};
let previewPos = {};
let realPos = {};
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
		document.dispatchEvent(createMouseEvent('pointermove', realPos));
	}
});

document.addEventListener('keyup', (e) => {
	if (e.code === 'ShiftLeft' && !canvasHidden) {
		lineCanvas.style.display = 'none';
		canvasHidden = true;
		enableScroll();
		resetLineCanvas();
		document.removeEventListener('pointermove', savePos);
		document.removeEventListener('pointerup', pointerUpDraw);
	}
	else if (e.code === 'Space' && snap) {
		snap = false;
		document.dispatchEvent(createMouseEvent('pointermove', realPos));
	}
});

function savePos(e) {
	previewPos = getPos(e);
	realPos = getRealPos(e);

	if (canvasHidden || !drawingLine) return;
	lineCanvas.clear();
	drawPreviewLine(previewPos);
	e.preventDefault();

}

lineCanvas.addEventListener('pointerdown', (e) => {
	origin = getPos(e);
	realOrigin = getRealPos(e);
	drawingLine = true;
	document.addEventListener('pointerup', pointerUpDraw);
	document.addEventListener('pointermove', savePos);
});


function pointerUpDraw(e) {
	document.removeEventListener('pointermove', savePos);
	document.removeEventListener('pointerup', pointerUpDraw);
	drawLine(realOrigin.x, realOrigin.y, realPos.x, realPos.y);
	previewPos = getPos(e);
	realPos = getRealPos(e);
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

function drawPreviewLine(pos) {
	lineCtx.beginPath();
	lineCtx.moveTo(origin.x, origin.y);

	if (snap) {
		if (Math.abs(pos.x - origin.x) < Math.abs(pos.y - origin.y)) {
			lineCtx.lineTo(origin.x, pos.y);
		}
		else {
			lineCtx.lineTo(pos.x, origin.y);
		}
	}
	else {
		lineCtx.lineTo(pos.x, pos.y);
	}

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

	canvas.dispatchEvent(createMouseEvent('pointerdown', coords));
	canvas.dispatchEvent(createMouseEvent('pointermove', newCoords));
	canvas.dispatchEvent(createMouseEvent('pointerup', newCoords, true));
}

function createMouseEvent(name, pos, bubbles = false) {
	return new MouseEvent(name, {
		bubbles: bubbles,
		clientX: pos.x,
		clientY: pos.y,
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
	return document.querySelector('#gameTools').style.display !== 'none' &&
           document.querySelector('body > div.game').style.display !== 'none' &&
           document.activeElement.tagName !== 'INPUT';
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