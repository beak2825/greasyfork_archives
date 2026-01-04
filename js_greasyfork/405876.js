// ==UserScript==
// @name SGTools Notifier
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 5.0.1
// @author rafaelgssa
// @description Notifies the user when a SGTools rules check is complete and optionally redirects to the giveaway.
// @match https://www.sgtools.info/*
// @match https://www.steamgifts.com/giveaway/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js?version=821710
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js?version=821769
// @require https://greasyfork.org/scripts/405831-monkey-storage/code/Monkey%20Storage.js?version=821709
// @require https://greasyfork.org/scripts/405840-monkey-wizard/code/Monkey%20Wizard.js?version=821711
// @run-at document-idle
// @grant GM.info
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM_info
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405876/SGTools%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/405876/SGTools%20Notifier.meta.js
// ==/UserScript==

/* global DOM, PersistentStorage, SettingsWizard */

(async () => {
	'use strict';

	const scriptId = 'sgtn';
	const scriptName = GM.info.script.name;

	const schemas = /** @type {WizardSchema[]} */ ([
		{
			type: 'multi',
			id: 'doRedirect',
			message: 'Do you want to be redirected to the giveaway when the check is complete?',
			defaultValue: false,
			choices: [
				{
					id: 'y',
					template: "'%' for yes",
					value: true,
				},
				{
					id: 'n',
					template: "'%' for no",
					value: false,
				},
			],
		},
	]);

	const defaultValues = /** @type {StorageValues} */ ({
		settings: Object.fromEntries(schemas.map((schema) => [schema.id, schema.defaultValue])),
	});

	const isInSgTools = window.location.hostname === 'www.sgtools.info';

	let doRedirect = false;

	/** @type {HTMLElement | null} */
	let checkButton;

	/**
	 * Loads the script.
	 * @returns {Promise<void>}
	 */
	const load = async () => {
		if (!isInSgTools) {
			return removePageUrlFragment();
		}
		checkButton = document.querySelector('#check');
		if (!checkButton) {
			return;
		}
		doRedirect = /** @type {boolean} */ (await PersistentStorage.getSetting('doRedirect'));
		checkButton.addEventListener('click', waitForRulesCheck);
	};

	/**
	 * Removes the fragment from the page URL and notifies the user if exists.
	 */
	const removePageUrlFragment = () => {
		if (window.location.hash !== `#${scriptId}`) {
			return;
		}
		window.history.replaceState(
			'',
			document.title,
			`${window.location.origin}${window.location.pathname}${window.location.search}`
		);
		notifyUser(true);
	};

	/**
	 * Waits until the check is complete and notifies the user.
	 * @returns {Promise<void>}
	 */
	const waitForRulesCheck = async () => {
		if (!checkButton) {
			return;
		}
		const element = await DOM.dynamicQuerySelector('#getlink, #error_alert:not(.hidden)', 60 * 30);
		if (!element) {
			// Rules have not been checked after 30 minutes.
			return;
		}
		if (!element.matches('#getlink')) {
			// User failed to pass the rules.
			return notifyUser(false);
		}
		if (!doRedirect) {
			return notifyUser(true);
		}
		checkButton.removeEventListener('click', waitForRulesCheck);
		checkButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		return waitForGiveawayLink();
	};

	/**
	 * Waits for the giveaway link, redirects to the giveaway and notifies the user.
	 * @returns {Promise<void>}
	 */
	const waitForGiveawayLink = async () => {
		const link = /** @type {HTMLAnchorElement | undefined} */ (await DOM.dynamicQuerySelector(
			'#gaurl a'
		));
		if (link) {
			window.location.href = `${link.href}#${scriptId}`;
		} else {
			notifyUser(true);
		}
	};

	/**
	 * Notifies the user.
	 * @param {boolean} isSuccess Whether the user passed the rules or not.
	 */
	const notifyUser = (isSuccess) => {
		const [emoji, message] = isSuccess
			? ['✔️', 'You passed the rules!']
			: ['❌', 'You failed to pass the rules.'];
		if (isInSgTools) {
			document.title = `${emoji} ${document.title}`;
		}
		if (document.hidden) {
			// Only show a browser notification if the user is away from the tab.
			showBrowserNotification(`${emoji} ${message}`);
		}
	};

	/**
	 * Shows a browser notification.
	 * @param {string} body The message to show.
	 * @return {Promise<void>}
	 */
	const showBrowserNotification = async (body) => {
		if (Notification.permission !== 'granted') {
			await Notification.requestPermission();
		}
		if (Notification.permission === 'granted') {
			new Notification(scriptName, { body });
		}
	};

	try {
		await PersistentStorage.init(scriptId, defaultValues);
		await SettingsWizard.init(scriptId, scriptName, schemas);
		await load();
	} catch (err) {
		console.log(`Failed to load ${scriptName}: `, err);
	}
})();
