// ==UserScript==
// @name Steam Store Redirector
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 5.0.1
// @author rafaelgssa
// @description Redirects removed games from the Steam store to SteamCommunity or SteamDB.
// @match *://*/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js?version=821710
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js?version=821769
// @require https://greasyfork.org/scripts/405831-monkey-storage/code/Monkey%20Storage.js?version=821709
// @require https://greasyfork.org/scripts/405840-monkey-wizard/code/Monkey%20Wizard.js?version=821711
// @run-at document-start
// @grant GM.info
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM_info
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405873/Steam%20Store%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/405873/Steam%20Store%20Redirector.meta.js
// ==/UserScript==

/* global DOM, PersistentStorage, SettingsWizard, Utils */

/**
 * @typedef {DestinationMap[keyof DestinationMap]} Destination
 *
 * @typedef {Object} DestinationMap
 * @property {'0'} STEAM_COMMUNITY
 * @property {'1'} STEAM_DB
 *
 * @typedef {'app' | 'sub'} SteamGameType
 */

(async () => {
	'use strict';

	const scriptId = 'ssr';
	const scriptName = GM.info.script.name;

	const DESTINATIONS = /** @type {DestinationMap} */ ({
		STEAM_COMMUNITY: '0',
		STEAM_DB: '1',
	});

	const DESTINATION_URLS = /** @type {Record<Destination, string>} */ ({
		[DESTINATIONS.STEAM_COMMUNITY]: 'https://steamcommunity.com',
		[DESTINATIONS.STEAM_DB]: 'https://steamdb.info',
	});

	const schemas = /** @type {WizardSchema[]} */ ([
		{
			type: 'multi',
			id: 'destination',
			message: 'Where do you want to be redirected to?',
			defaultValue: DESTINATIONS.STEAM_COMMUNITY,
			choices: [
				{
					id: '0',
					template: "'%' for SteamCommunity",
					value: DESTINATIONS.STEAM_COMMUNITY,
				},
				{
					id: '1',
					template: "'%' for SteamDB",
					value: DESTINATIONS.STEAM_DB,
				},
			],
		},
	]);

	const defaultValues = /** @type {StorageValues} */ ({
		settings: Object.fromEntries(schemas.map((schema) => [schema.id, schema.defaultValue])),
	});

	/** @type {MutationObserver} */
	let observer;

	/**
	 * Loads the script.
	 * @returns {Promise<void> | void}
	 */
	const load = () => {
		const matches = window.location.href.match(
			/^https:\/\/store\.steampowered\.com\/#(app|sub)_(\d+)/
		);
		if (matches) {
			const [, type, id] = matches;
			return redirectGame(/** @type {SteamGameType} */ (type), id);
		}
		removePageUrlFragment();
		checkPageLoaded();
	};

	/**
	 * Redirects a game to the appropriate page.
	 * @param {SteamGameType} type The Steam type of the game.
	 * @param {string} id The Steam ID of the game.
	 * @returns {Promise<void>}
	 */
	const redirectGame = async (type, id) => {
		const destination = /** @type {Destination} */ (await PersistentStorage.getSetting(
			'destination'
		));
		const url = DESTINATION_URLS[destination];
		window.location.href = `${url}/${type}/${id}`;
	};

	/**
	 * Removes the fragment from the page URL.
	 */
	const removePageUrlFragment = () => {
		if (
			window.location.hostname !== 'store.steampowered.com' ||
			(!window.location.hash.includes('#app_') && !window.location.hash.includes('#sub_'))
		) {
			return;
		}
		window.history.replaceState(
			'',
			document.title,
			`${window.location.origin}${window.location.pathname}${window.location.search}`
		);
	};

	/**
	 * Checks if the page is fully loaded.
	 */
	const checkPageLoaded = () => {
		document.removeEventListener('pjax:end', checkPageLoaded);
		document.removeEventListener('turbolinks:load', checkPageLoaded);
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', onPageLoad);
		} else {
			onPageLoad();
		}
	};

	/**
	 * Triggered when the page is fully loaded.
	 */
	const onPageLoad = () => {
		document.removeEventListener('DOMContentLoaded', onPageLoad);
		addUrlFragments(document.body);
		if (observer) {
			observer.disconnect();
		}
		observer = DOM.observeNode(document.body, null, /** @type {NodeCallback} */ (addUrlFragments));
		document.addEventListener('pjax:end', checkPageLoaded);
		document.addEventListener('turbolinks:load', checkPageLoaded);
	};

	/**
	 * Adds the URL fragments to links in a context element.
	 * @param {Element} contextEl The context element where to add the fragments.
	 */
	const addUrlFragments = (contextEl) => {
		if (!(contextEl instanceof Element)) {
			return;
		}
		let wasAdded = false;
		const selectors = [
			'[href*="store.steampowered.com/app/"]',
			'[href*="store.steampowered.com/sub/"]',
		].join(', ');
		if (contextEl.matches(selectors)) {
			wasAdded = addUrlFragment(/** @type {HTMLAnchorElement} */ (contextEl));
		} else {
			const elements = Array.from(
				/** @type {NodeListOf<HTMLAnchorElement>} */ (contextEl.querySelectorAll(selectors))
			);
			wasAdded = elements.filter(addUrlFragment).length > 0;
		}
		if (wasAdded && contextEl === document.body) {
			// Keep adding until there are no more links without the fragments.
			window.setTimeout(addUrlFragments, Utils.ONE_SECOND_IN_MILLI, contextEl);
		}
	};

	/**
	 * Adds the URL fragment to a link, if not already exists.
	 * @param {HTMLAnchorElement} link The link where to add the fragment.
	 * @returns {boolean} Whether the fragment was added or not.
	 */
	const addUrlFragment = (link) => {
		const url = link.getAttribute('href');
		let fragment = link.dataset[scriptId];
		if (!url || (fragment && url.includes(fragment))) {
			return false;
		}
		const matches = url.match(/(app|sub)\/(\d+)/);
		if (!matches) {
			return false;
		}
		const [, type, id] = matches;
		fragment = `#${type}_${id}`;
		link.href = `${url.replace(/#.*/, '')}${fragment}`;
		link.dataset[scriptId] = fragment;
		return true;
	};

	try {
		await PersistentStorage.init(scriptId, defaultValues);
		await SettingsWizard.init(scriptId, scriptName, schemas);
		await load();
	} catch (err) {
		console.log(`Failed to load ${scriptName}: `, err);
	}
})();
