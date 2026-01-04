// ==UserScript==
// @name        Spatter Brush
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     2
// @license		MIT
// @author      Bell
// @copyright   2020, Bell (https://openuserjs.org/users/Bell)
// @description Spatter
// @downloadURL https://update.greasyfork.org/scripts/406203/Spatter%20Brush.user.js
// @updateURL https://update.greasyfork.org/scripts/406203/Spatter%20Brush.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const canvas = document.querySelector('#canvas');

const spatterCanvas = document.createElement('canvas');
const brushTool = document.querySelector('#gameToolsDraw');
const brushSlider = document.querySelector('#gameToolsColorPreview');
spatterCanvas.style.position = 'absolute';
spatterCanvas.style.cursor = 'crosshair';
spatterCanvas.style.width = '100%';
spatterCanvas.style.display = 'none';
spatterCanvas.style.userSelect = 'none';
spatterCanvas.oncontextmenu = () => { return false; };
[spatterCanvas.width, spatterCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(spatterCanvas, canvas);

spatterCanvas.addEventListener('wheel', (e) => {
	const size = parseInt(brushSlider.value);
	if (e.deltaY < 0) {
		setBrushSize(size + 2);
	}
	else {
		setBrushSize(size - 3);
	}
});

let realPos = {};
let canvasHidden = true;

canvas.save = () => {
	canvas.dispatchEvent(new MouseEvent('pointerup', {
		bubbles: true,
		clientX: 0,
		clientY: 0,
		button: 0
	}));
};

document.addEventListener('keydown', (e) => {
	if (!isDrawing()) return;
	if (e.code === 'KeyS' && canvasHidden) {
		brushTool.setAttribute('style', 'background-color: aqua !important');
		spatterCanvas.style.display = '';
		spatterCanvas.style.zIndex = '1';
		disableScroll();
		canvasHidden = false;
	}
});

document.addEventListener('keyup', (e) => {
	if (e.code === 'KeyS' && !canvasHidden) {
		brushTool.removeAttribute('style');
		spatterCanvas.style.display = 'none';
		spatterCanvas.style.zIndex = '';
		canvasHidden = true;
		enableScroll();
		resetLineCanvas();
		document.removeEventListener('pointermove', savePos);
		document.removeEventListener('pointerup', pointerUpDraw);
		canvas.save();
	}
});

function getPressure(e) {
	const pressureOn = !document.querySelector('#pressureButton').classList.contains('off');
	if (e.pointerType !== 'pen' || !pressureOn) return false;
	const minSize = 4;
	const maxSize = 36;
	let size = e.pressure * 45 - 9;
	size = (size < minSize) ? minSize : (size > maxSize) ? maxSize : size;
	return size;
}

function setBrushSize(size) {
	brushSlider.value = size;
	brushSlider.dispatchEvent(new Event('input'));
}

function savePos(e) {
	realPos = getRealPos(e);

	const brushSize = getPressure(e) || parseInt(document.querySelector('#gameToolsColorPreview').value);
	if (e.pointerType === 'pen' && !e.shiftKey) setBrushSize(brushSize);

	const spatterCoords = {
		x: realPos.x + (Math.random() * 6 - 3) * brushSize,
		y: realPos.y + (Math.random() * 6 - 3) * brushSize
	};

	drawPoint(spatterCoords);
	e.preventDefault();
}

spatterCanvas.addEventListener('pointerdown', (e) => {
	realOrigin = getRealPos(e);
	drawingLine = true;
	document.addEventListener('pointerup', pointerUpDraw);
	document.addEventListener('pointermove', savePos);
});


function pointerUpDraw(e) {
	document.removeEventListener('pointermove', savePos);
	document.removeEventListener('pointerup', pointerUpDraw);
	realOrigin = getRealPos(e);
	canvas.save();
	resetLineCanvas();
}

function resetLineCanvas() {
	drawingLine = false;
}

function drawPoint(coords) {
	canvas.dispatchEvent(createMouseEvent('pointerdown', coords));
	canvas.dispatchEvent(createMouseEvent('pointerup', coords));
}

function getRealPos(event) {
	return {
		x: event.clientX,
		y: event.clientY
	};
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
			return 1;
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