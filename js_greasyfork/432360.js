// ==UserScript==
// @name         Draggable Reference Line
// @namespace    https://greasyfork.org/users/193469
// @description  Designed for reading long articles, it helps remember the current reading progress.
// @license      MIT
// @version      1.1.2
// @author       Rui LIU (@liurui39660)
// @match        *://*/*
// @icon         https://icons.duckduckgo.com/ip2/example.com.ico
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/432360/Draggable%20Reference%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/432360/Draggable%20Reference%20Line.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const height = 2; // px, height of the visible line
	const padding = 2; // px, additional draggable area above and below the line, not the sum of them
	const color = 'red'; // or #-string

	const body = document.getElementsByTagName('body')[0];
	const line = document.createElement('div');
	const initPos = -padding - height / 2;
	line.textContent = '#DraggableReferenceLine';
	line.style = `margin: 0; padding: ${padding}px 0; cursor: n-resize; font-size: 0; color: #fff0; background: ${color}; background-clip: content-box; box-sizing: content-box; width: 100%; height: ${height}px; position: absolute; top: ${(localStorage[`DraggableLine_${window.location.pathname}${window.location.search}`] || initPos)}px; z-index: 2147483647;`;

	const reset = () => {
		line.style.top = `${initPos}px`;
		localStorage.removeItem(`DraggableLine_${window.location.pathname}${window.location.search}`);
	}
	let callbackMouseMove = ev => {
		line.style.top = `${ev.pageY + initPos}px`; // initPos is also the offset to line center
	};
	let callbackMouseUp = ev => {
		if (ev.detail === 1) { // Don't overwrite dblclick
			body.style.cursor = null;
			const top = parseFloat(line.style.top);
			top <= initPos ? reset() : localStorage[`DraggableLine_${window.location.pathname}${window.location.search}`] = top;
			[onmouseup, onmousemove, callbackMouseUp, callbackMouseMove] = [callbackMouseUp, callbackMouseMove, onmouseup, onmousemove];
		}
	};
	line.addEventListener('mousedown', ev => {
		if (ev.detail === 1) {
			ev.preventDefault(); // Don't select text
			body.style.cursor = 'n-resize'; // I know setPointerCapture, but see https://stackoverflow.com/questions/57566090/setpointercapture-behaves-differently-in-chrome-and-firefox
			[onmouseup, onmousemove, callbackMouseUp, callbackMouseMove] = [callbackMouseUp, callbackMouseMove, onmouseup, onmousemove];
		}
	});
	line.addEventListener('dblclick', reset);

	body.appendChild(line);
})();
