// ==UserScript==
// @name        CircleCI Workflow Panner
// @namespace   antontsvil
// @match       *://app.circleci.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @require     https://unpkg.com/arrive@2.4.1/src/arrive.js
// @version     1.1
// @license     MIT
// @author      antontsvil@gmail.com
// @description Pan across large workflow charts using your mouse instead of relying on the scrollbars. Set naturalScroll to false to disable inverted panning.
// @downloadURL https://update.greasyfork.org/scripts/463894/CircleCI%20Workflow%20Panner.user.js
// @updateURL https://update.greasyfork.org/scripts/463894/CircleCI%20Workflow%20Panner.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

const graphSelector = "[data-cy='workflow-graph']";
const graph = () => document.querySelector(graphSelector);
const html = () => document.querySelector('html');

let isDragging = false;
const dragStart = () => {
	isDragging = true;
	const gel = graph();
	gel.style.cursor = 'move';
	gel.style.userSelect = 'none';
};
const dragStop = () => {
	isDragging = false;
	const gel = graph();
	gel.style.cursor = 'default';
	gel.style.userSelect = 'initial';
};

const b = document.querySelector('body');
b.arrive(graphSelector, async () => {
	let naturalScroll = await GM.getValue('naturalScroll');
	if (naturalScroll!== false && naturalScroll !== true) {
		await GM.setValue('naturalScroll', true);
    naturalScroll = true;
	}
	const gel = graph();
	gel.addEventListener('mousedown', ({ target, button }) => {
		if (target.tagName === 'svg' && button === 0) {
			dragStart();
		}
	});
	gel.addEventListener('mouseup', (event) => {
		dragStop();
	});
	gel.addEventListener('mouseout', (event) => {
		if (event.relatedTarget === gel) {
			dragStop();
		}
	});
	gel.addEventListener('mousemove', (event) => {
		const el = graph();
		const rightSide = el.scrollWidth - el.clientWidth;
		const horizontalScroll = {
			left: naturalScroll
				? el.scrollLeft - event.movementX
				: el.scrollLeft + event.movementX,
		};
		const verticalScroll = {
			top: naturalScroll
				? html().scrollTop - event.movementY
				: html().scrollTop + event.movementY,
		};
		if (isDragging) {
			el.scrollTo(horizontalScroll);
			html().scrollTo(verticalScroll);
		}
	});
});
