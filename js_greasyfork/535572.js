// ==UserScript==
// @name         Waterlooworks New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  just lemme open job postings in new tab
// @author       solstice23
// @match        https://waterlooworks.uwaterloo.ca/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535572/Waterlooworks%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/535572/Waterlooworks%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';


	// const handleClick = function(event) {
	// 	if (event.target.tagName !== 'A') return;
	// 	if (!event.target.closest('.table__row--body')) return;
	// 	if (!event.target.closest('#dataViewerPlaceholder')) return;
	// 	if (event.type === 'click' && !event.ctrlKey) return;
	// 	if (event.type === 'mouseup' && event.button !== 0) return;
	// 	event.preventDefault();
	// 	event.stopImmediatePropagation();
	// 	const tr = event.target.closest('.table__row--body');
	// 	const fields = Array.from(tr.querySelectorAll("& > td > span > span")).map(td => td.innerText);
	// 	const id = fields.filter(field => field.match(/^[0-9]+$/))[0]; // in case the order is different
	// 	const token = window.getPostingOverview.toString().match(/action: '([0-9a-zA-Z_-]+)',/)[1];
	// }


	// document.addEventListener('click', handleClick, true);
	// document.addEventListener('mouseup', handleClick, true);

	// loading overlay for job posting view
	const addLoadingOverlay = () => {
		const css = document.createElement('style');
		css.innerHTML = `
			#loading-overlay {
				position: fixed;
				inset: 0;
				background-color: #fff;
				z-index: 100000000;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				gap: 36px;
			}
			#loading-overlay div {
				font-size: 24px;
				color: #232323;
				user-select: none;
			}
			html, body {
				overflow: hidden;
			}
		`;
		const loadingOverlay = document.createElement('div');
		loadingOverlay.id = 'loading-overlay';
		loadingOverlay.innerHTML = `
			<svg width="80" height="80" stroke="#232323" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g class="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle></g></svg>
			<div>Loading job...</div>
		`;
		document.documentElement.appendChild(css);
		document.documentElement.appendChild(loadingOverlay);
	}

	// fullscreen css of job viewer
	const addFullScreenCss = () => {
		const css = document.createElement('style');
		css.innerHTML = `
			.modal .modal__inner {
				position: fixed;
				inset: 0;
				max-width: unset;
				max-height: unset;
				margin: 0;
				height: unset;
				border-radius: 0 !important;
			}
			.modal .floating--action-bar > button:last-child {
				display: none;
			}
			.modal .ps {
				overflow-y: auto !important;
			}
			.modal .ps__rail-y {
				display: none !important;
			}
		`;
		document.documentElement.appendChild(css);
		// disable perfect scroll
		document.addEventListener('wheel', function(event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
		}, true);
		document.addEventListener('keydown', function(event) {
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
		}, true);
	}


	// handle attributes (job posting view)
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('id')) {
		addLoadingOverlay();
		addFullScreenCss();
		const id = parseInt(urlParams.get('id'));
		// invoke job viewer
		document.addEventListener('DOMContentLoaded', function() {
			// we have to wait because dataViewerApp always check the loaded cache first
			const _consoleError = console.error;
			const tryLoading = () => dataViewerApp.$dataViewer.viewRecord(id);
			console.error = function(...args) {
				if (args[0] === 'Invalid row ID') {
					setTimeout(tryLoading, 10);
				}
				_consoleError.apply(console, args);
			};
			tryLoading();
		}, { once: true });
	}


	// replace all job title links
	const replaceLinks = function(event) {
		if (event.target.tagName !== 'A') return;
		if (event.target.classList.contains('refined-link')) return;
		if (!event.target.closest('.table__row--body')) return;
		if (!event.target.closest('#dataViewerPlaceholder')) return;

		// get job id
		const tr = event.target.closest('.table__row--body');
		const fields = Array.from(tr.querySelectorAll("& > td > span > span")).map(td => td.innerText);
		const id = fields.filter(field => field.match(/^[0-9]+$/))[0]; // in case the order is different

		// gererate new link
		let newUrl = new URL(document.location.href);
		// add parameter id=id
		newUrl.searchParams.set('id', id);

		// create new link, clone the old one
		const newLink = document.createElement('a');
		newLink.innerHTML = event.target.innerHTML;
		event.target.attributes.forEach(attr => newLink.setAttribute(attr.name, attr.value));

		newLink.classList.add('refined-link');
		newLink.href = newUrl.href;

		// add new link after the old one
		event.target.parentNode.appendChild(newLink);

		// hide old link
		event.target.style.display = 'none';
	}


	// too lazy to use mutation observer
	document.addEventListener('focus', replaceLinks, true);
	document.addEventListener('mouseover', replaceLinks, true);


	// handle normal click, fallback to opening in the same tab
	document.addEventListener('click', function(event) {
		if (!event.target.classList.contains('refined-link')) return;
		const originalLink = event.target.parentNode.querySelector('a:not(.refined-link)');
		if (originalLink) {
			event.preventDefault();
			originalLink.click();
		}
	}, true);


})();
