// ==UserScript==
// @name        Resizable Canvas
// @namespace   Violentmonkey Scripts
// @match       https://sketchful.io/
// @grant       none
// @version     3.1
// @author      Bell
// @description Change the size of the canvas
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/407860/Resizable%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/407860/Resizable%20Canvas.meta.js
// ==/UserScript==

const maxWidth = '110vw';
const headerOn = false;

const canvas = document.querySelector('#gameCanvas');
const gameParent = document.querySelector('.gameParent');
const header = document.querySelector('.gameHeader');
const playersList = document.querySelector('#gamePlayersList');
const innerCanvas = document.querySelector('#canvas');
const columnRight = document.querySelector('.columnRight');

const canvasObserver = new MutationObserver(() => {
	if (canvas.style.display !== 'none') {
		gameParent.style.maxWidth = maxWidth;
		gameParent.style.width = localStorage.gameParentWidth || '180vh';
		gameParent.style.resize = 'horizontal';
	}
	else {
		gameParent.style.maxWidth = '';
		gameParent.style.resize = '';
	}
});

function onResize() {
	fixHeader();
	if (gameParent.classList.contains('gameParentSettings')) return;
	localStorage.gameParentWidth = gameParent.style.width;
}

function fixHeader() {
	const height = gameParent.getBoundingClientRect().height;
	const canvasHeight =
		innerCanvas.getBoundingClientRect().height ||
		columnRight.getBoundingClientRect().height;
	playersList.style.maxHeight = `${canvasHeight}px`;
	if (window.innerHeight - height > 180 && headerOn) header.style.display = '';
	else header.style.display = 'none';
}

(function init() {
	header.remove();
	document.querySelector('.game').appendChild(header);
	document.querySelector('.gameContainer').style.marginTop = '0px';
	gameParent.setAttribute('style',
		`overflow: hidden; left: 50%; top: 50%; 
		 transform: translate(-50%, -50%); position: absolute;
		 padding-top: 12px`
	);

	new ResizeObserver(onResize).observe(gameParent);
	canvasObserver.observe(document.querySelector('.game'), { attributes: true });
	canvasObserver.observe(canvas, { attributes: true });
	$('[id^="money"]').remove();
})();

const interface = document.querySelector("#gameInterface");
interface.style.cursor = "move";
interface.addEventListener('mousedown', (e) => {
	if (e.target !== interface) return;
	startDrag();
});

function startDrag() {
	document.addEventListener('mouseup', finishDrag);
	document.addEventListener('mousemove', moveGameParent);
}

function moveGameParent(e) {
	gameParent.style.top = (gameParent.offsetTop + e.movementY) + "px";
}

function finishDrag() {
	document.removeEventListener('mouseup', finishDrag);
	document.removeEventListener('mousemove', moveGameParent);
}