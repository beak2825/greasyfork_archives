// ==UserScript==
// @name         Youtube Music auto dismiss liked song notification
// @license      MIT
// @namespace    https://github.com/tukarsdev
// @homepageURL  https://github.com/tukarsdev/ytmusic-auto-dismiss
// @version      0.6
// @description  Automatically dismiss the liked song notification after some seconds
// @author       tukars
// @icon         https://music.youtube.com/favicon.ico
// @match        https://music.youtube.com/*
// @require      https://update.greasyfork.org/scripts/552301/1676024/Observe.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525198/Youtube%20Music%20auto%20dismiss%20liked%20song%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/525198/Youtube%20Music%20auto%20dismiss%20liked%20song%20notification.meta.js
// ==/UserScript==

const { contextPrint, waitForElement, observeAndHandle } = window.userscript.com.tukars.Observe;

const DISMISS_DELAY_LIKED = 1000;
const DISMISS_DELAY_LIBRARY = 1000;
const DISMISS_DELAY_PLAYLIST = 5000;
const DISMISS_DELAY_GENERAL = 5000;
const DESTROY_DELAY = 2000;
const DESTROY_DELAY_TEXT = 7000;
const ENABLE_DEBUG_LOGGING = false;

const { log, warn, error, info, debug } = contextPrint("YT Music auto dismiss", ENABLE_DEBUG_LOGGING);

function dismissNotification(notification) {
	const dismissButton = notification.querySelector("#button");

	if (!dismissButton) {
		warn("Dismiss button not found");
		return;
	}

	debug("Dismissing notification.");

	const activeElement = document.activeElement;
	debug("Element in focus", activeElement);

	dismissButton.click();

	if (activeElement && activeElement.focus) {
		debug("Restoring focus to element", activeElement);
		activeElement.focus();
	}
}

function destroyNotification(notification) {
	if (!notification.parentNode) {
		warn("Notification element already removed");
		return;
	}

	debug("Destroying notification element.");
	notification.parentNode.removeChild(notification);
}

function getDismissDelay(notification) {
	const textElement = notification.querySelector("#text");

	if (!textElement) {
		warn("Could not find text element.");
		return;
	}

	const textContent = textElement.textContent.toLowerCase()

	if (textContent === "saved to liked music") {
		debug("Saved to liked music notification");
		return DISMISS_DELAY_LIKED;
	} else if (textContent == "added to library") {
		debug("Added to library notification");
		return DISMISS_DELAY_LIBRARY;
	} else if (textContent == "removed from library") {
		debug("Removed from library notification");
		return DISMISS_DELAY_LIBRARY;
	} else if (textContent.startsWith("saved to")) {
		debug("Added to playlist notification");
		return DISMISS_DELAY_PLAYLIST;
	} else if (textContent === "this track is already in the playlist") {
		debug("Already in playlist notification");
		return DISMISS_DELAY_PLAYLIST;
	} else {
		debug(`Text content (not yet matched): "${textContent}"`);
		return DISMISS_DELAY_GENERAL;
	}
}

function handleActionNotification(notification) {
	debug("Action notification detected.");
	setTimeout(() => {
		dismissNotification(notification);
		setTimeout(() => destroyNotification(notification), DESTROY_DELAY, notification);
	}, getDismissDelay(notification));
}

function handleTextNotification(notification) {
	debug("Text notification detected.");
	setTimeout(() => destroyNotification(notification), DESTROY_DELAY_TEXT);
}

(async function () {
	"use strict";
	debug("Auto dismiss is active.");
	const popupContainer = await waitForElement("ytmusic-popup-container");
	observeAndHandle(popupContainer, "ytmusic-notification-action-renderer", handleActionNotification);
	observeAndHandle(popupContainer, "ytmusic-notification-text-renderer", handleTextNotification);
})();