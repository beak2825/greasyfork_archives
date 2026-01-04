// ==UserScript==
// @name         Notion Fix
// @namespace    https://github.com/alanleungcn/notion-fix
// @version      1.3
// @author       Alan Leung
// @description  Fix bugs in Notion
// @match        https://www.notion.so/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430626/Notion%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/430626/Notion%20Fix.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let preView = null;
	let curView = null;
	const checkInterval = 100;
	const viewList = [
		'table',
		'board',
		'timeline',
		'calendar',
		'gallery',
		'list',
	];

	const init = setInterval(() => {
		queryView();
		if (curView) {
			clearInterval(init);
			applyFix();
			fixFirefoxScrollbarWidth();
		}
	}, checkInterval);

	window.addEventListener('click', () => {
		applyFix();
	});

	// function fixTimelineDividerPosition() {
	// 	document.querySelector('.pseudoSelection').style.position = '';
	// }

	function fixScrollbarPosition() {
		document.querySelector(
			'.notion-scroller.vertical.horizontal'
		).scrollLeft = 0;
	}

	function fixFirefoxScrollbarWidth() {
		const style = document.createElement('style');
		style.textContent = `.notion-scroller { scrollbar-width: thin }`;
		document.head.append(style);
	}

	function queryView() {
		viewList.forEach((view, i) => {
			if (document.querySelector(`.notion-${view}-view`)) {
				curView = viewList[i];
			}
		});
	}

	function applyFix() {
		requestAnimationFrame(() => {
			queryView();
			// if (curView === 'timeline') {
			// 	fixTimelineDividerPosition();
			// }
			if (curView !== preView && preView === 'timeline') {
				fixScrollbarPosition();
			}
			preView = curView;
		});
	}
})();
