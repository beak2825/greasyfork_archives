// ==UserScript==
// @name         Extra Study: Burned Items
// @namespace    extraStudyBurnedItems
// @version      1.2
// @description  Adds an extra study preset for burned items.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/
// @match        https://preview.wanikani.com/dashboard
// @match        https://preview.wanikani.com/extra_study/session*
// @require      https://greasyfork.org/scripts/441518-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.js?version=1032684
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440927/Extra%20Study%3A%20Burned%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/440927/Extra%20Study%3A%20Burned%20Items.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global wkof, wkQueueManipulator */
	/* eslint no-multi-spaces: off */

	if (document.URL.includes(`extra_study/session`)) {
		modifyStudyQueue();
	} else {
		addLink();
	}

	function modifyStudyQueue() {
		if (sessionStorage.getItem(`extraStudyType`) !== `burnedItems`) return;

		wkQueueManipulator.newQueue = burnedItems();
		sessionStorage.removeItem(`extraStudyType`);
		showStudyType();
	}

	async function showStudyType() {
		await wkQueueManipulator.domReady();
		const studyType = document.getElementById(`menu-bar-title`);
		setTimeout(() => { studyType.textContent = `Extra Study: Burned Items`; }, 100);
		//new MutationObserver(() => { studyType.textContent = `Extra Study: Burned Items`; }).observe(studyType, {subtree: true, characterData: true});
	}

	async function burnedItems() {
		if (!window.wkof) {
			alert(`Extra Study: Burned Items script requires Wanikani Open Framework.`);
			return;
		}

		if (!document.body) await wkQueueManipulator.domElementAvailable(document.documentElement, `body`);

		wkof.include(`ItemData`);
		await wkof.ready(`ItemData`);
		const items = await wkof.ItemData.get_items({wk_items: {filters: {srs: `burn`}}});
		return shuffle(items.map(i => i.id));
	}

	async function addLink() {
		await wkQueueManipulator.domReady();
		const lastButton = await wkQueueManipulator.domElementAvailable(document.getElementsByClassName(`extra-study`)[0], `li:last-of-type`);
		const newButton = lastButton.cloneNode(true);
		const link = newButton.querySelector(`a`) || replaceButtonWithLink(newButton.querySelector(`button`));
		link.href = `https://www.wanikani.com/extra_study/session?title=Recent+Mistakes`;
		link.textContent = `Burned Items`;
		link.addEventListener(`click`, () => {
			sessionStorage.setItem(`extraStudyType`, `burnedItems`);
		});
		lastButton.after(newButton);
	}

	function replaceButtonWithLink(button) {
		const link = document.createElement(`a`);
		link.classList.add(...button.classList);
		link.classList.remove(`pointer-events-none`);
		button.replaceWith(link);
		return link;
	}

	// from https://stackoverflow.com/a/6274381
	function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
})();
