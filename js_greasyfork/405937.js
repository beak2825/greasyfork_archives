// ==UserScript==
// @name GitHub Notifier
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 5.0.0
// @author rafaelgssa
// @description Notifies the user whenever they have new unread notifications on GitHub.
// @match https://github.com/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js?version=821710
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js?version=821769
// @require https://greasyfork.org/scripts/405935-iwc/code/IWC.js?version=819599
// @run-at document-end
// @grant GM.info
// @grant GM_info
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405937/GitHub%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/405937/GitHub%20Notifier.meta.js
// ==/UserScript==

/* global DOM, SJ */

(() => {
	'use strict';

	const scriptId = 'ghn';
	const scriptName = GM.info.script.name;

	const unreadIndicator = '(New) ';

	let doShowBrowserNotifications = false;

	let hasChecked = false;

	let hasUnread = false;

	/**
	 * Loads the script.
	 */
	const load = () => {
		const indicatorEl = document.querySelector('.mail-status');
		if (!indicatorEl) {
			// User is not logged in.
			return;
		}
		SJ.lock(`${scriptId}_lock_browserNotifications`, onBrowserNotificationsLock); // Locks browser notifications so that only one tab shows them.
		check(indicatorEl);
		DOM.observeNode(indicatorEl, { attributes: true }, /** @type {NodeCallback} */ (check));
	};

	/**
	 * Triggered when browser notifications are locked.
	 */
	const onBrowserNotificationsLock = () => {
		console.log(`[${scriptName}] Locked browser notifications!`);
		doShowBrowserNotifications = true;
	};

	/**
	 * Checks for unread notifications and notifies the user.
	 * @param {Element} indicatorEl The element that indicates the notification status.
	 */
	const check = (indicatorEl) => {
		const newValue = indicatorEl.classList.contains('unread');
		if (hasUnread !== newValue) {
			hasUnread = newValue;
			notifyUser();
		}
		hasChecked = true;
	};

	/**
	 * Notifies the user.
	 */
	const notifyUser = () => {
		if (hasUnread) {
			if (!document.title.startsWith(unreadIndicator)) {
				document.title = `${unreadIndicator}${document.title}`;
			}
		} else if (document.title.startsWith(unreadIndicator)) {
			document.title = document.title.slice(unreadIndicator.length);
		}
		if (doShowBrowserNotifications && hasChecked && hasUnread && document.hidden) {
			// Only show a browser notification for subsequent unread notifications if the user is away from the tab.
			showBrowserNotification('You have new unread notifications.');
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
		load();
	} catch (err) {
		console.log(`Failed to load ${scriptName}: `, err);
	}
})();
