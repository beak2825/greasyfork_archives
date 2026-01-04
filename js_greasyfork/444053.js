// ==UserScript==
// @name         yad2-flags
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds dedicated flag buttons for easier marking of real estate search results. Currently "pin", "done" and "hide" flags are supported. Adding new flags is super easy.
// @author       Dmitry Gurovich
// @license      UNLICENSE
// @website      https://github.com/yrtimiD/yad2-flags-userscript
// @supportURL   https://github.com/yrtimiD/yad2-flags-userscript/issues
// @match        https://www.yad2.co.il/realestate/*
// @match        https://www.yad2.co.il/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yad2.co.il
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444053/yad2-flags.user.js
// @updateURL https://update.greasyfork.org/scripts/444053/yad2-flags.meta.js
// ==/UserScript==

/**
 * Changelog:
 * 0.9 Style fix
 * 0.8 Styling
 * 0.7 Save in the localStorage only flagged entries
 * 0.6 Flags on single item page
 * 0.5 Better icons, moved icons container to the search item start
 */
(function () {
	'use strict';

	const PREFIX = 'yad2flags';

	/**
	 * Defines all available flags.
	 * To add a new flag add a new field in FLAGS and (optionally), declare a new class in the below style block.
	 */
	const FLAGS = {
		save: { icon: 'icon-save', tooltip: 'Save item', class: `${PREFIX}-save` },
		done: { icon: 'icon-done', tooltip: 'Mark item as done', class: `${PREFIX}-done` },
		hidden: { icon: 'icon-hidden', tooltip: 'Hide item', class: `${PREFIX}-hidden` },
	};

	function setupCommonDependencies() {
		const frag = document.createRange().createContextualFragment(`
		<style type="text/css">
			input.${PREFIX}-icon-save {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553l-6-3.428l-6 3.428V4h12v14.553z"/></svg>');
			}

			input:checked.${PREFIX}-icon-save {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 10.132v-6c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2V22l7-4.666L19 22V10.132z"/></svg>');
			}

			input.${PREFIX}-icon-done {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"/></svg>');
			}

			input:checked.${PREFIX}-icon-done {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"/><path fill="currentColor" d="M10.996 12.556L9.7 11.285l-1.4 1.43l2.704 2.647l4.699-4.651l-1.406-1.422z"/></svg>');
			}

			input.${PREFIX}-icon-hidden {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3c1.641 0 3-1.358 3-3c0-1.641-1.359-3-3-3z"/><path fill="currentColor" d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5z"/></svg>');
			}

			input:checked.${PREFIX}-icon-hidden {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19c.946 0 1.81-.103 2.598-.281l-1.757-1.757c-.273.021-.55.038-.841.038c-5.351 0-7.424-3.846-7.926-5a8.642 8.642 0 0 1 1.508-2.297L4.184 8.305c-1.538 1.667-2.121 3.346-2.132 3.379a.994.994 0 0 0 0 .633C2.073 12.383 4.367 19 12 19zm0-14c-1.837 0-3.346.396-4.604.981L3.707 2.293L2.293 3.707l18 18l1.414-1.414l-3.319-3.319c2.614-1.951 3.547-4.615 3.561-4.657a.994.994 0 0 0 0-.633C21.927 11.617 19.633 5 12 5zm4.972 10.558l-2.28-2.28c.19-.39.308-.819.308-1.278c0-1.641-1.359-3-3-3c-.459 0-.888.118-1.277.309L8.915 7.501A9.26 9.26 0 0 1 12 7c5.351 0 7.424 3.846 7.926 5c-.302.692-1.166 2.342-2.954 3.558z"/></svg>');
			}

			.${PREFIX}-button {
				width: 16px;
				height: 16px;
				appearance: none;
				cursor: pointer;
				border-radius: 9px;
				background-color: white;
			}

			.${FLAGS.save.class}{
				outline: red 2px dashed;
			}
			.${FLAGS.done.class}{
				opacity:50%;
				outline: green 2px solid;
			}
			.${FLAGS.hidden.class}{
				opacity:30%;
			}
		</style>`);
		document.querySelector('head').append(frag);
	}

	function setupSearchPageDependencies() {
		const frag = document.createRange().createContextualFragment(`
		<style type="text/css">
			.feeditem {
				display: flex; /* fixes layout for buttons container */
			}

			.${PREFIX}-buttons {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
			}

			.${PREFIX}-button {
				width: 16px;
				height: 16px;
			}
		</style>
		`);
		document.querySelector('head').append(frag);
	}

	function setupItemPageDependencies() {
		const frag = document.createRange().createContextualFragment(`
		<style type="text/css">
			.${PREFIX}-buttons {
				display: inline-block;
				margin-right: 4px;
			}

			.${PREFIX}-button {
				width: 24px;
				height: 24px;
			}
		</style>
		`);
		document.querySelector('head').append(frag);
	}

	function setFlag(flag, id, value) {
		let data = JSON.parse(localStorage.getItem(PREFIX)) ?? {};
		(data[id] = data[id] ?? {})[flag] = value;
		if (Object.values(data[id]).reduce((p, c) => p || c, false) === false) delete data[id];
		localStorage.setItem(PREFIX, JSON.stringify(data));
	}

	function getFlag(flag, id, defaultValue) {
		let data = JSON.parse(localStorage.getItem(PREFIX)) ?? {};
		return data[id]?.[flag] ?? defaultValue;
	}

	function toggleFlag(flag, id, ele, value) {
		console.log(`${id} flagged with ${flag}:${value}`);
		setFlag(flag, id, value);

		if (value === true) {
			ele.classList.add(FLAGS[flag].class);
		} else {
			ele.classList.remove(FLAGS[flag].class);
		}
	}

	/**
	 * @param {string} flag Flag type
	 * @param {string} id Item ID
	 * @param {} container Buttons container element
	 * @param {*} ele Item element (for assigning flagged style)
	 */
	function addButton(flag, id, container, ele) {
		let state = getFlag(flag, id, false);
		let frag = document.createRange().createContextualFragment(`<input type="checkbox"${state ? " checked" : ""} title="${FLAGS[flag].tooltip}" class="${PREFIX}-button ${PREFIX}-icon-${flag}" />`);
		frag.children[0].addEventListener('change', (e) => { toggleFlag(flag, id, ele, e.target.checked); e.stopPropagation(); });
		container.append(frag);
		if (state === true) toggleFlag(flag, id, ele, state);
	}

	function initItemElement(itemElement) {
		if (itemElement.querySelector(`.${PREFIX}-buttons`)) return;
		let id = itemElement.querySelector('[item-id]')?.getAttribute('item-id');
		if (!id) return;

		itemElement.insertAdjacentHTML('afterbegin', `<div class="${PREFIX}-buttons"></div>`);

		let container = itemElement.querySelector(`.${PREFIX}-buttons`);
		Object.keys(FLAGS).forEach(flag => {
			addButton(flag, id, container, itemElement);
		});
	}

	let lastUpdate = 0;
	let pending = null;
	function update() {
		if (Date.now() - lastUpdate < 5000) {
			if (!pending) pending = setTimeout(update, lastUpdate + 5000 - Date.now());
			return;
		}
		lastUpdate = Date.now();
		pending = null;
		document.querySelectorAll('.feed_list .feeditem').forEach(ele => initItemElement(ele));
	}

	function initSearchPageMode() {
		const observer = new MutationObserver(() => update());
		observer.observe(document.body, { childList: true, subtree: true });

		update();
	}

	function initItemPageMode() {
		let id = window.location.pathname.match(/^\/item\/([A-Za-z0-9]+)/)?.[1];
		if (id) {
			document.querySelector('.like_icon_wrapper').insertAdjacentHTML('beforeend', `<div class="${PREFIX}-buttons"></div>`);
			let container = document.querySelector(`.${PREFIX}-buttons`);
			let itemElement = document.querySelector('.top_components');
			Object.keys(FLAGS).forEach(flag => {
				addButton(flag, id, container, itemElement);
				toggleFlag(flag, id, itemElement, getFlag(flag, id, false));
			});
		}
	}

	setupCommonDependencies();
	if (/^\/item\//.test(window.location.pathname)) {
		setupItemPageDependencies();
		initItemPageMode();
	} else {
		setupSearchPageDependencies();
		initSearchPageMode();
	}
})();
