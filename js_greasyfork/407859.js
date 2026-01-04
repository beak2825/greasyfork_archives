// ==UserScript==
// @name        🍳 Zoom
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.2
// @author      Bell
// @description 🍳 and 🔍. Space + drag to pan, Z to zoom, and shift + Z to reset
// @run-at      body-end
// @downloadURL https://update.greasyfork.org/scripts/407859/%F0%9F%8D%B3%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/407859/%F0%9F%8D%B3%20Zoom.meta.js
// ==/UserScript==

// Options
const options = {
	onlyFreedraw: true,
	resetOnZoomOut: true
}

//////
const canvas = document.querySelector('#canvas');
const zoomContainer = document.createElement('div');
const sheet =
  window.document.styleSheets[window.document.styleSheets.length - 1];
const resetObserver = new MutationObserver(resetCanvas);
const panContainer = document.createElement('div');

let panning = false;
const startPos = {};
let canvasOffset = {};
let zoomed = false;

(function init() {
	panContainer.style.position = 'relative';
	panContainer.style.transition = 'transform 0.1s ease';
	zoomContainer.style.overflow = 'hidden';
	zoomContainer.id = 'zoomContainer';
	sheet.insertRule('.dark #zoomContainer { background: #2C2F33}');
	sheet.insertRule('#zoomContainer { background: #c8c8c8}');

	wrap(canvas, zoomContainer);
	wrap(canvas, panContainer);
	resetCanvas();

	resetObserver.observe(document.querySelector('#gameSticky'), {
		childList: true,
	});
	
	document.addEventListener('keydown', keyDown, false);
	document.addEventListener('keyup', stopPanning, false);
	zoomContainer.addEventListener('pointerdown', getStartPos, true);
	zoomContainer.addEventListener('pointermove', moveCanvas, true);
	document.addEventListener('pointerup', stopMoving, false);
})();

function wrap(toWrap, wrapper) {
	toWrap.parentNode.appendChild(wrapper);
	wrapper.appendChild(toWrap);
}

function regenerateCursor() {
	const selectedTool = document.querySelector('.gameToolsSelected');
	selectedTool.id === 'gameToolsDraw'
		? selectedTool.nextSibling.click()
		: selectedTool.previousSibling.click();
	selectedTool.click();
}

function stopPanning(e) {
	if (e.code !== 'Space' || !panning) return;
	e.preventDefault();
	regenerateCursor();
	zoomContainer.style.cursor = 'default';
	panning = false;
}

function keyDown(e) {
	if (!isDrawing() || !isFreeDraw() && options.onlyFreedraw) return;
	switch (e.code) {
	case 'Space':
		if (e.shiftKey) return;
		startPanning();
		e.preventDefault();
		break;
	case 'KeyZ':
		if (e.ctrlKey) {
			return;
		}
		else if (e.shiftKey && !options.resetOnZoomOut) {
		  	resetCanvas();
		  	e.stopImmediatePropagation();
		  	return;
		}
		toggleZoom();
		e.stopImmediatePropagation();
	}
}

function toggleZoom() {
	panContainer.style.transform = zoomed ? '' : 'scale(2)';
	if (zoomed && options.resetOnZoomOut) resetCanvas();
  	else zoomed = !zoomed;
}

function startPanning() {
	if (panning || !zoomed && options.resetOnZoomOut) return;
	canvas.style.cursor = 'grab';
	zoomContainer.style.cursor = 'grab';
	panning = true;
}

function moveCanvas(e) {
	if (!panning || !e.buttons) return;
	const offset = {};
	offset.x = e.clientX - startPos.x;
	offset.y = e.clientY - startPos.y;
	panContainer.style.left = `${canvasOffset.x + offset.x}px`;
	panContainer.style.top = `${canvasOffset.y + offset.y}px`;
	e.preventDefault();
	e.stopImmediatePropagation();
}

function getStartPos(e) {
	if (!panning) return;
	startPos.x = e.clientX;
	startPos.y = e.clientY;
	canvas.style.cursor = 'grabbing';
	zoomContainer.style.cursor = 'grabbing';
	e.preventDefault();
	e.stopImmediatePropagation();
}

function stopMoving(e) {
	canvasOffset.x = parseInt(panContainer.style.left.match(/-?\d+/)[0]);
	canvasOffset.y = parseInt(panContainer.style.top.match(/-?\d+/)[0]);
	if (panning) {
		canvas.style.cursor = 'grab';
		zoomContainer.style.cursor = 'grab';
		e.stopImmediatePropagation();
	}
}

function resetCanvas() {
	panContainer.style.left = '0px';
	panContainer.style.top = '0px';
	panContainer.style.transform = '';
	zoomed = false;
	canvasOffset = { x: 0, y: 0 };
}

function isDrawing() {
	return (
		document.querySelector('#gameTools').style.display !== 'none' &&
    document.querySelector('body > div.game').style.display !== 'none' &&
    document.activeElement !== document.querySelector('#gameChatInput')
	);
}

function isFreeDraw() {
	return (
		canvas.style.display !== 'none' &&
    document.querySelector('#gameClock').style.display === 'none' &&
    document.querySelector('#gameSettings').style.display === 'none'
	);
}