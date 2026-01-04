// ==UserScript==
// @name         WaniKani Later Crabigator
// @namespace    latercrabigator
// @version      1.24
// @description  Adds a button for pushing the current review item back in the review queue.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1673570
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400090/WaniKani%20Later%20Crabigator.user.js
// @updateURL https://update.greasyfork.org/scripts/400090/WaniKani%20Later%20Crabigator.meta.js
// ==/UserScript==

(function() {
    "use strict";

	/* global wkof, wkQueue */
	/* eslint no-multi-spaces: "off" */

	let bSkip = null;
	let iUserResponse = null;
	let keyDownHandlerWithAnkiCheck    = null;
	let keyDownHandlerWithoutAnkiCheck = null;

	addCss();
	init();

	// it seems like Turbo does not move the SVG and the .wk-modal element into document.body, so let's ignore it
	function relevantRootElementChildren(rootElement) {
		return [...rootElement?.children ?? []].filter(c => c.tagName !== `svg` && !c.classList.contains(`wk-modal`));
	}

	document.addEventListener("turbo:before-render", async e => {
		let observer = new MutationObserver(m => {
			if (relevantRootElementChildren(m[0].target).length > 0) return;
			observer.disconnect();
			observer = null;
			init();
		});
		observer.observe(e.detail.newBody, {childList: true});
	});

	window.addEventListener(`willShowNextQuestion`, () => {
		if (!bSkip) return;
		bSkip.disabled = true;
		setTimeout(() => { bSkip.disabled = false; });
	});

	function init() {
		if (!document.URL.includes(`wanikani.com/subjects/review`) && !document.URL.includes(`wanikani.com/subjects/extra_study`) && !document.URL.includes(`wanikani.com/subjects/lesson/quiz`) && !/wanikani.com\/recent-mistakes\/.*quiz/.test(document.URL)) return;

		iUserResponse = document.querySelector(`input.quiz-input__input`);
		keyDownHandlerWithAnkiCheck    = keyDownHandler.bind(null, iUserResponse, true);
		keyDownHandlerWithoutAnkiCheck = keyDownHandler.bind(null, iUserResponse, false);

		addSettingsMenu();
		addButton();
	}

	function toggleKeyListener(enabled) {
		const funcName = enabled ? `addEventListener` : `removeEventListener`;
		document     ?.[funcName](`keydown`, keyDownHandlerWithAnkiCheck);
		iUserResponse?.[funcName](`keydown`, keyDownHandlerWithoutAnkiCheck);
	}

	function keyDownHandler(iUserResponse, ankiModeCheck, ev) {
		if (ev.key !== `Enter` || iUserResponse.value !== `` || ev.ctrlKey || ev.altKey || ev.metaKey || (ankiModeCheck && !isInAnkiMode())) return;
		bSkip.click();
		ev.stopPropagation();
		ev.preventDefault();
	}

	function addButton() {
		bSkip = document.createElement(`button`);
		bSkip.textContent = `Later`;
		bSkip.classList.add(`later-crabigator`);
		bSkip.addEventListener(`click`, e => { e.preventDefault(); e.stopPropagation(); pushBack(); });
		document.querySelector(`[data-quiz-input-target='form']`).appendChild(bSkip);
	}

	function addCss() {
		let style = document.createElement(`style`);
		style.textContent = `
			button.later-crabigator { right: calc(3em - 10px); position: absolute; border: none; background: none; font-size: 22px; top: 10px; bottom: 10px; cursor: pointer; }
			button.later-crabigator.left { left: 18px; right: auto; }
			.quiz-input__input-container[correct] button.later-crabigator { display: none; }`;
		document.head.appendChild(style);
	}

	async function pushBack() {
		if (isInAnkiMode() && iUserResponse.value !== ``) return;

		wkQueue.applyManipulation(q => q.concat(q.shift()));
	}

	// WK Anki Mode compatibility:

	function isInAnkiMode() {
		return !(document.getElementById(`WKANKIMODE_anki`)?.textContent.endsWith(`Off`) ?? true) ||
			document.getElementById(`anki-mode`)?.classList.contains(`anki-active`);
	}

	// Optional wkof settings menu

	async function addSettingsMenu() {
		if (typeof wkof !== `object`) return;

		const defaultSettings = {
			skipWhenAnswerEmpty: false,
			buttonLeft: false
		};

		wkof.include(`Menu,Settings`);
		await wkof.ready(`Menu,Settings`);
		wkof.Menu.insert_script_link({name: `later_crabigator`, submenu: `Settings`, title: `Later Crabigator`, on_click: openSettings});
		await wkof.Settings.load(`later_crabigator`, defaultSettings);
		applySettings();
	}

	function openSettings() {
		let dialog = new wkof.Settings({
			script_id: `later_crabigator`,
			title: `Later Crabigator Settings`,
			on_save: applySettings,
			content: {
				skipWhenAnswerEmpty: {type: `checkbox`, label: `Skip when answer empty`, hover_tip: `If enabled, submitting an empty answer automatically clicks the "Later" button.`},
				buttonLeft         : {type: `checkbox`, label: `Left-aligned button`   , hover_tip: `Place the "Later" button at the left side of the input box.`}
			}
		});
		dialog.open();
	}

	function applySettings() {
		if (typeof wkof !== `object`) return;

		toggleKeyListener(wkof?.settings?.later_crabigator?.skipWhenAnswerEmpty);
		bSkip?.classList.toggle(`left`, wkof?.settings?.later_crabigator?.buttonLeft);
	}
})();
