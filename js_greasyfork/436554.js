// ==UserScript==
// @name         WaniKani Item Filter
// @namespace    waniKaniItemFilter
// @version      1.26
// @description  Allows to select items that should be filtered during reviews.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1673570
// @run-at       document-start
// @grant        none
// @homepageURL  https://community.wanikani.com/t/54668
// @downloadURL https://update.greasyfork.org/scripts/436554/WaniKani%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436554/WaniKani%20Item%20Filter.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global wkQueue, wkItemInfo */
	/* eslint no-multi-spaces: off */

	const filterKey                  = `waniKaniItemFilter`;
	const autoPassKey                = `waniKaniItemFilterAutoPass`;
	const autoPassWithoutQuestionKey = `waniKaniItemFilterAutoPassWithoutQuestion`;

	let filter   = JSON.parse(localStorage[filterKey  ] || `[]`);
	let autoPass = JSON.parse(localStorage[autoPassKey] || `[]`);
	let autoPassWithoutQuestion = localStorage[autoPassWithoutQuestionKey] === `true`;
	let filterCheckbox                  = null;
	let autoPassCheckbox                = null;
	let autoPassWithoutQuestionCheckbox = null;

	autoPassCleanup();
	init();

	function init() {
		keepSettingsUpdated();
		wkItemInfo.spoiling(`nothing`).appendSideInfoAtBottom(`Item Filter`, checkboxes);
		addCss();

		wkQueue.on(`review,extraStudy`).addFilter(applyFilter);
	}

	function autoPassCleanup() {
		let oldLength = autoPass.length;
		autoPass = autoPass.filter(a => filter.includes(a));
		if (autoPass.length === oldLength) return;

		localStorage[autoPassKey] = JSON.stringify(autoPass);
		if (autoPassCheckbox?.checked) autoPassCheckbox.checked = autoPass.includes(autoPassCheckbox.dataset.id);
	}

	function checkboxes(state) {
		let div                          = document.createElement(`div`);
		let filterLabel                  = document.createElement(`label`);
		let autoPassLabel                = document.createElement(`label`);
		let autoPassWithoutQuestionLabel = document.createElement(`label`);
		filterCheckbox                   = document.createElement(`input`);
		autoPassCheckbox                 = document.createElement(`input`);
		autoPassWithoutQuestionCheckbox  = document.createElement(`input`);
		filterCheckbox                 .type      = `checkbox`;
		autoPassCheckbox               .type      = `checkbox`;
		autoPassWithoutQuestionCheckbox.type      = `checkbox`;
		filterCheckbox         .dataset.id        = state.id;
		autoPassCheckbox       .dataset.id        = state.id;
		filterCheckbox                 .checked   = filter  .includes(state.id);
		autoPassCheckbox               .checked   = autoPass.includes(state.id);
		autoPassWithoutQuestionCheckbox.checked   = autoPassWithoutQuestion;
		filterCheckbox                 .id        = `item-filter-checkbox`;
		autoPassCheckbox               .id        = `item-filter-auto-pass-checkbox`;
		autoPassWithoutQuestionCheckbox.id        = `item-filter-auto-pass-without-question-checkbox`;
		filterLabel                    .htmlFor   = `item-filter-checkbox`;
		autoPassLabel                  .htmlFor   = `item-filter-auto-pass-checkbox`;
		autoPassWithoutQuestionLabel   .htmlFor   = `item-filter-auto-pass-without-question-checkbox`;
		filterLabel                    .innerText = `Skip in reviews`;
		autoPassLabel                  .innerText = `Automatically pass review when skipping`;
		autoPassWithoutQuestionLabel   .innerText = `Finish all auto-pass items without confirmation prompt`;

		filterCheckbox.addEventListener(`change`, e => {
			let id = parseInt(e.currentTarget.dataset.id);
			if ( e.currentTarget.checked && !filter.includes(id)) { filter                      .push(id); localStorage[filterKey] = JSON.stringify(filter); }
			if (!e.currentTarget.checked &&  filter.includes(id)) { filter = filter.filter(f => f !== id); localStorage[filterKey] = JSON.stringify(filter); }
			if (!e.currentTarget.checked) autoPassCleanup();
		});
		autoPassCheckbox.addEventListener(`change`, e => {
			let id = parseInt(e.currentTarget.dataset.id);
			if ( e.currentTarget.checked && !autoPass.includes(id)) { autoPass                        .push(id); localStorage[autoPassKey] = JSON.stringify(autoPass); }
			if (!e.currentTarget.checked &&  autoPass.includes(id)) { autoPass = autoPass.filter(a => a !== id); localStorage[autoPassKey] = JSON.stringify(autoPass); }
		});
		autoPassWithoutQuestionCheckbox.addEventListener(`change`, e => {
			autoPassWithoutQuestion = e.currentTarget.checked;
			localStorage[autoPassWithoutQuestionKey] = autoPassWithoutQuestion;
		});

		div.classList.add(`checkbox-grid`);
		div.append(filterCheckbox, filterLabel, autoPassCheckbox, autoPassLabel, autoPassWithoutQuestionCheckbox, autoPassWithoutQuestionLabel);
		return div;
	}

	function keepSettingsUpdated() {
		addEventListener(`storage`, e => {
			if (e.key === filterKey  ) { filter   = JSON.parse(e.newValue); if (  filterCheckbox)   filterCheckbox.checked = filter  .includes(parseInt(  filterCheckbox.dataset.id)); }
			if (e.key === autoPassKey) { autoPass = JSON.parse(e.newValue); if (autoPassCheckbox) autoPassCheckbox.checked = autoPass.includes(parseInt(autoPassCheckbox.dataset.id)); }
			if (e.key === autoPassWithoutQuestionKey) { autoPassWithoutQuestion = e.newValue === `true`; if (autoPassWithoutQuestionCheckbox) autoPassWithoutQuestionCheckbox.checked = autoPassWithoutQuestion; }
		});
	}

	function applyFilter(list, currentState) {
		let isExtraStudy = currentState.on === `extraStudy`;
		let currentAutoPass = list.filter(item => autoPass.includes(item.id));
		let one = currentAutoPass.length === 1;
		if (currentAutoPass.length !== 0 && (autoPassWithoutQuestion || (!isExtraStudy && confirm(`Review queue contains ${currentAutoPass.length} auto-pass item${one ? `` : `s`}. Automatically answer ${one ? `it` : `them`} correctly now?`)))) {
			passReviews(currentAutoPass.map(item => item.id || item), isExtraStudy);
			list = list.filter(item => !autoPass.includes(item.id));
		}
		let afterFilter = list.filter(item => !filter.includes(item.id));
		let filteredCount = list.length - afterFilter.length;
		one = filteredCount === 1;
		let skip = filteredCount !== 0 && confirm(`${isExtraStudy ? `Extra study` : `Review`} queue contains ${filteredCount} filtered item${one ? `` : `s`}. Skip ${one ? `it` : `them`}?`);
		return skip ? afterFilter : list;
	}

	function passReviews(ids, isExtraStudy) {
		if (ids.length === 0 || isExtraStudy) return;
		let data = {counts: ids.map(id => ({id, meaning: 0, reading: 0}))};
		fetch(`/subjects/review`, {
			method: `POST`,
			headers: {
				"Content-Type": `application/json; charset=utf-8`,
				"X-CSRF-Token": document.querySelector(`meta[name=csrf-token]`).content
			},
			body: JSON.stringify(data)
		});
		ids.forEach(id => window.dispatchEvent(new CustomEvent(`didCompleteSubject`, {detail: {subjectWithStats: {subject: {id}}}})));
	}

	async function addCss() {
		let style = document.createElement(`style`);
		style.textContent = `
			.checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, 1.5em minmax(min(20em, calc(100% - 1.5em)), 1fr)); align-items: baseline; }
			.checkbox-grid input:not(:checked) + label ~ * { display: none; }`;
		if (!document.head) await domReady();
		document.head.appendChild(style);
	}

	function domReady() {
		if (document.readyState === `interactive` || document.readyState === `complete`) return true;
		return new Promise(resolve => document.addEventListener(`readystatechange`, resolve, {once: true}));
	}
})();
