// ==UserScript==
// @name        Radial Tool
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.3.2
// @license		MIT
// @author      Bell
// @description Weeeoo
// @downloadURL https://update.greasyfork.org/scripts/410823/Radial%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/410823/Radial%20Tool.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* eslint-disable no-undef */

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const inputEvent = new Event('input');
const lineCanvas = document.createElement("canvas");
const brushTool = document.querySelector("#gameToolsDraw");
const brushSlider = document.querySelector("#gameToolsColorPreview");
const lineCtx = lineCanvas.getContext("2d");
lineCanvas.style.position = "absolute";
lineCanvas.style.cursor = "crosshair";
lineCanvas.style.width = "100%";
lineCanvas.style.display = "none";
lineCanvas.style.userSelect = "none";
lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);

lineCanvas.addEventListener('wheel', (e) => {
	const size = parseInt(brushSlider.value); 
	if (e.deltaY < 0) {
		setBrushSize(size + 4);
	} else {
		setBrushSize(size - 4);
	}
});

let realOrigin = {};
let realPos = {};
let canvasHidden = true;
let drawingLine = false;

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
	if (e.code === "KeyQ" && canvasHidden) {
        brushTool.setAttribute("style", "background-color: red !important");
		lineCanvas.style.display = "";
		disableScroll();
		canvasHidden = false;
	}
});

document.addEventListener('keyup', (e) => {
	if (e.code === "KeyQ" && !canvasHidden) {
        brushTool.removeAttribute("style");
		lineCanvas.style.display = "none";
		canvasHidden = true;
		enableScroll();
		resetLineCanvas();
		document.removeEventListener('pointermove', savePos);
		document.removeEventListener('pointerup', pointerUpDraw);
		
    	canvas.dispatchEvent(createMouseEvent("pointerup", realPos, true));
	}
});

function getPressure(e) {
	const pressureOn = !document.querySelector("#pressureButton").classList.contains('off');
	if (e.pointerType !== 'pen' || !pressureOn) return false;
	const minSize = 4;
	const maxSize = 36;
	let size = e.pressure * 45 - 9;
	size = (size < minSize) ? minSize : (size > maxSize) ? maxSize : size;
	return size;	
}

function setBrushSize(size) {
	brushSlider.value = size;
	brushSlider.dispatchEvent(inputEvent);
}

function savePos(e) {
	realPos = getRealPos(e);
	const brushSize = getPressure(e);
	if (brushSize) setBrushSize(brushSize);
	drawLine(realOrigin.x, realOrigin.y, realPos.x, realPos.y);
	e.preventDefault();
}

lineCanvas.addEventListener('pointerdown', (e) => {
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

function getRealPos(event) {
    return {
        x: event.clientX,
        y: event.clientY
    };
}

function drawLine(x1, y1, x2, y2) {
	let coords = { x: x1, y: y1 };
	let newCoords = { x: x2, y: y2 };
	
    canvas.dispatchEvent(createMouseEvent("pointerdown", coords));
    canvas.dispatchEvent(createMouseEvent("pointermove", newCoords));
    canvas.dispatchEvent(createMouseEvent("pointerup", newCoords));
}

function createMouseEvent(name, pos, bubbles = false) {
    return new MouseEvent(name, {
        bubbles: bubbles,
        clientX: pos.x,
        clientY: pos.y,
        button: 0
    });
}

function wrap(toWrap, wrapper) {
	toWrap.parentNode.appendChild(wrapper);
	wrapper.appendChild(toWrap);
	return wrapper;
}

const keys = {32: 1, 37: 1, 38: 1, 39: 1, 40: 1};

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
    return document.querySelector("#gameTools").style.display !== "none" &&
           document.querySelector("body > div.game").style.display !== "none" &&
           document.activeElement.tagName !== "INPUT";
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
	window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
		get: function () { supportsPassive = true; } 
	}));
} catch(e) {}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt);
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}